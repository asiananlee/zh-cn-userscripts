# 贡献指南

感谢你愿意帮忙。这个项目只做一件事：把网站界面变成准确、统一、不影响使用的简体中文。

脚本怎么写，以[脚本规范](docs/script-spec.md)为准；译法以[翻译规范](docs/style-guide.md)为准。本文件只讲怎么参与。

## 语言约定

文档、Issue、PR、提交信息一律使用简体中文。文件名和代码标识符使用英文（ASCII），以兼容网址和各种操作系统。

## 你可以做什么

| 想做的事 | 怎么做 |
| --- | --- |
| 报告漏译、错译 | [提交「漏译 / 错译」](https://github.com/asiananlee/zh-cn-userscripts/issues/new/choose) |
| 报告页面错乱或功能异常 | [提交「页面错乱 / 功能异常」](https://github.com/asiananlee/zh-cn-userscripts/issues/new/choose) |
| 请求支持新站点 | [提交「新站点请求」](https://github.com/asiananlee/zh-cn-userscripts/issues/new/choose) |
| 直接改译文 | 见下文「修改译文」 |
| 提议修改通用术语 | 提 PR 修改[翻译规范](docs/style-guide.md)，并在 PR 里说明理由 |

提交任何内容之前，请确认两件事：
- 你用的是脚本的最新版。
- 截图和文字里**没有** API 密钥、邮箱、账号 ID、订单号、余额等个人信息。截图请先打码。

## 修改译文

1. Fork 本仓库，新建分支。
2. 修改 `scripts/` 下对应的脚本。译法先对照[翻译规范](docs/style-guide.md)，与已有术语保持一致。
3. 提高脚本头部的 `@version`，更新开头注释里的「最后核对」日期。版本号规则见[规范 3.7](docs/script-spec.md#37-版本号)。
4. 同步覆盖报告和 README：
   - 覆盖报告信息行里的版本，并在「版本记录」里加一行；
   - README 脚本表里那一行的版本。

   格式见[规范第 4、5 节](docs/script-spec.md#4-覆盖报告)。
5. 在本地运行检查，必须通过（需要 Node.js 18 或更高版本）：

   ```bash
   node tools/check-userscripts.mjs
   ```

6. 在真实页面上验证：装上改过的脚本，打开你改动涉及的页面和状态（弹窗、下拉、提示等），确认三点：
   - 已经翻译；
   - 排版正常；
   - 功能没受影响。
7. 按[规范第 6 节](docs/script-spec.md#6-审查清单)自查，然后提交 PR，按模板填写。

提交信息的写法是 `站点: 做了什么`，例如 `postmark: 修正账单页译文`、`openrouter: 补充密钥页弹窗译文`。

## 新增一个站点

先开「新站点请求」Issue 讨论，确认官方没有中文界面、范围合适，再动手。

1. **采集**：在本机逐个打开范围内的页面，把每个状态（弹窗、下拉、提示、空状态等）的界面文字都记下来。这些采集文件含有真实页面内容，留在仓库之外，不要提交。
2. **制作**：按[规范第 3 节](docs/script-spec.md#3-固定模式)的固定模式写脚本：头部、开头注释、代码结构、匹配规则。
3. **闭环验证**：装上脚本，逐个状态重放，扫描残留的英文，补进词典，直到残留为 0，或者剩下的都归入豁免或无法覆盖。
4. **文档**：
   - 按[规范第 4 节](docs/script-spec.md#4-覆盖报告)写覆盖报告 `docs/站点英文名-coverage.md`，如实标注状态；
   - 按[第 5 节](docs/script-spec.md#5-readme-的脚本表)在 README 的脚本表里加一行。
5. **自查**：按[第 6 节](docs/script-spec.md#6-审查清单)逐条确认，然后提交 PR。

## 自动检查

`node tools/check-userscripts.mjs` 检查[脚本规范](docs/script-spec.md)里标为 **[自动]** 的规则。它在本地和 CI 里都会运行，检查这些内容：

- 头部字段和顺序、禁用写法、`@match` 范围
- 开头注释必须有的项
- 覆盖报告的信息行和章节，以及 README 脚本表与脚本版本是否一致
- 全仓库的密钥、邮箱和本机路径，禁止入库的文件，截图的元数据

CI 还会检查改过的脚本有没有提高版本号。

这是文本规则，宁可误报。注释、字符串和正则里的文字不算调用，所以词典里出现 `Failed to fetch` 这样的英文不会被拦。标为 **[审查]** 的规则靠人工核对。

## 仓库结构

```
.
├── scripts/                    汉化脚本，一个站点一个 *.user.js
├── docs/script-spec.md         脚本规范：安全约束、固定模式、覆盖报告与 README 格式、审查清单
├── docs/style-guide.md         翻译规范：译法约定与通用术语表
├── docs/*-coverage.md          每个脚本的覆盖报告
├── docs/images/                README 和报告用的截图
├── tools/check-userscripts.mjs 自动检查（CI 与本地通用）
└── .github/                    Issue 表单、PR 模板、CI
```

## 数据与隐私

词典、截图、日志、Issue 里都不要出现真实的 API 密钥、邮箱、账号 ID、余额。遇到动态值用占位符，例如 `{n}`、`{amount}`。完整清单见[规范第 1 节](docs/script-spec.md#1-隐私不能进仓库的东西)。

提交记录里的邮箱会公开。建议在 GitHub 的 Settings → Emails 里开启邮箱隐私，用 noreply 地址提交。

调试输出（`站点英文名.zhCN.debug`）已经脱敏，但可能仍含页面上的资源名。分享前请逐条检查，不要整段粘贴到公开的 Issue。
