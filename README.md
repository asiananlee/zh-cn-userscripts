# zh-cn-userscripts

[![脚本检查](https://github.com/asiananlee/zh-cn-userscripts/actions/workflows/check.yml/badge.svg)](https://github.com/asiananlee/zh-cn-userscripts/actions/workflows/check.yml)
[![许可证：MIT](https://img.shields.io/badge/许可证-MIT-blue.svg)](LICENSE)

给海外开发者控制台、后台面板做的**简体中文汉化油猴脚本**。一个站点一个脚本，装上就能用，不依赖任何外部服务。

> 这是非官方的社区项目，与文中提到的各网站及其公司没有任何关联；相关名称和商标归各自所有者。

## 脚本列表

| 站点 | 脚本 | 状态 | 安装 |
| --- | --- | --- | --- |
| [OpenRouter](https://openrouter.ai) 控制台 | `openrouter-zh-cn.user.js` | 开发中 | 暂未发布 |

脚本发布后，安装链接会补充在这张表里。

## 安装

1. 在浏览器里安装用户脚本管理器 [Tampermonkey](https://www.tampermonkey.net/)（Chrome、Edge、Firefox、Safari 都有对应版本）。
2. 点击上表里脚本的「安装」链接，Tampermonkey 会弹出安装页，点「安装」。
3. 刷新目标网站，界面显示为中文。

## 它做什么，不做什么

**只做一件事**：把页面上的界面文案（按钮、菜单、标签、提示、弹窗等）替换成简体中文。

**不翻译**这些内容，它们是动态数据或需要保持原样：模型名称、用户输入的内容、提示词与日志正文、代码、API 密钥、网址、数字与金额、品牌名，以及 API、JSON、HTTP 等通用缩写。

**已知覆盖不到**：跨域 iframe（例如支付页）、canvas 里绘制的文字、图片里的文字、服务器返回的英文报错。每个脚本支持的页面和已知缺口，写在脚本文件开头的注释里。

网站改版后可能出现漏译或排版错位，欢迎[提交反馈](https://github.com/asiananlee/zh-cn-userscripts/issues/new/choose)。

## 安全与隐私承诺

这些脚本运行在含有 API 密钥、账单等敏感信息的页面上，所以有硬性约束：

- 不发起任何网络请求，不收集、不上传任何数据
- 不引入外部代码（没有 `@require`、`@connect`），不使用 Tampermonkey 特权接口（`@grant none`）
- 不读取 Cookie，不用 `eval`，不写入 `innerHTML`
- `@match` 精确到目标网站，不会在其他网站上运行
- 只修改页面文本，不改变页面结构和功能
- 每个脚本是单个文件，可以自己通读

其中网络请求、外部依赖、`@grant`、`eval`、`innerHTML`、Cookie 和 `@match` 范围，由 [自动检查](tools/check-userscripts.mjs) 在每次提交时拦截；其余靠代码审阅。自动检查是文本规则，不是安全证明，细节见 [安全政策](SECURITY.md)。

## 参与

- 发现漏译、错译、排版问题：[提交反馈](https://github.com/asiananlee/zh-cn-userscripts/issues/new/choose)
- 想改译文或新增站点：先读 [贡献指南](CONTRIBUTING.md) 和 [翻译规范](docs/style-guide.md)

本项目的文档、Issue、PR 讨论一律使用简体中文，保证所有参与者用同一种语言沟通。文件名和代码标识符使用英文，以兼容网址和各操作系统。

## 仓库结构

```
.
├── scripts/                    汉化脚本，一个站点一个 *.user.js
├── docs/style-guide.md         译法约定与通用术语表
├── tools/check-userscripts.mjs 脚本合规检查（CI 与本地通用）
├── .github/                    Issue 表单、PR 模板、CI
├── CONTRIBUTING.md             贡献指南
├── SECURITY.md                 安全政策
├── CODE_OF_CONDUCT.md          行为准则
└── LICENSE                     MIT
```

## 许可证

[MIT](LICENSE)
