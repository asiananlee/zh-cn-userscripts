// ==UserScript==
// @name         OpenRouter 简体中文
// @namespace    https://github.com/asiananlee/zh-cn-userscripts
// @version      0.1.1
// @description  OpenRouter 控制台的简体中文界面；保留用户内容、代码和凭据。
// @author       asiananlee
// @license      MIT
// @homepageURL  https://github.com/asiananlee/zh-cn-userscripts
// @supportURL   https://github.com/asiananlee/zh-cn-userscripts/issues
// @match        https://openrouter.ai/*
// @run-at       document-start
// @grant        none
// ==/UserScript==
/*
 * 最后核对：2026-10-29。
 * 覆盖范围：openrouter.ai 已采集的账户、工作区控制台及共享弹层；文档正文不在范围内。
 * 已知未覆盖：部分 tooltip、Toast、服务端错误、需真实数据或付费的状态，以及未重放的手机组合。
 * 跨域 iframe、canvas 和图片文字无法按文本节点翻译。聊天标题、生成详情、全局搜索仍有已知漏译。
 * 本版统一脚本格式与调试保护，尚未在实站安装重放，不能沿用整理前的通过结论。
 * 不翻译用户内容、资源名、模型/提供商名称及描述、提示词、日志正文、代码、凭据、URL、数字与金额。
 * document-start 先安装监听，页面 load 后延迟 500ms 改字，降低初始水合冲突；仍可能出现英文闪烁。
 * 调试默认关闭：在浏览器开发者工具的 localStorage 中将 openrouter.zhCN.debug 设为 '1'，刷新后开启；
 * 设为 '0' 并刷新关闭。仅在控制台输出脱敏的未命中界面文字，总计最多 100 条，不写入存储。
 */
(() => {
  'use strict';
  if (window.top !== window.self) return;

  // 公共导航、账户管理与组织弹层中已采集的固定界面文案。
  const COMMON_EXACT = new Map([
      ["Create workspace","创建工作区"],
      ["Theme","主题"],
      ["Sign Out","退出登录"],
      ["About upstream requests","关于上游请求"],
      ["Account","账户"],
      ["Account | OpenRouter","账户 | OpenRouter"],
      ["Actions","操作"],
      ["Activity","用量"],
      ["Activity | OpenRouter","用量 | OpenRouter"],
      ["Activity sections","用量栏目"],
      ["All","全部"],
      ["API Key","API 密钥"],
      ["API keys","API 密钥"],
      ["App","应用"],
      ["Apply","应用"],
      ["Apps","应用"],
      ["Batches","批处理"],
      ["Benchmarks","基准测试"],
      ["Beta","测试版"],
      ["Cache hit rate","缓存命中率"],
      ["Cached","已缓存"],
      ["Cancel","取消"],
      ["Chat","聊天"],
      ["Classifiers","分类器"],
      ["Close","关闭"],
      ["Close modal","关闭窗口"],
      ["Connect a tool","连接工具"],
      ["Copy code","复制代码"],
      ["Cost","费用"],
      ["Create","创建"],
      ["Created","创建时间"],
      ["Credits","余额"],
      ["Custom range...","自定义时间范围…"],
      ["Daily","每日"],
      ["Dashboard","控制台"],
      ["Date","日期"],
      ["Date range","时间范围"],
      ["Dismiss","关闭"],
      ["Display timezone","显示时区"],
      ["Docs","文档"],
      ["Exclude","排除"],
      ["Explore","探索"],
      ["Explore ›","探索 ›"],
      ["Files","文件"],
      ["Filter by User, Model, or API Key","按用户、模型或 API 密钥筛选"],
      ["Filter by User, Model, Provider, or API Key","按用户、模型、提供商或 API 密钥筛选"],
      ["Generations","生成记录"],
      ["Go to the Next Month","下个月"],
      ["Go to the Previous Month","上个月"],
      ["Guardrails","防护规则"],
      ["Include","包含"],
      ["Information","说明"],
      ["Key","密钥"],
      ["Learn more","了解更多"],
      ["Learn more about session tracking in our docs","阅读文档，了解会话跟踪"],
      ["Logs","日志"],
      ["Logs | OpenRouter","日志 | OpenRouter"],
      ["Management keys","管理密钥"],
      ["Model","模型"],
      ["Models","模型"],
      ["Monthly","每月"],
      ["Move legend to right","将图例移至右侧"],
      ["Name","名称"],
      ["Navigation bar","导航栏"],
      ["New","新"],
      ["No expiration","永不过期"],
      ["No prior data","暂无历史数据"],
      ["None","无"],
      ["Notifications","通知"],
      ["Observability","可观测性"],
      ["OpenRouter Spend","OpenRouter 支出"],
      ["Overview","概览"],
      ["Personal","个人"],
      ["Preferences","偏好设置"],
      ["Presets","预设"],
      ["Prev Month","上个月"],
      ["Prev Week","上周"],
      ["Prev Year","去年"],
      ["Primary Model","主要模型"],
      ["Primary Provider","主要提供商"],
      ["Privacy","隐私"],
      ["Profile","个人资料"],
      ["Provider","提供商"],
      ["Providers","提供商"],
      ["Rankings","排行榜"],
      ["Recommended size 1:1, up to 10MB.","建议使用 1:1 比例，最大 10MB。"],
      ["Refresh logs","刷新日志"],
      ["Region","区域"],
      ["Request volume by model","各模型请求量"],
      ["Requests","请求"],
      ["Router","路由器"],
      ["Routing","路由"],
      ["Search","搜索"],
      ["Search filters...","搜索筛选项…"],
      ["Search providers","搜索提供商"],
      ["Security","安全"],
      ["Send these requests to Langfuse, Datadog, or LangSmith","将这些请求发送至 Langfuse、Datadog 或 LangSmith"],
      ["Session ID","会话 ID"],
      ["Sessions","会话"],
      ["Settings","设置"],
      ["Sign out","退出登录"],
      ["Skip to content","跳至正文"],
      ["Spend","支出"],
      ["Status","状态"],
      ["Suggestions","建议"],
      ["Supporting Models","辅助模型"],
      ["Switch account","切换账户"],
      ["Switch workspace","切换工作区"],
      ["Table settings","表格设置"],
      ["Theme: Dark","主题：深色"],
      ["This Month","本月"],
      ["This Week","本周"],
      ["This Year","今年"],
      ["Today","今天"],
      ["Token volume","Token 用量"],
      ["Tokens","Token"],
      ["Tools","工具"],
      ["Top API Keys","API 密钥排行"],
      ["Top Apps","应用排行"],
      ["Total","总计"],
      ["Total spend","总支出"],
      ["Trends","趋势"],
      ["Unknown","未知"],
      ["Upgrade to Business","升级至 Business"],
      ["Upload","上传"],
      ["Upstream Requests","上游请求"],
      ["Usage by model","各模型用量"],
      ["Usage type","用量类型"],
      ["Videos","视频"],
      ["Weekly","每周"],
      ["Workspace","工作区"],
      ["Workspaces","工作区"],
      ["Yesterday","昨天"],
      ["You don't have any sessions yet","暂无会话"],
      ["Your usage across models on OpenRouter","你在 OpenRouter 上使用各模型的用量"],
      ["Hide BYOK","隐藏BYOK"],
      ["Show only BYOK","仅显示BYOK"],
      ["Hide OpenRouter Spend","隐藏OpenRouter 支出"],
      ["Show only OpenRouter Spend","仅显示OpenRouter 支出"],
      ["New key","新建密钥"],
      ["Expires","到期时间"],
      ["Expiration","有效期"],
      ["Select expiration","选择有效期"],
      ["Credit limit","额度上限"],
      ["Reset limit every...","限额重置周期…"],
      ["No limit","不限"],
      ["Disable","禁用"],
      ["Enabled","已启用"],
      ["Budgets","预算"],
      ["BYOK-only routing","仅使用 BYOK 路由"],
      ["(optional)","（可选）"],
      ["Global","全球"],
      ["API Keys","API 密钥"],
      ["Default","默认"],
      ["Add","添加"],
      ["Finish Reason","结束原因"],
      ["Input","输入"],
      ["Output","输出"],
      ["tokens","Token"],
      ["Include BYOK spend","计入 BYOK 支出"],
      ["Add pattern","添加匹配项"],
      ["Description","描述"],
      ["Reasoning","推理"],
      ["Pricing","价格"],
      ["Recent sessions","近期会话"],
      ["Open navigation menu","打开导航菜单"],
      ["Close navigation menu","关闭导航菜单"],
      ["Back to Account","返回账户"],
      ["Browse models","浏览模型"],
      ["Recent","最近使用"],
      ["Hide filters","收起筛选"],
      ["Hide Unavailable","隐藏不可用项"],
      ["Search models...","搜索模型…"],
      ["Search...","搜索…"],
      ["Web Search Settings","网页搜索设置"],
      ["Native","原生"],
      ["Instant","即时"],
      ["Fast","快速"],
      ["Deep Lite","轻量深搜"],
      ["Deep","深度搜索"],
      ["Deep Reasoning","深度推理"],
      ["Context Size","上下文大小"],
      ["Results per search","单次搜索结果数"],
      ["Total results limit","结果总数上限"],
      ["Max searches","最大搜索次数"],
      ["Max Characters","最大字符数"],
      ["Exact per-result char limit","单条结果的精确字符上限"],
      ["Additional settings","更多设置"],
      ["Allowed Domains","允许的域名"],
      ["Blocked Domains","屏蔽的域名"],
      ["Web Fetch Settings","网页抓取设置"],
      ["Max Fetches","最大抓取次数"],
      ["Max Content Tokens","最大内容 Token 数"],
      ["Datetime Settings","日期时间设置"],
      ["Timezone","时区"],
      ["Auto (e.g. America/New_York)","自动（如 America/New_York）"],
      ["Fusion Settings","Fusion 设置"],
      ["Analysis Models","分析模型"],
      ["Analyst Model","分析汇总模型"],
      ["Max Tool Calls","最大工具调用次数"],
      ["Advisor Settings","Advisor 设置"],
      ["Advisors","Advisor 列表"],
      ["Add advisor","添加 Advisor"],
      ["Subagent Settings","子智能体设置"],
      ["Subagents","子智能体列表"],
      ["Add subagent","添加子智能体"],
      ["Shell Settings","Shell 设置"],
      ["Image Generation Settings","图像生成设置"],
      ["Basics","基本设置"],
      ["Quality","质量"],
      ["Aspect Ratio","宽高比"],
      ["Background","背景"],
      ["Transparent","透明"],
      ["Opaque","不透明"],
      ["Output Format","输出格式"],
      ["Output Compression","输出压缩"],
      ["Default (0-100)","默认（0-100）"],
      ["Safety","安全"],
      ["Moderation","内容审核"],
      ["e.g. 5","例如：5"],
      ["e.g. 100","例如：100"],
      ["e.g. docs.example.com, api.example.com","例如：docs.example.com, api.example.com"],
      ["e.g. ads.example, spam.example","例如：ads.example, spam.example"],
      ["e.g. example.com, *.substack.com","例如：example.com, *.substack.com"],
      ["e.g. reddit.com, *.pinterest.com","例如：reddit.com, *.pinterest.com"],
      ["Allow All Except...","允许全部，排除…"],
      ["Only Allow...","仅允许…"],
      ["Search models","搜索模型"],
      ["Show filters","显示筛选"],
      ["Pin model","固定模型"],
      ["models","个模型"],
      ["Free","免费"],
      ["Light","浅色"],
      ["Dark","深色"],
      ["System","跟随系统"],
      ["Manage","管理"],
      ["Labs","实验室"],
      ["Select","选择"],
      ["Delete","删除"],
      ["Redact","脱敏"],
      ["Block","拦截"],
      ["Flag","标记"],
      ["Text","文本"],
      ["Image","图像"],
      ["File","文件"],
      ["Audio","音频"],
      ["Video","视频"],
      ["Speech","语音"],
      ["Transcription","语音转录"],
      ["Embeddings","向量嵌入"],
      ["Rerank","重排序"],
      ["Decisions","决策"],
      ["No models here","此处暂无模型"],
      ["All models","全部模型"],
      ["Search models, providers, pages, docs...","搜索模型、提供商、页面和文档…"],
      ["Model suggestions","模型推荐"],
      ["Trending","趋势"],
      ["Popular","热门"],
      ["Clear search","清空搜索"],
      ["Group","分组"],
      ["Variant","变体"],
      ["Origin","来源"],
      ["Country","国家或地区"],
      ["API Skin","API 接口类型"],
      ["Streamed","流式响应"],
      ["User","用户"],
      ["Custom User ID","自定义用户 ID"],
      ["Context Length","上下文长度"],
      ["Generation ID","生成记录 ID"],
      ["Hourly","每小时"],
      ["Bottom","末尾"],
      ["OpenRouter can forward a trace of every request to your observability tool, plus","OpenRouter 可转发每次请求的追踪数据，另支持"],
      ["more destinations. No code changes needed.","个目标，无需修改代码。"],
      ["We will be conducting scheduled site maintenance on","网站计划维护时间："],
      [". Inference will continue to work as normal. API key changes, credit purchases, and signups may be unavailable for up to 60 minutes.","。推理服务将正常运行；API 密钥修改、充值和注册可能最多暂停 60 分钟。"],
      ["Active devices","活跃设备"],
      ["Add a passkey","添加通行密钥"],
      ["Add two-step verification","添加两步验证"],
      ["Connect account","关联账户"],
      ["Connect MetaMask","连接 MetaMask"],
      ["Connect wallet","连接钱包"],
      ["Connected accounts","已关联账户"],
      ["Delete account","删除账户"],
      ["Email addresses","邮箱地址"],
      ["First name","名"],
      ["Last name","姓"],
      ["Manage your account info.","管理账户信息。"],
      ["Open menu","打开菜单"],
      ["Passkeys","通行密钥"],
      ["Password","密码"],
      ["Primary","主要"],
      ["Profile details","个人资料详情"],
      ["Remove","移除"],
      ["Save","保存"],
      ["Set password","设置密码"],
      ["Two-step verification","两步验证"],
      ["Update profile","更新个人资料"],
      ["Web3 wallets","Web3 钱包"],
      ["This device","当前设备"],
      ["Create organization","创建组织"],
      ["Logo","标志"],
      ["Organization name","组织名称"],
      ["Upload organization logo","上传组织标志"],
    ]);
  const COMMON_RULES = [
      { type: "attr:aria-label", re: /^Copy model ID (~?[a-z0-9._-]+\/[a-z0-9._:+~-]+)$/, to: m => '复制模型 ID ' + m[1] },
      { type: "attr:title", re: /^Copy (~?[a-z0-9._-]+\/[a-z0-9._:+~-]+)$/, to: m => '复制 ' + m[1] },
      { type: "attr:aria-label", when: e => e.localName === 'button' && !!e.closest('table'), re: /^(.+), selected$/, to: m => m[1] + '，已选择' },
    ];

  const SCOPES = [
    // A03 activity ^\/(?:activity|workspaces\/[^/]+\/activity)(?:\/(?:trends|explore|guardrails))?$
    {
      id: "A03", slug: "activity", path: /^\/(?:activity|workspaces\/[^/]+\/activity)(?:\/(?:trends|explore|guardrails))?$/,
      exact: new Map([
      ["% of Total","占总量比例"],
      ["Avg Generation Time","平均生成耗时"],
      ["Avg Inter-Token Latency","平均 Token 间延迟"],
      ["Avg Latency","平均延迟"],
      ["Avg Router Latency","平均路由延迟"],
      ["Avg Throughput (tok/s)","平均吞吐量（tok/s）"],
      ["Avg Total Time to First Token","平均首个 Token 总延迟"],
      ["Bar Chart","柱状图"],
      ["Blended $/1M","综合单价 $/1M"],
      ["Blended Cost ($/1M Tokens)","综合单价（$/1M Token）"],
      ["Blocked requests","已拦截请求"],
      ["BYOK Fees ($)","BYOK 手续费（$）"],
      ["BYOK Requests","BYOK 请求数"],
      ["BYOK Usage ($)","BYOK 费用（$）"],
      ["Cache Capture Rate","缓存捕获率"],
      ["Cache Hit Rate","缓存命中率"],
      ["Cache Usage ($)","缓存费用（$）"],
      ["Cached Tokens","已缓存 Token"],
      ["Chart display settings","图表显示设置"],
      ["Chart settings","图表设置"],
      ["Chart type","图表类型"],
      ["Collapse","收起"],
      ["Completion","输出"],
      ["Content modified or logged for review","内容已修改或记录，待审核"],
      ["Credits Usage ($)","余额支出（$）"],
      ["Cumulative sum","累计求和"],
      ["Cumulative sum requires a time rollup and an additive metric","累计求和需要按时间汇总，并使用可累加的指标。"],
      ["Data Logging Discount ($)","数据记录优惠（$）"],
      ["Dot Plot","点图"],
      ["Download CSV","下载 CSV"],
      ["Download PDF","下载 PDF"],
      ["Expand","展开"],
      ["Expand Blocked requests","展开已拦截请求"],
      ["Expand chart","展开图表"],
      ["Expand Redacted & flagged","展开已脱敏及已标记请求"],
      ["File Usage ($)","文件费用（$）"],
      ["Filters","筛选"],
      ["Guardrail enforcement","防护执行情况"],
      ["Guardrail Invoked (Count)","防护触发次数"],
      ["Guardrail Invoked Rate","防护触发率"],
      ["Line Chart","折线图"],
      ["Metric","指标"],
      ["No apps found","未找到应用"],
      ["No events in this period","此时段暂无事件"],
      ["No events in this period. This chart shows events over time and fills in as guardrails act on requests.","此时段暂无事件。图表按时间显示事件，防护规则处理请求后便会显示数据。"],
      ["OpenRouter Usage ($)","OpenRouter 费用（$）"],
      ["Possible Cache Hit Rate","潜在缓存命中率"],
      ["Possible Cached Tokens","潜在可缓存 Token"],
      ["Prompt","提示词"],
      ["Prompt token caching","提示词 Token 缓存"],
      ["Rank by:","排序依据："],
      ["Reasoning Tokens","推理 Token"],
      ["Redacted & flagged","已脱敏及已标记"],
      ["Rejected before reaching the model","已在到达模型前拦截"],
      ["Request Count","请求数"],
      ["Response Cached (Count)","响应缓存次数"],
      ["Response Cached Rate","响应缓存率"],
      ["Rollup:","汇总："],
      ["Save current chart","保存当前图表"],
      ["Search API keys","搜索 API 密钥"],
      ["Search apps...","搜索应用…"],
      ["Search workspaces","搜索工作区"],
      ["Show \"Other\"","显示“其他”"],
      ["Spend over time","支出趋势"],
      ["Subgroup","子分组"],
      ["Token breakdown","Token 明细"],
      ["Tokens (Completion)","Token（输出）"],
      ["Tokens (Prompt)","Token（提示词）"],
      ["Tokens (Total)","Token（总计）"],
      ["Top","前列"],
      ["total","总计"],
      ["Total Usage ($)","总费用（$）"],
      ["Uncached","未缓存"],
      ["Upstream File Usage ($)","上游文件费用（$）"],
      ["Upstream Usage ($)","上游费用（$）"],
      ["Upstream Web Fetch Usage ($)","上游网页抓取费用（$）"],
      ["Upstream Web Search Usage ($)","上游网页搜索费用（$）"],
      ["Value","数值"],
      ["Web Fetch Usage ($)","网页抓取费用（$）"],
      ["Web Search Usage ($)","网页搜索费用（$）"],
      ["P50 Generation Time","P50 生成耗时"],
      ["P50 Inter-Token Latency","P50 Token 间延迟"],
      ["P50 Latency","P50 延迟"],
      ["P50 Router Latency","P50 路由延迟"],
      ["P50 Throughput (tok/s)","P50 吞吐量（tok/s）"],
      ["P50 Total Time to First Token","P50 首个 Token 总延迟"],
      ["P90 Generation Time","P90 生成耗时"],
      ["P90 Inter-Token Latency","P90 Token 间延迟"],
      ["P90 Latency","P90 延迟"],
      ["P90 Router Latency","P90 路由延迟"],
      ["P90 Throughput (tok/s)","P90 吞吐量（tok/s）"],
      ["P90 Total Time to First Token","P90 首个 Token 总延迟"],
      ["P95 Generation Time","P95 生成耗时"],
      ["P95 Inter-Token Latency","P95 Token 间延迟"],
      ["P95 Latency","P95 延迟"],
      ["P95 Router Latency","P95 路由延迟"],
      ["P95 Throughput (tok/s)","P95 吞吐量（tok/s）"],
      ["P95 Total Time to First Token","P95 首个 Token 总延迟"],
      ["P99 Generation Time","P99 生成耗时"],
      ["P99 Inter-Token Latency","P99 Token 间延迟"],
      ["P99 Latency","P99 延迟"],
      ["P99 Router Latency","P99 路由延迟"],
      ["P99 Throughput (tok/s)","P99 吞吐量（tok/s）"],
      ["P99 Total Time to First Token","P99 首个 Token 总延迟"],
      ["Hide Cached","隐藏已缓存"],
      ["Show only Cached","仅显示已缓存"],
      ["Hide Completion","隐藏输出"],
      ["Show only Completion","仅显示输出"],
      ["Hide Prompt","隐藏提示词"],
      ["Show only Prompt","仅显示提示词"],
      ["Hide Reasoning","隐藏推理"],
      ["Show only Reasoning","仅显示推理"],
      ["Hide Uncached","隐藏未缓存"],
      ["Show only Uncached","仅显示未缓存"],
      ["Hide Unknown","隐藏未知"],
      ["Show only Unknown","仅显示未知"],
    ]),
      rules: [
      { re: /^Past\s+(\d+)\s+Minutes$/, to: m => '过去 ' + m[1] + ' 分钟' },
      { re: /^Past\s+(\d+)\s+Hours?$/, to: m => '过去 ' + m[1] + ' 小时' },
      { re: /^Past\s+(\d+)\s+Week$/, to: m => '过去 ' + m[1] + ' 周' },
      { re: /^Past\s+(\d+)\s+Month$/, to: m => '过去 ' + m[1] + ' 个月' },
      { re: /^Past\s+(\d+)\s+Year$/, to: m => '过去 ' + m[1] + ' 年' },
      { re: /^([\d,]+)\s+rows$/, to: m => m[1] + ' 行' },
      { re: /^Blended\s+(\$\/[\d,.]+[KM]?)$/, to: m => '综合单价 ' + m[1] },
      { type: "legend", re: /^Hide (.+)$/, to: m => '隐藏 ' + m[1] },
      { type: "legend", re: /^Show only (.+)$/, to: m => '仅显示 ' + m[1] },
    ],
      overrides: [
      { order: 0, path: /^(?:\/activity|\/workspaces\/[^/]+\/activity)\/explore$/, when: e => !isChrome(e), map: new Map([["by", "按"]]) },
      { order: 6, path: /^(?:\/activity(?:\/(?:trends|explore|guardrails))?|\/workspaces\/[^/]+\/activity(?:\/(?:trends|explore|guardrails))?)$/, when: e => !isChrome(e) || /\/activity\/guardrails(?:[?#]|$)/.test(e.closest('a[href]')?.getAttribute('href') || ''), map: new Map([["Guardrails", "防护统计"]]) },
    ],
      fragments: [
      { head: "Ranges starting over", re: /^Ranges starting over (\d+) days ago keep UTC calendar days; only time labels use (GMT[+-]\d+)\.$/, parts: ["Ranges starting over", /^\d+$/, "days ago keep UTC calendar days; only time labels use", /^GMT[+-]\d+$/, "."], to: (raw, m) => ['起点距今超过 ', m[1], ' 天的时间范围沿用 UTC 自然日；仅时间标签使用 ', m[2], '。'] },
      { head: "OpenRouter can forward a trace of every request to your observability tool, plus", re: /^OpenRouter can forward a trace of every request to your observability tool, plus (\d+) more destinations\. No code changes needed\.$/, parts: ["OpenRouter can forward a trace of every request to your observability tool, plus", /^\d+$/, "more destinations. No code changes needed."], to: (raw, m) => ['OpenRouter 可转发每次请求的追踪数据，另支持 ', m[1], ' 个目标，无需修改代码。'] },
      { head: "Search for ‘", when: isSearchEcho, re: /^Search for ‘(.+)’$/u, parts: ["Search for ‘", /^.+$/u, "’"], to: (raw, match, original = []) => ['搜索“', original.length === 3 ? original[1] : (/^Search for ‘([\s\S]*)’$/u.exec(original[0] || '')?.[1] ?? match[1]), '”'] },
    ],
    },
    // A02 profile ^\/settings\/profile$
    {
      id: "A02", slug: "profile", path: /^\/settings\/profile$/,
      exact: new Map([
      ["Active keys","有效密钥"],
      ["All Time","全部时间"],
      ["Avg / day","日均"],
      ["Avg / week","周均"],
      ["Change profile picture","更换头像"],
      ["Daily by model","每日模型用量"],
      ["Disabled / expired","已禁用／已过期"],
      ["Last created","最近创建"],
      ["Last Year","去年"],
      ["Less","少"],
      ["Longest streak","最长连续使用天数"],
      ["Month to Date","本月至今"],
      ["More","多"],
      ["requests","请求"],
      ["spend","支出"],
      ["this month","本月"],
      ["Top models","模型排行"],
      ["Usage summary","用量汇总"],
      ["View full activity","查看完整用量"],
      ["days","天"],
    ]),
      rules: [
      { re: /^Last\s+(\d+)\s+Days$/, to: m => '最近 ' + m[1] + ' 天' },
      { re: /^(\d+)\s+hours ago$/, to: m => m[1] + ' 小时前' },
      { re: /^(\d+)\s+months ago$/, to: m => m[1] + ' 个月前' },
      { re: /^(\d+)\s+(minutes?|hours?|days?|months?) ago$/, to: m =>
      m[1] + ' ' + ({ minute: '分钟前', hour: '小时前', day: '天前', month: '个月前' })[m[2].replace(/s$/, '')] },
    ],
      overrides: [
      { order: 3, path: /^\/settings\/profile$/, when: e => !isChrome(e), map: new Map([["Activity", "使用情况"]]) },
      { order: 5, path: /^\/settings\/profile$/, when: e => !isChrome(e), map: new Map([["Credits", "余额支出"]]) },
    ],
      fragments: [
      { head: "by", re: /^by (spend|tokens|requests)$/, parts: ["by", /^(?:spend|tokens|requests)$/], to: (raw, m) => ['按', ({ spend: '支出', tokens: 'Token', requests: '请求数' })[m[1]]] },
      { head: "Search for ‘", when: isSearchEcho, re: /^Search for ‘(.+)’$/u, parts: ["Search for ‘", /^.+$/u, "’"], to: (raw, match, original = []) => ['搜索“', original.length === 3 ? original[1] : (/^Search for ‘([\s\S]*)’$/u.exec(original[0] || '')?.[1] ?? match[1]), '”'] },
    ],
    },
    // A01 workspaces ^\/(?:workspaces|workspaces\/[^/]+\/settings)$
    {
      id: "A01", slug: "workspaces", path: /^\/(?:workspaces|workspaces\/[^/]+\/settings)$/,
      exact: new Map([
      ["About BYOK-only routing","关于仅使用 BYOK 路由"],
      ["Add budget","添加预算"],
      ["Cap spend across the workspace with any combination of daily, weekly, monthly, or lifetime budgets.","可组合使用每日、每周、每月或累计预算，限制工作区总支出。"],
      ["Edit workspace","编辑工作区"],
      ["Keys","密钥"],
      ["Lifetime","累计"],
      ["Manage your workspaces and their configurations.","管理工作区及其配置。"],
      ["My workspace","我的工作区"],
      ["New workspace","新建工作区"],
      ["No description","暂无描述"],
      ["Reset…","重置周期…"],
      ["Serve requests from this workspace with its own provider keys only. Requests for models without an eligible key fail instead of using OpenRouter capacity. You can change this later on the workspace's BYOK page.","此工作区仅使用自有提供商密钥处理请求。若模型没有可用密钥，请求将失败，不会使用 OpenRouter 服务。之后可在工作区的 BYOK 页面修改。"],
      ["The initial workspace for your account. Includes all API Keys, Presets, and other configurations previously created.","账户的初始工作区，包含此前创建的全部 API 密钥、预设及其他配置。"],
      ["View activity","查看用量"],
      ["What is this workspace for?","此工作区的用途是什么？"],
      ["Workspace actions","工作区操作"],
      ["Workspaces | OpenRouter","工作区 | OpenRouter"],
      ["Workspaces let you organize API keys, guardrails, and settings.","使用工作区组织 API 密钥、防护规则和设置。"],
    ]),
      rules: [],
      overrides: [],
      fragments: [
      { head: "Used in URLs like /workspaces/", re: /^Used in URLs like \/workspaces\/<slug>\. Lowercase letters, numbers, and hyphens only\.$/, parts: ["Used in URLs like /workspaces/", "<slug>", ". Lowercase letters, numbers, and hyphens only."], to: () => ['用于 /workspaces/', '<slug>', ' 之类的 URL，仅支持小写字母、数字和连字符。'] },
      { head: "Search for ‘", when: isSearchEcho, re: /^Search for ‘(.+)’$/u, parts: ["Search for ‘", /^.+$/u, "’"], to: (raw, match, original = []) => ['搜索“', original.length === 3 ? original[1] : (/^Search for ‘([\s\S]*)’$/u.exec(original[0] || '')?.[1] ?? match[1]), '”'] },
    ],
    },
    // A08 credits ^\/settings\/credits$
    {
      id: "A08", slug: "credits", path: /^\/settings\/credits$/,
      exact: new Map([
      ["Add credits","充值"],
      ["Amount","金额"],
      ["Auto Top-Up","自动充值"],
      ["Automatically purchase credits when your balance is below a certain threshold. You can select multiple payment methods that will be tried in order if payment fails.","余额低于设定阈值时自动充值。可选择多种付款方式，付款失败时将依次尝试。"],
      ["Buy Credits","充值"],
      ["Contact sales","联系销售"],
      ["Credits | OpenRouter","余额 | OpenRouter"],
      ["Enable","启用"],
      ["Enable two-step verification on your account to transfer credits","转移余额前，请先为账户启用两步验证"],
      ["Get invoice","获取发票"],
      ["Grant and promo credits are spent automatically before purchased credits.","赠送余额和活动赠送余额会自动优先于充值余额使用。"],
      ["History","历史记录"],
      ["Move credits to organization","将余额转移至组织"],
      ["Need enterprise billing options?","需要企业计费方案？"],
      ["Pay with crypto","使用加密货币付款"],
      ["Pay-as-you-go balance","按量付费余额"],
      ["Payment and pricing information","付款与价格说明"],
      ["Payments are processed securely by Stripe. We do not store your credit card information. Crypto payments support any wallet type.","付款由 Stripe 安全处理，我们不会存储信用卡信息。加密货币付款支持任意类型的钱包。"],
      ["pricing per model","各模型价格"],
      ["Pricing:","价格："],
      ["Receipt","收据"],
      ["Recent Transactions","近期交易"],
      ["Redeem Promo Code","兑换优惠码"],
      ["Refresh credits","刷新余额"],
      ["Refund","退款"],
      ["Security:","安全："],
      ["Total available","可用总额"],
      ["Use crypto","使用加密货币"],
      ["View Usage","查看用量"],
      ["fees","手续费"],
    ]),
      rules: [
      { re: /^([\d,]+)\s+transaction$/, to: m => m[1] + ' 笔交易' },
      { re: /^([\d,.]+)%\s+\((\$[\d,.]+)\s+minimum\)$/, to: m => m[1] + '%（最低 ' + m[2] + '）' },
      { type: "attr:aria-label", re: /^Total available credits:\s+(\$[\d,.]+)$/, to: m => '可用余额总额：' + m[1] },
      { re: /^Personal Account:\s+(.+@.+)$/, to: m => '个人账户：' + m[1] },
    ],
      overrides: [],
      fragments: [
      { head: "Pricing:", re: /^Pricing: See pricing per model and fees \(([\d,.]+)% \((\$[\d,.]+) minimum\) for credit purchases\)\.$/, parts: ["Pricing:", "See", "pricing per model", "and", "fees", "(", /^[\d,.]+% \(\$[\d,.]+ minimum\)$/, "for credit purchases)."], to: (raw, m) => ['价格：', '查看', '各模型价格', '及', '手续费', '（', m[1] + '%，最低 ' + m[2], '，适用于充值）。'] },
      { head: "Search for ‘", when: isSearchEcho, re: /^Search for ‘(.+)’$/u, parts: ["Search for ‘", /^.+$/u, "’"], to: (raw, match, original = []) => ['搜索“', original.length === 3 ? original[1] : (/^Search for ‘([\s\S]*)’$/u.exec(original[0] || '')?.[1] ?? match[1]), '”'] },
    ],
    },
    // A09 redeem ^\/redeem$
    {
      id: "A09", slug: "redeem", path: /^\/redeem$/,
      exact: new Map([
      ["A few details about using your promotional credits.","活动赠送余额使用说明。"],
      ["About","关于"],
      ["About OpenRouter","关于 OpenRouter"],
      ["Account email","账户邮箱"],
      ["AI Site Map","AI 站点地图"],
      ["API Reference","API 参考"],
      ["API reference overview","API 参考概览"],
      ["Authentication documentation","身份验证文档"],
      ["Blog","博客"],
      ["Brand","品牌"],
      ["Build with the OpenRouter SDK.","使用 OpenRouter SDK 开发。"],
      ["Careers","招聘"],
      ["Change","更改"],
      ["Collections","精选集"],
      ["Company","公司"],
      ["Connect","连接"],
      ["credits settings page","余额设置页"],
      ["Customers","客户"],
      ["Data","数据"],
      ["Developer","开发者"],
      ["Developer Platform","开发者平台"],
      ["Discover","探索"],
      ["Do free models use my credits?","免费模型会消耗余额吗？"],
      ["Documentation","文档"],
      ["Each code can be redeemed once per account and may have its own expiration or redemption limit. The redemption card will tell you if a code is no longer available.","每个账户只能兑换同一兑换码一次，兑换码可能设有有效期或兑换次数上限。兑换码不可用时，兑换卡片会显示提示。"],
      ["Explore available models and pricing.","查看可用模型及价格。"],
      ["Explore the model catalogue","查看模型目录"],
      ["Find answers about billing, limits, and fallbacks.","了解计费、限额和故障转移。"],
      ["Footer","页脚"],
      ["Free models do not charge OpenRouter credits when they are available under their free usage limits. Paid models and usage beyond free limits can use your account balance.","在免费用量限制内使用免费模型不会扣除 OpenRouter 余额。付费模型和超出免费额度的用量可能扣除账户余额。"],
      ["Frequently asked questions","常见问题"],
      ["Get started with API calls and SDK examples.","通过 API 调用和 SDK 示例快速开始。"],
      ["Hiring","招聘中"],
      ["Join the OpenRouter newsletter","订阅 OpenRouter 通讯"],
      ["Learn how to obtain and scope API keys.","了解如何获取 API 密钥并设置权限范围。"],
      ["Model usage data, product updates, and research reports. One email each week.","每周一封邮件，涵盖模型用量数据、产品更新和研究报告。"],
      ["models directory","模型目录"],
      ["Models directory","模型目录"],
      ["Privacy Policy","隐私政策"],
      ["Product","产品"],
      ["Promo code","兑换码"],
      ["Quickstart guide","快速入门指南"],
      ["Redeem code","兑换"],
      ["Redeem your credits | OpenRouter","兑换余额 | OpenRouter"],
      ["Redeem your OpenRouter credits","兑换 OpenRouter 余额"],
      ["Redeem your promotional code and get access to a flexible way to build with hundreds of AI models through one API.","兑换优惠码，通过一个 API 灵活使用数百种 AI 模型进行开发。"],
      ["Resources","资源"],
      ["Review the full request and response schema.","查看完整的请求与响应结构。"],
      ["SDK documentation","SDK 文档"],
      ["Start building with OpenRouter","开始使用 OpenRouter 开发"],
      ["Subscribe","订阅"],
      ["Support","支持"],
      ["Terms of Service","服务条款"],
      ["The email address on your account","账户绑定的邮箱地址"],
      ["Trust Center","信任中心"],
      ["What can I use OpenRouter credits for?","OpenRouter 余额可以用来做什么？"],
      ["What if my code was already redeemed or has expired?","兑换码已使用或已过期怎么办？"],
      ["Where can I see my credit balance?","在哪里查看余额？"],
      ["Whether you are building an AI agent, a RAG pipeline, or a coding assistant, OpenRouter helps you focus on creating value instead of managing infrastructure.","无论是开发 AI 智能体、RAG 流程还是编程助手，OpenRouter 都能让你专注于创造价值，减少基础设施管理工作。"],
      ["With a single API key, you can access models from free open-source options to the latest frontier models, prototype quickly, swap models in one line of code, and choose the right tool without managing multiple provider accounts.","只需一个 API 密钥，即可使用从免费开源模型到最新前沿模型的各种选择，快速制作原型，只改一行代码即可切换模型，无需管理多个提供商账户。"],
      ["Works With OR","适配 OR"],
      ["Credits will be added to","余额将充入"],
      ["OpenRouter is a battle-tested AI model exchange with 400+ models from 60+ providers, processing 25+ trillion tokens weekly. Instead of hand-rolling routing logic and juggling provider keys, route through OpenRouter once and let Auto Router pick the best execution path, with automatic failover when providers degrade.","OpenRouter 是经过大量实际使用验证的 AI 模型平台，提供来自 60+ 家提供商的 400+ 个模型，每周处理 25+ 万亿 Token。无需自行编写路由逻辑或管理多个提供商密钥，只需接入 OpenRouter，即可由 Auto Router 选择最佳执行路径，并在提供商服务异常时自动切换。"],
    ]),
      rules: [],
      overrides: [],
      fragments: [
      { head: "After redeeming, view your balance and credit history on the", re: /^After redeeming, view your balance and credit history on the credits settings page\.$/, parts: ["After redeeming, view your balance and credit history on the", "credits settings page", "."], to: () => ['兑换后，可在', '余额设置页', '查看余额和充值记录。'] },
      { head: "OpenRouter credits can be used for eligible model requests through the OpenRouter API. Explore the", re: /^OpenRouter credits can be used for eligible model requests through the OpenRouter API\. Explore the models directory to compare available models\.$/, parts: ["OpenRouter credits can be used for eligible model requests through the OpenRouter API. Explore the", "models directory", "to compare available models."], to: () => ['OpenRouter 余额可用于通过 OpenRouter API 发起的符合条件的模型请求。请查看', '模型目录', '，比较可用模型。'] },
      { head: "By subscribing you agree to receive the OpenRouter newsletter: model usage data, product updates, and research reports, about one email a week. Unsubscribe anytime via the link in every email. See our", re: /^By subscribing you agree to receive the OpenRouter newsletter: model usage data, product updates, and research reports, about one email a week\. Unsubscribe anytime via the link in every email\. See our Privacy Policy\.$/, parts: ["By subscribing you agree to receive the OpenRouter newsletter: model usage data, product updates, and research reports, about one email a week. Unsubscribe anytime via the link in every email. See our", "Privacy Policy", "."], to: () => ['订阅即表示同意接收 OpenRouter 通讯，内容涵盖模型用量数据、产品更新和研究报告，约每周一封。可随时通过邮件中的链接退订。详情请阅', '隐私政策', '。'] },
      { head: "Whether you are building an AI agent, a RAG pipeline, or a coding assistant, OpenRouter helps you focus on creating value instead of managing infrastructure.", re: /^Whether you are building an AI agent, a RAG pipeline, or a coding assistant, OpenRouter helps you focus on creating value instead of managing infrastructure\. Explore the model catalogue\.$/, parts: ["Whether you are building an AI agent, a RAG pipeline, or a coding assistant, OpenRouter helps you focus on creating value instead of managing infrastructure.", "Explore the model catalogue", "."], to: () => [DICTIONARIES.redeem.get('Whether you are building an AI agent, a RAG pipeline, or a coding assistant, OpenRouter helps you focus on creating value instead of managing infrastructure.'), '查看模型目录', '。'] },
      { head: "Search for ‘", when: isSearchEcho, re: /^Search for ‘(.+)’$/u, parts: ["Search for ‘", /^.+$/u, "’"], to: (raw, match, original = []) => ['搜索“', original.length === 3 ? original[1] : (/^Search for ‘([\s\S]*)’$/u.exec(original[0] || '')?.[1] ?? match[1]), '”'] },
    ],
    },
    // A10 management-keys ^\/settings\/management-keys$
    {
      id: "A10", slug: "management-keys", path: /^\/settings\/management-keys$/,
      exact: new Map([
      ["Choose a clear and descriptive name to identify this management key.","为此管理密钥取一个清晰、易于识别的名称。"],
      ["Control your management API keys for administrative actions","管理用于执行管理操作的 API 密钥"],
      ["Create a management API key to perform administrative actions and manage inference API keys programmatically.","创建管理 API 密钥，以编程方式执行管理操作并管理推理 API 密钥。"],
      ["Create a Management Key","创建管理密钥"],
      ["Management keys | OpenRouter","管理密钥 | OpenRouter"],
      ["No management keys yet","暂无管理密钥"],
      ["e.g. \"Management Key\"","例如：“管理密钥”"],
    ]),
      rules: [
      { re: /^(\d+)\s+days?$/, to: m => m[1] + ' 天' },
      { re: /^(\d+)\s+hour$/, to: m => m[1] + ' 小时' },
      { re: /^(\d+)\s+year$/, to: m => m[1] + ' 年' },
    ],
      overrides: [],
      fragments: [
      { head: "Search for ‘", when: isSearchEcho, re: /^Search for ‘(.+)’$/u, parts: ["Search for ‘", /^.+$/u, "’"], to: (raw, match, original = []) => ['搜索“', original.length === 3 ? original[1] : (/^Search for ‘([\s\S]*)’$/u.exec(original[0] || '')?.[1] ?? match[1]), '”'] },
    ],
    },
    // A11 notifications ^\/settings\/notifications$
    {
      id: "A11", slug: "notifications", path: /^\/settings\/notifications$/,
      exact: new Map([
      ["A model endpoint you recently used has reduced its input or output price.","你最近使用的模型端点已降低输入或输出价格。"],
      ["A model you recently used is scheduled for deprecation. Migrate to an available alternative.","你最近使用的模型即将停用，请迁移至可用的替代模型。"],
      ["Alert email address","提醒邮箱"],
      ["Always enabled","始终启用"],
      ["Available on Business and Enterprise plans: budget alerts plus Slack and custom webhook delivery.","Business 和 Enterprise 套餐支持预算提醒，以及 Slack 和自定义 Webhook 通知。"],
      ["Budget & Spend","预算与支出"],
      ["Choose which events notify you and how they’re delivered.","选择需要接收提醒的事件及通知方式。"],
      ["Configure Low balance alert","配置余额不足提醒"],
      ["Configure Model deprecation alert","配置模型停用提醒"],
      ["Configure Model price drop alert","配置模型降价提醒"],
      ["Credit threshold","余额阈值"],
      ["Credit threshold amount","余额阈值金额"],
      ["Delivery destinations","通知目标"],
      ["Delivery methods","通知方式"],
      ["Email","邮箱"],
      ["Email → You","邮件 → 你"],
      ["Emails go to your account email address.","邮件将发送至账户邮箱。"],
      ["Enable Low balance alert","启用余额不足提醒"],
      ["Enable Model deprecation alert","启用模型停用提醒"],
      ["Enable Model price drop alert","启用模型降价提醒"],
      ["Keep your integrations current when models change or drop in price.","模型变更或降价时及时更新集成。"],
      ["Loading notification settings","正在加载通知设置"],
      ["Low balance alert","余额不足提醒"],
      ["Low balance alerts go to your account email","余额不足提醒将发送至账户邮箱"],
      ["Model deprecation alert","模型停用提醒"],
      ["Model price drop alert","模型降价提醒"],
      ["Notifications | OpenRouter","通知 | OpenRouter"],
      ["Notify when the amount goes below this value.","金额低于此值时通知。"],
      ["Route alerts to Slack or your own webhook endpoint, and add budget alerts for each workspace.","将提醒发送至 Slack 或自有 Webhook 端点，并为各工作区添加预算提醒。"],
      ["Send to","发送至"],
      ["Stay ahead of credit burn.","及时掌握余额消耗情况。"],
      ["You","你"],
      ["Your credit balance drops below this amount.","余额低于此金额时提醒。"],
    ]),
      rules: [
      { re: /^Below (\$[\d,.]+) · Email → (.+@.+)$/, to: m => '低于 ' + m[1] + ' · 邮件 → ' + m[2] },
    ],
      overrides: [],
      fragments: [
      { head: "Search for ‘", when: isSearchEcho, re: /^Search for ‘(.+)’$/u, parts: ["Search for ‘", /^.+$/u, "’"], to: (raw, match, original = []) => ['搜索“', original.length === 3 ? original[1] : (/^Search for ‘([\s\S]*)’$/u.exec(original[0] || '')?.[1] ?? match[1]), '”'] },
    ],
    },
    // A12 privacy ^\/(?:settings\/privacy|workspaces\/[^/]+\/guardrails\/default\/models)$
    {
      id: "A12", slug: "privacy", path: /^\/(?:settings\/privacy|workspaces\/[^/]+\/guardrails\/default\/models)$/,
      exact: new Map([
      ["Add phrases your users legitimately send that should not trigger the prompt injection guardrail. Matching is case-insensitive and exact.","添加用户正常使用、无需触发提示词注入防护的短语。匹配不区分大小写，采用完全匹配。"],
      ["All other model requests will require ZDR endpoints.","其他所有模型请求均需使用 ZDR 端点。"],
      ["All other models","其他所有模型"],
      ["Allow 1% data discount in workspaces","允许工作区获得 1% 数据优惠"],
      ["Allow free endpoints that publish prompts","允许公开提示词的免费端点"],
      ["Allow free endpoints that train on request data","允许使用请求数据训练的免费端点"],
      ["Allow paid endpoints that train on request data","允许使用请求数据训练的付费端点"],
      ["Allow workspaces to consent to OpenRouter using your inputs/outputs to improve the product. Each workspace consents separately.","允许各工作区授权 OpenRouter 使用输入和输出内容改进产品。每个工作区需单独同意。"],
      ["Allowed Authors","允许的开发者"],
      ["Allowed Providers","允许的提供商"],
      ["API key expiry","API 密钥有效期"],
      ["Blocked Authors","屏蔽的开发者"],
      ["Cap how long API keys under this account may stay valid.","限制此账户下 API 密钥的最长有效期。"],
      ["Click to cycle filter mode","点击切换筛选模式"],
      ["Control which model authors are used for routing. Leave empty to allow all.","控制路由使用哪些模型开发者。留空则全部允许。"],
      ["Control which providers are used for routing. Leave empty to allow all.","控制路由使用哪些提供商。留空则全部允许。"],
      ["Data Policies","数据政策"],
      ["Data Training","数据训练"],
      ["Eligibility Preview","可用范围预览"],
      ["Enable providers serving free models that may publish prompts and completions to public datasets.","允许使用可能将提示词和输出内容发布到公开数据集的免费模型提供商。"],
      ["Enable providers serving free models that may retain and/or train on prompts and completions.","允许使用可能保留提示词和输出内容，或将其用于训练的免费模型提供商。"],
      ["Enable providers that may anonymously use data for training purposes.","允许使用可能将匿名数据用于训练的提供商。"],
      ["Exclude these providers from serving any requests.","所有请求均不使用这些提供商。"],
      ["Exclusively enable these providers for your requests.","仅使用这些提供商处理请求。"],
      ["Filter the model catalog for API keys","按 API 密钥权限筛选模型目录"],
      ["First-party Anthropic endpoints will be disabled. Bedrock and Vertex will still be enabled.","将禁用 Anthropic 官方端点，Bedrock 和 Vertex 仍可使用。"],
      ["First-party OpenAI endpoints will be disabled. Azure will still be enabled.","将禁用 OpenAI 官方端点，Azure 仍可使用。"],
      ["How in-region routing works","区域内路由的工作方式"],
      ["Ignored Providers","排除的提供商"],
      ["Keep inference inside the EU or the US.","将推理限制在 EU 或 US 境内。"],
      ["Limit the models API to the models your API keys can use.","让模型 API 仅返回 API 密钥可用的模型。"],
      ["Maximum API key lifetime","API 密钥最长有效期"],
      ["Model authors","模型开发者"],
      ["Model catalog","模型目录"],
      ["Never route to models made by these authors.","不使用这些开发者的模型。"],
      ["New keys must expire within this window, and requests from existing keys that never expire or expire later are rejected. Choose \"No expiration\" to allow any lifetime.","新密钥必须在此期限内到期。现有密钥若永不过期或到期时间超出期限，其请求也会被拒绝。选择“永不过期”可允许任意有效期。"],
      ["Only route to models made by these authors.","仅使用这些开发者的模型。"],
      ["Only route to provider endpoints that don't store your data. Reject requests that would require data retention. Only applies to provider routing, does not apply to plugins and tools you choose to enable.","仅路由至不存储数据的提供商端点。拒绝需要保留数据的请求。此设置仅影响提供商路由，不适用于你自行启用的插件和工具。"],
      ["Phrases that should never trigger the prompt injection guardrail. Matching is case-insensitive and exact.","这些短语不会触发提示词注入防护。匹配不区分大小写，采用完全匹配。"],
      ["Privacy settings | OpenRouter","隐私设置 | OpenRouter"],
      ["Prompt Injection Allowlist","提示词注入白名单"],
      ["prompt injection guardrail","提示词注入防护规则"],
      ["Providers and models available based on your account settings.","根据账户设置可用的提供商和模型。"],
      ["Regional routing","区域路由"],
      ["Restrictions to apply globally across the account. You can further restrict API keys with guardrails inside a workspace.","这些限制适用于整个账户。可在工作区中通过防护规则进一步限制 API 密钥。"],
      ["Set data privacy and usage restrictions.","设置数据隐私和使用限制。"],
      ["Show All","显示全部"],
      ["Sorted by newest. Click to sort alphabetically.","当前按最新排序，点击改为按字母排序。"],
      ["SpaceXAI endpoints that retain data will be disabled.","将禁用会保留数据的 SpaceXAI 端点。"],
      ["These settings are separate from Zero Data Retention. Each endpoint toggle controls routing to endpoints with a specific data policy: enabling allows requests to be routed to those endpoints, disabling excludes them from routing.","这些设置独立于零数据留存。各端点开关控制是否允许路由至采用对应数据政策的端点：启用则允许，禁用则排除。"],
      ["Vertex endpoints require Safety Retention. AI Studio endpoints will be disabled.","Vertex 端点需要安全留存，将禁用 AI Studio 端点。"],
      ["Where inference runs. Included with Business. There is no setting to turn on: send a request to the EU or US API URL to keep it in that region.","控制推理运行的区域，Business 套餐已包含。无需开启设置，向 EU 或 US API URL 发送请求即可将推理限制在相应区域。"],
      ["Zero Data Retention","零数据留存"],
      ["Filter the models page to models you can use","模型目录仅显示可用模型"],
      ["When on, the models page on OpenRouter only lists the models this account can actually use, applying your provider restrictions and guardrails. API key requests to","开启后，OpenRouter 模型目录仅显示此账户可用的模型，并应用提供商限制及防护规则。通过 API 密钥请求"],
      ["always list only the models that key can use, whatever this setting says.","时，始终只列出该密钥可用的模型，不受此设置影响。"],
    ]),
      rules: [
      { re: /^(\d+)\s+days?$/, to: m => m[1] + ' 天' },
      { re: /^(\d+)\s+hour$/, to: m => m[1] + ' 小时' },
      { re: /^(\d+)\s+year$/, to: m => m[1] + ' 年' },
      { re: /^([\d,]+) available \| ([\d,]+) unavailable$/, to: m => m[1] + ' 个可用 | ' + m[2] + ' 个不可用' },
    ],
      overrides: [],
      fragments: [
      { head: "When on, requests to", re: /^When on, requests to made with an API key from this account only list the models the key can actually use, applying your provider restrictions and guardrails\. Requests without a key still see the public catalog\.$/, parts: ["When on, requests to", "made with an API key from this account only list the models the key can actually use, applying your provider restrictions and guardrails. Requests without a key still see the public catalog."], to: () => ['开启后，通过此账户 API 密钥向 ', ' 发起的请求仅列出密钥可用的模型，并应用提供商限制和防护规则。不带密钥的请求仍返回公开模型目录。'] },
      { head: "Allowlisted phrases only take effect when the", re: /^Allowlisted phrases only take effect when the prompt injection guardrail is enabled for the request\. Without it enabled, these patterns have no effect\.$/, parts: ["Allowlisted phrases only take effect when the", "prompt injection guardrail", "is enabled for the request. Without it enabled, these patterns have no effect."], to: () => ['仅在请求启用', '提示词注入防护规则', '时，白名单短语才生效。未启用时，这些匹配项不生效。'] },
      { head: "Search for ‘", when: isSearchEcho, re: /^Search for ‘(.+)’$/u, parts: ["Search for ‘", /^.+$/u, "’"], to: (raw, match, original = []) => ['搜索“', original.length === 3 ? original[1] : (/^Search for ‘([\s\S]*)’$/u.exec(original[0] || '')?.[1] ?? match[1]), '”'] },
    ],
    },
    // A13 security ^\/settings\/security$
    {
      id: "A13", slug: "security", path: /^\/settings\/security$/,
      exact: new Map([
      ["A leaked key could spend without a cap.","密钥泄露后可能产生无上限支出。"],
      ["A limit caps what a leaked key can spend.","设置限额可限制密钥泄露后的支出。"],
      ["Any activity","全部活动"],
      ["Archive","存档"],
      ["Ask each owner to replace these with expiring keys or remove ones they no longer need.","请各所有者改用有到期时间的密钥，或移除不再使用的密钥。"],
      ["Available on enterprise plan: Restrict API access to trusted IP addresses and CIDR ranges.","Enterprise 套餐支持：仅允许受信任的 IP 地址和 CIDR 网段访问 API。"],
      ["Clear filters","清除筛选"],
      ["Copy owner list","复制所有者列表"],
      ["Credit limit (USD)","消费限额（USD）"],
      ["Enforce a maximum key lifetime","限制密钥最长有效期"],
      ["Filter keys","筛选密钥"],
      ["Get in touch","联系我们"],
      ["Get IP allowlisting with Enterprise","使用 Enterprise IP 白名单"],
      ["Give the CSV to your agent and have it ask each owner to replace their key with an expiring one or remove it.","将 CSV 交给智能体，让它请各所有者将密钥换为有到期时间的密钥，或移除密钥。"],
      ["Idle keys with little or no lifetime usage.","长期闲置、累计用量很少或未使用过的密钥。"],
      ["In use","使用中"],
      ["Inactivity","闲置时间"],
      ["IP allowlist","IP 白名单"],
      ["IP allowlisting","IP 白名单"],
      ["Key safety","密钥安全"],
      ["Keys that stay valid until they are removed.","在被移除前始终有效的密钥。"],
      ["Last used","最近使用"],
      ["Learn about enterprise","了解 Enterprise"],
      ["Limit","限额"],
      ["Managed policy enforcement","托管策略执行"],
      ["Monthly invoicing","按月开票"],
      ["N/A","不适用"],
      ["Never","从未"],
      ["Never expires","永不过期"],
      ["Never used","从未使用"],
      ["No keys match","没有符合条件的密钥"],
      ["No limit or expiry","无限额且永不过期"],
      ["No spend limit","未设消费限额"],
      ["None right now","目前没有"],
      ["Open privacy settings","打开隐私设置"],
      ["Owner","所有者"],
      ["Recommendations","建议"],
      ["Restrict API access to a list of trusted IP addresses and CIDR ranges — plus everything else organizations need to deploy OpenRouter at scale.","仅允许受信任的 IP 地址和 CIDR 网段访问 API，并提供组织大规模部署 OpenRouter 所需的其他功能。"],
      ["Review before removing","移除前请核查"],
      ["Review your at-risk API keys and how this account's keys can be used.","检查存在风险的 API 密钥，以及此账户下密钥的使用权限。"],
      ["Risk","风险"],
      ["Safe to remove","可安全移除"],
      ["Search by name, label, or owner","按名称、标签或所有者搜索"],
      ["Security | OpenRouter","安全 | OpenRouter"],
      ["Security settings","安全设置"],
      ["Select all visible keys","选择所有可见密钥"],
      ["Set a maximum API key lifetime in privacy settings. Requests from keys that never expire or exceed it are rejected, including existing keys.","在隐私设置中限制 API 密钥最长有效期。永不过期或超出期限的密钥请求将被拒绝，现有密钥也适用。"],
      ["Set limit","设置限额"],
      ["Set spend limit","设置消费限额"],
      ["Show management keys","显示管理密钥"],
      ["Support SLA with shared Slack channel","提供 SLA 支持及共享 Slack 频道"],
      ["Try a different search or clear the filters.","请更换搜索词或清除筛选。"],
      ["Usage","用量"],
      ["View keys","查看密钥"],
      ["What you get on Enterprise","Enterprise 套餐包含的功能"],
    ]),
      rules: [
      { re: /^([\d,]+)\s+keys$/, to: m => m[1] + ' 个密钥' },
      { re: /^([\d,]+) of ([\d,]+) keys$/, to: m => m[1] + ' / ' + m[2] + ' 个密钥' },
      { re: /^of ([\d,]+) keys?$/, to: m => '，共 ' + m[1] + ' 个密钥' },
      { re: /^Never used or idle (\d+)\+ days$/, to: m => '从未使用或闲置 ' + m[1] + '+ 天' },
      { re: /^Unused (\d+)\+ days$/, to: m => '已闲置 ' + m[1] + '+ 天' },
      { type: "attr:aria-label", re: /^No requests in the last (\d+) days\.$/, to: m => '最近 ' + m[1] + ' 天没有请求。' },
      { re: /^Review ([\d,]+) keys? without expiration$/, to: m => '检查 ' + m[1] + ' 个永不过期的密钥' },
      { re: /^Set a spend limit on ([\d,]+) keys?$/, to: m => '为 ' + m[1] + ' 个密钥设置消费限额' },
      { re: /^Set limit on ([\d,]+) key$/, to: m => '为 ' + m[1] + ' 个密钥设置限额' },
      { re: /^Applies the same credit limit to ([\d,]+) key\. Only keys without a spend limit are eligible; existing limits are never changed\.$/, to: m => '为 ' + m[1] + ' 个密钥设置相同消费限额。仅适用于未设消费限额的密钥；已有的限额不会改变。' },
      { type: "attr:aria-label", re: /^Actions for (.+)$/, to: m => m[1] + ' 的操作' },
      { type: "attr:aria-label", re: /^Select (.+)$/, to: m => '选择 ' + m[1] },
    ],
      overrides: [
      { order: 7, path: /^\/settings\/security$/, when: e => tableColumn(e) === 'Limit', map: new Map([["None", "不限"]]) },
      { order: 8, path: /^\/settings\/security$/, when: e => tableColumn(e) === 'Expires', map: new Map([["Never", "永不过期"]]) },
    ],
      fragments: [
      { head: "Search for ‘", when: isSearchEcho, re: /^Search for ‘(.+)’$/u, parts: ["Search for ‘", /^.+$/u, "’"], to: (raw, match, original = []) => ['搜索“', original.length === 3 ? original[1] : (/^Search for ‘([\s\S]*)’$/u.exec(original[0] || '')?.[1] ?? match[1]), '”'] },
    ],
    },
    // A14 preferences ^\/settings\/preferences$
    {
      id: "A14", slug: "preferences", path: /^\/settings\/preferences$/,
      exact: new Map([
      ["Account Type","账户类型"],
      ["Allow analytics cookies to help us improve the user experience and site performance.","允许使用分析 Cookie，帮助我们改进使用体验和网站性能。"],
      ["Attestations","声明"],
      ["Browser Notifications","浏览器通知"],
      ["Browser notifications when chat responses complete (only when tab is not focused)","聊天回复完成时发送浏览器通知（仅在标签页未处于前台时）。"],
      ["Confirmed","已确认"],
      ["Create and manage your organization.","创建和管理组织。"],
      ["Date Format","日期格式"],
      ["Default Preset","默认预设"],
      ["Default preset for new messages in the chatroom.","聊天室中新消息使用的默认预设。"],
      ["Enable analytics cookies","启用分析 Cookie"],
      ["How dates appear in logs and activity tables.","日志和用量表中的日期显示方式。"],
      ["I confirm that I am 18 years of age or older.","我确认已年满 18 周岁。"],
      ["Manage your login credentials, security settings, or delete your account.","管理登录凭据、安全设置或删除账户。"],
      ["Organization","组织"],
      ["Relative","相对时间"],
      ["Short","简短"],
      ["Tier","套餐等级"],
      ["Toggle analytics cookies","切换分析 Cookie"],
      ["Toggle browser notifications","切换浏览器通知"],
      ["Top-up platform fee","充值平台手续费"],
      ["Your current account tier.","当前账户的套餐等级。"],
      ["18+ age confirmation","18+ 年龄确认"],
    ]),
      rules: [
      { re: /^(\d+)\s+hours ago$/, to: m => m[1] + ' 小时前' },
    ],
      overrides: [],
      fragments: [
      { head: "Your chat history in the", re: /^Your chat history in the Chatroom is always stored locally on your device\.$/, parts: ["Your chat history in the", "Chatroom", "is always stored locally on your device."], to: () => ['你在 ', 'Chatroom', ' 中的聊天记录始终保存在你的设备本地。'] },
      { head: "Search for ‘", when: isSearchEcho, re: /^Search for ‘(.+)’$/u, parts: ["Search for ‘", /^.+$/u, "’"], to: (raw, match, original = []) => ['搜索“', original.length === 3 ? original[1] : (/^Search for ‘([\s\S]*)’$/u.exec(original[0] || '')?.[1] ?? match[1]), '”'] },
    ],
    },
    // A15 manage-plan ^\/settings\/manage-plan$
    {
      id: "A15", slug: "manage-plan", path: /^\/settings\/manage-plan$/,
      exact: new Map([
      ["Accepted","已接受"],
      ["Authenticate services with tokens from your own identity provider instead of long-lived API keys.","使用自有身份提供商签发的令牌验证服务身份，替代长期有效的 API 密钥。"],
      ["Back to Preferences","返回偏好设置"],
      ["Business only","仅 Business 套餐"],
      ["Data Processing Agreement","数据处理协议"],
      ["EU regional routing","EU 区域路由"],
      ["Features","功能"],
      ["Included","已包含"],
      ["Manage plan","管理套餐"],
      ["Manage plan | OpenRouter","管理套餐 | OpenRouter"],
      ["Manage workspaces","管理工作区"],
      ["Plan","套餐"],
      ["Route inference to providers in the European Union.","将推理路由至欧盟境内的提供商。"],
      ["Route inference to providers in the United States.","将推理路由至美国境内的提供商。"],
      ["Top-up platform fee 5.5%.","充值平台手续费 5.5%。"],
      ["US regional routing","US 区域路由"],
      ["View DPA","查看 DPA"],
      ["Workload Identity Federation","工作负载身份联合"],
      ["You accepted it through our Terms of Service. Nothing to sign.","你已通过服务条款接受此协议，无需另行签署。"],
    ]),
      rules: [
      { re: /^([\d,]+) of ([\d,]+) workspaces? in use\. Business raises the cap to ([\d,]+)\.$/, to: m => '已使用 ' + m[1] + '/' + m[2] + ' 个工作区。Business 可将上限提高至 ' + m[3] + ' 个。' },
    ],
      overrides: [],
      fragments: [
      { head: "Search for ‘", when: isSearchEcho, re: /^Search for ‘(.+)’$/u, parts: ["Search for ‘", /^.+$/u, "’"], to: (raw, match, original = []) => ['搜索“', original.length === 3 ? original[1] : (/^Search for ‘([\s\S]*)’$/u.exec(original[0] || '')?.[1] ?? match[1]), '”'] },
    ],
    },
    // A07 logs ^\/(?:logs|workspaces\/[^/]+\/logs)$
    {
      id: "A07", slug: "logs", path: /^\/(?:logs|workspaces\/[^/]+\/logs)$/,
      exact: new Map([
      ["API Error","API 错误"],
      ["Attempts","尝试次数"],
      ["Batches will show asynchronous batch jobs across statuses for the selected filters.","此处将显示符合筛选条件、处于各状态的异步批处理任务。"],
      ["Billing","计费"],
      ["Category","类别"],
      ["Columns","列"],
      ["Comment","备注"],
      ["Compact","紧凑"],
      ["Copy to clipboard","复制到剪贴板"],
      ["Credit grants","赠送余额"],
      ["Density","密度"],
      ["Describe the issue...","请描述问题…"],
      ["Drag a column here to pin it to the left","将列拖到此处以固定在左侧"],
      ["Expanded","展开"],
      ["False","否"],
      ["Filter by Model, Provider, or Status","按模型、提供商或状态筛选"],
      ["Filter by User, Model, Provider, API Key, or Modality","按用户、模型、提供商、API 密钥或模态筛选"],
      ["Filter by User, Model, Provider, Status, or Region","按用户、模型、提供商、状态或区域筛选"],
      ["Final Provider","最终提供商"],
      ["Formatting","格式"],
      ["Generation","生成记录"],
      ["Guardrail","防护规则"],
      ["Guardrail False Positive","防护误报"],
      ["Help us improve by reporting issues with this generation.","报告此生成记录的问题，帮助我们改进。"],
      ["Hide request histogram","隐藏请求直方图"],
      ["Incoherence","内容不连贯"],
      ["Incorrect Response","回复错误"],
      ["Invoked","已触发"],
      ["Latency","延迟"],
      ["Latency until the first token was received, in seconds.","收到首个 Token 前的延迟，单位为秒。"],
      ["Modality","模态"],
      ["No sessions found","未找到会话"],
      ["Not Invoked","未触发"],
      ["Other","其他"],
      ["Paste an ID","粘贴 ID"],
      ["Pinned","已固定"],
      ["Regular","标准"],
      ["Reorder App column","调整应用列顺序"],
      ["Reorder Date column","调整日期列顺序"],
      ["Reorder Input column","调整输入列顺序"],
      ["Reorder Model column","调整模型列顺序"],
      ["Reorder Output column","调整输出列顺序"],
      ["Reorder Provider column","调整提供商列顺序"],
      ["Report Feedback","反馈问题"],
      ["Request","请求"],
      ["Reset","重置"],
      ["Reset table settings to default","将表格设置恢复为默认值"],
      ["Routing Overhead","路由开销"],
      ["Row density","行密度"],
      ["Select a category","选择类别"],
      ["Session","会话"],
      ["Show request histogram","显示请求直方图"],
      ["Speed","速度"],
      ["Submit","提交"],
      ["Table settings sections","表格设置栏目"],
      ["The app or agent that made this request.","发起此请求的应用或智能体。"],
      ["Time OpenRouter spent routing your request, including provider fallbacks.","OpenRouter 路由请求所用的时间，包含提供商故障转移耗时。"],
      ["Time to First Token","首个 Token 延迟"],
      ["Toggle App column","切换应用列显示"],
      ["Toggle Date column","切换日期列显示"],
      ["Toggle Input column","切换输入列显示"],
      ["Toggle Model column","切换模型列显示"],
      ["Toggle Output column","切换输出列显示"],
      ["Toggle Provider column","切换提供商列显示"],
      ["True","是"],
      ["Try adjusting the date range or filters to see more data.","请调整时间范围或筛选条件，查看更多数据。"],
      ["Usage Type","用量类型"],
      ["Videos will show asynchronous video generations across statuses for the selected filters.","此处将显示符合筛选条件、处于各状态的异步视频生成记录。"],
      ["BYOK Usage","BYOK 用量"],
      ["Cache Usage","缓存用量"],
    ]),
      rules: [
      { re: /^([\d,]+) reasoning tokens \(includes full internal thinking; only a summary may be visible in the response\)$/, to: m => m[1] + ' 个推理 Token（包含完整内部思考；回复中可能只显示摘要）' },
      { type: "attr:aria-label", re: /^Reorder (.+) column$/, to: m => '调整' + (DICTIONARIES.common.get(m[1]) || DICTIONARIES.logs.get(m[1]) || m[1]) + '列顺序' },
      { type: "attr:aria-label", re: /^Toggle (.+) column$/, to: m => '切换' + (DICTIONARIES.common.get(m[1]) || DICTIONARIES.logs.get(m[1]) || m[1]) + '列显示' },
    ],
      overrides: [
      { order: 4, path: /^(?:\/logs|\/workspaces\/[^/]+\/logs)$/, when: e => !isChrome(e), map: new Map([["Credits", "平台余额"]]) },
      { order: 9, path: /^(?:\/logs|\/workspaces\/[^/]+\/logs)$/, when: e => !isChrome(e), map: new Map([["Reset", "恢复默认"]]) },
    ],
      fragments: [
      { head: "You don't have any", re: /^You don't have any (video generations|batches) yet$/, parts: ["You don't have any", /^(?:video generations|batches)$/, "yet"], to: (raw, m) => ['暂无', m[1] === 'batches' ? '批处理记录' : '视频生成记录', ''] },
      { head: "Group related generations into sessions to follow full conversations, debug chains, and track multi-step agents. Pass a", re: /^Group related generations into sessions to follow full conversations, debug chains, and track multi-step agents\. Pass a in your API request to get started\.$/, parts: ["Group related generations into sessions to follow full conversations, debug chains, and track multi-step agents. Pass a", "in your API request to get started."], to: () => ['将相关生成记录归为会话，可跟踪完整对话、调试调用链及多步骤智能体。在 API 请求中传入 ', ' 即可开始。'] },
      { head: "OpenRouter can forward a trace of every request to your observability tool, plus", re: /^OpenRouter can forward a trace of every request to your observability tool, plus (\d+) more destinations\. No code changes needed\.$/, parts: ["OpenRouter can forward a trace of every request to your observability tool, plus", /^\d+$/, "more destinations. No code changes needed."], to: (raw, m) => ['OpenRouter 可转发每次请求的追踪数据，另支持 ', m[1], ' 个目标，无需修改代码。'] },
      { head: "Search for ‘", when: isSearchEcho, re: /^Search for ‘(.+)’$/u, parts: ["Search for ‘", /^.+$/u, "’"], to: (raw, match, original = []) => ['搜索“', original.length === 3 ? original[1] : (/^Search for ‘([\s\S]*)’$/u.exec(original[0] || '')?.[1] ?? match[1]), '”'] },
    ],
    },
    // W03 workspace-activity-trends ^\/workspaces\/[^/]+\/activity(?:\/(?:trends|explore|guardrails))?$
    {
      id: "W03", slug: "workspace-activity-trends", path: /^\/workspaces\/[^/]+\/activity(?:\/(?:trends|explore|guardrails))?$/,
      exact: new Map([
      ["Move right","移至右侧"],
    ]),
      rules: [],
      overrides: [],
      fragments: [
      { head: "Search for ‘", when: isSearchEcho, re: /^Search for ‘(.+)’$/u, parts: ["Search for ‘", /^.+$/u, "’"], to: (raw, match, original = []) => ['搜索“', original.length === 3 ? original[1] : (/^Search for ‘([\s\S]*)’$/u.exec(original[0] || '')?.[1] ?? match[1]), '”'] },
    ],
    },
    // W17 workspace-byok-provider ^\/workspaces\/[^/]+\/byok\/[^/]+$
    {
      id: "W17", slug: "workspace-byok-provider", path: /^\/workspaces\/[^/]+\/byok\/[^/]+$/,
      exact: new Map([
      ["Add a fallback key","添加回退密钥"],
      ["Add a prioritized key","添加优先密钥"],
      ["Add and configure your API keys. Drag a key by its handle to reorder it within a section or move it between sections.","添加和配置 API 密钥。拖动密钥手柄可调整顺序，或移至其他分组。"],
      ["Add fallback key","添加回退密钥"],
      ["Add key","添加密钥"],
      ["Add prioritized key","添加优先密钥"],
      ["Attempted in order, before falling back to OpenRouter endpoints.","按顺序尝试，之后才回退至 OpenRouter 端点。"],
      ["Data region","数据区域"],
      ["Fallback","回退"],
      ["My account does not have ZDR","我的账户不支持 ZDR"],
      ["My account has ZDR","我的账户支持 ZDR"],
      ["OpenRouter capacity","OpenRouter 服务"],
      ["Prioritized","优先使用"],
      ["Provider agreement","提供商协议"],
      ["Provider Keys","提供商密钥"],
      ["request parameter.","请求参数。"],
      ["Test","测试"],
      ["To prevent that, restrict providers with a guardrail or the","如需避免这种情况，请通过防护规则或"],
      ["Tried only after attempting OpenRouter endpoints, in order.","尝试 OpenRouter 端点后，才按顺序尝试此组密钥。"],
      ["Use OpenRouter's default","使用 OpenRouter 默认设置"],
      ["View supported models","查看支持的模型"],
      ["Where",""],
      ["Zero data retention","零数据留存"],
      [", and the key can serve requests sent to","，该密钥也可处理发送至"],
      [". Claude 4.5 and earlier models can't be pinned to the US, so they run unpinned on","的请求。Claude 4.5 及更早的模型无法限定在 US 运行，因此它们通过"],
      ["and requests for them fail on","处理时不限定区域；发送至"],
      ["Bedrock Configuration","Bedrock 配置"],
      ["Bedrock credential type","Bedrock 凭据类型"],
      ["IAM Credentials","IAM 凭据"],
      ["Enter Bedrock API key","输入 Bedrock API 密钥"],
      ["Access Key ID","访问密钥 ID"],
      ["Secret Access Key","私密访问密钥"],
      ["AWS Region","AWS 区域"],
      ["This key applies to","此密钥的适用范围"],
      ["Specific","指定范围"],
      ["processes requests made with this key. With United States selected, requests made with this key on Claude 4.6 and later models are processed in the US, including requests sent to","处理此密钥请求的区域。选择“美国”后，Claude 4.6 及后续模型的请求会在 US 处理，包括发送至"],
      ["unless another provider can serve them there.","的请求会失败，除非有其他提供商可在该区域处理。"],
      ["Drag a key here, or add one","将密钥拖到此处，或添加密钥"],
    ]),
      rules: [
      { type: "attr:placeholder", re: /^e\.g\. (.+)$/, to: m => '例如：' + m[1] },
      { re: /^(.+) BYOK \| Settings \| OpenRouter$/, to: m => m[1] + ' BYOK | 设置 | OpenRouter' },
      { re: /^When your key can't serve a request, OpenRouter can use its own (.+) account:$/, to: m => '密钥无法处理请求时，OpenRouter 可使用自己的 ' + m[1] + ' 账户：' },
      { re: /^Use OpenRouter's (.+) capacity$/, to: m => '使用 OpenRouter 的 ' + m[1] + ' 服务' },
      { re: /^Never use OpenRouter's (.+) capacity for models this key applies to$/, to: m => '此密钥适用的模型不使用 OpenRouter 的 ' + m[1] + ' 服务' },
      { re: /^Never use OpenRouter's (.+) capacity for any model$/, to: m => '所有模型均不使用 OpenRouter 的 ' + m[1] + ' 服务' },
      { re: /^These settings only affect (.+)\. Other providers that host the same model can still serve requests with OpenRouter credits\.$/, to: m => '这些设置仅影响 ' + m[1] + '。托管同一模型的其他提供商仍可使用 OpenRouter 余额处理请求。' },
      { re: /^Check what your agreement with (.+) covers\. OpenRouter treats this key as meeting these guardrails on your word\.$/, to: m => '请确认你与 ' + m[1] + ' 的协议涵盖哪些内容。OpenRouter 会根据你的声明，认定此密钥符合这些防护规则。' },
      { re: /^(.+) currently retains prompts\.$/, to: m => m[1] + ' 目前会保留提示词。' },
      { re: /^(.+) currently has zero data retention\.$/, to: m => m[1] + ' 目前实行零数据留存。' },
      { re: /^Allowed when a ZDR guardrail is on for (.+)\.$/, to: m => '当 ' + m[1] + ' 启用 ZDR 防护规则时允许使用。' },
      { re: /^Blocked when a ZDR guardrail is on for (.+)\.$/, to: m => '当 ' + m[1] + ' 启用 ZDR 防护规则时拦截。' },
    ],
      overrides: [],
      fragments: [
      { head: "To prevent that, restrict providers with a guardrail or the", re: /^To prevent that, restrict providers with a guardrail or the request parameter\.$/, parts: ["To prevent that, restrict providers with a guardrail or the", "request parameter."], to: () => ["如需避免这种情况，请通过防护规则或","请求参数。"] },
      { head: "Search for ‘", when: isSearchEcho, re: /^Search for ‘(.+)’$/u, parts: ["Search for ‘", /^.+$/u, "’"], to: (raw, match, original = []) => ['搜索“', original.length === 3 ? original[1] : (/^Search for ‘([\s\S]*)’$/u.exec(original[0] || '')?.[1] ?? match[1]), '”'] },
    ],
    },
    // W28 workspace-chat ^\/workspaces\/[^/]+\/chat$
    {
      id: "W28", slug: "workspace-chat", path: /^\/workspaces\/[^/]+\/chat$/,
      exact: new Map([
      ["Tools: 8 active","工具：已启用 8 个"],
      ["Add Model","添加模型"],
      ["Add Model (⌘J)","添加模型（⌘J）"],
      ["Add to message","添加到消息"],
      ["Always expand messages","始终展开消息"],
      ["Ask anything…","输入你的问题…"],
      ["Attach files","添加文件"],
      ["Attach uploaded file","添加已上传文件"],
      ["Back to server tools","返回服务端工具"],
      ["Best coding models","优选编程模型"],
      ["Best roleplay models","优选角色扮演模型"],
      ["Blue","蓝色"],
      ["Blue bubble color","蓝色气泡"],
      ["Chat | Workspace | OpenRouter","聊天 | 工作区 | OpenRouter"],
      ["Chat memory: all messages","聊天记忆：全部消息"],
      ["Clear Chat","清空聊天"],
      ["Clear Models","清除模型"],
      ["Configure workspace server tools","配置工作区服务端工具"],
      ["Create artifact","创建作品"],
      ["Create Artifact","创建作品"],
      ["Default bubble color","默认气泡颜色"],
      ["Default model","默认模型"],
      ["Duplicate Chat","复制聊天"],
      ["Duplicate Room","复制聊天房间"],
      ["Export","导出"],
      ["Export Chat","导出聊天"],
      ["Export Markdown","导出 Markdown"],
      ["Flagship models","旗舰模型"],
      ["Generate image","生成图像"],
      ["Get Markdown","获取 Markdown"],
      ["Green","绿色"],
      ["Green bubble color","绿色气泡"],
      ["Import","导入"],
      ["Import Character","导入角色"],
      ["Import Chat","导入聊天"],
      ["Instructions (optional)","指令（可选）"],
      ["List","列表"],
      ["Max tool calls (optional)","最大工具调用次数（可选）"],
      ["Message color","消息颜色"],
      ["New chat","新建聊天"],
      ["New Chat (⌘ /)","新建聊天（⌘ /）"],
      ["No matching rooms","没有匹配的聊天房间"],
      ["Only route to endpoints that never retain your prompts or completions. Applies to all models in this chat, including ones added later.","仅路由至不保留提示词或输出内容的端点。适用于此聊天中的全部模型，包括之后添加的模型。"],
      ["Orange","橙色"],
      ["Orange bubble color","橙色气泡"],
      ["Pink","粉色"],
      ["Pink bubble color","粉色气泡"],
      ["Purple","紫色"],
      ["Purple bubble color","紫色气泡"],
      ["Reasoning models","推理模型"],
      ["Require Zero Data Retention","要求零数据留存"],
      ["Responses are AI-generated and can be inaccurate. Review all outputs before relying on them.","回复由 AI 生成，可能存在错误。使用前请核对所有输出。"],
      ["Room settings","房间设置"],
      ["rooms","个房间"],
      ["Search rooms...","搜索房间…"],
      ["Send message","发送消息"],
      ["Server tools","服务端工具"],
      ["Server tools documentation","服务端工具文档"],
      ["Share Models","分享模型"],
      ["Show metrics inline","在消息中显示指标"],
      ["Start recording","开始录音"],
      ["View mode","视图模式"],
      ["Yellow","黄色"],
      ["Yellow bubble color","黄色气泡"],
      ["Zero Data Retention settings","零数据留存设置"],
      ["Side by side","并排"],
      ["Number of recent messages to include per request","每次请求包含的近期消息数量"],
      ["Chat memory","聊天记忆"],
      ["Sends all messages from your conversation each request.","每次请求都会发送对话中的全部消息。"],
      ["Attach an uploaded file","添加已上传文件"],
      ["Reference a file already uploaded to your workspace. OpenRouter inlines its content for the model.","引用工作区中已上传的文件。OpenRouter 会将文件内容直接提供给模型。"],
      ["No uploaded files found in this workspace.","此工作区暂无已上传文件。"],
      ["Loading files…","正在加载文件…"],
    ]),
      rules: [
      { re: /^([\d,]+) models$/, to: m => m[1] + ' 个模型' },
      { re: /^([\d,]+) rooms$/, to: m => m[1] + ' 个房间' },
      { re: /^([\d,]+) advisors?$/, to: m => m[1] + ' 个 Advisor' },
      { re: /^([\d,]+) subagents?$/, to: m => m[1] + ' 个子智能体' },
      { type: "attr:aria-label", re: /^Tools: (\d+) active$/, to: m => '工具：已启用 ' + m[1] + ' 个' },
      { re: /^Default: ([\d,]+), max ([\d,]+)$/, to: m => '默认：' + m[1] + '，最大：' + m[2] },
      { re: /^Default: ([\d,]+)$/, to: m => '默认：' + m[1] },
      { type: "attr:aria-label", re: /^Analysis Models (\d+)$/, to: m => '分析模型 ' + m[1] },
      { type: "attr:aria-label", re: /^(Advisors|Subagents) (\d+) (name|model|instructions|max tool calls)$/, to: m =>
      (m[1] === 'Advisors' ? 'Advisor ' : '子智能体 ') + m[2] + ' ' +
      ({ name: '名称', model: '模型', instructions: '指令', 'max tool calls': '最大工具调用次数' })[m[3]] },
      { type: "attr:aria-label", re: /^Remove (advisor|subagent) (\d+)$/, to: m =>
      '移除' + (m[1] === 'advisor' ? ' Advisor ' : '子智能体 ') + m[2] },
      { type: "attr:placeholder", re: /^Name \(e\.g\. (.+)\)$/, to: m => '名称（如 ' + m[1] + '）' },
    ],
      overrides: [],
      fragments: [
      { head: "Search for ‘", when: isSearchEcho, re: /^Search for ‘(.+)’$/u, parts: ["Search for ‘", /^.+$/u, "’"], to: (raw, match, original = []) => ['搜索“', original.length === 3 ? original[1] : (/^Search for ‘([\s\S]*)’$/u.exec(original[0] || '')?.[1] ?? match[1]), '”'] },
    ],
    },
    // W26 workspace-classifier-new ^\/workspaces\/[^/]+\/classifiers\/new$
    {
      id: "W26", slug: "workspace-classifier-new", path: /^\/workspaces\/[^/]+\/classifiers\/new$/,
      exact: new Map([
      ["% of requests","占请求比例"],
      ["Add dimension","添加维度"],
      ["Agent complexity","智能体任务复杂度"],
      ["Audience","受众"],
      ["Capitalizable software expense","可资本化的软件费用"],
      ["Classification prompt","分类提示词"],
      ["Classifier model","分类模型"],
      ["Classify agent prompts by difficulty tier and task family — understand whether agents are doing rote work or frontier-level reasoning.","按难度和任务类别对智能体提示词分类，了解智能体是在处理常规工作，还是执行高难度推理。"],
      ["Classify every request by what the model is doing — coding, agent workflows, data processing, content writing, and more. Mirrors OpenRouter's internal task-type taxonomy.","按模型执行的工作对请求分类，如编程、智能体流程、数据处理、内容写作等。采用 OpenRouter 内部的任务分类体系。"],
      ["Cost control. At high throughput, classifying every request adds up — drop to 10–25% if you only need rough usage shape rather than exact counts.","控制费用。请求量较大时，逐条分类会累积较多费用；若只需了解大致用量分布，可降至 10–25%。"],
      ["Custom classifier","自定义分类器"],
      ["Department","部门"],
      ["Dimensions","维度"],
      ["each becomes a tag on every generation","每个维度都会成为生成记录上的标签"],
      ["Engineering work","工程工作"],
      ["Help accounting identify AI token spend on engineering work that qualifies as a capitalizable software development cost.","帮助财务识别工程工作中的 AI Token 支出，判断其是否符合软件开发成本资本化条件。"],
      ["Instructions sent to the classifier model as a system message.","以系统消息形式发送给分类模型的指令。"],
      ["Make your own","自行创建"],
      ["New classifier","新建分类器"],
      ["New classifier | OpenRouter","新建分类器 | OpenRouter"],
      ["No dimensions yet. Add one to get started.","暂无维度。添加一个维度即可开始。"],
      ["Paste a sample user message and run the classifier against your draft schema. Uses your OpenRouter credits.","粘贴一条样例用户消息，按当前草稿结构运行分类器。此操作会消耗 OpenRouter 余额。"],
      ["Run classifier","运行分类器"],
      ["Sample rate","采样率"],
      ["Sample user message","样例用户消息"],
      ["Save classifier","保存分类器"],
      ["Start from a preset, or make your own from scratch.","从预设开始，或自行创建。"],
      ["Start from scratch with your own dimensions","使用自定义维度从零开始"],
      ["Tag every request by who the output is being prepared for — internal use, client-facing, regulators, or the public.","按输出的目标受众对请求分类，如内部使用、客户、监管机构或公众。"],
      ["Tag every request with the business unit or function it came from — engineering, sales, marketing, legal, etc.","按请求所属的业务部门或职能分类，如工程、销售、市场、法务等。"],
      ["Tag every request with the kind of engineering work it represents — feature dev, bug fixing, docs, refactoring, etc.","按工程工作类型对请求分类，如功能开发、修复错误、文档、重构等。"],
      ["Task type","任务类型"],
      ["Test the classifier","测试分类器"],
      ["The output structure is enforced automatically — the model is constrained to emit one value from your enum for each dimension you defined above. An","系统会自动约束输出结构，要求模型为每个已定义的维度从枚举中选择一个值。每个维度还会附加"],
      ["Use the prompt for","提示词用于"],
      ["You don't need to list your dimensions or their values here.","无需在此列出维度及其取值。"],
      ["escape hatch is appended to every dimension so the model never has to invent a value.","兜底选项，确保模型无需自行编造取值。"],
      ["What this dimension captures","此维度的含义"],
      ["Remove dimension","移除维度"],
      ["Enum values (one per line, up to","枚举值（每行一项，最多"],
    ]),
      rules: [
      { re: /^: framing \(e\.g\. "([^"]+)"\), edge-case guidance, and any domain context the model needs\.$/, to: m => '：设定分类角度（如“' + m[1] + '”）、处理边界情况，以及模型需要的领域背景。' },
    ],
      overrides: [],
      fragments: [
      { head: "The output structure is enforced automatically — the model is constrained to emit one value from your enum for each dimension you defined above. An", re: /^The output structure is enforced automatically — the model is constrained to emit one value from your enum for each dimension you defined above\. An escape hatch is appended to every dimension so the model never has to invent a value\.$/, parts: ["The output structure is enforced automatically — the model is constrained to emit one value from your enum for each dimension you defined above. An", "escape hatch is appended to every dimension so the model never has to invent a value."], to: () => ["系统会自动约束输出结构，要求模型为每个已定义的维度从枚举中选择一个值。每个维度还会附加","兜底选项，确保模型无需自行编造取值。"] },
      { head: "Enum values (one per line, up to", re: /^Enum values \(one per line, up to 35\)$/, parts: ["Enum values (one per line, up to", "35", ")"], to: () => ['枚举值（每行一项，最多 ', '35', ' 项）'] },
      { head: "Search for ‘", when: isSearchEcho, re: /^Search for ‘(.+)’$/u, parts: ["Search for ‘", /^.+$/u, "’"], to: (raw, match, original = []) => ['搜索“', original.length === 3 ? original[1] : (/^Search for ‘([\s\S]*)’$/u.exec(original[0] || '')?.[1] ?? match[1]), '”'] },
    ],
    },
    // W25 workspace-classifiers ^\/workspaces\/[^/]+\/classifiers$
    {
      id: "W25", slug: "workspace-classifiers", path: /^\/workspaces\/[^/]+\/classifiers$/,
      exact: new Map([
      ["A classifier runs a cheap model over every generation and tags it with structured metadata you define — department, task type, sensitivity, etc. Tags power org-wide dashboards without exposing prompt content to leadership.","分类器会用低成本模型处理每条生成记录，并添加你定义的结构化标签，如部门、任务类型、敏感程度等。这些标签可用于组织级报表，无需向管理层展示提示词正文。"],
      ["Classifiers | OpenRouter","分类器 | OpenRouter"],
      ["Create classifier","创建分类器"],
      ["No classifiers configured","尚未配置分类器"],
    ]),
      rules: [
      { re: /^Tag every generation with structured metadata for AI usage reporting\. View aggregated charts in the Activity page\. Create up to (\d+) classifiers per workspace\.$/, to: m => '为每条生成记录添加结构化元数据，用于 AI 用量报告。在用量页查看汇总图表。每个工作区最多创建 ' + m[1] + ' 个分类器。' },
    ],
      overrides: [],
      fragments: [
      { head: "Search for ‘", when: isSearchEcho, re: /^Search for ‘(.+)’$/u, parts: ["Search for ‘", /^.+$/u, "’"], to: (raw, match, original = []) => ['搜索“', original.length === 3 ? original[1] : (/^Search for ‘([\s\S]*)’$/u.exec(original[0] || '')?.[1] ?? match[1]), '”'] },
    ],
    },
    // S01 workspace-common ^\/workspaces\/[^/]+(?:\/|$)
    {
      id: "S01", slug: "workspace-common", path: /^\/workspaces\/[^/]+(?:\/|$)/,
      exact: new Map([
      ["Metadata","元数据"],
      ["Generation Data","生成数据"],
      ["Raw JSON","原始 JSON"],
      ["Classify on-demand","按需分类"],
      ["Loading","加载中"],
      ["Set up","设置"],
      ["Add model","添加模型"],
      ["Auto","自动"],
      ["Auto · Medium","自动 · 中"],
      ["Available","可用"],
      ["Back","返回"],
      ["breadcrumb","面包屑导航"],
      ["Bring Your Own Key (BYOK)","自备密钥（BYOK）"],
      ["Bring Your Own Key (BYOK) | Settings | OpenRouter","自备密钥（BYOK）| 设置 | OpenRouter"],
      ["Budget Policies","预算策略"],
      ["By default, if your key encounters a rate limit or failure, OpenRouter will fall back to using shared OpenRouter endpoints.","默认情况下，密钥触发速率限制或请求失败时，OpenRouter 会回退至共享端点。"],
      ["Configure","配置"],
      ["Consult a stronger model for guidance","向更强的模型寻求建议"],
      ["Current date and time info","当前日期和时间信息"],
      ["Datetime","日期时间"],
      ["Default policy automatically applied to every key in this workspace.","自动应用于此工作区全部密钥的默认策略。"],
      ["Delegate tasks to smaller, faster models","将任务分配给更小、更快的模型"],
      ["docs","文档"],
      ["Engine","引擎"],
      ["Excluded API Keys (optional)","排除的 API 密钥（可选）"],
      ["Generate images from text","根据文本生成图像"],
      ["Guardrails | OpenRouter","防护规则 | OpenRouter"],
      ["High","高"],
      ["If you wish to never use shared OpenRouter endpoints for a model, you must","若不希望某个模型使用共享 OpenRouter 端点，必须"],
      ["Image Generation","图像生成"],
      ["Included API Keys (optional)","包含的 API 密钥（可选）"],
      ["key by default.","密钥。"],
      ["Key Priority and Fallback","密钥优先级与回退"],
      ["Low","低"],
      ["Medium","中"],
      ["Model & Provider Access","模型与提供商访问"],
      ["Multi-model consensus and analysis","多模型共识与分析"],
      ["New preset","新建预设"],
      ["Not configured","未配置"],
      ["OpenRouter always prioritizes using your provider keys when available.","提供商密钥可用时，OpenRouter 始终优先使用你的密钥。"],
      ["Prevent overrides","禁止覆盖"],
      ["Prompt Injection","提示词注入"],
      ["Rate","采样率"],
      ["Retrieve content from URLs","获取 URL 内容"],
      ["Run shell commands in a sandboxed container","在沙箱容器中运行 Shell 命令"],
      ["Sampling","采样"],
      ["Search Mode","搜索模式"],
      ["Search providers...","搜索提供商…"],
      ["Search the web for current information","搜索网页以获取最新信息"],
      ["Sensitive Info Detection","敏感信息检测"],
      ["Serve every model request from this workspace with its own provider keys only, on every provider. Requests for models without an eligible key fail instead of using OpenRouter capacity. OpenRouter-hosted tools such as web search, moderation and file parsing are unaffected.","此工作区的所有模型请求都仅使用自有提供商密钥。模型没有可用密钥时，请求将失败，不会使用 OpenRouter 服务。网页搜索、内容审核、文件解析等 OpenRouter 托管工具不受影响。"],
      ["Set spending limits for API keys. This budget will apply to each API key assigned.","设置 API 密钥的消费限额。此预算分别应用于每个已分配的密钥。"],
      ["Size","大小"],
      ["Subagent","子智能体"],
      ["This guardrail applies to each workspace","此防护规则默认应用于每个工作区"],
      ["United States","美国"],
      ["Use your own provider API keys on OpenRouter","在 OpenRouter 使用自有提供商 API 密钥"],
      ["Web Fetch","网页抓取"],
      ["Web Search","网页搜索"],
      ["when making the request.","选项中指定该提供商。"],
      ["You can configure individual keys with \"Always use this key\" to prevent any fallback to OpenRouter endpoints. When this option is enabled, OpenRouter will only use your key for requests to that provider. This may result in rate limit errors if your key is exhausted, but ensures all requests go through your account.","可为单个密钥设置“始终使用此密钥”，禁止回退至 OpenRouter 端点。启用后，向该提供商发送的请求只使用你的密钥。密钥额度耗尽时可能触发速率限制错误，但可确保请求都通过你的账户处理。"],
      ["your only provider","唯一提供商"],
      ["Toggle Web Search","切换网页搜索"],
      ["Toggle Web Fetch","切换网页抓取"],
      ["Toggle Image Generation","切换图像生成"],
      ["Toggle Datetime","切换日期时间"],
      ["Toggle Fusion","切换Fusion"],
      ["Toggle Advisor","切换Advisor"],
      ["Toggle Subagent","切换子智能体"],
      ["Toggle Shell","切换Shell"],
      ["both","同时"],
      ["specify \"Always use this key\" and pin the provider by specifying it as","启用“始终使用此密钥”，并在请求的"],
    ]),
      rules: [],
      overrides: [],
      fragments: [
      { head: "Search for ‘", when: isSearchEcho, re: /^Search for ‘(.+)’$/u, parts: ["Search for ‘", /^.+$/u, "’"], to: (raw, match, original = []) => ['搜索“', original.length === 3 ? original[1] : (/^Search for ‘([\s\S]*)’$/u.exec(original[0] || '')?.[1] ?? match[1]), '”'] },
    ],
    },
    // W24 workspace-destination-new ^\/workspaces\/[^/]+\/observability\/destinations\/new\/[^/]+$
    {
      id: "W24", slug: "workspace-destination-new", path: /^\/workspaces\/[^/]+\/observability\/destinations\/new\/[^/]+$/,
      exact: new Map([
      ["Add filter group (OR)","添加筛选组（OR）"],
      ["Add filter rule","添加筛选规则"],
      ["Add rule","添加规则"],
      ["Additional generation metadata","附加生成元数据"],
      ["API Key Filter","API 密钥筛选"],
      ["Application, API key, user, origin, and request identity fields. Privacy mode does not remove these identity fields when enabled.","应用、API 密钥、用户、来源和请求身份字段。启用隐私模式也不会移除这些身份字段。"],
      ["Base URL","基础 URL"],
      ["Choose which OpenRouter data region URLs send traces to this destination.","选择哪些 OpenRouter 数据区域 URL 的请求向此目标发送追踪数据。"],
      ["Configure credentials and endpoint. Test the connection before saving.","配置凭据和端点，并在保存前测试连接。"],
      ["Connection","连接"],
      ["Control what data is sent to this destination.","控制发送至此目标的数据。"],
      ["Control what percentage of traces are sent to this destination.","控制向此目标发送追踪数据的比例。"],
      ["Correlation, model, routing, token, and request context fields.","关联标识、模型、路由、Token 和请求上下文字段。"],
      ["Cost allocation","费用分摊"],
      ["European Union","欧盟"],
      ["Exclude prompt and completion data.","排除提示词和输出数据。"],
      ["Filter Rules","筛选规则"],
      ["Headers","请求头"],
      ["In-Region Routing requires a Business or Enterprise plan","区域内路由需要 Business 或 Enterprise 套餐"],
      ["Method","方法"],
      ["Never send traces from these API keys to this destination. Exclusions take precedence over included keys.","不向此目标发送这些 API 密钥的追踪数据。排除规则优先于包含规则。"],
      ["New destination | Settings | OpenRouter","新建目标 | 设置 | OpenRouter"],
      ["No filter rules configured. All traces will be sent to this destination.","尚未配置筛选规则。所有追踪数据都会发送至此目标。"],
      ["Only send traces from these API keys. If no keys are selected, traces from all API keys will be sent to this destination.","仅发送这些 API 密钥的追踪数据。不选择密钥则向此目标发送全部密钥的追踪数据。"],
      ["Only send traces that match specific criteria.","仅发送符合指定条件的追踪数据。"],
      ["Optionally filter traces by API key.","可按 API 密钥筛选追踪数据。"],
      ["Please fill in all required fields","请填写所有必填项"],
      ["Pricing details (service tier, region, BYOK) on every request, plus token counts and cost per token kind when they match the billed amount. Separate from Cost.","为每个请求附加价格明细（服务等级、区域、BYOK）；与计费金额一致时，还包含各类 Token 的数量与费用。此项独立于“费用”。"],
      ["Privacy Mode","隐私模式"],
      ["Public Key","公开密钥"],
      ["Regions","区域"],
      ["Secret Key","私密密钥"],
      ["Select API keys","选择 API 密钥"],
      ["Select...","选择…"],
      ["Send Trace","发送追踪数据"],
      ["Send traces from requests to","发送以下请求的追踪数据："],
      ["Show","显示"],
      ["Test Connection","测试连接"],
      ["These categories add opt-in fields to the payload.","选择这些类别可在载荷中添加相应字段。"],
      ["Usage, billing, credit pool, and BYOK fields, plus the model, tier, search, media, and cancellation fields that affect pricing.","用量、计费、余额池、BYOK 字段，以及影响价格的模型、等级、搜索、媒体和取消相关字段。"],
      ["equals","等于"],
      ["does not equal","不等于"],
      ["contains","包含"],
      ["does not contain","不包含"],
      ["matches regex","匹配正则"],
      ["starts with","开头为"],
      ["ends with","结尾为"],
      ["exists","存在"],
      ["does not exist","不存在"],
      ["User ID","用户 ID"],
      ["API Key Name","API 密钥名称"],
      ["Total Cost","总费用"],
      ["Total Tokens","Token 总数"],
      ["Prompt Tokens","提示词 Token"],
      ["Completion Tokens","输出 Token"],
    ]),
      rules: [
      { re: /^New (.+) Destination$/, to: m => '新建 ' + m[1] + ' 目标' },
      { re: /^Visit (.+)$/, to: m => '访问 ' + m[1] },
      { re: /^(Cost|Identity|Request context) \((\d+) fields\)$/, to: m =>
      ({ Cost: '费用', Identity: '身份', 'Request context': '请求上下文' })[m[1]] + '（' + m[2] + ' 个字段）' },
    ],
      overrides: [],
      fragments: [
      { head: "Search for ‘", when: isSearchEcho, re: /^Search for ‘(.+)’$/u, parts: ["Search for ‘", /^.+$/u, "’"], to: (raw, match, original = []) => ['搜索“', original.length === 3 ? original[1] : (/^Search for ‘([\s\S]*)’$/u.exec(original[0] || '')?.[1] ?? match[1]), '”'] },
    ],
    },
    // W10 workspace-files ^\/workspaces\/[^/]+\/files$
    {
      id: "W10", slug: "workspace-files", path: /^\/workspaces\/[^/]+\/files$/,
      exact: new Map([
      ["Choose a file to upload","选择要上传的文件"],
      ["Enable the Files API for this workspace: upload files, reference them in sandbox containers, and retrieve files produced by the shell and bash tools. Read more in our","为此工作区启用 Files API：上传文件、在沙箱容器中引用文件，并获取 Shell 和 Bash 工具生成的文件。详情请参阅"],
      ["Files | Workspace | OpenRouter","文件 | 工作区 | OpenRouter"],
      ["Files API","Files API"],
      ["Folder","文件夹"],
      ["Folder path","文件夹路径"],
      ["No files here yet","此处暂无文件"],
      ["Pick a destination folder, or create a new one as part of the upload.","选择目标文件夹，也可在上传时新建文件夹。"],
      ["Refresh files","刷新文件"],
      ["Select all files on this page","选择本页全部文件"],
      ["Toggle the Files API","切换 Files API"],
      ["Type","类型"],
      ["Up to 100 MB","最多 100 MB"],
      ["Upload file","上传文件"],
      ["New folder…","新建文件夹…"],
    ]),
      rules: [
      { re: /^([\d,]+) items$/, to: m => m[1] + ' 项' },
      { re: /^Upload a file to get started\. Use a folder path like “([^”]+)” to organize files\.$/, to: m => '上传文件即可开始。可使用“' + m[1] + '”这样的文件夹路径整理文件。' },
    ],
      overrides: [],
      fragments: [
      { head: "Enable the Files API for this workspace: upload files, reference them in sandbox containers, and retrieve files produced by the shell and bash tools. Read more in our", re: /^Enable the Files API for this workspace: upload files, reference them in sandbox containers, and retrieve files produced by the shell and bash tools\. Read more in our docs\.$/, parts: ["Enable the Files API for this workspace: upload files, reference them in sandbox containers, and retrieve files produced by the shell and bash tools. Read more in our", "docs", "."], to: () => ["为此工作区启用 Files API：上传文件、在沙箱容器中引用文件，并获取 Shell 和 Bash 工具生成的文件。详情请参阅","文档","。"] },
      { head: "Search for ‘", when: isSearchEcho, re: /^Search for ‘(.+)’$/u, parts: ["Search for ‘", /^.+$/u, "’"], to: (raw, match, original = []) => ['搜索“', original.length === 3 ? original[1] : (/^Search for ‘([\s\S]*)’$/u.exec(original[0] || '')?.[1] ?? match[1]), '”'] },
    ],
    },
    // W07 workspace-generation-detail ^\/workspaces\/[^/]+\/logs$
    {
      id: "W07", slug: "workspace-generation-detail", path: /^\/workspaces\/[^/]+\/logs$/,
      exact: new Map([
      ["Canonical ID","标准 ID"],
      ["Data policy","数据政策"],
      ["Enable I/O Logging","启用输入输出日志"],
      ["Enable I/O logging to view prompt and completion data for your generations on OpenRouter.","启用输入输出日志，以查看 OpenRouter 生成记录的提示词和输出内容。"],
      ["Fallback latency","回退延迟"],
      ["Fallbacks","回退次数"],
      ["Finish reason","结束原因"],
      ["Generation details","生成详情"],
      ["I/O logging is not enabled","尚未启用输入输出日志"],
      ["Model ID","模型 ID"],
      ["Next generation","下一条生成记录"],
      ["No data training","不用于数据训练"],
      ["Policy","政策"],
      ["Previous generation","上一条生成记录"],
      ["Provider latency","提供商延迟"],
      ["Provider Responses","提供商响应"],
      ["Request ID","请求 ID"],
      ["Streaming","流式输出"],
      ["Throughput","吞吐量"],
      ["Total:","总计："],
    ]),
      rules: [],
      overrides: [],
      fragments: [
      { head: "Search for ‘", when: isSearchEcho, re: /^Search for ‘(.+)’$/u, parts: ["Search for ‘", /^.+$/u, "’"], to: (raw, match, original = []) => ['搜索“', original.length === 3 ? original[1] : (/^Search for ‘([\s\S]*)’$/u.exec(original[0] || '')?.[1] ?? match[1]), '”'] },
    ],
    },
    // W29 workspace-guardrail-budget ^\/workspaces\/[^/]+\/guardrails\/default\/budget$
    {
      id: "W29", slug: "workspace-guardrail-budget", path: /^\/workspaces\/[^/]+\/guardrails\/default\/budget$/,
      exact: new Map([
      ["Credit Limit","消费限额"],
      ["every","每"],
      ["Leave blank for no limit.","留空则不限。"],
      ["Month","月"],
    ]),
      rules: [
      { re: /^This budget will apply individually to each key with this guardrail assigned\. For example, if you set a budget of (\$[\d,.]+) weekly, each assigned key will have a (\$[\d,.]+) weekly budget\.$/, to: m => '此预算分别应用于每个已分配此防护规则的密钥。例如，若每周预算为 ' + m[1] + '，每个已分配密钥的每周预算均为 ' + m[2] + '。' },
    ],
      overrides: [],
      fragments: [
      { head: "This guardrail applies to each workspace", re: /^This guardrail applies to each workspace key by default\.$/, parts: ["This guardrail applies to each workspace", "key by default."], to: () => ["此防护规则默认应用于每个工作区","密钥。"] },
      { head: "Search for ‘", when: isSearchEcho, re: /^Search for ‘(.+)’$/u, parts: ["Search for ‘", /^.+$/u, "’"], to: (raw, match, original = []) => ['搜索“', original.length === 3 ? original[1] : (/^Search for ‘([\s\S]*)’$/u.exec(original[0] || '')?.[1] ?? match[1]), '”'] },
    ],
    },
    // W12 workspace-guardrail-default ^\/workspaces\/[^/]+\/guardrails\/default$
    {
      id: "W12", slug: "workspace-guardrail-default", path: /^\/workspaces\/[^/]+\/guardrails\/default$/,
      exact: new Map([
      ["All allowed","全部允许"],
      ["Detect and respond to prompt injection attempts.","检测并处理提示词注入尝试。"],
      ["Identify and handle PII, credentials, and personal data.","识别并处理 PII、凭据和个人数据。"],
    ]),
      rules: [
      { re: /^([\d,]+) models$/, to: m => m[1] + ' 个模型' },
      { re: /^([\d,]+) allowed$/, to: m => '允许 ' + m[1] + ' 个' },
    ],
      overrides: [],
      fragments: [
      { head: "This guardrail applies to each workspace", re: /^This guardrail applies to each workspace key by default\.$/, parts: ["This guardrail applies to each workspace", "key by default."], to: () => ["此防护规则默认应用于每个工作区","密钥。"] },
      { head: "Search for ‘", when: isSearchEcho, re: /^Search for ‘(.+)’$/u, parts: ["Search for ‘", /^.+$/u, "’"], to: (raw, match, original = []) => ['搜索“', original.length === 3 ? original[1] : (/^Search for ‘([\s\S]*)’$/u.exec(original[0] || '')?.[1] ?? match[1]), '”'] },
    ],
    },
    // W13 workspace-guardrail-models ^\/workspaces\/[^/]+\/guardrails\/default\/models$
    {
      id: "W13", slug: "workspace-guardrail-models", path: /^\/workspaces\/[^/]+\/guardrails\/default\/models$/,
      exact: new Map([
      ["Control which models and providers are available for this guardrail.","控制此防护规则可使用的模型和提供商。"],
      ["Data & Privacy","数据与隐私"],
      ["Data regions","数据区域"],
      ["Only accept requests sent to the selected OpenRouter data region URLs. Requests through any other region are rejected.","仅接受发送至所选 OpenRouter 数据区域 URL 的请求，拒绝通过其他区域发送的请求。"],
      ["Restrict data regions","限制数据区域"],
      ["Access Policy","访问策略"],
      ["Restriction Mode","限制模式"],
      ["Only the providers and models listed below are accessible. Everything else is blocked.","仅可使用下方列出的提供商和模型，其他全部拦截。"],
      ["New providers and models will be automatically blocked.","新增的提供商和模型将自动被拦截。"],
      ["Add provider","添加提供商"],
      ["Allowed Models","允许的模型"],
      ["Current Eligibility","当前可用范围"],
      ["Based on the restrictions, data policies, and org/workspace policies above.","根据上方的访问限制、数据策略及组织和工作区策略计算。"],
      ["Eligibility views","可用范围视图"],
      ["Hide ineligible","隐藏不符合条件的项"],
      ["Eligible","符合条件"],
      ["Coding harness models","编程工具的模型列表"],
      ["First-party only","仅显示官方模型"],
      ["Codex lists only OpenAI models, and Claude Code and Claude Desktop list only Anthropic models. A model the harness is told to use directly still works.","Codex 仅列出 OpenAI 模型；Claude Code 和 Claude Desktop 仅列出 Anthropic 模型。直接指定使用的模型仍可用。"],
    ]),
      rules: [
      { when: e => !!e.closest('button'), re: /^Remove (.+)$/, to: m => '移除 ' + m[1] },
    ],
      overrides: [],
      fragments: [
      { head: "This guardrail applies to each workspace", re: /^This guardrail applies to each workspace key by default\.$/, parts: ["This guardrail applies to each workspace", "key by default."], to: () => ["此防护规则默认应用于每个工作区","密钥。"] },
      { head: "Only the providers and models listed below are accessible. Everything else is blocked.", re: /^Only the providers and models listed below are accessible\. Everything else is blocked\.New providers and models will be automatically blocked\.$/, parts: ["Only the providers and models listed below are accessible. Everything else is blocked.", "New providers and models will be automatically blocked."], to: () => ["仅可使用下方列出的提供商和模型，其他全部拦截。","新增的提供商和模型将自动被拦截。"] },
      { head: "Search for ‘", when: isSearchEcho, re: /^Search for ‘(.+)’$/u, parts: ["Search for ‘", /^.+$/u, "’"], to: (raw, match, original = []) => ['搜索“', original.length === 3 ? original[1] : (/^Search for ‘([\s\S]*)’$/u.exec(original[0] || '')?.[1] ?? match[1]), '”'] },
    ],
    },
    // W14 workspace-guardrail-prompt-injection ^\/workspaces\/[^/]+\/guardrails\/default\/prompt-injection$
    {
      id: "W14", slug: "workspace-guardrail-prompt-injection", path: /^\/workspaces\/[^/]+\/guardrails\/default\/prompt-injection$/,
      exact: new Map([
      ["allow list in Privacy settings","隐私设置中的白名单"],
      ["Detect and respond to prompt injection attempts in user inputs.","检测并处理用户输入中的提示词注入尝试。"],
      ["Disabled","已禁用"],
      ["No added latency","不增加延迟"],
      ["Regex-based detection","基于正则的检测"],
      ["Scan requests using","使用"],
      ["See the full pattern list","查看完整匹配模式列表"],
      ["-inspired regex patterns for common injection techniques.","启发的正则表达式，检测常见注入手法。"],
      [". To allow specific phrases that should never trigger this guardrail, manage your","。如需放行不应触发此规则的特定短语，请管理"],
      ["Regex-based prompt injection detection is best-effort. If the detection service is temporarily unavailable, requests will still be served.","正则检测可能无法识别所有提示词注入。检测服务暂时不可用时，请求仍会正常处理。"],
    ]),
      rules: [],
      overrides: [],
      fragments: [
      { head: "This guardrail applies to each workspace", re: /^This guardrail applies to each workspace key by default\.$/, parts: ["This guardrail applies to each workspace", "key by default."], to: () => ["此防护规则默认应用于每个工作区","密钥。"] },
      { head: "Scan requests using", re: /^Scan requests using OWASP-inspired regex patterns for common injection techniques\. See the full pattern list\. To allow specific phrases that should never trigger this guardrail, manage your allow list in Privacy settings\.$/, parts: ["Scan requests using", "OWASP", "-inspired regex patterns for common injection techniques.", "See the full pattern list", ". To allow specific phrases that should never trigger this guardrail, manage your", "allow list in Privacy settings", "."], to: () => ["使用","OWASP","启发的正则表达式，检测常见注入手法。","查看完整匹配模式列表","。如需放行不应触发此规则的特定短语，请管理","隐私设置中的白名单","。"] },
      { head: "Search for ‘", when: isSearchEcho, re: /^Search for ‘(.+)’$/u, parts: ["Search for ‘", /^.+$/u, "’"], to: (raw, match, original = []) => ['搜索“', original.length === 3 ? original[1] : (/^Search for ‘([\s\S]*)’$/u.exec(original[0] || '')?.[1] ?? match[1]), '”'] },
    ],
    },
    // W15 workspace-guardrail-sensitive-info ^\/workspaces\/[^/]+\/guardrails\/default\/sensitive-info$
    {
      id: "W15", slug: "workspace-guardrail-sensitive-info", path: /^\/workspaces\/[^/]+\/guardrails\/default\/sensitive-info$/,
      exact: new Map([
      ["Address","地址"],
      ["Adds latency","增加延迟"],
      ["API keys and secrets","API 密钥和机密信息"],
      ["API keys and secrets information","API 密钥和机密信息说明"],
      ["Credit card number","信用卡号"],
      ["Credit card number information","信用卡号说明"],
      ["Custom Patterns","自定义模式"],
      ["Email address","邮箱地址"],
      ["Email address information","邮箱地址说明"],
      ["Enable all","全部启用"],
      ["Enter sample input to preview what the LLM would receive (redaction) or whether the request would be blocked.","输入样例内容，预览脱敏后 LLM 收到的内容，或请求是否会被拦截。"],
      ["Identify and handle sensitive data like PII, credentials, and personal information.","识别并处理 PII、凭据、个人信息等敏感数据。"],
      ["IP address","IP 地址"],
      ["IP address information","IP 地址说明"],
      ["No patterns configured. Add a regex pattern to redact or block matching content.","尚未配置匹配模式。添加正则表达式后，可脱敏或拦截匹配的内容。"],
      ["Patterns","匹配模式"],
      ["Person name","姓名"],
      ["Phone number","电话号码"],
      ["Phone number information","电话号码说明"],
      ["Social Security number","社会安全号码"],
      ["Social Security number information","社会安全号码说明"],
      ["Test Your Patterns","测试匹配模式"],
      ["Toggle Email address","切换邮箱地址"],
      ["Toggle Phone number","切换电话号码"],
      ["Toggle Social Security number","切换社会安全号码"],
      ["Toggle Credit card number","切换信用卡号"],
      ["Toggle IP address","切换IP 地址"],
      ["Toggle API keys and secrets","切换API 密钥和机密信息"],
      ["Toggle Person name","切换姓名"],
      ["Toggle Address","切换地址"],
      ["Restore","还原修改"],
      ["Enter regex pattern","输入正则表达式"],
      ["Remove pattern","移除匹配项"],
    ]),
      rules: [
      { type: "attr:aria-label", re: /^Pattern (\d+) regex$/, to: m => '匹配项 ' + m[1] + ' 的正则表达式' },
      { type: "attr:aria-label", re: /^Pattern (\d+) action$/, to: m => '匹配项 ' + m[1] + ' 的处理方式' },
    ],
      overrides: [],
      fragments: [
      { head: "This guardrail applies to each workspace", re: /^This guardrail applies to each workspace key by default\.$/, parts: ["This guardrail applies to each workspace", "key by default."], to: () => ["此防护规则默认应用于每个工作区","密钥。"] },
      { head: "Search for ‘", when: isSearchEcho, re: /^Search for ‘(.+)’$/u, parts: ["Search for ‘", /^.+$/u, "’"], to: (raw, match, original = []) => ['搜索“', original.length === 3 ? original[1] : (/^Search for ‘([\s\S]*)’$/u.exec(original[0] || '')?.[1] ?? match[1]), '”'] },
    ],
    },
    // W11 workspace-guardrails ^\/workspaces\/[^/]+\/guardrails$
    {
      id: "W11", slug: "workspace-guardrails", path: /^\/workspaces\/[^/]+\/guardrails$/,
      exact: new Map([
      ["Active","启用中"],
      ["Add API key","添加 API 密钥"],
      ["Apply this guardrail to specific API keys.","将此防护规则应用于指定 API 密钥。"],
      ["Assign this guardrail to API keys. You must make at least one assignment to continue.","将此防护规则分配给 API 密钥。至少分配一个密钥后才能继续。"],
      ["Assignment","分配范围"],
      ["Basic Info & Assignment","基本信息与分配"],
      ["Configure budget, model & provider, prompt-injection, and sensitive-info policies.","配置预算、模型与提供商、提示词注入和敏感信息策略。"],
      ["Confirm the configured policies.","确认已配置的策略。"],
      ["Create new guardrail","创建防护规则"],
      ["Describe what this guardrail is for (optional)","说明此防护规则的用途（可选）"],
      ["Description (optional)","描述（可选）"],
      ["Exit","退出"],
      ["Filter guardrails by status","按状态筛选防护规则"],
      ["Members","成员"],
      ["Name your guardrail and choose the members and API keys it applies to.","为防护规则命名，并选择适用的成员和 API 密钥。"],
      ["New guardrail","新建防护规则"],
      ["Next","下一步"],
      ["Policies","策略"],
      ["Review","确认配置"],
      ["Search by name...","按名称搜索…"],
      ["Set spending limits, data privacy rules, and model/provider restrictions for API keys in this workspace.","为此工作区的 API 密钥设置消费限额、数据隐私规则及模型、提供商限制。"],
      ["Steps","步骤"],
      ["Unassigned","未分配"],
      ["Edit status filter","编辑状态筛选"],
      ["Clear filter","清除筛选"],
      ["Clear status filter","清除状态筛选"],
      ["No guardrails found","未找到防护规则"],
      ["Try adjusting your search or status filter to see more results.","调整搜索词或状态筛选，以查看更多结果。"],
    ]),
      rules: [
      { re: /^([\d,]+) guardrails?$/, to: m => m[1] + ' 个防护规则' },
      { type: "attr:placeholder", re: /^e\.g\. (.+)$/, to: m => '例如：' + m[1] },
    ],
      overrides: [],
      fragments: [
      { head: "Search for ‘", when: isSearchEcho, re: /^Search for ‘(.+)’$/u, parts: ["Search for ‘", /^.+$/u, "’"], to: (raw, match, original = []) => ['搜索“', original.length === 3 ? original[1] : (/^Search for ‘([\s\S]*)’$/u.exec(original[0] || '')?.[1] ?? match[1]), '”'] },
    ],
    },
    // W23 workspace-io-logging-settings ^\/workspaces\/[^/]+\/observability\/io-logging-settings$
    {
      id: "W23", slug: "workspace-io-logging-settings", path: /^\/workspaces\/[^/]+\/observability\/io-logging-settings$/,
      exact: new Map([
      ["All API keys","全部 API 密钥"],
      ["API Keys Filter","API 密钥筛选"],
      ["Control what percentage of requests have their inputs and outputs logged.","控制记录输入输出内容的请求比例。"],
      ["I/O Logging Settings","输入输出日志设置"],
      ["I/O Logging Settings | Observability | OpenRouter","输入输出日志设置 | 可观测性 | OpenRouter"],
      ["Never log I/O for these API keys. Exclusions take precedence over included keys.","不记录这些 API 密钥的输入输出。排除规则优先于包含规则。"],
      ["No excluded keys","未排除密钥"],
      ["Only log I/O for these API keys. If no keys are selected, all API keys will be included.","仅记录这些 API 密钥的输入输出。不选择密钥则包含全部密钥。"],
      ["Optionally filter I/O logging by API key.","可按 API 密钥筛选输入输出日志。"],
    ]),
      rules: [],
      overrides: [],
      fragments: [
      { head: "Search for ‘", when: isSearchEcho, re: /^Search for ‘(.+)’$/u, parts: ["Search for ‘", /^.+$/u, "’"], to: (raw, match, original = []) => ['搜索“', original.length === 3 ? original[1] : (/^Search for ‘([\s\S]*)’$/u.exec(original[0] || '')?.[1] ?? match[1]), '”'] },
    ],
    },
    // W09 workspace-key-detail ^\/workspaces\/[^/]+\/keys\/[^/]+$
    {
      id: "W09", slug: "workspace-key-detail", path: /^\/workspaces\/[^/]+\/keys\/[^/]+$/,
      exact: new Map([
      ["API Key | Settings | OpenRouter","API 密钥 | 设置 | OpenRouter"],
      ["Avg","平均"],
      ["Choose a clear, descriptive name to identify this key.","为此密钥取一个清晰、易于识别的名称。"],
      ["Expiration cannot be modified. Create a new API key for a new expiration time.","到期时间无法修改。如需调整，请创建新的 API 密钥。"],
      ["Leave blank for unlimited","留空则不限"],
      ["Max","最大"],
      ["Min","最小"],
      ["Once the credits ($USD) consumed by this key reach this amount, the key stops working. Leave blank for no limit.","此密钥消耗的余额（$USD）达到该金额后将停止工作。留空则不限。"],
      ["Reset limit","重置限额"],
      ["Totals","总计"],
      ["When the credit limit resets — daily at midnight UTC, weekly on Monday, or monthly on the 1st.","限额重置时间：每日 UTC 零点、每周一或每月 1 日。"],
      ["No budget limits configured.","未配置预算限额。"],
      ["Partial","部分"],
      ["Unavailable","不可用"],
      ["Account Settings","账户设置"],
      ["Unset","未设置"],
      ["Disable Key","禁用密钥"],
      ["Prevent this key from being used. You can re-enable it later.","禁止使用此密钥，之后可重新启用。"],
      ["Delete Key","删除密钥"],
      ["Permanently delete this key. This action cannot be undone.","永久删除此密钥，此操作无法撤销。"],
      ["just now","刚刚"],
      ["Are you sure you want to delete","确定要删除"],
      ["? This action cannot be undone.","吗？此操作无法撤销。"],
    ]),
      rules: [
      { re: /^([\d,]+)\s+keys?$/, to: m => m[1] + ' 个密钥' },
      { re: /^(\d+)\s+(minutes?|hours?|days?|months?) ago$/, to: m =>
      m[1] + ' ' + ({ minute: '分钟前', hour: '小时前', day: '天前', month: '个月前' })[m[2].replace(/s$/, '')] },
      { re: /^([\d,]+) models$/, to: m => m[1] + ' 个模型' },
      { type: "attr:placeholder", re: /^e\.g\. (.+)$/, to: m => '例如：' + m[1] },
      { re: /^Spend in last (\d+) days$/, to: m => '最近 ' + m[1] + ' 天的支出' },
    ],
      overrides: [
      { order: 12, path: /^\/workspaces\/[^/]+\/keys\/[^/]+$/, when: e => !isChrome(e), map: new Map([["Usage", "费用"], ["models", "个模型"]]) },
    ],
      fragments: [
      { head: "Search for ‘", when: isSearchEcho, re: /^Search for ‘(.+)’$/u, parts: ["Search for ‘", /^.+$/u, "’"], to: (raw, match, original = []) => ['搜索“', original.length === 3 ? original[1] : (/^Search for ‘([\s\S]*)’$/u.exec(original[0] || '')?.[1] ?? match[1]), '”'] },
    ],
    },
    // W08 workspace-keys ^\/workspaces\/[^/]+\/keys(?:\/[^/]+)?$
    {
      id: "W08", slug: "workspace-keys", path: /^\/workspaces\/[^/]+\/keys(?:\/[^/]+)?$/,
      exact: new Map([
      ["API keys | Settings | OpenRouter","API 密钥 | 设置 | OpenRouter"],
      ["Choose a credit limit","选择消费限额"],
      ["Create and manage your API keys.","创建和管理 API 密钥。"],
      ["Create API Key","创建 API 密钥"],
      ["Edit","编辑"],
      ["Key limit","密钥限额"],
      ["Key usage","密钥用量"],
      ["Last Used","最近使用"],
      ["Move to...","移动至…"],
      ["Row actions","行操作"],
      ["Search by name or paste a key...","按名称搜索或粘贴密钥…"],
      ["Select all rows","选择全部行"],
      ["TOTAL","累计"],
      ["unlimited","不限"],
      ["Custom amount","自定义金额"],
      ["No API keys found","未找到 API 密钥"],
      ["No API keys match your search or filters.","没有符合搜索或筛选条件的 API 密钥。"],
      ["selected","项已选"],
    ]),
      rules: [
      { re: /^(\d+)\s+days?$/, to: m => m[1] + ' 天' },
      { re: /^(\d+)\s+hour$/, to: m => m[1] + ' 小时' },
      { re: /^(\d+)\s+year$/, to: m => m[1] + ' 年' },
      { re: /^([\d,]+)\s+keys?$/, to: m => m[1] + ' 个密钥' },
      { re: /^(\d+)\s+(minutes?|hours?|days?|months?) ago$/, to: m =>
      m[1] + ' ' + ({ minute: '分钟前', hour: '小时前', day: '天前', month: '个月前' })[m[2].replace(/s$/, '')] },
      { type: "attr:placeholder", re: /^e\.g\. (.+)$/, to: m => '例如：' + m[1] },
      { type: "attr:title", re: /^(\$[\d,.]+) credits used$/, to: m => '已使用余额 ' + m[1] },
      { type: "attr:aria-label", re: /^Select (.+)$/, to: m => '选择 ' + m[1] },
      { type: "attr:title", re: /^Key limit: ([\d,.]+)% used of unlimited$/, to: m => '密钥限额：已用 ' + m[1] + '%，总额不限' },
    ],
      overrides: [
      { order: 10, path: /^\/workspaces\/[^/]+\/keys$/, when: e => tableColumn(e) === 'Expires', map: new Map([["Never", "永不过期"]]) },
      { order: 11, path: /^\/workspaces\/[^/]+\/keys(?:\/[^/]+)?$/, when: e => !isChrome(e), map: new Map([["Credit limit", "消费限额"]]) },
    ],
      fragments: [
      { head: "Search for ‘", when: isSearchEcho, re: /^Search for ‘(.+)’$/u, parts: ["Search for ‘", /^.+$/u, "’"], to: (raw, match, original = []) => ['搜索“', original.length === 3 ? original[1] : (/^Search for ‘([\s\S]*)’$/u.exec(original[0] || '')?.[1] ?? match[1]), '”'] },
    ],
    },
    // W22 workspace-observability ^\/workspaces\/[^/]+\/observability$
    {
      id: "W22", slug: "workspace-observability", path: /^\/workspaces\/[^/]+\/observability$/,
      exact: new Map([
      ["Choose a destination to start sending traces","选择目标以开始发送追踪数据"],
      ["Edit settings","编辑设置"],
      ["for debugging, evaluating responses, and optimizing prompts.","中显示提示词和输出，便于调试、评估回复和优化提示词。"],
      ["Input & output logging","输入输出日志"],
      ["Input & output logging actions","输入输出日志操作"],
      ["logs","日志"],
      ["Observability | OpenRouter","可观测性 | OpenRouter"],
      ["Search destinations","搜索目标"],
      ["Send a trace of every request to the tools you already use. No SDK or code changes needed.","将每个请求的追踪数据发送至已有工具，无需修改 SDK 或代码。"],
      ["Show prompts and completions in your","在"],
      ["Traces","追踪"],
    ]),
      rules: [],
      overrides: [],
      fragments: [
      { head: "Show prompts and completions in your", re: /^Show prompts and completions in your logs for debugging, evaluating responses, and optimizing prompts\.$/, parts: ["Show prompts and completions in your", "logs", "for debugging, evaluating responses, and optimizing prompts."], to: () => ["在","日志","中显示提示词和输出，便于调试、评估回复和优化提示词。"] },
      { head: "Search for ‘", when: isSearchEcho, re: /^Search for ‘(.+)’$/u, parts: ["Search for ‘", /^.+$/u, "’"], to: (raw, match, original = []) => ['搜索“', original.length === 3 ? original[1] : (/^Search for ‘([\s\S]*)’$/u.exec(original[0] || '')?.[1] ?? match[1]), '”'] },
    ],
    },
    // W20 workspace-preset-new ^\/workspaces\/[^/]+\/presets\/new$
    {
      id: "W20", slug: "workspace-preset-new", path: /^\/workspaces\/[^/]+\/presets\/new$/,
      exact: new Map([
      ["Allow fallbacks","允许回退"],
      ["Attach server tools like web search that run automatically when this preset is used.","附加网页搜索等服务端工具，使用此预设时自动运行。"],
      ["Basic Info","基本信息"],
      ["Cache TTL","缓存有效期（TTL）"],
      ["Caching","缓存"],
      ["Configure model parameters like temperature, max tokens, etc. These will override default values when the preset is used. Check the boxes next to parameters you want to include in this preset.","配置温度、最大 Token 等模型参数。使用预设时，这些设置会覆盖默认值。勾选需要包含在预设中的参数。"],
      ["Configure provider routing preferences like allowed/ignored providers, fallbacks, etc.","配置提供商路由偏好，如允许或排除的提供商、回退等。"],
      ["Configure reasoning (thinking) parameters for models that support extended reasoning capabilities. When not included, the model's default reasoning behavior is preserved.","为支持扩展推理的模型配置推理参数。不包含此项时，保留模型的默认推理行为。"],
      ["Configure reasoning (thinking) parameters for models that support extended reasoning.","为支持扩展推理的模型配置推理参数。"],
      ["Configure response caching to reduce costs and latency for repeated requests.","配置响应缓存，降低重复请求的费用和延迟。"],
      ["Control which providers are used and routing preferences.","控制使用的提供商及路由偏好。"],
      ["Controls how much reasoning the model performs. Higher effort may produce better results but uses more tokens.","控制模型的推理强度。强度越高，结果可能越好，但会消耗更多 Token。"],
      ["Controls randomness in the output. Lower values are more deterministic.","控制输出的随机程度。数值越低，结果越确定。"],
      ["Controls response detail level. Only supported by OpenAI and Anthropic models; other models will ignore this parameter.","控制回复的详细程度。仅 OpenAI 和 Anthropic 模型支持，其他模型会忽略此参数。"],
      ["Enable Caching","启用缓存"],
      ["Enable extended reasoning for models that support it (e.g., GPT-5, Claude, Gemini).","为支持的模型启用扩展推理，如 GPT-5、Claude、Gemini。"],
      ["Enable Reasoning","启用推理"],
      ["Exclude Reasoning from Response","从回复中排除推理内容"],
      ["Frequency Penalty","频率惩罚"],
      ["How long to cache responses (default: 5m)","响应缓存时长（默认：5m）"],
      ["Include Provider Preferences","包含提供商偏好"],
      ["Limits the number of highest probability tokens to consider.","限制参与采样的高概率 Token 数量。"],
      ["Maximum number of tokens for reasoning. Cannot be used together with effort level.","推理可使用的最大 Token 数，不能与推理强度同时设置。"],
      ["Maximum number of tokens to generate.","最多生成的 Token 数。"],
      ["Model Selection (Optional)","模型选择（可选）"],
      ["New preset | Settings | OpenRouter","新建预设 | 设置 | OpenRouter"],
      ["Note: These settings only apply to models that support reasoning (e.g., GPT-5, Claude, and Gemini models). They will be ignored when the preset is used with non-reasoning models.","注意：这些设置仅适用于支持推理的模型，如 GPT-5、Claude 和 Gemini。使用不支持推理的模型时会被忽略。"],
      ["Nucleus sampling parameter. Controls diversity via cumulative probability.","核采样参数，通过累积概率控制输出多样性。"],
      ["Override default generation settings like temperature and max tokens.","覆盖温度、最大 Token 等默认生成设置。"],
      ["Parameters","参数"],
      ["Preferred maximum latency (in seconds). Can be a number (applies to p50) or an object with percentile-specific cutoffs. Endpoints above the threshold(s) may still be used, but are deprioritized in routing. When using fallback models, this may cause a fallback model to be used instead of the primary model if it meets the threshold.","期望的最大延迟，单位为秒。可填写数值（适用于 p50），或填写按百分位指定阈值的对象。超出阈值的端点仍可能使用，但路由优先级会降低。使用回退模型时，若回退模型符合阈值，可能优先使用它而非主模型。"],
      ["Preset name and description for identification and organization.","用于识别和整理预设的名称及描述。"],
      ["Provider Preferences","提供商偏好"],
      ["Provider Routing","提供商路由"],
      ["Random seed for deterministic outputs (when supported).","用于生成确定性输出的随机种子（需要模型支持）。"],
      ["Reasoning Effort","推理强度"],
      ["Reasoning Max Tokens","推理最大 Token 数"],
      ["Reduces repetition based on token frequency in the text so far.","根据 Token 在已有文本中的出现频率减少重复。"],
      ["Require parameters","要求支持指定参数"],
      ["Response Caching","响应缓存"],
      ["Save Preset","保存预设"],
      ["Seed","随机种子"],
      ["Select an option","选择选项"],
      ["Selects the provider service tier: priority routes to faster paid-tier capacity, ultrafast routes to the fastest capacity above priority and falls back to priority, flex routes to cheaper capacity with slower response times. Only applied by providers that support tiered service; others use the default tier.","选择提供商的服务等级：priority 使用较快的付费容量；ultrafast 使用比 priority 更快的容量，不可用时回退至 priority；flex 使用价格更低但响应更慢的容量。仅支持分级服务的提供商会应用此设置，其他提供商使用默认等级。"],
      ["Service Tier","服务等级"],
      ["Set instructions that will be included with every request using this preset.","设置指令，使用此预设的每个请求都会包含这些指令。"],
      ["System Prompt (Optional)","系统提示词（可选）"],
      ["Temperature","温度"],
      ["The sorting strategy to use for this request, if \"order\" is not specified. When set, no load balancing is performed.","未指定 order 时，此请求使用的排序策略。设置后不再进行负载均衡。"],
      ["Top K","Top K"],
      ["Top P","Top P"],
      ["Verbosity","详细程度"],
      ["When enabled, reasoning tokens will not be included in the response output.","启用后，回复输出中不包含推理 Token。"],
      ["When enabled, repeated identical requests will be served from cache.","启用后，重复的相同请求会直接返回缓存结果。"],
      ["Yes","是"],
      [". Leave empty to allow any model. If multiple models are selected, they will be used as fallbacks.","个。留空则允许任意模型。选择多个模型时，会按回退顺序使用。"],
      ["Specify which model(s) this preset should use, up to","指定此预设使用的模型，最多"],
      ["Select All","全选"],
      ["Data collection setting. If no available model provider meets the requirement, your request will return an error. - allow: (default) allow providers which store user data non-transiently and may train on it - deny: use only providers which do not collect user data.","数据收集设置。若没有符合要求的模型提供商，请求会报错。allow：默认值，允许长期存储用户数据并可能将其用于训练的提供商；deny：仅使用不收集用户数据的提供商。"],
      ["An ordered list of provider slugs. The router will attempt to use the first provider in the subset of this list that supports your requested model, and fall back to the next if it is unavailable. If no providers are available, the request will fail with an error message.","按优先顺序排列的提供商 Slug。路由器会依次尝试支持所请求模型的提供商，不可用时切换到下一个。全部不可用时，请求会返回错误。"],
      ["List of provider slugs to allow. If provided, this list is merged with your account-wide allowed provider settings for this request.","允许使用的提供商 Slug 列表。设置后，会与账户级允许列表合并，用于此请求。"],
      ["List of provider slugs to ignore. If provided, this list is merged with your account-wide ignored provider settings for this request.","排除的提供商 Slug 列表。设置后，会与账户级排除列表合并，用于此请求。"],
      ["A list of quantization levels to filter the provider by.","用于筛选提供商的量化精度列表。"],
      ["The object specifying the maximum price you want to pay for this request. USD price per million tokens, for prompt and completion.","设置此请求的最高价格，分别指定输入和输出每百万 Token 的价格，单位为 USD。"],
      ["Preferred minimum throughput (in tokens per second). Can be a number (applies to p50) or an object with percentile-specific cutoffs. Endpoints below the threshold(s) may still be used, but are deprioritized in routing. When using fallback models, this may cause a fallback model to be used instead of the primary model if it meets the threshold.","期望的最低吞吐量，单位为 Token/秒。可填写数值（适用于 p50），或填写按百分位指定阈值的对象。低于阈值的端点仍可能使用，但路由优先级会降低。使用回退模型时，若回退模型符合阈值，可能优先使用它而非主模型。"],
      ["Presence Penalty","存在惩罚"],
      ["Reduces repetition based on whether tokens appear in the text so far.","根据 Token 在已有文本中是否出现过减少重复。"],
      ["Repetition Penalty","重复惩罚"],
      ["Penalizes repetition. Values > 1 discourage repetition, < 1 encourage it.","重复惩罚。数值 > 1 时抑制重复，< 1 时鼓励重复。"],
      ["Max Tokens","最大 Token 数"],
      ["Prompt:","输入："],
      ["Completion:","输出："],
    ]),
      rules: [
      { re: /^([\d,]+) models$/, to: m => m[1] + ' 个模型' },
      { re: /^([\d,]+) advisors?$/, to: m => m[1] + ' 个 Advisor' },
      { re: /^([\d,]+) subagents?$/, to: m => m[1] + ' 个子智能体' },
      { re: /^Default: ([\d,]+), max ([\d,]+)$/, to: m => '默认：' + m[1] + '，最大：' + m[2] },
      { re: /^Default: ([\d,]+)$/, to: m => '默认：' + m[1] },
      { type: "attr:aria-label", re: /^Analysis Models (\d+)$/, to: m => '分析模型 ' + m[1] },
      { type: "attr:aria-label", re: /^(Advisors|Subagents) (\d+) (name|model|instructions|max tool calls)$/, to: m =>
      (m[1] === 'Advisors' ? 'Advisor ' : '子智能体 ') + m[2] + ' ' +
      ({ name: '名称', model: '模型', instructions: '指令', 'max tool calls': '最大工具调用次数' })[m[3]] },
      { type: "attr:aria-label", re: /^Remove (advisor|subagent) (\d+)$/, to: m =>
      '移除' + (m[1] === 'advisor' ? ' Advisor ' : '子智能体 ') + m[2] },
      { type: "attr:placeholder", re: /^Name \(e\.g\. (.+)\)$/, to: m => '名称（如 ' + m[1] + '）' },
    ],
      overrides: [],
      fragments: [
      { head: "Search for ‘", when: isSearchEcho, re: /^Search for ‘(.+)’$/u, parts: ["Search for ‘", /^.+$/u, "’"], to: (raw, match, original = []) => ['搜索“', original.length === 3 ? original[1] : (/^Search for ‘([\s\S]*)’$/u.exec(original[0] || '')?.[1] ?? match[1]), '”'] },
    ],
    },
    // W19 workspace-presets ^\/workspaces\/[^/]+\/presets$
    {
      id: "W19", slug: "workspace-presets", path: /^\/workspaces\/[^/]+\/presets$/,
      exact: new Map([
      ["Create a preset to save your model + parameter configuration.","创建预设以保存模型和参数配置。"],
      ["No presets yet","暂无预设"],
      ["Presets | Settings | OpenRouter","预设 | 设置 | OpenRouter"],
      ["Presets are shortcuts for your system prompts, model and provider configurations, and request parameters.","使用预设可快速复用系统提示词、模型、提供商配置和请求参数。"],
    ]),
      rules: [],
      overrides: [],
      fragments: [
      { head: "Search for ‘", when: isSearchEcho, re: /^Search for ‘(.+)’$/u, parts: ["Search for ‘", /^.+$/u, "’"], to: (raw, match, original = []) => ['搜索“', original.length === 3 ? original[1] : (/^Search for ‘([\s\S]*)’$/u.exec(original[0] || '')?.[1] ?? match[1]), '”'] },
    ],
    },
    // W18 workspace-routing ^\/workspaces\/[^/]+\/routing$
    {
      id: "W18", slug: "workspace-routing", path: /^\/workspaces\/[^/]+\/routing$/,
      exact: new Map([
      ["By default, OpenRouter balances low prices with high uptime.","默认情况下，OpenRouter 会兼顾低价格和高可用性。"],
      ["Choose how providers should be sorted for your requests.","选择请求的提供商排序方式。"],
      ["Choose how providers should be sorted. Individual requests can override this setting.","选择提供商排序方式。单个请求可以覆盖此设置。"],
      ["Choose the service tier requests use unless they ask for one.","选择未指定服务等级的请求所使用的默认等级。"],
      ["Configure which models the Auto Router can route to.","配置 Auto Router 可选择的模型。"],
      ["Cost Tier","成本档位"],
      ["Default Provider Sort","默认提供商排序"],
      ["Default Service Tier","默认服务等级"],
      ["Excluded Model List","排除模型列表"],
      ["Low (Default)","低（默认）"],
      ["Only models within the selected cost band are used for routing. Lower tiers favor cheaper models, while higher tiers favor more capable, expensive ones.","仅路由至所选成本档位内的模型。低档位优先低价模型，高档位优先能力更强、价格更高的模型。"],
      ["Price (cheapest first)","价格（低价优先）"],
      ["Restrict to Allowed Model List","限定允许的模型列表"],
      ["Routing | Settings | OpenRouter","路由 | 设置 | OpenRouter"],
      ["themselves. A preset or request value takes precedence.","的请求。预设或请求中的值优先。"],
      ["Use model patterns to control which models the auto-router can route between. Separate patterns with commas or newlines, and use wildcards such as \"anthropic/*\" to match a model family. Leave empty to let the auto-router choose from every model it ranks for your request.","使用模型匹配模式控制自动路由器可选择的模型。用英文逗号或换行分隔，并可使用“anthropic/*”等通配符匹配模型系列。留空则允许从当前请求的全部候选模型中选择。"],
      ["Use model patterns to exclude models from auto-router selection. Same syntax as the allow list: separate patterns with commas or newlines, and wildcards such as \"openai/*\" match a model family. Exclusions apply after the allow list, so an excluded model is never routed to even when it matches an allowed pattern. Leave empty to exclude nothing.","使用模型匹配模式排除自动路由器的候选模型。语法与允许列表相同：用英文逗号或换行分隔，“openai/*”等通配符匹配模型系列。排除规则后于允许列表应用，因此被排除的模型不会被选择，即使它匹配允许模式。留空则不排除任何模型。"],
      ["Applied to requests that set no","适用于未自行指定"],
      ["Route to the best model for each request using","为每个请求选择最佳模型，使用"],
      ["and","和"],
      ["Extra High","极高"],
      ["Default Model","默认模型"],
      ["Set the default model for apps and fallback routing.","设置应用及回退路由使用的默认模型。"],
      ["Apps will use this model by default, but they may override it if they choose to do so.","应用会默认使用此模型，也可自行覆盖。"],
      ["This model will also be used as your default","此模型也将作为默认"],
      ["fallback model","回退模型"],
      ["No default","未设置默认模型"],
      ["Default (balanced)","默认（均衡）"],
      ["Throughput (highest first)","吞吐量（从高到低）"],
      ["Latency (lowest first)","延迟（从低到高）"],
      ["Exacto (tool-call quality first)","Exacto（工具调用质量优先）"],
    ]),
      rules: [],
      overrides: [
      { order: 1, path: /^\/workspaces\/[^/]+\/routing$/, when: e => !!e.closest('[role="listbox"],[role="combobox"]'), map: new Map([["Max", "最高"]]) },
    ],
      fragments: [
      { head: "Choose how providers should be sorted. Individual requests can override this setting.", re: /^Choose how providers should be sorted\. Individual requests can override this setting\.By default, OpenRouter balances low prices with high uptime\. Learn more\.$/, parts: ["Choose how providers should be sorted. Individual requests can override this setting.", "By default, OpenRouter balances low prices with high uptime.", "Learn more", "."], to: () => ["选择提供商排序方式。单个请求可以覆盖此设置。","默认情况下，OpenRouter 会兼顾低价格和高可用性。","了解更多","。"] },
      { head: "Applied to requests that set no", re: /^Applied to requests that set no themselves\. A preset or request value takes precedence\. Learn more\.$/, parts: ["Applied to requests that set no", "themselves. A preset or request value takes precedence.", "Learn more", "."], to: () => ["适用于未自行指定","的请求。预设或请求中的值优先。","了解更多","。"] },
      { head: "Route to the best model for each request using", re: /^Route to the best model for each request using (openrouter\/auto) and (openrouter\/auto-beta)\. Learn more$/, parts: ["Route to the best model for each request using", /^openrouter\/auto$/, "and", /^openrouter\/auto-beta$/, ".", "Learn more"], to: (raw, match) => ['使用 ', raw[1] || match[1], ' 和 ', raw[3] || match[2], ' 为每个请求选择最佳模型。', '了解更多'] },
      { head: "Apps will use this model by default, but they may override it if they choose to do so.", re: /^Apps will use this model by default, but they may override it if they choose to do so\.This model will also be used as your default fallback model\.$/, parts: ["Apps will use this model by default, but they may override it if they choose to do so.", "This model will also be used as your default", "fallback model", "."], to: () => ['应用会默认使用此模型，也可自行覆盖。', '此模型也将作为默认', '回退模型', '。'] },
      { head: "Search for ‘", when: isSearchEcho, re: /^Search for ‘(.+)’$/u, parts: ["Search for ‘", /^.+$/u, "’"], to: (raw, match, original = []) => ['搜索“', original.length === 3 ? original[1] : (/^Search for ‘([\s\S]*)’$/u.exec(original[0] || '')?.[1] ?? match[1]), '”'] },
    ],
    },
    // W27 workspace-settings ^\/workspaces\/[^/]+\/settings$
    {
      id: "W27", slug: "workspace-settings", path: /^\/workspaces\/[^/]+\/settings$/,
      exact: new Map([
      ["A short note describing how this workspace is used.","简要说明此工作区的用途。"],
      ["Add a budget to enable this setting.","添加预算后即可启用此设置。"],
      ["Budgets & data","预算与数据"],
      ["Copy workspace ID","复制工作区 ID"],
      ["Count usage made with provider keys toward these limits.","将使用提供商密钥产生的用量计入这些限额。"],
      ["Default batch webhook URL","默认批处理 Webhook URL"],
      ["Default webhook URL","默认 Webhook URL"],
      ["Delivery URLs and signing for video and batch events.","视频和批处理事件的投递 URL 与签名设置。"],
      ["General","常规"],
      ["Manage spending limits and data sharing.","管理消费限额和数据共享。"],
      ["Manage this workspace’s identity and URL.","管理工作区名称等信息及 URL。"],
      ["Manage your workspace identity, spending controls, and integrations.","管理工作区信息、消费限制和集成。"],
      ["No limit set — this workspace can spend any amount.","未设置限额，此工作区的支出没有上限。"],
      ["Optional description for this workspace","此工作区的说明（可选）"],
      ["Receives batch completion events when a batch request sets no callback_url. Signed with the signing secret below when one is set.","批处理请求未指定 callback_url 时，接收批处理完成事件。配置下方签名密钥后，将使用该密钥签名。"],
      ["Receives video generation delivery events for this workspace.","接收此工作区的视频生成投递事件。"],
      ["Set daily, weekly, monthly, or lifetime spending limits.","设置每日、每周、每月或累计消费限额。"],
      ["Shown across OpenRouter and to workspace members.","显示在 OpenRouter 各处及工作区成员的界面中。"],
      ["Used in URLs. Lowercase letters, numbers, and hyphens only.","用于 URL，仅支持小写字母、数字和连字符。"],
      ["Webhooks","Webhook"],
      ["Workspace budget","工作区预算"],
      ["Workspace settings | OpenRouter","工作区设置 | OpenRouter"],
      ["Webhook signing secret","Webhook 签名密钥"],
      ["Used to verify webhook payload signatures.","用于验证 Webhook 载荷的签名。"],
      ["No signing secret configured.","尚未配置签名密钥。"],
      ["Generate signing secret","生成签名密钥"],
      ["Delete workspace","删除工作区"],
      ["Delete this workspace. Its settings are permanently deleted; historical records are retained.","删除此工作区。其设置将永久删除，历史记录会保留。"],
      ["This will delete","将删除"],
      ["Its budgets, guardrails, classifiers, and broadcast destinations will be permanently deleted, and its API key assignments and presets will stop working. Historical records are retained.","其预算、防护规则、分类器及追踪目标将永久删除，API 密钥分配和预设将失效。历史记录会保留。"],
      ["to confirm","以确认"],
      ["Checking for interns…","正在检查…"],
      ["You can't delete your only workspace. Create another first.","无法删除唯一的工作区。请先创建另一个工作区。"],
    ]),
      rules: [],
      overrides: [
      { order: 2, path: /^\/workspaces\/[^/]+\/settings$/, when: e => !!e.closest('[role="alertdialog"]'), map: new Map([["Type", "输入"]]) },
    ],
      fragments: [
      { head: "Search for ‘", when: isSearchEcho, re: /^Search for ‘(.+)’$/u, parts: ["Search for ‘", /^.+$/u, "’"], to: (raw, match, original = []) => ['搜索“', original.length === 3 ? original[1] : (/^Search for ‘([\s\S]*)’$/u.exec(original[0] || '')?.[1] ?? match[1]), '”'] },
    ],
    },
    // W21 workspace-tools ^\/workspaces\/[^/]+\/tools$
    {
      id: "W21", slug: "workspace-tools", path: /^\/workspaces\/[^/]+\/tools$/,
      exact: new Map([
      ["A value between 0 and 1. Higher values select stronger (and more expensive) coding models. Not used when a max input price is set (price-based selection takes over).","取值范围为 0 到 1。数值越高，选择的编程模型越强，费用也越高。设置最高输入价格后，将改为按价格选择，此值不再生效。"],
      ["Additional results beyond 10 are priced consistently across modes.","超过 10 条的额外结果在各模式下收费相同。"],
      ["Advisor docs","Advisor 文档"],
      ["Apply Patch docs","Apply Patch 文档"],
      ["Augment LLM responses with real-time web search results","用实时网页搜索结果增强 LLM 回复"],
      ["Auto (native if supported, otherwise Exa)","自动（支持时使用原生搜索，否则使用 Exa）"],
      ["Automatically fix malformed JSON responses from LLMs","自动修复 LLM 回复中的 JSON 格式错误"],
      ["Bash docs","Bash 文档"],
      ["Choose the PDF parsing engine. Mistral OCR provides the best quality but has a cost.","选择 PDF 解析引擎。Mistral OCR 的解析质量最好，但需要付费。"],
      ["Code execution","代码执行"],
      ["Comma-separated. Supports wildcards.","使用英文逗号分隔，支持通配符。"],
      ["Configure server tools and plugins for your workspace.","配置工作区的服务端工具和插件。"],
      ["Control which server tools can be used by requests in this workspace. Disallowing a tool rejects any request that asks for it with a 403 error. Read more about each tool in our","控制此工作区的请求可使用哪些服务端工具。禁用工具后，调用该工具的请求将返回 403 错误。各工具的详情请参阅"],
      ["Custom prompt injected with search results. Default instructs the model to incorporate results and cite sources using markdown links.","随搜索结果注入的自定义提示词。默认要求模型结合结果，并使用 Markdown 链接引用来源。"],
      ["Default (Mistral OCR)","默认（Mistral OCR）"],
      ["Delegates sub-tasks to a smaller, faster worker model, sending it the task content.","将子任务及其内容发送给更小、更快的执行模型。"],
      ["Domain Filters","域名筛选"],
      ["Exclude Domains","排除的域名"],
      ["Fetches the contents of a URL the model asks for and returns it as text.","获取模型指定 URL 的内容，并以文本形式返回。"],
      ["Files and editing","文件与编辑"],
      ["Fusion docs","Fusion 文档"],
      ["Hosted shell for the Responses and Messages APIs, backed by the same sandboxed container as Bash.","用于 Responses 和 Messages API 的托管 Shell，与 Bash 使用同一种沙箱容器。"],
      ["Include Domains","包含的域名"],
      ["Lets the model consult a stronger advisor model mid-generation, sending it the conversation so far.","允许模型在生成过程中向更强的 Advisor 模型咨询，并发送当前对话内容。"],
      ["Lets the model propose file edits as V4A diff patches for your application to apply.","允许模型以 V4A 差异补丁提出文件修改，由应用执行。"],
      ["Max Price","最高价格"],
      ["Max Results","最多结果数"],
      ["Maximum number of search results to include (1-","最多包含的搜索结果数（1-"],
      ["Minimum Coding Score","最低编程评分"],
      ["Multi-model","多模型"],
      ["Parse and extract content from uploaded PDF files","解析并提取上传 PDF 文件的内容"],
      ["PDF Inputs","PDF 输入"],
      ["PDF Parser Engine","PDF 解析引擎"],
      ["Plugins","插件"],
      ["Real-time web search during a generation. The model's search queries and the retrieved results are handled by third-party search providers.","在生成过程中实时搜索网页。模型的搜索词和检索结果由第三方搜索提供商处理。"],
      ["Response Healing","响应修复"],
      ["Runs a panel of models plus an analyst over the request, sending the prompt to every panelist.","将提示词发送给多个模型，再由分析模型汇总处理。"],
      ["Runs model-authored shell commands in an isolated sandboxed container. Messages API only.","在隔离沙箱容器中运行模型编写的 Shell 命令，仅支持 Messages API。"],
      ["Search Engine","搜索引擎"],
      ["Search Prompt","搜索提示词"],
      ["Server Tools","服务端工具"],
      ["Set default coding quality tier for the Pareto code router","设置 Pareto 代码路由器的默认编程质量档位"],
      ["Set default plugin behavior for your API requests.","设置 API 请求的默认插件行为。"],
      ["Settings for Web Fetch","网页抓取设置"],
      ["Settings for Web Search","网页搜索设置"],
      ["Shell docs","Shell 文档"],
      ["Sign Up","注册"],
      ["Subagent docs","子智能体文档"],
      ["Third-party data","第三方数据"],
      ["Tools | Settings | OpenRouter","工具 | 设置 | OpenRouter"],
      ["USD per million input tokens. When set, routes to the best-scoring coding model on the Pareto frontier at or below this price, and the minimum coding score is ignored.","每百万输入 Token 的价格，单位为 USD。设置后，会在不高于此价格的 Pareto 前沿模型中选择编程评分最高者，并忽略最低编程评分。"],
      ["Web access","网页访问"],
      ["Web Fetch docs","网页抓取文档"],
      ["Web Search docs","网页搜索文档"],
      ["Configure Web Search","配置网页搜索"],
      ["Configure PDF Inputs","配置 PDF 输入"],
      ["Configure Response Healing","配置响应修复"],
      ["Configure Pareto Router","配置 Pareto Router"],
      ["Toggle Bash","切换Bash"],
      ["Toggle Apply Patch","切换Apply Patch"],
      ["Toggle Response Healing","切换响应修复"],
      ["Toggle Pareto Router","切换Pareto Router"],
      ["). Each engine applies its own cap. See docs for default.","）。各引擎分别设有上限，默认值请参阅文档。"],
      ["Utilities","实用工具"],
      ["Image Generation docs","图像生成文档"],
      ["Generates images from a prompt the model supplies, routed to an image model.","根据模型提供的提示词，通过图像模型生成图像。"],
      ["Datetime docs","日期时间文档"],
      ["Gives the model the current date and time. Runs entirely on OpenRouter.","为模型提供当前日期和时间，完全在 OpenRouter 上运行。"],
      ["Tool Search","工具检索"],
      ["Tool Search docs","工具检索文档"],
      ["Lets the model load your own tool definitions on demand instead of up front.","让模型按需加载你的工具定义，避免在请求开始时一次性全部提供。"],
      ["Toggle Tool Search","切换工具检索"],
      ["Search Models","模型搜索"],
      ["Search Models docs","模型搜索文档"],
      ["Lets the model search the OpenRouter model catalog. Experimental.","让模型搜索 OpenRouter 模型目录。实验性功能。"],
      ["Toggle Search Models","切换模型搜索"],
      ["Web Search Server Tool","网页搜索服务端工具"],
      ["Web Fetch Server Tool","网页抓取服务端工具"],
      ["Choose the default tool behaviors and whether users can override them.","设置默认工具行为，以及是否允许用户覆盖。"],
      ["Default engine","默认引擎"],
      ["Used for requests with no engine configured or set to auto. Auto lets OpenRouter choose among the allowed engines, preferring the native engine when the model has one.","未指定引擎或设为 auto 时使用。选择自动时，OpenRouter 会在允许的引擎中选择，并优先使用模型支持的原生引擎。"],
      ["Native fallback engine","原生引擎回退"],
      ["Used when the engine is native and the provider does not have a native tool implementation.","引擎为 native、且提供商未实现原生工具时使用。"],
      ["Allowed engines","允许的引擎"],
      ["Domains","域名"],
      ["All domains can be accessed unless listed below.","允许访问下方列表以外的全部域名。"],
      ["Domain policy for openrouter:web_search","openrouter:web_search 的域名策略"],
      ["Domain policy for openrouter:web_fetch","openrouter:web_fetch 的域名策略"],
      ["Blocked domains","屏蔽的域名"],
      ["Add domain","添加域名"],
      ["Mistral OCR (recommended)","Mistral OCR（推荐）"],
      ["Cloudflare AI (free, basic)","Cloudflare AI（免费，基础版）"],
      ["Native (provider-specific)","原生（依提供商实现）"],
      ["Leave blank for no limit","留空则不限"],
      ["USD per million input tokens. Leave blank for no limit; a cap of 0 only allows models with a $0 input-token price (output tokens may still cost) and fails requests when none qualify. When set, routes to the best-scoring coding model on the Pareto frontier at or below this price, and the minimum coding score is ignored.","按每百万输入 Token 计价（USD）。留空则不限。上限为 0 时，仅允许输入 Token 价格为 $0 的模型（输出 Token 仍可能收费）；没有符合条件的模型时，请求会失败。设置上限后，将在价格不超过上限的 Pareto 前沿模型中选取编程评分最高者，并忽略最低编程评分。"],
    ]),
      rules: [
      { re: /^Top coding models \(e\.g\. (.+)\)$/, to: m => '优选编程模型（如 ' + m[1] + '）' },
      { re: /^Auto \(~([\d,.]+) second - (\$[\d,.]+) per ([\d,]+) requests - default\)$/, to: m => '自动（约 ' + m[1] + ' 秒 - 每 ' + m[3] + ' 次请求 ' + m[2] + ' - 默认）' },
    ],
      overrides: [],
      fragments: [
      { head: "Control which server tools can be used by requests in this workspace. Disallowing a tool rejects any request that asks for it with a 403 error. Read more about each tool in our", re: /^Control which server tools can be used by requests in this workspace\. Disallowing a tool rejects any request that asks for it with a 403 error\. Read more about each tool in our docs\.$/, parts: ["Control which server tools can be used by requests in this workspace. Disallowing a tool rejects any request that asks for it with a 403 error. Read more about each tool in our", "docs", "."], to: () => ["控制此工作区的请求可使用哪些服务端工具。禁用工具后，调用该工具的请求将返回 403 错误。各工具的详情请参阅","文档","。"] },
      { head: "Search for ‘", when: isSearchEcho, re: /^Search for ‘(.+)’$/u, parts: ["Search for ‘", /^.+$/u, "’"], to: (raw, match, original = []) => ['搜索“', original.length === 3 ? original[1] : (/^Search for ‘([\s\S]*)’$/u.exec(original[0] || '')?.[1] ?? match[1]), '”'] },
    ],
    },
    // W16 workspace-byok ^\/workspaces\/[^/]+\/byok(?:\/[^/]+)?$
    {
      id: "W16", slug: "workspace-byok", path: /^\/workspaces\/[^/]+\/byok(?:\/[^/]+)?$/,
      exact: new Map([
      ["Show less","收起"],
    ]),
      rules: [
      { re: /^Show ([\d,]+) more$/, to: m => '再显示 ' + m[1] + ' 项' },
    ],
      overrides: [],
      fragments: [
      { head: "Search for ‘", when: isSearchEcho, re: /^Search for ‘(.+)’$/u, parts: ["Search for ‘", /^.+$/u, "’"], to: (raw, match, original = []) => ['搜索“', original.length === 3 ? original[1] : (/^Search for ‘([\s\S]*)’$/u.exec(original[0] || '')?.[1] ?? match[1]), '”'] },
    ],
    },
  ];

  const ATTRS = ['placeholder', 'title', 'aria-label', 'alt', 'aria-description'];
  const BLOCK = 'script,style,noscript,code,pre,kbd,iframe,object,embed,canvas,' +
    '[contenteditable]:not([contenteditable="false"]),' +
    'read-frog,read-frog-selection,next-route-announcer';

  // 引擎：只改文本节点和白名单属性；不读取普通输入值。
  const normalize = value => String(value ?? '').replace(/\s+/gu, ' ').trim();
  const scopeIndex = new Map(SCOPES.map(scope => [scope.slug, scope]));
  const DICTIONARIES = { common: COMMON_EXACT, ...Object.fromEntries(SCOPES.map(scope => [scope.slug, scope.exact])) };
  const PATH_OVERRIDES = SCOPES.flatMap(scope => scope.overrides).sort((a, b) => a.order - b.order);
  // 这些源条目仅在属性中采集，避免把同名用户内容当成界面标签。
  const ATTRIBUTE_ONLY = new Set(['My workspace', 'e.g. "Management Key"',
    'e.g. 5', 'e.g. 100', 'e.g. docs.example.com, api.example.com',
    'e.g. ads.example, spam.example', 'e.g. example.com, *.substack.com',
    'e.g. reddit.com, *.pinterest.com', 'Default (0-100)', 'Tools: 8 active']);

  const originals = new WeakMap();
  // 仅提供不含页面文字的累计诊断计数。
  const runtimeStats = { batches: 0, textWrites: 0, attributeWrites: 0, maxBatchMs: 0,
    longTasks: 0, maxLongTaskMs: 0, longTaskObserverSupported: false };
  try {
    if (typeof PerformanceObserver === 'function' && PerformanceObserver.supportedEntryTypes?.includes('longtask')) {
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          runtimeStats.longTasks++;
          runtimeStats.maxLongTaskMs = Math.max(runtimeStats.maxLongTaskMs, entry.duration);
        }
      }).observe({ entryTypes: ['longtask'] });
      runtimeStats.longTaskObserverSupported = true;
    }
    Object.defineProperty(window, '__openrouterZhCN', { configurable: true, value: {
      version: '0.1.1',
      terms: new Set(Object.values(DICTIONARIES).flatMap(map => Array.from(map.keys()))).size,
      stats: runtimeStats,
    } });
  } catch (_) { /* diagnostics must not prevent translation */ }
  const originalAttributes = new WeakMap();
  const privateNames = new Set();
  let headerCache = new WeakMap();
  let popupCache = new WeakMap();

  const DATA_HEADERS = new Set([
    'Name', 'Key', 'Owner', 'Description', 'API Key', 'Email', 'ID', 'Generation ID',
    'Session ID', 'Model', 'Provider', 'Primary Model', 'Primary Provider', 'Final Provider',
    'Input', 'Output', 'Comment', 'App', 'User', 'Workspace', 'Guardrails',
  ]);
  const KEEP = new Set([
    'OpenRouter', 'Stripe', 'GitHub', 'Google', 'Anthropic', 'OpenAI', 'Google Vertex',
    'SpaceXAI', 'MetaMask', 'Chatroom', 'Auto Router', 'Standard', 'Business', 'Enterprise',
    'Discord', 'LinkedIn', 'YouTube', 'X', 'BYOK', 'API', 'SDK', 'JSON', 'HTTP', 'URL',
    'ID', 'ISO', 'UTC', 'EU', 'US', 'OR', 'SSO / SAML', 'Slug', 'tok', 'tok/s',
  ]);
  const FIXED_LEGEND = /^(?:Hide|Show only) (?:BYOK|Cached|Completion|OpenRouter Spend|Prompt|Reasoning|Uncached|Unknown)$/;
  let debug = false;
  try { debug = localStorage.getItem('openrouter.zhCN.debug') === '1'; } catch (_) { /* storage may be disabled */ }

  function routeInfo() {
    const path = location.pathname.replace(/\/+$/, '') || '/';
    const activity = path.match(/^\/workspaces\/[^/]+\/activity(?:\/(trends|explore|guardrails))?$/);
    const workspace = !!activity;
    if (workspace || /^\/activity(?:\/(?:trends|explore|guardrails))?$/.test(path)) {
      return { key: 'activity', body: true, account: true, workspace, path,
        variant: workspace ? (activity[1] || 'overview') : (path.split('/')[2] || 'overview'),
        sections: workspace ? ['workspace-activity-' + (activity[1] || 'overview'),
          'workspace-activity-trends', 'workspace-activity-explore', 'workspace-activity-guardrails'] : [] };
    }
    const ws = path.match(/^\/workspaces\/[^/]+\/(.+)$/);
    if (ws) {
      const tail = ws[1];
      let key = '', inherited = [];
      if (tail === 'logs') { key = 'logs'; inherited = ['workspace-logs', 'workspace-generation-detail']; }
      else if (tail === 'keys') key = 'workspace-keys';
      else if (/^keys\/[^/]+$/.test(tail)) { key = 'workspace-key-detail'; inherited = ['workspace-keys']; }
      else if (tail === 'files') key = 'workspace-files';
      else if (tail === 'guardrails') key = 'workspace-guardrails';
      else if (tail === 'guardrails/default') key = 'workspace-guardrail-default';
      else if (tail === 'guardrails/default/budget') key = 'workspace-guardrail-budget';
      else if (tail === 'guardrails/default/models') { key = 'workspace-guardrail-models'; inherited = ['privacy']; }
      else if (tail === 'guardrails/default/prompt-injection') key = 'workspace-guardrail-prompt-injection';
      else if (tail === 'guardrails/default/sensitive-info') key = 'workspace-guardrail-sensitive-info';
      else if (tail === 'byok') key = 'workspace-byok';
      else if (/^byok\/[^/]+$/.test(tail)) { key = 'workspace-byok-provider'; inherited = ['workspace-byok']; }
      else if (tail === 'routing') key = 'workspace-routing';
      else if (tail === 'presets') key = 'workspace-presets';
      else if (tail === 'presets/new') key = 'workspace-preset-new';
      else if (tail === 'tools') key = 'workspace-tools';
      else if (tail === 'observability') key = 'workspace-observability';
      else if (tail === 'observability/io-logging-settings') key = 'workspace-io-logging-settings';
      else if (/^observability\/destinations\/new\/[^/]+$/.test(tail)) key = 'workspace-destination-new';
      else if (tail === 'classifiers') key = 'workspace-classifiers';
      else if (tail === 'classifiers/new') key = 'workspace-classifier-new';
      else if (tail === 'settings') { key = 'workspace-settings'; inherited = ['workspaces']; }
      else if (tail === 'chat') key = 'workspace-chat';
      if (key) return { key, sections: inherited, body: true, account: true, workspace: true, path };
    }
    if (path === '/workspaces') return { key: 'workspaces', body: true, account: true, path };
    if (path === '/redeem') return { key: 'redeem', body: true, account: true, path };
    if (path === '/logs') {
      // Uncollected detail URLs may contain request/prompt bodies.
      const query = new URLSearchParams(location.search);
      const detail = ['id', 'generation', 'generation_id', 'session_id', 'request_id'].some(key => query.has(key));
      return { key: 'logs', body: !detail, account: true, path };
    }
    const settings = path.match(/^\/settings\/(profile|credits|management-keys|notifications|privacy|security|preferences|manage-plan)$/);
    if (settings) return { key: settings[1], body: true, account: true, path };
    return { key: '', body: false, account: /^\/(?:workspaces|settings|activity|logs)(?:\/|$)/.test(path), path };
  }
  let route = routeInfo();
  let routeStamp = location.pathname + location.search;

  function sourceText(node) {
    const saved = originals.get(node);
    return saved && node.nodeValue === saved.output ? saved.source : (node.nodeValue || '');
  }
  function sourceAttribute(element, name) {
    const current = element.getAttribute(name);
    const saved = originalAttributes.get(element)?.get(name);
    return saved && current === saved.output ? saved.source : current;
  }
  function writeText(node, source, output) {
    if (node.nodeValue === output) return;
    originals.set(node, { source, output });
    runtimeStats.textWrites++;
    node.nodeValue = output;
  }
  function writeAttribute(element, name, source, output) {
    if (element.getAttribute(name) === output) return;
    let saved = originalAttributes.get(element);
    if (!saved) originalAttributes.set(element, saved = new Map());
    saved.set(name, { source, output });
    runtimeStats.attributeWrites++;
    element.setAttribute(name, output);
  }
  function preserveEdges(raw, translated) {
    return (raw.match(/^\s*/u)?.[0] || '') + translated + (raw.match(/\s*$/u)?.[0] || '');
  }
  function rawElementText(element) {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    let result = '', count = 0, node;
    while ((node = walker.nextNode()) && ++count <= 80) result += sourceText(node);
    return normalize(result);
  }
  function tableColumn(element) {
    const cell = element.closest('td');
    const table = cell?.closest('table');
    if (!cell || !table || cell.colSpan > 1) return '';
    let headers = headerCache.get(table);
    if (!headers) {
      let first = table.querySelector('thead tr');
      if (!first && table.querySelector('th')) first = table.querySelector('tr');
      // The logs UI renders its sticky header and body as two separate tables.
      if (!first) {
        const tables = Array.from(document.querySelectorAll('table'));
        const index = tables.indexOf(table);
        const columns = cell.closest('tr')?.cells.length;
        for (let i = index - 1; i >= Math.max(0, index - 2); i--) {
          const head = tables[i].querySelector('thead tr');
          if (head && head.cells.length === columns) { first = head; break; }
        }
      }
      const aliases = {
        '名称': 'Name', '密钥': 'Key', '所有者': 'Owner', '描述': 'Description',
        'API 密钥': 'API Key', '邮箱': 'Email', '模型': 'Model', '提供商': 'Provider',
        '主要模型': 'Primary Model', '主要提供商': 'Primary Provider', '最终提供商': 'Final Provider',
        '输入': 'Input', '输出': 'Output', '备注': 'Comment', '应用': 'App',
        '用户': 'User', '工作区': 'Workspace', '防护规则': 'Guardrails',
        '限额': 'Limit', '到期时间': 'Expires',
      };
      headers = first ? Array.from(first.cells).map(e => {
        const text = rawElementText(e); return aliases[text] || text;
      }) : [];
      headerCache.set(table, headers);
    }
    return headers[cell.cellIndex] || '';
  }
  function isNavigationLink(element) {
    const link = element.closest('a[href]');
    if (!link) return false;
    // Match only the href path, never change a URL.
    const href = link.getAttribute('href') || '';
    return /^(?:https:\/\/openrouter\.ai)?\/(?:settings(?:\/|$)|workspaces(?:\/|$)|activity(?:\/|$)|logs(?:[/?#]|$))/.test(href);
  }
  function isChrome(element) {
    return !!element.closest('nav,aside,[role="navigation"]') || isNavigationLink(element);
  }
  function isResourceContent(element) {
    const popup = element.closest('[role="menu"],[role="listbox"]');
    if (!popup?.id) return false;
    let kind = popupCache.get(popup);
    if (kind === undefined) {
      kind = '';
      for (const control of document.querySelectorAll('[aria-controls]')) {
        const owns = (control.getAttribute('aria-controls') || '').split(/\s+/).some(id =>
          document.getElementById(id)?.contains(popup));
        if (!owns) continue;
        const label = sourceAttribute(control, 'aria-label') || sourceAttribute(control, 'placeholder') || '';
        if (/^(?:Switch account|Switch workspace|切换账户|切换工作区)$/.test(label)) { kind = 'switcher'; break; }
        if (/^(?:Search (?:API keys|workspaces|models|providers|apps)(?:\.\.\.)?|搜索\s*(?:API\s*密钥|工作区|模型|提供商|应用)…?)$/.test(label) || /^(?:Search models, providers, pages, docs\.\.\.|搜索模型、提供商、页面和文档…)$/.test(label)) kind = 'resources';
      }
      popupCache.set(popup, kind);
    }
    if (kind === 'switcher') {
      const item = element.closest('[role="menuitem"]');
      const control = element.closest('button');
      const navigation = element.closest('a[href]');
      const href = navigation?.getAttribute('href') || '';
      if (/^\/(?:workspaces|activity|logs(?:\?tab=sessions)?|settings\/(?:profile|credits|preferences))$/.test(href) &&
          ['Workspaces', 'Profile', 'Activity', 'Logs', 'Recent sessions', 'Credits', 'Preferences'].includes(rawElementText(navigation))) return false;
      if (control && [rawElementText(control), sourceAttribute(control, 'aria-label'), sourceAttribute(control, 'title')].includes('Manage')) return false;
      if (item?.querySelector('svg.lucide-plus') && rawElementText(item) === 'Create workspace') return false;
      if (item?.querySelector('svg.lucide-moon,svg.lucide-sun,svg.lucide-monitor') &&
          /^Theme(?:System|Light|Dark)$/.test(rawElementText(item).replace(/\s+/g, ''))) return false;
      if (item?.querySelector('svg.lucide-log-out') && rawElementText(item) === 'Sign out') return false;
      if (Array.from(item?.querySelectorAll('img[alt]') || []).some(img => sourceAttribute(img, 'alt') === 'Personal') && item.querySelector('button') &&
          (rawElementText(element) === 'Personal' ||
           (element.localName === 'img' && sourceAttribute(element, 'alt') === 'Personal'))) return false;
      return true;
    }
    if (kind === 'resources' && element.closest('[role="option"]')) {
      const control = element.closest('button');
      if (control && [sourceAttribute(control, 'aria-label'), sourceAttribute(control, 'title'), rawElementText(control)].some(label => label === 'Pin model' || /^Copy(?: model ID)? ~?[a-z0-9._-]+\/[a-z0-9._:+~-]+$/.test(label || ''))) return false;
      return true;
    }
    return false;
  }
  function isProtected(element, type) {
    if (!element || element.closest(BLOCK)) return true;
    if (type === 'text' && element.closest('input,textarea')) return true;
    if (type === 'text' && route.key === 'workspace-files' &&
        element.closest('nav[aria-label="Folder path"],nav[aria-label="文件夹路径"]')) return true;
    if (type === 'text' && route.key === 'workspace-byok-provider' && element.closest('button[aria-expanded]')) {
      const test = element.closest('button');
      const footer = test?.parentElement?.parentElement;
      if (!(test && rawElementText(test) === 'Test' && footer?.classList.contains('pt-1') && footer.parentElement?.querySelector('input[type="password"]'))) return true;
    }
    if (type === 'text') {
      const resourceLink = element.closest('a[href]');
      if (resourceLink && /\/keys\/[^/?#]+/.test(resourceLink.getAttribute('href') || '') &&
          !element.closest('[role="menuitem"]')) return true;
      const rankedKey = element.closest('button');
      if (rankedKey && /\bsk-or-/.test(rankedKey.textContent || '')) return true;
    }
    if (type === 'text' && element.closest('svg') &&
        !(element.localName === 'title' && rawElementText(element) === 'Move right')) return true;
    if (isResourceContent(element)) return true;
    if (element.closest('[role="option"][data-value^="doc:"]')) return true;
    if (element.closest('.cl-userPreviewTextContainer')) return true;
    if (element.closest('.cl-activeDevice') && !element.closest('button') && !['This device', '当前设备'].includes(rawElementText(element))) return true;
    if (['privacy', 'workspace-guardrail-models'].includes(route.key) && element.closest('span.flex-1.truncate') && element.closest('div.h-56.overflow-y-auto')) return true;
    if (route.key === 'workspace-io-logging-settings' && element.closest('[role="listbox"] [role="option"]')) return true;
    if (route.key === 'workspace-destination-new' && element.closest('[role="dialog"] [role="option"]')?.querySelector('[role="checkbox"],input[type="checkbox"]')) return true;
    const providerChoice = element.closest('button');
    const providerDialog = providerChoice?.closest('[role="dialog"]');
    if (providerChoice && providerDialog && providerChoice.parentElement?.parentElement === providerDialog && !providerChoice.parentElement.querySelector('input') &&
        Array.from(providerDialog.querySelectorAll('input[placeholder]')).some(input => input.closest('[role="dialog"]') === providerDialog && /^(?:Search providers|搜索提供商)(?:\.\.\.|…)?$/.test(sourceAttribute(input, 'placeholder') || ''))) return true;
    if (route.key === 'workspace-byok' && providerChoice && /Not configured$/.test(rawElementText(providerChoice)) && rawElementText(element) !== 'Not configured') return true;
    if (route.key === 'workspace-chat') {
      if (element.closest('h1') && rawElementText(element.closest('h1')) !== 'Chat') return true;
      const starter = element.closest('button');
      if (starter) {
        const text = rawElementText(starter);
        const titles = ['Car Wash Test', '9.9 vs 9.11', 'Strawberry Test', 'Poem Riddle',
          'Personal Finance', 'Anagram Challenge', 'The Missing Dollar', 'Word Transformation',
          'Palindrome Quest', 'Alphabet Series', 'Career Development', 'Healthy Lifestyle',
          'Small Business Strategy', 'Educational Advancement'];
        if (titles.some(title => text.startsWith(title))) return true;
      }
    }
    if (route.key === 'workspace-preset-new') {
      // Provider choices are data even when a name also happens to be a parameter label.
      if (element.closest('[id^="provider.order-"][id$="-label"],[id^="provider.only-"][id$="-label"],[id^="provider.ignore-"][id$="-label"],[role="checkbox"][aria-labelledby^="provider.order-"],[role="checkbox"][aria-labelledby^="provider.only-"],[role="checkbox"][aria-labelledby^="provider.ignore-"]')) return true;
      for (let row = element, depth = 0; row && depth < 3; row = row.parentElement, depth++) {
        const boxes = row.querySelectorAll('[role="checkbox"][aria-label],input[type="checkbox"][aria-label]');
        if (boxes.length === 1) {
          const label = sourceAttribute(boxes[0], 'aria-label') || '';
          if (label === 'Seed' && rawElementText(row) === label) return true;
        }
      }
    }
    const switcher = element.closest('button[aria-label]');
    if (switcher && /^(?:Switch account|Switch workspace|切换账户|切换工作区)$/.test(sourceAttribute(switcher, 'aria-label') || '')) {
      if (debug) {
        const identity = rawElementText(switcher);
        if (identity && identity !== 'Personal') privateNames.add(identity);
      }
      const personalLabel = /^(?:Switch account|切换账户)$/.test(sourceAttribute(switcher, 'aria-label') || '') &&
        ((type === 'text' && rawElementText(element) === 'Personal') ||
         (type === 'attr:alt' && sourceAttribute(element, 'alt') === 'Personal'));
      if (!personalLabel && (type === 'text' || element !== switcher || type !== 'attr:aria-label')) return true;
    }
    if (route.key === 'profile' && element.closest('h1') && !element.closest('[role="dialog"]')) {
      if (debug) privateNames.add(rawElementText(element.closest('h1')));
      return true;
    }
    if (['workspace-key-detail', 'workspace-byok-provider'].includes(route.key) && element.closest('h1')) return true;
    if (type === 'text' && route.key === 'workspace-key-detail') {
      // Observed built-in policy rows, distinct from custom guardrail/resource names.
      const cell = element.closest('td');
      const body = cell?.closest('tbody');
      if (body) {
        const rows = Array.from(body.children).filter(row => row.localName === 'tr');
        const labels = ['Account Settings', 'Workspace', 'API Key'];
        const rowIndex = rows.indexOf(cell.closest('tr'));
        if (rowIndex >= 0 && rowIndex < 3 && labels.every((label, index) =>
          rows[index]?.cells[0] && rawElementText(rows[index].cells[0]) === label)) {
          const text = rawElementText(element);
          if ((cell.cellIndex === 0 && text === labels[rowIndex]) ||
              ['models', 'Partial', 'Unavailable', 'Unset'].includes(text)) return false;
        }
      }
    }
    if (type === 'text' && route.key === 'workspace-guardrails') {
      const cell = element.closest('td');
      // The system row mixes its resource name with a fixed badge and description.
      if (cell?.cellIndex === 0 && /^Workspace Guardrail\s*Default\s*Default policy automatically applied to every key in this workspace\.$/.test(rawElementText(cell)) &&
          ['Default', 'Default policy automatically applied to every key in this workspace.'].includes(rawElementText(element))) return false;
    }
    if (type === 'text' && route.key === 'workspaces' && element.matches('td > span.italic.text-faint') && rawElementText(element) === 'No description') return false;
    const column = tableColumn(element);
    if (DATA_HEADERS.has(column)) {
      if (debug && /^(?:Name|Owner)$/.test(column)) {
        const identity = rawElementText(element.closest('td'));
        if (identity && identity.length < 200) privateNames.add(identity);
      }
      // Row action labels are UI; their variable part is retained by a template.
      if (!/^attr:(?:aria-label|title)$/.test(type) ||
          !/^(?:Actions for |Select )/.test(sourceAttribute(element, type.slice(5)) || '')) return true;
    }
    const branded = element.closest('button,[role="button"],[role="option"],[role="menuitem"]');
    if (branded) {
      const fixedLabels = new Set(['Not configured', 'Set up', 'Beta', 'New', 'Flagship models',
        'Best roleplay models', 'Best coding models', 'Reasoning models', 'Pin model']);
      const label = type === 'text' ? rawElementText(element) : sourceAttribute(element, type.slice(5));
      for (const img of branded.querySelectorAll('img[alt]')) {
        const alt = sourceAttribute(img, 'alt') || '';
        if ((/^Favicon for /.test(alt) || /(?:'s|’s) (?:logo|avatar|profile picture)$/i.test(alt)) &&
            !fixedLabels.has(label) && !(type === 'attr:aria-label' && ['workspace-chat', 'workspace-preset-new'].includes(route.key) && /^Analysis Models \d+$/.test(label || ''))) return true;
      }
    }
    if (element.previousElementSibling?.matches('img[alt^="Favicon for "]') &&
        !/^(?:Not configured|Set up|Beta|New)$/.test(rawElementText(element))) return true;
    if (type === 'attr:alt') {
      const alt = sourceAttribute(element, 'alt') || '';
      const person = alt.match(/^(.+?)(?:'s|’s) (?:logo|avatar|profile picture)$/i);
      if (person) { if (debug) privateNames.add(normalize(person[1])); return true; }
      if (/^Favicon for /.test(alt)) return true;
    }
    // Only the feedback and table-settings dialogs were captured on the logs page.
    const dialog = route.key === 'logs' && element.closest('[role="dialog"],[role="alertdialog"]');
    if (dialog) {
      const headings = Array.from(dialog.querySelectorAll('h1,h2,h3,[role="heading"]')).map(rawElementText);
      const tableSettings = Array.from(dialog.querySelectorAll('[aria-label]')).some(control =>
        sourceAttribute(control, 'aria-label') === 'Table settings sections');
      if (!tableSettings && !headings.some(text => /^(?:Report Feedback|Table settings|Generation details)$/.test(text))) return true;
    }
    return false;
  }
  function inScope(element, type = 'text') {
    if (!route.account) return false;
    if (element.localName === 'title' && element.parentElement === document.head) return true;
    if (route.key !== 'workspace-chat') return route.body || (route.path.startsWith('/workspaces/') && isChrome(element));
    // Keep message bodies and room names outside the translation surface.
    if (element.closest('article,.prose,[data-message-id],[data-message-role],read-frog')) return false;
    if (element.closest('nav,[role="navigation"]')) return true;
    if (type !== 'text' && element.matches('input,textarea')) return true;
    const link = element.closest('a[href]');
    if (link && !/[?#]/.test(link.getAttribute('href') || '') && isNavigationLink(element)) return true;
    if (element.closest('[role="dialog"],[role="listbox"],[role="menu"],[role="tooltip"]')) return true;
    const control = element.closest('button,[role="button"],[role="combobox"]');
    if (control) {
      const label = sourceAttribute(control, 'aria-label') || sourceAttribute(control, 'title') || '';
      if (/^(?:New Chat|Add Model|Room settings|Zero Data Retention settings|Tools:|Chat memory:|Add to message|Attach uploaded file|Start recording|Send message|View mode)/.test(label)) return true;
      if (/^Theme: (?:System|Light|Dark)$/.test(label) ||
          (rawElementText(control) === 'Sign out' && control.querySelector('svg.lucide-log-out'))) return true;
      if (['Flagship models', 'Best roleplay models', 'Best coding models', 'Reasoning models'].includes(rawElementText(element)) &&
          control.querySelector('img[alt^="Favicon for "]')) return true;
      if (rawElementText(control) === 'Select') {
        for (let root = control.parentElement, depth = 0; root && depth < 3; root = root.parentElement, depth++) {
          if (root.querySelector('input[placeholder="Search rooms..."],input[placeholder="Search rooms…"],input[placeholder="搜索房间…"]')) return true;
        }
      }
    }
    // Header and composer roots are located through their fixed controls, not arbitrary prose.
    for (const button of document.querySelectorAll('button[aria-label]')) {
      const label = sourceAttribute(button, 'aria-label') || '';
      if (!/^(?:Room settings|Send message)$/.test(label)) continue;
      for (let root = button.parentElement, i = 0; root && i < 5; root = root.parentElement, i++) {
        const isHeader = label === 'Room settings' && root.querySelector('h1') && !root.querySelector('textarea');
        const isComposer = label === 'Send message' && root.querySelector('textarea');
        if (isHeader || isComposer) { if (root.contains(element)) return true; break; }
      }
    }
    const text = rawElementText(element);
    if (element.closest('button,a')) return false;
    if (/^(?:Chat|No matching rooms|\d+ rooms)$/.test(text)) {
      return !!document.querySelector('input[placeholder="Search rooms..."],input[placeholder="搜索房间…"]');
    }
    if (text === 'Responses are AI-generated and can be inaccurate. Review all outputs before relying on them.') {
      const sender = document.querySelector('button[aria-label="Send message"],button[aria-label="发送消息"]');
      return !!sender && !!element.parentElement?.contains(sender);
    }
    return false;
  }

  function isSearchEcho(element) {
    return element.localName === 'span' && element.parentElement?.localName === 'button' && /^Search for ‘.*’$/u.test(rawElementText(element));
  }
  function compositeNodes(element) {
    const result = [];
    let visited = 0;
    const visit = parent => {
      for (const node of parent.childNodes) {
        if (++visited > 64 || result.length > 24) return false;
        if (node.nodeType === Node.TEXT_NODE) result.push(node);
        else if (node.nodeType === Node.ELEMENT_NODE && !node.matches(BLOCK + ',svg,input,textarea,[hidden],[aria-hidden="true"]')) {
          if (!visit(node)) return false;
        }
      }
      return true;
    };
    return visit(element) ? result : null;
  }
  function tryComposite(element, exactNode = null) {
    if (!inScope(element) || isProtected(element, 'text')) return false;
    const candidates = (scopeIndex.get(route.key)?.fragments || []).filter(rule => !rule.workspace || route.workspace);
    if (!candidates.length) return false;
    // 句首可能在 strong 等内联元素中；只向下查看三个层级，避免反复扫描大容器。
    let visited = 0;
    const firstText = (parent, depth) => {
      for (const node of parent.childNodes) {
        if (++visited > 32) return '';
        if (node.nodeType === Node.TEXT_NODE && normalize(sourceText(node))) return normalize(sourceText(node));
        if (depth && node.nodeType === Node.ELEMENT_NODE && !node.matches(BLOCK + ',svg,input,textarea,[hidden],[aria-hidden="true"]')) {
          const text = firstText(node, depth - 1);
          if (text) return text;
        }
      }
      return '';
    };
    const head = firstText(element, 3);
    if (!candidates.some(rule => head.startsWith(rule.head))) return false;
    const nodes = compositeNodes(element);
    if (!nodes) return false;
    const allRaw = nodes.map(sourceText);
    const meaningful = nodes.filter((node, index) => normalize(allRaw[index]));
    // A complete single-node dictionary/template match takes priority.
    if (exactNode && meaningful.length === 1 && meaningful[0] === exactNode) return false;
    const raw = meaningful.map(node => sourceText(node).trim());
    const sentence = normalize(allRaw.join(''));
    for (const rule of candidates) {
      if (rule.when && !rule.when(element)) continue;
      const match = rule.re.exec(sentence);
      if (!match) continue;
      // React 有时会把相邻文本合并为一个叶节点；仍只改这个 Text，不动父元素。
      if (meaningful.length === 1) {
        writeText(meaningful[0], sourceText(meaningful[0]), rule.to([], match, [sourceText(meaningful[0])]).join(''));
        return true;
      }
      if (rule.parts.length !== raw.length || !rule.parts.every((part, i) =>
        typeof part === 'string' ? part === normalize(raw[i]) : part.test(normalize(raw[i])))) continue;
      // If a user/data region unexpectedly appears inside the sentence, leave the parent alone.
      if (meaningful.some(node => isProtected(node.parentElement, 'text'))) return false;
      const translated = rule.to(raw, match, meaningful.map(sourceText));
      if (translated.length !== meaningful.length || translated.some(text => typeof text !== 'string')) return false;
      for (let i = 0; i < meaningful.length; i++) {
        writeText(meaningful[i], sourceText(meaningful[i]), translated[i]);
      }
      for (const node of nodes) if (!normalize(sourceText(node))) writeText(node, sourceText(node), '');
      return true;
    }
    return false;
  }

  function translate(raw, element, type) {
    const text = normalize(raw);
    if (!text) return null;
    if (type !== 'text' || !ATTRIBUTE_ONLY.has(text)) {
      for (const override of PATH_OVERRIDES) {
        if (override.path.test(route.path) && override.map.has(text) && override.when(element)) return override.map.get(text);
      }
      // Trends 中采集到的 Unknown 是固定空值标签；其余名称不套用 Overview 图例译法。
      if (!(route.key === 'activity' && route.variant !== 'overview' && FIXED_LEGEND.test(text) && !/ Unknown$/.test(text))) {
        const groups = [route.key, ...(route.sections || []),
          ...(route.workspace ? ['workspace-common'] : []),
          'shared-account-management', 'shared-organization', 'common'];
        for (const group of groups) {
          const scope = scopeIndex.get(group);
          if (scope && !scope.path.test(route.path)) continue;
          const value = DICTIONARIES[group]?.get(text);
          if (value !== undefined) return value;
        }
      }
    }
    for (const rule of [...(scopeIndex.get(route.key)?.rules || []), ...(scopeIndex.has(route.key) ? COMMON_RULES : [])]) {
      if (rule.when && !rule.when(element)) continue;
      if (rule.type === 'legend') {
        if (!/^attr:(?:title|aria-label)$/.test(type) || element.localName !== 'button') continue;
      } else if (rule.type && rule.type !== type) continue;
      const match = rule.re.exec(raw.trim());
      if (match) return rule.to(match);
    }
    return null;
  }

  const unmatched = new Map();
  const reported = new Set();
  let debugTimer = 0;
  function debugMiss(raw, element, type) {
    if (!debug || !/[A-Za-z]{2}/.test(raw) || KEEP.has(normalize(raw)) || isSearchEcho(element)) return;
    // Debug only fixed UI contexts, never arbitrary prose, chart values or data cells.
    if (element.closest('td,svg,pre,code') || !element.closest('button,a,label,th,option,h1,h2,h3,[role="tab"],[role="menuitem"]')) return;
    if (/^(?:Actions for|Select|Hide|Show only) /i.test(raw) || privateNames.has(normalize(raw))) return;
    for (const name of privateNames) if (name.length > 1 && raw.includes(name)) return;
    if (/\b(?:sk[-_]|gen-|[a-f0-9]{24,})/i.test(raw) || /[A-Za-z0-9_-]+\/[A-Za-z0-9_.-]+/.test(raw)) return;
    let text = normalize(raw)
      .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '{email}')
      .replace(/https?:\/\/\S+/gi, '{url}')
      .replace(/\b[A-Za-z0-9_-]{24,}\b/g, '{id}')
      .replace(/\b\d{4}-\d{2}-\d{2}(?:T[\d:.+-]+Z?)?/g, '{date}')
      .replace(/\b(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,}(?::\d+)?\b/g, '{domain}')
      .replace(/[“‘"'][^“”‘’"']+[”’"']/g, '{user}')
      .replace(/[$€£¥]\s*[\d,.]+/g, '{amount}')
      .replace(/\b\d+(?:[.,:/-]\d+)*\b/g, '{n}');
    if (!text || text.length > 350) return;
    const scope = route.key || 'shared-navigation';
    const key = scope + '|' + type + '|' + text;
    if (reported.has(key) || reported.size + unmatched.size >= 100) return;
    const previous = unmatched.get(key);
    unmatched.set(key, { scope, type, text, count: (previous?.count || 0) + 1 });
    if (!debugTimer) debugTimer = setTimeout(() => {
      debugTimer = 0;
      const rows = Array.from(unmatched.values());
      if (rows.length) {
        console.groupCollapsed('[OpenRouter 简体中文] 未命中界面文字：' + rows.length);
        console.table(rows);
        console.groupEnd();
      }
      for (const key of unmatched.keys()) reported.add(key);
      unmatched.clear();
    }, 1000);
  }

  function processText(node) {
    const element = node.parentElement;
    if (!element || isProtected(element, 'text')) return;
    const raw = sourceText(node);
    const saved = originals.get(node);
    if (!inScope(element)) {
      if (saved && node.nodeValue === saved.output) writeText(node, saved.source, saved.source);
      return;
    }
    const translated = translate(raw, element, 'text');
    if (translated !== null) writeText(node, raw, preserveEdges(raw, translated));
    else {
      if (saved && node.nodeValue === saved.output) writeText(node, saved.source, saved.source);
    }
    // Match the full node first, then the bounded parent sentence if fragmented.
    for (let parent = element, depth = 0; parent && depth < 3; parent = parent.parentElement, depth++) {
      if (tryComposite(parent, translated !== null ? node : null)) return;
      if (!/^(?:SPAN|B|STRONG|EM|I|A|SMALL|P|LABEL|BUTTON)$/.test(parent.tagName)) break;
    }
    if (translated === null) debugMiss(raw, element, 'text');
  }
  function processElement(element) {
    if (element.matches(BLOCK)) return;
    for (const name of ATTRS) {
      if (!element.hasAttribute(name) || isProtected(element, 'attr:' + name)) continue;
      const raw = sourceAttribute(element, name);
      const saved = originalAttributes.get(element)?.get(name);
      if (!inScope(element, 'attr:' + name)) {
        if (saved && element.getAttribute(name) === saved.output) writeAttribute(element, name, saved.source, saved.source);
        continue;
      }
      const translated = translate(raw, element, 'attr:' + name);
      if (translated !== null) writeAttribute(element, name, raw, preserveEdges(raw, translated));
      else {
        if (saved && element.getAttribute(name) === saved.output) writeAttribute(element, name, saved.source, saved.source);
        debugMiss(raw, element, 'attr:' + name);
      }
    }
  }

  // 时间切片扫描：每帧最多 6ms / 300 个节点。MutationObserver 忽略仍等于本次写值的记录；
  // React 改回英文时当前值不同，仍会重新入队，不使用永久“已翻译”标记。
  const pending = new Set();
  let translationReady = false;
  let scheduled = false;
  let active = null;
  function enqueue(node) {
    if (!node || !node.isConnected) return;
    if (pending.has(document.documentElement)) return;
    pending.add(node);
    if (pending.size > 400) { pending.clear(); pending.add(document.documentElement); active = null; }
    schedule();
  }
  function schedule() {
    if (translationReady && !scheduled) {
      scheduled = true;
      requestAnimationFrame(flush);
    }
  }
  function makeScan(root) {
    return { root, first: true, walker: document.createTreeWalker(root,
      NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          if (node.nodeType === Node.ELEMENT_NODE && node.matches(BLOCK)) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        },
      }) };
  }
  function flush() {
    const batchStart = performance.now();
    scheduled = false;
    if (routeStamp !== location.pathname + location.search) routeChanged();
    const deadline = performance.now() + 6;
    let count = 0;
    while (performance.now() < deadline && count++ < 300) {
      if (!active) {
        const root = pending.values().next().value;
        if (!root) break;
        pending.delete(root);
        if (!root.isConnected) continue;
        active = makeScan(root);
      }
      const node = active.first ? active.root : active.walker.nextNode();
      active.first = false;
      if (!node) { active = null; continue; }
      if (!node.isConnected) { active = null; continue; }
      if (node.nodeType === Node.TEXT_NODE) processText(node);
      else if (node.nodeType === Node.ELEMENT_NODE) processElement(node);
    }
    if (active || pending.size) schedule();
    runtimeStats.batches++;
    runtimeStats.maxBatchMs = Math.max(runtimeStats.maxBatchMs, performance.now() - batchStart);
  }
  const observer = new MutationObserver(records => {
    if (!route.account) return;
    let external = false;
    for (const mutation of records) {
      if (mutation.type === 'characterData') {
        const own = originals.get(mutation.target);
        if (own && mutation.target.nodeValue === own.output) continue;
        external = true;
        enqueue(mutation.target.parentElement || mutation.target);
      } else if (mutation.type === 'attributes') {
        const own = originalAttributes.get(mutation.target)?.get(mutation.attributeName);
        if (own && mutation.target.getAttribute(mutation.attributeName) === own.output) continue;
        external = true;
        enqueue(mutation.target);
      } else {
        external = true;
        // New portals are small roots; scanning body again delays dialogs behind a large table.
        for (const added of mutation.addedNodes) enqueue(added);
        // Recheck bounded sentences; removing a portal does not require rescanning body.
        if (/^(?:P|SPAN|B|STRONG|EM|I|A|SMALL|LABEL|BUTTON|H[1-6])$/.test(mutation.target.tagName || '')) enqueue(mutation.target);
        else if (mutation.removedNodes.length) for (const remaining of mutation.target.childNodes) {
          if (remaining.nodeType === Node.TEXT_NODE) enqueue(remaining);
        }
      }
    }
    if (external) { headerCache = new WeakMap(); popupCache = new WeakMap(); }
  });
  observer.observe(document, {
    childList: true, subtree: true, characterData: true,
    attributes: true, attributeFilter: ATTRS,
  });
  function routeChanged() {
    routeStamp = location.pathname + location.search;
    route = routeInfo();
    headerCache = new WeakMap();
    popupCache = new WeakMap();
    privateNames.clear();
    pending.clear();
    active = null;
    enqueue(document.documentElement);
  }
  for (const method of ['pushState', 'replaceState']) {
    const original = history[method];
    history[method] = function (...args) {
      const result = Reflect.apply(original, this, args);
      routeChanged();
      return result;
    };
  }
  addEventListener('popstate', routeChanged);
  addEventListener('DOMContentLoaded', () => { if (route.account) enqueue(document.documentElement); }, { once: true });
  if (route.account) enqueue(document.documentElement);
  const startTranslation = () => setTimeout(() => {
    translationReady = true;
    if (route.account) { enqueue(document.documentElement); schedule(); }
  }, 500);
  if (document.readyState === 'complete') startTranslation();
  else addEventListener('load', startTranslation, { once: true });
})();
