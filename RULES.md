# 项目规则

本仓库所有工作（新增脚本、修改译文、审查、发布）都按这份规则执行。这是**唯一的规则来源**：`AGENTS.md`、`CLAUDE.md`、`CONTRIBUTING.md` 只引用这里，不另立规则。规则有冲突时，以本文件为准；本文件需要改，先改本文件，再改其他文件。

规则分两种：**[自动]** 由 `tools/check-userscripts.mjs` 在本地和 CI 拦截；**[审查]** 靠人工或 AI 审查对照下面的清单逐条确认。

## 1. 隐私：任何时候都不能出现在仓库里的东西

仓库是公开的，Git 历史是永久的。一旦推送，删文件也删不掉历史。

1. **[自动]** 不提交 API 密钥、token、密码、Cookie、私钥。
2. **[自动]** 不提交真实邮箱。唯一允许出现的邮箱是 GitHub 的 noreply 地址（`…@users.noreply.github.com`）和 `noreply@anthropic.com`。
3. **[自动]** 不提交本机路径：macOS 和 Windows 的用户目录、本机挂载卷、Linux 的家目录。规则文件和文档里需要提到工作目录时，写“本仓库根目录”，不写绝对路径。
4. **[审查]** 不提交维护者的真实姓名、电话、住址、公司和其他项目的名称、内部工作目录名、服务器地址。
5. **[审查]** 不提交账户数据：账号 ID、订单号、余额、发票号、域名、服务器名、IP、用户名、邮件主题和正文。词典里遇到这类动态值，一律写成占位符（见第 3 节）。
6. **[自动]** 不提交采集阶段的中间产物（`02-strings/`、`03-residual.json`、`*.har`、`01-sitemap.md`、浏览器自动化脚本）。它们含有真实页面内容，只留在本机工作目录。
7. **[自动]** 截图只能放在 `docs/images/`，只用 JPG 或 PNG，不能带元数据（EXIF、XMP、注释、PNG 文字块）。**[审查]** 必须是空白表单或空状态，不含账户区、头像、邮箱、密钥、余额，提交前逐张打开看。
8. **[自动]** 提交作者必须是 noreply 地址。本仓库的本地 Git 身份固定为：`user.name = asiananlee`，`user.email = 248271261+asiananlee@users.noreply.github.com`。
9. **[审查]** Issue、PR、提交信息、覆盖报告里同样不出现以上任何内容。

## 2. 安全：脚本的固定约束

汉化脚本运行在含有密钥和账单的页面上。以下约束对每个脚本都一样，没有例外。

**头部 [自动]**

- 必须且只能有一行 `@grant none`。
- 不能使用 `@require`、`@resource`、`@connect`、`@include`。`@match` 必须精确到目标网站，不能是 `*://*/*`、主机为 `*` 或 `*.com`。
- `@downloadURL`、`@updateURL` 只能指向本仓库的 raw 地址或 greasyfork.org。
- `@namespace` 固定为 `https://github.com/asiananlee/zh-cn-userscripts`，`@author` 固定为 `asiananlee`，`@license` 固定为 `MIT`。

**代码 [自动]**

- 不发网络请求：`fetch`、`XMLHttpRequest`、`WebSocket`、`EventSource`、`sendBeacon`、`importScripts`、`new Image().src`、动态创建 `<script>`。
- 不执行字符串代码：`eval`、`new Function`、字符串形式的 `setTimeout`/`setInterval`。
- 不写入 HTML：`innerHTML`、`outerHTML`、`insertAdjacentHTML`、`document.write`。
- 不碰身份数据：`document.cookie`、`indexedDB`、`sessionStorage`、`navigator.clipboard`、`navigator.credentials`。
- 不用 Tampermonkey 特权接口：`GM_*`、`GM.*`、`unsafeWindow`。
- `localStorage` 只允许读一个键：`站点名.zhCN.debug`。不允许写任何键。

**行为 [审查]**

- 只改两样东西：文本节点的 `nodeValue`，以及白名单属性（`placeholder`、`title`、`aria-label`、`alt`、`aria-description`，按钮型 `input` 的 `value`，以及该站点实际用到、在脚本里写明的提示属性）。不新增、不删除、不移动任何元素，不改样式，不改事件。
- 不读、不改用户输入：普通 `input` 和 `textarea` 的值、可编辑区域。
- 危险操作（删除、撤销、归档、付款、清空、停用）的按钮和确认文案，译文含义必须与原文完全一致，不能弱化。译错这类文案按安全问题处理（见 `SECURITY.md`）。

**调试输出 [审查]**

- 默认关闭，只能由 `localStorage` 的 `站点名.zhCN.debug` 设为 `'1'` 打开。
- 只能在控制台打印“词典没有命中的界面文案”，打印前必须脱敏：网址、邮箱、长串、数字、金额、日期替换为占位符；资源名、人名、域名等页面上的自由文本，凡是能识别的位置都要替换。
- 不能打印用户输入、邮件或日志正文、密钥，不能把结果写入任何存储或发出去。
- 条目数量必须设上限（不超过 100 条）。

## 3. 每个脚本的固定模式

### 3.1 文件

- 路径：`scripts/站点英文名-zh-cn.user.js`，只用小写字母、数字和连字符。**[自动]**
- 一个站点一个文件，单文件可直接安装，不引入构建工具和依赖。
- 每个脚本必须有对应的覆盖报告 `docs/站点英文名-coverage.md`，README 的脚本表里必须有对应的一行。**[自动]**

### 3.2 头部（字段和顺序固定）

```js
// ==UserScript==
// @name         站点名 简体中文
// @namespace    https://github.com/asiananlee/zh-cn-userscripts
// @version      0.1.0
// @description  站点名 控制台的简体中文界面；保留用户内容、代码和凭据。
// @author       asiananlee
// @license      MIT
// @homepageURL  https://github.com/asiananlee/zh-cn-userscripts
// @supportURL   https://github.com/asiananlee/zh-cn-userscripts/issues
// @match        https://精确域名/*
// @run-at       document-start
// @grant        none
// ==/UserScript==
```

- `@run-at` 默认 `document-start`；改用其他值要在开头注释里写明理由。
- 发布前不写 `@updateURL` 和 `@downloadURL`。要不要加由维护者决定：加了之后，`main` 上的每次改动都会自动推到所有已安装的用户。

### 3.3 开头注释（紧跟头部，必须有这些项）

- `最后核对：YYYY-MM-DD`
- 覆盖范围：哪些页面、哪个子域名
- 已知未覆盖：跨域 iframe、Toast、需要真实数据的状态等
- 不翻译的内容：用户数据、代码、凭据等
- 调试开关的键名和开关方法

注释里不写生成过程、工作目录、内部文件名、“按用户交付约定”之类的内部记录。

### 3.4 代码结构（从上到下）

1. **公共词典**：`COMMON_EXACT`（精确词条）、`COMMON_RULES`（锚定模板）
2. **页面分区** `SCOPES`：每个分区有 `id`、`slug`、`path`（路径正则）、`exact`、`rules`、`overrides`（本页覆盖公共译法）、`fragments`（碎片句子）。分区前一行注释写明 id、slug 和路径。
3. **配置**：`ATTRS`（属性白名单）、`BLOCK`（跳过区域的选择器）
4. **引擎**：匹配、跳过判断、写入、调试输出、`MutationObserver`、路由监听

### 3.5 匹配规则

- 精确匹配：文本节点的完整规范化文本（去首尾空白、合并连续空白）查词典，命中后保留原有首尾空白。
- 模板：含动态值的句子用占位符，编译为带 `^` 和 `$` 的正则。占位符统一为 `{n}`、`{amount}`、`{date}`、`{user}`、`{domain}`、`{email}`、`{url}`、`{id}`、`{token}`、`{ip}`，新站点需要新占位符时先加进本节。
- 碎片句子：只有父元素的完整原句和文本节点数量都匹配时，才逐个改写文本节点。
- **禁止**对页面文本做子串替换，禁止用整段 `textContent` 覆盖含子元素的节点。
- 查找顺序：页面覆盖 → 页面精确 → 公共精确 → 页面模板 → 公共模板。

### 3.6 必须跳过的区域

`script`、`style`、`noscript`、`code`、`pre`、`kbd`、`textarea` 的内容、`iframe`、可编辑区域，以及该站点的用户内容和第三方内容（邮件正文、日志、资源名、模型名等）。

本机常见的翻译扩展会往页面插入自己的元素，脚本应跳过这些元素，避免互相干扰。已知的有 `read-frog`（陪读蛙）。这类选择器保留在 `BLOCK` 里，并在本节登记。

### 3.7 版本号

`主.次.修订`：只改译文或补漏 → 修订号 +1；覆盖了新页面 → 次版本号 +1；引擎结构大改 → 主版本号 +1。**脚本文件有任何改动都必须提高版本号**，否则用户的 Tampermonkey 收不到更新。**[自动]**

## 4. 翻译

译法、标点、术语以 `docs/style-guide.md` 为准。新增或修改的英文必须来自真实页面，不凭记忆补，不从中文反推英文。

## 5. 新站点的流程

按顺序，不跳步：

1. **立项**：确认官方没有中文界面，开 Issue 或在 `docs/` 登记。
2. **采集**：在本机工作目录（仓库之外）做勘察和逐页逐状态采集。中间产物不进仓库。
3. **制作**：按第 3 节的固定模式写脚本。
4. **闭环验证**：装上脚本重放每个页面状态，扫描残留英文，补词典，直到残留为 0 或剩余项都归入“豁免”或“无法覆盖”。
5. **覆盖报告**：写 `docs/站点英文名-coverage.md`，结构参照 `docs/postmark-coverage.md`。未验证的内容如实标注，不写成已覆盖。
6. **审查**：按第 6 节逐条过一遍。
7. **发布**：维护者批准后推送（第 7 节）。

可以用 `docs/new-site-prompts.md` 里的提示词让 AI 完成第 2 到第 5 步，但第 6、7 步必须由维护者确认。

## 6. 审查清单

每次提交前，按顺序逐条确认。任何一条不满足就不提交。

**A. 自动检查**

- [ ] `node tools/check-userscripts.mjs` 全部通过

**B. 隐私（第 1 节）**

- [ ] 改动的文件里没有真实邮箱、密钥、本机路径、内部目录名、账户数据
- [ ] 新增的截图逐张打开看过，没有账户区、头像、邮箱、密钥、余额
- [ ] 提交作者是 noreply 地址

**C. 安全（第 2 节）**

- [ ] 脚本只改 `nodeValue` 和白名单属性，没有新增元素、样式、事件
- [ ] 没有读写用户输入
- [ ] 调试输出仍然默认关闭、有上限、经过脱敏
- [ ] 危险操作相关的译文逐条对照原文，含义一致

**D. 固定模式（第 3 节）**

- [ ] 头部字段和顺序与模板一致
- [ ] 开头注释的“最后核对”日期已更新
- [ ] 脚本有改动时版本号已提高
- [ ] 覆盖报告和 README 脚本表已同步

**E. 诚实**

- [ ] 覆盖报告、README、提交信息里没有把未验证的内容写成已验证
- [ ] 数字（词条数、页面数、状态数）是从文件里实际数出来的，不是抄来的

## 7. Git 与发布

- 只在维护者指定的那一份本地克隆里改，不维护第二份可编辑的副本。其他地方的副本一律视为过期。
- **不经维护者明确同意，不推送**，不建 tag，不发 Release，不改仓库设置。
- 不强制推送（`--force`），不改写已推送的历史。
- 提交信息格式：`范围: 做了什么`，范围用 `站点英文名`、`docs`、`tools`、`仓库` 之一。例如 `postmark: 修正账单页译文`。
- 推送后确认：CI 通过；改过的脚本 raw 地址返回 200，内容与本地一致。

## 8. 完成的定义

一次改动只有同时满足以下条件才算完成：审查清单全部通过；CI 通过；文档与实际行为一致；仓库里没有任何私人信息；`git status` 只显示有意的改动。
