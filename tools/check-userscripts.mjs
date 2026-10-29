#!/usr/bin/env node
// 汉化脚本合规检查，对应 RULES.md 里标为 [自动] 的规则。
// 用法：
//   node tools/check-userscripts.mjs              检查整个仓库（CI 用这个）
//   node tools/check-userscripts.mjs 文件...       只检查指定的脚本
//   node tools/check-userscripts.mjs --base 提交   另外检查：相对该提交改过的脚本必须提高版本号
// 这是基于文本规则的把关，宁可误报；它不是安全证明，最终靠 RULES.md 第 6 节的审查。
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, extname, join, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const REPO = 'https://github.com/asiananlee/zh-cn-userscripts';

const NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*-zh-cn\.user\.js$/;
// RULES.md 3.2：头部字段与顺序固定；@run-at 可选，其余必填。
const TAG_ORDER = ['name', 'namespace', 'version', 'description', 'author', 'license', 'homepageURL', 'supportURL', 'match', 'run-at', 'grant'];
const OPTIONAL_TAGS = ['run-at', 'downloadURL', 'updateURL'];
const FIXED_TAGS = {
  namespace: REPO,
  author: 'asiananlee',
  license: 'MIT',
  homepageURL: REPO,
  supportURL: `${REPO}/issues`,
};
const BANNED_TAGS = ['require', 'resource', 'connect', 'include'];
const URL_PREFIXES = [
  'https://raw.githubusercontent.com/asiananlee/zh-cn-userscripts/',
  'https://greasyfork.org/',
  'https://update.greasyfork.org/',
];
// RULES.md 3.3：开头注释必须包含的项。
const COMMENT_ITEMS = [
  [/最后核对：\d{4}-\d{2}-\d{2}/, '「最后核对：YYYY-MM-DD」'],
  [/覆盖|范围/, '覆盖范围'],
  [/未覆盖/, '已知未覆盖'],
  [/不翻译/, '不翻译的内容'],
  [/\.zhCN\.debug/, '调试开关的键名'],
];

// RULES.md 第 2 节：在去掉注释后的代码里匹配。
const BANNED_CODE = [
  [/\bfetch\s*\(/, '网络请求 fetch()'],
  [/\bXMLHttpRequest\b/, '网络请求 XMLHttpRequest'],
  [/\bWebSocket\b/, '网络连接 WebSocket'],
  [/\bEventSource\b/, '网络连接 EventSource'],
  [/\bsendBeacon\b/, '网络请求 sendBeacon'],
  [/\bimportScripts\b/, '加载外部代码 importScripts'],
  [/\bnew\s+Image\s*\(/, '用图片发请求 new Image()'],
  [/\beval\s*\(/, 'eval'],
  [/new\s+Function\s*\(/, 'new Function'],
  [/document\.write(ln)?\s*\(/, 'document.write'],
  [/insertAdjacentHTML\s*\(/, 'insertAdjacentHTML'],
  [/\.(innerHTML|outerHTML)\s*(\+|\|\|)?=(?!=)/, '写入 innerHTML / outerHTML'],
  [/document\.cookie/, '读取 Cookie'],
  [/\bindexedDB\b/, 'indexedDB'],
  [/\bsessionStorage\b/, 'sessionStorage'],
  [/navigator\s*\.\s*(clipboard|credentials|sendBeacon)/, 'navigator.clipboard / credentials'],
  [/localStorage\s*\.\s*(setItem|removeItem|clear)|localStorage\s*\[/, '写入 localStorage（只允许读调试键）'],
  [/\bGM[_.]\w+/, 'Tampermonkey 特权接口 GM_* / GM.*'],
  [/\bunsafeWindow\b/, 'unsafeWindow'],
];

// RULES.md 第 1 节：全仓库扫描。
const SECRETS = [
  [/sk-or-[\w-]{10,}/, 'OpenRouter 密钥特征'],
  [/\bsk-[A-Za-z0-9_-]{20,}/, 'API 密钥特征 sk-…'],
  [/\bgh[pousr]_[A-Za-z0-9]{30,}/, 'GitHub token 特征'],
  [/\bgithub_pat_[A-Za-z0-9_]{30,}/, 'GitHub token 特征'],
  [/\bAKIA[0-9A-Z]{16}\b/, 'AWS 密钥特征'],
  [/\bxox[abprs]-[A-Za-z0-9-]{10,}/, 'Slack token 特征'],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, '私钥'],
];
const LOCAL_PATHS = [
  [/(^|[\s"'`(])\/Users\/[^\s/"'`)]+/m, 'macOS 用户目录'],
  [/\b[A-Za-z]:\\Users\\/, 'Windows 用户目录'],
  [/(^|[\s"'`(])\/home\/[^\s/"'`)]+/m, 'Linux 家目录'],
  [/\/workspace\/volumes\//, '本机挂载卷'],
];
const ALLOWED_EMAIL = /^(\d+\+)?[A-Za-z0-9-]+@users\.noreply\.github\.com$|^noreply@(anthropic|github)\.com$/i;
const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}/g;
// RULES.md 1.6：采集阶段的中间产物不进仓库。
// 与 .gitignore 同步；这里是第二道防线，防止有人用 git add -f 强行加入。
const FORBIDDEN_FILES = [
  /(^|\/)01-sitemap\.md$/, /(^|\/)02-strings\//, /(^|\/)02-summary\.md$/, /(^|\/)03-residual\.json$/, /(^|\/)03-translations\.tsv$/,
  /(^|\/)04-[^/]*\.json$/, /(^|\/)04-screenshots\//, /(^|\/)coverage-report[^/]*\.md$/, /(^|\/)glossary\.md$/,
  /\.har$/i, /\.log$/i, /(^|\/)\.env(\.|$)/, /\.(pem|key)$/i,
];
const TEXT_EXT = new Set(['.md', '.js', '.mjs', '.cjs', '.json', '.yml', '.yaml', '.txt', '.html', '.css', '']);

function parseHeader(src) {
  const m = src.match(/^\/\/ ==UserScript==\r?\n([\s\S]*?)\/\/ ==\/UserScript==/);
  if (!m) return null;
  const tags = [];
  for (const line of m[1].split(/\r?\n/)) {
    const t = line.match(/^\/\/\s*@([\w:-]+)\s*(.*?)\s*$/);
    if (t) tags.push([t[1], t[2]]);
  }
  return { tags, end: m.index + m[0].length };
}

// 去掉注释，并清空字符串和正则字面量的内容（保留引号），
// 这样词典里的英文和说明文字不会被当成代码调用。
// keepStrings 为 true 时保留字符串内容，用于读取 localStorage 的键名。
function codeOnly(code, keepStrings = false) {
  let out = '', i = 0, quote = null, regexOk = true;
  while (i < code.length) {
    const c = code[i], d = code[i + 1];
    if (quote) {
      if (c === '\\') { if (keepStrings) out += c + (d ?? ''); i += 2; continue; }
      if (c === quote) { quote = null; out += c; } else if (keepStrings || c === '\n') out += c;
      i++; continue;
    }
    if (c === '/' && d === '/') { while (i < code.length && code[i] !== '\n') i++; continue; }
    if (c === '/' && d === '*') { const e = code.indexOf('*/', i + 2); i = e < 0 ? code.length : e + 2; out += ' '; continue; }
    if (c === '"' || c === "'" || c === '`') { quote = c; out += c; i++; regexOk = false; continue; }
    if (c === '/' && regexOk) {
      let j = i + 1, inClass = false;
      while (j < code.length && code[j] !== '\n') {
        if (code[j] === '\\') { j += 2; continue; }
        if (code[j] === '[') inClass = true; else if (code[j] === ']') inClass = false;
        else if (code[j] === '/' && !inClass) break;
        j++;
      }
      out += '/ /'; i = j + 1; regexOk = false; continue;
    }
    out += c;
    if (!/\s/.test(c)) regexOk = /[(,=:[!&|?{};+\-*%<>~^]/.test(c) || /\b(return|typeof|case|in|of)$/.test(out);
    i++;
  }
  return out;
}

function checkMatch(pattern) {
  const m = pattern.match(/^(\*|https?):\/\/([^/]+)\/.*$/);
  if (!m) return `@match 格式不正确：${pattern}`;
  const host = m[2].replace(/^\*\./, '');
  if (host === '*' || (!host.includes('.') && host !== 'localhost')) return `@match 范围过宽，必须精确到目标网站：${pattern}`;
  return null;
}

function site(file) { return basename(file).replace(/-zh-cn\.user\.js$/, ''); }

function checkScript(file) {
  const errors = [];
  const src = readFileSync(file, 'utf8');

  if (!NAME_RE.test(basename(file))) errors.push(`文件名应为「站点英文名-zh-cn.user.js」（小写字母、数字、连字符）：${basename(file)}`);

  const syntax = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (syntax.status !== 0) errors.push(`语法错误：\n${syntax.stderr.trim()}`);

  const header = parseHeader(src);
  if (!header) return [...errors, '文件必须以 ==UserScript== 头部开头'];
  const tag = (key) => header.tags.filter(([k]) => k === key).map(([, v]) => v);

  for (const key of TAG_ORDER) {
    if (OPTIONAL_TAGS.includes(key)) continue;
    const values = tag(key);
    if (!values.length || values.some((v) => !v)) errors.push(`头部缺少 @${key}`);
    else if (key !== 'match' && values.length > 1) errors.push(`头部 @${key} 只能有一行`);
  }
  for (const [key, value] of Object.entries(FIXED_TAGS)) {
    const v = tag(key)[0];
    if (v && v !== value) errors.push(`@${key} 必须是 ${value}，现在是 ${v}`);
  }
  // 多行 @match 视为一个字段；只比较固定字段之间的先后。
  const order = [...new Set(header.tags.map(([k]) => k).filter((k) => TAG_ORDER.includes(k)))];
  const expected = TAG_ORDER.filter((k) => order.includes(k));
  if (order.join() !== expected.join()) errors.push(`头部字段顺序应为 ${expected.map((k) => '@' + k).join(' → ')}`);
  const version = tag('version')[0];
  if (version && !/^\d+\.\d+\.\d+$/.test(version)) errors.push(`@version 必须是 主.次.修订 三段数字：${version}`);
  for (const key of BANNED_TAGS) if (tag(key).length) errors.push(`头部不允许使用 @${key}`);
  const grants = tag('grant');
  if (grants.length !== 1 || grants[0] !== 'none') errors.push('头部必须且只能有一行 @grant none');
  for (const pattern of tag('match')) { const p = checkMatch(pattern); if (p) errors.push(p); }
  for (const key of ['updateURL', 'downloadURL']) {
    for (const url of tag(key)) if (!URL_PREFIXES.some((p) => url.startsWith(p))) errors.push(`@${key} 只能指向本仓库 raw 地址或 greasyfork.org：${url}`);
  }

  const rest = src.slice(header.end);
  const comment = rest.match(/^\s*\/\*([\s\S]*?)\*\//);
  if (!comment) errors.push('头部后面必须紧跟一段 /* … */ 开头注释（RULES.md 3.3）');
  else {
    for (const [re, label] of COMMENT_ITEMS) if (!re.test(comment[1])) errors.push(`开头注释缺少：${label}`);
    const key = `${site(file)}.zhCN.debug`;
    if (!comment[1].includes(key)) errors.push(`开头注释里的调试键名应为 ${key}`);
  }

  const code = codeOnly(rest);
  for (const [re, label] of BANNED_CODE) if (re.test(code)) errors.push(`代码里出现被禁止的写法：${label}`);
  // createElement 的标签名在字符串里，单独用保留字符串的版本查。
  const withStrings = codeOnly(rest, true);
  if (/createElement\s*\(\s*['"`](script|iframe|img|link)\b/i.test(withStrings)) errors.push('代码里出现被禁止的写法：动态创建 script / iframe / img / link 元素');
  for (const m of withStrings.matchAll(/localStorage\s*\.\s*getItem\s*\(\s*(['"`])([^'"`]*)\1/g)) {
    if (m[2] !== `${site(file)}.zhCN.debug`) errors.push(`localStorage 只允许读 ${site(file)}.zhCN.debug，现在读的是 ${m[2]}`);
  }
  if (/localStorage\s*\.\s*getItem\s*\(\s*[^'"`\s]/.test(code)) errors.push('localStorage.getItem 的键名必须是字面量');
  if (/\bset(Timeout|Interval)\s*\(\s*['"`]/.test(code)) errors.push('代码里出现被禁止的写法：字符串形式的 setTimeout / setInterval');

  if (!existsSync(join(root, 'docs', `${site(file)}-coverage.md`))) errors.push(`缺少覆盖报告 docs/${site(file)}-coverage.md`);
  const readme = existsSync(join(root, 'README.md')) ? readFileSync(join(root, 'README.md'), 'utf8') : '';
  if (!readme.includes(basename(file))) errors.push(`README.md 的脚本表里没有 ${basename(file)}`);
  return errors;
}

function checkPrivacy(text) {
  const errors = [];
  for (const [re, label] of SECRETS) if (re.test(text)) errors.push(`疑似包含密钥：${label}`);
  for (const [re, label] of LOCAL_PATHS) if (re.test(text)) errors.push(`包含本机路径：${label}`);
  const emails = [...new Set(text.match(EMAIL_RE) || [])].filter((e) => !ALLOWED_EMAIL.test(e));
  if (emails.length) errors.push(`包含邮箱（只允许 GitHub noreply 地址）：${emails.length} 个，第一个以 ${emails[0].slice(0, 2)}… 开头`);
  return errors;
}

// RULES.md 1.7：截图不能带元数据（设备、时间、路径、软件）。
// JPEG 只允许 JFIF、ICC 色彩配置和图像数据段；PNG 不允许文字块和 EXIF 块。
function checkImage(file) {
  const b = readFileSync(file);
  const ext = extname(file).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg') {
    for (let i = 2; i < b.length - 4 && b[i] === 0xff; ) {
      const m = b[i + 1];
      if (m === 0xda) return [];
      if ((m >= 0xe1 && m <= 0xef && m !== 0xe2) || m === 0xfe) return [`图片含元数据段 0x${m.toString(16)}（EXIF、XMP 或注释），请去掉后再提交`];
      i += 2 + b.readUInt16BE(i + 2);
    }
    return [];
  }
  if (ext === '.png') {
    for (let i = 8; i < b.length - 8; ) {
      const len = b.readUInt32BE(i), type = b.toString('latin1', i + 4, i + 8);
      if (['tEXt', 'zTXt', 'iTXt', 'eXIf'].includes(type)) return [`图片含元数据块 ${type}，请去掉后再提交`];
      if (type === 'IEND') return [];
      i += 12 + len;
    }
    return [];
  }
  return ext === '.webp' || ext === '.gif' ? [`请用 JPG 或 PNG，检查工具不解析 ${ext}`] : [];
}

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === '.git' || name === 'node_modules') continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
}

function git(...args) { return spawnSync('git', args, { cwd: root, encoding: 'utf8' }); }

function checkVersionBumps(base) {
  const errors = [];
  const diff = git('diff', '--name-only', base, '--', 'scripts');
  if (diff.status !== 0) return [`无法与 ${base} 比较：${diff.stderr.trim()}`];
  for (const rel of diff.stdout.split('\n').filter((f) => f.endsWith('.user.js'))) {
    const now = existsSync(join(root, rel)) ? readFileSync(join(root, rel), 'utf8') : null;
    const before = git('show', `${base}:${rel}`);
    if (!now || before.status !== 0) continue;
    const v = (s) => (parseHeader(s)?.tags.find(([k]) => k === 'version') || [])[1] || '0.0.0';
    const [a, b] = [v(before.stdout), v(now)];
    const [x, y] = [a, b].map((s) => s.split('.').map(Number));
    const i = y.findIndex((part, k) => part !== x[k]);
    if (i < 0 || y[i] < x[i]) errors.push(`${rel} 有改动，但 @version 没有提高（${a} → ${b}）`);
  }
  return errors;
}

const argv = process.argv.slice(2);
const baseAt = argv.indexOf('--base');
const base = baseAt >= 0 ? argv.splice(baseAt, 2)[1] : null;
const only = argv.map((a) => resolve(a));

let failed = false;
const report = (name, errors) => {
  if (!errors.length) return console.log(`✓ ${name}`);
  failed = true;
  console.error(`✗ ${name}`);
  for (const e of errors) console.error(`    - ${e}`);
};

if (only.length) {
  for (const file of only) report(relative(root, file) || file, [...checkScript(file), ...checkPrivacy(readFileSync(file, 'utf8'))]);
} else {
  const files = walk(root);
  const scripts = files.filter((f) => f.startsWith(join(root, 'scripts')) && f.endsWith('.user.js'));
  if (!scripts.length) console.log('scripts/ 下还没有脚本，跳过脚本检查');
  for (const file of scripts) report(relative(root, file), checkScript(file));

  const tracked = git('ls-files').stdout.split('\n').filter(Boolean);
  const bad = tracked.filter((f) => FORBIDDEN_FILES.some((re) => re.test(f)));
  report('禁止入库的文件', bad.map((f) => `不应提交：${f}`));

  const privacy = [];
  for (const file of files) {
    if (!TEXT_EXT.has(extname(file))) continue;
    for (const e of checkPrivacy(readFileSync(file, 'utf8'))) privacy.push(`${relative(root, file)}：${e}`);
  }
  report('全仓库隐私扫描', privacy);

  const images = files.filter((f) => /\.(jpe?g|png|webp|gif)$/i.test(f));
  const outside = images.filter((f) => !relative(root, f).replace(/\\/g, '/').startsWith('docs/images/'));
  report('截图', [
    ...outside.map((f) => `截图只能放在 docs/images/：${relative(root, f)}`),
    ...images.flatMap((f) => checkImage(f).map((e) => `${relative(root, f)}：${e}`)),
  ]);

  const authors = git('log', '--format=%ae%n%ce', '--no-merges', 'bef3848..HEAD');
  const badAuthors = [...new Set(authors.stdout.split('\n').filter(Boolean))].filter((e) => !ALLOWED_EMAIL.test(e));
  report('提交作者邮箱', badAuthors.map((e) => `提交记录里有非 noreply 邮箱，以 ${e.slice(0, 2)}… 开头`));
}
if (base) report(`版本号（相对 ${base}）`, checkVersionBumps(base));

process.exit(failed ? 1 : 0);
