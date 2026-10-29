# 贡献指南

感谢你愿意帮忙。这个项目只做一件事：让网站界面变成准确、统一、不影响使用的简体中文。

所有规则写在 [RULES.md](RULES.md)。本文件只讲怎么参与，规则有出入时以 RULES.md 为准。

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
3. 提高脚本头部的 `@version`，并更新开头注释里的「最后核对」日期（版本号规则见 [RULES.md 3.7](RULES.md#37-版本号)）。
4. 本地运行检查，必须通过（需要 Node.js 18 或更高版本）：

   ```bash
   node tools/check-userscripts.mjs
   ```

5. 在真实页面里验证：装上改过的脚本，打开你改动涉及的页面和状态（弹窗、下拉、提示等），确认已翻译、排版正常、功能没受影响。
6. 按 [RULES.md 第 6 节](RULES.md#6-审查清单) 自查，然后提交 PR，按模板填写。

提交信息写法：`站点: 做了什么`。例如 `postmark: 修正账单页译文`、`openrouter: 补充密钥页弹窗译文`。

## 新增一个站点

先开「新站点请求」Issue 讨论，确认官方没有中文界面、范围合适，再动手。

- 流程见 [RULES.md 第 5 节](RULES.md#5-新站点的流程)，脚本的头部、开头注释和代码结构按 [RULES.md 第 3 节](RULES.md#3-每个脚本的固定模式) 的固定模式写。
- 想让 AI 代理完成采集、制作和验证，用 [docs/new-site-prompts.md](docs/new-site-prompts.md) 里的分阶段提示词。
- 采集阶段的文件（页面文本、截图原件、自动化脚本）含有真实页面内容，放在仓库之外，不要提交。
- 每个脚本都要有覆盖报告 `docs/站点英文名-coverage.md`，结构参照 [docs/postmark-coverage.md](docs/postmark-coverage.md)。

## 自动检查

`node tools/check-userscripts.mjs` 在本地和 CI 里检查 [RULES.md](RULES.md) 里标为 **[自动]** 的规则：头部字段和顺序、禁用写法、`@match` 范围、全仓库的密钥、邮箱和本机路径、禁止入库的文件、提交作者邮箱。CI 还会检查改过的脚本有没有提高版本号。

这是文本规则，宁可误报。注释、字符串和正则里的文字不算调用，所以词典里出现 `Failed to fetch` 这样的英文不会被拦。

标为 **[审查]** 的规则靠人工核对，见 [RULES.md 第 6 节](RULES.md#6-审查清单)。

## 数据与隐私

词典、截图、日志、Issue 里都不要出现真实的 API 密钥、邮箱、账号 ID、余额。遇到动态值用占位符，例如 `{n}`、`{amount}`。完整清单见 [RULES.md 第 1 节](RULES.md#1-隐私任何时候都不能出现在仓库里的东西)。

调试输出（`站点名.zhCN.debug`）已经脱敏，但可能仍含页面上的资源名。分享前请逐条检查，不要整段粘贴到公开的 Issue。
