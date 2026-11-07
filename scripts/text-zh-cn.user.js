// ==UserScript==
// @name         Text 简体中文
// @namespace    https://github.com/asiananlee/zh-cn-userscripts
// @version      0.1.3
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
 * 最后核对：2026-11-07。以已安装的 0.1.2 实站界面为基线，补齐订阅概览、套餐弹窗及其他固定控件。本版本为候选版。
 * 覆盖范围：www.text.com 登录后后台的收件箱、客户、AI 客服、Playbook、报表、设置及入门引导的已采集界面。
 * 已知未覆盖：HelpDesk 等跨域框架、独立组件定制器、客服窗口、图表文字及图片文字；
 * 真实会话、已连接渠道、非空报表、套餐差异、部分弹窗、错误、Toast 和窄屏布局未在本版本的实站重放中验证。
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
    ["Search Text or go to...","在 Text 中搜索或前往…"],
    ["Monitor website traffic, chat with visitors in real time, create personalized campaigns, and more!","监测网站流量、与访客实时聊天、创建个性化活动等。"],
    ["Invite","邀请"],
    ["Search","搜索"],
    ["Notifications","通知"],
    ["Log out","退出登录"],
    ["AI resolutions","AI 解决次数"],
    ["AI resolutions usage","AI 解决次数用量"],
  ];
  const COMMON_RULES = [["{n} Days left","剩余 {n} 天","a[class*=\"_subscription-counter_\"]"]];
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
        ["Oldest","最早"],
        ["Creation date","创建日期"],
        ["Last activity","最近活动"],
        ["Followers","关注者"],
        ["Rating","评分"],
        ["Attachments","附件"],
        ["Archive list","归档列表"],
        ["Chat list header","聊天列表标题"],
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
        ["Name","姓名"],
        ["Email","电子邮箱"],
        ["Supervised","监督中"],
        ["Queued","排队中"],
        ["Leads","线索"],
        ["Filter controls","筛选控件"],
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
        ["View","查看"],
        ["Open AI Agent profile","打开 AI 客服资料"],
        ["Knowledge sources","知识来源"],
        ["Accepting chats","接收聊天中"],
        ["Name","名称"],
        ["Added by","添加者"],
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
        ["Template card: Create ticket out of bad ratings","模板卡片：根据差评创建工单"],
        ["Create ticket out of bad ratings","根据差评创建工单"],
        ["Deactivate skill","停用技能"],
        ["Skill for creating a ticket out of bad ratings","根据差评创建工单的技能"],
        ["See more","查看更多"],
        ["Template card: Product insurance upsell","模板卡片：推荐购买产品保险"],
        ["Product insurance upsell","推荐购买产品保险"],
        ["When a customer buys or asks about a high-value product, the agent proactively offers insurance or an extended warranty - turning a support moment into additional revenue.","当客户购买或咨询高价商品时，客服会主动推荐保险或延保，为业务增加收入。"],
        ["Try this","试用此模板"],
        ["Template card: Close every new lead from chat","模板卡片：促成聊天中新线索成交"],
        ["Close every new lead from chat","促成聊天中新线索成交"],
        ["When a first-time visitor's chat ends, a qualified lead lands in Salesforce - before anyone manually touches anything.","首次访客结束聊天后，合格线索会自动进入 Salesforce，无需人工操作。"],
        ["Template card: Checkout coupon issuer","模板卡片：发放结账优惠券"],
        ["Checkout coupon issuer","发放结账优惠券"],
        ["When a customer hesitates on the checkout page, the agent offers a personalized discount code and tags the chat as \"sales\" - closing the deal before they leave.","当客户在结账页犹豫时，客服会提供专属优惠码，并为聊天添加「销售」标签，帮助客户在离开前完成购买。"],
        ["Template card: Turn every resolved ticket into a pipeline opportunity","模板卡片：将已解决工单转为销售机会"],
        ["Turn every resolved ticket into a pipeline opportunity","将已解决工单转为销售机会"],
        ["When a ticket closes, your agent checks the customer's tier and opens an upsell case in Salesforce - every resolution becomes a next step for sales.","工单关闭后，客服会核对客户等级，并在 Salesforce 中创建追加销售案例，让每次解决问题都能带来新的销售机会。"],
        ["Template card: Catch at-risk customers before they leave","模板卡片：提前识别可能流失的客户"],
        ["Catch at-risk customers before they leave","提前识别可能流失的客户"],
        ["When a chat gets a poor rating, the account is flagged as churn risk in Salesforce and your team lead gets notified - automatically.","聊天收到差评后，系统会在 Salesforce 中将账户标记为有流失风险，并自动通知团队负责人。"],
        ["Template card: Your daily wins report, delivered to Slack","模板卡片：将每日成果报表发送到 Slack"],
        ["Your daily wins report, delivered to Slack","将每日成果报表发送到 Slack"],
        ["Every morning, yesterday's chat activity lands in your team channel - new leads captured, issues resolved, satisfaction rate. No manual pulling.","每天早上，团队频道会收到前一天的聊天报表，包括新增线索、已解决的问题和满意度，无需手动导出。"],
        ["Customer experience","客户体验"],
        ["Lead collection","线索收集"],
        ["Notifications","通知"],
        ["Welcome new chat visitors","欢迎发起聊天的新访客"],
        ["Ticket when chat starts","开始聊天时创建工单"],
        ["Notifications & alerts","通知与提醒"],
        ["Ticket on competitor mention","提及竞争对手时创建工单"],
        ["Ticket on bad rating","收到差评时创建工单"],
        ["Tag order issue chats","为订单问题聊天添加标签"],
        ["Support case follow-up","跟进客服案例"],
        ["Ticket management","工单管理"],
        ["Show Salesforce profile to the agent on chat start","聊天开始时向客服显示 Salesforce 资料"],
        ["Show contact profile to agents","向客服显示联系人资料"],
        ["Share chat insights as tickets","将聊天洞察作为工单分享"],
        ["Chat management","聊天管理"],
        ["Route chats by product interest","按感兴趣的产品分配聊天"],
        ["Remind teammates to ask for reviews","提醒成员邀请客户评价"],
        ["Recover from bad ratings","跟进差评"],
        ["Qualify chat leads with AI and sync to Salesforce and Slack","用 AI 筛选聊天线索并同步到 Salesforce 和 Slack"],
        ["Qualify chat leads with AI","用 AI 筛选聊天线索"],
        ["Notify during transfers","转接时发送通知"],
        ["Monitor new chat quality","监控新聊天质量"],
        ["Message visitors who leave","给离开的访客发送消息"],
        ["Mark as spam and close","标记为垃圾信息并关闭"],
        ["Log support tickets in HubSpot","在 HubSpot 中记录客服工单"],
        ["Log support tickets as Salesforce cases","将客服工单记录为 Salesforce 案例"],
        ["Handle after-hours chats","处理非工作时间的聊天"],
        ["Flag urgent chats","标记紧急聊天"],
        ["Flag churn risk when a customer rates poorly","收到客户差评时标记流失风险"],
        ["Escalate to manager","上报给负责人"],
        ["Email chat transcript to visitor","通过邮件向访客发送聊天记录"],
        ["Daily chats report to Slack","将每日聊天报表发送到 Slack"],
        ["Customer feedback request","邀请客户反馈"],
        ["Create Shopify customer from finished chat","根据已结束的聊天在 Shopify 中创建客户"],
        ["Create a ticket with summary","创建包含摘要的工单"],
        ["Create an upsell case after a ticket is resolved","工单解决后创建追加销售案例"],
        ["Clarification for customer","请客户澄清"],
        ["Capture new leads from first-time support chats","从首次客服聊天中获取新线索"],
        ["Auto-tag by keywords","按关键词自动添加标签"],
        ["Auto-reply to ratings","自动回复评价"],
        ["Assist with chat transfers","协助转接聊天"],
        ["Add new contacts to Salesforce from support tickets","根据客服工单在 Salesforce 中新增联系人"],
        ["Add leads to marketing tools","将线索添加到营销工具"],
        ["Add leads to Mailchimp","将线索添加到 Mailchimp"],
        ["Add leads to HubSpot","将线索添加到 HubSpot"],
        ["Search template…","搜索模板…"],
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
        ["Watch your business grow, live.","实时掌握业务增长情况。"],
        ["Track sales, chats, and growth as they happen - from anywhere.","随时随地追踪销售、聊天和业务增长。"],
        ["Download on the App Store","在 App Store 下载"],
        ["Get it on Google Play","在 Google Play 下载"],
        ["Explore it on AppGallery","在 AppGallery 查看"],
        ["AI chats","AI 聊天"],
        ["AI resolution rate","AI 解决率"],
        ["N/A","暂无数据"],
        ["Unique visitors","独立访客"],
        ["Leads captured","已获取线索"],
        ["Leads qualified","已确认的合格线索"],
        ["Identify your leads by using customer fields.","通过客户字段识别线索。"],
        ["Automated chats per hour","每小时自动处理的聊天数"],
        ["on avg.","平均"],
        ["Manual chats per hour","每小时人工处理的聊天数"],
        ["Automated chat duration","自动聊天时长"],
        ["Manual chat duration","人工聊天时长"],
        ["Total chat duration","聊天总时长"],
        ["Chat first response time","聊天首次响应时间"],
        ["Automated CSAT","自动聊天满意度"],
        ["Rated good","好评"],
        ["Rated bad","差评"],
        ["Manual CSAT","人工聊天满意度"],
        ["Assisted CSAT","AI 辅助聊天满意度"],
        ["Tickets solved","已解决工单"],
        ["Closed tickets","已关闭工单"],
        ["Ticket CSAT","工单满意度"],
        ["Rated neutral","中评"],
        ["Tickets first response time","工单首次响应时间"],
        ["This report reflects data as of","此报表的数据截至"],
        ["Configure your AI Agent","配置你的 AI 客服"],
        ["AI Agent banner","AI 客服横幅"],
        ["AI Agent chats","AI 客服聊天"],
        ["Open AI Agent chats report","打开 AI 客服聊天报表"],
        ["AI Agent CSAT score","AI 客服满意度"],
        ["Open AI Agent CSAT score report","打开 AI 客服满意度报表"],
        ["Transferred chats","已转接的聊天"],
        ["Open transferred chats report","打开聊天转接报表"],
        ["AI resolution","AI 解决情况"],
        ["Breakdown","明细"],
        ["Track all your business metrics in one place","集中追踪所有业务指标"],
        ["Connect a channel to start collecting data about your business performance.","连接一个渠道，开始收集业务表现数据。"],
        ["Connect channels","连接渠道"],
        ["Top chat topics","热门聊天主题"],
        ["Color by:","颜色区分："],
        ["Chats count","聊天数量"],
        ["Not enough data for this period","此时段的数据不足"],
        ["Chat with customers to see data here.","与客户聊天后，即可在此查看数据。"],
        ["Topic","主题"],
        ["Avg. chat duration","平均聊天时长"],
        ["Avg. CSAT","平均满意度"],
        ["Campaign reach","活动触达"],
        ["Campaign → Chat","活动 → 聊天"],
        ["Chat → Becomes a lead","聊天 → 成为线索"],
        ["Steps","阶梯视图"],
        ["Smooth view","平滑视图"],
        ["Recommended actions","建议操作"],
        ["Track revenue from chats","追踪聊天带来的收入"],
        ["See details","查看详情"],
        ["Conversion rate","转化率"],
        ["Qualified leads","合格线索"],
        ["Identify your best leads by using customer fields.","通过客户字段识别优质线索。"],
        ["Conversion timeline","转化趋势"],
        ["Target","目标"],
        ["Conversion by type","按类型查看转化"],
        ["Tabs","标签页"],
        ["Total conversion","总体转化"],
        ["Human agent","人工客服"],
        ["Top 5 campaigns","排名前 5 的活动"],
        ["Campaign report","活动报表"],
        ["Interaction","互动"],
        ["The rate of successful interactions to all campaign displays.","成功互动占活动总展示次数的比例。"],
        ["Displays","展示次数"],
        ["Interactions","互动次数"],
        ["Campaign to lead","活动转化为线索"],
        ["Form type","表单类型"],
        ["Pre-chat","聊天前"],
        ["Chat with customers or change period to see data here.","与客户聊天或更改时间范围，即可在此查看数据。"],
        ["Group by","分组依据"],
        ["Sale timing","成交时间"],
        ["Select date range","选择日期范围"],
        ["vs N/A for previous period","上一时段：暂无数据"],
        ["Handling time by status","按状态统计处理时长"],
        ["Per teammate","按成员"],
        ["Report content","报表内容"],
        ["One time","仅发送一次"],
        ["Recurring","定期发送"],
        ["Date range","日期范围"],
        ["Set up AI Agent","设置 AI 客服"],
        ["Save view","保存视图"],
        ["(Last 7 days)","（过去 7 天）"],
        ["Teammate performance (tickets)","成员表现（工单）"],
      ],
      rules: [["{n} days","{n} 天","[class*=\"_date-filter-container_\"]"],["vs {n} for previous period","上一时段：{n}","[class*=\"_metric-basic-info__compare_\"]","\\d+(?:[.,]\\d+)*(?:%|[dhms])?"],["vs {n} on avg. for previous period","上一时段平均：{n}","[class*=\"_metric-basic-info__compare_\"]","\\d+(?:[.,]\\d+)*(?:%|[dhms])?"],["{n} of {n} visitors","{n} / {n} 位访客","[class*=\"_summary-card__counts_\"]","\\d+(?:[,.]\\d+)*"],["{n} of {n} campaigns","{n} / {n} 个活动","[class*=\"_summary-card__counts_\"]","\\d+(?:[,.]\\d+)*"],["{n} of {n} chats","{n} / {n} 次聊天","[class*=\"_summary-card__counts_\"]","\\d+(?:[,.]\\d+)*"]],
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
        ["Notification banners","横幅通知"],
        ["Sound notifications","声音通知"],
        ["New messages","新消息"],
        ["Repeat notification sound until new message is read","重复播放通知音，直到新消息被阅读"],
        ["Incoming chats","新接入的聊天"],
        ["Queued visitors","排队访客"],
        ["New visitors","新访客"],
        ["Returning visitors","回访访客"],
        ["Launches on startup, native notifications, fewer tabs, no distractions.","支持开机启动和系统通知，少开网页标签，减少干扰。"],
        ["Monitor real-time traffic, let visitors reach out, and engage them with campaigns.","监测实时流量，让访客联系你，并通过活动与他们互动。"],
        ["AVAILABLE PLATFORMS:","可用平台："],
        ["Install code manually","手动安装代码"],
        ["Need help?","需要帮助？"],
        ["read guide","阅读指南"],
        ["Help center","帮助中心"],
        ["Get QR code","获取二维码"],
        ["Chat availability","聊天可用性"],
        ["Grasp conversation context in seconds with AI summaries for chats and tickets.","通过 AI 摘要快速掌握聊天和工单的上下文。"],
        ["Select language for all your chat and ticket summaries","选择所有聊天和工单摘要使用的语言"],
        ["Auto detect language based on the agent language","根据客服使用的语言自动判断"],
        ["Use one specific language for all summaries","所有摘要使用同一种指定语言"],
        ["Amount","金额"],
        ["or","或"],
        ["Chat notification banners","聊天横幅通知"],
        ["Ticket notification banners","工单横幅通知"],
        ["Spam","垃圾邮件"],
        ["Owner","所有者"],
        ["About","基本信息"],
        ["Organization name","组织名称"],
        ["Enter organization name","输入组织名称"],
        ["Industry","行业"],
        ["Search industry","搜索行业"],
        ["Company size","公司规模"],
        ["Select company size","选择公司规模"],
        ["Audience","受众"],
        ["Select audience types","选择受众类型"],
        ["Website address","网站地址"],
        ["Mobile phone number","手机号码"],
        ["Address","地址"],
        ["Street","街道地址"],
        ["Enter street address","输入街道地址"],
        ["City","城市"],
        ["Enter city","输入城市"],
        ["State / Province / Region","州、省或地区"],
        ["Enter state","输入州、省或地区"],
        ["ZIP code","邮政编码"],
        ["Enter ZIP code","输入邮政编码"],
        ["Country","国家或地区"],
        ["Social media","社交媒体"],
        ["X (previously Twitter)","X（原 Twitter）"],
        ["Preview","预览"],
        ["If a chat doesn't match a rule, route it to","如果聊天不符合任何规则，将其分配给"],
        ["Increment value","增加数值"],
        ["Decrement value","减少数值"],
        ["About chat availability","了解聊天可用性"],
        ["Create your first ticket field","创建第一个工单字段"],
        ["Add extra information to tickets, manually or via API.","手动或通过 API 为工单添加更多信息。"],
        ["Create ticket field","创建工单字段"],
        ["Qualification","线索资格"],
        ["Customer context","客户信息"],
        ["Get a personal access token","获取个人访问令牌"],
        ["MCP server URL","MCP 服务器地址"],
        ["Detected","已检测到"],
        ["Allow members to ban customers","允许成员封禁客户"],
        ["No banned customers yet","暂无被封禁的客户"],
        ["Ban customers who are abusive or disrupt your work.","封禁辱骂他人或干扰工作的客户。"],
        ["Page name","页面名称"],
        ["Phone number","电话号码"],
        ["Instagram account","Instagram 账号"],
        ["Get started with Text APIs","开始使用 Text API"],
        ["Keep customer data in sync with HubSpot","将客户数据与 HubSpot 同步"],
        ["Sync your customer fields to HubSpot and use them in segments, workflows, and reports.","将客户字段同步到 HubSpot，并在分群、工作流和报表中使用。"],
        ["View guide","查看指南"],
        ["Turn Shopify order events into tickets","将 Shopify 订单事件转为工单"],
        ["Create tickets from order events in your stores with customer context and order details.","根据店铺订单事件创建工单，并附上客户资料和订单详情。"],
        ["Track Text performance in Google Sheets","在 Google Sheets 中追踪 Text 表现"],
        ["Combine multiple reports into a single dashboard and track support trends over time.","将多份报表汇总到同一仪表盘，长期追踪客服趋势。"],
        ["Available APIs","可用 API"],
        ["Reports API","报表 API"],
        ["Export Text data to your dashboards and BI tools","将 Text 数据导出到仪表盘和商业智能工具"],
        ["Agent Chat API","客服聊天 API"],
        ["Send messages and manage chats on behalf of agents and bots","代表客服和机器人发送消息并管理聊天"],
        ["Configuration API","配置 API"],
        ["Manage Text settings and resources from external systems","从外部系统管理 Text 设置和资源"],
        ["Customer Chat API","客户聊天 API"],
        ["Let customers chat with your team from your own interface","让客户在你自己的界面与团队聊天"],
        ["Tickets API","工单 API"],
        ["Create and manage tickets from external tools","通过外部工具创建和管理工单"],
        ["Chat Widget JavaScript API","聊天组件 JavaScript API"],
        ["Control how the chat widget works on your website","控制聊天组件在你网站上的行为"],
        ["Language Detection API","语言检测 API"],
        ["Detect the language customers use in conversations","检测客户在会话中使用的语言"],
        ["Available SDKs","可用 SDK"],
        ["Accounts SDK","账户 SDK"],
        ["Customer SDK","客户 SDK"],
        ["Manage profile","管理个人资料"],
        ["Add working hours","添加工作时间"],
        ["Growth plan","成长版套餐"],
        ["AI resolutions","AI 解决次数"],
        ["Reply suggestions","回复建议"],
        ["AI text edits","AI 文本编辑"],
        ["Live visitors tracked","已追踪的实时访客"],
        ["API calls","API 调用"],
        ["Workspace skills","工作区技能"],
        ["Proactive campaigns","主动触达活动"],
        ["Chat topics insights","聊天主题分析"],
        ["Chat supervision and takeover","监督和接管聊天"],
        ["Chat and ticket summaries","聊天和工单摘要"],
        ["Shared canned responses","共享快捷回复"],
        ["Team performance reports","团队表现报表"],
        ["Unlimited chat history","不限聊天记录"],
        ["Usage","用量"],
        ["Users","用户"],
        ["Trial limit","试用限额"],
        ["Choose your subscription plan","选择订阅套餐"],
        ["Billed monthly","按月计费"],
        ["Billed yearly","按年计费"],
        ["Essential","基础版"],
        ["For small teams earning their first revenue from chat.","适合希望通过聊天获得首批收入的小型团队。"],
        ["per user/mo","每位用户/月"],
        ["Downgrade plan","降级套餐"],
        ["Essential plan includes:","基础版套餐包括："],
        ["Custom skills","自定义技能"],
        ["Inbox and ticketing system","收件箱和工单系统"],
        ["Business channels","商业沟通渠道"],
        ["Selling through Shopify","通过 Shopify 销售"],
        ["Growth","成长版"],
        ["Recommended","推荐"],
        ["For scaling teams that want chat to drive revenue.","适合希望通过聊天带动收入增长的团队。"],
        ["Stay on Growth","继续使用成长版"],
        ["Enterprise","企业版"],
        ["Custom AI, built and run for you. Backed by a team focused on your revenue goals.","为你定制、构建和运行 AI，由专注于你营收目标的团队提供支持。"],
        ["Custom","定制"],
        ["Contact Sales","联系销售"],
        ["Adapts to how you work","适应你的工作方式"],
        ["Custom AI Agents","定制 AI 客服"],
        ["Tailored workflow automation","定制工作流自动化"],
        ["Plugged into your data","接入你的数据"],
        ["Flexible scaling and usage limits","灵活扩展与用量上限"],
        ["An expert team in your corner","由专家团队提供支持"],
        ["Personalized onboarding","个性化入门引导"],
        ["Product training for your team","团队产品培训"],
        ["Support from Product Expert","产品专家支持"],
        ["Direct engineering support","工程团队直接支持"],
        ["No procurement surprises","采购流程清晰可预期"],
        ["SLAs and compliance review","服务级别协议和合规审查"],
        ["White-label widget","可去除品牌标识的组件"],
        ["SSO and audit logs","单点登录和审计日志"],
        ["API pricing","API 定价"],
        ["Documentation","文档"],
        ["Allow external apps to access your Text data","允许外部应用访问你的 Text 数据"],
        ["Create OAuth connections to let external applications securely access the information from your Text account within a defined scope.","创建 OAuth 连接，让外部应用在指定权限范围内安全访问你的 Text 账户信息。"],
        ["Learn more","了解详情"],
        ["Access Text outside the app","在应用外访问 Text"],
        ["Create a personal access token to access and manage Text from your integrations.","创建个人访问令牌，以便从你的集成访问和管理 Text。"],
        ["Create token","创建令牌"],
      ],
      rules: [["Chat tags ({n})","聊天标签（{n}）","[role=tab] [class*=\"_tab__label_\"]"],["Ticket tags ({n})","工单标签（{n}）","[role=tab] [class*=\"_tab__label_\"]"],["Chat responses ({n})","聊天快捷回复（{n}）","[role=tab] [class*=\"_tab__label_\"]"],["Ticket responses ({n})","工单快捷回复（{n}）","[role=tab] [class*=\"_tab__label_\"]"],["Free trial ends in {n} days.","免费试用将在 {n} 天后结束。","[class*=\"_subscription-overview_\"] [class*=\"_alert__text-wrapper_\"]"]],
      overrides: [["General","通用"]],
      fragments: [{ path: /^\/app\/settings\/billing\/subscription\/?$/, selector: "[class*=\"_external-choose-plan-tile__feature-header_\"]", source: "Everything in Essential, plus:", parts: ["Everything in","Essential,","plus:"], target: ["包含","基础版的全部功能，","另有："] }, { path: /^\/app\/settings\/chats\/chat-transcripts\/?$/, selector: "[class*=\"_chat-transcripts-fields__label_\"]", source: "Send chat transcripts after each chat to up to 5 email addresses.", parts: ["Send chat transcripts after each chat to up to","5","email addresses."], target: ["每次聊天结束后，最多可将聊天记录发送至","5","个电子邮件地址。"] }, { path: /^\/app\/settings\/security\/file-sharing\/?$/, selector: "[class*=\"_file-sharing__checkbox_\"] [class*=\"_checkbox__text_\"]", source: "Allow teammates to share files", parts: ["Allow","teammates","to share files"], target: ["允许","成员","分享文件"] }, { path: /^\/app\/settings\/security\/file-sharing\/?$/, selector: "[class*=\"_file-sharing__checkbox_\"] [class*=\"_checkbox__text_\"]", source: "Allow customers to share files", parts: ["Allow","customers","to share files"], target: ["允许","客户","分享文件"] }, { path: /^\/app\/settings\/chats\/chat-timeout\/?$/, selector: "[class*=\"_timeout-settings_\"]:has(> [class*=\"_timeout-settings__input_\"])", source: "If no teammate replies to a new chat, transfer to another teammate after minutes", parts: ["If no teammate replies to a new chat,","transfer to another teammate","after","minutes"], target: ["如果没有成员回复新聊天，","转接给另一位成员","前等待","分钟"] }, { path: /^\/app\/settings\/chats\/chat-timeout\/?$/, selector: "[class*=\"_timeout-settings_\"]:has(> [class*=\"_timeout-settings__input_\"])", source: "If no new messages are sent, mark chat as inactive after minutes", parts: ["If no new messages are sent,","mark chat as inactive","after","minutes"], target: ["如果没有新消息，","标记聊天为不活跃","前等待","分钟"] }, { path: /^\/app\/settings\/chats\/chat-timeout\/?$/, selector: "[class*=\"_timeout-settings_\"]:has(> [class*=\"_timeout-settings__input_\"])", source: "If no new messages are sent, close chat after minutes", parts: ["If no new messages are sent,","close chat","after","minutes"], target: ["如果没有新消息，","关闭聊天","前等待","分钟"] }, { path: /^\/app\/settings\/customers\/customer-fields\/?$/, selector: "[class*=\"_customer-custom-fields-empty-state__content_\"] [class*=\"_empty-state__description_\"]", source: "Customer fields collect the details that matter about your customers. Qualification fields decide which leads show up in Qualified leads. Customer context fields keep useful details for your team.", parts: ["Customer fields collect the details that matter about your customers.","Qualification","fields decide which leads show up in Qualified leads.","Customer context","fields keep useful details for your team."], target: ["客户字段用于收集重要的客户信息。","线索资格","字段决定哪些线索会显示在“合格线索”中。","客户信息","字段为团队保留有用的客户资料。"] }],
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
    '[class*="_avatar"],[class*="_profile-popover-card"],[class*="_profile-menu__user"],[class*="_profile-menu-header_"]',
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
    '[class*="_install-code-reminder-modal_"] :is([class*="_modal__introduction-heading_"],[class*="_modal__introduction-body_"])',
  ].join(',');
  const MAIN = '[class*="_app-frame-content__page-content-container__content-wrapper__content_"]';
  const REPORT_COPY = [
    '[class*="_metric-basic-info__title-box__title_"],[class*="_metric-basic-info__details_"]',
    '[class*="_metric-basic-info__details-text_"],[class*="_metric-basic-info__compare_"],[class*="_breakdown-box__title_"],[class*="_metric-cta_"]',
    '[class*="_summary-card_"],[class*="_chart-card-title_"],[class*="_recommended-actions__body_"]',
    '[class*="_promo-banner__content_"],[class*="_mobile-promo-banner__store-link_"],[class*="_report-generated-at_"]',
    '[class*="_filterButton__content__label_"],[class*="_column-label_"],[class*="_target-label_"]',
    '[class*="_donut-chart-container__value_"],[class*="_top-topics-heading_"]',
    '[class*="_subtitle-trigger_"],[class*="_campaign-conversion-breakdown__actions_"] a',
  ].join(',');
  const SAFE_SETTINGS_COPY = /^\/app\/settings\/(?:notifications|company-details|desktop-app|channels|websites|integrations\/(?:api-usage|mcp|api-access\/apis-sdks)|email\/forwarding-addresses|whatsapp|messenger|instagram|telegram|twilio|sms-promo|chat-page|routing\/chat-routing|chats\/(?:chat-timeout|chat-transcripts|ai-summary)|chat-availability|tickets\/ticket-fields|customers\/customer-fields|security\/(?:trusted-domains|banned-customers|spam|file-sharing|login))(?:\/|$)/;
  const FORM_LABEL = 'label,legend,summary,[class*="_form-field__label_"],[class*="_field-label_"]';
  const CONTROL = 'button,[role=tab],[role=checkbox],[role=radio],' + FORM_LABEL;
  const BUTTON_INPUT = 'input[type=button],input[type=submit],input[type=reset]';
  const PICKER = '[role=listbox],[role=option],[role=combobox],[class*="_combobox__option"]';
  const SKILL_CARD = '[class*="_skill-card_"]';
  const FILE_SHARING_LABEL = '[class*="_file-sharing__checkbox_"] [class*="_checkbox__text_"]';
  const CHAT_TIMEOUT = '[class*="_timeout-settings_"]:has(> [class*="_timeout-settings__input_"])';
  const BILLING_PATH = /^\/app\/settings\/billing\/subscription\/?$/;
  const BILLING_PLANS = '[class*="_subscription-overview_"],[class*="_external-choose-plan-modal_"]';
  const BILLING_PLAN_NAMES = new Set(['Essential', 'Growth', 'Enterprise', 'Custom']);
  const FRAGMENT_ROOT = '[class*="_empty-state__description_"],[class*="_chat-transcripts-fields__label_"],' +
    '[class*="_external-choose-plan-tile__feature-header_"],' + FILE_SHARING_LABEL + ',' + CHAT_TIMEOUT;
  const TICKET_FILTER_TRIGGER = '[class*="_ticket-list-filters-action-menu__trigger_"]';
  const TICKET_FILTER_FIELDS = '[class*="_ticket-list-filters-tags__filters_"]';
  const REPORT_EXPORT = /^\/app\/reports\/exports\/send\/?$/;
  const REPORT_CONTENT_PICKER = '[class*="_send-report-export-container_"] [class*="_single-picker_"]';
  const PICKER_LABEL = '[role=listbox] [class*="_picker-option__label_"]';
  const TEMPLATE_PANEL = '[class*="_templates-picker__panel_"]';
  const POPUP_ITEMS = new Map([
    ['Show filters', ['Teammate', 'Tag', 'Status', 'Creation date', 'Last activity', 'Assignment', 'Last message',
      'Followers', 'Priority', 'Rating', 'Language', 'Source', 'Attachments']],
    ['Filter', ['Teammate', 'Priority', 'Tag', 'Team', 'Source', 'Language']],
    ['View and layout options', ['Column layout', 'Table layout']],
    ['Add new ticket or channel', ['Create ticket', 'Share chat page', 'Create automation', 'Invite teammates', 'Set up AI Agent', 'Connect channel']],
    ['Open profile menu', ['Show menu labels', 'Show navigation labels', 'Notifications', 'Download apps', 'Download mobile app',
      'Download desktop app', 'Log out', 'AI resolutions', 'AI resolutions usage']],
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
    return rules.map(([source, target, within, quantity = '\\d+']) => {
      const pattern = source.split('{n}').map(escape).join('(' + quantity + ')');
      return { pattern: new RegExp('^' + pattern + '$', 'u'), target, within };
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

  function labelledBy(el) {
    const id = el.getAttribute('aria-labelledby')?.trim().split(/\s+/, 1)[0];
    return id ? document.getElementById(id) : null;
  }

  function controlLabel(trigger) {
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

  function triggerLabel(menu) {
    if (menu.matches('ul[class*="_rich-menu__list_"]') && menu.querySelector('[class*="_profile-menu-header_"]') &&
        menu.querySelector('[class*="_profile-menu-footer_"]')) return 'Open profile menu';
    const direct = originalAttr(menu, 'aria-label');
    if (direct) return norm(direct);
    const labelled = labelledBy(menu);
    return controlLabel(labelled?.matches(TICKET_FILTER_TRIGGER) ? labelled.querySelector(':scope > button[aria-label]') : labelled);
  }

  const translationFor = key => scope?.overrides.get(key) ?? scope?.exact.get(key) ?? common.get(key);

  function pickerAllows(listbox, key) {
    if (scope?.id === 'I' && /^\/app\/inbox\/tickets\/grid\//.test(path)) {
      const trigger = labelledBy(listbox);
      const label = trigger?.closest(TICKET_FILTER_FIELDS) &&
        controlLabel(trigger.querySelector('button[class*="_filterButton__main_"]'));
      return (label === 'Status' || label === translationFor('Status')) &&
        ['Open', 'Pending', 'On hold', 'Solved', 'Closed'].includes(key);
    }
    if (!REPORT_EXPORT.test(path) || !listbox.id || !listbox.closest('[class*="_picker-options_"]')) return false;
    // 收件人成员选择器也用 listbox；只有“报表内容”的控制关系才允许翻译选项。
    const control = REPORT_CONTENT_PICKER + ' button[role=combobox][aria-expanded=true][aria-controls="' + CSS.escape(listbox.id) + '"]';
    return !!document.querySelector(control) && ['Chats', 'Tickets', 'Teammate performance (tickets)'].includes(key);
  }

  function menuAllows(menu, key) {
    let label = triggerLabel(menu);
    if (scope?.id === 'C' && /^More actions for\b/.test(label)) label = 'More actions for';
    if (scope?.id === 'A') {
      if (/^Tone of voice(?: |$)/.test(label)) label = 'Tone of voice';
      if (/^Answer length(?: |$)/.test(label)) label = 'Answer length';
    }
    // 菜单可能在按钮汉化后才创建，并沿用按钮已翻译的名称。
    if (!POPUP_ITEMS.has(label)) {
      label = [...POPUP_ITEMS.keys()].find(name => translationFor(name) === label) || '';
    }
    if (label === 'Filter' && scope?.id !== 'R') return false;
    if (label === 'Show filters' && scope?.id !== 'I') return false;
    return POPUP_ITEMS.get(label)?.includes(key) === true;
  }

  function ui(el, attr = '') {
    if (!APP.test(path) || blocked(el)) return false;
    if (el.tagName === 'TITLE') return !!scope && !CUSTOM_VIEW.test(path);
    if (el.closest(NAV)) {
      if (scope?.id === 'A' && el.closest(SIDE_GROUP)) return false;
      const item = el.closest(SIDE_ITEM);
      const href = (el.closest('a[href]') || item?.querySelector('a[href]'))?.getAttribute('href') || '';
      return !CUSTOM_VIEW.test(href.split(/[?#]/, 1)[0]);
    }
    if (el.matches('input')) {
      return attr === 'placeholder' || attr === 'aria-label' || attr === 'title' ||
        (attr === 'value' && el.matches(BUTTON_INPUT));
    }
    if (el.matches('[role=textbox][class*="_picker-trigger-empty-state__placeholder_"]')) return true;
    if (REPORT_EXPORT.test(path) && el.closest(REPORT_CONTENT_PICKER + ' [class*="_picker-trigger-item__content_"]')) return true;
    if (attr === 'aria-label' && el.matches('button[role=combobox][class*="_picker-trigger_"]') &&
        ['Select option', 'Search options'].includes(norm(originalAttr(el, attr) || ''))) return true;
    if (el.closest(PICKER)) return !!el.closest(PICKER_LABEL);
    if (BILLING_PATH.test(path) && el.closest(BILLING_PLANS)) return true;
    if (attr === 'aria-label' && el.matches('a[class*="_subscription-counter_"]')) return true;
    if (attr === 'aria-label' && el.matches('[role=search][class*="_search-input_"]')) return true;
    if (el.matches('[class*="_search__text--full_"]') && el.closest('[class*="_search__container_"]')) return true;
    if (attr === 'aria-label' && el.matches('[class*="_counter_"][role=button]') &&
        el.closest('[class*="_counter-details-popover-trigger_"]')) return true;
    if (scope?.id === 'P' && el.closest(TEMPLATE_PANEL + ',[class*="_skill-template-card_"]')) return true;
    if (scope?.id === 'I' && (el.closest('[class*="_ticket-info__details-metadata_"] [class*="_details-card-info__label_"]') ||
        attr === 'aria-label' && (el.matches('[class*="_archive-list__container_"]') ||
          /\/channel-promo\//.test(path) && el.parentElement?.matches(MAIN)))) return true;
    if (scope?.id === 'C' && attr === 'aria-label' && el.matches('[class*="_campaigns-filters__left_"]')) return true;
    if (scope?.id === 'A' && (
      el.closest('[class*="_teams-moved-banner__link_"],[class*="_setup-tiles_"] [class*="_tile_"]') ||
      (attr === 'aria-label' && el.matches('a[class*="_agent-identity_"]')) ||
      (/\/profile\/?$/.test(path) && el.closest('[class*="_simple-picker_"][role=button],[class*="_language-block_"][role=button],' +
        '[class*="_state-preview__content_"] > span:first-child'))
    )) return true;
    if (el.closest('[role=menu]')) return true; // 仅在已识别的静态菜单里匹配下方词条。
    if (el.closest(HEADER)) {
      return !CUSTOM_VIEW.test(path) && !el.closest('[class*="_ticket-feed_"],[class*="_chat-feed_"]');
    }
    if (el.closest(UI_PANEL) || el.closest(CONTROL) || el.closest(SKILL_CARD)) return true;
    if (!scope || !el.closest(MAIN)) return false;
    if (scope.id === 'S' && (
      (/\/notifications\/?$/.test(path) && el.closest('[class*="_switch-item__label_"],[class*="_notifications-settings__footer_"] a')) ||
      (/\/company-details\/?$/.test(path) && el.closest('[class*="_tag__content_"]')) ||
      (/\/desktop-app\/?$/.test(path) && el.closest('[class*="_promo__header-copy_"]')) ||
      (/\/websites\/?$/.test(path) && el.closest('[class*="_websites-settings-empty-state__main_"]')) ||
      (/\/whatsapp\/?$/.test(path) && el.closest('[class*="_whatsapp-header__right-node_"] a')) ||
      (/\/chat-page\/?$/.test(path) && el.closest('[class*="_content-header__right-node_"] a')) ||
      (/\/routing\/chat-routing\//.test(path) && el.closest('[class*="_route-fallback__label-row_"]')) ||
      (/\/chat-availability\/?$/.test(path) && el.closest('[class*="_messaging-mode-selector__label_"],[class*="_availability__info-icon_"]')) ||
      (/\/chats\/chat-timeout\/?$/.test(path) && el.closest(CHAT_TIMEOUT)) ||
      (/\/chats\/ai-summary\/?$/.test(path) && el.closest('[class*="_summary-language_"]')) ||
      (/\/customers\/customer-fields\/?$/.test(path) && el.closest('[class*="_category-preview_"] [class*="_details-card__label__content_"]')) ||
      (/\/integrations\/api-usage\/?$/.test(path) && attr === 'aria-label' &&
        el.matches('[class*="_api-usage-empty-state__cards_"] a[class*="_action-card_"]')) ||
      (/\/integrations\/api-access(?:\/|$)/.test(path) && el.closest('[class*="_integration-tools-header_"]')) ||
      (/\/integrations\/api-access\/apis-sdks\/?$/.test(path) && el.closest('[class*="_apis-sdks_"]'))
    )) return true;
    if (scope.id === 'R' && (el.closest(REPORT_COPY) ||
        (/\/customers\/leads-conversion\/?$/.test(path) && el.closest('[class*="_setup-prompt_"],[class*="_sources-row_"]')) ||
        el.matches('[class*="_send-report-export-container_"] form > div > div > div > span') ||
        (attr && el.matches('[class*="_overview-section_"],[class*="_sortable-item__draggable_"],[class*="_filterButton_"],' +
          '[class*="_range-date-picker__custom-trigger_"],[role=tablist][class*="_tabs__list_"]')) ||
        (attr === 'alt' && el.closest('[class*="_promo-banner__additional-content_"]')) ||
        el.closest('a[href*="/app/reports/engagement/campaign-conversion"]'))) return true;
    if (/^\/app\/settings\/teammates\/me\/edit(?:\/|$)/.test(path) && el.matches('h5')) return true;
    const copy = scope.id === 'R' || scope.id === 'O' || SAFE_SETTINGS_COPY.test(path) ||
      (scope.id === 'A' && /\/(?:launch-guide|overview)\/?$/.test(path));
    return copy && !!el.closest('p,h1,h2,h3,h4,h5,h6,[class*="_description_"],[class*="_help-text"]');
  }

  function lookup(raw, el) {
    const key = norm(raw);
    if (!/[A-Za-z]/.test(key)) return null;
    if (scope?.id === 'S' && BILLING_PLAN_NAMES.has(key) && !(BILLING_PATH.test(path) && el.closest(BILLING_PLANS))) return null;
    if (el.closest('[class*="_modal__heading_"]') &&
        !['Create new chat tag', 'Add widget to your website', 'Invite teammates'].includes(key) &&
        !(key === 'Choose your subscription plan' && BILLING_PATH.test(path) && el.closest('[class*="_external-choose-plan-modal_"]'))) return null;
    const menu = el.closest('[role=menu]');
    if (menu && !menuAllows(menu, key)) return null;
    if (el.closest(PICKER_LABEL) && !pickerAllows(el.closest('[role=listbox]'), key)) return null;
    const exact = translationFor(key);
    if (exact !== undefined) return edges(raw, exact);
    for (const rules of [scope?.rules || [], commonRules]) {
      for (const rule of rules) {
        if (rule.within && !el.closest(rule.within)) continue;
        const match = rule.pattern.exec(key);
        if (match) {
          let index = 1;
          return edges(raw, rule.target.replace(/\{n\}/g, () => match[index++]));
        }
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
        if (REPORT_EXPORT.test(path) && (record.attributeName === 'aria-controls' || record.attributeName === 'aria-expanded') &&
            node.matches(REPORT_CONTENT_PICKER + ' button[role=combobox]')) {
          const id = node.getAttribute('aria-controls');
          if (id) schedule(document.getElementById(id));
        }
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
    attributeFilter: [...ATTRS, 'class', 'role', 'href', 'contenteditable', 'aria-labelledby', 'aria-controls', 'aria-expanded'],
  });
  const rescan = () => schedule(document.documentElement);
  window.addEventListener('popstate', rescan);
  window.navigation?.addEventListener('navigatesuccess', rescan);
  rescan();
})();
