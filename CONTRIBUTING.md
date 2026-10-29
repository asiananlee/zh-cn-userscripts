# 贡献指南

感谢你愿意帮忙。这个项目只做一件事：让网站界面变成准确、统一、不影响使用的简体中文。

## 语言约定

文档、Issue、PR、提交信息一律使用简体中文。文件名和代码标识符使用英文（ASCII），以兼容网址和各操作系统。

## 你可以做什么

| 想做的事 | 怎么做 |
| --- | --- |
| 报告漏译、错译 | [提交「漏译 / 错译」](https://github.com/asiananlee/zh-cn-userscripts/issues/new/choose) |
| 报告页面错乱或功能异常 | [提交「页面错乱 / 功能异常」](https://github.com/asiananlee/zh-cn-userscripts/issues/new/choose) |
| 请求支持新站点 | [提交「新站点请求」](https://github.com/asiananlee/zh-cn-userscripts/issues/new/choose) |
| 直接改译文 | 见下文「修改译文」 |
| 提议修改通用术语 | 提 PR 修改 [翻译规范](docs/style-guide.md)，在 PR 里说明理由 |

提交任何内容前，请确认：脚本是最新版；截图和文字里**没有** API 密钥、邮箱、账号 ID、订单号、余额等个人信息（截图请打码）。

## 修改译文

1. Fork 本仓库，新建分支。
2. 修改 `scripts/` 下对应的脚本。译法先对照 [翻译规范](docs/style-guide.md)，与已有术语保持一致。
3. 提高脚本头部的 `@version`（规则见下文）。
4. 本地运行检查，必须通过（需要 Node.js 18 或更高版本）：

   ```bash
   node tools/check-userscripts.mjs
   ```

5. 在真实页面里验证：装上改过的脚本，打开你改动涉及的页面和状态（弹窗、下拉、提示等），确认已翻译、排版正常、功能没受影响。
6. 提交 PR，按模板填写。

提交信息写法：`站点: 做了什么`。例如 `openrouter: 修正 Rate limit 的译法`、`openrouter: 补充密钥页弹窗译文`。

### 版本号

格式 `主.次.修订`：只改译文或补漏 → 修订号 +1；覆盖了新页面 → 次版本号 +1；脚本结构有大改动 → 主版本号 +1。版本号不变，用户的 Tampermonkey 收不到更新。

## 新增一个站点

先开「新站点请求」Issue 讨论，确认官方没有中文界面、范围合适，再动手。

- 文件放在 `scripts/`，命名为 `站点英文名-zh-cn.user.js`，只用小写字母、数字和连字符，例如 `openrouter-zh-cn.user.js`。
- 一个站点一个文件，不拆分，不引入构建工具。
- 头部使用下面的模板，按实际情况改站点名和路径。

```js
// ==UserScript==
// @name         OpenRouter 简体中文汉化
// @namespace    https://github.com/asiananlee/zh-cn-userscripts
// @version      0.1.0
// @description  OpenRouter 控制台界面简体中文汉化
// @author       asiananlee
// @license      MIT
// @homepageURL  https://github.com/asiananlee/zh-cn-userscripts
// @supportURL   https://github.com/asiananlee/zh-cn-userscripts/issues
// @match        https://openrouter.ai/*
// @run-at       document-start
// @grant        none
// ==/UserScript==
```

`@downloadURL` 和 `@updateURL` 在脚本正式发布、确定安装地址后再加。

### 自动检查会拦截的约束

运行 `node tools/check-userscripts.mjs` 检查，CI 里也会跑：

- 文件名符合上面的命名规则，`node --check` 语法通过
- 头部必须有 `@name`、`@namespace`、`@version`（数字三段）、`@description`、`@license`、`@match`，且只有一行 `@grant none`
- 不能使用 `@require`、`@resource`、`@connect`、`@include`
- `@match` 不能是全站通配（如 `*://*/*`、主机为 `*` 或 `*.com`）
- `@downloadURL`、`@updateURL` 只能指向本仓库的 raw 地址或 greasyfork.org
- 代码里不能出现：`fetch()`、`XMLHttpRequest`、`WebSocket`、`EventSource`、`sendBeacon`、`importScripts`、`eval`、`new Function`、`document.write`、`insertAdjacentHTML`、写入 `innerHTML` / `outerHTML`、`document.cookie`、`GM_*` / `GM.*`、`unsafeWindow`
- 不能出现疑似 API 密钥或 token 的字符串

这些是文本规则，宁可误报。词典里恰好出现类似写法时，换个写法绕开即可。

### 靠代码审阅的实现要求

- **匹配**：对文本节点的完整规范化文本做精确匹配；含动态值的句子用带 `^` `$` 的正则。**禁止对文本做子串全局替换**（会把 Keyboard 里的 Key 换掉）。
- **范围**：只修改文本节点的 `nodeValue` 和白名单属性（`placeholder`、`title`、`aria-label`、`alt` 等），不改元素结构。
- **单页应用**：用 `MutationObserver` 配合节流处理重新渲染，避免脚本自己的修改触发自己；监听路由变化，让按页面区分的译法在不刷新的跳转后仍生效。
- **跳过区域**：`script`、`style`、`code`、`pre`、`textarea`、`input` 的值和可编辑区域，以及用户内容、第三方内容。
- **调试开关**：在控制台执行 `localStorage.setItem('zhcn-debug', '1')` 后刷新，脚本在控制台汇总打印未命中词典的英文，用来补漏。默认关闭。
- **文件开头注释**：写明覆盖的页面、已知未覆盖的部分、最后核对日期。

## 数据与隐私

词典、截图、日志、Issue 里都不要出现真实的 API 密钥、邮箱、账号 ID、余额。遇到动态值用占位符，例如 `{n}`、`{amount}`。
