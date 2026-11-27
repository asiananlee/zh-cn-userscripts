// ==UserScript==
// @name         Trustpilot 简体中文
// @namespace    https://github.com/asiananlee/zh-cn-userscripts
// @version      0.2.0
// @description  Trustpilot 商家后台的简体中文界面，优化本机系统简体字体显示；保留用户内容、代码和凭据。
// @author       asiananlee
// @license      MIT
// @homepageURL  https://github.com/asiananlee/zh-cn-userscripts
// @supportURL   https://github.com/asiananlee/zh-cn-userscripts/issues
// @match        https://businessapp.b2b.trustpilot.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/*
 * 最后核对：2026-11-27
 * 覆盖范围：businessapp.b2b.trustpilot.com 商家后台全站界面，包括首页概览、服务与商品评论管理（含全部筛选弹窗、导出弹窗、举报理由弹窗与商品详情抽屉）、邀请概览/方式/模板/状态（含筛选、导出与取消队列弹窗）、全部 28 个 TrustBox 网站组件及邮件组件详情与代码弹窗、社交媒体与营销素材、数据分析（含 SVG 日期坐标）、18 个集成详情页、设置与账户安全弹窗（含删除账户确认页、消费者隐私邮件打开追踪）、套餐与账单（含升级定价页弹窗与 FAQ）、顶栏通知/试用弹窗以及 OneTrust Cookie 偏好弹窗。同时在根节点设置 lang="zh-CN" 与纯本机系统简体中文字体回退（不联网加载外部字体，保留代码等宽字体与图标）。
 * 已知未覆盖：付费套餐解锁后的内部功能界面、提交保存/发送/删除/举报后的服务端即时提示、未触发的服务器报错、跨域 TrustBox 预览 iframe（widget.trustpilot.com）内部、图片文字及第三方站外页面（如 Help Center、Google OAuth 登录页）。
 * 不翻译：客户与账户数据（姓名、邮箱、公司名、域名、地址、参考编号）、评论标题与正文、商品名称与描述、企业自定义分类与简介正文、邮件模板预览正文、第三方 Cookie 供应商说明、品牌与组件模板名、代码片段、凭据、URL、数字与金额。
 * 调试默认关闭：将 localStorage 的 trustpilot.zhCN.debug 设为 '1' 后刷新；删除该键或设为 '0' 后刷新关闭。
 * 调试仅在控制台汇总脱敏后的未命中界面文字，最多 100 条，不写入存储。
 */
(() => {
  'use strict';

  if (window.top !== window.self || location.hostname !== 'businessapp.b2b.trustpilot.com') return;
  const instance = Symbol.for('trustpilot.zhCN.0.2.0');
  if (window[instance]) return;
  window[instance] = true;

  // 仅在文档根节点设置简体中文语言标记与纯本机系统字体回退，不联网加载字体，不改动布局与代码/图标字体。
  const SYSTEM_ZH_FONT = '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei UI", "Microsoft YaHei", "Noto Sans CJK SC", "Source Han Sans SC", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  function applySystemFont() {
    const root = document.documentElement;
    if (!root) return;
    if (root.lang !== 'zh-CN') root.lang = 'zh-CN';
    if (!root.style.fontFamily.includes('PingFang SC')) root.style.fontFamily = SYSTEM_ZH_FONT;
  }
  applySystemFont();

  // 公共词典：全站共享导航、弹窗、按钮、OneTrust Cookie 弹窗与高频界面文案。
  const COMMON_EXACT = new Map([
    ["1-star reviews", "1 星评论"],
    ["2-star reviews", "2 星评论"],
    ["3 months", "3 个月"],
    ["3-star reviews", "3 星评论"],
    ["4 weeks", "4 周"],
    ["4-star reviews", "4 星评论"],
    ["5-star reviews", "5 星评论"],
    ["6 months", "6 个月"],
    ["Account settings", "账户设置"],
    ["All Trustpilot brand assets are available on Starter, Plus & Premium.", "Starter、Plus 和 Premium 套餐均可使用全部 Trustpilot 品牌素材。"],
    ["Analytics", "数据分析"],
    ["Apply", "应用"],
    ["Average", "一般"],
    ["Awaiting reply", "待回复"],
    ["Bad", "很差"],
    ["breadcrumbs", "面包屑导航"],
    ["Cancel", "取消"],
    ["Categories", "分类"],
    ["Change", "更改"],
    ["China", "中国"],
    ["Clear all", "全部清除"],
    ["Close", "关闭"],
    ["Continue", "继续"],
    ["Custom range", "自定义范围"],
    ["Customize your profile with HTML to showcase your brand and business to new customers", "使用 HTML 自定义企业主页，向新客户展示品牌和企业"],
    ["Data consent", "数据授权"],
    ["Date", "日期"],
    ["Developers", "开发者"],
    ["Display more reviews with a carousel widget and boost your site performance", "使用轮播小部件展示更多评论，提升网站表现"],
    ["Easily analyze review sentiment with tools that let you make data-driven decisions", "使用评论情感分析工具，依据数据作出决策"],
    ["Ecommerce", "电商"],
    ["Email", "邮箱"],
    ["Email notifications", "邮件通知"],
    ["End date", "结束日期"],
    ["Excellent", "非常好"],
    ["Export", "导出"],
    ["Fewer filters", "收起筛选"],
    ["Flag", "举报"],
    ["For purchase experiences (Best in test)", "适用于购买体验（测试效果最佳）"],
    ["Fr", "五"],
    ["Friday", "星期五"],
    ["Get complete access to this and other sales-boosting tools like:", "全面使用此功能及其他促进销售的工具，例如："],
    ["Get reviews", "获取评论"],
    ["Go to page Home", "前往首页"],
    ["Go to public profile", "前往公开主页"],
    ["Great", "较好"],
    ["Help Center", "帮助中心"],
    ["Here's what other businesses are saying", "其他企业的评价"],
    ["Home", "首页"],
    ["icon", "图标"],
    ["icon legal", "法律信息图标"],
    ["If you're on a free plan, you can't use Trustpilot branding assets. Find out why in our", "免费套餐无法使用 Trustpilot 品牌素材。了解原因，请查看我们的"],
    ["Image generator", "图片生成器"],
    ["In-app review collector", "应用内评论收集工具"],
    ["Information", "信息"],
    ["Integrations", "集成"],
    ["Invitation methods", "邀请方式"],
    ["Learn more", "了解更多"],
    ["Locations", "地点"],
    ["Manage reviews", "管理评论"],
    ["Mo", "一"],
    ["Monday", "星期一"],
    ["More filters", "更多筛选"],
    ["New", "新"],
    ["Next month", "下个月"],
    ["Open submenu Analytics", "打开数据分析子菜单"],
    ["Open submenu Get reviews", "打开获取评论子菜单"],
    ["Open submenu Integrations", "打开集成子菜单"],
    ["Open submenu Manage reviews", "打开管理评论子菜单"],
    ["Open submenu Settings", "打开设置子菜单"],
    ["Open submenu Share & promote", "打开分享与推广子菜单"],
    ["Optimized for product reviews", "针对商品评论优化"],
    ["Paid brand assets", "付费品牌素材"],
    ["Payment & CRM", "支付与 CRM"],
    ["Poor", "较差"],
    ["Post reply", "发布回复"],
    ["Previous month", "上个月"],
    ["Product reviews", "商品评论"],
    ["Product Reviews Add-on", "商品评论附加模块"],
    ["Profile page", "企业主页"],
    ["Profile views", "主页浏览量"],
    ["Promote business offers on your customizable profile page", "在可自定义的企业主页上推广优惠"],
    ["Reference number", "参考编号"],
    ["Reference number:", "参考编号："],
    ["Reply", "回复"],
    ["Request information", "索取信息"],
    ["Reviewer", "评论者"],
    ["Reviews", "评论"],
    ["Sa", "六"],
    ["Saturday", "星期六"],
    ["Save changes", "保存更改"],
    ["Search impressions", "搜索展示次数"],
    ["See pricing plans", "查看套餐价格"],
    ["Select a date range", "选择日期范围"],
    ["Select all", "全选"],
    ["Select items for Reply", "选择回复筛选项"],
    ["Select items for Star rating", "选择星级筛选项"],
    ["Service reviews", "服务评论"],
    ["Settings", "设置"],
    ["Share", "分享"],
    ["Share & promote", "分享与推广"],
    ["Source: Basic Invitation", "来源：基础邀请"],
    ["Square logo", "Square 标志"],
    ["Star rating", "星级"],
    ["Start date", "开始日期"],
    ["Style and share", "设计并分享"],
    ["Su", "日"],
    ["Sunday", "星期日"],
    ["Th", "四"],
    ["The add-on module includes:", "附加模块包括："],
    ["Thursday", "星期四"],
    ["Tu", "二"],
    ["Tuesday", "星期二"],
    ["Upgrade", "升级"],
    ["Upgrade my account", "升级账户"],
    ["Upgrade now", "立即升级"],
    ["Upgrade to access", "升级以使用"],
    ["Video generator", "视频生成器"],
    ["We", "三"],
    ["Webhook Notifications", "Webhook 通知"],
    ["Wednesday", "星期三"],
    ["Write a reply...", "撰写回复…"],
    ["Year", "一年"],
    ["Account information", "账户资料"],
    ["All widgets", "全部组件"],
    ["Business settings", "企业设置"],
    ["Close menu", "关闭菜单"],
    ["Collect reviews", "收集评论"],
    ["Connect & share", "连接与分享"],
    ["Consumer privacy", "消费者隐私"],
    ["Customer support", "客户支持"],
    ["Customize", "自定义"],
    ["Email settings", "邮件设置"],
    ["Email templates", "邮件模板"],
    ["Email widgets", "邮件组件"],
    ["Essentials", "基础组件"],
    ["Flagging activity", "举报记录"],
    ["Get insights on what customers are saying about your brand, location to location", "逐个地点了解客户对品牌的评价"],
    ["Help", "帮助"],
    ["Image Generator", "图片生成器"],
    ["Inbox", "收件箱"],
    ["Invitation data", "邀请数据"],
    ["Invitation settings", "邀请设置"],
    ["Invitation status", "邀请状态"],
    ["Invitations", "邀请"],
    ["Legal notice", "法律声明"],
    ["Location reviews", "地点评价"],
    ["Log out", "退出登录"],
    ["Marketing", "营销"],
    ["Marketing assets", "营销素材"],
    ["My details", "我的资料"],
    ["Overview", "概览"],
    ["Performance", "表现"],
    ["Personal settings", "个人设置"],
    ["Plans & billing", "套餐与账单"],
    ["Product attributes", "商品属性"],
    ["Product catalog", "商品目录"],
    ["Product Q&A", "商品问答"],
    ["Public profile settings", "企业主页设置"],
    ["Return to the main menu", "返回主菜单"],
    ["Review insights", "评论洞察"],
    ["Social", "社交媒体"],
    ["Testimonials", "客户评价"],
    ["Third-party reviews", "第三方评论"],
    ["Time & delivery", "时间与投递"],
    ["Toggle menu", "切换菜单"],
    ["TrustScore insights", "TrustScore 洞察"],
    ["Users", "用户"],
    ["Video Generator", "视频生成器"],
    ["Website widgets", "网站组件"],
    ["You've unlocked a 14-day free Plus trial.", "你已解锁 14 天 Plus 免费试用。"],
    ["Mark all as unread", "全部标为未读"],
    ["Mark as unread", "标为未读"],
    ["User information", "用户信息"],
    ["Explore location reviews", "了解地点评价"],
    ["Public profile setup", "设置公开主页"],
    ["Notifications", "通知"],
    ["Mark all as read", "全部标为已读"],
    ["You've hit your monthly invitation limit", "你已达到本月邀请上限"],
    ["Upgrade your plan today to invite more customers and get deeper insights.", "立即升级套餐，邀请更多客户，获得更深入的洞察。"],
    ["Confirm your business registration address", "确认企业注册地址"],
    ["Adding your registration address helps us bring you the best experience on Trustpilot.", "添加注册地址，帮助我们为你提供更好的 Trustpilot 使用体验。"],
    ["Notification actions", "通知操作"],
    ["Mark as read", "标为已读"],
    ["Get started with your plan", "开始使用你的套餐"],
    ["Useful resources", "实用资源"],
    ["Go to page Help", "前往帮助页"],
    ["just now", "刚刚"],
    ["No unread notifications", "暂无未读通知"],
    ["Hello, have a question? Let's chat.", "你好，有问题需要咨询吗？快来聊聊吧。"],
    ["Since", "自"],
    ["Read", "已读"],
    ["Unread", "未读"],
    ["New: Control email open tracking", "新功能：控制邮件打开追踪"],
    ["You can now choose whether Trustpilot records when recipients open your review invitation emails. Select this notification to review your settings in Consumer privacy.", "你现在可以选择是否允许 Trustpilot 记录收件人何时打开评论邀请邮件。点击此通知即可前往“消费者隐私”检查设置。"],
    ["Get insights on what customers are saying about your specific products.", "了解客户对每件具体商品的真实评价。"],
    ["Explore product reviews", "了解商品评论"],
    ["You've unlocked a 14-day free Plus trial", "你已解锁 14 天 Plus 免费试用"],
    ["Building trust just got even easier", "建立客户信任变得更轻松"],
    ["We know that growing your business matters. And with the free Plus trial, you've got access to more invitations, marketing tools and data to track how your business is doing.", "我们深知业务增长至关重要。使用 Plus 免费试用版，你将获得更多邀请额度、营销工具以及用于跟踪业务表现的数据洞察。"],
    ["features of the Plus plan", "Plus 套餐包含的功能"],
    ["Image and video generator tools", "图片与视频生成工具"],
    ["Downloadable marketing assets", "可下载营销素材"],
    ["Explore other plans", "查看其他套餐"],
    ["Try for free", "免费试用"],
    ["Upgrade to access this feature", "升级以使用此功能"],
    ["Show all Premium features", "显示全部 Premium 功能"],
    ["Hide all Premium features", "收起全部 Premium 功能"],
    ["Show all Plus features", "显示全部 Plus 功能"],
    ["Hide all Plus features", "收起全部 Plus 功能"],
    ["COPY", "复制"],
    ["Copy", "复制"],
    ["Copy code", "复制代码"],
    ["Copy email address", "复制邮箱地址"],
    ["Contact sales", "联系销售"],
    ["Contact Sales", "联系销售"],
    ["Contact us", "联系我们"],
    ["Connect", "连接"],
    ["Download", "下载"],
    ["Download zip file", "下载 ZIP 文件"],
    ["Back", "返回"],
    ["Next", "下一步"],
    ["Done", "完成"],
    ["Save", "保存"],
    ["Clear", "清除"],
    ["Clear all filters", "清除全部筛选"],
    ["Clear field", "清空字段"],
    ["Filter", "筛选"],
    ["Search", "搜索"],
    ["Show", "显示"],
    ["Hide", "隐藏"],
    ["Verify", "验证"],
    ["Confirm", "确认"],
    ["Select", "选择"],
    ["Preview", "预览"],
    ["Progress", "进度"],
    ["Breadcrumb", "面包屑导航"],
    ["Location", "地点"],
    ["Organic", "自主评论"],
    ["Automatic invitation", "自动邀请"],
    ["Automatic Invitation", "自动邀请"],
    ["Enabled", "已启用"],
    ["Disabled", "已停用"],
    ["Today", "今天"],
    ["Yesterday", "昨天"],
    ["Just now", "刚刚"],
    ["Your current plan:", "当前套餐："],
    ["Unlock features", "解锁功能"],
    ["Powered by Onetrust", "由 OneTrust 提供支持"],
    ["Powered by OneTrust", "由 OneTrust 提供支持"],
    ["Powered by OneTrust Opens in a new Tab", "由 OneTrust 提供支持（在新标签页打开）"],
    ["Manage your cookie preferences", "管理你的 Cookie 偏好设置"],
    ["Cookie List", "Cookie 列表"],
    ["Cookie List Filters", "Cookie 列表筛选"],
    ["Cookie list search", "搜索 Cookie 列表"],
    ["Filter Cookie List", "筛选 Cookie 列表"],
    ["Close preference center", "关闭偏好设置中心"],
    ["Back to preference center", "返回偏好设置中心"],
    ["More information about your privacy, opens in a new tab", "了解更多隐私信息（在新标签页打开）"],
    ["Strictly necessary cookies", "严格必要的 Cookie"],
    ["Performance cookies", "性能 Cookie"],
    ["Functionality cookies", "功能 Cookie"],
    ["Marketing cookies", "营销 Cookie"],
    ["Strictly necessary cookies - Cookie Details button opens Cookie List menu", "严格必要的 Cookie - 点击查看 Cookie 列表"],
    ["Performance cookies - Cookie Details button opens Cookie List menu", "性能 Cookie - 点击查看 Cookie 列表"],
    ["Functionality cookies - Cookie Details button opens Cookie List menu", "功能 Cookie - 点击查看 Cookie 列表"],
    ["Marketing cookies - Cookie Details button opens Cookie List menu", "营销 Cookie - 点击查看 Cookie 列表"],
    ["First party cookies", "第一方 Cookie"],
    ["First party cookies View cookies", "第一方 Cookie（查看详情）"],
    ["View cookies", "查看 Cookie"],
    ["Save my preferences", "保存我的偏好设置"],
    ["Search…", "搜索…"],
    ["Search...", "搜索…"],
    ["Company Logo", "企业徽标"],
    ["Mandatory", "必需"],
    ["Cookies details", "Cookie 详情"],
    ["More information", "更多信息"],
    ["Clear filters", "清除筛选"],
    ["Apply filters", "应用筛选"],
    ["Cancel filter application", "取消应用筛选"],
    ["Cookies are small text files that websites place on your device as you are browsing. This information might be about you, your preferences or your device. The information does not usually directly identify you, but it can improve your browsing experience on our website. Because we respect your right to privacy, you can choose to opt out of certain cookies. Note that this may impact your experience of the site and the services we offer.", "Cookie 是你在浏览网页时，网站存放在你设备上的小型文本文件。这些信息可能与你本人、你的偏好设置或设备有关。它们通常不会直接识别你的身份，但可以改善你在本站的浏览体验。出于对隐私权的尊重，你可以选择停用部分 Cookie，但请注意，这可能会影响你使用本网站及我们提供的服务。"],
    ["These cookies are essential for you to browse the website and use its features, such as setting your privacy preferences, logging in, or filling in forms (which is why you can't opt out of them).", "这些 Cookie 是你浏览本网站和使用各项功能所必需的，例如设置隐私偏好、登录或填写表单（因此无法停用）。"],
    ["These cookies allow us to track visits, traffic sources and clicks so we can measure and improve the performance of our website.", "这些 Cookie 帮助我们统计访问量、流量来源和点击情况，以便衡量并优化网站性能。"],
    ["These cookies allow a website to remember your personal preferences (e.g. what language setting you prefer), and ensure that all of our services function properly. These cookies may be set by us or third-party providers that we work with.", "这些 Cookie 让网站能够记住你的个人偏好（例如你偏好的语言设置），并确保各项服务正常运行。它们可能由我们或合作的第三方服务商设置。"],
    ["These cookies track your online activity to help our advertising partners deliver more targeted ads or to limit how many times you see an ad, based on your browsing behavior and internet device.", "这些 Cookie 会追踪你的在线活动，帮助广告合作伙伴根据你的浏览行为和设备投放更具针对性的广告，或限制同一广告的展示次数。"],
    ["Main benefits", "主要优势"],
    ["Main benefits:", "主要优势："],
    ["Automate review requests.", "自动发送评论邀请。"],
    ["Add multiple TrustBox widgets on-site.", "在网站上添加多个 TrustBox 组件。"],
    ["Privacy and Trustpilot", "隐私与 Trustpilot"],
    ["Learn which important issues to consider when using this integration.", "了解使用此集成时需要关注的隐私与合规要点。"],
    ["Read more", "查看更多"],
    ["Your integration key is:", "你的集成密钥："],
    ["How to download and install the plugin", "如何下载并安装插件"],
    ["Download the zip file to your computer.", "将 ZIP 文件下载到电脑。"],
    ["Download the zip file to your computer", "将 ZIP 文件下载到电脑"],
    ["Get started", "开始使用"],
    ["5 MIN SETUP", "5 分钟完成配置"],
    ["support article", "支持文章"],
    ["Please note", "请注意"],
    ["What you get:", "你将获得："],
    ["Features", "功能"],
    ["How it works", "使用方法"],
    ["FAQs", "常见问题"],
    ["Frequently asked questions", "常见问题"],
    ["Thank you, we've received your request", "感谢，我们已收到你的请求"],
    ["We're happy to hear that you want to upgrade. We'll get in touch with you soon.", "很高兴得知你希望升级套餐，我们将尽快与你联系。"],
    ["Go to home", "返回首页"],
    ["Pagination", "分页"],
    ["Previous page", "上一页"],
    ["Next page", "下一页"],
    ["No results", "无结果"],
    ["Need help?", "需要帮助？"],
    ["Trustpilot APIs", "Trustpilot API"],
    ["Personal account", "个人账户"],
    ["Domains", "域名"],
    ["Afghanistan", "阿富汗"],
    ["Åland Islands", "奥兰群岛"],
    ["Albania", "阿尔巴尼亚"],
    ["Algeria", "阿尔及利亚"],
    ["American Samoa", "美属萨摩亚"],
    ["Andorra", "安道尔"],
    ["Angola", "安哥拉"],
    ["Anguilla", "安圭拉"],
    ["Antarctica", "南极洲"],
    ["Antigua & Barbuda", "安提瓜和巴布达"],
    ["Argentina", "阿根廷"],
    ["Armenia", "亚美尼亚"],
    ["Aruba", "阿鲁巴"],
    ["Australia", "澳大利亚"],
    ["Austria", "奥地利"],
    ["Azerbaijan", "阿塞拜疆"],
    ["Bahamas", "巴哈马"],
    ["Bahrain", "巴林"],
    ["Bangladesh", "孟加拉国"],
    ["Barbados", "巴巴多斯"],
    ["Belgium", "比利时"],
    ["Belize", "伯利兹"],
    ["Benin", "贝宁"],
    ["Bermuda", "百慕大"],
    ["Bhutan", "不丹"],
    ["Bolivia", "玻利维亚"],
    ["Bosnia And Herzegovina", "波斯尼亚和黑塞哥维那"],
    ["Botswana", "博茨瓦纳"],
    ["Bouvet Island", "布韦岛"],
    ["Brazil", "巴西"],
    ["British Indian Ocean Territory", "英属印度洋领地"],
    ["British Virgin Islands", "英属维尔京群岛"],
    ["Brunei", "文莱"],
    ["Bulgaria", "保加利亚"],
    ["Burkina Faso", "布基纳法索"],
    ["Burundi", "布隆迪"],
    ["Cambodia", "柬埔寨"],
    ["Cameroon", "喀麦隆"],
    ["Canada", "加拿大"],
    ["Cape Verde", "佛得角"],
    ["Caribbean Netherlands", "荷兰加勒比区"],
    ["Cayman Islands", "开曼群岛"],
    ["Central African Republic", "中非共和国"],
    ["Chad", "乍得"],
    ["Chile", "智利"],
    ["Christmas Island", "圣诞岛"],
    ["Cocos (Keeling) Islands", "科科斯（基林）群岛"],
    ["Colombia", "哥伦比亚"],
    ["Comoros", "科摩罗"],
    ["Congo - Brazzaville", "刚果（布）"],
    ["Cook Islands", "库克群岛"],
    ["Costa Rica", "哥斯达黎加"],
    ["Côte d'Ivoire", "科特迪瓦"],
    ["Croatia", "克罗地亚"],
    ["Curaçao", "库拉索"],
    ["Cyprus", "塞浦路斯"],
    ["Czech Republic", "捷克共和国"],
    ["Denmark", "丹麦"],
    ["Djibouti", "吉布提"],
    ["Dominica", "多米尼克"],
    ["Dominican Republic", "多米尼加共和国"],
    ["Ecuador", "厄瓜多尔"],
    ["Egypt", "埃及"],
    ["El Salvador", "萨尔瓦多"],
    ["English (United States)", "英语（美国）"],
    ["Equatorial Guinea", "赤道几内亚"],
    ["Eritrea", "厄立特里亚"],
    ["Estonia", "爱沙尼亚"],
    ["Ethiopia", "埃塞俄比亚"],
    ["Falkland Islands", "福克兰群岛"],
    ["Faroe Islands", "法罗群岛"],
    ["Fiji", "斐济"],
    ["Finland", "芬兰"],
    ["France", "法国"],
    ["French Guiana", "法属圭亚那"],
    ["French Polynesia", "法属波利尼西亚"],
    ["French Southern Territories", "法属南部领地"],
    ["Gabon", "加蓬"],
    ["Gambia", "冈比亚"],
    ["Georgia", "格鲁吉亚"],
    ["Germany", "德国"],
    ["Ghana", "加纳"],
    ["Gibraltar", "直布罗陀"],
    ["Greece", "希腊"],
    ["Greenland", "格陵兰"],
    ["Grenada", "格林纳达"],
    ["Guadeloupe", "瓜德罗普"],
    ["Guam", "关岛"],
    ["Guatemala", "危地马拉"],
    ["Guernsey", "根西岛"],
    ["Guinea", "几内亚"],
    ["Guinea-Bissau", "几内亚比绍"],
    ["Guyana", "圭亚那"],
    ["Haiti", "海地"],
    ["Heard & McDonald Islands", "赫德岛和麦克唐纳群岛"],
    ["Honduras", "洪都拉斯"],
    ["Hong Kong", "香港"],
    ["Hungary", "匈牙利"],
    ["Iceland", "冰岛"],
    ["India", "印度"],
    ["Indonesia", "印度尼西亚"],
    ["Iraq", "伊拉克"],
    ["Ireland", "爱尔兰"],
    ["Isle of Man", "马恩岛"],
    ["Israel", "以色列"],
    ["Italy", "意大利"],
    ["Jamaica", "牙买加"],
    ["Japan", "日本"],
    ["Jersey", "泽西岛"],
    ["Jordan", "约旦"],
    ["Kazakhstan", "哈萨克斯坦"],
    ["Kenya", "肯尼亚"],
    ["Kiribati", "基里巴斯"],
    ["Kosovo", "科索沃"],
    ["Kuwait", "科威特"],
    ["Kyrgyzstan", "吉尔吉斯斯坦"],
    ["Lao P.D.R.", "老挝"],
    ["Latvia", "拉脱维亚"],
    ["Lebanon", "黎巴嫩"],
    ["Lesotho", "莱索托"],
    ["Liberia", "利比里亚"],
    ["Libya", "利比亚"],
    ["Liechtenstein", "列支敦士登"],
    ["Lithuania", "立陶宛"],
    ["Luxembourg", "卢森堡"],
    ["Macao S.A.R.", "澳门"],
    ["Madagascar", "马达加斯加"],
    ["Malawi", "马拉维"],
    ["Malaysia", "马来西亚"],
    ["Maldives", "马尔代夫"],
    ["Mali", "马里"],
    ["Malta", "马耳他"],
    ["Marshall Islands", "马绍尔群岛"],
    ["Martinique", "马提尼克"],
    ["Mauritania", "毛里塔尼亚"],
    ["Mauritius", "毛里求斯"],
    ["Mayotte", "马约特"],
    ["Mexico", "墨西哥"],
    ["Micronesia", "密克罗尼西亚"],
    ["Moldova", "摩尔多瓦"],
    ["Mongolia", "蒙古"],
    ["Montenegro", "黑山"],
    ["Montserrat", "蒙特塞拉特"],
    ["Morocco", "摩洛哥"],
    ["Mozambique", "莫桑比克"],
    ["Myanmar", "缅甸"],
    ["Namibia", "纳米比亚"],
    ["Nauru", "瑙鲁"],
    ["Nepal", "尼泊尔"],
    ["Netherlands", "荷兰"],
    ["New Caledonia", "新喀里多尼亚"],
    ["New Zealand", "新西兰"],
    ["Nicaragua", "尼加拉瓜"],
    ["Niger", "尼日尔"],
    ["Nigeria", "尼日利亚"],
    ["Niue", "纽埃"],
    ["Norfolk Island", "诺福克岛"],
    ["North Macedonia", "北马其顿"],
    ["Northern Mariana Islands", "北马里亚纳群岛"],
    ["Norway", "挪威"],
    ["Oman", "阿曼"],
    ["Pakistan", "巴基斯坦"],
    ["Palau", "帕劳"],
    ["Palestine", "巴勒斯坦"],
    ["Panama", "巴拿马"],
    ["Papua New Guinea", "巴布亚新几内亚"],
    ["Paraguay", "巴拉圭"],
    ["Peru", "秘鲁"],
    ["Philippines", "菲律宾"],
    ["Pitcairn Islands", "皮特凯恩群岛"],
    ["Poland", "波兰"],
    ["Portugal", "葡萄牙"],
    ["Principality of Monaco", "摩纳哥"],
    ["Puerto Rico", "波多黎各"],
    ["Qatar", "卡塔尔"],
    ["Republic of Congo", "刚果共和国"],
    ["Réunion", "留尼汪"],
    ["Romania", "罗马尼亚"],
    ["Rwanda", "卢旺达"],
    ["Samoa", "萨摩亚"],
    ["San Marino", "圣马力诺"],
    ["São Tomé & Príncipe", "圣多美和普林西比"],
    ["Saudi Arabia", "沙特阿拉伯"],
    ["Senegal", "塞内加尔"],
    ["Serbia", "塞尔维亚"],
    ["Seychelles", "塞舌尔"],
    ["Sierra Leone", "塞拉利昂"],
    ["Singapore", "新加坡"],
    ["Sint Maarten", "荷属圣马丁"],
    ["Slovakia", "斯洛伐克"],
    ["Slovenia", "斯洛文尼亚"],
    ["Solomon Islands", "所罗门群岛"],
    ["Somalia", "索马里"],
    ["South Africa", "南非"],
    ["South Georgia & South Sandwich Islands", "南乔治亚和南桑威奇群岛"],
    ["South Korea", "韩国"],
    ["South Sudan", "南苏丹"],
    ["Spain", "西班牙"],
    ["Sri Lanka", "斯里兰卡"],
    ["St. Barthélemy", "圣巴泰勒米"],
    ["St. Helena", "圣赫勒拿"],
    ["St. Kitts & Nevis", "圣基茨和尼维斯"],
    ["St. Lucia", "圣卢西亚"],
    ["St. Martin", "法属圣马丁"],
    ["St. Pierre & Miquelon", "圣皮埃尔和密克隆"],
    ["St. Vincent & Grenadines", "圣文森特和格林纳丁斯"],
    ["Sudan", "苏丹"],
    ["Suriname", "苏里南"],
    ["Svalbard & Jan Mayen", "斯瓦尔巴和扬马延"],
    ["Swaziland", "斯威士兰"],
    ["Sweden", "瑞典"],
    ["Switzerland", "瑞士"],
    ["Taiwan", "台湾"],
    ["Tajikistan", "塔吉克斯坦"],
    ["Tanzania", "坦桑尼亚"],
    ["Thailand", "泰国"],
    ["Timor-Leste", "东帝汶"],
    ["Togo", "多哥"],
    ["Tokelau", "托克劳"],
    ["Tonga", "汤加"],
    ["Trinidad and Tobago", "特立尼达和多巴哥"],
    ["Tunisia", "突尼斯"],
    ["Turkey", "土耳其"],
    ["Turkmenistan", "土库曼斯坦"],
    ["Turks & Caicos Islands", "特克斯和凯科斯群岛"],
    ["Tuvalu", "图瓦卢"],
    ["U.S. Outlying Islands", "美国本土外小岛屿"],
    ["U.S. Virgin Islands", "美属维尔京群岛"],
    ["Uganda", "乌干达"],
    ["Ukraine", "乌克兰"],
    ["United Kingdom", "英国"],
    ["United States", "美国"],
    ["Uruguay", "乌拉圭"],
    ["Uzbekistan", "乌兹别克斯坦"],
    ["Vanuatu", "瓦努阿图"],
    ["Vatican City", "梵蒂冈"],
    ["Venezuela", "委内瑞拉"],
    ["Vietnam", "越南"],
    ["Wallis & Futuna", "瓦利斯和富图纳"],
    ["Western Sahara", "西撒哈拉"],
    ["Yemen", "也门"],
    ["Zambia", "赞比亚"],
    ["Zimbabwe", "津巴布韦"],
    ["Current TrustScore", "当前 TrustScore"],
    ["Distribution of stars", "星级分布"],
    ["Invitations delivered", "已送达邀请"],
    ["Number of reviews", "评论数量"],
    ["About", "关于企业"],
    ["Address", "地址"],
    ["City", "城市"],
    ["Country", "国家/地区"],
    ["Desktop", "桌面端"],
    ["Mobile", "移动端"],
    ["insights give you easy ways to identify where to improve your business", "洞察可帮助你轻松发现企业需要改进的方面"],
    ["All locations", "全部地点"],
    ["brand assets you can download to get your social proof stronger than ever", "品牌素材可供下载，让客户口碑更有说服力"],
    ["Click on", "点击"],
    ["Danish", "丹麦语"],
    ["Dutch", "荷兰语"],
    ["English", "英语"],
    ["Finnish", "芬兰语"],
    ["French", "法语"],
    ["German", "德语"],
    ["Get code", "获取代码"],
    ["Italian", "意大利语"],
    ["Japanese", "日语"],
    ["Language", "语言"],
    ["Norwegian", "挪威语"],
    ["plan, so you'll need to upgrade your account to access it.", "套餐，升级账户后即可使用。"],
    ["Polish", "波兰语"],
    ["Portuguese", "葡萄牙语"],
    ["Portuguese (Brazil)", "葡萄牙语（巴西）"],
    ["review invitations per month for an instant boost to your online reputation", "封评论邀请/月，快速提升线上口碑"],
    ["Spanish", "西班牙语"],
    ["Swedish", "瑞典语"],
    ["This feature is part of the enhanced", "此功能属于增强版"],
    ["Segment logo", "Segment 标志"],
    ["Zapier logo", "Zapier 标志"],
    ["Beta", "测试版"],
    ["Queued", "排队中"],
    ["Service & Product Review", "服务与商品评论"],
    ["Service Review", "服务评论"],
    ["Type", "类型"],
    ["For non-purchase experiences", "适用于非购买体验"],
    ["Mandarin Chinese", "中文（普通话）"],
    ["Russian", "俄语"],
    ["Recommended", "推荐"],
    ["Name", "发件人名称"],
    ["Explore plans", "查看套餐"],
    ["Buy now", "立即购买"],
    ["Empower local teams to own their trust signals.", "让本地团队管理自己的信任标识。"],
    ["Every review automatically lands on the exact branch profile it belongs to. No manual tagging, sorting, or extra support tickets required.", "每条评论都会自动归入对应的分店主页，无需手动标记、排序或额外提交支持工单。"],
    ["Get recommended in local AI searches.", "在本地 AI 搜索中获得推荐。"],
    ["Give branch managers dedicated feedback so they can actively manage, improve, and take pride in their local reputation.", "为分店经理提供专属反馈，帮助他们主动管理和改善本地口碑，并以此为荣。"],
    ["Give every location its own trusted profile, empower local teams with location-level insights, and get each of your locations recommended in local AI searches.", "为每个地点建立可信的专属主页，向本地团队提供地点层面的洞察，并让各地点在本地 AI 搜索中获得推荐。"],
    ["Level up with location-specific insights.", "通过地点专属洞察提升表现。"],
    ["Location Reviews", "地点评价"],
    ["Organise reviews by location automatically.", "按地点自动归类评论。"],
    ["Power LLMs and search engines with relevant, location-specific reviews so nearby customers find and choose your branches.", "向 LLM 和搜索引擎提供相关的地点评论，让附近客户找到并选择你的分店。"],
    ["Spot local trends and benchmark branch performance so you can fix operational issues and double down on successful strategies at the branch level.", "发现本地趋势并对比分店表现，及时解决运营问题，将成功策略推广到更多分店。"],
    ["Upgrade to build local trust that converts", "升级，以本地信任促进转化"],
    ["Add a domain", "添加域名"],
    ["Billing cycle", "计费周期"],
    ["Edit", "编辑"],
    ["Category", "类别"],
    ["Uncategorized", "未分类"],
    ["Advertising or promotional", "广告或推广内容"],
    ["Harmful or illegal", "有害或违法内容"],
    ["Personal information", "个人信息"],
    ["Why are you flagging this review?", "你为什么要举报这条评论？"],
    ["Brand", "品牌"],
    ["Export in CSV", "导出 CSV"],
    ["Image", "图片"],
    ["Import products", "导入商品"],
    ["Page 1", "第 1 页"],
    ["Product name", "商品名称"],
    ["Products", "商品"],
    ["Search categories", "搜索分类"],
    ["Currency", "货币"],
    ["Price", "价格"],
    ["Product Reviews", "商品评论"],
    ["Add to plan", "添加到套餐"],
    ["Carousel screenshot", "Carousel 预览截图"],
    ["Create a widget to showcase highlights of your best reviews or your greatest Trustpilot achievements.", "创建组件，展示优质评论精选或企业在 Trustpilot 上取得的成绩。"],
    ["Display customer quotes and reviews front and center.", "突出展示客户评价和评论。"],
    ["Drop-Down screenshot", "Drop-Down 预览截图"],
    ["Flex screenshot", "Flex 预览截图"],
    ["Get the must-have widgets and share what customers are saying about your business.", "使用必备组件，分享客户对企业的评价。"],
    ["Grid screenshot", "Grid 预览截图"],
    ["Horizontal screenshot", "Horizontal 预览截图"],
    ["List Filtered screenshot", "List Filtered 预览截图"],
    ["List screenshot", "List 预览截图"],
    ["Micro Button screenshot", "Micro Button 预览截图"],
    ["Micro Combo screenshot", "Micro Combo 预览截图"],
    ["Micro Review Count screenshot", "Micro Review Count 预览截图"],
    ["Micro Star screenshot", "Micro Star 预览截图"],
    ["Micro TrustScore screenshot", "Micro TrustScore 预览截图"],
    ["Mini Carousel screenshot", "Mini Carousel 预览截图"],
    ["Mini screenshot", "Mini 预览截图"],
    ["Not showing number of reviews", "不显示评论数量"],
    ["Not showing TrustScore", "不显示 TrustScore"],
    ["Only included with your plan", "仅显示套餐内组件"],
    ["Pop-Up screenshot", "Pop-Up 预览截图"],
    ["Popular", "热门"],
    ["Product Mini MultiSource screenshot", "Product Mini MultiSource 预览截图"],
    ["Product Mini screenshot", "Product Mini 预览截图"],
    ["Product Q&A screenshot", "Product Q&A 预览截图"],
    ["Product Reviews Carousel screenshot", "Product Reviews Carousel 预览截图"],
    ["Product Reviews Gallery screenshot", "Product Reviews Gallery 预览截图"],
    ["Product Reviews MultiSource screenshot", "Product Reviews MultiSource 预览截图"],
    ["Product Reviews MultiSource SEO screenshot", "Product Reviews MultiSource SEO 预览截图"],
    ["Product Reviews screenshot", "Product Reviews 预览截图"],
    ["Product Reviews SEO screenshot", "Product Reviews SEO 预览截图"],
    ["Quote screenshot", "Quote 预览截图"],
    ["Review Collector screenshot", "Review Collector 预览截图"],
    ["Showcase customer reviews, photos, and videos directly on your product pages.", "在商品页直接展示客户评论、照片和视频。"],
    ["Showing number of reviews", "显示评论数量"],
    ["Showing TrustScore", "显示 TrustScore"],
    ["Slider screenshot", "Slider 预览截图"],
    ["Starter screenshot", "Starter 预览截图"],
    ["Want more reviews? Ask your customers for feedback right on your website.", "想获得更多评论？直接在网站上邀请客户反馈。"],
    ["We couldn't find widgets that matched your filters—please try again.", "没有找到符合筛选条件的组件，请重新筛选。"],
    ["Kundeanmeldelser fra Trustpilot", "由 Trustpilot 提供的客户评论"],
    ["Always", "始终显示"],
    ["Customer reviews powered by Trustpilot", "由 Trustpilot 提供的客户评论"],
    ["Dark", "深色"],
    ["Displays your current review count, or you can hide the number until you're ready to show it.", "显示当前评论数；也可先隐藏数量，准备好后再展示。"],
    ["Get the Plus plan to use this widget.", "使用此组件需要 Plus 套餐。"],
    ["Light", "浅色"],
    ["Show the number of reviews", "显示评论数量"],
    ["Size", "尺寸"],
    ["Supported sizes", "支持的尺寸"],
    ["Theme", "主题"],
    ["To ensure your widget is legible, enter your site's background color.", "为确保组件清晰可读，请输入网站背景色。"],
    ["When I reach 10 reviews", "达到 10 条评论时"],
    ["When I reach 20 reviews", "达到 20 条评论时"],
    ["When I reach 50 reviews", "达到 50 条评论时"],
    ["Widget language", "组件语言"],
    ["Add this code to the head section of your website's HTML.", "将此代码添加到网站 HTML 的头部。"],
    ["Add this code to the HTML of your website where you're displaying your TrustBox.", "将此代码添加到网站 HTML 中需要显示 TrustBox 的位置。"],
    ["Share instructions", "分享说明"],
    ["Appearance", "外观"],
    ["Background", "背景"],
    ["Border", "边框"],
    ["Category icon", "分类图标"],
    ["Category name", "分类名称"],
    ["Content", "内容"],
    ["Customize your widget to showcase either your TrustScore achievements or highlights from your top reviews.", "自定义组件，展示 TrustScore 成绩或优质评论精选。"],
    ["Desktop min. width 427px | height 239px", "桌面端最小宽度 427px｜高度 239px"],
    ["Drop shadow", "阴影"],
    ["External elements", "外部元素"],
    ["Glass", "磨砂玻璃"],
    ["Grey outline", "灰色描边"],
    ["Highlights", "评论精选"],
    ["Mobile min. width 360px | height 222px", "手机端最小宽度 360px｜高度 222px"],
    ["No border", "无边框"],
    ["None", "无"],
    ["Review explainer", "评论说明"],
    ["Review number", "评论数量"],
    ["Supporting text", "辅助文字"],
    ["Text color", "文字颜色"],
    ["Theme color", "主题颜色"],
    ["TrustScore star rating", "TrustScore 星级评分"],
    ["TrustScore word rating", "TrustScore 文字评级"],
    ["Upgrade to Enterprise to unlock this widget.", "升级至 Enterprise 即可使用此组件。"]
  ]);

  const COMMON_RULES = [
    {"source":"{n} Notifications","target":"{n} 条通知"},
    {"source":"You've unlocked a {n}-day free Plus trial.","target":"你已解锁 {n} 天 Plus 免费试用。"},
    {"source":"{n} minutes ago","target":"{n} 分钟前"},
    {"source":"{n} month ago","target":"{n} 个月前"},
    {"source":"Catalog clean-up on {date}","target":"商品目录将于 {date} 清理"},
    {"source":"Read notification: Catalog clean-up on {date}. We will delete products and variants that had no reviews or updates in the past {n} years. Export your catalog now to preserve your data.. Received {date}","target":"已读通知：商品目录将于 {date} 清理。我们将删除过去 {n} 年没有评论或更新的商品及变体。请立即导出目录以保留数据。收到时间：{date}"},
    {"source":"Read notification: Confirm your business registration address. Adding your registration address helps us bring you the best experience on Trustpilot.. Received {date}","target":"已读通知：确认企业注册地址。添加注册地址，帮助我们为你提供更好的 Trustpilot 使用体验。收到时间：{date}"},
    {"source":"Unread notification: You've hit your monthly invitation limit. Upgrade your plan today to invite more customers and get deeper insights.. Received {date}","target":"未读通知：你已达到本月邀请上限。立即升级套餐，邀请更多客户并获得更深入的洞察。收到时间：{date}"},
    {"source":"We will delete products and variants that had no reviews or updates in the past {n} years. Export your catalog now to preserve your data.","target":"我们将删除过去 {n} 年没有评论或更新的商品及变体。请立即导出目录以保留数据。"},
    {"source":"Read notification: You've hit your monthly invitation limit. Upgrade your plan today to invite more customers and get deeper insights.. Received {date}","target":"已读通知：你已达到本月邀请上限。立即升级套餐，邀请更多客户并获得更深入的洞察。收到时间：{date}"},
    {"source":"{n} minute ago","target":"{n} 分钟前"},
    {"source":"Strictly necessary cookies, {n} of {n}","target":"严格必要的 Cookie（第 {n}/{n} 项）"},
    {"source":"Performance cookies, {n} of {n}","target":"性能 Cookie（第 {n}/{n} 项）"},
    {"source":"Functionality cookies, {n} of {n}","target":"功能 Cookie（第 {n}/{n} 项）"},
    {"source":"Marketing cookies, {n} of {n}","target":"营销 Cookie（第 {n}/{n} 项）"},
    {"source":"Page {n}","target":"第 {n} 页"},
    {"source":"Get a new code ({n})","target":"重新获取验证码（{n}）"},
    {"source":"Created in the last {n} days","target":"最近 {n} 天内创建"},
    {"source":"{n} out of {n} stars","target":"{n} / {n} 星"},
    {"source":"Average star rating {n} out of {n} stars","target":"平均星级评分 {n} / {n} 星"},
    {"source":"{n} domain found","target":"共找到 {n} 个域名"},
    {"source":"{n} domains found","target":"共找到 {n} 个域名"},
    {"source":"{url} is your current domain","target":"{url} 是你当前的域名"},
    {"source":"Primary contact, {user} ({email})","target":"主要联系人：{user}（{email}）"},
    {"source":"Image for {user}","target":"{user} 的图片"},
    {"source":"Read notification: New: Control email open tracking. You can now choose whether Trustpilot records when recipients open your review invitation emails. Select this notification to review your settings in Consumer privacy.. Received {date}","target":"已读通知：新功能：控制邮件打开追踪。你现在可以选择是否允许 Trustpilot 记录收件人何时打开评论邀请邮件。点击此通知即可前往“消费者隐私”检查设置。收到时间：{date}"},
    {"source":"Unread notification: New: Control email open tracking. You can now choose whether Trustpilot records when recipients open your review invitation emails. Select this notification to review your settings in Consumer privacy.. Received {date}","target":"未读通知：新功能：控制邮件打开追踪。你现在可以选择是否允许 Trustpilot 记录收件人何时打开评论邀请邮件。点击此通知即可前往“消费者隐私”检查设置。收到时间：{date}"},
    {"source":"You are getting reviews through {user}","target":"你正在通过 {user} 收集评论"},
    {"source":"Source: {user}","target":"来源：{user}"}
  ];

  const SCOPES = [
    // G01 | shared-navigation | ^\/
    {
      id: "G01",
      slug: "shared-navigation",
      path: new RegExp("^\\/"),
      exact: new Map(),
      rules: [],
      overrides: new Map(),
      fragments: [
    {"tag":"span","source":"Manage reviews({n})","atoms":[["Manage reviews","管理评论"],["({n})","({n})"]],"guard":"#sidebar"},
    {"tag":"p","source":"This feature is part of the enhanced {user} plan, so you'll need to upgrade your account to access it.","atoms":[["This feature is part of the enhanced","此功能属于增强版"],["{user}","{user}"],["plan, so you'll need to upgrade your account to access it.","套餐，升级账户后即可使用。"]]},
    {"tag":"span","source":"This feature is part of the enhanced {user} plan, so you'll need to upgrade your account to access it.","atoms":[["This feature is part of the enhanced","此功能属于增强版"],["{user}","{user}"],["plan, so you'll need to upgrade your account to access it.","套餐，升级账户后即可使用。"]]},
    {"tag":"p","source":"This feature is part of the {user} add-on module. You can unlock it by upgrading your plan.","atoms":[["This feature is part of the","此功能属于"],["{user}","{user}"],["add-on module. You can unlock it by upgrading your plan.","附加模块。升级套餐即可解锁。"]]},
    {"tag":"span","source":"This feature is part of the {user} add-on module. You can unlock it by upgrading your plan.","atoms":[["This feature is part of the","此功能属于"],["{user}","{user}"],["add-on module. You can unlock it by upgrading your plan.","附加模块。升级套餐即可解锁。"]]},
    {"tag":"li","source":"{n} widgets, {n} different ways to showcase your star rating and review count","atoms":[["{n}","{n}"],["widgets, {n} different ways to showcase your star rating and review count"," 个组件，以 {n} 种方式展示星级评分和评论数"]]},
    {"tag":"li","source":"{n} review invitations per month for an instant boost to your online reputation","atoms":[["{n}","{n}"],["review invitations per month for an instant boost to your online reputation"," 封评论邀请/月，快速提升线上口碑"]]},
    {"tag":"li","source":"Trustpilot brand assets you can download to get your social proof stronger than ever","atoms":[["Trustpilot","Trustpilot"],["brand assets you can download to get your social proof stronger than ever"," 品牌素材可供下载，让客户口碑更有说服力"]]},
    {"tag":"li","source":"TrustScore insights give you easy ways to identify where to improve your business","atoms":[["TrustScore","TrustScore"],["insights give you easy ways to identify where to improve your business"," 洞察可帮助你轻松发现企业需要改进的方面"]]},
    {"tag":"li","source":"{n} website widgets let you showcase your best reviews to convert more customers","atoms":[["{n}","{n}"],["website widgets let you showcase your best reviews to convert more customers"," 个网站组件，展示优质评论以转化更多客户"]]},
    {"tag":"li","source":"{n} review invitations per month to get more customer feedback","atoms":[["{n}","{n}"],["review invitations per month to get more customer feedback"," 封评论邀请/月，获取更多客户反馈"]]},
    {"tag":"li","source":"APIs to build a custom integration with your business: customize how your reviews look on your site and in marketing assets, trigger review invitations directly from your CRM, generate invitation links, and more","atoms":[["APIs","API"],["to build a custom integration with your business: customize how your reviews look on your site and in marketing assets, trigger review invitations directly from your CRM, generate invitation links, and more","，用于为企业构建自定义集成：自定义网站和营销素材中的评论展示方式，直接从 CRM 触发评论邀请，生成邀请链接等"]]},
    {"tag":"p","source":"{n} review invitations","atoms":[["{n}","{n}"],["review invitations"," 封评论邀请"]]},
    {"tag":"p","source":"{n} website widgets","atoms":[["{n}","{n}"],["website widgets"," 个网站组件"]]},
    {"tag":"p","source":"Your current plan: {user}","atoms":[["Your current plan:","当前套餐："],["{user}","{user}"]]},
    {"tag":"label","source":"Reviews with a reply","atoms":[["Reviews","有回复的评论"],["with a reply",""]]},
    {"tag":"label","source":"Reviews without a reply","atoms":[["Reviews","无回复的评论"],["without a reply",""]]},
    {"tag":"label","source":"Reviewers contacted","atoms":[["Reviewers","已联系的评论者"],["contacted",""]]},
    {"tag":"label","source":"Reviewers replied","atoms":[["Reviewers","已回复的评论者"],["replied",""]]},
    {"tag":"p","source":"Send requests to past customers in one go!","atoms":[["Send requests to past customers in","一次性向过往客户"],["one","批量"],["go!","发送邀请！"]]},
    {"tag":"p","source":"Need more help? Check out our support article.","atoms":[["Need more help? Check out our","需要更多帮助？请查看我们的"],["support article","支持文章"],[".","。"]]},
    {"tag":"p","source":"If you're on a free plan, you can't use Trustpilot branding assets. Find out why in our Help Center.","atoms":[["If you're on a free plan, you can't use Trustpilot branding assets. Find out why in our","免费套餐无法使用 Trustpilot 品牌素材。了解原因，请查看我们的"],["Help Center","帮助中心"],[".","。"]]}
  ]
    },
    // F07 | data-consent | ^\/account\/permissions\/?$
    {
      id: "F07",
      slug: "data-consent",
      path: new RegExp("^\\/account\\/permissions\\/?$"),
      exact: new Map([
    ["Account Management", "账户管理"],
    ["Cookie permissions", "Cookie 权限"],
    ["Enable all", "全部启用"],
    ["Enable this setting to give Trustpilot permission to help set up your business account or provide other support on your behalf, for example, editing company details. Permission is only granted for domains you've selected. To withdraw your permission, disable the setting.", "启用此设置后，即授权 Trustpilot 代你设置商家账户或提供其他支持，例如编辑企业资料。授权仅适用于你选择的域名。关闭此设置即可撤回授权。"],
    ["If you have any questions about data security or protection, please reach out to Trustpilot's Privacy Team at", "如有任何数据安全或保护方面的问题，请联系 Trustpilot 隐私团队："],
    ["Partnership permissions", "合作伙伴权限"],
    ["This permission allows you to use Trustpilot approved integrations with our partners. The panel below shows the partner integrations you have enabled during the installation of the partner integration. If you no longer wish to share your review data with any of these companies, you can remove their access using the control panel.", "此权限允许你使用 Trustpilot 批准的合作伙伴集成。下方面板列出你在安装时启用的合作伙伴集成。如果不再希望与其中任何企业共享评论数据，可以通过控制面板移除其访问权限。"],
    ["We take privacy seriously", "我们重视隐私"],
    ["You accept that Trustpilot will place cookies on your webshop to invite your customers to write reviews and to verify them. Remember to obtain consent from your users and, if required by applicable laws, update your privacy policy to state that you're using third-party cookies from Trustpilot.", "你同意 Trustpilot 在网店中放置 Cookie，用于邀请客户撰写评论并进行验证。请记得征求用户同意；如适用法律要求，还需更新隐私政策，说明你正在使用 Trustpilot 的第三方 Cookie。"]
  ]),
      rules: [],
      overrides: new Map(),
      fragments: [
    {"tag":"p","source":"If you have any questions about data security or protection, please reach out to Trustpilot's Privacy Team at {email}.","atoms":[["If you have any questions about data security or protection, please reach out to Trustpilot's Privacy Team at","如对数据安全或隐私保护有任何疑问，请联系 Trustpilot 隐私团队："],["{email}","{email}"],[".","。"]]}
  ]
    },
    // F13 | my-details | ^\/account\/settings\/?$
    {
      id: "F13",
      slug: "my-details",
      path: new RegExp("^\\/account\\/settings\\/?$"),
      exact: new Map([
    ["Basic info", "基本资料"],
    ["Belarus", "白俄罗斯"],
    ["Change email", "更改邮箱"],
    ["Change password", "更改密码"],
    ["Country*", "国家/地区*"],
    ["Cuba", "古巴"],
    ["Dansk", "丹麦语"],
    ["Delete my account", "删除我的账户"],
    ["Deutsch", "德语"],
    ["English (United Kingdom)", "英语（英国）"],
    ["Español", "西班牙语"],
    ["Français", "法语"],
    ["Iran", "伊朗"],
    ["Italiano", "意大利语"],
    ["Language*", "语言*"],
    ["Log out everywhere", "退出所有设备"],
    ["Name*", "姓名*"],
    ["Nederlands", "荷兰语"],
    ["North Korea", "朝鲜"],
    ["Password", "密码"],
    ["Russia", "俄罗斯"],
    ["Security settings", "安全设置"],
    ["Signs you out of all devices and revokes all access tokens in one click — including any third-party apps you're signed into. If your account was used to configure API integrations, you'll need to regenerate those tokens to restore them.", "一键退出所有设备并撤销全部访问令牌，包括你已登录的第三方应用。如果曾用此账户配置 API 集成，需要重新生成相应令牌才能恢复集成。"],
    ["Svenska", "瑞典语"],
    ["Syria", "叙利亚"],
    ["User ID", "用户 ID"],
    ["We won't change this email until we've received your confirmation.", "收到你的确认后，我们才会更改此邮箱。"],
    ["You'll lose access to Trustpilot Business, meaning you'll no longer be able to manage your profile or interact with reviewers. You'll also no longer receive notifications from us.", "你将无法再访问 Trustpilot Business、管理企业主页或与评论者互动，也不会再收到我们的通知。"],
    ["Enter password", "输入密码"],
    ["Please make sure that you have a password set on your user account before beginning to enable Multi Factor Authentication. You can set a password from the 'change password' setting, if you do not have one set already. If you have a password set already, enter your password here to start MFA enablement.", "在启用多因素身份验证（MFA）前，请确保你的用户账户已设置密码。如果尚未设置，请先在“更改密码”中设置密码；如果已设置，请在此输入密码以开始启用 MFA。"],
    ["Current Password", "当前密码"],
    ["Verify it's you", "验证你的身份"],
    ["Enter the 6-digit code", "输入 6 位验证码"],
    ["Get a new code", "重新获取验证码"]
  ]),
      rules: [
    {"source":"{n}-step verification","target":"{n} 步验证"},
    {"source":"Add {n}-step verification","target":"添加 {n} 步验证"},
    {"source":"Protect your account by adding an extra layer of security. Once added, you'll be asked to enter a {n}-digit verification code from your authenticator app when logging in to Trustpilot.","target":"为账户添加额外安全保护。启用后，登录 Trustpilot 时需要输入身份验证器中的 {n} 位验证码。"},
    {"source":"Please enter the 6-digit verification code we just sent to {email} to make sure it's you.","target":"请输入我们刚刚发送到 {email} 的 6 位验证码，以确认是你本人操作。"}
  ],
      overrides: new Map(),
      fragments: []
    },
    // F06 | user-management | ^\/account\/usermanagement\/?$
    {
      id: "F06",
      slug: "user-management",
      path: new RegExp("^\\/account\\/usermanagement\\/?$"),
      exact: new Map([
    ["Assign roles to your teammates and control what areas of your Trustpilot Business account they can access.", "为团队成员分配角色，控制他们可访问的 Trustpilot Business 账户区域。"],
    ["Manage roles and permissions for your team members", "管理团队成员的角色和权限"],
    ["User management", "用户管理"],
    ["User roles illustration", "用户角色示意图"]
  ]),
      rules: [],
      overrides: new Map(),
      fragments: []
    },
    // A04 | invitation-analytics | ^\/analytics\/explore\/invitations\/?$
    {
      id: "A04",
      slug: "invitation-analytics",
      path: new RegExp("^\\/analytics\\/explore\\/invitations\\/?$"),
      exact: new Map([
    ["Invitations - image", "邀请功能示意图"],
    ["See what drives conversion of invites to reviews with trend data and template comparison analytics.", "通过趋势数据和模板对比分析，了解影响邀请转为评论的因素。"],
    ["Upgrade to understand how to convert invites to reviews", "升级，了解如何将邀请转化为评论"]
  ]),
      rules: [],
      overrides: new Map(),
      fragments: []
    },
    // A03 | service-review-analytics | ^\/analytics\/explore\/service-reviews\/?$
    {
      id: "A03",
      slug: "service-review-analytics",
      path: new RegExp("^\\/analytics\\/explore\\/service-reviews\\/?$"),
      exact: new Map([
    ["From review scores to reply rates, upgrade to access performance data that can help you grow your reputation and boost your conversions.", "升级后查看评论评分、回复率等表现数据，改善企业口碑并提升转化率。"],
    ["Service reviews - image", "服务评论示意图"],
    ["Upgrade to unleash the full potential of customer feedback analysis", "升级，全面分析客户反馈"]
  ]),
      rules: [],
      overrides: new Map(),
      fragments: []
    },
    // A01 | analytics-overview | ^\/analytics\/overview\/?$
    {
      id: "A01",
      slug: "analytics-overview",
      path: new RegExp("^\\/analytics\\/overview\\/?$"),
      exact: new Map([
    ["1 star reviews", "1 星评论"],
    ["2 star reviews", "2 星评论"],
    ["3 star reviews", "3 星评论"],
    ["4 star reviews", "4 星评论"],
    ["5 star reviews", "5 星评论"],
    ["Basic invitation", "基础邀请"],
    ["How to improve your public reply behavior", "如何改善公开回复表现"],
    ["Performance - Overview", "表现 — 概览"],
    ["Reply rate (public)", "公开回复率"],
    ["Reviews collected", "已收集评论"],
    ["See reply details", "查看回复详情"],
    ["Source of reviews", "评论来源"],
    ["Time to reply (public)", "公开回复用时"]
  ]),
      rules: [
    {"source":"Your performance in the last {n} days","target":"最近 {n} 天的表现"},
    {"source":"{n} star reviews","target":"{n} 星评论"},
    {"source":"Hasn't replied to a negative review in the last {n} months.","target":"过去 {n} 个月未回复负面评论。"},
    {"source":"How you've replied to negative reviews in the past {n} months","target":"过去 {n} 个月对负面评论的回复情况"},
    {"source":"The faster you reply to {n}- and {n}-star reviews, the more your time to reply decreases.","target":"越快回复 {n} 星和 {n} 星评论，平均回复用时就越短。"},
    {"source":"The more {n}- and {n}-star reviews you reply to, the more your reply-rate increases.","target":"回复的 {n} 星和 {n} 星评论越多，回复率就越高。"}
  ],
      overrides: new Map(),
      fragments: []
    },
    // A02 | trustscore-insights | ^\/analytics\/trustscoreinsights\/?$
    {
      id: "A02",
      slug: "trustscore-insights",
      path: new RegExp("^\\/analytics\\/trustscoreinsights\\/?$"),
      exact: new Map([
    ["See the review trends driving your TrustScore and take a look at where your score might be headed.", "了解影响 TrustScore 的评论趋势，并查看评分的可能走向。"],
    ["TrustScore insights - image", "TrustScore 洞察示意图"],
    ["Upgrade to understand what drives your TrustScore", "升级，了解影响 TrustScore 的因素"]
  ]),
      rules: [],
      overrides: new Map(),
      fragments: []
    },
    // C08 | applications | ^\/applications\/?$
    {
      id: "C08",
      slug: "applications",
      path: new RegExp("^\\/applications\\/?$"),
      exact: new Map([
    ["Applications feature illustration", "应用功能示意图"],
    ["Fully customize your Trustpilot solution", "全面自定义 Trustpilot 方案"],
    ["With our APIs, you can customize how your Trustpilot reviews look on your site and create a review collection solution that is uniquely adapted to your needs.", "使用 API，自定义网站上的 Trustpilot 评论展示方式，并构建符合自身需求的评论收集方案。"]
  ]),
      rules: [],
      overrides: new Map(),
      fragments: []
    },
    // F08 | profile-settings | ^\/company-settings\/?$
    {
      id: "F08",
      slug: "profile-settings",
      path: new RegExp("^\\/company-settings\\/?$"),
      exact: new Map([
    ["About your business", "关于你的企业"],
    ["Add a primary category", "添加主分类"],
    ["Add or manage categories", "添加或管理分类"],
    ["Add your logo, company name, and domain to your Trustpilot profile.", "在 Trustpilot 企业主页添加标志、企业名称和域名。"],
    ["Additional categories", "其他分类"],
    ["Bank account", "银行账户"],
    ["Bank account is registered upon purchase of a subscription", "购买订阅时登记银行账户"],
    ["Boost your SEO", "提升 SEO 表现"],
    ["Business information", "企业信息"],
    ["Categories help you rank higher on Google and Trustpilot search results. They also give valuable insight into how you're performing against your competitors.", "分类有助于提升你在 Google 和 Trustpilot 搜索结果中的排名，也能帮助你了解与竞争对手相比的表现。"],
    ["Choose categories that describe your industry, products, or services to help customers find you on Trustpilot.", "选择符合企业行业、商品或服务的分类，帮助客户在 Trustpilot 上找到你。"],
    ["Claimed profile", "已认领的企业主页"],
    ["Company description", "企业介绍"],
    ["Company domain", "企业域名"],
    ["Company logo", "企业徽标"],
    ["Company name", "企业名称"],
    ["Confirm additional details about your business and let customers know that you're fully transparent. Any details you confirm are shown as check marks on your profile.", "确认更多企业资料，向客户展示你的透明度。已确认的资料会在企业主页上显示勾选标记。"],
    ["Confirm company details", "确认企业资料"],
    ["Contact details", "联系方式"],
    ["Contact info", "联系资料"],
    ["Content preview", "内容预览"],
    ["Describe your company", "介绍你的企业"],
    ["Discovery bar", "发现栏"],
    ["Google My Business account verified and synced", "Google My Business 账户已验证并同步"],
    ["Logo", "标志"],
    ["Phone number", "电话号码"],
    ["Postcode/ZIP code", "邮政编码"],
    ["Primary category", "主分类"],
    ["Proof of identity", "身份证明"],
    ["Proof of identity is provided by a user associated with this account", "此账户关联用户已提供身份证明"],
    ["RECOMMENDED", "推荐"],
    ["Save and publish", "保存并发布"],
    ["Show all Plus features", "展开全部 Plus 功能"],
    ["Sync with Google My Business", "与 Google My Business 同步"],
    ["Tell your customers how to get in touch.", "告诉客户如何联系你。"],
    ["Tell your customers what makes you unique.", "向客户介绍企业的独特之处。"],
    ["The area on your profile where visitors can discover promotions, guarantees and similar companies.", "企业主页上的区域，供访客查看优惠、保障及类似企业。"],
    ["The details you provide are publicly shown on your Trustpilot profile.", "你提供的资料会公开显示在 Trustpilot 企业主页上。"],
    ["Trustpilot profile preview", "Trustpilot 企业主页预览"],
    ["Update the screenshot", "更新截图"],
    ["Upload logo", "上传标志"],
    ["Visit website", "访问网站"],
    ["We recommend a JPG or PNG, 400px x 300px with a max file size of 1MB.", "建议使用 JPG 或 PNG，尺寸为 400px x 300px，文件不超过 1MB。"],
    ["Write a review", "撰写评论"],
    ["Written by the company", "由企业撰写"],
    ["of your homepage.", "主页截图。"]
  ]),
      rules: [
    {"source":"{n} reviews","target":"{n} 条评论"},
    {"source":"{n}-star","target":"{n} 星"},
    {"source":"Reviews {n}","target":"评论 {n}"},
    {"source":"We recommend writing at least {n} words about your company. Your description can include text. You can also customize your description with HTML if your plan allows this. If you're adding images, keep the width under 312px and the file size under 5MB for the best quality.","target":"建议至少用 {n} 个词介绍企业。介绍可包含文本；套餐支持时，也可使用 HTML 自定义。添加图片时，建议宽度小于 312px、文件小于 5MB，以获得最佳效果。"},
    {"source":"Word count: {n}","target":"词数：{n}"}
  ],
      overrides: new Map(),
      fragments: [
    {"tag":"p","source":"We recommend a JPG or PNG, 400px x 300px with a max file size of 1MB. Update the screenshot of your homepage.","atoms":[["We recommend a JPG or PNG, 400px x 300px with a max file size of 1MB.","建议使用 JPG 或 PNG，尺寸为 400px × 300px，文件不超过 1MB。"],["Update the screenshot","更新"],["of your homepage.","主页截图。"]]},
    {"tag":"h4","source":"About {user}","atoms":[["About","关于"],["{user}","{user}"]]},
    {"tag":"h3","source":"Confirm company details RECOMMENDED","atoms":[["Confirm company details","确认企业信息"],["RECOMMENDED","推荐"]]},
    {"tag":"h3","source":"Categories RECOMMENDED","atoms":[["Categories","分类"],["RECOMMENDED","推荐"]]}
  ]
    },
    // D01 | dashboard | ^\/dashboard\/?$
    {
      id: "D01",
      slug: "dashboard",
      path: new RegExp("^\\/dashboard\\/?$"),
      exact: new Map([
    ["Keeping your reviews fresh can boost SEO and lets customers know you're open to regular feedback.", "持续收集最新评论有助于提升 SEO，也能让客户知道你欢迎经常提供反馈。"],
    ["Looks like your TrustScore is about to decrease", "你的 TrustScore 似乎即将下降"],
    ["New service reviews", "新的服务评论"],
    ["See what you can do to help save your stars.", "了解如何挽回星级评分。"],
    ["See your forecast", "查看预测"],
    ["You haven't received any product reviews recently", "你最近没有收到商品评论"]
  ]),
      rules: [
    {"source":"Based on {n} reviews","target":"基于 {n} 条评论"},
    {"source":"Here's the latest overview for {user}","target":"{user} 的最新概览"},
    {"source":"You've replied to all {n}, {n}, and {n}-star reviews","target":"你已回复全部 {n}、{n} 和 {n} 星评论"}
  ],
      overrides: new Map(),
      fragments: [
    {"tag":"h2","source":"Performance summary","atoms":[["Performance","表现"],["summary","概览"]],"guard":"#start-trial-heading"}
  ]
    },
    // E02 | email-newsletter | ^\/email-widgets\/newsletter\/?$
    {
      id: "E02",
      slug: "email-newsletter",
      path: new RegExp("^\\/email-widgets\\/newsletter\\/?$"),
      exact: new Map([
    [", paste it in the email template's HTML editor, and save your changes. We recommend sending yourself a test newsletter before sending it to your customers.", "，粘贴到邮件模板的 HTML 编辑器并保存更改。建议先给自己发送测试邮件，再发给客户。"],
    ["Color theme", "配色主题"],
    ["Design and layout", "设计与布局"],
    ["Draw attention to your TrustScore with every outgoing newsletter. The TrustBox is optimized specifically for email marketing and newsletters, and it's dynamic, so it will always be based on your current TrustScore.", "在每封营销邮件中突出展示 TrustScore。此 TrustBox 专为邮件营销和电子报优化，可动态更新，始终反映当前的 TrustScore。"],
    ["Learn more.", "了解更多。"],
    ["Show all Plus features", "展开全部 Plus 功能"]
  ]),
      rules: [
    {"source":"widgets, {n} different ways to showcase your star rating and review count","target":"个小部件，以 {n} 种方式展示星级评分和评论数"}
  ],
      overrides: new Map(),
      fragments: [
    {"tag":"p","source":"Click on Get code, paste it in the email template's HTML editor, and save your changes. We recommend sending yourself a test newsletter before sending it to your customers. Learn more.","atoms":[["Click on","点击"],["Get code","获取代码"],[", paste it in the email template's HTML editor, and save your changes. We recommend sending yourself a test newsletter before sending it to your customers.","，粘贴到邮件模板的 HTML 编辑器并保存更改。建议先给自己发送测试邮件，再发给客户。"],["Learn more.","了解更多。"]]}
  ]
    },
    // E01 | email-signature | ^\/email-widgets\/signature\/?$
    {
      id: "E01",
      slug: "email-signature",
      path: new RegExp("^\\/email-widgets\\/signature\\/?$"),
      exact: new Map([
    ["and paste it into your signature and save it as a new HTML signature, or alternatively, you can copy the code and add it to your signature's HTML.", "，将其粘贴到签名中并另存为 HTML 签名；也可以复制代码，添加到签名的 HTML 中。"],
    ["and paste it into your signature editor or alternatively, copy the code and add it to your signature's HTML.", "，将其粘贴到签名编辑器中；也可以复制代码，添加到签名的 HTML 中。"],
    ["and paste it into your signature editor.", "，然后粘贴到签名编辑器中。"],
    ["and will always be based on your current TrustScore.", "，始终反映当前的 TrustScore。"],
    ["Copy the code and add it to your HTML signature.", "复制代码并将其添加到你的 HTML 签名中。"],
    ["Copy TrustBox", "复制 TrustBox"],
    ["dynamic", "动态更新"],
    ["Email client", "邮件客户端"],
    ["Get the step-by-step instructions.", "查看逐步操作说明。"],
    ["How to add the TrustBox", "如何添加 TrustBox"],
    ["How to add the TrustBox in", "在以下客户端添加 TrustBox："],
    ["Implementation steps vary depending on what email client you use. Select your email client and follow the step-by-step instructions provided.", "添加步骤因邮件客户端而异。请选择客户端，然后按逐步说明操作。"],
    ["in your signature, and promote your positive reputation with every outgoing email. The signature is", "，让每封外发邮件都展示良好口碑。签名会"],
    ["Other", "其他"],
    ["Pick design and layout", "选择设计与布局"],
    ["Put some", "在签名中加入"],
    ["Show all Plus features", "展开全部 Plus 功能"],
    ["trust", "信任标识"],
    ["You have two options. You can click on", "有两种方式。可以点击"]
  ]),
      rules: [
    {"source":"({url} or Office {n})","target":"（{url} 或 Office {n}）"},
    {"source":"widgets, {n} different ways to showcase your star rating and review count","target":"个小部件，以 {n} 种方式展示星级评分和评论数"}
  ],
      overrides: new Map(),
      fragments: [
    {"tag":"p","source":"Put some trust in your signature, and promote your positive reputation with every outgoing email. The signature is dynamic and will always be based on your current TrustScore.","atoms":[["Put some","在你的签名中融入"],["trust","信任背书"],["in your signature, and promote your positive reputation with every outgoing email. The signature is","，让每一封发出的邮件都展现你的良好口碑。该签名是"],["dynamic","动态更新的"],["and will always be based on your current TrustScore.","，始终实时同步你当前的 TrustScore。"]]},
    {"tag":"h2","source":"How to add the TrustBox in {user}","atoms":[["How to add the TrustBox in","如何在以下客户端添加 TrustBox："],["{user}","{user}"]]},
    {"tag":"p","source":"Click on Copy TrustBox and paste it into your signature editor.","atoms":[["Click on","点击"],["Copy TrustBox","复制 TrustBox"],["and paste it into your signature editor.","，然后粘贴到签名编辑器中。"]]},
    {"tag":"p","source":"You have two options. You can click on Copy TrustBox and paste it into your signature editor or alternatively, copy the code and add it to your signature's HTML.","atoms":[["You have two options. You can click on","你有两种方式：可以点击"],["Copy TrustBox","复制 TrustBox"],["and paste it into your signature editor or alternatively, copy the code and add it to your signature's HTML.","并粘贴到签名编辑器中；也可以复制代码并添加到签名的 HTML 中。"]]},
    {"tag":"p","source":"({user}) Click on Copy TrustBox and paste it into your signature editor.","atoms":[["({user})","（{user}）"],["Click on","点击"],["Copy TrustBox","复制 TrustBox"],["and paste it into your signature editor.","，然后粘贴到签名编辑器中。"]]},
    {"tag":"p","source":"You have two options. You can click on Copy TrustBox and paste it into your signature and save it as a new HTML signature, or alternatively, copy the code and add it to your signature's HTML.","atoms":[["You have two options. You can click on","你有两种方式：可以点击"],["Copy TrustBox","复制 TrustBox"],["and paste it into your signature and save it as a new HTML signature, or alternatively, copy the code and add it to your signature's HTML.","并粘贴为新的 HTML 签名保存；也可以复制代码并添加到签名的 HTML 中。"]]}
  ]
    },
    // C05 | integrations-support | ^\/integrations\/customersupport\/?$
    {
      id: "C05",
      slug: "integrations-support",
      path: new RegExp("^\\/integrations\\/customersupport\\/?$"),
      exact: new Map([
    ["Gorgias logo", "Gorgias 标志"],
    ["Slack logo", "Slack 标志"],
    ["Zendesk logo", "Zendesk 标志"]
  ]),
      rules: [],
      overrides: new Map(),
      fragments: []
    },
    // C03 | integrations-developers | ^\/integrations\/developers\/?$
    {
      id: "C03",
      slug: "integrations-developers",
      path: new RegExp("^\\/integrations\\/developers\\/?$"),
      exact: new Map([
    ["Trustpilot API icon", "Trustpilot API 图标"],
    ["Webhooks logo", "Webhook 标志"]
  ]),
      rules: [],
      overrides: new Map(),
      fragments: []
    },
    // C01 | integrations-ecommerce | ^\/integrations\/ecommerce\/?$
    {
      id: "C01",
      slug: "integrations-ecommerce",
      path: new RegExp("^\\/integrations\\/ecommerce\\/?$"),
      exact: new Map([
    ["BigCommerce logo", "BigCommerce 标志"],
    ["JavaScript logo", "JavaScript 标志"],
    ["Magento logo", "Magento 标志"],
    ["Opencart logo", "Opencart 标志"],
    ["Prestashop logo", "Prestashop 标志"],
    ["Shopify logo", "Shopify 标志"],
    ["Shopware logo", "Shopware 标志"],
    ["Wix logo", "Wix 标志"],
    ["Woocommerce logo", "WooCommerce 标志"],
    ["WordPress logo", "WordPress 标志"]
  ]),
      rules: [],
      overrides: new Map(),
      fragments: []
    },
    // C06 | integration-woocommerce | ^\/integrations\/ecommerce\/woocommerce\/?$
    {
      id: "C06",
      slug: "integration-woocommerce",
      path: new RegExp("^\\/integrations\\/ecommerce\\/woocommerce\\/?$"),
      exact: new Map([
    ["Add multiple TrustBox widgets on-site.", "在网站上添加多个 TrustBox 小部件。"],
    ["Add new", "添加新项"],
    ["Admin", "管理后台"],
    ["Click", "点击"],
    ["Go to WordPress >", "在 WordPress 中依次进入 >"],
    ["Install your WooCommerce plugin for WordPress", "安装适用于 WordPress 的 WooCommerce 插件"],
    ["Learn which important issues to consider when using this integration.", "了解使用此集成时需要考虑的重要问题。"],
    ["Need more help? Check out our", "需要更多帮助？请查看我们的"],
    ["Plugins", "插件"]
  ]),
      rules: [],
      overrides: new Map(),
      fragments: []
    },
    // C04 | integrations-marketing | ^\/integrations\/marketing\/?$
    {
      id: "C04",
      slug: "integrations-marketing",
      path: new RegExp("^\\/integrations\\/marketing\\/?$"),
      exact: new Map([
    ["Google Tag Manager logo", "Google Tag Manager 标志"],
    ["Klaviyo logo", "Klaviyo 标志"],
    ["Mailchimp logo", "Mailchimp 标志"],
    ["Pinterest logo", "Pinterest 标志"],
    ["Social networks logo", "社交网络标志"]
  ]),
      rules: [
    {"source":"{url} logo","target":"{url} 标志"}
  ],
      overrides: new Map(),
      fragments: []
    },
    // C02 | integrations-payment | ^\/integrations\/payment\/?$
    {
      id: "C02",
      slug: "integrations-payment",
      path: new RegExp("^\\/integrations\\/payment\\/?$"),
      exact: new Map([
    ["HubSpot logo", "HubSpot 标志"],
    ["PayPal logo", "PayPal 标志"],
    ["Salesforce logo", "Salesforce 标志"]
  ]),
      rules: [],
      overrides: new Map(),
      fragments: []
    },
    // C07 | integration-paypal | ^\/integrations\/payment\/paypal\/?$
    {
      id: "C07",
      slug: "integration-paypal",
      path: new RegExp("^\\/integrations\\/payment\\/paypal\\/?$"),
      exact: new Map([
    ["Account access", "账户访问权限"],
    ["Account Settings", "账户设置"],
    ["Customize invitations", "自定义邀请"],
    ["Delete", "删除"],
    ["Disconnect", "断开连接"],
    ["Disconnect from PayPal", "断开 PayPal 连接"],
    ["From PayPal, go to", "在 PayPal 中，进入"],
    ["Go to Invitation settings", "前往邀请设置"],
    ["Go to Invitation status", "前往邀请状态"],
    ["Go to PayPal", "前往 PayPal"],
    ["Manage how and when invitations are sent to your customers.", "管理向客户发送邀请的方式和时间。"],
    ["Track invitation status", "跟踪邀请状态"],
    ["View the delivery status of all invitations sent to your customers.", "查看发送给客户的全部邀请的送达状态。"],
    ["You're connected to PayPal. Service review invitations are now being sent to your customers.", "已连接 PayPal，正在向客户发送服务评论邀请。"]
  ]),
      rules: [],
      overrides: new Map(),
      fragments: []
    },
    // I01 | invitations-overview | ^\/invitations\/?$
    {
      id: "I01",
      slug: "invitations-overview",
      path: new RegExp("^\\/invitations\\/?$"),
      exact: new Map([
    ["Click rate", "点击率"],
    ["Created", "创建时间"],
    ["Customer Email", "客户邮箱"],
    ["Get access to more.", "解锁更多功能。"],
    ["Get reviews - Overview", "获取评论 — 概览"],
    ["Open rate", "打开率"],
    ["Recently invited customers", "最近邀请的客户"],
    ["See full invitation history", "查看完整邀请历史"],
    ["Send yourself a test invitation", "向自己发送测试邀请"],
    ["Sent", "已发送"],
    ["Status", "状态"],
    ["Unique customers invited", "已邀请客户数（去重）"],
    ["Unlock feature", "解锁功能"],
    ["Verified reviews", "已验证评论"],
    ["Want to see more on how your invitations are converting?", "想进一步了解邀请的转化情况？"],
    ["You are getting reviews through WooCommerce", "你正在通过 WooCommerce 获取评论"],
    ["Your most used service review template", "最常用的服务评论模板"],
    ["Not delivered - Invitation frequency setting", "未送达 — 邀请频率限制"],
    ["Not delivered - Limit reached", "未送达 — 已达上限"]
  ]),
      rules: [
    {"source":"{n} day ago","target":"{n} 天前"},
    {"source":"{n} days ago","target":"{n} 天前"},
    {"source":"{n} hours ago","target":"{n} 小时前"},
    {"source":"in {n} day","target":"{n} 天后"},
    {"source":"in {n} days","target":"{n} 天后"},
    {"source":"in {n} hours","target":"{n} 小时后"},
    {"source":"Your performance in the last {n} days","target":"最近 {n} 天的表现"}
  ],
      overrides: new Map(),
      fragments: []
    },
    // I04 | create-email | ^\/invitations\/create-email\/?$
    {
      id: "I04",
      slug: "create-email",
      path: new RegExp("^\\/invitations\\/create-email\\/?$"),
      exact: new Map([
    ["Choose an email template", "选择邮件模板"],
    ["Create an email", "创建邮件"],
    ["Our templates have been optimized for each experience your customers could have. You can add a template, or duplicate and make it your own.", "模板已针对不同客户体验进行优化。你可以添加模板，或复制后自行修改。"],
    ["Preview For non-purchase experiences", "预览非购买体验模板"],
    ["Preview For purchase experiences (Best in test)", "预览购买体验模板（测试效果最佳）"],
    ["Preview Optimized for product reviews", "预览商品评论优化模板"],
    ["Read about plans", "了解套餐"],
    ["Select For non-purchase experiences", "选择非购买体验模板"],
    ["Select For purchase experiences (Best in test)", "选择购买体验模板（测试效果最佳）"],
    ["Select Optimized for product reviews", "选择商品评论优化模板"],
    ["Service reviews are about an experience with your business. Product reviews are about specific products.", "服务评论评价与企业的整体体验。商品评论评价具体商品。"],
    ["Template language", "模板语言"],
    ["Upgrade for custom templates", "升级以使用自定义模板"],
    ["You can create customized review invitations that add a personal touch and set your brand apart.", "创建带有个性化风格的评论邀请，展现品牌特色。"]
  ]),
      rules: [
    {"source":"⭐ ⭐ ⭐ ⭐ ⭐ How many stars would you give {user}?","target":"⭐ ⭐ ⭐ ⭐ ⭐ 你会给 {user} 几颗星？"},
    {"source":"Template {n}","target":"模板 {n}"}
  ],
      overrides: new Map(),
      fragments: []
    },
    // I03 | invitation-setup-choice | ^\/invitations\/create-email\/setup-method-selection\/?$
    {
      id: "I03",
      slug: "invitation-setup-choice",
      path: new RegExp("^\\/invitations\\/create-email\\/setup-method-selection\\/?$"),
      exact: new Map([
    ["(service reviews only)", "（仅限服务评论）"],
    ["Choose email or integrations to send invites, then customize your templates and control when they're sent.", "选择通过邮件或集成发送邀请，再自定义模板和发送时间。"],
    ["Choose how you want to set up invitations", "选择邀请设置方式"],
    ["Connect your Trustpilot account to your email tools so review invitations are sent automatically. Automated invitations help you get valuable insights from verified customers.", "将 Trustpilot 账户连接到邮件工具，自动发送评论邀请。自动邀请有助于收集已验证客户的宝贵反馈。"],
    ["Customised email flow illustration", "自定义邮件流程示意图"],
    ["Customized set-up", "自定义设置"],
    ["Default settings:", "默认设置："],
    ["If neither of these are right, explore more ways to send invites, including integrations and APIs. View more options", "如果这两种方式都不合适，可查看集成和 API 等其他邀请方式。查看更多选项"],
    ["Just add your personalized Trustpilot email address to the BCC field in your email tooling and you're ready to go.", "只需将专属 Trustpilot 邮箱地址添加到邮件工具的 BCC 密送栏，即可开始使用。"],
    ["Need more options?", "需要更多选项？"],
    ["Quick set-up", "快速设置"],
    ["Quick setup email flow illustration", "快速设置邮件流程示意图"],
    ["Send delay intervals", "发送延迟间隔"],
    ["Service or product review invitation templates", "服务或商品评论邀请模板"],
    ["Set up automated invitations", "设置自动邀请"],
    ["Standard service review email template", "标准服务评论邮件模板"],
    ["What you can customize:", "可自定义内容："],
    ["Add JavaScript to your website to trigger invitations at different points in the customer journey", "将 JavaScript 添加到网站，在客户体验的不同环节触发邀请"],
    ["Connect Trustpilot to Zapier and use your existing tools to trigger invitations", "连接 Trustpilot 与 Zapier，使用现有工具触发邀请"],
    ["File Upload with Product Reviews", "文件上传（含商品评论）"],
    ["File Upload with product reviews logo", "商品评论文件上传标志"],
    ["If you can't automate the way you ask for reviews, we have a number of other options. However, these will not be as reliable in building your TrustScore and will take more work.", "如果无法自动邀请客户评论，也可选择其他方式。不过，这些方式需要更多手动操作，建立 TrustScore 的效果也较不稳定。"],
    ["JavaScript Integration", "JavaScript 集成"],
    ["Javascript Integration logo", "JavaScript 集成标志"],
    ["None of these work for you? Try another way", "这些方式都不适合？试试其他方式"],
    ["Other ways to get reviews", "其他评论收集方式"],
    ["Simple File Upload", "简易文件上传"],
    ["Simple File Upload logo", "简易文件上传标志"],
    ["Upload a list of customers and products they've purchased to send invitations", "上传客户及其已购商品清单，以发送邀请"],
    ["Use Segment events to trigger invitations", "使用 Segment 事件触发邀请"],
    ["We have several other options for sending invites automatically. These might require some coding skills.", "还可通过其他方式自动发送邀请，部分方式可能需要编程知识。"],
    ["Add Trustpilot as BCC", "将 Trustpilot 添加为密送（BCC）收件人"],
    ["This is your unique Trustpilot email address.", "这是你专属的 Trustpilot 邮箱地址。"],
    ["What to do next", "后续步骤"],
    ["Open the email you already send to customers.", "打开你平时发送给客户的邮件。"],
    ["Paste the address into the BCC field of that email.", "将该地址粘贴到邮件的密送（BCC）栏中。"],
    ["Save or send your email as usual.", "像平时一样保存或发送邮件即可。"]
  ]),
      rules: [
    {"source":"About {n} mins","target":"约 {n} 分钟"},
    {"source":"Send delay is {n} days after purchase","target":"购买后 {n} 天发送"},
    {"source":"For {n} days only, you can upload a list of customers you want to send invitations to","target":"仅限 {n} 天内，你可以上传客户名单，向他们发送邀请"}
  ],
      overrides: new Map(),
      fragments: [
    {"tag":"p","source":"If neither of these are right, explore more ways to send invites, including integrations and APIs. View more options here.","atoms":[["If neither of these are right, explore more ways to send invites, including integrations and APIs. View more options","如果这两种方式都不适合，你还可以探索更多邀请方式，包括集成与 API。查看更多选项请点击"],["here","此处"],[".","。"]]}
  ]
    },
    // I05 | email-templates | ^\/invitations\/editor\/?$
    {
      id: "I05",
      slug: "email-templates",
      path: new RegExp("^\\/invitations\\/editor\\/?$"),
      exact: new Map([
    ["Increase reviews with optimized email templates", "使用优化的邮件模板增加评论"],
    ["Template editor illustration", "模板编辑器示意图"],
    ["Use one of our proven templates to drive high invitation-to-review conversion rates. Or create custom templates that fit your brand and tone of voice.", "使用经过验证的模板提升邀请转为评论的比例，或创建符合品牌和语气的自定义模板。"]
  ]),
      rules: [],
      overrides: new Map(),
      fragments: []
    },
    // I06 | invitation-history | ^\/invitations\/invitation-history\/?$
    {
      id: "I06",
      slug: "invitation-history",
      path: new RegExp("^\\/invitations\\/invitation-history\\/?$"),
      exact: new Map([
    ["Already unsubscribed", "已取消订阅"],
    ["Cancel queued invitations", "取消排队中的邀请"],
    ["Date created", "创建日期"],
    ["Date sent", "发送日期"],
    ["Delivered", "已送达"],
    ["Delivery status", "投递状态"],
    ["End of results", "已显示全部结果"],
    ["Invalid recipient", "收件地址无效"],
    ["Invitation frequency setting", "邀请频率限制"],
    ["Invitation method", "邀请方式"],
    ["Invitation type", "邀请类型"],
    ["Limit reached", "已达上限"],
    ["Not delivered", "未送达"],
    ["Product Review", "商品评论"],
    ["Recipient", "收件人"],
    ["Reminders disabled", "已禁用提醒"],
    ["Search by email, name, or reference number", "搜索邮箱、姓名或参考编号"],
    ["Select items for Delivery status", "选择投递状态筛选项"],
    ["Select items for Invitation method", "选择邀请方式筛选项"],
    ["Select items for Invitation type", "选择邀请类型筛选项"],
    ["Service & Product Review Reminder", "服务与商品评论提醒"],
    ["Service Review Reminder", "服务评论提醒"],
    ["This month's activity", "本月活动"],
    ["Total invitations sent", "已发送邀请总数"],
    ["We couldn't find any invitations that matched your filters.", "未找到符合筛选条件的邀请。"],
    ["You're cancelling all invitations in the queue", "你即将取消队列中的所有邀请"],
    ["Once you cancel review invitations, they'll be removed from the queue and won't be sent to your customers.", "一旦取消评论邀请，这些邀请将从队列中移除，且不会发送给客户。"],
    ["Cancel Invitations", "取消邀请"],
    ["Export to a .CSV file", "导出为 .CSV 文件"],
    ["Choose how you'd like to export your data. Once your .CSV file is ready, we'll send you an email.", "选择数据的导出方式。.CSV 文件生成后，我们会通过邮件发送给你。"],
    ["How do you want to separate your data?", "希望使用哪种分隔符？"],
    ["Comma (,)", "逗号（,）"],
    ["Semicolon (;)", "分号（;）"],
    ["Which date range?", "选择哪个日期范围？"],
    ["Temporary email", "临时邮箱"],
    ["View invitation details", "查看邀请详情"]
  ]),
      rules: [
    {"source":"Showing {n} invitations from the last {n} months","target":"显示 {n} 封邀请（最近 {n} 个月）"}
  ],
      overrides: new Map(),
      fragments: []
    },
    // F02 | email-settings | ^\/invitations\/invitation-settings\/?$
    {
      id: "F02",
      slug: "email-settings",
      path: new RegExp("^\\/invitations\\/invitation-settings\\/?$"),
      exact: new Map([
    ["Default template for product review invitations", "商品评论邀请的默认模板"],
    ["Default template for service review invitations", "服务评论邀请的默认模板"],
    ["If customer replies to invitation, send the reply to:", "客户回复邀请时，将回复发送至："],
    ["Invitations landing page to send customers to:", "邀请中的客户跳转页面："],
    ["Manage your Reply-to emails", "管理回复地址"],
    ["No, I don't want to link to my Privacy Policy", "不，我不想添加隐私政策链接"],
    ["Privacy policy link", "隐私政策链接"],
    ["Select company identifier for invitation templates:", "选择邀请模板使用的企业标识："],
    ["Send email using your own email domain for the Sender Address (requires technical knowledge to set up)", "使用自有邮件域名作为发件地址（配置需要技术知识）"],
    ["Sender Email:", "发件邮箱："],
    ["Sender Name:", "发件人姓名："],
    ["The [CompanyIdentifier] placeholder is used in invitation templates to help your customers recognize your company.", "邀请模板使用 [CompanyIdentifier] 占位符，帮助客户识别你的企业。"],
    ["Timing and frequency", "发送时间与频率"],
    ["Yes, I'd like to link to my Privacy Policy", "是，我想添加隐私政策链接"],
    ["(This email is active and can't be deleted.)", "（此邮箱当前处于启用状态，无法删除。）"],
    ["Add new Reply-to email", "添加新的回复邮箱"],
    ["Change template", "更改模板"],
    ["Manage Reply-to emails", "管理回复邮箱"],
    ["Remove Reply-to emails", "移除回复邮箱"],
    ["Remove the email addresses that you don't want to include.", "移除不需要保留的邮箱地址。"],
    ["Search templates", "搜索模板"],
    ["Send verification", "发送验证邮件"],
    ["Service review", "服务评论"],
    ["To add this Reply-to email address, click on the setup link in the verification email.", "要添加此回复邮箱地址，请点击验证邮件中的设置链接。"],
    ["Trustpilot templates", "Trustpilot 模板"],
    ["Upgrade to create customized invitation templates that add a personal touch and set your brand apart.", "升级套餐即可创建自定义邀请模板，增添个性化风格，让品牌脱颖而出。"],
    ["Product review", "商品评论"],
    ["ID:", "ID："],
    ["magnifying glass", "放大镜"],
    ["No templates found", "未找到模板"]
  ]),
      rules: [
    {"source":"⭐ ⭐ ⭐ ⭐ ⭐ How many stars would you give {user}?","target":"⭐ ⭐ ⭐ ⭐ ⭐ 你会给 {user} 几颗星？"},
    {"source":"Send from {email} (no further setup required)","target":"使用 {email} 发送（无需进一步设置）"}
  ],
      overrides: new Map(),
      fragments: [
    {"tag":"p","source":"To enable product review invitations, go to Timing and frequency.","atoms":[["To enable product review invitations, go to","如需启用商品评论邀请，请前往"],["Timing and frequency","时间与发送频率"],[".","。"]]}
  ]
    },
    // F04 | legal-notice | ^\/invitations\/invitation-settings\/impressum\/?$
    {
      id: "F04",
      slug: "legal-notice",
      path: new RegExp("^\\/invitations\\/invitation-settings\\/impressum\\/?$"),
      exact: new Map([
    ["A legal notice is the company information that you are legally required to include in some commercial content.", "法律声明是某些商业内容依法需要列明的企业信息。"],
    ["Address: *", "地址：*"],
    ["Business registration number: *", "企业注册号：*"],
    ["Contact information", "联系信息"],
    ["Display a legal notice in your invitations (optimized template)", "在邀请中显示法律声明（优化模板）"],
    ["Email address: *", "邮箱地址：*"],
    ["impressum illustration", "法律声明示意图"],
    ["Legal information", "法律信息"],
    ["Legal name of business: *", "企业法定名称：*"],
    ["To be compliant with the CAN-SPAM Act and other messaging laws, simply enable the feature, and your legal notice will be shown in the footer of all your invitations.", "为符合 CAN-SPAM Act 及其他商业消息法规，只需启用此功能，法律声明就会显示在所有邀请的页脚。"],
    ["To comply with strict international commercial messaging and anti-spam laws, make sure to enable our legal notice feature and fill out the required information.", "为遵守国际商业消息和反垃圾信息法规，请启用法律声明功能并填写必填信息。"],
    ["What's a legal notice?", "什么是法律声明？"]
  ]),
      rules: [],
      overrides: new Map(),
      fragments: []
    },
    // F05 | consumer-privacy | ^\/invitations\/invitation-settings\/privacy\/?$
    {
      id: "F05",
      slug: "consumer-privacy",
      path: new RegExp("^\\/invitations\\/invitation-settings\\/privacy\\/?$"),
      exact: new Map([
    ["before a specific date", "指定日期之前"],
    ["Delete all invitations created", "删除以下时间创建的全部邀请"],
    ["Delete invitation data", "删除邀请数据"],
    ["Delete now", "立即删除"],
    ["Delete the invitations data of", "删除以下对象的邀请数据"],
    ["Enter recipient(s) email address(es), separated by new line, comma or semicolon", "请输入收件人邮箱地址，多个地址可用换行、逗号或分号分隔"],
    ["Guidelines for invitation removal", "邀请删除指南"],
    ["If a data subject requests personal data to be deleted", "当数据主体要求删除个人数据时"],
    ["Read more about consumer privacy here", "了解消费者隐私"],
    ["specific customers", "指定客户"],
    ["This feature allows you to delete review invitations data for the following reasons:", "此功能可用于在以下情况下删除评论邀请数据："],
    ["Pixel tracking", "邮件打开追踪（Pixel 追踪）"],
    ["Track when customers view your review invitation emails to measure engagement, optimise send times, and improve overall response rates.", "追踪客户查看评论邀请邮件的时间，以衡量互动情况、优化发送时机并提升整体回复率。"]
  ]),
      rules: [
    {"source":"If your company has a retention period for review invitations data which is shorter than {n} years","target":"当企业的评论邀请数据保留期限短于 {n} 年时"}
  ],
      overrides: new Map(),
      fragments: [
    {"tag":"label","source":"Delete the invitations data of specific customers","atoms":[["Delete the invitations data of","删除"],["specific customers","特定客户的邀请数据"]]},
    {"tag":"label","source":"Delete all invitations created before a specific date","atoms":[["Delete all invitations created","删除"],["before a specific date","指定日期之前创建的全部邀请"]]}
  ]
    },
    // F03 | invitation-timing | ^\/invitations\/invitation-settings\/timing-and-frequency\/?$
    {
      id: "F03",
      slug: "invitation-timing",
      path: new RegExp("^\\/invitations\\/invitation-settings\\/timing-and-frequency\\/?$"),
      exact: new Map([
    ["Automatically chooses the best time based on Trustpilot data", "根据 Trustpilot 数据自动选择最佳发送时间"],
    ["Available on Premium plans and above.", "仅适用于 Premium 及以上套餐。"],
    ["Choose a preferred time", "选择偏好时间"],
    ["day", "天"],
    ["days", "天"],
    ["Get reviews > Email templates.", "获取评论 > 邮件模板。"],
    ["How often should review invitations be sent?", "评论邀请的发送频率是多少？"],
    ["Immediately", "立即发送"],
    ["Invitation Settings", "邀请设置"],
    ["Invite each customer a maximum of once every", "同一客户最多每隔以下时间邀请一次"],
    ["Invite each customer after every purchase or experience", "每次购买或体验后都邀请客户"],
    ["Just a heads up", "温馨提示"],
    ["Learn more about product review invitations", "了解商品评论邀请"],
    ["months", "个月"],
    ["Optimise timing automatically", "自动优化发送时机"],
    ["Please note that the settings will not work if you send many invitations to the same person within a short time frame.", "请注意，短时间内向同一人发送多次邀请时，这些设置将不起作用。"],
    ["Preview reminder email.", "预览提醒邮件。"],
    ["Send a reminder", "发送提醒"],
    ["Send as a separate invitation", "单独发送邀请"],
    ["Send together with the service review invitation", "与服务评论邀请一起发送"],
    ["Should we send reminders for review invitations?", "是否为评论邀请发送提醒？"],
    ["Trustpilot will cancel invitations automatically if a customer has already been invited to write a review for the same reference number.", "如果客户已收到相同参考编号的评论邀请，Trustpilot 将自动取消后续邀请。"],
    ["week", "周"],
    ["weeks", "周"],
    ["When should we send a product review invitation?", "应何时发送商品评论邀请？"],
    ["When should we send a review invitation after a purchase or experience?", "应在购买或体验后何时发送评论邀请？"],
    ["When would you prefer to send review invitations?", "你希望在什么时候发送评论邀请？"],
    ["After a delay of", "延迟"]
  ]),
      rules: [
    {"source":"If a review invitation is sent today, the next one wouldn't be sent until {date}","target":"如果今天发送评论邀请，下次邀请最早将在 {date} 发送"},
    {"source":"If the purchase or experience occurred today, the review invitation would send on {date}","target":"如果今天发生购买或体验，评论邀请将于 {date} 发送"},
    {"source":"A reminder to review {user}","target":"提醒你评价 {user}"},
    {"source":"If a review invitation is sent today, the next one wouldn't be sent until {date}.","target":"如果今天发送评论邀请，下次最早会在 {date} 发送。"},
    {"source":"If the purchase or experience occurred today, the review invitation would send on {date}.","target":"如果购买或体验发生在今天，评论邀请将于 {date} 发送。"}
  ],
      overrides: new Map(),
      fragments: [
    {"tag":"p","source":"Preview reminder email. To customize the design, go to Get reviews > Email templates.","atoms":[["Preview reminder email.","预览提醒邮件。"],["To customize the design, go to","如需自定义样式，请前往"],["Get reviews > Email templates.","获取评论 > 邮件模板。"]]},
    {"tag":"label","source":"Send as a separate invitation after the service review invitation","atoms":[["Send as a separate invitation","在服务评论邀请发送"],["after the service review invitation","后单独发送"]]},
    {"tag":"label","source":"Send a reminder after the initial invitation, if no review is left.","atoms":[["Send a reminder","如果未留下评论，在首次邀请"],["after the initial invitation, if no review is left.","后发送提醒。"]]}
  ]
    },
    // I02 | invitation-methods | ^\/invitations\/invite-customers\/invitation-methods\/?$
    {
      id: "I02",
      slug: "invitation-methods",
      path: new RegExp("^\\/invitations\\/invite-customers\\/invitation-methods\\/?$"),
      exact: new Map([
    ["Active", "已启用"],
    ["Add another tool", "添加其他工具"],
    ["Automatically send your verified customers an invitation to leave a review.", "自动邀请已验证的客户撰写评论。"],
    ["Collection methods", "收集方式"],
    ["Email invitations", "邮件邀请"],
    ["Get reviews from logged-in customers on your website.", "收集网站上已登录客户的评论。"],
    ["Invited", "已邀请"],
    ["Link to your Trustpilot reviews page from receipts or point-of-sale.", "在收据或销售点提供 Trustpilot 评论页链接。"],
    ["mobile phone inbox", "手机收件箱"],
    ["Not available on your plan", "当前套餐不可用"],
    ["QR code", "二维码"],
    ["QR code with 'Review us on Trustpilot' text", "带“在 Trustpilot 上评价我们”文字的二维码"],
    ["review us on trustpilot component", "在 Trustpilot 上评价我们组件"],
    ["Set up how you want to collect reviews from your customers. You can use multiple methods at the same time.", "设置收集客户评论的方式。你可以同时使用多种方式。"],
    ["Verified", "已验证"]
  ]),
      rules: [],
      overrides: new Map(),
      fragments: []
    },
    // F11 | locations | ^\/locations\/?$
    {
      id: "F11",
      slug: "locations",
      path: new RegExp("^\\/locations\\/?$"),
      exact: new Map(),
      rules: [],
      overrides: new Map(),
      fragments: []
    },
    // F16 | locations-detail | ^\/locations\/summary\/?$
    {
      id: "F16",
      slug: "locations-detail",
      path: new RegExp("^\\/locations\\/summary\\/?$"),
      exact: new Map([
    ["add-on module. You can unlock it by upgrading your plan.", "附加模块。升级套餐即可解锁。"],
    ["This feature is part of the", "此功能属于"],
    ["Upgrade to build local trust that converts", "升级以建立高转化的本地信任"],
    ["Give every location its own trusted profile, empower local teams with location-level insights, and get each of your locations recommended in local AI searches.", "为每个门店提供专属可信主页，以门店级洞察赋能本地团队，并让各门店在本地 AI 搜索中获得推荐。"],
    ["Power LLMs and search engines with relevant, location-specific reviews so nearby customers find and choose your branches.", "向大语言模型和搜索引擎提供相关的门店评论，让附近客户找到并选择你的门店。"],
    ["Level up with location-specific insights.", "借助门店级洞察持续优化。"],
    ["Spot local trends and benchmark branch performance so you can fix operational issues and double down on successful strategies at the branch level.", "发现本地趋势并对标各门店表现，及时修复运营问题并在门店层面复制成功经验。"],
    ["Every review automatically lands on the exact branch profile it belongs to. No manual tagging, sorting, or extra support tickets required.", "每条评论自动归入对应门店主页，无需手动打标、整理或额外工单处理。"],
    ["Empower local teams to own their trust signals.", "赋能本地团队经营口碑。"],
    ["Give branch managers dedicated feedback so they can actively manage, improve, and take pride in their local reputation.", "为门店经理提供专属反馈视图，主动管理并持续提升本地声誉。"]
  ]),
      rules: [],
      overrides: new Map(),
      fragments: []
    },
    // S04 | marketing-assets | ^\/marketing\/?$
    {
      id: "S04",
      slug: "marketing-assets",
      path: new RegExp("^\\/marketing\\/?$"),
      exact: new Map([
    ["A little trust goes a long way. And having marketing that shows how trustworthy you are could bring in your next customer.", "一点信任就能带来改变。让营销内容展现企业的可信度，吸引下一位客户。"],
    ["Ready made and ready to go with custom assets", "使用现成的自定义素材，随时开始"]
  ]),
      rules: [
    {"source":"Ad templates ({n})","target":"广告模板（{n}）"},
    {"source":"Badges ({n})","target":"徽章（{n}）"},
    {"source":"Logos ({n})","target":"标志（{n}）"},
    {"source":"Milestones ({n})","target":"里程碑（{n}）"},
    {"source":"Social media ({n})","target":"社交媒体（{n}）"},
    {"source":"Social media icons ({n})","target":"社交媒体图标（{n}）"},
    {"source":"Stars ({n})","target":"星级（{n}）"}
  ],
      overrides: new Map(),
      fragments: []
    },
    // B01 | plans-billing | ^\/plans-and-billing\/?$
    {
      id: "B01",
      slug: "plans-billing",
      path: new RegExp("^\\/plans-and-billing\\/?$"),
      exact: new Map([
    ["Billing", "账单"],
    ["Business name", "企业名称"],
    ["Cancel editing account information", "取消编辑账户资料"],
    ["Cancel editing primary contact", "取消编辑主要联系人"],
    ["Current", "当前"],
    ["Edit account information", "编辑账户资料"],
    ["Find help now", "立即获取帮助"],
    ["Free plan", "Free 套餐"],
    ["Let's get this party started", "开始使用付费功能"],
    ["Next invoice", "下次账单"],
    ["No add-ons", "暂无附加模块"],
    ["Plan add-ons", "套餐附加模块"],
    ["Plan renews", "套餐续订日期"],
    ["Postcode", "邮政编码"],
    ["Primary contact", "主要联系人"],
    ["Save account information", "保存账户资料"],
    ["Save contact as primary contact", "将此联系人设为主要联系人"],
    ["Search domain", "搜索域名"],
    ["Select an option", "请选择"],
    ["Support", "支持"],
    ["Switch between your domains, or claim a new one.", "切换域名，或申领新域名。"],
    ["This is the person who will own the Trustpilot account, and act as the primary contact for communication.", "此人将拥有 Trustpilot 账户，并作为主要联系人接收沟通信息。"],
    ["Visit the Support Center", "访问支持中心"],
    ["Want to upgrade your domain to a paid plan?", "想将此域名升级到付费套餐？"],
    ["Why not take a look at our paid plans and everything they have to offer your business.", "了解付费套餐，看看它们能为企业提供哪些功能。"],
    ["Your plan", "你的套餐"],
    ["Edit primary contact", "编辑主要联系人"]
  ]),
      rules: [
    {"source":"{url} is your current domain","target":"{url} 是你当前的域名"}
  ],
      overrides: new Map(),
      fragments: []
    },
    // B02 | claim-domain | ^\/plans-and-billing\/claim-domain\/?$
    {
      id: "B02",
      slug: "claim-domain",
      path: new RegExp("^\\/plans-and-billing\\/claim-domain\\/?$"),
      exact: new Map([
    ["Domain", "域名"],
    ["Enter the domain you'd like to add. It'll start on the Free plan, and you'll need to verify that you own it in the next step.", "输入要添加的域名。新域名将使用 Free 套餐，下一步需要验证你对该域名的所有权。"],
    ["E.g. trustpilot.com", "例如 trustpilot.com"]
  ]),
      rules: [
    {"source":"No need for www. or {url} just the domain name will do.","target":"无需输入 www. 或 {url}，只需填写域名。"}
  ],
      overrides: new Map(),
      fragments: []
    },
    // P01 | product-reviews | ^\/product-reviews\/?$
    {
      id: "P01",
      slug: "product-reviews",
      path: new RegExp("^\\/product-reviews\\/?$"),
      exact: new Map([
    ["Before you start", "开始之前"],
    ["Don't show this message again.", "不再显示此提示。"],
    ["Flagged", "已举报"],
    ["If you disagree with a review", "如果你不同意某条评论"],
    ["Is flagged", "已举报"],
    ["No image", "暂无图片"],
    ["No reviews found with the specified filters.", "没有符合筛选条件的评论。"],
    ["Not replied", "未回复"],
    ["our guidelines", "我们的指南"],
    ["Photo/video", "照片/视频"],
    ["Product reviews - Inbox", "商品评论 — 收件箱"],
    ["Replied", "已回复"],
    ["Reviews with a photo/video", "含照片/视频的评论"],
    ["Reviews without a photo/video", "不含照片/视频的评论"],
    ["Select items for Category", "选择类别筛选项"],
    ["Select items for Flagged", "选择举报状态筛选项"],
    ["Select items for Photo/video", "选择照片/视频筛选项"],
    ["There's new data available for you!", "你有新的数据可查看！"],
    ["trustpilot stars", "Trustpilot 星级"],
    ["Visit Analytics", "前往数据分析"],
    ["Was flagged", "曾被举报"],
    ["We recommend", "我们建议"],
    ["Please choose a reason:", "请选择原因："],
    ["Please select a reason from the list first.", "请先从列表中选择原因。"],
    ["to see how your product review invitations are doing.", "，查看商品评论邀请的表现。"],
    ["Select items for Reply", "选择回复状态筛选项"]
  ]),
      rules: [
    {"source":"{n} months","target":"{n} 个月"},
    {"source":"{n} weeks","target":"{n} 周"},
    {"source":"View all reviews ({n})","target":"查看全部评论（{n}）"}
  ],
      overrides: new Map(),
      fragments: []
    },
    // P07 | product-invitation-data | ^\/product-reviews\/analytics\/?$
    {
      id: "P07",
      slug: "product-invitation-data",
      path: new RegExp("^\\/product-reviews\\/analytics\\/?$"),
      exact: new Map([
    ["Easily export product review data to dig deeper into how customers interact with your products.", "轻松导出商品评论数据，深入了解客户与商品的互动情况。"],
    ["Get more from your reviews with data", "通过数据充分利用评论"],
    ["Invitation data is part of the Product Reviews add-on. It empowers you to:", "邀请数据属于商品评论附加模块。你可以："],
    ["Monitor how many customers write a product review, compared to invitations sent.", "对比发送的邀请数量，了解有多少客户撰写了商品评论。"],
    ["See product review data and uncover how it's changed over time.", "查看商品评论数据及其随时间的变化。"],
    ["Track review invitation conversion", "跟踪评论邀请转化情况"],
    ["Understand review trends", "了解评论趋势"],
    ["Use review data to improve your strategy", "使用评论数据优化策略"]
  ]),
      rules: [],
      overrides: new Map(),
      fragments: []
    },
    // P06 | third-party-reviews | ^\/product-reviews\/imports\/?$
    {
      id: "P06",
      slug: "third-party-reviews",
      path: new RegExp("^\\/product-reviews\\/imports\\/?$"),
      exact: new Map([
    ["Amplify your reach", "扩大影响力"],
    ["Easily import reviews you've collected on other sites to Trustpilot.", "将其他网站上收集的评论轻松导入 Trustpilot。"],
    ["Get all your reviews in one place", "集中管理所有评论"],
    ["Get more eyes on your products", "增加商品曝光"],
    ["Increase on-site conversion", "提升网站转化率"],
    ["Share reviews with other businesses on Trustpilot who sell the same products as you.", "与 Trustpilot 上销售相同商品的其他企业共享评论。"],
    ["Third-party reviews is part of the Product Reviews add-on. It empowers you to:", "第三方评论属于商品评论附加模块。你可以："],
    ["Use trusted third-party reviews to improve search performance and drive more traffic to your site.", "借助可信的第三方评论改善搜索表现，为网站吸引更多流量。"]
  ]),
      rules: [],
      overrides: new Map(),
      fragments: []
    },
    // P05 | product-attributes | ^\/product-reviews\/product-attributes\/?$
    {
      id: "P05",
      slug: "product-attributes",
      path: new RegExp("^\\/product-reviews\\/product-attributes\\/?$"),
      exact: new Map([
    ["Customers can rate specific aspects of your product as well as give it an overall rating—so you can easily spot what to improve.", "客户既可给商品打整体评分，也可评价商品的具体方面，方便你发现需要改进之处。"],
    ["Discover which products work and why", "了解哪些商品表现出色及其原因"],
    ["Drive growth with more sales", "增加销售，推动增长"],
    ["Enhance your product range", "优化商品组合"],
    ["Feedback on specific attributes helps you choose products customers love—so you can drive sales and grow your business.", "具体属性反馈有助于选出客户喜爱的商品，增加销量，推动业务增长。"],
    ["Find out what customers want", "了解客户需求"],
    ["Product attributes are now part of the Product Reviews add-on", "商品属性现已纳入商品评论附加模块"],
    ["Product attributes help your customers tell you exactly what they love about your products and why.", "商品属性可帮助客户准确说明他们喜爱商品的哪些方面及原因。"],
    ["Upgrade to discover new information about your products. Any data you've already collected will stay the same.", "升级，深入了解商品信息。已收集的数据会保持不变。"],
    ["Use product attributes as part of the Product Reviews add-on to:", "商品属性属于商品评论附加模块，你可以："]
  ]),
      rules: [],
      overrides: new Map(),
      fragments: []
    },
    // P03 | product-catalog | ^\/product-reviews\/product-catalog\/?$
    {
      id: "P03",
      slug: "product-catalog",
      path: new RegExp("^\\/product-reviews\\/product-catalog\\/?$"),
      exact: new Map([
    ["No products match your query", "没有符合搜索条件的商品"],
    ["Page 2", "第 2 页"],
    ["Page 3", "第 3 页"],
    ["Product rating", "商品评分"],
    ["Reset filters", "重置筛选"],
    ["Search by title or SKU", "搜索标题或 SKU"],
    ["Select all products on this page", "全选本页商品"],
    ["Variants", "变体"],
    ["With reviews", "有评论"],
    ["Without reviews", "无评论"],
    ["Product details", "商品详情"],
    ["Product info", "商品资料"],
    ["Product description", "商品描述"],
    ["Product ID", "商品 ID"]
  ]),
      rules: [
    {"source":"Category for {user}","target":"{user} 的类别"},
    {"source":"Edit {user}","target":"编辑 {user}"},
    {"source":"Page {n}","target":"第 {n} 页"},
    {"source":"Select {user}","target":"选择 {user}"},
    {"source":"Showing {n}/{n}","target":"显示 {n}/{n}"},
    {"source":"Showing {n}","target":"显示 {n}"}
  ],
      overrides: new Map(),
      fragments: []
    },
    // P04 | product-catalog-import | ^\/product-reviews\/product-catalog\/import\/?$
    {
      id: "P04",
      slug: "product-catalog-import",
      path: new RegExp("^\\/product-reviews\\/product-catalog\\/import\\/?$"),
      exact: new Map([
    ["All products must have a Product ID, including products with a single variant. You can use the Trustpilot ID.", "所有商品都必须有商品 ID，只有一个变体的商品也不例外。你可以使用 Trustpilot ID。"],
    ["Best practice", "最佳做法"],
    ["choose a file", "选择文件"],
    ["Confirm data", "确认数据"],
    ["CSV template", "CSV 模板"],
    ["Drag and drop your CSV here, or", "将 CSV 拖放到此处，或"],
    ["Formatting guide", "格式指南"],
    ["Google product category ID", "Google 商品类别 ID"],
    ["Help your products appear in Google and AI search by including a GTIN, or a combination of Brand and MPN.", "填写 GTIN，或同时填写品牌和 MPN，帮助商品在 Google 和 AI 搜索中展示。"],
    ["Import new products", "导入新商品"],
    ["Product brand", "商品品牌"],
    ["Product description", "商品描述"],
    ["Product ID", "商品 ID"],
    ["Product title", "商品标题"],
    ["Required", "必填"],
    ["To make sure your products are successfully uploaded, your CSV must meet the following requirements:", "为顺利上传商品，CSV 必须符合以下要求："],
    ["Upload CSV", "上传 CSV"],
    ["Upload your product details as a CSV. Make sure each data point (like name or size) has its own column. Use the template below, or view the formatting guide to prepare your file.", "以 CSV 格式上传商品资料，确保名称、尺寸等每项数据各占一列。可使用下方模板，或先阅读格式指南准备文件。"],
    ["Variant age group", "变体适用年龄"],
    ["Variant color", "变体颜色"],
    ["Variant gender", "变体适用性别"],
    ["Variant image URL", "变体图片 URL"],
    ["Variant material", "变体材质"],
    ["Variant pattern", "变体图案"],
    ["Variant size", "变体尺寸"],
    ["Variant SKU", "变体 SKU"],
    ["Variant URL", "变体 URL"],
    ["Your CSV must match the formatting guide.", "CSV 必须符合格式指南。"],
    ["Current step:", "当前步骤："]
  ]),
      rules: [],
      overrides: new Map(),
      fragments: []
    },
    // P09 | product-catalog-detail | ^\/product-reviews\/product-catalog\/products\/[^/]+\/?$
    {
      id: "P09",
      slug: "product-catalog-detail",
      path: new RegExp("^\\/product-reviews\\/product-catalog\\/products\\/[^/]+\\/?$"),
      exact: new Map([
    ["Edit variant details", "编辑变体资料"],
    ["Go to product attributes", "前往商品属性"],
    ["No product ratings yet", "暂无商品评分"],
    ["Pricing", "定价"],
    ["Product image", "商品图片"],
    ["Product info", "商品资料"],
    ["Product URL", "商品 URL"],
    ["Product visibility", "商品展示状态"],
    ["Rating", "评分"],
    ["Search by SKU", "搜索 SKU"],
    ["Select all variants on this page", "选择本页全部变体"],
    ["Set up product attributes", "设置商品属性"],
    ["Show on Google", "在 Google 上展示"],
    ["This information will be used when products are shown on Google Shopping", "此资料将用于商品在 Google Shopping 上的展示"],
    ["To show on Google Shopping, products must have a GTIN or a combination of Brand and MPN", "要在 Google Shopping 上展示，商品必须有 GTIN，或同时有品牌和 MPN"],
    ["To show reviews on Google Shopping, products must have a GTIN or a combination of Brand and MPN", "要在 Google Shopping 上展示评论，商品必须有 GTIN，或同时有品牌和 MPN"],
    ["Value", "值"],
    ["Variant details", "变体资料"],
    ["You need to set up product attributes for customers to rate", "请先设置商品属性，客户才能评分"]
  ]),
      rules: [
    {"source":"{user} · {n} variant","target":"{user} · {n} 个变体","guard":"[class*=\"header-module__header\"] h3"},
    {"source":"Edit {user}","target":"编辑 {user}"},
    {"source":"Page {n}","target":"第 {n} 页"},
    {"source":"Select {user}","target":"选择 {user}"},
    {"source":"Showing {n}/{n}","target":"显示 {n}/{n}"},
    {"source":"You need at least {n} rating for this product","target":"此商品至少需要 {n} 条评分"}
  ],
      overrides: new Map(),
      fragments: []
    },
    // P02 | product-questions | ^\/product-reviews\/product-questions\/?$
    {
      id: "P02",
      slug: "product-questions",
      path: new RegExp("^\\/product-reviews\\/product-questions\\/?$"),
      exact: new Map([
    ["Boost your website's SEO", "提升网站的 SEO 表现"],
    ["Build better relationships with customers", "改善客户关系"],
    ["Get insight from customer questions to help build your own data-driven business strategy.", "从客户提问中获取洞察，依据数据制定企业策略。"],
    ["Product Q&A is part of the Product Reviews add-on. It empowers you to:", "商品问答属于商品评论附加模块。你可以："],
    ["Sell more products", "增加商品销量"],
    ["Turn browsers into confident buyers and boost sales by answering customer questions right on your site.", "直接在网站上解答客户问题，让访客放心购买，提升销量。"],
    ["Understand customer needs", "了解客户需求"],
    ["Use answered questions to create content for your site and get more eyes on your products.", "利用已解答的问题制作网站内容，增加商品曝光。"]
  ]),
      rules: [],
      overrides: new Map(),
      fragments: []
    },
    // P08 | product-settings | ^\/product-reviews\/product-settings\/?$
    {
      id: "P08",
      slug: "product-settings",
      path: new RegExp("^\\/product-reviews\\/product-settings\\/?$"),
      exact: new Map([
    ["Hide all Product Reviews features", "收起全部商品评论功能"],
    ["Import existing third-party product reviews", "导入已有的第三方商品评论"],
    ["Product reviews - Settings", "商品评论 — 设置"],
    ["Product TrustBoxes", "商品 TrustBox"],
    ["Rich snippet stars", "富媒体搜索结果星级"],
    ["Show all Product Reviews features", "展开全部商品评论功能"],
    ["User-generated photos in product reviews", "商品评论中的用户照片"]
  ]),
      rules: [],
      overrides: new Map(),
      fragments: []
    },
    // S02 | image-generator | ^\/review-image\/?$
    {
      id: "S02",
      slug: "image-generator",
      path: new RegExp("^\\/review-image\\/?$"),
      exact: new Map([
    ["Shine in that spotlight with custom images", "用自定义图片吸引关注"],
    ["Turn your best reviews into a marketing tool. The image generator does the hard work for you, giving you more time to grow your business.", "将优质评论变成营销工具。图片生成器会处理制作工作，让你有更多时间发展业务。"],
    ["This page isn't mobile-accessible", "此页面暂不支持手机访问"],
    ["We're always working to improve the Trustpilot Business experience, but this page hasn't been optimised for mobile yet.", "我们持续改进 Trustpilot Business 的使用体验，但此页面尚未针对手机优化。"],
    ["Go back", "返回"]
  ]),
      rules: [
    {"source":"Ad templates ({n})","target":"广告模板（{n}）"},
    {"source":"Badges ({n})","target":"徽章（{n}）"},
    {"source":"Logos ({n})","target":"标志（{n}）"},
    {"source":"Milestones ({n})","target":"里程碑（{n}）"},
    {"source":"Social media ({n})","target":"社交媒体（{n}）"},
    {"source":"Social media icons ({n})","target":"社交媒体图标（{n}）"},
    {"source":"Stars ({n})","target":"星级（{n}）"}
  ],
      overrides: new Map(),
      fragments: []
    },
    // A05 | review-insights-detail | ^\/review-insights\/topics(?:-overview)?\/?$
    {
      id: "A05",
      slug: "review-insights-detail",
      path: new RegExp("^\\/review-insights\\/topics(?:-overview)?\\/?$"),
      exact: new Map([
    ["Leverage our AI-driven analysis of the topics discussed in your reviews to better understand what your customers think are your strengths and weaknesses.", "使用 AI 分析评论中讨论的主题，更清楚地了解客户眼中企业的优势和不足。"],
    ["Topics", "主题"],
    ["Upgrade to unlock actionable customer insights from your reviews", "升级，从评论中获取可用于改进的客户洞察"]
  ]),
      rules: [],
      overrides: new Map(),
      fragments: []
    },
    // R01 | service-reviews | ^\/reviews\/?$
    {
      id: "R01",
      slug: "service-reviews",
      path: new RegExp("^\\/reviews\\/?$"),
      exact: new Map([
    ["Basic Invitation", "基础邀请"],
    ["Copy link", "复制链接"],
    ["Embedded Review Form", "嵌入式评论表单"],
    ["English (5)", "英语（5）"],
    ["español, castellano (1)", "西班牙语（1）"],
    ["flagged", "已举报"],
    ["Generated Link", "生成链接"],
    ["Make a request", "发起请求"],
    ["Manual Invitation", "手动邀请"],
    ["not contacted", "未联系"],
    ["not flagged", "未举报"],
    ["Select items for Flag", "选择举报筛选项"],
    ["Select items for Language", "选择语言筛选项"],
    ["Select items for Request information", "选择索取信息筛选项"],
    ["Select items for Source", "选择来源筛选项"],
    ["Service reviews - Inbox", "服务评论 — 收件箱"],
    ["Source", "来源"],
    ["Source:", "来源："],
    ["Source: Automatic Invitation", "来源：自动邀请"],
    ["This review doesn't count towards your TrustScore. Only this customer's latest review counts.", "这条评论不计入 TrustScore。只会计入该客户的最新评论。"],
    ["Want more details about this review?", "想进一步了解这条评论？"],
    ["Link copied to your clipboard.", "链接已复制到剪贴板。"],
    ["Request information unavailable", "无法索取信息"],
    ["This review was written in response to an invitation you sent. Reviewer information is attached to this review.", "这条评论来自你发送的邀请，评论者资料已附在评论中。"],
    ["Flag this review", "举报此评论"],
    ["About a different business", "评价的是其他企业"],
    ["Not based on a genuine experience", "并非基于真实体验"],
    ["None of the flagging reasons apply", "以上举报理由均不适用"],
    ["Export your reviews", "导出评论"],
    ["Export review data into a CSV file to share customer feedback and build better experiences across all departments of your company.", "将评论数据导出为 CSV 文件，方便在公司各部门间共享客户反馈，持续优化客户体验。"],
    ["Transform good teams into great ones", "助力优秀团队迈向卓越"],
    ["Reviewer contacted.", "已联系评论者。"],
    ["Updated", "更新于"],
    ["Source: Organic", "来源：自主评论"],
    ["Source: Automatic invitation", "来源：自动邀请"],
    ["Why are you flagging this review?", "你为什么要举报此评论？"],
    ["Personal information", "包含个人信息"],
    ["at", " "]
  ]),
      rules: [
    {"source":"{n}-star reviews","target":"{n} 星评论"},
    {"source":"{n} months","target":"{n} 个月"},
    {"source":"{n} weeks","target":"{n} 周"},
    {"source":"Ask this reviewer for additional information to help you identify them or better understand their experience. They'll have {n} days to reply.","target":"向这位评论者索取补充信息，以便确认身份或进一步了解其体验。对方可在 {n} 天内回复。"},
    {"source":"English ({n})","target":"英语（{n}）"},
    {"source":"español, castellano ({n})","target":"西班牙语（{n}）"},
    {"source":"From the last {n} days","target":"最近 {n} 天"}
  ],
      overrides: new Map(),
      fragments: [
    {"tag":"p","source":"Updated {user}","atoms":[["Updated","更新于"],["{user}","{user}"]]}
  ]
    },
    // R02 | service-review-detail | ^\/reviews\/(?!reported-reviews\/?$)[^/]+\/?$
    {
      id: "R02",
      slug: "service-review-detail",
      path: new RegExp("^\\/reviews\\/(?!reported-reviews\\/?$)[^/]+\\/?$"),
      exact: new Map([
    ["Updated", "更新于"],
    ["Source: Organic", "来源：自主评论"],
    ["Source: Automatic invitation", "来源：自动邀请"],
    ["Write a reply...", "输入回复内容…"]
  ]),
      rules: [
    {"source":"Showing {n} out of {n}","target":"显示第 {n} 条，共 {n} 条"}
  ],
      overrides: new Map(),
      fragments: []
    },
    // R03 | flagging-activity | ^\/reviews\/reported-reviews\/?$
    {
      id: "R03",
      slug: "flagging-activity",
      path: new RegExp("^\\/reviews\\/reported-reviews\\/?$"),
      exact: new Map([
    ["Here's where all of your reports will be visible alongside the statistics on your flagging behaviour.", "你提交的全部举报及举报行为统计将显示在这里。"]
  ]),
      rules: [],
      overrides: new Map(),
      fragments: [
    {"tag":"p","source":"You don't have any reports yet. Learn more about when and how to flag here.","atoms":[["You don't have any reports yet. Learn more about when and how to flag","你目前还没有举报记录。了解何时以及如何举报，请点击"],["here","此处"],[".","。"]]}
  ]
    },
    // G05 | cookie-preferences | ^\/settings\/?$
    {
      id: "G05",
      slug: "cookie-preferences",
      path: new RegExp("^\\/settings\\/?$"),
      exact: new Map([
    ["Add or change your business categories.", "添加或更改企业分类。"],
    ["Add your business's physical locations to get location reviews.", "添加企业的实体地点，获取地点评价。"],
    ["Ask reviewers for a reference number when they write a review.", "请评论者在撰写评论时提供参考编号。"],
    ["Business settings:", "企业设置："],
    ["Choose which types of emails you'd like to receive from us.", "选择希望收到的邮件类型。"],
    ["Company Logo", "企业标志"],
    ["Control user accounts and permissions.", "管理用户账户和权限。"],
    ["Control your business's authorizations.", "管理企业授权。"],
    ["Cookies are small text files that websites place on your device as you are browsing. This information might be about you, your preferences or your device. The information does not usually directly identify you, but it can improve your browsing experience on our website. Because we respect your right to privacy, you can choose to opt out of certain cookies. Note that this may impact your experience of the site and the services we offer.", "Cookie 是你浏览网站时，网站存放在设备上的小型文本文件。其中的信息可能涉及你本人、偏好或设备，通常不会直接识别你的身份，但能改善浏览体验。我们尊重你的隐私权，你可以选择拒绝部分 Cookie。请注意，这可能影响网站体验及我们提供的服务。"],
    ["Edit your public details.", "编辑公开资料。"],
    ["First party cookies View cookies", "第一方 Cookie 查看 Cookie"],
    ["Functionality cookies - Cookie Details button opens Cookie List menu", "功能 Cookie —“Cookie 详情”按钮打开 Cookie 列表菜单"],
    ["Manage your business info, subscriptions and domains", "管理企业资料、订阅和域名"],
    ["Manage your cookie preferences", "管理 Cookie 偏好"],
    ["Manage your cookie preferences.", "管理 Cookie 偏好。"],
    ["Marketing cookies - Cookie Details button opens Cookie List menu", "营销 Cookie —“Cookie 详情”按钮打开 Cookie 列表菜单"],
    ["More information about your privacy, opens in a new tab", "关于隐私的更多信息，在新标签页中打开"],
    ["Performance cookies - Cookie Details button opens Cookie List menu", "性能 Cookie —“Cookie 详情”按钮打开 Cookie 列表菜单"],
    ["Personal settings:", "个人设置："],
    ["Profile settings:", "企业主页设置："],
    ["Save my preferences", "保存偏好"],
    ["Settings - Overview", "设置 — 概览"],
    ["Strictly necessary cookies", "必要 Cookie"],
    ["Strictly necessary cookies - Cookie Details button opens Cookie List menu", "必要 Cookie —“Cookie 详情”按钮打开 Cookie 列表菜单"],
    ["These cookies allow a website to remember your personal preferences (e.g. what language setting you prefer), and ensure that all of our services function properly. These cookies may be set by us or third-party providers that we work with.", "这些 Cookie 可记住个人偏好（例如语言设置），并确保服务正常运行。它们可能由我们或合作的第三方提供商设置。"],
    ["These cookies allow us to track visits, traffic sources and clicks so we can measure and improve the performance of our website.", "这些 Cookie 可跟踪访问次数、流量来源和点击情况，帮助我们衡量并改善网站表现。"],
    ["These cookies are essential for you to browse the website and use its features, such as setting your privacy preferences, logging in, or filling in forms (which is why you can't opt out of them).", "这些 Cookie 是浏览网站及使用功能所必需的，例如设置隐私偏好、登录或填写表单，因此无法拒绝使用。"],
    ["These cookies track your online activity to help our advertising partners deliver more targeted ads or to limit how many times you see an ad, based on your browsing behavior and internet device.", "这些 Cookie 会跟踪线上活动，根据浏览行为和上网设备，帮助广告合作伙伴投放更有针对性的广告，或限制同一广告的展示次数。"],
    ["Update your personal info and security settings.", "更新个人资料和安全设置。"],
    ["Host", "域名"],
    ["Duration", "有效期"],
    ["First Party", "第一方"],
    ["Description", "描述"],
    ["A few seconds", "几秒"],
    ["Third Party", "第三方"],
    ["Profile settings", "主页设置"],
    ["Cookies", "Cookie 设置"]
  ]),
      rules: [
    {"source":".{url} View cookies","target":".{url} 查看 Cookie"},
    {"source":"{url} View cookies","target":"{url} 查看 Cookie"},
    {"source":"{n} Days","target":"{n} 天"},
    {"source":"{n} Day","target":"{n} 天"},
    {"source":"{n} Years","target":"{n} 年"},
    {"source":"{n} Year","target":"{n} 年"}
  ],
      overrides: new Map([
    ["Name", "名称"]
  ]),
      fragments: [
    {"tag":"h2","source":"Business settings · {user}","atoms":[["Business settings","企业设置"],["·","·"],["{user}","{user}"]]},
    {"tag":"h2","source":"Profile settings · {user}","atoms":[["Profile settings","主页设置"],["·","·"],["{user}","{user}"]]},
    {"tag":"h2","source":"Personal settings · {user}","atoms":[["Personal settings","个人设置"],["·","·"],["{user}","{user}"]]}
  ]
    },
    // F09 | categories | ^\/settings\/categories\/?$
    {
      id: "F09",
      slug: "categories",
      path: new RegExp("^\\/settings\\/categories\\/?$"),
      exact: new Map([
    ["+ Add", "+ 添加"],
    ["Choose a category", "选择分类"],
    ["or see all categories", "或查看全部分类"],
    ["Primary", "主分类"],
    ["Remove", "移除"],
    ["Set as primary", "设为主分类"],
    ["You've added your business to these categories:", "企业已加入以下分类："]
  ]),
      rules: [
    {"source":"Stand out on Trustpilot and in search results by placing your company in the appropriate category. You can add your company in up to {n} categories ({n} primary, {n} secondary).","target":"将企业加入合适分类，在 Trustpilot 和搜索结果中脱颖而出。最多可添加 {n} 个分类（{n} 个主分类，{n} 个次分类）。"}
  ],
      overrides: new Map(),
      fragments: []
    },
    // F10 | category-selection | ^\/settings\/categories\/add\/?$
    {
      id: "F10",
      slug: "category-selection",
      path: new RegExp("^\\/settings\\/categories\\/add\\/?$"),
      exact: new Map([
    ["Animals & Pets", "动物与宠物"],
    ["Beauty & Well-being", "美容与健康"],
    ["Business Services", "商务服务"],
    ["Construction & Manufacturing", "建筑与制造"],
    ["Education & Training", "教育与培训"],
    ["Electronics & Technology", "电子与科技"],
    ["Events & Entertainment", "活动与娱乐"],
    ["Food, Beverages & Tobacco", "食品、饮料与烟草"],
    ["Health & Medical", "健康与医疗"],
    ["Hobbies & Crafts", "爱好与手工艺"],
    ["Home & Garden", "家居与园艺"],
    ["Home Services", "家居服务"],
    ["Legal Services & Government", "法律与政府服务"],
    ["Main Categories", "主分类"],
    ["Media & Publishing", "媒体与出版"],
    ["Money & Insurance", "金融与保险"],
    ["Public & Local Services", "公共与本地服务"],
    ["Restaurants & Bars", "餐厅与酒吧"],
    ["Shopping & Fashion", "购物与时尚"],
    ["Sports", "体育"],
    ["To allow consumers to find you on Trustpilot, please select a main and sub-category for your business (Don't worry, you can always change this later).", "请选择企业的主分类和子分类，帮助消费者在 Trustpilot 上找到你。以后仍可随时更改。"],
    ["Travel & Vacation", "旅游与度假"],
    ["Utilities", "公用事业"],
    ["Vehicles & Transportation", "车辆与交通"]
  ]),
      rules: [],
      overrides: new Map(),
      fragments: []
    },
    // F15 | help | ^\/settings\/contact\/?$
    {
      id: "F15",
      slug: "help",
      path: new RegExp("^\\/settings\\/contact\\/?$"),
      exact: new Map([
    ["covers just about everything you need to know.", "涵盖了你需要了解的几乎所有内容。"],
    ["Everything you need to know to make the most out of your Trustpilot Account, from reporting to replying, and all the essential information you might need along the way.", "从举报到回复，涵盖充分使用 Trustpilot 账户所需的知识，以及使用过程中可能需要的各类基本信息。"],
    ["send us a message", "给我们发消息"],
    ["Watch our video guides", "观看我们的视频指南"],
    ["Watch video guides", "观看视频指南"]
  ]),
      rules: [],
      overrides: new Map(),
      fragments: [
    {"tag":"p","source":"Our Help Center covers just about everything you need to know. But if you can't find what you're looking for, you can also send us a message.","atoms":[["Our","我们的"],["Help Center","帮助中心"],["covers just about everything you need to know.","涵盖了几乎所有你需要了解的内容。"],["But if you can't find what you're looking for, you can also","但如果你仍未找到所需答案，也可以"],["send us a message","给我们发消息"],[".","。"]]}
  ]
    },
    // F14 | email-notifications | ^\/settings\/notifications\/?$
    {
      id: "F14",
      slug: "email-notifications",
      path: new RegExp("^\\/settings\\/notifications\\/?$"),
      exact: new Map([
    ["1 and 2-star reviews", "1 星和 2 星评论"],
    ["4 and 5-star reviews", "4 星和 5 星评论"],
    ["Trustpilot's newsletter", "Trustpilot 资讯邮件"],
    ["Yes, I'd like to subscribe to Trustpilot's newsletter.", "是，我想订阅 Trustpilot 资讯邮件。"],
    ["modified reviews resulting from moderation requests", "因审核请求而修改的评论"],
    ["questions via the Product Q&A widget", "通过商品问答小部件解答问题"],
    ["replies to reviews", "对评论的回复"],
    ["only for my conversations", "仅限与我相关的会话"]
  ]),
      rules: [
    {"source":"{n} and {n}-star reviews","target":"{n} 星和 {n} 星评论"},
    {"source":"{n}-star reviews","target":"{n} 星评论"},
    {"source":"Product Reviews for {user} - Please email me about:","target":"{user} 的商品评论 — 请向我发送以下通知："},
    {"source":"Service Reviews for {user} - Please email me about:","target":"{user} 的服务评论 — 请向我发送以下通知："}
  ],
      overrides: new Map(),
      fragments: []
    },
    // F12 | reference-number | ^\/settings\/reference\/?$
    {
      id: "F12",
      slug: "reference-number",
      path: new RegExp("^\\/settings\\/reference\\/?$"),
      exact: new Map([
    ["Booking number", "预订编号"],
    ["Connect organic reviews to genuine customer experiences", "将自主评论与真实客户体验关联"],
    ["Customer number", "客户编号"],
    ["Invoice number", "发票号"],
    ["Make sure that every organic review is based on a genuine experience by asking reviewers for a reference number of your choice when they write a review. They can choose whether they want to share a reference number.", "请评论者在撰写自主评论时提供你选择的参考编号，以确认评论基于真实体验。评论者可自行决定是否提供。"],
    ["No thanks, I don't want a reference number from reviewers", "不，我不要求评论者提供参考编号"],
    ["Order number", "订单号"],
    ["Other (custom)", "其他（自定义）"],
    ["The reference number will be an extra field that reviewers will be asked to fill out when writing organic reviews.", "评论者撰写自主评论时，会看到用于填写参考编号的附加字段。"],
    ["The reference number will be shown below your organic reviews on the Service Reviews page in your business account.", "参考编号会显示在商家账户“服务评论”页面的自主评论下方。"],
    ["What kind of reference number would you like to ask for?", "你希望索取哪种参考编号？"],
    ["Yes please, I'd like reviewers to provide a reference number", "是，请评论者提供参考编号"],
    ["You", "企业方"],
    ["Rate your recent experience", "评价你的近期体验"],
    ["Tell us about your experience", "分享你的体验"],
    ["Very helpful and sorted out what I needed with no fuss", "很有帮助，顺利解决了我的问题"],
    ["Give your review a title", "为你的评论写一个标题"],
    ["Good service", "服务不错"],
    ["optional", "选填"],
    ["Providing this information will make it easier for the company to reply to your review.", "提供此信息有助于企业更方便地回复你的评论。"]
  ]),
      rules: [],
      overrides: new Map(),
      fragments: []
    },
    // S01 | social-sharing | ^\/share\/?$
    {
      id: "S01",
      slug: "social-sharing",
      path: new RegExp("^\\/share\\/?$"),
      exact: new Map([
    ["Build trust with custom social media posts", "通过自定义社交媒体帖子建立信任"],
    ["We all know the power of social media. Make it simple by using the connect and share feature to generate assets for your social media.", "社交媒体的影响力不言而喻。使用连接与分享功能，轻松生成社交媒体素材。"]
  ]),
      rules: [
    {"source":"Ad templates ({n})","target":"广告模板（{n}）"},
    {"source":"Badges ({n})","target":"徽章（{n}）"},
    {"source":"Logos ({n})","target":"标志（{n}）"},
    {"source":"Milestones ({n})","target":"里程碑（{n}）"},
    {"source":"Social media ({n})","target":"社交媒体（{n}）"},
    {"source":"Social media icons ({n})","target":"社交媒体图标（{n}）"},
    {"source":"Stars ({n})","target":"星级（{n}）"}
  ],
      overrides: new Map(),
      fragments: []
    },
    // S03 | video-generator | ^\/share\/review-video\/?$
    {
      id: "S03",
      slug: "video-generator",
      path: new RegExp("^\\/share\\/review-video\\/?$"),
      exact: new Map([
    ["Create an eye-catching video of your reviews to reach potential customers. No design skills needed!", "将评论制作成吸引眼球的视频，触达潜在客户。无需设计经验！"],
    ["Stand out from the crowd with custom videos", "用自定义视频脱颖而出"]
  ]),
      rules: [
    {"source":"Ad templates ({n})","target":"广告模板（{n}）"},
    {"source":"Badges ({n})","target":"徽章（{n}）"},
    {"source":"Logos ({n})","target":"标志（{n}）"},
    {"source":"Milestones ({n})","target":"里程碑（{n}）"},
    {"source":"Social media ({n})","target":"社交媒体（{n}）"},
    {"source":"Social media icons ({n})","target":"社交媒体图标（{n}）"},
    {"source":"Stars ({n})","target":"星级（{n}）"}
  ],
      overrides: new Map(),
      fragments: []
    },
    // I07 | location-reviews-info | ^\/subscription\/location-reviews\/?$
    {
      id: "I07",
      slug: "location-reviews-info",
      path: new RegExp("^\\/subscription\\/location-reviews\\/?$"),
      exact: new Map([
    ["/month", "／月"],
    ["Add locations:", "添加地点："],
    ["Assess trends and see which locations are performing best.", "分析趋势，了解哪些地点表现最佳。"],
    ["Automatic insights:", "自动洞察："],
    ["Be found locally, in search and AI:", "提升本地搜索与 AI 搜索曝光："],
    ["Build trust – location to location. Compare performance across individual areas, respond to reviews specific to stores, and grow trust locally.", "逐个地点建立信任。比较各地表现，回复门店评论，提升本地口碑。"],
    ["Bulk upload via CSV or manually add.", "通过 CSV 批量上传，或手动添加。"],
    ["Can individual branch managers see their own reviews?", "各门店经理能查看自己门店的评论吗？"],
    ["Compare reviews per location and spot emerging trends early.", "比较各地点的评论，及早发现新趋势。"],
    ["Each location has an individual TrustScore based only on reviews for that location. You'll also still have a global TrustScore for your entire business, based on reviews from all your locations combined.", "每个地点都有独立的 TrustScore，仅根据该地点的评论计算。企业整体仍有一个全局 TrustScore，综合所有地点的评论。"],
    ["How will location reviews affect my TrustScore?", "地点评价会如何影响 TrustScore？"],
    ["Invite customers to review:", "邀请客户评论："],
    ["Like your main profile, each location profile page is eligible to receive review snippet stars, helping your locations stand out in search results. Even one location review makes you visible to AI engines and can increase your AI citation rates.", "各地点主页与企业主主页一样，符合条件时可在搜索结果中展示评论星级，帮助门店脱颖而出。即使只有一条地点评价，也能让 AI 引擎发现你，并有助于提高 AI 引用率。"],
    ["Location reviews gives each of your branches its own review profile and insights. You can see how every location is performing, and help nearby customers find the one closest to them.", "地点评价为每家门店提供独立的评论主页和洞察。你可以了解各地点的表现，帮助附近客户找到最近的门店。"],
    ["Location specific insights:", "各地点专属洞察："],
    ["Location specific review requests can start being sent out automatically.", "可自动发送针对特定地点的评论邀请。"],
    ["Make your branches relevant in local search and drive a +24pp increase in AI citation rate when collecting location reviews.", "收集地点评价，提升门店在本地搜索中的相关性，让 AI 引用率提高 +24pp。"],
    ["No manual tagging or additional admin – we've curated the data for you.", "无需手动标记或额外管理，我们已为你整理好数据。"],
    ["Reviews and feedback are highlighted for each branch – see performance store to store and company wide.", "逐家门店展示评论和反馈，了解门店之间及企业整体的表现。"],
    ["Side by side data:", "并排比较数据："],
    ["Start getting local insights:", "开始获取本地洞察："],
    ["Start receiving specific reviews:", "开始收到各地点的评论："],
    ["What are the benefits of adding location reviews?", "添加地点评价有哪些好处？"],
    ["What is Location reviews?", "什么是地点评价？"],
    ["Yes. Branch managers get dedicated feedback for their own location, so they can manage and improve it.", "可以。门店经理可以查看各自地点的反馈，以便管理和改进。"]
  ]),
      rules: [],
      overrides: new Map(),
      fragments: []
    },
    // B03 | pricing | ^\/subscription\/upgrade\/?$
    {
      id: "B03",
      slug: "pricing",
      path: new RegExp("^\\/subscription\\/upgrade\\/?$"),
      exact: new Map([
    ["*Each domain priced separately", "*每个域名单独计费"],
    ["+ 100 invitations", "100 封额外邀请"],
    ["+ 1000 invitations", "1000 封额外邀请"],
    ["+ 200 invitations", "200 封额外邀请"],
    ["+ 4000 invitations", "4000 封额外邀请"],
    ["+ 500 invitations", "500 封额外邀请"],
    ["1 active code", "1 个有效二维码"],
    ["1 available widget", "1 个可用组件"],
    ["1 domain", "1 个域名"],
    ["1 Notifications", "1 条通知"],
    ["1 user", "1 个用户"],
    ["1 widget", "1 个组件"],
    ["10 integrations for your marketing & eCommerce tools", "10 种营销和电商工具集成"],
    ["10 users", "10 个用户"],
    ["10 widgets", "10 个组件"],
    ["100 review invitations/month", "每月 100 封评论邀请"],
    ["100/month", "100／月"],
    ["1000 clicks / month", "每月 1000 次点击"],
    ["1000 review invitations/month", "每月 1000 封评论邀请"],
    ["1000/month", "1000／月"],
    ["2 widgets", "2 个组件"],
    ["22 widgets", "22 个组件"],
    ["3 users", "3 个用户"],
    ["300 clicks / month", "每月 300 次点击"],
    ["300 review invitations/month", "每月 300 封评论邀请"],
    ["300/month", "300／月"],
    ["39 integrations for your marketing & eCommerce tools", "39 种营销和电商工具集成"],
    ["5 active codes", "5 个有效二维码"],
    ["50 review invitations/month.", "每月 50 封评论邀请。"],
    ["50/month", "50／月"],
    ["Add + 100 invitations to plan", "为套餐增加 100 封邀请"],
    ["Add + 1000 invitations to plan", "为套餐增加 1000 封邀请"],
    ["Add + 200 invitations to plan", "为套餐增加 200 封邀请"],
    ["Add + 4000 invitations to plan", "为套餐增加 4000 封邀请"],
    ["Add + 500 invitations to plan", "为套餐增加 500 封邀请"],
    ["Add Location reviews to plan", "为套餐添加地点评价"],
    ["Add Product reviews to plan", "为套餐添加商品评论"],
    ["Add-on", "附加模块"],
    ["Add-ons & integrations", "附加模块与集成"],
    ["Add-ons are additional paid features that you can add to your existing plan. We currently have the following add-ons: Product reviews, Location reviews, Salesforce integration, API access. If you're interested in any of these add-ons or want to learn more, please contact our sales team.", "附加模块是可添加到现有套餐中的额外付费功能。目前提供：商品评论、地点评价、Salesforce 集成及 API 访问权限。如对这些模块感兴趣或想了解更多，请联系我们的销售团队。"],
    ["Add-ons available", "可加购附加模块"],
    ["AI Search Analytics", "AI 搜索分析"],
    ["Analytics & automation integrations", "数据分析与自动化集成"],
    ["Analytics Explorer", "数据探索"],
    ["Annually", "年付"],
    ["API access", "API 访问"],
    ["Automated invitations", "自动邀请"],
    ["Available plans", "可用套餐"],
    ["available widgets", "可用组件"],
    ["Back to plans", "返回套餐"],
    ["Basic", "基础"],
    ["Build trust", "建立信任"],
    ["Build trust at scale. AI search tools look for fresh, verified feedback to understand your business. By scaling your review collection seamlessly, you ensure search engines always have a steady stream of recent experiences to index.", "规模化建立信任。AI 搜索工具会通过近期的已验证反馈了解你的企业。持续扩大评论收集，让搜索引擎不断获取近期体验。"],
    ["Capture the full customer journey. Automatically invite buyers at key touchpoints to maximize your review volume and build a holistic reflection of your end-to-end customer experience.", "覆盖完整客户旅程。在关键环节自动邀请买家，增加评论数量，全面反映客户的整体体验。"],
    ["Choose the right plan to build your reputation, showcase trust and turn feedback into strategy.", "选择合适的套餐，建立口碑、展示信任，并将反馈用于业务决策。"],
    ["Collect & manage reviews", "收集与管理评论"],
    ["Companies who have used Trustpilot", "使用过 Trustpilot 的企业"],
    ["Compare all plans", "比较全部套餐"],
    ["Contracts are a 12-month commitment. Pricing applies to new contracts.", "合同期限为 12 个月。此价格适用于新合同。"],
    ["Current plan", "当前套餐"],
    ["Custom image & video assets", "自定义图片与视频素材"],
    ["Customer service integrations", "客户服务集成"],
    ["Customizable invitations", "可自定义邀请"],
    ["Dedicated Customer Success Manager", "专属客户成功经理"],
    ["Designed for small businesses (up to $5M revenue)", "适合小型企业（营业额不超过 $5M）"],
    ["Downloadable Trustpilot assets", "可下载的 Trustpilot 素材"],
    ["Drive traffic to your product pages and increase purchases with a robust solution for collecting, sharing, and analyzing product reviews. Access the full library of product review widgets, including SEO-friendly widgets and subject to eligibility and our guidelines, access to product review pages to feature your products and their reviews on Trustpilot.", "通过完整的商品评论收集、分享和分析方案，为商品页引流并促进购买。可使用完整的商品评论组件库，包括有利于 SEO 的组件；符合资格及指南要求时，还可在 Trustpilot 商品评论页展示商品及其评论。"],
    ["eCommerce integrations", "电商集成"],
    ["Enhance your plan with add-ons", "通过附加模块增强套餐"],
    ["Explore Free widgets", "查看 Free 组件"],
    ["Explore Plus widgets", "查看 Plus 组件"],
    ["Explore Premium widgets", "查看 Premium 组件"],
    ["Explore Starter widgets", "查看 Starter 组件"],
    ["Explore widgets by plan", "按套餐浏览组件"],
    ["FAQ's", "常见问题"],
    ["Flag reviews", "举报评论"],
    ["Free plan is your current plan", "Free 是你当前的套餐"],
    ["From", "起"],
    ["Get more insights. By inviting more of your customers to share their experiences, you get a steady stream of fresh feedback to know what's working well and where to improve.", "获取更多洞察。邀请更多客户分享体验，持续收集最新反馈，明确优势与改进方向。"],
    ["Grow your local presence, improve local SEO, and understand your customer satisfaction across locations with location-specific review content and profiles.", "通过各地点的专属评论和主页提升本地曝光、改善本地 SEO，并了解各地客户满意度。"],
    ["How long is the contract for paid subscription?", "付费订阅的合同期限是多久？"],
    ["How much does the Enterprise plan cost?", "Enterprise 套餐如何收费？"],
    ["Improve with insights", "借助洞察改进业务"],
    ["In-App Review Collector", "应用内评论收集器"],
    ["Invitation conversion", "邀请转化"],
    ["Limited access", "有限访问"],
    ["Live chat", "在线聊天"],
    ["Location Reviews add-on", "地点评价附加模块"],
    ["Make feedback your competitive edge", "让反馈成为竞争优势"],
    ["Market & competitor insights", "市场与竞争对手洞察"],
    ["Marketing & promotion", "营销与推广"],
    ["Marketing integrations", "营销集成"],
    ["Match your public profile to your brand", "让公开主页与品牌风格一致"],
    ["month", "月"],
    ["Monthly", "月付"],
    ["More dashboards with richer data, insights and trends", "更多仪表板，提供更丰富的数据、洞察和趋势"],
    ["Multi-domain management", "多域名管理"],
    ["Online customer support", "在线客户支持"],
    ["Our pricing is tailored for each customer based on their unique needs and how they want to use Trustpilot. We also take the number of domains and estimated site traffic into consideration when determining your price. For more information or a quote, please reach out to our sales team.", "我们的定价根据每位客户的实际需求及 Trustpilot 使用方式量身定制，同时综合考虑域名数量与预估网站流量。如需了解更多详情或获取报价，请联系我们的销售团队。"],
    ["Per month", "每月"],
    ["Per month, billed annually", "每月价格，按年付费"],
    ["Performance overview", "表现概览"],
    ["Plan summaries", "套餐摘要"],
    ["Plus add-ons", "Plus 附加模块"],
    ["Power your ads with Trustpilot marketing assets", "使用 Trustpilot 营销素材增强广告效果"],
    ["Premium add-ons", "Premium 附加模块"],
    ["Premium only", "仅限 Premium"],
    ["Pricing plans", "套餐价格"],
    ["Product Reviews add-on", "商品评论附加模块"],
    ["Profile page customizations", "企业主页自定义"],
    ["Promotions on your profile page", "在企业主页展示推广内容"],
    ["QR Code Review Collector", "二维码评论收集器"],
    ["Qualify for Google Seller Ratings. Consistently meet the review thresholds required for Google Seller Ratings, boosting consumer confidence the moment they find you online.", "满足 Google Seller Ratings 门槛。稳定达到 Google Seller Ratings 所需的评论量，让消费者在搜索到你的第一时间建立信任。"],
    ["Reply data", "回复数据"],
    ["Reply to reviews", "回复评论"],
    ["Review collector", "评论收集组件"],
    ["Salesforce integration", "Salesforce 集成"],
    ["SAVE 11%", "节省 11%"],
    ["Search engagement reports", "搜索互动报告"],
    ["Select a plan to view available add-ons", "选择套餐，查看可用附加模块"],
    ["Select a plan to view available widgets", "选择套餐查看可用组件"],
    ["Start growing trust", "开始积累信任"],
    ["Starter add-ons", "Starter 附加模块"],
    ["Support & admin", "支持与管理"],
    ["Teams who have subscribed to a Trustpilot paid plan", "已订阅 Trustpilot 付费套餐的团队"],
    ["The contract term is 12 months, paid either upfront or month-to-month. If you have a month-to-month contract and you cancel before 12 months, you're still responsible for the balance for the year.", "合同期限为 12 个月，可选择一次性年付或按月支付。如选择按月支付并在 12 个月届满前取消，仍需结清当年剩余费用。"],
    ["to collect reviews", "用于收集评论"],
    ["to collect reviews & showcase trust", "用于收集评论和展示信任"],
    ["to collect reviews & showcase TrustScore", "用于收集评论和展示 TrustScore"],
    ["to showcase TrustScore & testimonials", "用于展示 TrustScore 和客户评价"],
    ["Topics report & sentiment analysis", "主题报告与情感分析"],
    ["TrustBox widgets to showcase testimonials", "展示客户评价的 TrustBox 组件"],
    ["TrustBox widgets to showcase trust", "展示信任的 TrustBox 组件"],
    ["TrustScore Forecast", "TrustScore 预测"],
    ["TrustScore Insights", "TrustScore 洞察"],
    ["Try free for 14 days", "免费试用 14 天"],
    ["Try Plus plan free for 14 days", "免费试用 Plus 套餐 14 天"],
    ["Turn more buyers into reviewers. Link reviews directly to distinct touchpoints so you can map exactly how different parts of your service experience are performing.", "将更多买家转化为评论者。将评论直接关联到不同触点，精准掌握各服务环节的表现。"],
    ["Turn trust into demand", "将信任转化为需求"],
    ["Turn trust into growth with Trustpilot", "通过 Trustpilot 将信任转化为增长"],
    ["Unlimited domains*", "不限域名数量*"],
    ["Up to 3 domains*", "最多 3 个域名*"],
    ["Upgrade to Plus plan", "升级至 Plus 套餐"],
    ["Upgrade to Premium plan", "升级至 Premium 套餐"],
    ["Upgrade to Starter plan", "升级至 Starter 套餐"],
    ["User logins", "用户登录名额"],
    ["View add-ons available for Plus", "查看 Plus 可用附加模块"],
    ["View add-ons available for Premium", "查看 Premium 可用附加模块"],
    ["View add-ons available for Starter", "查看 Starter 可用附加模块"],
    ["What are add-ons and how do they work?", "什么是附加模块？如何使用？"],
    ["What integrations are available?", "有哪些可用集成？"],
    ["Widget to collect reviews", "收集评论的组件"],
    ["Widgets help you showcase your Trustpilot ratings, reviews, and reputation on your business website, emails, and your social media profiles.", "组件可帮助你在企业官网、邮件和社交媒体主页上展示 Trustpilot 评分、评论与口碑。"],
    ["1 widget to collect reviews", "1 个评论收集组件"],
    ["2 widgets to collect reviews & showcase trust", "2 个组件，用于收集评论和展示信任"],
    ["10 widgets to collect reviews & showcase TrustScore", "10 个组件，用于收集评论和展示 TrustScore"],
    ["22 widgets to showcase TrustScore & testimonials", "22 个组件，用于展示 TrustScore 和客户评价"],
    ["Annual billing selected, pay upfront for the year", "已选按年计费，按年一次性预付"],
    ["Monthly billing selected, spread cost over 12 months", "已选按月计费，分 12 个月分摊费用"],
    ["On request", "按需报价"],
    ["Pricing on request", "按需报价"],
    ["Feature", "功能"],
    ["Included", "包含"],
    ["Not included", "不包含"],
    ["add-ons", "附加模块"],
    ["Collect & manage reviews features across plans", "各套餐的评论收集与管理功能"],
    ["Marketing & promotion features across plans", "各套餐的营销与推广功能"],
    ["Improve with insights features across plans", "各套餐的数据洞察与优化功能"],
    ["Add-ons & integrations features across plans", "各套餐的附加模块与集成功能"],
    ["Support & admin features across plans", "各套餐的支持与管理功能"],
    ["Premium only features across plans", "各套餐的 Premium 专属功能"],
    ["Contact sales team about add-on modules", "联系销售团队咨询附加模块"],
    ["Contact sales about Premium add-ons", "联系销售咨询 Premium 附加模块"],
    ["Flex widget – TrustScore", "Flex 组件 – TrustScore"],
    ["Widget customization", "组件自定义"],
    ["Depending your plan, integrations to the following apps are available: Adobe Commerce (Magento 2.x), BigCommerce, Google Tag Manager, Gorgias, Hootsuite, Klaviyo, Mailchimp, Paypal, Prestashop, Promo.com, OpenCart, Salesforce Integration, Segment, Shopify, Slack, Shopware, Square, Wix, Web Hooks WooCommerce, Zapier, Zendesk", "根据你所选的套餐，可使用以下应用集成：Adobe Commerce (Magento 2.x)、BigCommerce、Google Tag Manager、Gorgias、Hootsuite、Klaviyo、Mailchimp、PayPal、PrestaShop、Promo.com、OpenCart、Salesforce、Segment、Shopify、Slack、Shopware、Square、Wix、Webhooks、WooCommerce、Zapier、Zendesk。"]
  ]),
      rules: [
    {"source":"+ {n} invitations","target":"{n} 封额外邀请"},
    {"source":"{n} active code","target":"{n} 个有效二维码"},
    {"source":"{n} available widget","target":"{n} 个可用组件"},
    {"source":"{n} domain","target":"{n} 个域名"},
    {"source":"{n} user","target":"{n} 个用户"},
    {"source":"{n} widget","target":"{n} 个组件"},
    {"source":"{n} integrations for your marketing & eCommerce tools","target":"{n} 种营销和电商工具集成"},
    {"source":"{n} users","target":"{n} 个用户"},
    {"source":"{n} widgets","target":"{n} 个组件"},
    {"source":"{n} review invitations/month","target":"每月 {n} 封评论邀请"},
    {"source":"{n}/month","target":"{n}／月"},
    {"source":"{n} clicks / month","target":"每月 {n} 次点击"},
    {"source":"{n} active codes","target":"{n} 个有效二维码"},
    {"source":"{n} review invitations/month.","target":"每月 {n} 封评论邀请。"},
    {"source":"Add + {n} invitations to plan","target":"为套餐增加 {n} 封邀请"},
    {"source":"Contracts are a {n}-month commitment. Pricing applies to new contracts.","target":"合同期限为 {n} 个月。此价格适用于新合同。"},
    {"source":"Depending your plan, integrations to the following apps are available: Adobe Commerce (Magento 2.x), BigCommerce, Google Tag Manager, Gorgias, Hootsuite, Klaviyo, Mailchimp, Paypal, Prestashop, {url}, OpenCart, Salesforce Integration, Segment, Shopify, Slack, Shopware, Square, Wix, Web Hooks WooCommerce, Zapier, Zendesk","target":"根据套餐，可用集成包括：Adobe Commerce（Magento 2.x）、BigCommerce、Google Tag Manager、Gorgias、Hootsuite、Klaviyo、Mailchimp、Paypal、Prestashop、{url}、OpenCart、Salesforce 集成、Segment、Shopify、Slack、Shopware、Square、Wix、Web Hooks WooCommerce、Zapier、Zendesk"},
    {"source":"Depending your plan, integrations to the following apps are available: Adobe Commerce (Magento {n}.x), BigCommerce, Google Tag Manager, Gorgias, Hootsuite, Klaviyo, Mailchimp, Paypal, Prestashop, {url}, OpenCart, Salesforce Integration, Segment, Shopify, Slack, Shopware, Square, Wix, Web Hooks WooCommerce, Zapier, Zendesk","target":"根据套餐，可用集成包括：Adobe Commerce（Magento {n}.x）、BigCommerce、Google Tag Manager、Gorgias、Hootsuite、Klaviyo、Mailchimp、Paypal、Prestashop、{url}、OpenCart、Salesforce 集成、Segment、Shopify、Slack、Shopware、Square、Wix、Web Hooks WooCommerce、Zapier、Zendesk"},
    {"source":"SAVE {n}","target":"节省 {n}%"},
    {"source":"The contract term is {n} months, paid either upfront or month-to-month. If you have a month-to-month contract and you cancel before {n} months, you're still responsible for the balance for the year.","target":"合同期限为 {n} 个月，可一次付清或逐月付款。若选择逐月付款并在 {n} 个月内取消，仍需支付该年度的剩余费用。"},
    {"source":"Try free for {n} days","target":"免费试用 {n} 天"},
    {"source":"Try Plus plan free for {n} days","target":"免费试用 Plus 套餐 {n} 天"},
    {"source":"Up to {n} domains*","target":"最多 {n} 个域名*"},
    {"source":", SAVE {n}%","target":"，立省 {n}%"},
    {"source":"SAVE {n}%","target":"立省 {n}%"},
    {"source":"{user} selected, {n} available add-ons","target":"已选 {user}，提供 {n} 个可用附加模块"},
    {"source":"{user} selected, {n} available widgets","target":"已选 {user}，包含 {n} 个可用组件"},
    {"source":"{user} selected, {n} available widget","target":"已选 {user}，包含 {n} 个可用组件"},
    {"source":"{n} available widgets","target":"{n} 个可用组件"}
  ],
      overrides: new Map(),
      fragments: []
    },
    // W01 | widgets | ^\/trustbox\/?$
    {
      id: "W01",
      slug: "widgets",
      path: new RegExp("^\\/trustbox\\/?$"),
      exact: new Map(),
      rules: [],
      overrides: new Map(),
      fragments: []
    },
    // W04 | widget-collect-reviews | ^\/trustbox\/collect-reviews\/?$
    {
      id: "W04",
      slug: "widget-collect-reviews",
      path: new RegExp("^\\/trustbox\\/collect-reviews\\/?$"),
      exact: new Map(),
      rules: [],
      overrides: new Map(),
      fragments: []
    },
    // W02 | widget-customize | ^\/trustbox\/customize\/?$
    {
      id: "W02",
      slug: "widget-customize",
      path: new RegExp("^\\/trustbox\\/customize\\/?$"),
      exact: new Map(),
      rules: [],
      overrides: new Map(),
      fragments: []
    },
    // W03 | widget-essentials | ^\/trustbox\/essentials\/?$
    {
      id: "W03",
      slug: "widget-essentials",
      path: new RegExp("^\\/trustbox\\/essentials\\/?$"),
      exact: new Map(),
      rules: [],
      overrides: new Map(),
      fragments: []
    },
    // W06 | widget-product-reviews | ^\/trustbox\/product-reviews\/?$
    {
      id: "W06",
      slug: "widget-product-reviews",
      path: new RegExp("^\\/trustbox\\/product-reviews\\/?$"),
      exact: new Map(),
      rules: [],
      overrides: new Map(),
      fragments: []
    },
    // W05 | widget-testimonials | ^\/trustbox\/testimonials\/?$
    {
      id: "W05",
      slug: "widget-testimonials",
      path: new RegExp("^\\/trustbox\\/testimonials\\/?$"),
      exact: new Map(),
      rules: [],
      overrides: new Map(),
      fragments: []
    },
    // C09 | webhooks | ^\/webhooks\/?$
    {
      id: "C09",
      slug: "webhooks",
      path: new RegExp("^\\/webhooks\\/?$"),
      exact: new Map([
    ["By setting up webhooks, you'll receive instant notifications whenever a customer writes, updates or deletes their review.", "设置 Webhook 后，每当客户撰写、更新或删除评论，你都会立即收到通知。"],
    ["External webhooks illustration", "外部 Webhook 示意图"],
    ["Stay on top of your reviews with webhook notifications", "通过 Webhook 通知及时掌握评论动态"]
  ]),
      rules: [],
      overrides: new Map(),
      fragments: []
    },
    // F17 | account-delete | ^\/account\/delete\/?$
    {
      id: "F17",
      slug: "account-delete",
      path: new RegExp("^\\/account\\/delete\\/?$"),
      exact: new Map([
    ["Delete my account", "删除我的账户"],
    ["Deleting your account affects", "删除账户将影响以下内容"],
    ["Your account", "你的账户"],
    ["You'll lose access to Trustpilot Business, meaning you'll no longer be able to manage your profile or interact with reviewers. You'll also no longer receive notifications from us.", "你将无法再访问 Trustpilot Business、管理企业主页或与评论者互动，也不会再收到我们的通知。"],
    ["Your company profiles", "你的企业主页"],
    ["Important", "重要提示"]
  ]),
      rules: [],
      overrides: new Map(),
      fragments: [
    {"tag":"p","source":"You're the only user with access to these profiles, so they'll become unclaimed on Trustpilot.com.","atoms":[["You're","你是"],["the only user","唯一有权访问这些主页的用户"],["with access to these profiles, so they'll become","，因此它们将变为"],["unclaimed","未认领状态"],["on Trustpilot.com.","（位于 Trustpilot.com）。"]]},
    {"tag":"p","source":"Unclaiming your profile removes access to your business account, but it does not remove your public profile from Trustpilot.com. People will still be able to write reviews about your company.","atoms":[["Unclaiming","取消认领"],["your profile removes access to your business account, but","主页会移除你对企业账户的访问权限，但"],["it does not remove your public profile from Trustpilot.com","不会从 Trustpilot.com 删除企业的公开主页"],[". People will still be able to write reviews about your company.","。用户仍然可以为你的企业撰写评论。"]]}
  ]
    },
    // P10 | subscription-product-reviews | ^\/subscription\/product-reviews\/?$
    {
      id: "P10",
      slug: "subscription-product-reviews",
      path: new RegExp("^\\/subscription\\/product-reviews\\/?$"),
      exact: new Map([
    ["Spotlight every product and give customers the confidence to purchase. Give every product a dedicated review page, and build data to feed AI engines.", "凸显每一件商品，增强客户购买信心。为每件商品提供专属评论页，并沉淀数据供 AI 引擎引用。"],
    ["Product by product reviews:", "逐件商品评价："],
    ["Showcase eligible products with a dedicated review page – increasing product credibility and giving customers the confidence to buy.", "为符合条件的商品展示专属评论页，提升商品可信度，增强客户购买信心。"],
    ["Strengthened AI search:", "强化 AI 搜索表现："],
    ["By enabling reviews on a product to product level, AI engines are able to get the granular data they look to recommend your products.", "启用商品级评论后，AI 引擎能够获取更细粒度的评价数据，从而更准确地推荐你的商品。"],
    ["Guide buyers to buy:", "引导买家下单："],
    ["Product review pages take customers on a journey to conversion with credible reviews and replies.", "商品评论页通过真实的评论与回复，引导客户顺利完成购买转化。"],
    ["Start building product specific insights:", "开始构建商品级洞察："],
    ["Contact our team:", "联系我们的团队："],
    ["We'll get product reviews enabled on your account.", "我们将为你的账户开通商品评论功能。"],
    ["Sync up your product catalogue:", "同步你的商品目录："],
    ["If you don't have a product catalogue.", "如果你还没有上传商品目录。"],
    ["Send out product review invitations:", "发送商品评论邀请："],
    ["Start gathering product specific insights.", "开始收集针对具体商品的客户洞察。"],
    ["Learn more about product reviews", "了解更多关于商品评论的信息"],
    ["Where can I access product reviews?", "在哪里可以查看商品评论？"],
    ["In Trustpilot Business, go to Manage reviews > Product reviews > Inbox.", "在 Trustpilot Business 中，依次进入“管理评论 > 商品评论 > 收件箱”。"],
    ["Can a service count towards a product review?", "服务也能计入商品评论吗？"],
    ["This can be a little tricky. Product reviews are best for tangible products. This is to avoid confusion between a service that overlaps with your business's general service. But yes, some services can also be a product.", "这需要视具体情况而定。商品评论最适合实物商品，以避免与企业整体的服务评价混淆；不过部分特定服务也可以作为商品收集评论。"],
    ["Here are some examples:", "例如："],
    ["Specific movies and theater shows", "特定电影和剧场演出"],
    ["Online courses (e.g. Italian)", "在线课程（例如意大利语课程）"],
    ["Are there SEO benefits to product reviews?", "商品评论对 SEO 有帮助吗？"],
    ["Absolutely. By enabling search engines to index your product review content, you help potential customers find your product pages. Widgets allow search engines to crawl the content, giving you SEO benefits to boost the organic ranking of your site.", "当然有帮助。让搜索引擎索引商品评论内容，能帮助潜在客户更快找到你的商品页；组件还支持搜索引擎抓取评论内容，带来 SEO 收益，提升网站的自然搜索排名。"],
    ["Which businesses are eligible?", "哪些企业符合使用条件？"]
  ]),
      rules: [],
      overrides: new Map(),
      fragments: [
    {"tag":"p","source":"Product reviews aren't available to certain categories like Money & Insurance, Health & Medical, Gambling, Tobacco, and Weapons. The full list is subject to change, reach out to our sales team for more information.","atoms":[["Product reviews aren't available to","商品评论不适用于"],["certain categories","特定分类"],["like Money & Insurance, Health & Medical, Gambling, Tobacco, and Weapons. The full list is subject to change, reach out to our sales team for more information.","，例如金融与保险、医疗健康、博彩、烟草及武器等。完整列表可能随时调整，如需了解详情请联系我们的销售团队。"]]}
  ]
    },
    // W07 | widget-detail-unified | ^\/trustbox\/(?:(?:customize|essentials|collect-reviews|testimonials|product-reviews)\/)?[0-9a-f]{24}\/?$
    {
      id: "W07",
      slug: "widget-detail-unified",
      path: new RegExp("^\\/trustbox\\/(?:(?:customize|essentials|collect-reviews|testimonials|product-reviews)\\/)?[0-9a-f]{24}\\/?$"),
      exact: new Map([
    ["A smaller widget that emphasizes your TrustScore.", "小型组件，突出展示你的 TrustScore。"],
    ["A simple way to collect customer reviews directly from your own site.", "在你的网站上直接收集客户评论，简单方便。"],
    ["Responsive", "自适应"],
    ["Mobile, tablet and desktop ready", "支持手机、平板和桌面端"],
    ["Copy the link and send it to yourself or the person who will implement the code.", "复制链接，发送给自己或负责嵌入代码的人。"],
    ["Get the Plus plan to use this widget.", "升级至 Plus 套餐即可使用此组件。"],
    ["Get the Premium plan to use this widget.", "升级至 Premium 套餐即可使用此组件。"],
    ["Get the ProductReviews add-on module to use this widget.", "开通 Product Reviews 附加模块即可使用此组件。"],
    ["Mobile, tablet, and desktop ready", "支持手机、平板和桌面端"],
    ["Add reviews", "添加评论"],
    ["Select up to 4 reviews to display when the widget is clicked", "最多选择 4 条评论，在点击组件时展示"],
    ["Latest reviews", "最新评论"],
    ["Review ordered by star rating", "按星级排序的评论"],
    ["Reviews marked as favorite", "已收藏的评论"],
    ["Reviews ordered by tag", "按标签排序的评论"],
    ["Date of experience", "体验日期"],
    ["Only select reviews written in this language", "仅选择使用此语言撰写的评论"],
    ["Product SKU(s)*", "商品 SKU*"],
    ["Product name*", "商品名称*"],
    ["Hide TrustBox when there are 0 reviews", "评论数为 0 时隐藏 TrustBox"],
    ["Scroll to larger TrustBox when clicked", "点击时滚动到较大的 TrustBox"],
    ["Boost SEO by enabling structured data", "启用结构化数据以提升 SEO"],
    ["This widget has a transparent design and will fit any background.", "此组件采用透明设计，可适配任意背景。"],
    ["Displays all the basics in a compact design.", "以紧凑样式展示所有基础评分信息。"],
    ["Displays a minimalistic overview of all your Trustpilot stats.", "以极简风格概览你的全部 Trustpilot 统计数据。"],
    ["Displays your review count and star rating in a slim design.", "以纤细样式展示你的评论数量和星级评分。"],
    ["A smaller widget that emphasizes your star rating.", "小型组件，突出展示你的星级评分。"],
    ["Displays your total number of reviews in the sleek style of a social sharing button.", "以精巧的社交分享按钮样式展示你的总评论数。"],
    ["Displays your current review count, or you can hide the number until you're ready to show it.", "展示当前评论数量，也可先隐藏数字，待准备好后再显示。"],
    ["Get back to basics and showcase your star rating and review count.", "回归简洁基础，展示你的星级评分和评论数量。"],
    ["Shows 15 selected service reviews on a loop.", "循环展示 15 条精选服务评论。"],
    ["Displays 6 selected service reviews on a loop.", "循环展示 6 条精选服务评论。"],
    ["Draw attention to your customer service by showing 20 selected reviews and replies in a list.", "以列表形式展示 20 条精选评论及回复，彰显你的客户服务。"],
    ["Show you're transparent about feedback by displaying both positive and negative reviews—and replies too.", "同时展示好评、差评及商家回复，彰显公开透明的反馈态度。"],
    ["Stacks 20 selected reviews in columns for a broad overview.", "以多列网格形式展示 20 条精选评论，一览全貌。"],
    ["Shows 20 selected reviews and replies with a pop-up overlay.", "通过浮层弹窗展示 20 条精选评论及回复。"],
    ["Shows your star rating and 20 selected reviews in a dropdown.", "以下拉列表形式展示星级评分和 20 条精选评论。"],
    ["Displays 15 selected service reviews in a clickable carousel.", "以可点击轮播形式展示 15 条精选服务评论。"],
    ["Share excerpts from customer reviews to inspire shoppers and link to your Trustpilot profile.", "展示客户评论摘录以打动访客，并链接至你的 Trustpilot 企业主页。"],
    ["Highlight your customers' favorite products with a quick overview of star ratings.", "快速展示星级评分概览，突出客户最喜爱的商品。"],
    ["Get the same benefits as Product Mini, plus the option to import product reviews from other sources.", "具备 Product Mini 的全部优势，并支持导入其他来源的商品评论。"],
    ["Increase engagement by letting customers ask questions about your products—and providing answers.", "让客户就商品提问并由你解答，提升页面互动率。"],
    ["Displays 10 selected product reviews, with the option to show customer photos, videos, or attribute ratings.", "展示 10 条精选商品评论，并可选择显示客户照片、视频或属性评分。"],
    ["Displays 15 selected product reviews on a loop.", "循环展示 15 条精选商品评论。"],
    ["Displays a collection of customer photos and videos of your products.", "集中展示客户上传的商品照片和视频合集。"],
    ["Shows product reviews that are imported from other sources alongside your Trustpilot reviews.", "将其他来源导入的商品评论与 Trustpilot 评论一同展示。"],
    ["An SEO-friendly way to show product reviews that are imported from other sources alongside your Trustpilot reviews.", "以有利于 SEO 的方式，将其他来源导入的商品评论与 Trustpilot 评论一同展示。"],
    ["An SEO-friendly way to show product reviews and boost your organic site ranking.", "以有利于 SEO 的方式展示商品评论，助力提升网站自然搜索排名。"]
  ]),
      rules: [
    {"source":"Height: {n}-{n} px","target":"高度：{n}-{n} px"},
    {"source":"When I reach {n} reviews","target":"达到 {n} 条评论时"},
    {"source":"Width: {n}-{n} px or % (Responsive)","target":"宽度：{n}-{n} px 或 %（自适应）"},
    {"source":"Desktop min. width {n}px | height {n}px","target":"桌面端最小宽度 {n}px｜高度 {n}px"},
    {"source":"Mobile min. width {n}px | height {n}px","target":"手机端最小宽度 {n}px｜高度 {n}px"},
    {"source":"Responsive (min. {n}px x {n}px, max. {n}px x {n}px)","target":"自适应（最小 {n}px × {n}px，最大 {n}px × {n}px）"},
    {"source":"Responsive (min. {n}px x {n}px, max. {n}% x {n}px)","target":"自适应（最小 {n}px × {n}px，最大 {n}% × {n}px）"},
    {"source":"Responsive (min. {n}px x {n}px, max. {n}% x {n}px or {n}px)","target":"自适应（最小 {n}px × {n}px，最大 {n}% × {n}px 或 {n}px）"}
  ],
      overrides: new Map([
    ["About", "简介"]
  ]),
      fragments: [
    {"tag":"p","source":"Requires the Product Reviews TrustBox to be on the same page","atoms":[["Requires the","需要同一页面已放置"],["Product Reviews TrustBox","Product Reviews TrustBox"],["to be on the same page",""]]},
    {"tag":"p","source":"To ensure your widget is legible, enter your site's background color. Learn more","atoms":[["To ensure your widget is legible, enter your site's background color.","为确保组件清晰可读，请输入网站背景色。"],["Learn more","了解更多"]]}
  ]
    },
    // C10 | integration-details-all | ^\/integrations\/(?:ecommerce|payment|developers|marketing|customersupport|apps)\/[^/]+\/?$
    {
      id: "C10",
      slug: "integration-details-all",
      path: new RegExp("^\\/integrations\\/(?:ecommerce|payment|developers|marketing|customersupport|apps)\\/[^/]+\\/?$"),
      exact: new Map([
    ["Connect your Trustpilot invites to your Shopify account", "将 Trustpilot 评论邀请连接到你的 Shopify 账户"],
    ["Install the Trustpilot Shopify integration from the Shopify App Store.", "从 Shopify App Store 安装 Trustpilot 的 Shopify 集成。"],
    ["Go to Shopify App Store", "前往 Shopify App Store"],
    ["Connect to Wix", "连接 Wix"],
    ["Automate and seamlessly collect service and product reviews", "自动且无缝地收集服务评论和商品评论"],
    ["I understand and accept", "我已了解并同意"],
    ["This integration supports", "此集成支持"],
    ["Need help setting up and managing Wix integration?", "设置和管理 Wix 集成需要帮助？"],
    ["You accept that Trustpilot will place cookies on your webshop to invite your customers to write reviews and to verify them. Remember to obtain consent from your users and, if required by applicable laws, update your privacy policy to state that you're using third-party cookies from Trustpilot.", "你同意 Trustpilot 在网店中放置 Cookie，用于邀请客户撰写评论并进行验证。请记得征求用户同意；如适用法律要求，还需更新隐私政策，说明你正在使用 Trustpilot 的第三方 Cookie。"],
    ["Connect to Square", "连接 Square"],
    ["Automate service review requests", "自动发送服务评论邀请"],
    ["Compatible with both Square Point of Sale and Square Online", "同时兼容 Square Point of Sale 和 Square Online"],
    ["Need help with the Square integration?", "使用 Square 集成需要帮助？"],
    ["Add code snippet", "添加代码片段"],
    ["Verify your domain", "验证域名"],
    ["Complete your setup", "完成设置"],
    ["1. Add this code to your website's HTML", "1. 将此代码添加到网站的 HTML 中"],
    ["Find the <head> element in your website's HTML source code and add the following code to it.", "在网站 HTML 源码中找到 <head> 标签，并将以下代码添加到其中。"],
    ["What's a JavaScript Integration?", "什么是 JavaScript 集成？"],
    ["Automate review requests with our JavaScript Integration. Simply add it to your site in order to trigger review invitations to your customers.", "使用 JavaScript 集成自动发送评论邀请。只需将代码添加到网站，即可自动向客户触发邀请。"],
    ["Heads up!", "提示！"],
    ["Download documentation and inspiration", "下载说明文档与示例"],
    ["Connect to Magento v2", "连接 Magento v2"],
    ["Methods to install", "安装方式"],
    ["Your webshop won't be accessible for up to 15 minutes during the installation. We recommend backing up your webshop beforehand, and installing when it's least busy.", "安装过程中网店可能暂停访问最长 15 分钟。建议提前备份网店，并选择访问量较低的时段进行安装。"],
    ["Connect to BigCommerce", "连接 BigCommerce"],
    ["How to install this integration (5-10 minute setup)", "如何安装此集成（约 5–10 分钟）"],
    ["Connect to OpenCart", "连接 OpenCart"],
    ["Select OpenCart version", "选择 OpenCart 版本"],
    ["Connect to Prestashop", "连接 PrestaShop"],
    ["Install your Shopware plugin", "安装 Shopware 插件"],
    ["Install your WordPress plugin", "安装 WordPress 插件"],
    ["Drag and drop widgets on your website for a sneak peek.", "在网站上拖拽组件即可实时预览效果。"],
    ["No coding needed! Rearrange, customize, and publish all in one place.", "无需编写代码，即可一站式调整布局、自定义样式并发布。"],
    ["Automate your review collection with HubSpot", "借助 HubSpot 自动收集评论"],
    ["Automatically trigger service review invites straight from your HubSpot database.", "直接从你的 HubSpot 数据库自动触发服务评论邀请。"],
    ["Seamlessly integrate Salesforce with Trustpilot", "将 Salesforce 与 Trustpilot 无缝集成"],
    ["Fuel performance with reviews by connecting Trustpilot to your CRM.", "将 Trustpilot 连接到你的 CRM，以客户评论驱动业绩增长。"],
    ["Get access to the integration with the Salesforce add-on module. Contact us to learn more.", "开通 Salesforce 附加模块即可使用此集成。联系我们了解更多详情。"],
    ["Connect with your customers at scale", "规模化连接你的客户"],
    ["Use Salesforce to automatically send review invitations to customers that use your service—with direct access to reply right in your Salesforce dashboard.", "通过 Salesforce 自动向使用服务的客户发送评论邀请，并可直接在 Salesforce 控制台回复评论。"],
    ["Track and optimize performance", "追踪并优化表现"],
    ["Gain a deeper understanding of your customers' experience and create custom reports combining your review data, ratings, and other key attributes.", "更深入地了解客户体验，并结合评论数据、评分及其他关键指标创建自定义报表。"],
    ["Fuel performance with reviews", "用客户评论赋能业绩增长"],
    ["Amplify your marketing strategy with the voice of your customers and deliver personalized experiences at every stage of your sales and marketing funnel.", "以真实客户声音增强营销策略，在销售和营销漏斗的每个阶段提供个性化体验。"],
    ["Salesforce feature illustration", "Salesforce 功能示意图"],
    ["Automate your review collection with Zapier", "借助 Zapier 自动收集评论"],
    ["Set up Zaps with the apps you're already using (e.g. Shopify or Salesforce) to automatically send review invitations triggered from actions.", "使用你已在用的应用（如 Shopify 或 Salesforce）配置 Zap，按指定动作自动触发评论邀请。"],
    ["Zapier feature illustration", "Zapier 功能示意图"],
    ["Connect to Segment", "连接 Segment"],
    ["How to connect to Segment with Trustpilot", "如何将 Segment 连接到 Trustpilot"],
    ["Go to Segment", "前往 Segment"],
    ["How can I use Segment?", "如何使用 Segment？"],
    ["You can automate your review invitations by connecting Trustpilot to your Segment events.", "将 Trustpilot 连接到 Segment 事件后，即可自动发送评论邀请。"],
    ["Showcase reviews with Klaviyo", "借助 Klaviyo 展示评论"],
    ["Slack Integration", "Slack 集成"],
    ["Receive, sort and reply to reviews — right within Slack", "直接在 Slack 内接收、分类并回复评论"],
    ["Receive and sort your reviews in multiple Slack channels, or set up private channels where you and your colleagues can reply to reviews.", "在多个 Slack 频道中接收和分类评论，或设置私密频道方便你与同事协作回复。"],
    ["Connect to Gorgias", "连接 Gorgias"],
    ["Each new service and product Trustpilot review creates a ticket in Gorgias", "每条新的 Trustpilot 服务或商品评论都会在 Gorgias 中创建工单"],
    ["See Trustpilot review data in the customer sidebar", "在客户侧边栏中查看 Trustpilot 评论数据"],
    ["Reply to reviews directly from Gorgias", "直接在 Gorgias 中回复评论"],
    ["Connect multiple Trustpilot accounts to one Gorgias account", "将多个 Trustpilot 账户连接到同一个 Gorgias 账户"],
    ["Copy subject line", "复制邮件主题"],
    ["Gorgias will send you a link to activate the integration and log in to your Trustpilot account.", "Gorgias 将向你发送激活链接，用于启用集成并登录 Trustpilot 账户。"],
    ["If you're not already a Gorgias customer, you can start a free trial now.", "如果你还不是 Gorgias 客户，现在可以开启免费试用。"],
    ["Claim free trial", "领取免费试用"],
    ["Example ticket", "工单示例"],
    ["This integration is maintained by Gorgias.", "此集成由 Gorgias 维护。"],
    ["Read more about connecting", "了解更多连接方式"]
  ]),
      rules: [],
      overrides: new Map(),
      fragments: [
    {"tag":"p","source":"Reviews will be published to your store within 14 days. Review our terms and conditions for further details.","atoms":[["Reviews will be published to your store within 14 days. Review our","评论将在 14 天内发布到你的商店。请查看我们的"],["terms and conditions","条款与条件"],["for further details.","以了解详情。"]]},
    {"tag":"p","source":"Confirm that you want to integrate your Wix account with Trustpilot, then click Connect.","atoms":[["Confirm that you want to integrate your Wix account with Trustpilot, then click","确认要将 Wix 账户与 Trustpilot 集成，然后点击"],["Connect","连接"],[".","。"]]},
    {"tag":"p","source":"Click Connect then confirm that you want to integrate your Square account with Trustpilot.","atoms":[["Click","点击"],["Connect","连接"],["then confirm that you want to integrate your Square account with Trustpilot.","，然后确认将 Square 账户与 Trustpilot 集成。"]]},
    {"tag":"p","source":"You're entering developer territory. If you don't have technical knowledge, please consult someone who can help you. Download documentation and inspiration.","atoms":[["You're entering developer territory. If you don't have technical knowledge, please consult someone who can help you.","以下内容面向开发者。如果你不具备相关技术背景，请咨询技术人员协助处理。"],["Download documentation and inspiration","下载说明文档与示例"],[".","。"]]},
    {"tag":"p","source":"- Magento 2.0-2.3 (Recommended): Install via Magento Marketplace. Please see the video below for instructions.","atoms":[["-","-"],["Magento 2.0-2.3 (Recommended):","Magento 2.0–2.3（推荐）："],["Install via","通过"],["Magento Marketplace","Magento Marketplace"],[". Please see the video below for instructions."," 安装。具体步骤请观看下方视频。"]]},
    {"tag":"p","source":"- Magento 2.0-2.4 (Requires technical knowledge): Install using Magento's command line interface and Composer. Please see this article for instructions.","atoms":[["-","-"],["Magento 2.0-2.4 (Requires technical knowledge):","Magento 2.0–2.4（需具备技术背景）："],["Install using Magento's command line interface and Composer. Please see this","使用 Magento 命令行工具和 Composer 安装。具体步骤请查看这篇"],["article","文章"],["for instructions.","。"]]},
    {"tag":"p","source":"{n}. Log into your BigCommerce account and go to the App Marketplace.","atoms":[["{n}.","{n}."],["Log into your","登录你的"],["BigCommerce","BigCommerce"],["account and go to the","账户，前往"],["App Marketplace.","App Marketplace。"]]},
    {"tag":"p","source":"{n}. On the Trustpilot Reviews page, click Install.","atoms":[["{n}.","{n}."],["On the","在"],["Trustpilot Reviews","Trustpilot Reviews"],["page, click","页面上，点击"],["Install.","Install（安装）。"]]},
    {"tag":"p","source":"{n}. Select the checkbox and click Confirm to give Trustpilot access to your store.","atoms":[["{n}.","{n}."],["Select the checkbox and click","勾选复选框并点击"],["Confirm","确认"],["to give Trustpilot access to your store.","，授权 Trustpilot 访问你的商店。"]]},
    {"tag":"p","source":"{n}. To configure your settings, click the Trustpilot tab in your BigCommerce left-hand menu.","atoms":[["{n}.","{n}."],["To configure your settings, click the","如需配置设置，请点击 BigCommerce 左侧菜单中的"],["Trustpilot tab","Trustpilot 标签页"],["in your BigCommerce left-hand menu.","。"]]},
    {"tag":"p","source":"{n}. Select the version of OpenCart you're using.","atoms":[["{n}.","{n}."],["Select the version of OpenCart you're using.","选择你正在使用的 OpenCart 版本。"]]},
    {"tag":"p","source":"{n}. Download the zip file to your computer.","atoms":[["{n}.","{n}."],["Download the zip file to your computer.","将 ZIP 文件下载到电脑。"]]},
    {"tag":"p","source":"{n}. Download the zip file to your computer","atoms":[["{n}.","{n}."],["Download the zip file to your computer","将 ZIP 文件下载到电脑。"]]},
    {"tag":"p","source":"{n}. Log into your OpenCart account and go to Extensions > Installer.","atoms":[["{n}.","{n}."],["Log into your OpenCart account and go to","登录你的 OpenCart 账户，依次进入"],["Extensions","Extensions"],[">",">"],["Installer.","Installer。"]]},
    {"tag":"p","source":"{n}. Click Upload and upload the zip file from your computer.","atoms":[["{n}.","{n}."],["Click","点击"],["Upload","Upload（上传）"],["and upload the zip file from your computer.","，从电脑上传该 ZIP 文件。"]]},
    {"tag":"p","source":"{n}. Go to Extensions > Modules.","atoms":[["{n}.","{n}."],["Go to","进入"],["Extensions","Extensions"],[">",">"],["Modules.","Modules。"]]},
    {"tag":"p","source":"{n}. Find Trustpilot on the list and click Install.","atoms":[["{n}.","{n}."],["Find Trustpilot on the list and click","在列表中找到 Trustpilot，点击"],["Install.","Install（安装）。"]]},
    {"tag":"p","source":"{n}. To configure your settings, click the Trustpilot tab on your OpenCart left-hand menu.","atoms":[["{n}.","{n}."],["To configure your settings, click the","如需配置设置，请点击 OpenCart 左侧菜单中的"],["Trustpilot tab","Trustpilot 标签页"],["on your OpenCart left-hand menu.","。"]]},
    {"tag":"p","source":"{n}. Log into your Prestashop account and go to Modules > Module Manager.","atoms":[["{n}.","{n}."],["Log into your Prestashop account and go to","登录你的 PrestaShop 账户，依次进入"],["Modules","Modules"],[">",">"],["Module Manager.","Module Manager。"]]},
    {"tag":"p","source":"{n}. Click Upload a module, and upload the zip file from your computer.","atoms":[["{n}.","{n}."],["Click","点击"],["Upload a module","Upload a module（上传模块）"],[", and upload the zip file from your computer.","，从电脑上传该 ZIP 文件。"]]},
    {"tag":"p","source":"{n}. Once uploaded, click Configure to configure your settings.","atoms":[["{n}.","{n}."],["Once uploaded, click","上传完成后，点击"],["Configure","Configure（配置）"],["to configure your settings.","进行设置。"]]},
    {"tag":"p","source":"{n}. Go to Shopware > Configuration > Plugin Manager","atoms":[["{n}.","{n}."],["Go to Shopware > Configuration > Plugin Manager","进入 Shopware > Configuration > Plugin Manager。"]]},
    {"tag":"p","source":"{n}. Click Installed > Upload plugin","atoms":[["{n}.","{n}."],["Click Installed >","点击 Installed >"],["Upload plugin","Upload plugin（上传插件）"]]},
    {"tag":"p","source":"{n}. Go to WordPress > Admin > Plugins.","atoms":[["{n}.","{n}."],["Go to WordPress >","在 WordPress 中依次进入"],["Admin","管理后台"],[">",">"],["Plugins","插件"],[".","。"]]},
    {"tag":"p","source":"{n}. Click Plugins > Add new","atoms":[["{n}.","{n}."],["Click","点击"],["Plugins","插件"],[">",">"],["Add new","添加新插件"]]},
    {"tag":"p","source":"{n}. Log into your Segment account.","atoms":[["{n}.","{n}."],["Log into your Segment account.","登录你的 Segment 账户。"]]},
    {"tag":"p","source":"{n}. Go to Catalog and search for Trustpilot.","atoms":[["{n}.","{n}."],["Go to Catalog and search for Trustpilot.","进入 Catalog（目录）并搜索 Trustpilot。"]]},
    {"tag":"p","source":"{n}. Copy the integration key to connect Trustpilot to Segment. Remember to save after.","atoms":[["{n}.","{n}."],["Copy the integration key to connect Trustpilot to Segment. Remember to save after.","复制集成密钥以将 Trustpilot 连接到 Segment，完成后请记得保存。"]]},
    {"tag":"p","source":"If you need help integrating Trustpilot with Segment, check out our support article.","atoms":[["If you need help integrating Trustpilot with Segment, check out our","如在集成 Trustpilot 与 Segment 时需要帮助，请查看我们的"],["support article","支持文章"],[".","。"]]},
    {"tag":"li","source":"Send an email to '{email}' with the subject line 'Connect Trustpilot Integration'.","atoms":[["Send an email to","发送邮件至"],["'{email}'","“{email}”"],["with the subject line","，邮件主题填写"],["'Connect Trustpilot Integration'","“Connect Trustpilot Integration”"],[".","。"]]},
    {"tag":"p","source":"From PayPal, go to Account Settings and select Account access. Click Change next to Log in with PayPal, then click Delete next to Trustpilot App.","atoms":[["From PayPal, go to","在 PayPal 中前往"],["Account Settings","账户设置"],["and select","并选择"],["Account access","账户访问权限"],[". Click","。点击 Log in with PayPal 旁的"],["Change","更改"],["next to Log in with PayPal, then click","，然后点击 Trustpilot App 旁的"],["Delete","删除"],["next to Trustpilot App.","。"]]}
  ]
    }
  ];

  const ATTRS = ['placeholder', 'title', 'aria-label', 'alt', 'aria-description', 'value'];
  const BLOCK = [
    'script', 'style', 'noscript', 'code', 'pre', 'kbd', 'iframe',
    '[contenteditable]:not([contenteditable="false"])', 'read-frog', 'read-frog-selection',
    'blockquote', '.modal-review', '.copy-item__label',
    '.ot-c-name > dd', '.ot-c-host > dd', '.ot-c-description > dd',
    '[class*="DetailsDrawer-module__preview-field-value"]'
  ].join(',');
  const PRESERVED = new Set(["ABC-{n}","AED","AFN","AI","ALL","AMD","ANG","AO","AOA","API","APIs","ARS","AUD","AWG","AZN","Adobe Commerce (Magento) 2.x","Adult","Apple Mail","BAM","BBD","BCC","BDT","BGN","BHD","BIF","BMD","BND","BOB","BOV","BRL","BSD","BTC","BTN","BWP","BYN","BYR","BZD","BasicLink","BigCommerce","CAD","CDF","CHE","CHF","CHW","CLF","CLP","CNY","COP","COU","CRC","CRM","CSV","CUC","CUP","CVE","CZK","Carousel","Cookies","DJF","DKK","DOP","DZD","Dotdigital","Dotted","Drop-Down","EEK","EGP","ERN","ETB","ETH","EUR","Enterprise","FJD","FKP","Facebook","Faye","Flex","Free","GBP","GEL","GGP","GHC","GHS","GIP","GMD","GNF","GTIN","GTQ","GYD","Gmail","Go Compare","Google Tag Manager","Gorgias","Grid","Grubhub","HKD","HNL","HRK","HTG","HTML","HUF","Horizontal","HubSpot","IDR","ILS","IMP","INR","IQD","IRR","ISK","Inbox by Gmail","JEP","JMD","JOD","JPY","JSON","JavaScript","KES","KGS","KHR","KMF","KPW","KRW","KWD","KYD","KZT","Klaviyo","L","LAK","LBP","LKR","LRD","LSL","LTC","LTL","LVL","LYD","List","List Filtered","Log in with PayPal","M","MAD","MDL","MFA","MGA","MKD","MMK","MNT","MOP","MPN","MPN1","MRO","MRU","MUR","MVR","MWK","MXN","MXV","MYR","MZN","Magento","Magento Marketplace","Mailchimp","Micro Button","Micro Combo","Micro Review Count","Micro Star","Micro TrustScore","Mini","Mini Carousel","NAD","NGN","NIO","NOK","NPR","NZD","OMR","OneTrust","OpenCart","Outlook 2010 - 2016","Outlook 2010-2016","Outlook Webmail","Outlook {n}-{n}","PAB","PEN","PGK","PHP","PKR","PLN","PYG","PayPal","Pinterest","Plus","Polyester","Pop-Up","Premium","PrestaShop","Product Mini","Product Mini MultiSource","Product Reviews","Product Reviews Carousel","Product Reviews Gallery","Product Reviews MultiSource","Product Reviews MultiSource SEO","Product Reviews SEO","QAR","Quote","RED-SHOES-{n}","RMB","RON","RSD","RUB","RWF","Red","Red shoes","Red sports shoes.","Review Collector","S","SAR","SBD","SCR","SDG","SEK","SEO","SGD","SHP","SKU","SLL","SOS","SRD","SSP","STD","STN","SVC","SYP","SZL","Salesforce","Segment","Selph","ShoeBrand","Shopify","Shopware","Slack","Slider","Specsavers","Square","Starter","THB","TJS","TMT","TND","TOP","TRL","TRY","TTD","TVD","TWD","TZS","Team Viewer","Thunderbird","TrustBox","TrustBox Newsletter","TrustBox Signature","TrustScore","Trustpilot","Trustpilot APIs","Trustpilot Business","UAH","UGX","US {n}","USD","UYI","UYU","UYW","UZS","Unisex","VEF","VES","VND","VUV","Vecteezy","WST","Wix","Wix Bookings","Wix Events & Tickets","Wix Stores","WooCommerce","WordPress","XAF","XBT","XCD","XL","XOF","XPF","XS","XSU","XUA","YER","ZAR","ZMW","ZWD","ZWL","Zapier","Zendesk","{user} ({email})"]);

  const normalize = value => String(value || '').replace(/[\u2018\u2019]/g, "'").replace(/\s+/gu, ' ').trim();
  const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const placeholder = /\{(n|amount|date|email|user|url)\}/g;
  const patterns = {
    n: '[+-]?\\d+(?:,\\d{3})*(?:\\.\\d+)?(?:\\s?[%+])?',
    amount: '(?:[$€£¥]\\s*[\\d,.]+|(?:USD|EUR|GBP|CNY)\\s*[\\d,.]+|[\\d,.]+\\s*(?:USD|EUR|GBP|CNY))',
    date: '(?:\\d{4}[-/.]\\d{1,2}[-/.]\\d{1,2}(?:[ T][\\d:Z.+-]+)?|\\d{1,2}[-/.]\\d{1,2}[-/.]\\d{2,4}|[A-Za-z]+\\s+\\d{1,2}(?:,?\\s+\\d{4})?|\\d{1,2}\\s+[A-Za-z]+(?:\\s+\\d{4})?)',
    email: '[^\\s<>@]+@[^\\s<>@]+\\.[^\\s<>@]+',
    url: '(?:https?://[^\\s<>]+|www\\.[^\\s<>]+|\\.?[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)+)',
    user: '[^\\r\\n<>]{1,250}?'
  };
  function compile(source) {
    let expression = '^', offset = 0;
    for (const match of source.matchAll(placeholder)) {
      expression += escapeRegex(source.slice(offset, match.index)).replace(/\s+/gu, '\\s+') + '(' + patterns[match[1]] + ')';
      offset = match.index + match[0].length;
    }
    return new RegExp(expression + escapeRegex(source.slice(offset)).replace(/\s+/gu, '\\s+') + '$', 'u');
  }
  function templateResult(rule, text) {
    const match = rule.regex.exec(text);
    if (!match) return null;
    let index = 1;
    return rule.target.replace(placeholder, (_, kind) => {
      const val = match[index++];
      return kind === 'date' ? (translateDateTime(val) || val) : val;
    });
  }

  const MONTHS = {
    january: 1, jan: 1, february: 2, feb: 2, march: 3, mar: 3, april: 4, apr: 4,
    may: 5, june: 6, jun: 6, july: 7, jul: 7, august: 8, aug: 8,
    september: 9, sep: 9, sept: 9, october: 10, oct: 10, november: 11, nov: 11, december: 12, dec: 12
  };
  const WEEKDAYS = {
    monday: '周一', tuesday: '周二', wednesday: '周三', thursday: '周四',
    friday: '周五', saturday: '周六', sunday: '周日'
  };
  const TIME_UNITS = {
    second: '秒', seconds: '秒', minute: '分钟', minutes: '分钟',
    hour: '小时', hours: '小时', day: '天', days: '天',
    week: '周', weeks: '周', month: '个月', months: '个月', year: '年', years: '年'
  };
  function translateDateTime(text) {
    let m;
    if ((m = /^(\d+)\s+(seconds?|minutes?|hours?|days?|weeks?|months?|years?)\s+ago$/i.exec(text))) {
      return m[1] + ' ' + TIME_UNITS[m[2].toLowerCase()] + '前';
    }
    if ((m = /^(?:a|an)\s+(minute|hour|day|week|month|year)\s+ago$/i.exec(text))) {
      return '1 ' + TIME_UNITS[m[1].toLowerCase()] + '前';
    }
    if ((m = /^in\s+(\d+)\s+(minutes?|hours?|days?|weeks?|months?)$/i.exec(text))) {
      return m[1] + ' ' + TIME_UNITS[m[2].toLowerCase()] + '后';
    }
    if ((m = /^in\s+(?:a|an)\s+(minute|hour|day|week|month)$/i.exec(text))) {
      return '1 ' + TIME_UNITS[m[1].toLowerCase()] + '后';
    }
    if ((m = /^(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})$/i.exec(text))) {
      return m[2] + ' 年 ' + MONTHS[m[1].toLowerCase()] + ' 月';
    }
    if ((m = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec|January|February|March|April|June|July|August|September|October|November|December)\s+(\d{1,2}),\s*(\d{4})$/i.exec(text))) {
      return m[3] + ' 年 ' + MONTHS[m[1].toLowerCase()] + ' 月 ' + Number(m[2]) + ' 日';
    }
    if ((m = /^(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec|January|February|March|April|June|July|August|September|October|November|December)(?:\s+(\d{4}))?$/i.exec(text))) {
      const mo = MONTHS[m[2].toLowerCase()];
      return m[3] ? m[3] + ' 年 ' + mo + ' 月 ' + Number(m[1]) + ' 日' : mo + ' 月 ' + Number(m[1]) + ' 日';
    }
    if ((m = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\s+(\d{1,2})$/i.exec(text))) {
      return MONTHS[m[1].toLowerCase()] + ' 月 ' + Number(m[2]) + ' 日';
    }
    if ((m = /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),\s*(\d{4})\s+at\s+(\d{1,2}:\d{2})\s+(AM|PM)$/i.exec(text))) {
      const ap = m[6].toUpperCase() === 'AM' ? '上午' : '下午';
      return m[4] + ' 年 ' + MONTHS[m[2].toLowerCase()] + ' 月 ' + Number(m[3]) + ' 日（' + WEEKDAYS[m[1].toLowerCase()] + '）' + ap + ' ' + m[5];
    }
    if ((m = /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})$/i.exec(text))) {
      return MONTHS[m[2].toLowerCase()] + ' 月 ' + Number(m[3]) + ' 日（' + WEEKDAYS[m[1].toLowerCase()] + '）';
    }
    if ((m = /^(\d{1,2}:\d{2})\s+(AM|PM)$/i.exec(text))) {
      return (m[2].toUpperCase() === 'AM' ? '上午 ' : '下午 ') + m[1];
    }
    return null;
  }

  for (const rule of [...COMMON_RULES, ...SCOPES.flatMap(scope => scope.rules)]) rule.regex = compile(rule.source);
  for (const rule of SCOPES.flatMap(scope => scope.fragments)) {
    rule.regex = compile(rule.source);
    rule.spacedRegex = compile(rule.atoms.map(([s]) => s).join(' '));
    rule.atoms = rule.atoms.map(([source, target]) => ({ source, target, regex: compile(source) }));
  }

  let pathname = location.pathname, currentScopes = [], currentDynamic = [], currentFragments = new Map();
  function selectPath() {
    pathname = location.pathname;
    currentScopes = SCOPES.filter(scope => scope.path.test(pathname));
    currentDynamic = [...currentScopes.flatMap(scope => scope.rules), ...COMMON_RULES];
    currentFragments = new Map();
    for (const scope of currentScopes) {
      for (const rule of scope.fragments) {
        if (!currentFragments.has(rule.tag)) currentFragments.set(rule.tag, []);
        currentFragments.get(rule.tag).push(rule);
      }
    }
  }
  selectPath();

  const TITLE_MAP = new Map([
    ['Topics', '主题洞察 - Trustpilot Business']
  ]);
  function translateTitle() {
    const t = normalize(document.title);
    if (TITLE_MAP.has(t) && document.title !== TITLE_MAP.get(t)) document.title = TITLE_MAP.get(t);
  }

  function translate(text, element, raw = text) {
    for (const scope of currentScopes) if (scope.overrides.has(text)) return scope.overrides.get(text);
    for (const scope of currentScopes) if (scope.exact.has(text)) return scope.exact.get(text);
    if (COMMON_EXACT.has(text)) return COMMON_EXACT.get(text);
    const normRaw = normalize(raw);
    for (const rule of currentDynamic) {
      if (rule.guard && (!element || !element.matches(rule.guard))) continue;
      const result = templateResult(rule, normRaw);
      if (result !== null) return result;
    }
    return translateDateTime(text);
  }

  // 只处理已观察到的组件预览父框架标题；不访问框架内容。
  const widgetFrame = element => element?.tagName === 'IFRAME' && !element.parentElement?.closest(BLOCK) && /^https:\/\/widget\.trustpilot\.com\//.test(element.getAttribute('src') || '');
  const isSvgText = element => Boolean(element && element.closest('svg') && element.closest('text, tspan'));

  function skip(element, type = 'text') {
    if (!element || (element.closest(BLOCK) && !(type === 'attr' && widgetFrame(element)))) return true;
    if (element.closest('svg') && !isSvgText(element) && !(type === 'attr' && element.tagName.toLowerCase() === 'svg')) return true;
    if (type === 'text' && element.closest('input,textarea')) return true;
    if (element.closest('#business-account-selector') && !element.closest('button,a,label,[role="menu"],[role="dialog"]')) return true;
    const accountLabel = type === 'attr' && element.matches('#account-settings > section[aria-label="User information"],#account-settings > section[aria-label="用户信息"],#account-settings > ul[aria-label="Account information"],#account-settings > ul[aria-label="账户资料"]');
    if (element.closest('[aria-label="User information"],[aria-label="用户信息"]') && !accountLabel) return true;
    if (element.closest('#account-settings') && !element.closest('a,button,label') && !accountLabel) return true;
    if (element.closest('.widgets__widget__bottom__title')) return true;
    if (/^\/invitations(?:\/|$)/.test(pathname) && element.matches('[role="dialog"] > header h2') && element.closest('[role="dialog"]')?.querySelector('iframe[sandbox~="allow-same-origin"]')) return true;
    if (/^\/product-reviews\/product-catalog\/products\//.test(pathname) && element.closest('[class*="CDS_Breadcrumb_item"]:last-child span')) return true;
    const review = element.closest('[id^="review-"]');
    const detail = /^\/reviews\/(?!reported-reviews\/?$)[^/]+\/?$/.test(pathname) && element.closest('main, #shell-root') && !element.closest('#sidebar,#navigation-topbar');
    if ((review || detail) && !element.closest('[id^="review-actions-"]')) {
      if (element.closest('a[href="/reviews"]')) return false;
      if (element.closest('a[href*="/users/"],a[href*="/reviews/"]')) return true;
      const ownNorm = normalize(element.textContent);
      const parentNorm = normalize(element.parentElement?.textContent);
      const platform = /^(?:By:|by$|Source:|Reference number:|Showing \d+ out of \d+$|This review (?:does not|doesn't) count|Updated\b|COPY$|Reviewer contacted\.|来源：|参考编号：|显示第|这条评论不计入|更新于|作者：|复制$)/i;
      const isTime = /^(?:\d+\s+(?:seconds?|minutes?|hours?|days?|weeks?|months?|years?)\s+ago|Yesterday|Today|Just now|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},\s*\d{4}|(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),\s+[A-Za-z]+\s+\d{1,2}|\d{1,2}:\d{2}\s+(?:AM|PM)|at)$/i;
      if (!element.closest('button,label,select,option,[role="dialog"]') && !platform.test(ownNorm) && !platform.test(parentNorm) && !isTime.test(ownNorm)) return true;
    }
    const cell = element.closest('td');
    if (cell && pathname !== '/subscription/upgrade' && !element.closest('button,label,select,option,input,[role="menuitem"]')) {
      const table = cell.closest('table'), heading = table?.querySelectorAll('thead th')[cell.cellIndex];
      const hText = normalize(heading?.textContent);
      if (!/status|method|type|action|created|sent|updated|date|time|rating|状态|方式|类型|操作|创建|发送|更新|日期|时间|评分/i.test(hText) && !(type === 'attr' && (/\bout of 5 stars\b|Average star rating|^View invitation details$/i.test(element.getAttribute('title') || element.getAttribute('alt') || '')))) return true;
    }
    return false;
  }

  const originalText = new WeakMap(), originalAttributes = new WeakMap(), ownText = new WeakMap(), ownAttributes = new WeakMap();
  const keepWhitespace = (raw, replacement) => (raw.match(/^\s*/u)?.[0] || '') + replacement + (raw.match(/\s*$/u)?.[0] || '');
  function textSource(node) {
    const raw = node.nodeValue || '', previous = originalText.get(node);
    return previous && raw === previous.written ? previous.source : raw;
  }
  function writeText(node, source, result, fragment = false) {
    const value = result === '' ? '' : keepWhitespace(source, result);
    originalText.set(node, { source, written: value, fragment, path: pathname });
    if (node.nodeValue !== value) {
      ownText.set(node, value);
      node.nodeValue = value;
    }
  }
  function processText(node) {
    if (!node.isConnected || skip(node.parentElement)) return;
    const source = textSource(node), normalized = normalize(source);
    if (!normalized) return;
    const previous = originalText.get(node);
    if (previous?.fragment && previous.path === pathname && node.nodeValue === previous.written) return;
    // Context-only single word "by" inside review metadata
    if (normalized === 'by' && node.parentElement.closest('[id^="review-"], main') && /^\/reviews(?:\/|$)/.test(pathname)) {
      writeText(node, source, '作者：');
      return;
    }
    const result = translate(normalized, node.parentElement, source.trim());
    if (result !== null) writeText(node, source, result);
    else {
      if (previous && node.nodeValue === previous.written && previous.written !== source) {
        ownText.set(node, source);
        node.nodeValue = source;
        originalText.delete(node);
      }
      collectMiss(normalized, node.parentElement, 'text');
    }
  }
  function processAttributes(element) {
    if (skip(element, 'attr')) return;
    let cache = originalAttributes.get(element);
    if (!cache) originalAttributes.set(element, cache = new Map());
    for (const name of ATTRS) {
      if (element.tagName === 'IFRAME' && name !== 'title') continue;
      if (element.matches('#account-settings > section[aria-label="User information"],#account-settings > section[aria-label="用户信息"],#account-settings > ul[aria-label="Account information"],#account-settings > ul[aria-label="账户资料"]') && name !== 'aria-label') continue;
      if (name === 'value' && !(element.tagName === 'INPUT' && /^(button|submit|reset)$/i.test(element.type))) continue;
      if (!element.hasAttribute(name)) continue;
      const raw = element.getAttribute(name), previous = cache.get(name);
      const source = previous && raw === previous.written ? previous.source : raw;
      if (element.tagName === 'IFRAME' && !['Customer reviews powered by Trustpilot', 'Kundeanmeldelser fra Trustpilot'].includes(normalize(source))) continue;
      const result = translate(normalize(source), element, source.trim());
      if (result === null && previous && raw === previous.written) {
        let writes = ownAttributes.get(element);
        if (!writes) ownAttributes.set(element, writes = new Map());
        writes.set(name, source);
        element.setAttribute(name, source);
        cache.delete(name);
        continue;
      }
      if (result === null) { collectMiss(normalize(source), element, 'attr:' + name); continue; }
      const value = keepWhitespace(source, result);
      cache.set(name, { source, written: value });
      if (raw !== value) {
        let writes = ownAttributes.get(element);
        if (!writes) ownAttributes.set(element, writes = new Map());
        writes.set(name, value);
        element.setAttribute(name, value);
      }
    }
  }
  function leafNodes(element) {
    const output = [];
    const walker = (element.ownerDocument || document).createTreeWalker(element, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (!skip(node.parentElement) && !node.parentElement.closest('select,option') && normalize(textSource(node))) output.push(node);
    }
    return output;
  }
  function processFragment(element) {
    const rules = currentFragments.get(element.tagName.toLowerCase());
    if (!rules) return;
    let nodes = null;
    for (const rule of rules) {
      if (rule.guard && !element.closest(rule.guard)) continue;
      if (!nodes) nodes = leafNodes(element);
      if (nodes.length !== rule.atoms.length) continue;
      const joined = normalize(nodes.map(textSource).join(''));
      const spaced = normalize(nodes.map(n => textSource(n).trim()).join(' '));
      if (!rule.regex.test(joined) && !rule.regex.test(spaced) && !rule.spacedRegex.test(spaced)) continue;
      const results = nodes.map((node, index) => templateResult(rule.atoms[index], normalize(textSource(node))));
      if (results.some(result => result === null)) continue;
      nodes.forEach((node, index) => writeText(node, textSource(node), results[index], true));
      return;
    }
  }

  let debug = false;
  try { debug = localStorage.getItem('trustpilot.zhCN.debug') === '1'; } catch (_) { /* storage can be unavailable */ }
  const misses = new Map();
  function collectMiss(text, element, type) {
    if (!debug || !/[A-Za-z]{2}/.test(text) || PRESERVED.has(text) || misses.size >= 100) return;
    if (!element.closest('button,label,h1,h2,h3,h4,th,[role="tab"],[role="menuitem"],[role="option"],[role="alert"]') && !type.startsWith('attr:')) return;
    if (element.closest('#business-account-selector,#business-user-settings,[aria-label="User information"],[aria-label="用户信息"],#account-settings,td')) return;
    if (/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b/.test(text) && !/[.!?:]/.test(text)) return;
    if (/(?:key|token|secret|password)\s*[:=]\s*\S+/i.test(text)) return;
    const safe = text
      .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '{email}')
      .replace(/https?:\/\/\S+|\bwww\.\S+|\b[a-z0-9-]+(?:\.[a-z0-9-]+)*\.(?:com|net|org|io|ai|co|cn)\b/gi, '{url}')
      .replace(/\b(?:[a-f0-9]{16,}|[A-Za-z0-9_-]{20,})\b/g, '{id}')
      .replace(/["“”'][^"“”']+["“”']/g, '{user}')
      .replace(/[$€£¥]\s*[\d,.]+|\b\d[\d,.]*(?:%|\+)?\b/g, '{n}');
    const key = type + ':' + safe;
    misses.set(key, { text: safe, type, path: pathname.replace(/[a-f0-9]{16,64}|\b\d{5,}\b/gi, ':id'), count: (misses.get(key)?.count || 0) + 1 });
  }
  if (debug) setInterval(() => {
    if (!misses.size) return;
    console.groupCollapsed('[Trustpilot 简体中文] 未命中词典的界面文字');
    console.table([...misses.values()]);
    console.groupEnd();
    misses.clear();
  }, 5000);

  const roots = new Set();
  let activeWalker = null, activeRoot = null, scheduled = false;
  function schedule(root = document.documentElement) {
    if (root?.nodeType === 3) root = root.parentElement;
    if (!root || !root.isConnected || (root.closest?.(BLOCK) && !widgetFrame(root))) return;
    for (let parent = root, depth = 0; parent && depth < 6; parent = parent.parentElement, depth++) {
      if (currentFragments.has(parent.tagName?.toLowerCase())) { root = parent; break; }
    }
    if (root === document.documentElement) roots.clear();
    if (!roots.has(document.documentElement)) roots.add(root);
    if (!scheduled) { scheduled = true; setTimeout(flush, 28); }
  }
  function processElement(element) {
    if (widgetFrame(element)) { processAttributes(element); return; }
    if (element.closest(BLOCK)) return;
    processFragment(element);
    processAttributes(element);
  }
  function flush() {
    scheduled = false;
    applySystemFont();
    translateTitle();
    if (location.pathname !== pathname) {
      selectPath();
      activeWalker = null;
      activeRoot = null;
      roots.clear();
      roots.add(document.documentElement);
    }
    const end = performance.now() + 8;
    let visited = 0;
    while ((activeWalker || roots.size) && performance.now() < end && visited < 600) {
      if (!activeWalker) {
        activeRoot = roots.values().next().value;
        roots.delete(activeRoot);
        if (!activeRoot || !activeRoot.isConnected) continue;
        processElement(activeRoot);
        activeWalker = (activeRoot.ownerDocument || document).createTreeWalker(activeRoot, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
          acceptNode(node) { return node.nodeType === 1 && node.matches(BLOCK) && !widgetFrame(node) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT; }
        });
      }
      const node = activeWalker.nextNode();
      if (!node) { activeWalker = null; activeRoot = null; continue; }
      if (node.nodeType === 3) processText(node); else processElement(node);
      visited++;
    }
    if (activeWalker || roots.size) { scheduled = true; setTimeout(flush, 0); }
  }
  function observeChanges(records) {
    for (const record of records) {
      if (record.type === 'characterData') {
        if (ownText.get(record.target) === record.target.nodeValue) continue;
        schedule(record.target.parentElement);
      } else if (record.type === 'attributes') {
        if (ownAttributes.get(record.target)?.get(record.attributeName) === record.target.getAttribute(record.attributeName)) continue;
        schedule(record.target);
      } else {
        for (const node of record.addedNodes) schedule(node);
      }
    }
  }
  const observer = new MutationObserver(observeChanges);
  observer.observe(document, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  function routeChanged() {
    selectPath();
    translateTitle();
    activeWalker = null;
    activeRoot = null;
    schedule(document.documentElement);
  }
  for (const name of ['pushState', 'replaceState']) {
    const original = history[name];
    history[name] = function (...args) {
      const result = Reflect.apply(original, this, args);
      routeChanged();
      return result;
    };
  }
  window.addEventListener('popstate', routeChanged);
  document.addEventListener('DOMContentLoaded', () => { applySystemFont(); schedule(document.documentElement); }, { once: true });
  if (document.documentElement) schedule(document.documentElement);
})();
