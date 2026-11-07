// ==UserScript==
// @name         Text 简体中文
// @namespace    https://github.com/asiananlee/zh-cn-userscripts
// @version      0.1.0
// @description  Text 登录后后台的简体中文界面；保留用户内容、代码和凭据。
// @author       asiananlee
// @license      MIT
// @homepageURL  https://github.com/asiananlee/zh-cn-userscripts
// @supportURL   https://github.com/asiananlee/zh-cn-userscripts/issues
// @match        https://www.text.com/app
// @match        https://www.text.com/app/*
// @run-at       document-start
// @grant        none
// ==/UserScript==
/*
 * 最后核对：2026-11-07。候选版，原文来自实站；脚本仅做本地验证，尚未在实站运行。
 * 覆盖范围：www.text.com 登录后后台的收件箱、客户、AI 客服、Playbook、报表、设置及入门引导的已采集界面。
 * 已知未覆盖：HelpDesk 等跨域框架、独立组件定制器、客服窗口、图表文字及图片文字；
 * 真实会话、已连接渠道、非空报表、套餐差异、部分弹窗、错误、Toast 和窄屏布局未验证。
 * 不翻译聊天、工单标题与正文、客户和资源名称、自定义内容、代码、凭据、网址、金额及实际数据。
 * 调试：将 localStorage 中的 text.zhCN.debug 设为 1 后刷新开启，设为 0 后刷新关闭。
 * 调试仅在已知的界面区域记录脱敏后的未匹配项，最多 100 条。
 */
(() => {
  'use strict';

  const COMMON_EXACT = [
    ["Customers can't contact you on your website.","客户无法通过你的网站联系你。"],
    ["Connect website widget","连接网站组件"],
    ["Close alert","关闭提示"],
    ["Inbox","收件箱"],
    ["Customers","客户"],
    ["AI Agents","AI 客服"],
    ["Playbook","自动化手册"],
    ["Reports","报表"],
    ["Settings","设置"],
    ["Help","帮助"],
    ["Open profile menu","打开个人菜单"],
    ["Open Sales closed details","查看成交详情"],
    ["Unpin side navigation","取消固定侧栏"],
    ["Drag to reorder","拖动调整顺序"],
    ["Chats","聊天"],
    ["All","全部"],
    ["Tickets","工单"],
    ["More","更多"],
    ["Add widget to your website","将组件添加到你的网站"],
    ["Add widget","添加组件"],
    ["Save","保存"],
    ["Teammate","成员"],
    ["Tag","标签"],
    ["Status","状态"],
    ["Assignment","分配"],
    ["Last message","最新消息"],
    ["Priority","优先级"],
    ["Language","语言"],
    ["Source","来源"],
    ["Invite teammates","邀请成员"],
    ["Connect channel","连接渠道"],
    ["Less","收起"],
    ["Send message","发送消息"],
    ["Details","详情"],
    ["Collapse details panel","收起详情面板"],
    ["Toggle section","展开或收起分区"],
    ["No results","没有结果"],
    ["Check your filter combination or clear your search","检查筛选条件，或清除搜索。"],
    ["Clear search","清除搜索"],
    ["Show menu labels","显示菜单标签"],
    ["Show navigation labels","显示导航标签"],
    ["Download apps","下载应用"],
    ["Download mobile app","下载移动应用"],
    ["Download desktop app","下载桌面应用"],
    ["Previous metric","上一个指标"],
    ["Next metric","下一个指标"],
    ["No sales yet","暂无成交"],
    ["Connect your store","连接店铺"],
    ["Refresh","刷新"],
    ["Invite teammate","邀请成员"],
    ["Create AI Agent","创建 AI 客服"],
    ["Overview","概览"],
    ["AI Agent","AI 客服"],
    ["Filter","筛选"],
    ["Team","团队"],
    ["Search teammates","搜索成员"],
    ["Copy link","复制链接"],
    ["Teammates","成员"],
    ["Teams","团队"],
    ["Profile","个人资料"],
    ["Connect","连接"],
    ["Continue","继续"],
    ["Copy","复制"],
    ["Date","日期"],
    ["Expand details panel","展开详情面板"],
    ["Select option","选择选项"],
    ["Edit","编辑"],
    ["Go live","上线"],
    ["Maybe later","稍后再说"],
    ["Close modal","关闭弹窗"],
    ["Cancel","取消"],
  ];
  const COMMON_RULES = [];
  const SCOPES = [
    // I inbox：/app/inbox 及其子路径。
    { id: "I", slug: "inbox", path: /^\/app\/inbox(?:\/|$)/,
      exact: [
        ["Add new ticket or channel","新建工单或添加渠道"],
        ["Toggle Chats","展开或收起聊天"],
        ["My chats","我的聊天"],
        ["Queued","排队中"],
        ["Unassigned","未分配"],
        ["Supervised","监督中"],
        ["Archive","归档"],
        ["Toggle AI Agents","展开或收起 AI 客服"],
        ["Solved","已解决"],
        ["Sold","已成交"],
        ["Toggle Tickets","展开或收起工单"],
        ["My open","我的未关闭工单"],
        ["Views","视图"],
        ["Toggle Views","展开或收起视图"],
        ["My recent chats","我的最近聊天"],
        ["All chats","全部聊天"],
        ["Waiting for chats?","还没有聊天？"],
        ["Place the widget on your site to start getting chats.","在网站上添加聊天组件，即可接收聊天。"],
        ["All | Chats | Inbox | Text App","全部｜聊天｜收件箱｜Text App"],
        ["My | Chats | Inbox | Text App","我的聊天｜收件箱｜Text App"],
        ["Queued | Chats | Inbox | Text App","排队中｜聊天｜收件箱｜Text App"],
        ["Unassigned | Chats | Inbox | Text App","未分配｜聊天｜收件箱｜Text App"],
        ["Supervised | Chats | Inbox | Text App","监督中｜聊天｜收件箱｜Text App"],
        ["Search chats","搜索聊天"],
        ["Archive | Chats | Inbox | Text App","归档｜聊天｜收件箱｜Text App"],
        ["All | Tickets | Inbox | Text App","全部｜工单｜收件箱｜Text App"],
        ["Create ticket","创建工单"],
        ["Share chat page","分享聊天页面"],
        ["Create automation","创建自动化"],
        ["Set up AI Agent","设置 AI 客服"],
        ["My open | Tickets | Inbox | Text App","我的未关闭工单｜收件箱｜Text App"],
        ["Open | Tickets | Inbox | Text App","打开｜工单｜收件箱｜Text App"],
        ["Pending | Tickets | Inbox | Text App","待处理｜工单｜收件箱｜Text App"],
        ["Waiting for tickets?","还没有工单？"],
        ["Set up email forwarding to turn your emails into tickets.","设置邮件转发，将收到的邮件转为工单。"],
        ["Set up forwarding","设置转发"],
        ["On hold | Tickets | Inbox | Text App","搁置｜工单｜收件箱｜Text App"],
        ["Solved | Tickets | Inbox | Text App","已解决｜工单｜收件箱｜Text App"],
        ["Closed | Tickets | Inbox | Text App","已关闭｜工单｜收件箱｜Text App"],
        ["Archive | Tickets | Inbox | Text App","归档｜工单｜收件箱｜Text App"],
        ["No tickets in Archive","归档中没有工单"],
        ["Follow the instructions to move tickets to Archive.","按说明将工单移至归档。"],
        ["Spam | Tickets | Inbox | Text App","垃圾邮件｜工单｜收件箱｜Text App"],
        ["No tickets in Spam","垃圾邮件中没有工单"],
        ["Follow the instructions to move tickets to Spam.","按说明将工单移至垃圾邮件。"],
        ["Pending","待处理"],
        ["On hold","搁置"],
        ["Closed","已关闭"],
        ["Spam","垃圾邮件"],
        ["Trash","回收站"],
        ["New ticket","新建工单"],
        ["No tickets in Trash","回收站中没有工单"],
        ["Follow the instructions to move tickets to Trash.","按说明将工单移至回收站。"],
        ["Follow instructions","查看说明"],
        ["Trash | Tickets | Inbox | Text App","回收站｜工单｜收件箱｜Text App"],
        ["Bring WhatsApp chats into your inbox","在收件箱中接收 WhatsApp 聊天"],
        ["Turn WhatsApp messages into chats in Text.","将 WhatsApp 消息转为 Text 聊天。"],
        ["Set up WhatsApp","设置 WhatsApp"],
        ["Bring Messenger chats into your inbox","在收件箱中接收 Messenger 聊天"],
        ["Messages from your Facebook page turn into chats in Text.","将 Facebook 公共主页消息转为 Text 聊天。"],
        ["Set up Messenger","设置 Messenger"],
        ["Messenger | Channel Promo | Inbox | Text App","Messenger｜渠道｜收件箱｜Text App"],
        ["Get Instagram messages as chats","将 Instagram 消息转为聊天"],
        ["Reply to Instagram messages from your inbox.","在收件箱中回复 Instagram 消息。"],
        ["Set up Instagram","设置 Instagram"],
        ["Turn Telegram messages into chats","将 Telegram 消息转为聊天"],
        ["Reply to Telegram conversations from your inbox.","在收件箱中回复 Telegram 会话。"],
        ["Set up Telegram","设置 Telegram"],
        ["Bring SMS messages into your inbox with Twilio","通过 Twilio 在收件箱中接收短信"],
        ["Messages sent to your Twilio number appear as chats in Text App.","发送到 Twilio 号码的短信会在 Text App 中显示为聊天。"],
        ["Set up Twilio","设置 Twilio"],
        ["Twilio | Channel Promo | Inbox | Text App","Twilio｜渠道｜收件箱｜Text App"],
        ["Manage view actions","管理视图操作"],
        ["Update indicator","更新指示"],
        ["Show filters","显示筛选"],
        ["View and layout options","视图与布局选项"],
        ["Search tickets","搜索工单"],
        ["Newest","最新"],
        ["Toggle recipient details","展开或收起收件人详情"],
        ["Enter message or press ‘Space‘ for Reply Suggestions","输入消息，或按空格键查看回复建议"],
        ["Message","消息"],
        ["Add emoji","添加表情"],
        ["Add file or image","添加文件或图片"],
        ["Send as Pending","发送并设为待处理"],
        ["Toggle split button menu","展开或收起发送选项"],
        ["Open","打开"],
        ["High","高"],
        ["Add tag","添加标签"],
        ["No one's following this ticket.","还没有人关注此工单。"],
        ["Follow ticket","关注工单"],
        ["Add followers","添加关注者"],
        ["Reach multiple recipients with your message.","向多位收件人发送消息。"],
        ["Add recipients","添加收件人"],
        ["Unassigned | Tickets | Inbox | Text App","未分配｜工单｜收件箱｜Text App"],
        ["Column layout","分栏布局"],
        ["Table layout","表格布局"],
      ],
      rules: [],
      overrides: [],
      fragments: [],
    },
    // C customers：/app/customers 及其子路径。
    { id: "C", slug: "customers", path: /^\/app\/customers(?:\/|$)/,
      exact: [
        ["Real-time","实时"],
        ["Toggle Real-time","展开或收起实时访客"],
        ["Chatting","聊天中"],
        ["Waiting for reply","等待回复"],
        ["Invited","已邀请"],
        ["Browsing","浏览中"],
        ["Contacts","联系人"],
        ["Toggle Contacts","展开或收起联系人"],
        ["Qualified leads","合格线索"],
        ["Campaigns","活动"],
        ["Toggle Campaigns","展开或收起活动"],
        ["Ongoing","进行中"],
        ["Scheduled","已安排"],
        ["Inactive","未启用"],
        ["See who's on your website right now","查看当前访问网站的人"],
        ["The widget tracks your traffic so you can interact with people browsing your website.","聊天组件会追踪网站访客，方便你与正在浏览的人互动。"],
        ["See conversations happening on your website","查看网站上正在进行的聊天"],
        ["Monitor and guide ongoing chats","监督和指导正在进行的聊天"],
        ["Pick up chats waiting in the queue","接手队列中等待的聊天"],
        ["Reply to customers waiting to hear from you","回复正在等待的客户"],
        ["Engage visitors who saw your chat invite","与看到聊天邀请的访客互动"],
        ["Invite browsing visitors to chat","邀请正在浏览的访客聊天"],
        ["Enter name, email, or phone","输入姓名、邮箱或电话号码"],
        ["Phone","电话"],
        ["Country","国家或地区"],
        ["Last active","最近活动"],
        ["Sorted descending","按降序排列"],
        ["Visits","访问次数"],
        ["Start building your contact list","开始建立联系人列表"],
        ["Adding the website widget lets you collect details of people who interact with you.","添加网站组件后，你可以收集与网站互动的访客资料。"],
        ["Build better customer profiles","完善客户资料"],
        ["Install the website widget to collect customer details you can use to qualify leads and keep customer context up to date.","安装网站组件以收集客户资料，便于筛选线索并更新客户背景信息。"],
        ["All Campaigns","全部活动"],
        ["New campaign","新建活动"],
        ["Search campaigns","搜索活动"],
        ["All | Campaigns | Customers | Text App","全部｜活动｜客户｜Text App"],
        ["Change name","更改名称"],
        ["Duplicate","创建副本"],
        ["Deactivate","停用"],
        ["Ongoing Campaigns","进行中的活动"],
        ["Ongoing | Campaigns | Customers | Text App","进行中｜活动｜客户｜Text App"],
        ["Scheduled Campaigns","已安排的活动"],
        ["Start more conversations with minimal effort","轻松发起更多会话"],
        ["Set up campaigns that automatically offer help, boost sales, build loyalty, or win back customers.","设置自动活动，主动提供帮助、促进销售、提高客户忠诚度或赢回客户。"],
        ["Explore templates","查看模板"],
        ["Scheduled | Campaigns | Customers | Text App","已安排｜活动｜客户｜Text App"],
        ["Inactive Campaigns","未启用的活动"],
        ["Inactive | Campaigns | Customers | Text App","未启用｜活动｜客户｜Text App"],
      ],
      rules: [],
      overrides: [],
      fragments: [],
    },
    // A ai-agents：/app/ai-agents 及其子路径。
    { id: "A", slug: "ai-agents", path: /^\/app\/ai-agents(?:\/|$)/,
      exact: [
        ["Create AI agent","创建 AI 客服"],
        ["Launch guide","上线指南"],
        ["Skills","技能"],
        ["Knowledge","知识库"],
        ["Dismiss Teams and Teammates banner","关闭团队和成员提示"],
        ["Launch your AI Agent now","立即上线 AI 客服"],
        ["Connect your channels incomplete","连接渠道：未完成"],
        ["Connect channels","连接渠道"],
        ["Manage knowledge","管理知识库"],
        ["Browse skills","浏览技能"],
        ["View full report","查看完整报表"],
        ["Play Skills overview","播放技能概览"],
        ["Performance data","表现数据"],
        ["Knowledge gaps","知识缺口"],
        ["Edit name","编辑名称"],
        ["Edit instructions","编辑指令"],
        ["Reset chat","重置聊天"],
        ["Profile | AI Agent | Team | Text App","资料｜AI 客服｜团队｜Text App"],
        ["Accept chats","接收聊天"],
        ["Tone of voice","语气"],
        ["Friendly","友好"],
        ["Answer length","回复长度"],
        ["Short","简短"],
        ["Custom voice","自定义语气"],
        ["Professional","专业"],
        ["Concise","简洁"],
        ["Polite","礼貌"],
        ["Casual","随意"],
        ["Standard","标准"],
        ["Long","详细"],
        ["Custom skills","自定义技能"],
        ["Default skills","内置技能"],
        ["Enable skill","启用技能"],
        ["Send welcome message","发送欢迎消息"],
        ["Collect customer details","收集客户资料"],
        ["Handle tickets","处理工单"],
        ["Transfer to human","转人工客服"],
        ["Setup required","需要设置"],
        ["Offer discount code","提供折扣码"],
        ["Get order status","查询订单状态"],
        ["Recommend products","推荐商品"],
        ["add-source","添加来源"],
        ["New source","新建来源"],
        ["Last Updated","最后更新"],
        ["Actions","操作"],
        ["Knowledge | AI Agent | Team | Text App","知识库｜AI 客服｜团队｜Text App"],
        ["Add source","添加来源"],
        ["Website","网站"],
        ["File","文件"],
        ["Article","文章"],
        ["Knowledge | Copilot | Team | Text App","知识库｜Copilot｜团队｜Text App"],
      ],
      rules: [],
      overrides: [],
      fragments: [],
    },
    // P playbook：/app/playbook 及其子路径。
    { id: "P", slug: "playbook", path: /^\/app\/playbook(?:\/|$)/,
      exact: [
        ["Browse templates","浏览模板"],
        ["Create new skill","创建技能"],
        ["Playbook | Text App","自动化手册｜Text App"],
        ["For your workspace","用于工作区"],
        ["Runs on any event — tickets, chats, apps, schedule — or on demand.","可按工单、聊天、应用等事件或计划运行，也可以按需运行。"],
        ["For your AI Agent","用于 AI 客服"],
        ["Runs inside your AI Agent's chats.","在 AI 客服处理的聊天中运行。"],
        ["Templates","模板"],
        ["Search templates","搜索模板"],
        ["Close templates","关闭模板"],
      ],
      rules: [],
      overrides: [],
      fragments: [],
    },
    // R reports：/app/reports 及其子路径。
    { id: "R", slug: "reports", path: /^\/app\/reports(?:\/|$)/,
      exact: [
        ["Metrics breakdown","指标拆分"],
        ["Chat topics","聊天主题"],
        ["Visitor funnel","访客漏斗"],
        ["Leads","线索"],
        ["Toggle Leads","展开或收起线索"],
        ["Leads conversion","线索转化"],
        ["Campaign conversion","活动转化"],
        ["Chat availability","聊天可用性"],
        ["Chat engagement","聊天互动"],
        ["Queued customers","排队客户"],
        ["Missed chats","未接聊天"],
        ["Chat forms","聊天表单"],
        ["Cases","案例"],
        ["Toggle Cases","展开或收起案例"],
        ["Total cases","案例总数"],
        ["Total chats","聊天总数"],
        ["Tags usage","标签用量"],
        ["New tickets","新工单"],
        ["Resolved tickets","已解决工单"],
        ["Sales","销售"],
        ["Toggle Sales","展开或收起销售"],
        ["All sales","全部销售"],
        ["AI Agent sales","AI 客服销售"],
        ["Sales conversion","销售转化"],
        ["Team performance","团队表现"],
        ["Toggle Team performance","展开或收起团队表现"],
        ["Performance","表现"],
        ["Activity","活动"],
        ["Chat satisfaction","聊天满意度"],
        ["Chat response times","聊天响应时间"],
        ["Chat duration","聊天时长"],
        ["Ticket satisfaction","工单满意度"],
        ["Ticket transfers","工单转交"],
        ["Ticket response time","工单响应时间"],
        ["Ticket resolution time","工单解决时间"],
        ["Ticket handling time","工单处理时间"],
        ["Export","导出"],
        ["Toggle Export","展开或收起导出"],
        ["Send report","发送报表"],
        ["Recurring reports","定期报表"],
        ["Add feedback","提交反馈"],
        ["Share report","分享报表"],
        ["Share","分享"],
        ["Time zone","时区"],
        ["Previous date","上一时段"],
        ["Next date","下一时段"],
        ["Medium","中"],
        ["No chat channels connected","尚未连接聊天渠道"],
        ["Connect chat channels to reach out to your customers.","连接聊天渠道，即可与客户联系。"],
        ["Connect chat channels","连接聊天渠道"],
        ["Collapse","收起"],
        ["Connect a sales platform to start tracking revenue from customer conversations.","连接销售平台，开始追踪客户会话带来的收入。"],
        ["Set up sales tracking","设置销售跟踪"],
        ["Overview | Reports | Text App","概览｜报表｜Text App"],
        ["Metrics Breakdown | Reports | Text App","指标拆分｜报表｜Text App"],
        ["Chat Topics | Reports | Text App","聊天主题｜报表｜Text App"],
        ["Close banner","关闭横幅"],
        ["General","概览"],
        ["Nothing to report in this period","此时段暂无数据"],
        ["Chat with customers or forward emails as tickets to see data here.","与客户聊天，或将邮件转为工单后，即可在这里查看数据。"],
        ["Add customer fields","添加客户字段"],
        ["AI Agent performance","AI 客服表现"],
        ["Define how it speaks, choose the length of its answers, add knowledge from files or websites, and pick the skills you want it to use.","设置语气和回复长度，从文件或网站添加知识，并选择要使用的技能。"],
        ["Customize your AI Agent","定制 AI 客服"],
        ["Automate customer support and track how your AI Agent performs.","自动处理客服事务，并追踪 AI 客服的表现。"],
        ["Expand breakdown section","展开明细"],
        ["Export CSV","导出 CSV"],
        ["Series","数据系列"],
        ["vs","对比"],
        ["Total","总计"],
        ["Leads conversion from chats","聊天线索转化"],
        ["Daily","按天"],
        ["Set up a campaign to start tracking conversions, or change the date range to see past data.","设置活动以追踪转化，或更改日期范围查看历史数据。"],
        ["Set up campaign","设置活动"],
        ["Collapse breakdown section","收起明细"],
        ["Missed Chats | Reports | Text App","未接聊天｜报表｜Text App"],
        ["Create new","新建"],
        ["Total Chats | Reports | Text App","聊天总数｜报表｜Text App"],
        ["Tags Usage | Reports | Text App","标签用量｜报表｜Text App"],
        ["Forward emails as tickets or change the date range to see past data.","将邮件转为工单，或更改日期范围查看历史数据。"],
        ["None","无"],
        ["All Sales | Ecommerce | Reports | Text App","全部销售｜电商｜报表｜Text App"],
        ["Teammate performance","成员表现"],
        ["Teammate Performance | Reports | Text App","成员表现｜报表｜Text App"],
        ["Teammate activity","成员活动"],
        ["Teammate Activity | Reports | Text App","成员活动｜报表｜Text App"],
        ["Share via email","通过邮件分享"],
        ["Show your results to the team.","向团队分享结果。"],
        ["Someone not using Text and should see this? Invite them now!","有人还没使用 Text，但也需要查看？现在邀请他们！"],
        ["Report details","报表详情"],
        ["Schedule","发送安排"],
        ["New recurring report","新建定期报表"],
        ["Content","内容"],
        ["Repeats","重复频率"],
        ["Next report","下次发送"],
        ["Recipients","收件人"],
        ["Schedule your first report","安排第一份报表"],
        ["Schedule recurring report","安排定期报表"],
      ],
      rules: [["{n} days","{n} 天","[class*=\"_date-filter-container_\"]"]],
      overrides: [],
      fragments: [{ path: /^\/app\/reports\/exports\/scheduled\/?$/, selector: "[class*=\"_empty-state__description_\"]", source: "Get reports emailed to selected teammates on a regular basis.", parts: ["Get reports emailed to selected teammates","on a regular basis."], target: ["通过邮件向指定成员","定期发送报表。"] }],
    },
    // S settings：/app/settings 及其子路径。
    { id: "S", slug: "settings", path: /^\/app\/settings(?:\/|$)/,
      exact: [
        ["Notifications","通知"],
        ["Company details","公司资料"],
        ["Desktop app","桌面应用"],
        ["Toggle Team","展开或收起团队"],
        ["Channels","渠道"],
        ["Toggle Channels","展开或收起渠道"],
        ["Website widgets","网站组件"],
        ["OFF","未连接"],
        ["Email","邮件"],
        ["SOON","即将推出"],
        ["Chat page","聊天页面"],
        ["Routing","路由"],
        ["Toggle Routing","展开或收起路由"],
        ["Chat routing","聊天路由"],
        ["Ticket rules","工单规则"],
        ["Toggle Inbox","展开或收起收件箱"],
        ["Tags","标签"],
        ["Canned responses","快捷回复"],
        ["Chat timeout","聊天超时"],
        ["Chat transcripts","聊天记录"],
        ["Email templates","邮件模板"],
        ["AI summary","AI 摘要"],
        ["Ticket fields","工单字段"],
        ["Toggle Customers","展开或收起客户"],
        ["Customer fields","客户字段"],
        ["Custom forms","自定义表单"],
        ["Forms","表单"],
        ["Integrations","集成"],
        ["Toggle Integrations","展开或收起集成"],
        ["Apps","应用"],
        ["API access","API 访问"],
        ["API usage","API 用量"],
        ["MCP server","MCP 服务器"],
        ["Security","安全"],
        ["Toggle Security","展开或收起安全"],
        ["Trusted domains","可信域名"],
        ["Banned customers","封禁客户"],
        ["File sharing","文件共享"],
        ["Login settings","登录设置"],
        ["Billing","账单"],
        ["Toggle Billing","展开或收起账单"],
        ["Subscription","订阅"],
        ["Payment details","付款信息"],
        ["Invoices","发票"],
        ["Notify me about","通知我以下事项"],
        ["Play notification sound","播放通知提示音"],
        ["Work better with the desktop app","使用桌面应用提高工作效率"],
        ["Download for Windows","下载 Windows 版"],
        ["Copy invite link","复制邀请链接"],
        ["Select all rows","选择所有行"],
        ["Name","名称"],
        ["Role","角色"],
        ["Sorted ascending","按升序排列"],
        ["Select a teammate to view details","选择成员查看详情"],
        ["Choose a teammate from the list to see their profile.","从列表中选择成员，查看其个人资料。"],
        ["Teammates | Settings | Text App","成员｜设置｜Text App"],
        ["Create team","创建团队"],
        ["New team","新建团队"],
        ["Search chatting teams","搜索聊天团队"],
        ["Accepting chats","接收聊天中"],
        ["Team members","团队成员"],
        ["Select a team to view details","选择团队查看详情"],
        ["Choose a team from the list to see its members.","从列表中选择团队，查看其成员。"],
        ["Chatting | Teams | Settings | Text App","聊天团队｜设置｜Text App"],
        ["All channels","全部渠道"],
        ["Website widget","网站组件"],
        ["Share a chat link with customers so they can reach out.","向客户分享聊天链接，方便他们联系你。"],
        ["Forward emails from multiple addresses as tickets.","将多个邮箱收到的邮件转为工单。"],
        ["Get a number and reach customers on any phone, anytime.","获取一个号码，随时通过电话联系客户。"],
        ["Turn messages to your Facebook page into chats in your inbox.","将 Facebook 公共主页消息转为收件箱中的聊天。"],
        ["Send and receive SMS through your own Twilio account.","通过你的 Twilio 账号收发短信。"],
        ["Meet customers on the world's most popular messaging app.","在广受欢迎的即时通讯应用中联系客户。"],
        ["Answer Direct Messages without leaving your inbox.","直接在收件箱中回复私信。"],
        ["Connect a bot and chat with customers on Telegram.","连接机器人，在 Telegram 上与客户聊天。"],
        ["Customize widget","定制组件"],
        ["Connect the widget to your website","将聊天组件连接到你的网站"],
        ["Invite a developer","邀请开发人员"],
        ["Websites | Settings | Text App","网站｜设置｜Text App"],
        ["Forward a copy of your emails as tickets","转发邮件副本以创建工单"],
        ["Forwarded emails appear as tickets in your inbox, keeping all communication in one place.","转发的邮件会显示为收件箱中的工单，便于集中处理。"],
        ["Set up forwarding","设置转发"],
        ["Skip","跳过"],
        ["Forwarding Addresses | Email | Settings | Text App","转发地址｜邮件｜设置｜Text App"],
        ["Bring WhatsApp chats into your inbox","在收件箱中接收 WhatsApp 聊天"],
        ["WhatsApp messages will appear as chats in Text. Start by connecting your Facebook account.","WhatsApp 消息会在 Text 中显示为聊天。请先连接 Facebook 账号。"],
        ["Continue with Facebook","通过 Facebook 继续"],
        ["Bring Messenger chats into your inbox","在收件箱中接收 Messenger 聊天"],
        ["Facebook page messages will appear as chats in Text. Start by connecting your Facebook account","Facebook 公共主页消息会在 Text 中显示为聊天。请先连接 Facebook 账号。"],
        ["Get Instagram messages as chats","将 Instagram 消息转为聊天"],
        ["Connect your account to start receiving Instagram messages as chats in Text.","连接账号，即可在 Text 中以聊天形式接收 Instagram 消息。"],
        ["Connect Instagram","连接 Instagram"],
        ["Connect Twilio to bring SMS messages into your inbox","连接 Twilio，在收件箱中接收短信"],
        ["Account SID","账号 SID"],
        ["Auth Token","身份验证令牌"],
        ["Enter value","输入值"],
        ["Show password","显示密码"],
        ["Connect Twilio","连接 Twilio"],
        ["Don't have Twilio yet?","还没有 Twilio 账号？"],
        ["Create account","创建账号"],
        ["Reach customers over SMS before they have to ask","主动通过短信联系客户"],
        ["Get a number or bring your own, and handle texts in your inbox. Automate outreach like order updates or appointment reminders.","获取或使用现有号码，在收件箱中处理短信。自动发送订单更新和预约提醒等消息。"],
        ["Request early access","申请抢先体验"],
        ["Share your chat page with customers","向客户分享聊天页面"],
        ["Other ways to share your chat","其他聊天分享方式"],
        ["Share on Facebook","分享到 Facebook"],
        ["Share on Twitter (X)","分享到 Twitter（X）"],
        ["Chat Page | Settings | Text App","聊天页面｜设置｜Text App"],
        ["New routing rule","新建路由规则"],
        ["Condition","条件"],
        ["Action","操作"],
        ["Route chats to the right team","将聊天分配给合适的团队"],
        ["Automatically route customers to the right team based on how customers interact with your website.","根据客户与网站的互动，自动将聊天分配给合适的团队。"],
        ["Create routing rule","创建路由规则"],
        ["Search options","搜索选项"],
        ["Chat routing rules illustration","聊天路由规则示意图"],
        ["Add new tag","添加标签"],
        ["New tag","新建标签"],
        ["Tags | Settings | Text App","标签｜设置｜Text App"],
        ["Add new canned response","添加快捷回复"],
        ["New canned response","新建快捷回复"],
        ["Canned Responses | Settings | Text App","快捷回复｜设置｜Text App"],
        ["Choose what happens when a chat has no activity.","选择聊天长时间没有活动时的处理方式。"],
        ["When no one is available","没有成员在线时"],
        ["Messages arrive as unassigned chats.","收到的消息会显示为未分配的聊天。"],
        ["Customers can chat anytime and leave an email.","客户可以随时发起聊天并留下邮箱。"],
        ["Edit email question","编辑邮箱问题"],
        ["Messages arrive as tickets.","收到的消息会显示为工单。"],
        ["Customers can fill a form instead of chatting.","客户可以填写表单，无需发起聊天。"],
        ["Edit ticket form","编辑工单表单"],
        ["Use enter to add another email.","按回车键添加另一个邮箱。"],
        ["New ticket field","新建工单字段"],
        ["Use ticket fields to include extra information in your ticket details.","使用工单字段，在工单详情中记录更多信息。"],
        ["Assigned to","分配给"],
        ["Type","类型"],
        ["New customer field","新建客户字段"],
        ["Build richer customer profiles and qualify leads","完善客户资料并筛选线索"],
        ["Customer fields collect the details that matter about your customers.","客户字段用于收集重要的客户信息。"],
        ["New custom form","新建自定义表单"],
        ["Created by","创建者"],
        ["Last updated","最后更新"],
        ["Bring Text into your workflow","将 Text 接入你的工作流程"],
        ["Case studies","案例研究"],
        ["Get started","开始使用"],
        ["Connect Claude to Text MCP","将 Claude 连接到 Text MCP"],
        ["Connect ChatGPT to Text MCP","将 ChatGPT 连接到 Text MCP"],
        ["Choose which domains can host your chat widget. Add them manually or pick from ones we’ve detected. Trusting a domain also trusts all its subdomains.","选择允许使用聊天组件的域名。可以手动添加，也可以从检测到的域名中选择。信任某个域名也会信任其所有子域名。"],
        ["Trusted","可信"],
        ["Type a domain...","输入域名…"],
        ["Add to trusted","加入信任列表"],
        ["Added by","添加者"],
        ["Ban customer","封禁客户"],
        ["Block problematic customers from your chat widget and traffic list.","阻止有问题的客户使用聊天组件，并将其从访客列表中屏蔽。"],
        ["IP address","IP 地址"],
        ["Start date","开始日期"],
        ["End date","结束日期"],
        ["Banned by","封禁操作人"],
        ["Chat ID","聊天 ID"],
        ["Banned Customers | Security | Settings | Text App","封禁客户｜安全｜设置｜Text App"],
        ["Prevent spam situations. Manage email addresses or email domains using trusted and blocked lists.","通过可信和阻止列表管理邮箱地址或邮件域名，防止垃圾邮件。"],
        ["Spam Protection | Security | Settings | Text App","垃圾邮件防护｜安全｜设置｜Text App"],
        ["Choose who can share files in chats.","选择谁可以在聊天中分享文件。"],
        ["We filter harmful files and let you review them before opening.","我们会过滤有害文件，你可以在打开前查看。"],
        ["Required login method","必需的登录方式"],
        ["Add payment details","添加付款信息"],
        ["Manage subscription","管理订阅"],
        ["View report","查看报表"],
        ["View settings","查看设置"],
        ["Subscription | Billing | Admin | Text App","订阅｜账单｜管理｜Text App"],
        ["Add card","添加银行卡"],
        ["Add details","添加资料"],
        ["Chat settings","聊天设置"],
        ["Ticket settings","工单设置"],
        ["Full name","姓名"],
        ["Password","密码"],
        ["Change password","更改密码"],
        ["Change organization owner","更换组织所有者"],
        ["Two-factor authentication (2FA)","双重身份验证（2FA）"],
        ["Follow working hours","按工作时间接收"],
        ["Search chatting team","搜索聊天团队"],
        ["Team name","团队名称"],
        ["Email notifications","邮件通知"],
        ["Signature","签名"],
        ["Search ticketing team","搜索工单团队"],
        ["Chat tag","聊天标签"],
        ["Ticket tag","工单标签"],
        ["Pre-chat form","聊天前表单"],
        ["Post-chat form","聊天后表单"],
        ["No-response form","无回复表单"],
        ["Offline form","离线表单"],
        ["Show in widget","在聊天组件中显示"],
        ["Form type","表单类型"],
        ["APIs & SDKs","API 与 SDK"],
        ["Webhooks","Webhook"],
        ["Personal access tokens","个人访问令牌"],
        ["OAuth clients","OAuth 客户端"],
        ["Search tags","搜索标签"],
        ["Created on","创建时间"],
        ["Create new chat tag","创建聊天标签"],
        ["Enter tag name","输入标签名称"],
        ["Create another","继续创建"],
        ["Create tag","创建标签"],
        ["Tag name","标签名称"],
        ["Chat | Tags | Settings | Text App","聊天｜标签｜设置｜Text App"],
        ["New webhook","新建 Webhook"],
        ["Create OAuth client","创建 OAuth 客户端"],
        ["Chat canned response","聊天快捷回复"],
        ["Ticket canned response","工单快捷回复"],
        ["Let customers keep chatting","允许客户继续聊天"],
        ["Let customers submit a ticket","允许客户提交工单"],
        ["Trusted addresses","可信地址"],
        ["Blocked addresses","阻止的地址"],
      ],
      rules: [],
      overrides: [["General","通用"]],
      fragments: [],
    },
    // O onboarding：/app/onboarding 及其子路径。
    { id: "O", slug: "onboarding", path: /^\/app\/onboarding(?:\/|$)/,
      exact: [
        ["Shape its skills and knowledge before it starts selling.","在 AI 客服开始销售前，先配置它的技能和知识。"],
        ["Manage AI Agent","管理 AI 客服"],
        ["Connect with your customers","与客户建立联系"],
        ["Set up channels to start conversations with customers.","设置渠道，开始与客户聊天。"],
        ["Set up together and respond to customers sooner.","协作完成设置，更快回复客户。"],
        ["Schedule a 15-min call to get you to your goal quicker.","预约 15 分钟通话，更快实现目标。"],
        ["Get started | Text App","开始使用｜Text App"],
        ["Reach first goal","达成第一个目标"],
        ["Keep growing","持续增长"],
        ["Train AI Agent with knowledge","用知识训练 AI 客服"],
        ["Schedule call","预约通话"],
      ],
      rules: [],
      overrides: [],
      fragments: [],
    },
  ];

  const ATTRS = ['placeholder', 'title', 'aria-label', 'alt', 'aria-description', 'value'];
  const EDITABLE = 'textarea,[contenteditable]:not([contenteditable="false"])';
  const BLOCK = [
    'script,style,noscript,code,pre,kbd,iframe,canvas,svg,textarea,input[type=password]',
    EDITABLE, 'read-frog,read-frog-selection,[role=log],td,[role=cell]',
    '[class*="_avatar"],[class*="_profile-popover-card"],[class*="_profile-menu__user"]',
    '[class*="_message-list-item"],[class*="_ticket-list__item"],[class*="_ticket-thread_"],[class*="_chat-thread_"]',
    '[class*="_message-bubble"],[class*="_message-event"],[class*="_message-attachments"],[class*="_chat-card-transcript"]',
    '[class*="_ticket-feed-header__title"],[class*="_chat-feed-header__title"],[class*="_message-box__content-editable"]',
    '[class*="_customer-profile"],[class*="_customer-details"],[class*="_recipient"],[class*="_canned-response-item"]',
    '[class*="_campaign-card"],[class*="_campaign-list-item"],[class*="_source-name"],[class*="_tag-name"]',
    '[class*="_teammate-name"],[class*="_team-name"],[class*="_agent-name"],[class*="_assigned-teammate-label"]',
    '[class*="_token-value"],[class*="_secret"],[class*="_signature"],[class*="_preview"],[class*="_chat-preview-grid__preview"]',
  ].join(',');
  const APP = /^\/app(?:\/|$)/;
  const SIDE_ITEM = '[class*="_side-navigation-item_"]';
  const SIDE_GROUP = '[class*="_side-navigation-group__header_"]';
  const NAV = 'nav[class*="_text-navigation_"],[class*="_side-navigation__header_"],' + SIDE_GROUP + ',' + SIDE_ITEM;
  const CUSTOM_VIEW = /\/inbox\/(?:ai-agents\/[^/]+\/active(?:\/|$)|tickets\/grid\/(?!(?:all|unassigned|my-open|open|pending|on-hold|solved|closed|archive|spam|trash)(?:\/|$))[^/]+|chats\/views\/(?!default-my-recent-chats(?:\/|$))[^/]+)/i;
  const HEADER = '[class*="_content-header__title_"]';
  const UI_PANEL = [
    '[class*="_empty-state_"],[class*="_message-box__custom-placeholder_"],#install-code',
    'th,[role=columnheader],[role=tooltip],[class*="_skills__section-title_"]',
    '[class*="_report-share-popover__header_"],[class*="_modal__heading_"]',
  ].join(',');
  const MAIN = '[class*="_app-frame-content__page-content-container__content-wrapper__content_"]';
  const SAFE_SETTINGS_COPY = /^\/app\/settings\/(?:notifications|desktop-app|channels|websites|email\/forwarding-addresses|whatsapp|messenger|instagram|telegram|twilio|sms-promo|chat-page|routing\/chat-routing|chats\/(?:chat-timeout|chat-transcripts|ai-summary)|chat-availability|tickets\/ticket-fields|customers\/customer-fields|security\/(?:trusted-domains|banned-customers|spam|file-sharing|login))(?:\/|$)/;
  const FORM_LABEL = 'label,legend,summary,[class*="_form-field__label_"],[class*="_field-label_"]';
  const CONTROL = 'button,[role=tab],[role=checkbox],[role=radio],' + FORM_LABEL;
  const BUTTON_INPUT = 'input[type=button],input[type=submit],input[type=reset]';
  const PICKER = '[role=listbox],[role=option],[role=combobox],[class*="_combobox__option"]';
  const SKILL_CARD = '[class*="_skill-card_"]';
  const FRAGMENT_ROOT = '[class*="_empty-state__description_"]';
  const POPUP_ITEMS = new Map([
    ['Show filters', ['Teammate', 'Tag', 'Status', 'Assignment', 'Last message', 'Priority', 'Language', 'Source']],
    ['Filter', ['Teammate', 'Priority', 'Tag', 'Team', 'Source', 'Language']],
    ['View and layout options', ['Column layout', 'Table layout']],
    ['Add new ticket or channel', ['Create ticket', 'Share chat page', 'Create automation', 'Invite teammates', 'Set up AI Agent', 'Connect channel']],
    ['Open profile menu', ['Show menu labels', 'Show navigation labels', 'Download apps', 'Download mobile app', 'Download desktop app']],
    ['Invite', ['Invite teammate', 'Create AI Agent']],
    ['More actions for', ['Edit', 'Change name', 'Duplicate', 'Deactivate']],
    ['Create new skill', ['For your workspace', 'Runs on any event — tickets, chats, apps, schedule — or on demand.', 'For your AI Agent', "Runs inside your AI Agent's chats."]],
    ['Add new tag', ['Chat tag', 'Ticket tag']],
    ['Add new canned response', ['Chat canned response', 'Ticket canned response']],
    ['Tone of voice', ['Professional', 'Concise', 'Polite', 'Friendly', 'Casual']],
    ['Answer length', ['Short', 'Standard', 'Long']],
    ['Add source', ['Add source', 'Website', 'File', 'Article']],
    ['add-source', ['Add source', 'Website', 'File', 'Article']],
  ]);
  const DEBUG_UI = 'nav[class*="_text-navigation_"],[class*="_side-navigation__header_"],' + HEADER;
  const DEBUG_WORDS = new Set(('add all app archive back cancel chat chats close connect create details edit email ' +
    'export filter help inbox invite layout list menu new next open profile report reports save search settings ' +
    'share show sort status tab team ticket tickets view').split(' '));

  if (location.origin !== 'https://www.text.com' || !APP.test(location.pathname) || window.top !== window) return;

  const norm = raw => raw.replace(/\s+/gu, ' ').trim();
  const escape = s => s.replace(/[.*+?^$(){}|[\]\\]/g, '\\$&');
  const edges = (raw, next) => raw.match(/^\s*/u)[0] + next + raw.match(/\s*$/u)[0];
  function compileRules(rules) {
    return rules.map(([source, target, within]) => {
      const [before, after] = source.split('{n}');
      return { pattern: new RegExp('^' + escape(before) + '(\\d+)' + escape(after) + '$', 'u'), target, within };
    });
  }
  const common = new Map(COMMON_EXACT);
  const commonRules = compileRules(COMMON_RULES);
  const scopes = SCOPES.map(scope => ({
    ...scope, exact: new Map(scope.exact), overrides: new Map(scope.overrides), rules: compileRules(scope.rules),
  }));
  const textMemory = new WeakMap();
  const attrMemory = new WeakMap();
  const missed = new Set();
  let debug = false;
  try { debug = localStorage.getItem('text.zhCN.debug') === '1'; } catch {}
  let path = '';
  let scope = null;
  const pending = new Set();
  let timer = 0;

  function blocked(el) {
    if (!el || el.closest(BLOCK)) return true;
    const card = el.closest(SKILL_CARD);
    if (card) {
      const heading = card.closest('[class*="_skills__section_"]')?.querySelector(':scope > [class*="_skills__section-title_"]');
      // 自定义技能的标题可能恰好与内置技能同名。
      if (scope?.id !== 'A' || !heading || heading.childNodes.length !== 1 ||
          heading.firstChild.nodeType !== Node.TEXT_NODE || norm(sourceOf(heading.firstChild)) !== 'Default skills') return true;
    }
    return false;
  }

  function sourceOf(node) {
    const written = textMemory.get(node);
    return written && node.nodeValue === written.output ? written.source : node.nodeValue;
  }

  function originalAttr(el, attr) {
    const raw = el.getAttribute(attr);
    const written = attrMemory.get(el)?.get(attr);
    return written && raw === written.output ? written.source : raw;
  }

  function triggerLabel(menu) {
    const direct = originalAttr(menu, 'aria-label');
    if (direct) return norm(direct);
    const id = menu.getAttribute('aria-labelledby')?.trim().split(/\s+/, 1)[0];
    const trigger = id && document.getElementById(id);
    if (!trigger?.matches('button,[role=button]')) return '';
    const label = originalAttr(trigger, 'aria-label');
    if (label) return norm(label);
    if (blocked(trigger)) return '';
    const text = document.createTreeWalker(trigger, NodeFilter.SHOW_TEXT);
    const parts = [];
    for (let n = text.nextNode(); n && parts.length < 5; n = text.nextNode()) {
      if (!blocked(n.parentElement)) parts.push(sourceOf(n));
    }
    return norm(parts.join(' '));
  }

  function menuAllows(menu, key) {
    let label = triggerLabel(menu);
    if (scope?.id === 'C' && /^More actions for\b/.test(label)) label = 'More actions for';
    if (scope?.id === 'A') {
      if (/^Tone of voice(?: |$)/.test(label)) label = 'Tone of voice';
      if (/^Answer length(?: |$)/.test(label)) label = 'Answer length';
    }
    if (label === 'Filter' && scope?.id !== 'R') return false;
    return POPUP_ITEMS.get(label)?.includes(key) === true;
  }

  function ui(el, attr = '') {
    if (!APP.test(path) || blocked(el)) return false;
    if (el.tagName === 'TITLE') return !!scope && !CUSTOM_VIEW.test(path);
    if (el.closest(NAV)) {
      if (scope?.id === 'A' && el.closest(SIDE_GROUP)) return false;
      const item = el.closest(SIDE_ITEM);
      const href = item?.querySelector('a[href]')?.getAttribute('href') || '';
      return !CUSTOM_VIEW.test(href.split(/[?#]/, 1)[0]);
    }
    if (el.matches('input')) {
      return attr === 'placeholder' || attr === 'aria-label' || attr === 'title' ||
        (attr === 'value' && el.matches(BUTTON_INPUT));
    }
    if (el.closest(PICKER)) return false;
    if (el.matches('[class*="_templates-picker__panel_"]')) return scope?.id === 'P' && attr === 'aria-label';
    if (el.closest('[role=menu]')) return true; // 仅在已识别的静态菜单里匹配下方词条。
    if (el.closest(HEADER)) {
      return !CUSTOM_VIEW.test(path) && !el.closest('[class*="_ticket-feed_"],[class*="_chat-feed_"]');
    }
    if (el.closest(UI_PANEL) || el.closest(CONTROL) || el.closest(SKILL_CARD)) return true;
    if (!scope || !el.closest(MAIN)) return false;
    if (/^\/app\/settings\/teammates\/me\/edit(?:\/|$)/.test(path) && el.matches('h5')) return true;
    const copy = scope.id === 'R' || scope.id === 'O' || SAFE_SETTINGS_COPY.test(path) ||
      (scope.id === 'A' && /\/(?:launch-guide|overview)\/?$/.test(path));
    return copy && el.matches('p,h1,h2,h3,h4,h5,h6,[class*="_description_"],[class*="_help-text"]');
  }

  function lookup(raw, el) {
    const key = norm(raw);
    if (!/[A-Za-z]/.test(key)) return null;
    if (el.closest('[class*="_modal__heading_"]') && !['Create new chat tag', 'Add widget to your website', 'Invite teammates'].includes(key)) return null;
    const menu = el.closest('[role=menu]');
    if (menu && !menuAllows(menu, key)) return null;
    const exact = scope?.overrides.get(key) ?? scope?.exact.get(key) ?? common.get(key);
    if (exact !== undefined) return edges(raw, exact);
    for (const rules of [scope?.rules || [], commonRules]) {
      for (const rule of rules) {
        if (rule.within && !el.closest(rule.within)) continue;
        const match = rule.pattern.exec(key);
        if (match) return edges(raw, rule.target.replace('{n}', match[1]));
      }
    }
    if (debug && missed.size < 100 && key.length <= 120 && el.closest(DEBUG_UI) &&
        !/[@/:=#]|\b[\w-]+\.[a-z]{2,}\b|\w{20,}|\d{4,}/iu.test(key)) {
      const words = key.match(/[A-Za-z]+|\d+/gu) || [];
      const masked = words.map(word => DEBUG_WORDS.has(word.toLowerCase()) ? word :
        /^\d+$/.test(word) ? '{n}' : '{text}').join(' ');
      if (/[A-Za-z]/.test(masked.replace(/\{(?:n|text)\}/g, '')) && !missed.has(masked)) {
        missed.add(masked);
        console.info('[Text zh-CN] 未匹配：' + masked);
      }
    }
    return null;
  }

  function writeText(node, source, output, fragment = false) {
    if (node.nodeValue === output) return;
    textMemory.set(node, { source, output, fragment });
    node.nodeValue = output;
  }

  function translateText(node) {
    const el = node.parentElement;
    const before = textMemory.get(node);
    if (!ui(el)) {
      if (before && el && !el.closest(EDITABLE) && node.nodeValue === before.output) {
        writeText(node, before.source, before.source);
      }
      return;
    }
    if (before?.fragment && node.nodeValue === before.output) return;
    const source = sourceOf(node);
    const output = lookup(source, el) ?? source;
    writeText(node, source, output);
  }

  function translateAttrs(el) {
    for (const attr of ATTRS) {
      if (attr === 'value' && !el.matches(BUTTON_INPUT)) continue;
      if (!el.hasAttribute(attr)) continue;
      if (!ui(el, attr)) {
        const saved = attrMemory.get(el)?.get(attr);
        if (saved && !el.closest(EDITABLE) && el.getAttribute(attr) === saved.output && saved.source !== saved.output) {
          saved.output = saved.source;
          el.setAttribute(attr, saved.source);
        }
        continue;
      }
      const source = originalAttr(el, attr);
      const output = lookup(source, el) ?? source;
      if (output === el.getAttribute(attr)) continue;
      let saved = attrMemory.get(el);
      if (!saved) attrMemory.set(el, saved = new Map());
      saved.set(attr, { source, output });
      el.setAttribute(attr, output);
    }
  }

  function translateFragment(el) {
    if (!el.matches(FRAGMENT_ROOT) || blocked(el)) return;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes = [];
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      if (blocked(n.parentElement)) return;
      if (norm(sourceOf(n))) nodes.push(n);
      if (nodes.length > 12) return;
    }
    const parts = nodes.map(n => norm(sourceOf(n)));
    const rule = scope?.fragments.find(item => item.path.test(path) && el.matches(item.selector) &&
      parts.length === item.parts.length && parts.join(' ') === item.source &&
      parts.every((part, index) => part === item.parts[index]));
    nodes.forEach((node, index) => {
      const source = sourceOf(node);
      if (rule) writeText(node, source, edges(source, rule.target[index]), true);
      else if (textMemory.get(node)?.fragment) writeText(node, source, source);
    });
  }

  function schedule(node) {
    if (node) pending.add(node);
    if (!timer) timer = setTimeout(flush, 24);
  }

  function flush() {
    timer = 0;
    if (location.pathname !== path) {
      path = location.pathname;
      scope = scopes.find(item => item.path.test(path)) || null;
      pending.clear();
      if (document.documentElement) pending.add(document.documentElement);
    }
    const until = performance.now() + 10;
    let count = 0;
    for (const node of pending) {
      if (++count > 800 || (count > 1 && performance.now() > until)) break;
      pending.delete(node);
      if (!node.isConnected) continue;
      if (node.nodeType === Node.TEXT_NODE) {
        translateText(node);
      } else if (node.nodeType === Node.ELEMENT_NODE && !blocked(node)) {
        translateFragment(node);
        translateAttrs(node);
        for (const child of node.childNodes) pending.add(child);
      }
    }
    if (pending.size) schedule();
  }

  const observer = new MutationObserver(records => {
    if (location.pathname !== path) schedule(document.documentElement);
    for (const record of records) {
      const node = record.target;
      if (record.type === 'characterData') {
        if (blocked(node.parentElement)) continue;
        if (textMemory.get(node)?.output === node.nodeValue) continue;
        schedule(node.parentElement.closest(FRAGMENT_ROOT) || node);
      } else if (record.type === 'attributes') {
        if (blocked(node) || (record.attributeName === 'value' && !node.matches(BUTTON_INPUT))) continue;
        const saved = attrMemory.get(node)?.get(record.attributeName);
        if (saved && node.getAttribute(record.attributeName) === saved.output) continue;
        schedule(node);
      } else {
        const fragment = node.nodeType === Node.ELEMENT_NODE && node.closest(FRAGMENT_ROOT);
        if (fragment) schedule(fragment);
        else for (const added of record.addedNodes) schedule(added);
      }
    }
  });
  observer.observe(document, {
    childList: true, subtree: true, characterData: true, attributes: true,
    attributeFilter: [...ATTRS, 'class', 'role', 'href', 'contenteditable'],
  });
  const rescan = () => schedule(document.documentElement);
  window.addEventListener('popstate', rescan);
  window.navigation?.addEventListener('navigatesuccess', rescan);
  rescan();
})();
