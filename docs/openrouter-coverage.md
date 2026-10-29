# OpenRouter 汉化脚本覆盖报告

对应脚本：[`scripts/openrouter-zh-cn.user.js`](../scripts/openrouter-zh-cn.user.js)，版本 0.1.1。最后核对：2026-10-29。

## 结论

**候选版，本地回归已通过，整理后版本尚未实站安装，不能视为全站验收通过。**

整理前的 0.1.0 做过 202 次采样，归并 187 个状态；183 个稳定且目标核对通过，其中 162 个无 UI 残留，21 个状态合计 29 条节点/属性残留，涉及 6 种英文。重复背景标题不能算作不同的遗漏类型。地图含 52 个不同编号，可靠状态涉及 49 个编号，不等于全部状态已重放。

本版保留全部既有译文，统一元数据、页面分区、调试脱敏与上限，并跳过快捷键区域。隔离浏览器中的 32 组已采集分片和 27 项行为检查全部通过，运行错误为 0；内容保护、React 写回英文、路由切换和调试上限均已验证。当前版实站残留数未知；下面的旧版记录只作参考，没有转为新版 ✅。此前五轮上限已用完，本次整理没有追加实站补漏轮次。

## 验证对象与规模

| 项目 | 内容 |
| --- | --- |
| 匹配范围 | 仅 https://openrouter.ai/*；运行逻辑限制已采集账户与工作区界面，文档正文排除 |
| 运行方式 | document-start、grant none；load 后延迟 500ms 开始改字 |
| 整理前 0.1.0 | SHA-256 `5968dd246fdf57623af31cda9ca6fc290adc471d20ab4fc1ecf226465960fba5` |
| 当前 0.1.1 | 203671 字节，SHA-256 `3e52e7060ef638634191a5b1cecf225c4fa4a17299606d478fb7f7b41ecb305f` |
| 精确词条 | 1525，其中公共 303、页面 1222；完整键不重复 |
| 页面分区 | 37 个翻译分区；共享分区或一组路径不另算网页 |
| 模板 | 84 种不同锚定模板；公共 3 条，页面绑定 106 条（合计 109 次绑定） |
| 碎片 | 28 种不同父句规则，按适用分区绑定 69 条；32 组采集样本参与回归 |
| 路径覆盖 | 14 个语境词条 |

旧版由维护者手动安装到 Tampermonkey，并观察到新增译文；未回读扩展内部源码，不能声称安装副本与本地来源逐字节一致。0.1.1 尚未重新安装到真实账户。头部名称与 namespace 现已统一；从旧本地版迁移时，应先停用旧版，再安装本文件，避免两份同时运行。

## 已知英文遗漏

| 地图项 | 已观察原文 | 当前状态 |
| --- | --- | --- |
| W28 聊天页 | Chat | 仍待修；未证明是用户自定义房间名，不当作豁免 |
| W07 生成详情 | Web search；Native (provider built-in) | 仍待修的固定 UI 标签和说明 |
| S02 全局搜索 | Search OpenRouter；Close search；Navigate | 仍待修的控件文字 |

以上均可通过 DOM 规则处理，不能归入技术上无法覆盖。

## 页面 × 状态矩阵

图例：⚠️ 是整理前版本的参考证据，❌ 是未可靠验证或当前版待重放。本次没有新增的实站 ✅。扫描包含已渲染的视口外 DOM，但不能代替滚动触发、分页或懒加载验证。

| 地图项 | 状态 | URL 模式 | 整理前 0.1.0 | 当前 0.1.1 |
| --- | --- | --- | --- | --- |
| A01 | new-workspace-budget-cycle | `/workspaces` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| A01 | new-workspace-empty | `/workspaces` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| A01 | workspace-row-menu | `/workspaces` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| A01 | workspaces-base | `/workspaces` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| A02 | profile-period-menu | `/settings/profile` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| A02 | profile-requests | `/settings/profile` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| A02 | profile-spend | `/settings/profile` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| A02 | profile-tokens | `/settings/profile` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| A03 | account-activity-base | `/activity?from=:value&to=:value&date_preset=:value` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| A03 | account-activity-spa-entry | `/activity` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| A04 | account-trends-base | `/activity/trends` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| A05 | account-explore-base | `/activity/explore` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| A06 | account-guardrail-activity-base | `/activity/guardrails` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| A07 | account-logs-batches | `/logs?tab=batches` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| A07 | account-logs-generations | `/logs` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| A07 | account-logs-sessions | `/logs?tab=sessions` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| A07 | account-logs-upstream | `/logs?tab=requests` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| A07 | account-logs-videos | `/logs?tab=videos` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| A08 | credits-base | `/settings/credits` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| A09 | redeem-base | `/redeem` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| A09 | redeem-faq-balance | `/redeem` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| A09 | redeem-faq-free | `/redeem` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| A09 | redeem-faq-invalid | `/redeem` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| A09 | redeem-faq-usage | `/redeem` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| A10 | management-key-expiry-menu | `/settings/management-keys` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| A10 | management-key-new-empty | `/settings/management-keys` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| A10 | management-keys-base | `/settings/management-keys` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| A11 | notification-low-balance | `/settings/notifications` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| A11 | notification-model-price | `/settings/notifications` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| A11 | notification-model-retirement | `/settings/notifications` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| A11 | notifications-base | `/settings/notifications` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| A12 | privacy-base | `/settings/privacy` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| A12 | privacy-max-key-expiry | `/settings/privacy` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| A13 | security-inactivity-menu | `/settings/security?tab=key-safety` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| A13 | security-ip-allowlist | `/settings/security?tab=ip-allowlist` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| A13 | security-key-row-menu | `/settings/security?tab=key-safety` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| A13 | security-key-safety | `/settings/security?tab=key-safety` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| A13 | security-overview | `/settings/security` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| A13 | security-set-limit | `/settings/security?tab=key-safety` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| A14 | preferences-base | `/settings/preferences` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| A14 | preferences-date-format | `/settings/preferences` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| A15 | manage-plan-base | `/settings/manage-plan` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| S01 | account-menu | `/workspaces/:id/files` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| S02 | global-search-default | `/settings/manage-plan` | ⚠️ 旧版有 4 条节点/属性残留 | ❌ 待重放 |
| S02 | global-search-query | `/settings/manage-plan` | ⚠️ 旧版有 4 条节点/属性残留 | ❌ 待重放 |
| S03 | account-management-profile | `/settings/preferences` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| S03 | account-management-security | `/settings/preferences` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| S04 | organization-new-empty | `/settings/preferences` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| S05 | chat-model-picker-base | `/workspaces/:id/chat` | ⚠️ 旧版有 1 条节点/属性残留 | ❌ 待重放 |
| S05 | model-input-filter | `/workspaces/:id/routing` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| S05 | model-output-filter | `/workspaces/:id/routing` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| S05 | model-picker-filters | `/workspaces/:id/routing` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| S05 | model-picker-recent | `/workspaces/:id/routing` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| S05 | model-provider-filter | `/workspaces/:id/routing` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| S05 | routing-model-picker | `/workspaces/:id/routing` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| S06 | mobile-navigation-open | `/workspaces/:id/files` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W02 | activity-custom-date-dialog | `/workspaces/:id/activity` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W02 | activity-date-presets | `/workspaces/:id/activity` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W02 | activity-filter-groups | `/workspaces/:id/activity` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W02 | overview-chart-keyboard-tooltip | `/workspaces/:id/activity` | ❌ 旧版未可靠验证：tooltip-payload-empty | ❌ 待重放 |
| W02 | timezone-menu | `/workspaces/:id/activity` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W02 | workspace-activity-base | `/workspaces/:id/activity` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W03 | trend-chart-keyboard-tooltip | `/workspaces/:id/activity/trends` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W03 | trend-chart-settings | `/workspaces/:id/activity/trends` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W03 | trend-metric-menu | `/workspaces/:id/activity/trends` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W03 | workspace-trends-base | `/workspaces/:id/activity/trends` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W04 | explore-chart-display-menu | `/workspaces/:id/activity/explore` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W04 | explore-count-menu | `/workspaces/:id/activity/explore` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W04 | explore-dimension-menu | `/workspaces/:id/activity/explore` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W04 | explore-expanded-chart | `/workspaces/:id/activity/explore` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W04 | explore-metric-menu | `/workspaces/:id/activity/explore` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W04 | explore-ranking-direction | `/workspaces/:id/activity/explore` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W04 | explore-rollup-menu | `/workspaces/:id/activity/explore` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W04 | explore-sort-metric-menu | `/workspaces/:id/activity/explore` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W04 | explore-subgroup-menu | `/workspaces/:id/activity/explore` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W04 | workspace-explore-base | `/workspaces/:id/activity/explore` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W05 | blocked-requests-expanded | `/workspaces/:id/activity/guardrails` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W05 | guardrail-activity-empty | `/workspaces/:id/activity/guardrails` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W05 | redacted-flagged-expanded | `/workspaces/:id/activity/guardrails` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W06 | feedback-category-menu | `/workspaces/:id/logs` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W06 | logs-batches | `/workspaces/:id/logs?tab=batches` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W06 | logs-generations-base | `/workspaces/:id/logs` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W06 | logs-generations-bottom | `/workspaces/:id/logs` | ❌ 旧版未可靠验证：end-of-list-not-confirmed | ❌ 待重放 |
| W06 | logs-sessions | `/workspaces/:id/logs?tab=sessions` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W06 | logs-upstream | `/workspaces/:id/logs?tab=requests` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W06 | logs-videos | `/workspaces/:id/logs?tab=videos` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W06 | report-feedback-empty | `/workspaces/:id/logs` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W06 | table-settings-columns | `/workspaces/:id/logs` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W06 | table-settings-density | `/workspaces/:id/logs` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W07 | generation-details-base | `/workspaces/:id/logs?transaction=:id` | ⚠️ 旧版有 3 条节点/属性残留 | ❌ 待重放 |
| W08 | key-row-menu | `/workspaces/:id/keys` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W08 | keys-base | `/workspaces/:id/keys` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W08 | keys-filtered-empty | `/workspaces/:id/keys?search=:value` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W08 | keys-mobile | `/workspaces/:id/keys` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W08 | keys-selected-toolbar | `/workspaces/:id/keys` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W08 | new-key-credit-menu | `/workspaces/:id/keys` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W08 | new-key-desktop-final | `/workspaces/:id/keys` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W08 | new-key-empty | `/workspaces/:id/keys` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W08 | new-key-expiration-menu | `/workspaces/:id/keys` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W08 | new-key-mobile | `/workspaces/:id/keys` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W09 | delete-key-confirmation | `/workspaces/:id/keys/:id` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W09 | key-cost-help | `/workspaces/:id/keys/:id` | ❌ 旧版未可靠验证：tooltip-did-not-remain-visible | ❌ 待重放 |
| W09 | key-detail-base | `/workspaces/:id/keys/:id` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W10 | file-upload-empty | `/workspaces/:id/files` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W10 | file-upload-mobile | `/workspaces/:id/files` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W10 | files-base | `/workspaces/:id/files` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W10 | files-desktop-final | `/workspaces/:id/files` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W10 | files-mobile | `/workspaces/:id/files` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W10 | upload-folder-menu | `/workspaces/:id/files` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W11 | guardrail-status-menu | `/workspaces/:id/guardrails` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W11 | guardrails-list | `/workspaces/:id/guardrails` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W11 | new-guardrail-empty | `/workspaces/:id/guardrails` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W12 | default-guardrail-base | `/workspaces/:id/guardrails/default` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W13 | access-mode-menu | `/workspaces/:id/guardrails/default/models` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W13 | access-policy-base | `/workspaces/:id/guardrails/default/models` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W13 | eligibility-models | `/workspaces/:id/guardrails/default/models` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W14 | prompt-action-menu | `/workspaces/:id/guardrails/default/prompt-injection` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W14 | prompt-injection-base | `/workspaces/:id/guardrails/default/prompt-injection` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W15 | sensitive-info-base | `/workspaces/:id/guardrails/default/sensitive-info` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W16 | byok-expanded-providers | `/workspaces/:id/byok/` | ❌ 旧版未可靠验证：expected-page-path | ❌ 待重放 |
| W16 | byok-list | `/workspaces/:id/byok` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W17 | byok-cloud-api-key | `/workspaces/:id/byok/:id` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W17 | byok-cloud-base | `/workspaces/:id/byok/:id` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W17 | byok-standard-base | `/workspaces/:id/byok/:id` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W17 | byok-standard-empty-key | `/workspaces/:id/byok/:id` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W18 | cost-tier-menu | `/workspaces/:id/routing` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W18 | provider-sort-menu | `/workspaces/:id/routing` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W18 | routing-base | `/workspaces/:id/routing` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W18 | service-tier-menu | `/workspaces/:id/routing` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W19 | presets-empty | `/workspaces/:id/presets` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W20 | new-preset-base | `/workspaces/:id/presets/new` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W20 | preset-advisor-panel | `/workspaces/:id/presets/new` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W20 | preset-datetime-panel | `/workspaces/:id/presets/new` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W20 | preset-fusion-panel | `/workspaces/:id/presets/new` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W20 | preset-image-panel | `/workspaces/:id/presets/new` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W20 | preset-shell-panel | `/workspaces/:id/presets/new` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W20 | preset-subagent-panel | `/workspaces/:id/presets/new` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W20 | preset-web-fetch-panel | `/workspaces/:id/presets/new` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W20 | preset-web-search-more | `/workspaces/:id/presets/new` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W20 | preset-web-search-panel | `/workspaces/:id/presets/new` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W21 | plugin-pareto-dialog | `/workspaces/:id/tools?tab=plugins` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W21 | plugin-pdf-dialog | `/workspaces/:id/tools?tab=plugins` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W21 | plugin-pdf-engine-menu | `/workspaces/:id/tools?tab=plugins` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W21 | plugin-response-healing-dialog | `/workspaces/:id/tools?tab=plugins` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W21 | plugin-web-search-dialog | `/workspaces/:id/tools?tab=plugins` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W21 | plugin-web-search-domain-filters | `/workspaces/:id/tools?tab=plugins` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W21 | plugins-base | `/workspaces/:id/tools?tab=plugins` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W21 | server-domain-policy-menu | `/workspaces/:id/tools` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W21 | server-search-engine-menu | `/workspaces/:id/tools` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W21 | server-tools-base | `/workspaces/:id/tools` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W21 | server-web-fetch-dialog | `/workspaces/:id/tools` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W21 | server-web-search-dialog | `/workspaces/:id/tools` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W22 | io-actions-menu | `/workspaces/:id/observability` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W22 | observability-base | `/workspaces/:id/observability` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W23 | io-excluded-key-menu | `/workspaces/:id/observability/io-logging-settings` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W23 | io-included-key-menu | `/workspaces/:id/observability/io-logging-settings` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W23 | io-settings-base | `/workspaces/:id/observability/io-logging-settings` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W24 | destination-excluded-key-menu | `/workspaces/:id/observability/destinations/new/:id` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W24 | destination-included-key-menu | `/workspaces/:id/observability/destinations/new/:id` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W24 | langfuse-filter-rule-draft | `/workspaces/:id/observability/destinations/new/:id` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W24 | langfuse-new-base | `/workspaces/:id/observability/destinations/new/:id` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W24 | trace-rule-field-menu | `/workspaces/:id/observability/destinations/new/:id` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W24 | trace-rule-operator-menu | `/workspaces/:id/observability/destinations/new/:id` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W24 | webhook-new-base | `/workspaces/:id/observability/destinations/new/:id` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W25 | classifiers-empty | `/workspaces/:id/classifiers` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W26 | classifier-template-list | `/workspaces/:id/classifiers/new` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W26 | custom-classifier-empty | `/workspaces/:id/classifiers/new` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W26 | custom-dimension-draft | `/workspaces/:id/classifiers/new` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W27 | workspace-settings-base | `/workspaces/:id/settings` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W28 | chat-add-message-menu | `/workspaces/:id/chat` | ⚠️ 旧版有 1 条节点/属性残留 | ❌ 待重放 |
| W28 | chat-advisor-panel | `/workspaces/:id/chat` | ⚠️ 旧版有 1 条节点/属性残留 | ❌ 待重放 |
| W28 | chat-datetime-panel | `/workspaces/:id/chat` | ⚠️ 旧版有 1 条节点/属性残留 | ❌ 待重放 |
| W28 | chat-empty-base | `/workspaces/:id/chat` | ⚠️ 旧版有 1 条节点/属性残留 | ❌ 待重放 |
| W28 | chat-fusion-panel | `/workspaces/:id/chat` | ⚠️ 旧版有 1 条节点/属性残留 | ❌ 待重放 |
| W28 | chat-image-panel | `/workspaces/:id/chat` | ⚠️ 旧版有 1 条节点/属性残留 | ❌ 待重放 |
| W28 | chat-memory-menu | `/workspaces/:id/chat` | ⚠️ 旧版有 1 条节点/属性残留 | ❌ 待重放 |
| W28 | chat-shell-panel | `/workspaces/:id/chat` | ⚠️ 旧版有 1 条节点/属性残留 | ❌ 待重放 |
| W28 | chat-subagent-panel | `/workspaces/:id/chat` | ⚠️ 旧版有 1 条节点/属性残留 | ❌ 待重放 |
| W28 | chat-tools-menu | `/workspaces/:id/chat` | ⚠️ 旧版有 1 条节点/属性残留 | ❌ 待重放 |
| W28 | chat-uploaded-file-empty | `/workspaces/:id/chat` | ⚠️ 旧版有 1 条节点/属性残留 | ❌ 待重放 |
| W28 | chat-view-mode-menu | `/workspaces/:id/chat` | ⚠️ 旧版有 1 条节点/属性残留 | ❌ 待重放 |
| W28 | chat-web-fetch-panel | `/workspaces/:id/chat` | ⚠️ 旧版有 1 条节点/属性残留 | ❌ 待重放 |
| W28 | chat-web-search-more | `/workspaces/:id/chat` | ⚠️ 旧版有 1 条节点/属性残留 | ❌ 待重放 |
| W28 | chat-web-search-panel | `/workspaces/:id/chat` | ⚠️ 旧版有 1 条节点/属性残留 | ❌ 待重放 |
| W28 | chat-zdr-menu | `/workspaces/:id/chat` | ⚠️ 旧版有 1 条节点/属性残留 | ❌ 待重放 |
| W28 | room-settings-dialog | `/workspaces/:id/chat` | ⚠️ 旧版有 1 条节点/属性残留 | ❌ 待重放 |
| W29 | guardrail-budget-base | `/workspaces/:id/guardrails/default/budget` | ⚠️ 旧版此状态无 UI 残留 | ❌ 待重放 |
| W01 | 工作区根入口 | `/workspaces/:id` | ❌ 未独立重放；历史为跳转入口 | ❌ 待重放 |
| S07 | 共享页脚 | 带页脚的范围内页面 | ⚠️ 兑换页扫描包含页脚，未单独检查所有组合 | ❌ 待重放 |
| S08 | 维护公告 | 范围内页面 | ❌ 最后一轮未出现 | ❌ 待重放 |

## 额外检查与限制

| 项目 | 整理前证据与当前边界 |
| --- | --- |
| 站内跳转 | 旧版在工作区多页和账户资料到用量的站内跳转后继续翻译；当前版仅本地回归，实站待重放 |
| 弹窗、下拉 | 旧版已看密钥、通知、工具、预设参数与模型筛选等；全局搜索有上述遗漏；当前版不可沿用通过结论 |
| tooltip | 旧版 W03 通过键盘出现非空 HTML 图表提示；W02 只有空 wrapper，W09 费用/元数据提示未可靠保持可见 |
| 手机布局 | 旧版在 390×844 抽查文件、上传空面板、导航、密钥列表与新建密钥空表单，未见溢出或按钮裁切；其他页面及当前版未逐一验收 |
| 控制台、性能 | 旧版最后当前标签页捕获 error 为 0；实站 CPU 和长任务未测。合成性能测试不代替实站测量 |
| 只读交互 | 旧版导航、打开/关闭、下拉与筛选可用，合成搜索词保留并清空；复制成功反馈未确认，未复制任何凭据 |
| 误翻译 | 旧版抽查模型/提供商名、slug、代码、输入和 URL 保留；当前版以合成保护回归为准，不称为全账户内容逐字节验证 |
| 英文闪烁 | 旧版刷新、路由、长页和弹层初期可见英文；未测定时长。启动延迟仍可能造成闪烁 |
| 截图 | 本次未新增实站截图，不将旧版截图作为当前文件效果证明 |

## 豁免规则

- 品牌、模型/提供商名称与描述、公开模型 slug、文档搜索结果保留；外围控件仍翻译。
- API、SDK、JSON、HTTP、URL、ID、Token、BYOK、ZDR、单位、快捷键和代码枚举保留。esc 是已观察快捷键。
- 用户名称、资源名、描述、身份/会话数据、提示词、消息、日志正文、凭据、URL、数字、金额、日期数据保留；不把整段未知英文都豁免。
- 普通 input 的 value、textarea 内容、可编辑区和代码不读取、不改写；白名单属性单独处理。日期范围的英文表达式实为只读普通 input 的 value，按此规则保留。
- 已观察的示例资源名、域名及提示词样例保留。

## 未覆盖与无法覆盖

| 内容 | 原因或边界 |
| --- | --- |
| Stripe 与独立账单 | 跨域支付框架不由此文本脚本处理；未购买、退款、下载发票或确认付款 |
| canvas、图片、原生界面 | 图中文字和浏览器原生气泡不属于可改写的页面文本节点；代表图表是 SVG，不能推及所有区域 |
| Toast 与后台错误 | 未保存、发送、删除、邀请、兑换或测试连接；成功/失败 Toast 与服务器英文错误未人为制造 |
| 真实数据前提 | 非空文件/目录、预设、分类器、追踪目标、session/video/batch 与完整 I/O 固定界面需要现成数据；不创建资源补场景 |
| 分页及懒加载 | 日志尾部未可靠确认，不能用已渲染 DOM 扫描当作全量滚动 |
| 防护规则与 BYOK | 后续创建步骤、自定义策略、真实拦截/脱敏、IAM 变体与全目录最新展开定位未充分验证；不输入凭据或运行测试 |
| 设置、密钥与 Chat | 不保存预算/身份/URL，不生成 secret，不执行删除/停用/移动；一次性密钥、非空聊天、流式生成、重试和真实工具运行未覆盖 |
| 权限、组织与手机组合 | 真实通知、组织成员/邀请/角色、企业策略、升级/合同和多数手机弹层组合未覆盖 |
| Shadow DOM | 代表页面未发现业务 Shadow DOM；封闭根、未访问区域和未来变化未验证 |

## 术语与维护

Credits 在账户充值/消费语境用“余额”，Credit limit 用“消费限额”；Provider 用“提供商”，Guardrails 用“防护规则”，Workspace 用“工作区”，Preset 用“预设”，Token 保留英文。本次没有调整既有译法。

调试默认关闭。在浏览器开发者工具的 localStorage 中将 `openrouter.zhCN.debug` 设为 `1` 并刷新开启，设为 `0` 并刷新关闭。只打印脱敏界面候选及分区标识，总计最多 100 条；不写入存储，不公开粘贴未检查的日志。新文案需来自真实页面，脱敏来源留在仓库外。

后续先实站重现上述六种遗漏及未覆盖状态，再补词、提升版本、重新安装同一候选文件并重放。选择器可能因站点改版失效；部分历史动态模板没有第二个实例，不能把正则通过当成充分证据。不要用子串替换解决遗漏。

## 最终自检

| 检查 | 结果 |
| --- | --- |
| 语法与仓库检查 | 是，Node 语法、仓库合规与隐私检查通过 |
| @match 正确且不过宽 | 是，只匹配目标站域名 |
| 无凭据、个人数据或中间产物入仓 | 是，Node 语法、仓库合规与隐私检查通过 |
| 精确键无重复冲突 | 是，逐分区与全词典比较 |
| 未把未验证写成已覆盖 | 是，当前版实站全部待重放 |

当前不是全站零残留验收或正式 Release。
