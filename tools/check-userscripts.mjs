#!/usr/bin/env node
// 汉化脚本合规检查：语法、头部字段、安全约束、密钥特征。
// 用法：node tools/check-userscripts.mjs [脚本路径...]
// 不带参数时检查 scripts/ 下全部 *.user.js，并扫描根目录和 docs/ 下的 .md 里有没有密钥。
// 这是基于文本规则的把关，宁可误报；它不是安全证明，最终靠代码审阅。
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));

const NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*-zh-cn\.user\.js$/;
const REQUIRED_TAGS = ['name', 'namespace', 'version', 'description', 'license', 'match'];
const BANNED_TAGS = ['require', 'resource', 'connect', 'include'];
const URL_PREFIXES = [
  'https://raw.githubusercontent.com/asiananlee/zh-cn-userscripts/',
  'https://greasyfork.org/',
  'https://update.greasyfork.org/',
];

const BANNED_CODE = [
  [/\bfetch\s*\(/, '网络请求 fetch()'],
  [/new\s+XMLHttpRequest\s*\(/, '网络请求 XMLHttpRequest'],
  [/new\s+WebSocket\s*\(/, '网络连接 WebSocket'],
  [/new\s+EventSource\s*\(/, '网络连接 EventSource'],
  [/sendBeacon\s*\(/, '网络请求 sendBeacon'],
  [/importScripts\s*\(/, '加载外部代码 importScripts'],
  [/\beval\s*\(/, 'eval'],
  [/new\s+Function\s*\(/, 'new Function'],
  [/document\.write(ln)?\s*\(/, 'document.write'],
  [/insertAdjacentHTML\s*\(/, 'insertAdjacentHTML'],
  [/\.(innerHTML|outerHTML)\s*(\+|\|\|)?=(?!=)/, '写入 innerHTML / outerHTML'],
  [/document\.cookie/, '读取 Cookie'],
  [/\bGM[_.]\w+/, 'Tampermonkey 特权接口 GM_* / GM.*'],
  [/\bunsafeWindow\b/, 'unsafeWindow'],
];

const SECRETS = [
  [/sk-or-[\w-]{10,}/, 'OpenRouter 密钥特征'],
  [/\bsk-[A-Za-z0-9_-]{20,}/, 'API 密钥特征 sk-…'],
  [/\bgh[pousr]_[A-Za-z0-9]{30,}/, 'GitHub token 特征'],
  [/\bAKIA[0-9A-Z]{16}\b/, 'AWS 密钥特征'],
];

function parseHeader(src) {
  const m = src.match(/\/\/ ==UserScript==\r?\n([\s\S]*?)\/\/ ==\/UserScript==/);
  if (!m) return null;
  const tags = [];
  for (const line of m[1].split(/\r?\n/)) {
    const t = line.match(/^\/\/\s*@([\w:-]+)\s*(.*?)\s*$/);
    if (t) tags.push([t[1], t[2]]);
  }
  return { tags, end: m.index + m[0].length };
}

function checkMatch(pattern) {
  const m = pattern.match(/^(\*|https?):\/\/([^/]+)\/.*$/);
  if (!m) return `@match 格式不正确：${pattern}`;
  const host = m[2].replace(/^\*\./, '');
  if (host === '*' || (!host.includes('.') && host !== 'localhost')) {
    return `@match 范围过宽，必须精确到目标网站：${pattern}`;
  }
  return null;
}

function checkScript(file) {
  const errors = [];
  const src = readFileSync(file, 'utf8');

  if (!NAME_RE.test(basename(file))) {
    errors.push(`文件名应为「站点英文名-zh-cn.user.js」（小写字母、数字、连字符）：${basename(file)}`);
  }

  const syntax = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (syntax.status !== 0) errors.push(`语法错误：\n${syntax.stderr.trim()}`);

  const header = parseHeader(src);
  if (!header) {
    errors.push('找不到 ==UserScript== 头部');
    return errors;
  }
  const tag = (key) => header.tags.filter(([k]) => k === key).map(([, v]) => v);

  for (const key of REQUIRED_TAGS) {
    const values = tag(key);
    if (!values.length || values.some((v) => !v)) errors.push(`头部缺少 @${key}`);
  }
  const version = tag('version')[0];
  if (version && !/^\d+\.\d+\.\d+$/.test(version)) errors.push(`@version 必须是 主.次.修订 三段数字：${version}`);

  for (const key of BANNED_TAGS) {
    if (tag(key).length) errors.push(`头部不允许使用 @${key}（匹配范围用 @match，不引入外部资源）`);
  }
  const grants = tag('grant');
  if (grants.length !== 1 || grants[0] !== 'none') errors.push('头部必须且只能有一行 @grant none');

  for (const pattern of tag('match')) {
    const problem = checkMatch(pattern);
    if (problem) errors.push(problem);
  }
  for (const key of ['updateURL', 'downloadURL']) {
    for (const url of tag(key)) {
      if (!URL_PREFIXES.some((p) => url.startsWith(p))) errors.push(`@${key} 只能指向本仓库 raw 地址或 greasyfork.org：${url}`);
    }
  }

  const body = src.slice(header.end);
  for (const [re, label] of BANNED_CODE) {
    if (re.test(body)) errors.push(`代码里出现被禁止的写法：${label}`);
  }
  errors.push(...checkSecrets(src));
  return errors;
}

function checkSecrets(text) {
  return SECRETS.filter(([re]) => re.test(text)).map(([, label]) => `疑似包含密钥：${label}`);
}

function listFiles(dir, suffix) {
  return existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(suffix)).map((f) => join(dir, f)) : [];
}

const args = process.argv.slice(2);
const scripts = args.length ? args.map((a) => resolve(a)) : listFiles(join(root, 'scripts'), '.user.js');
const docs = args.length ? [] : [...listFiles(root, '.md'), ...listFiles(join(root, 'docs'), '.md')];

let failed = false;
const report = (file, errors) => {
  const name = file.startsWith(root) ? file.slice(root.length + 1) : file;
  if (!errors.length) return console.log(`✓ ${name}`);
  failed = true;
  console.error(`✗ ${name}`);
  for (const e of errors) console.error(`    - ${e}`);
};

if (!scripts.length) console.log('scripts/ 下还没有脚本，跳过脚本检查');
for (const file of scripts) report(file, checkScript(file));
for (const file of docs) report(file, checkSecrets(readFileSync(file, 'utf8')));

process.exit(failed ? 1 : 0);
