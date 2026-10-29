# 脚本规范

本仓库每个汉化脚本，连同 README 脚本表里它的那一行，都按这份规范写。译法另见 [翻译规范](style-guide.md)。

规则分两种：
- **[自动]**：由 [`tools/check-userscripts.mjs`](../tools/check-userscripts.mjs) 在本地和 CI 里拦截。
- **[审查]**：靠人工对照第 5 节的清单逐条确认。

## 1. 隐私：不能进仓库的东西

仓库是公开的，Git 历史是永久的。一旦推送，删掉文件也删不掉历史。

1. **[自动]** 不提交 API 密钥、token、密码、Cookie、私钥。
2. **[自动]** 不提交邮箱。只允许出现 GitHub 的 noreply 地址（`…@users.noreply.github.com`）、`noreply@github.com` 和 `noreply@anthropic.com`。
3. **[自动]** 不提交本机路径：macOS 和 Windows 的用户目录、挂载卷、Linux 的家目录。
4. **[审查]** 不提交任何人的真实姓名、电话、住址、公司名称和服务器地址。
5. **[审查]** 不提交账户数据：账号 ID、订单号、余额、发票号、域名、服务器名、IP、用户名、邮件主题和正文。词典里遇到这类动态值，一律写成占位符（见 3.5）。
6. **[自动]** 不提交采集和验证阶段的产物：站点地图、逐页采集的文本、残留扫描结果、覆盖报告、HAR 文件、日志。它们含有真实页面内容，只留在本机。
7. **[自动]** 不提交图片，包括截图和配图（JPG、PNG、GIF、WebP、SVG 等），README 里也不放图片（构建状态和许可证徽章除外）。
8. **[审查]** Issue、PR、提交信息里，同样不能出现以上任何内容。Issue 里附截图前，先遮住个人信息。

提交记录里的邮箱会公开。建议在 GitHub 的 Settings → Emails 里开启邮箱隐私，用 noreply 地址提交。

## 2. 安全：每个脚本都一样的约束

汉化脚本运行在有密钥和账单的页面上。以下约束对每个脚本都一样，没有例外。

**头部 [自动]**

- 必须有一行 `@grant none`，也只能有这一行 `@grant`。
- 不能使用 `@require`、`@resource`、`@connect`、`@include`。
- `@match` 必须精确到目标网站，不能是 `*://*/*`，主机也不能是 `*` 或 `*.com`。
- `@downloadURL`、`@updateURL` 只能指向本仓库的 raw 地址或 greasyfork.org。
- `@namespace` 固定为 `https://github.com/asiananlee/zh-cn-userscripts`，`@author` 固定为 `asiananlee`，`@license` 固定为 `MIT`。

**代码 [自动]**

- 不发网络请求：`fetch`、`XMLHttpRequest`、`WebSocket`、`EventSource`、`sendBeacon`、`importScripts`、`new Image()`，不动态创建 `<script>`、`<iframe>`、`<img>`、`<link>`。
- 不执行字符串代码：`eval`、`new Function`、字符串形式的 `setTimeout` 和 `setInterval`。
- 不写入 HTML：`innerHTML`、`outerHTML`、`insertAdjacentHTML`、`document.write`。
- 不碰身份数据：`document.cookie`、`indexedDB`、`sessionStorage`、`navigator.clipboard`、`navigator.credentials`。
- 不用 Tampermonkey 特权接口：`GM_*`、`GM.*`、`unsafeWindow`。
- `localStorage` 只允许读一个键 `站点英文名.zhCN.debug`，不允许写任何键。

**行为 [审查]**

- 只改两样东西：
  - 文本节点的 `nodeValue`；
  - 白名单属性：`placeholder`、`title`、`aria-label`、`alt`、`aria-description`、按钮型 `input` 的 `value`，以及该站点实际用到、并在脚本里写明的提示属性。

  不新增、不删除、不移动任何元素，不改样式，不改事件。
- 不读、不改用户输入：普通 `input` 和 `textarea` 的值、可编辑区域。
- 危险操作的按钮和确认文案，译文含义必须与原文完全一致，不能弱化。危险操作包括删除、撤销、归档、付款、清空、停用。这类文案译错，按安全问题处理（见 [安全政策](../SECURITY.md)）。

**调试输出 [审查]**

- 默认关闭。只有把 `localStorage` 的 `站点英文名.zhCN.debug` 设为 `'1'` 才打开。
- 只能在控制台打印「词典没有命中的界面文字」，打印前必须脱敏：
  - 网址、邮箱、长串、数字、金额、日期，换成占位符；
  - 资源名、人名、域名等页面上的自由文本，凡是能识别出位置的，都要换掉。
- 不能打印用户输入、邮件或日志正文、密钥。不能把结果写入任何存储，也不能发出去。
- 条目数量必须有上限，不超过 100 条。

## 3. 固定模式

### 3.1 文件

- 路径是 `scripts/站点英文名-zh-cn.user.js`，只用小写字母、数字和连字符。**[自动]**
- 一个站点一个文件。单个文件就能直接安装，不引入构建工具和依赖。
- 每个脚本在 README 的脚本表里都要有一行（第 4 节）。**[自动]**

### 3.2 头部

字段和顺序固定，**[自动]**：

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

- `@run-at` 默认用 `document-start`。改用其他值，要在开头注释里写明理由。
- 只有维护者决定之后，才加 `@updateURL` 和 `@downloadURL`。

### 3.3 开头注释

开头注释紧跟在头部后面，必须包含下面这些项，**[自动]**：

- `最后核对：YYYY-MM-DD`
- 覆盖范围：哪些页面，哪个子域名
- 已知未覆盖：跨域 iframe、Toast、需要真实数据的状态等
- 不翻译的内容：用户数据、代码、凭据等
- 调试开关的键名，以及怎么打开、怎么关闭

这段注释是用户了解覆盖范围和已知缺口的公开位置。**[审查]**
- 要如实写清楚，没验证过的不写成已覆盖。
- 不写生成过程、工作目录和内部文件名。

### 3.4 代码结构

从上到下依次是：

1. **公共词典**：`COMMON_EXACT`（精确词条）、`COMMON_RULES`（锚定模板）。
2. **页面分区** `SCOPES`。每个分区有这些字段：
   - `id`、`slug`、`path`（路径正则）
   - `exact`、`rules`
   - `overrides`：在本页覆盖公共译法
   - `fragments`：碎片化的句子

   分区前一行写注释，注明 `id`、`slug` 和路径。
3. **配置**：`ATTRS`（属性白名单）、`BLOCK`（要跳过的区域的选择器）。
4. **引擎**：匹配、跳过判断、写入、调试输出、`MutationObserver`、路由监听。

### 3.5 匹配规则

- **精确匹配**：取文本节点规范化后的完整文本（去首尾空白、合并连续空白）去查词典；命中后保留原有的首尾空白。
- **模板**：含动态值的句子用占位符，编译成带 `^` 和 `$` 的正则。
  - 占位符统一用 `{n}`、`{amount}`、`{date}`、`{user}`、`{domain}`、`{email}`、`{url}`、`{id}`、`{token}`、`{ip}`。
  - 新站点需要新的占位符时，先加进本节。
- **碎片句子**：父元素的完整原句和文本节点数量都对上了，才逐个改写文本节点。
- **禁止**对页面文本做子串替换，也禁止用整段 `textContent` 覆盖含子元素的节点。
- 查找顺序：页面覆盖 → 页面精确 → 公共精确 → 页面模板 → 公共模板。

### 3.6 必须跳过的区域

- 这些元素的内容：`script`、`style`、`noscript`、`code`、`pre`、`kbd`、`textarea`、`iframe`，以及可编辑区域。
- 该站点的用户内容和第三方内容：邮件正文、日志、资源名、模型名等。

常见的网页翻译扩展会往页面里插入自己的元素，脚本要跳过它们，避免互相干扰。目前已知的有 `read-frog`（陪读蛙）。这类选择器放在 `BLOCK` 里，并登记在本节。

### 3.7 版本号

格式是 `主.次.修订`：

- 只改译文或补漏：修订号 +1。
- 覆盖了新页面：次版本号 +1。
- 引擎结构大改：主版本号 +1。

**脚本文件有任何改动，都必须提高版本号**，否则用户的 Tampermonkey 收不到更新。**[自动]**

## 4. README 的脚本表

README 的「脚本列表」只有一张表，表头固定。**[自动]**

```
| 站点 | 覆盖范围 | 版本 | 状态 | 安装 |
```

每个脚本占一行。**[自动]**

```
| [站点名](官网) | 一句话范围，加上 `域名` | 0.1.0 | 候选版 | [安装](https://raw.githubusercontent.com/asiananlee/zh-cn-userscripts/main/scripts/站点英文名-zh-cn.user.js) |
```

- 版本等于脚本的 `@version`。
- 状态是下面三档之一。
- 安装格里只有安装链接。

| 状态 | 含义 |
| --- | --- |
| 已验证 | 当前版本装在真实浏览器里，重放了范围内的全部页面状态；残留英文为 0，或剩下的都属于不翻译或无法覆盖的内容 |
| 部分验证 | 当前版本在实站上装过，并重放了部分页面状态；其余状态只有旧版本的证据，或者没有证据 |
| 候选版 | 当前版本还没在实站上安装重放，例如只做了本地回归 |

**[审查]**

- 状态必须与事实相符，拿不准就选低的一档。
- 各行按站点名的字母顺序排列。
- README 里不写某个脚本的长段说明。覆盖范围和已知缺口写在脚本的开头注释里（3.3），README 只放这一行。

## 5. 审查清单

每次提交前，按顺序逐条确认。有任何一条不满足，就不提交。

**A. 自动检查**

- [ ] `node tools/check-userscripts.mjs` 全部通过

**B. 隐私（第 1 节）**

- [ ] 改动的文件里，没有邮箱、密钥、本机路径、账户数据
- [ ] 没有提交图片、覆盖报告和采集产物

**C. 安全（第 2 节）**

- [ ] 脚本只改 `nodeValue` 和白名单属性，没有新增元素、样式、事件
- [ ] 没有读写用户输入
- [ ] 调试输出仍然默认关闭、有上限、经过脱敏
- [ ] 危险操作相关的译文，逐条对照过原文，含义一致

**D. 固定模式（第 3、4 节）**

- [ ] 头部字段和顺序与模板一致
- [ ] 开头注释里的「最后核对」日期、覆盖范围和已知未覆盖已更新
- [ ] 脚本有改动时，版本号已提高
- [ ] README 脚本表里那一行的版本和状态已同步

**E. 诚实**

- [ ] README、脚本注释、提交信息里，没有把未验证的内容写成已验证
- [ ] 数字（词条数、页面数、状态数）是从文件里实际数出来的，不是抄来的
