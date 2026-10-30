<div align="center">

# zh-cn-userscripts

**让海外开发者控制台说简体中文的油猴脚本**

一个站点一个脚本，装上即用。词典写在脚本里，不联网，不收集任何数据。

[![脚本检查](https://github.com/asiananlee/zh-cn-userscripts/actions/workflows/check.yml/badge.svg)](https://github.com/asiananlee/zh-cn-userscripts/actions/workflows/check.yml)
[![许可证：MIT](https://img.shields.io/badge/许可证-MIT-blue.svg)](LICENSE)

</div>

## 脚本列表

| 站点 | 覆盖范围 | 版本 | 状态 | 安装 |
| --- | --- | --- | --- | --- |
| [OpenRouter](https://openrouter.ai) | 账户与工作区控制台 `openrouter.ai` | 0.1.1 | 候选版 | [安装](https://raw.githubusercontent.com/asiananlee/zh-cn-userscripts/main/scripts/openrouter-zh-cn.user.js) |
| [Postmark](https://postmarkapp.com) | 账户控制台 `account.postmarkapp.com` | 0.1.1 | 部分验证 | [安装](https://raw.githubusercontent.com/asiananlee/zh-cn-userscripts/main/scripts/postmark-zh-cn.user.js) |
| [Trustpilot](https://business.trustpilot.com) | 商家后台 `businessapp.b2b.trustpilot.com` | 0.1.3 | 候选版 | [安装](https://raw.githubusercontent.com/asiananlee/zh-cn-userscripts/main/scripts/trustpilot-zh-cn.user.js) |

**状态**的含义：
- **已验证**：当前版本在真实网站上重放了全部页面状态。
- **部分验证**：只重放了一部分页面状态。
- **候选版**：当前版本还没在真实网站上重放。

每个脚本的覆盖范围和已知缺口，写在[脚本文件](scripts/)开头的注释里。

想要的网站不在表里？[提交新站点请求](https://github.com/asiananlee/zh-cn-userscripts/issues/new?template=new-site.yml)。

## 安装

1. 在浏览器里安装用户脚本管理器 [Tampermonkey](https://www.tampermonkey.net/)。Chrome、Edge、Firefox、Safari 都有对应版本。
2. 点上表里的「安装」，Tampermonkey 会打开安装页，再点「安装」。
3. 刷新目标网站，界面就显示为中文了。

> [!TIP]
> 同一个网站只保留一个汉化脚本。以前装过别的版本，请先在 Tampermonkey 里停用它，避免两份脚本同时改写页面。

## 为什么不用浏览器的整页翻译

整页机器翻译适合偶尔看懂一个页面。如果要天天用某个控制台，它有几个问题：

| | 浏览器整页翻译 | 本项目的脚本 |
| --- | --- | --- |
| 术语 | 机器逐句翻译，同一个词前后可能译法不同 | 固定词典，同一个词全站一种译法 |
| 密钥、代码、模型名 | 可能被一起翻译，复制出来就不对了 | 识别并跳过，保持原样 |
| 页面结构 | 会改动页面结构，React 这类应用可能报错或显示错乱 | 只改文字，不改结构 |
| 删除、付款等按钮 | 可能译得含糊 | 规范要求含义与原文一致，译错按安全问题处理 |
| 页面内容的去向 | 取决于浏览器，有的会发给在线翻译服务 | 不联网，页面文字不离开浏览器 |

## 它做什么，不做什么

- **只做一件事**：把界面文案替换成简体中文，包括按钮、菜单、标签、提示、弹窗等。
- **不翻译**动态数据和需要保持原样的内容：用户输入、资源名、模型名、提示词与日志正文、代码、API 密钥、网址、数字与金额、品牌名，以及 API、JSON、HTTP 等通用缩写。
- **覆盖不到**：跨域 iframe（例如支付页）、canvas 里画的文字、图片里的文字、服务器返回的英文报错。每个脚本具体的缺口写在脚本文件开头的注释里。

## 安全与隐私

这些脚本运行在有 API 密钥和账单的页面上，所以有一组硬性约束：

- 不发起任何网络请求，不收集、不上传任何数据。
- 不引入外部代码（没有 `@require`、`@connect`），不使用 Tampermonkey 的特权接口（`@grant none`）。
- 不读取 Cookie、剪贴板和凭据，不写入任何本地存储，不用 `eval`，不写入 `innerHTML`。
- `@match` 精确到目标网站，不会在其他网站上运行。
- 只修改页面文字，不改变页面结构和功能，不读取你输入的内容。
- 每个脚本都是单个文件，没有依赖，你可以自己通读。

其中能用文本规则判断的部分，由[自动检查](tools/check-userscripts.mjs)在每次推送和 PR 时拦截，其余靠逐项审查。自动检查不是安全证明。完整的约束见[脚本规范](docs/script-spec.md)，安全问题的报告方式见[安全政策](SECURITY.md)。

## 常见问题

**怎么恢复英文？**
在 Tampermonkey 里关闭或删除这个脚本，然后刷新页面。

**网站改版后会怎样？**
新出现的文字会保持英文，等词典补上后再变成中文。脚本只改文字，不会改动按钮和功能。

**支持哪些脚本管理器？**
测试用的是 Tampermonkey。其他脚本管理器（例如 Violentmonkey）没有测试过。

**发现漏译或错译怎么办？**
[提交反馈](https://github.com/asiananlee/zh-cn-userscripts/issues/new/choose)，写上页面和英文原文。附截图前，请先遮住密钥、邮箱、余额等个人信息。

## 参与

- 反馈漏译、错译、排版问题：[提交 Issue](https://github.com/asiananlee/zh-cn-userscripts/issues/new/choose)
- 改译文或新增站点：先读[贡献指南](CONTRIBUTING.md)、[脚本规范](docs/script-spec.md)和[翻译规范](docs/style-guide.md)

本项目的文档、Issue、PR 讨论一律使用简体中文，让所有参与者用同一种语言沟通。文件名和代码标识符用英文，以兼容网址和各种操作系统。

如果这些脚本帮到了你，欢迎点一个 Star，让更多需要的人看到它。

## 许可证

[MIT](LICENSE)

这是非官方的社区项目，与文中提到的网站及其公司没有任何关联。相关名称和商标归各自的所有者。
