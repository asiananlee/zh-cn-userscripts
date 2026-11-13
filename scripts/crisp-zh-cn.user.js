// ==UserScript==
// @name         Crisp 简体中文
// @namespace    https://github.com/asiananlee/zh-cn-userscripts
// @version      0.1.0
// @description  Crisp 网页后台的简体中文界面，保留用户内容、代码和凭据。
// @author       asiananlee
// @license      MIT
// @homepageURL  https://github.com/asiananlee/zh-cn-userscripts
// @supportURL   https://github.com/asiananlee/zh-cn-userscripts/issues
// @match        https://app.crisp.chat/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/*
 * 最后核对：2026-11-13
 * 覆盖范围：app.crisp.chat 登录后英文界面的导航、收件箱列表、AI 迁移提示、访客、联系人、知识库、活动、分析、插件、设置及窄屏下载提示。候选版，依据实站原文制作并在本地浏览器回归。
 * 已知未覆盖：会话与联系人详情、AI 迁移后的模块、知识库编辑器、Canvas 访客地图、跨域内容、部分动态提示及需特定数据或操作触发的状态。
 * 不翻译的内容：用户数据、第三方插件名称和介绍、代码、凭据、网址及用户输入。
 * 调试：将 localStorage 的 crisp.zhCN.debug 设为 '1' 后刷新。删除该键或设为 '0' 后刷新关闭。
 */

(() => {
  'use strict';

  const COMMON_EXACT = [
    ["AI Agent","AI 客服","text",".js-sidebar-item-link--agent > span.c-sidebar-item__inner-label"],
    ["Analytics","分析","text",".c-sidebar-controls div.c-base-select-menu-item__inner > span.c-base-select-menu-item__hint,.js-sidebar-item-link--analytics > span.c-sidebar-item__inner-label"],
    ["Appearance","外观","text",".c-help-popup div.c-field-select > label.c-field-label,.c-search-box div.c-field-select > label.c-field-label,.c-setup-popup div.c-field-select > label.c-field-label,.c-sidebar-controls div.c-field-select > label.c-field-label,.c-sidebar-menu-user div.c-field-select > label.c-field-label,.c-sidebar-menu-website div.c-field-select > label.c-field-label"],
    ["Ask anything, you'll get an answer from Hugo AI in a few seconds. A human operator can join the conversation if needed.","有问题尽管问，Hugo AI 会在几秒内回答。需要时可由人工客服加入会话。","text","div.c-base-popup__content > div.c-help-popup__description"],
    ["Automated","自动化","text",".js-sidebar-item-link--internal_agent > span.c-sidebar-item__inner-label"],
    ["Availability settings","在线状态设置","text",".c-sidebar-menu-user div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label"],
    ["Book a Demo","预约演示","text",".c-setup-popup span.c-base-button__inner > span.c-base-button__label"],
    ["Browse our Developer Hub","浏览开发者中心","text","div.c-help-popup__option-wrapper > div.c-help-popup__option-label"],
    ["Build an AI Chatbot","创建 AI 聊天机器人","text",".c-setup-popup div.c-setup-box__use-case-title > div.c-base-heading,div.c-setup-box__use-case-title > div.c-base-heading"],
    ["Campaigns","活动","text",".js-sidebar-item-link--campaigns > span.c-sidebar-item__inner-label"],
    ["Command palette","命令面板","text","div.c-search-footer__right > a.c-search-footer__swap"],
    ["Connect and enrich your user experience through Crisp SDK for React Native, iOs and Android.","通过适用于 React Native、iOS 和 Android 的 Crisp SDK 接入并改善用户体验。","text","div.c-setup-reward-card__description-wrapper > div.c-setup-reward-card__description"],
    ["Connect and manage your mailbox with Crisp","使用 Crisp 连接并管理邮箱","text",".c-setup-popup div.c-setup-reward-card__title > div.c-base-heading,div.c-setup-reward-card__title > div.c-base-heading"],
    ["Connect messaging channels","接入消息渠道","text",".c-setup-popup div.c-setup-reward-card__title > div.c-base-heading,div.c-setup-reward-card__title > div.c-base-heading"],
    ["Connect your Inbound Messaging channels to Crisp","将接收消息的渠道接入 Crisp","text","div.c-setup-reward-option__heading-left > div.c-setup-reward-option__title"],
    ["Contacts","联系人","text",".js-sidebar-item-link--contacts > span.c-sidebar-item__inner-label"],
    ["Create a new workspace","创建工作区","text",".c-sidebar-menu-website span.c-base-button__inner > span.c-base-button__label"],
    ["Create filter","创建筛选条件","text","span.c-sidebar-item__inner > span.c-sidebar-item__inner-label"],
    ["Create your first Shortcut to increase your teams' productivity","创建第一条快捷回复，提高团队效率","text","div.c-setup-reward-option__heading-left > div.c-setup-reward-option__title"],
    ["Create your Knowledge Base to make your customers more autonomous","创建知识库，方便客户自助查找答案","text","div.c-setup-reward-option__heading-left > div.c-setup-reward-option__title"],
    ["Crisp for Android","Crisp Android 版","text",".c-mobile-popup a.c-base-link > span"],
    ["Crisp for iOS","Crisp iOS 版","text",".c-mobile-popup a.c-base-link > span"],
    ["Customize your Chat Widget to make it fit with your brand identity","自定义聊天组件，使其符合品牌风格","text","div.c-setup-reward-option__heading-left > div.c-setup-reward-option__title"],
    ["Default Inboxes","默认收件箱","text","div.c-sidebar-sub-features__toggle > div.c-sidebar-sub-features__title"],
    ["Describe your question / issue…","描述你的问题…","placeholder",".c-help-popup div.c-field-textarea__container > textarea.c-field-textarea__field"],
    ["Download Crisp apps","下载 Crisp 应用","text","div.c-mobile-popup__container > h2.c-mobile-popup__title"],
    ["Embed Crisp widget within your mobile app","将 Crisp 组件嵌入移动应用","text",".c-setup-popup div.c-setup-reward-card__title > div.c-base-heading,div.c-setup-reward-card__title > div.c-base-heading"],
    ["Enable invisible mode","启用隐身模式","text",".c-sidebar-menu-user div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label"],
    ["English","英语","text",".c-help-popup div.c-field-select__field > div.c-field-select__option,.c-search-box div.c-field-select__field > div.c-field-select__option,.c-setup-popup div.c-field-select__field > div.c-field-select__option,.c-sidebar-controls div.c-field-select__field > div.c-field-select__option,.c-sidebar-menu-user div.c-field-select__field > div.c-field-select__option,.c-sidebar-menu-website div.c-field-select__field > div.c-field-select__option"],
    ["Enhance your productivity by learning our keyboard shortcuts! Check out the complete list of shortcuts available. As you use each shortcut, it will be highlighted for easy reference.","熟悉键盘快捷键可以提高操作效率。查看完整列表，每次使用快捷键时，列表会高亮对应项。","text",".c-setup-popup div.c-common-footer__content > div.c-common-footer__text"],
    ["Explore industry-related use-cases","探索行业用例","text",".c-setup-popup div.c-setup-title > div.c-base-heading,div.c-setup-title > div.c-base-heading"],
    ["Explore Keyboard Shortcuts","查看键盘快捷键","text",".c-setup-popup span.c-base-button__inner > span.c-base-button__label"],
    ["Explore the shortcuts, practice them, and see your efficiency soar while earning exclusive perks. Happy typing!","探索并练习快捷键，提高效率并解锁专属福利。","text",".c-setup-popup div.c-common-footer__content > div.c-common-footer__text"],
    ["Filters","筛选","text","div.c-sidebar-sub-features__toggle > div.c-sidebar-sub-features__title"],
    ["Find anything in your workspace…","搜索工作区内容…","text","div.c-search-input-editor__editor > div.c-search-input-editor__placeholder"],
    ["Find Video Courses","查找视频课程","text","div.c-help-popup__option-wrapper > div.c-help-popup__option-label"],
    ["Follow those quick tasks to setup Crisp and double your free trial!","完成这些快速设置任务，即可延长 Crisp 免费试用期至原来的两倍！","text","div.c-setup-box__progress-text > p.c-setup-box__progress-text-sub"],
    ["Get help","获取帮助","text",".c-help-popup div.c-base-headlines__title > span.c-base-headlines__title,.js-sidebar-item-link--help > span.c-sidebar-item__inner-label"],
    ["Get help using Crisp","获取 Crisp 使用帮助","text",".c-sidebar-menu-user div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label,div.c-setup-title__help > span.c-setup-title__help-text"],
    ["Get Started","开始使用","text",".c-setup-popup span.c-base-button__inner > span.c-base-button__label,.js-sidebar-item-link--setup > span.c-sidebar-item__inner-label,div.c-setup-widget__header > div.c-setup-widget__title"],
    ["Get Started 🚀","开始使用 🚀","text","div.c-setup-box__title-wrapper > h1.c-setup-box__title"],
    ["Go to Settings","前往设置","text",".c-mobile-popup span.c-base-button__inner > span.c-base-button__label"],
    ["Hide this","隐藏","text",".c-setup-popup span.c-base-button__inner > span.c-base-button__label"],
    ["Hugo AI replies instantly","Hugo AI 即时回复","text",".c-help-popup div.c-base-headlines > p.c-base-headlines__description"],
    ["I need help","我需要帮助","text",".c-setup-popup span.c-base-button__inner > span.c-base-button__label"],
    ["Import your customer data from your CRM","从 CRM 导入客户数据","text","div.c-setup-reward-option__heading-left > div.c-setup-reward-option__title"],
    ["Inbox","收件箱","text",".js-sidebar-item-link--inbox > span.c-sidebar-item__inner-label"],
    ["Install Crisp on your website","在网站上安装 Crisp","text",".c-setup-popup div.c-setup-reward-card__title > div.c-base-heading,div.c-setup-reward-card__title > div.c-base-heading"],
    ["Install Crisp Widget and connect with WordPress, Shopify, WooCommerce, Prestashop and more…","安装 Crisp 组件并接入 WordPress、Shopify、WooCommerce、PrestaShop 等平台…","text","div.c-setup-reward-card__description-wrapper > div.c-setup-reward-card__description"],
    ["Install our Mobile Apps to manage your customer support on the go","安装移动应用，随时管理客户支持","text","div.c-setup-reward-option__heading-left > div.c-setup-reward-option__title"],
    ["Invite an operator","邀请客服","text",".c-sidebar-menu-user div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label,.c-sidebar-menu-website span.c-base-button__inner > span.c-base-button__label"],
    ["Invite your Teammates to increase internal collaboration","邀请团队成员，促进内部协作","text","div.c-setup-reward-option__heading-left > div.c-setup-reward-option__title"],
    ["Knowledge Base","知识库","text",".js-sidebar-item-link--helpdesk > span.c-sidebar-item__inner-label"],
    ["Language","语言","text",".c-help-popup div.c-field-select > label.c-field-label,.c-search-box div.c-field-select > label.c-field-label,.c-setup-popup div.c-field-select > label.c-field-label,.c-sidebar-controls div.c-field-select > label.c-field-label,.c-sidebar-menu-user div.c-field-select > label.c-field-label,.c-sidebar-menu-website div.c-field-select > label.c-field-label"],
    ["Logout from app","退出登录","text",".c-sidebar-menu-user div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label"],
    ["Main Inbox","主收件箱","text",".js-sidebar-item-link--main > span.c-sidebar-item__inner-label"],
    ["Make sure your customers are always facing the most knowledgeable people from your team.","让客户始终由团队中最了解相关问题的成员接待。","text","div.c-setup-box__use-case-content > div.c-setup-box__use-case-description"],
    ["Make the most out of Crisp","充分利用 Crisp","text",".c-setup-popup div.c-setup-title > div.c-base-heading,div.c-setup-title > div.c-base-heading"],
    ["Manage account","管理账户","text",".c-sidebar-menu-user div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label"],
    ["Manage all your chats in one inbox by integrating Crisp with WhatsApp, Messenger, Instagram, Line, Telegram, and more.","将 Crisp 与 WhatsApp、Messenger、Instagram、LINE、Telegram 等渠道集成，在同一个收件箱管理所有对话。","text","div.c-setup-reward-card__description-wrapper > div.c-setup-reward-card__description"],
    ["Master Keyboard Shortcuts","掌握键盘快捷键","text",".c-setup-popup div.c-common-footer__container > div.c-base-heading"],
    ["more resources","更多资源","text","div.c-help-popup__divider > span.c-help-popup__divider-text"],
    ["New sub-inbox","新建子收件箱","text",".js-sidebar-item-link--create > span.c-sidebar-item__inner-label"],
    ["Open","打开","text",".c-setup-popup span.c-base-button__inner > span.c-base-button__label"],
    ["Open the chat","打开聊天","text","div.c-help-popup__option-wrapper > div.c-help-popup__option-label"],
    ["Or","或者","text","div.c-mobile-popup__container > p.c-mobile-popup__or"],
    ["Other Inboxes","其他收件箱","text","div.c-sidebar-sub-features__toggle > div.c-sidebar-sub-features__title"],
    ["Plugins","插件","text",".js-sidebar-item-link--plugins > span.c-sidebar-item__inner-label"],
    ["Recently viewed","最近访问","text",".c-sidebar-controls ul.c-base-select-menu__inner > div.c-base-select-menu__title"],
    ["Route conversations automatically","自动分配会话","text",".c-setup-popup div.c-setup-box__use-case-title > div.c-base-heading,div.c-setup-box__use-case-title > div.c-base-heading"],
    ["Same as System","跟随系统","text",".c-help-popup div.c-field-select__field > div.c-field-select__option,.c-search-box div.c-field-select__field > div.c-field-select__option,.c-setup-popup div.c-field-select__field > div.c-field-select__option,.c-sidebar-controls div.c-field-select__field > div.c-field-select__option,.c-sidebar-menu-user div.c-field-select__field > div.c-field-select__option,.c-sidebar-menu-website div.c-field-select__field > div.c-field-select__option"],
    ["Search","搜索","text",".js-sidebar-item-link--search > span.c-sidebar-item__inner-label"],
    ["Send Message","发送消息","text",".c-help-popup span.c-base-button__inner > span.c-base-button__label"],
    ["Settings","设置","text",".c-sidebar-controls div.c-base-select-menu-item__inner > span.c-base-select-menu-item__hint,.js-sidebar-item-link--settings > span.c-sidebar-item__inner-label"],
    ["Setup an omnichannel AI chatbot that gets trained on your data to skyrocket productivity and time to resolution","用你的数据训练全渠道 AI 聊天机器人，提高工作效率并缩短处理时间。","text","div.c-setup-box__use-case-content > div.c-setup-box__use-case-description"],
    ["Setup the Hugo AI Agent to automate customer support","设置 Hugo AI 客服，实现客服自动化","text","div.c-setup-reward-option__heading-left > div.c-setup-reward-option__title"],
    ["Spam","垃圾消息","text",".js-sidebar-item-link--spam > span.c-sidebar-item__inner-label"],
    ["Suggested actions","建议操作","text","div.c-spotlight__suggestion > div.c-spotlight__title"],
    ["Sync Crisp with Gmail, Outlook, or any email provider to centralize your email communication in Crisp.","将 Crisp 与 Gmail、Outlook 或其他邮件服务同步，集中管理邮件沟通。","text","div.c-setup-reward-card__description-wrapper > div.c-setup-reward-card__description"],
    ["to exit","退出","text","span.c-base-commands__command > span.c-base-commands__text"],
    ["to navigate","导航","text","span.c-base-commands__command > span.c-base-commands__text"],
    ["to select","选择","text","span.c-base-commands__command > span.c-base-commands__text"],
    ["To use Crisp on your mobile device, get the app.","在移动设备上使用 Crisp，请下载应用。","text","div.c-mobile-popup__container > p.c-mobile-popup__description"],
    ["Use keyboard shortcut for browser search","启用浏览器搜索快捷键","text",".c-search-box div.c-field-toggle__container > label.c-field-label"],
    ["View alerts","查看提醒","text",".c-sidebar-menu-user div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label"],
    ["Visit our Knowledge Base","访问知识库","text","div.c-help-popup__option-wrapper > div.c-help-popup__option-label"],
    ["Visitors","访客","text",".js-sidebar-item-link--visitors > span.c-sidebar-item__inner-label"],
    ["What's new?","有什么新功能？","text",".c-sidebar-menu-user div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label"],
    ["Workspace settings","工作区设置","text",".c-sidebar-menu-user div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label"],
    ["Your Inboxes","你的收件箱","text","div.c-sidebar-sub-features__toggle > div.c-sidebar-sub-features__title"]
  ];
  const COMMON_RULES = [
    ["+{n} days","+{n} 天","text",".c-setup-popup .c-base-badge__content"],
    ["+{n} day","+{n} 天","text",".c-setup-popup .c-base-badge__content"],
    ["💬{n} - Inbox | Crisp","💬{n} - 收件箱 | Crisp","text","head > title"],
    ["💬{n} - Analytics | Crisp","💬{n} - 分析 | Crisp","text","head > title"],
    ["💬{n} - AI Agent | Crisp","💬{n} - AI 客服 | Crisp","text","head > title"],
    ["💬{n} - Settings | Crisp","💬{n} - 设置 | Crisp","text","head > title"]
  ];
  const SCOPES = [
    // I · inbox · ^/website/[^/]+/inbox(?:/spam)?/?$
    {
      id: "I", slug: "inbox", path: /^\/website\/[^\/]+\/inbox(?:\/spam)?\/?$/u,
      exact: [
        ["All","全部","text","div.c-base-tab > span.c-base-tab__label,span.c-base-button__inner > span.c-base-button__label"],
        ["Automate spam","自动处理垃圾消息","text","p.c-base-floating-alert__title-wrap > span.c-base-floating-alert__title"],
        ["Change list layout","更改列表布局","text","div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label"],
        ["Configure my Spam Filter","配置垃圾消息筛选","text","span.c-base-button__inner > span.c-base-button__label"],
        ["Configure your spam filter","配置垃圾消息筛选规则","text","div.c-feature-bento__title > h6.c-feature-bento__title-text"],
        ["Connect messaging channels","接入消息渠道","text","div.c-base-feature-highlight > p.c-base-feature-highlight__title"],
        ["Create rules","创建规则","text","p.c-base-floating-alert__title-wrap > a.c-base-floating-alert__action"],
        ["Crisp runs spam checks on all messages you receive. Messages that are likely spam end up here. If we made a mistake, you can still move a spam to your Main Inbox.","Crisp 会检查所有收到的消息。疑似垃圾消息会出现在这里。若发生误判，你可以将消息移回主收件箱。","text","div.c-feature-bento > p.c-feature-bento__subtitle"],
        ["Customize","自定义","text","div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label"],
        ["Filters","筛选","text","span.c-base-button__inner > span.c-base-button__label"],
        ["Get Started","开始使用","text","span.c-base-button__inner > span.c-base-button__label"],
        ["Go to Inbox settings","前往收件箱设置","text","div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label"],
        ["Manage all your chats in one inbox by integrating Crisp with WhatsApp, Messenger, Instagram, Line, Telegram, and more.","将 Crisp 与 WhatsApp、Messenger、Instagram、LINE、Telegram 等渠道集成，在同一个收件箱管理所有对话。","text","div.c-base-feature-highlight > p.c-base-feature-highlight__description"],
        ["Mark all messages as read","将所有消息标为已读","text","div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label"],
        ["Move messages you do not want to spam with Automatic Triage rules.","使用自动分流规则，将你不想收到的消息移至垃圾消息。","text","div.c-base-floating-alert > p.c-base-floating-alert__message"],
        ["New custom filter…","新建自定义筛选…","text","span.c-base-button__inner > span.c-base-button__label"],
        ["No custom filters","暂无自定义筛选","text","div.c-base-empty-spot > div.c-base-empty-spot__title"],
        ["No spam.","暂无垃圾消息。","text","div.c-base-empty-spot > div.c-base-empty-spot__title"],
        ["Resolve all conversations","将所有会话标为已解决","text","div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label"],
        ["See keyboard shortcuts…","查看键盘快捷键…","text","div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label"],
        ["Spam","垃圾消息","text","div.c-spam-menu__header > span.c-spam-menu__title"],
        ["Spam filters help keep your Inbox clean","用垃圾消息筛选保持收件箱整洁","text","div.c-feature-bento__title > h6.c-feature-bento__title-text"],
        ["Start review mode","开始审查模式","text","div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label"],
        ["You are all good, you have no spam pending for review.","没有待审查的垃圾消息。","text","div.c-base-empty-spot > div.c-base-empty-spot__description"],
        ["You can tune your spam filter options so that more emails get to your Inbox, or else more emails go to Spam.","你可以调整垃圾消息筛选设置，让更多邮件进入收件箱，或将更多邮件归为垃圾消息。","text","div.c-feature-bento > p.c-feature-bento__subtitle"],
        ["You have no available custom filters","暂无可用的自定义筛选条件","text","div.c-base-empty-spot > div.c-base-empty-spot__description"]
      ],
      rules: [],
      overrides: [],
      fragments: []
    },
    // H · agent · ^/website/[^/]+/agent/?$
    {
      id: "H", slug: "agent", path: /^\/website\/[^\/]+\/agent\/?$/u,
      exact: [
        ["AI Agent | Crisp","AI 客服 | Crisp","text","head > title"],
        ["Built-in AI integrations (Shopify, Stripe, MCP,...)","内置 AI 集成（Shopify、Stripe、MCP 等）","text","p.c-base-headlines__description > span"],
        ["Built-in automation analytics","内置自动化分析","text","p.c-base-headlines__description > span"],
        ["Cancel","取消","text","span.c-base-button__inner > span.c-base-button__label"],
        ["Easier interface","更易用的界面","text","p.c-base-headlines__description > span"],
        ["Hugo is now available in your workspace","你的工作区现已支持 Hugo","text","div.c-base-headlines__title > span.c-base-headlines__title"],
        ["Hugo is our new AI Agent that unifies Chatbot and MagicReply into one smarter system.","Hugo 是新版 AI 客服，将 Chatbot 和 MagicReply 整合到同一个系统中。","text","div.c-base-headlines > p.c-base-headlines__description"],
        ["Hugo remains inactive until you decide to activate it.","Hugo 会保持停用，直到你主动启用。","text","p.c-base-headlines__description > span"],
        ["Migrate my chatbot","迁移我的聊天机器人","text","span.c-base-button__inner > span.c-base-button__label"],
        ["Nothing breaks","现有功能照常运行","text","div.c-base-notice > p"],
        ["Takes 5 seconds. Fully reversible.","耗时 5 秒，可完全撤销。","text","div.c-base-headlines > p.c-base-headlines__description"],
        ["Unlocks the Hugo AI Agent","解锁 Hugo AI 客服","text","p.c-base-headlines__description > span"],
        ["What happens?","迁移后会怎样？","text","p.c-base-headlines__description > span"],
        ["Why migrate?","为什么要迁移？","text","p.c-base-headlines__description > span"],
        ["Your existing scenarios are migrated automatically and continue to work exactly as before.","现有场景会自动迁移，并继续按原有方式运行。","text","div.c-base-headlines > p.c-base-headlines__description"],
        ["Your shortcuts, workflows, and triggers all stay in place. Migrating simply unlocks the new AI Agent section.","快捷回复、工作流和触发器都会保留。迁移只会解锁新版 AI 客服页面。","text","div.c-base-notice > p"]
      ],
      rules: [],
      overrides: [],
      fragments: []
    },
    // V · visitors · ^/website/[^/]+/visitors/?$
    {
      id: "V", slug: "visitors", path: /^\/website\/[^\/]+\/visitors\/?$/u,
      exact: [
        ["Filter by name, city…","按名称、城市筛选…","placeholder","div.c-field-input__container > input.c-field-input__field"],
        ["Live","实时","text","span.c-visitors-box-menu__header-blinker > span.c-visitors-box-menu__header-blinker-text"],
        ["Visitors","访客","text","div.c-visitors-box-menu__header-wrapper > span.c-visitors-box-menu__header-title"],
        ["Visitors | Crisp","访客 | Crisp","text","head > title"]
      ],
      rules: [],
      overrides: [],
      fragments: []
    },
    // C · contacts · ^/website/[^/]+/contacts/?$
    {
      id: "C", slug: "contacts", path: /^\/website\/[^\/]+\/contacts\/?$/u,
      exact: [
        ["Actions","操作","text","span.c-base-button__inner > span.c-base-button__label"],
        ["Already have contacts in a different CRM? Import all your contacts in Crisp","在其他 CRM 中已有联系人？将联系人导入 Crisp","text","div.c-base-banner > div.c-base-banner__content"],
        ["Company","公司","text","div.c-common-table__th > div.c-common-table__title"],
        ["Contacts","联系人","text","div.c-base-header__headline > div.c-base-header__title"],
        ["Contacts | Crisp","联系人 | Crisp","text","head > title"],
        ["Documentation","文档","text","span.c-base-button__inner > span.c-base-button__label"],
        ["Email","电子邮件","text","div.c-common-table__th > div.c-common-table__title"],
        ["Export contact profiles","导出联系人资料","text","div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label"],
        ["Full Name","姓名","text","div.c-common-table__th > div.c-common-table__title"],
        ["Import contact profiles","导入联系人资料","text","div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label"],
        ["Import Contacts","导入联系人","text","span.c-base-button__inner > span.c-base-button__label"],
        ["Last Active","最近活跃","text","div.c-common-table__th > div.c-common-table__title"],
        ["Location","位置","text","div.c-common-table__th > div.c-common-table__title"],
        ["New Contact","新建联系人","text","span.c-base-button__inner > span.c-base-button__label"],
        ["Phone","电话","text","div.c-common-table__th > div.c-common-table__title"],
        ["Preview","预览","text","div.c-common-table__th > div.c-common-table__title"],
        ["Search","搜索","placeholder","div.c-field-input__container > input.c-field-input__field"],
        ["Segments","分群","text","div.c-common-table__th > div.c-common-table__title"]
      ],
      rules: [
        ["{n} Contacts","{n} 位联系人","text",".c-base-header__headline > .c-base-header__title"]
      ],
      overrides: [],
      fragments: []
    },
    // K · helpdesk · ^/website/[^/]+/helpdesk/(?:articles/?$|settings(?:/|$))
    {
      id: "K", slug: "helpdesk", path: /^\/website\/[^\/]+\/helpdesk\/(?:articles\/?$|settings(?:\/|$))/u,
      exact: [
        ["Add a language","添加语言","text","span.c-base-button__inner > span.c-base-button__label"],
        ["Add a page redirect","添加页面重定向","text","span.c-base-button__inner > span.c-base-button__label"],
        ["Admin MCP Server","管理端 MCP 服务器","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Advanced options for special needs can be configured here.","在此配置特殊场景所需的高级选项。","text","div.c-settings-header__inner > div.c-settings-header__description"],
        ["Advanced Settings","高级设置","text","div.c-content-navigate-breadcrumb__section > span,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text"],
        ["Advanced settings for your Knowledge Base","知识库高级设置","text","div.c-settings-header__main > h2.c-settings-header__title"],
        ["All languages","所有语言","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Authentication","身份验证","text","div.c-content-navigate-breadcrumb__section > span,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text"],
        ["Authentication provider","身份验证提供商","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Banner","横幅","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Basic domain","基础域名","text","div.c-field-input__header > label.c-field-label"],
        ["Basic domain online","基础域名已启用","text","span.c-setup-domain-domains__status > span"],
        ["Change how your Knowledge Base site appears to your users.","更改用户看到的知识库外观。","text","div.c-settings-header__inner > div.c-settings-header__description"],
        ["Code includes","嵌入代码","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Coming Soon","即将推出","text","div.c-coming-soon__heading > span.c-coming-soon__title"],
        ["Configure a list of page URLs to redirect to other URLs. This can be used to migrate from a previous provider.","配置页面 URL 重定向列表，可用于从旧平台迁移。","text","div.c-settings-header__inner > div.c-settings-header__description"],
        ["Configure the features of your Knowledge Base","配置知识库功能","text","div.c-settings-header__main > h2.c-settings-header__title"],
        ["Configure your multilingual Knowledge Base","配置多语言知识库","text","div.c-settings-header__main > h2.c-settings-header__title"],
        ["Content","内容","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Create an MCP Server from your Knowledge Base","为知识库创建 MCP 服务器","text","div.c-settings-header__main > h2.c-settings-header__title"],
        ["Custom domain","自定义域名","text","div.c-field-input__header > label.c-field-label"],
        ["Customization","自定义","text","div.c-content-navigate-breadcrumb__section > span,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text"],
        ["Customize the appearance of your Knowledge Base","自定义知识库外观","text","div.c-settings-header__main > h2.c-settings-header__title"],
        ["Data Import & Export","数据导入与导出","text","div.c-content-navigate-breadcrumb__section > span,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text"],
        ["Domain name","域名","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Domain Setup","域名设置","text","div.c-content-navigate-breadcrumb__section > span,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text"],
        ["Enable an MCP Server serving your Knowledge Base content and allowing AI tools to search and edit articles.","启用 MCP 服务器，提供知识库内容，让 AI 工具能够搜索和编辑文章。","text","div.c-settings-header__inner > div.c-settings-header__description"],
        ["Enable or disable features, and change the behavior of certain functions of your Knowledge Base.","启用或停用功能，并更改部分功能的行为。","text","div.c-settings-header__inner > div.c-settings-header__description"],
        ["Export content from Crisp","从 Crisp 导出内容","text","div.c-field-link > label.c-field-label"],
        ["Export Knowledge Base","导出知识库","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Export my Knowledge Base","导出我的知识库","text","span.c-base-button__inner > span.c-base-button__label"],
        ["Features","功能","text","div.c-content-navigate-breadcrumb__section > span,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text"],
        ["General","常规","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Homepage","首页","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Import & Export your Knowledge Base data","导入和导出知识库数据","text","div.c-settings-header__main > h2.c-settings-header__title"],
        ["Import content from provider","从原平台导入内容","text","div.c-field-link > label.c-field-label"],
        ["Import content from your previous provider, or export your data from Crisp.","从原平台导入内容，或从 Crisp 导出数据。","text","div.c-settings-header__inner > div.c-settings-header__description"],
        ["Import from another Knowledge Base","从其他知识库导入","text","span.c-base-button__inner > span.c-base-button__label"],
        ["Import Knowledge Base","导入知识库","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Knowledge Base","知识库","text","div.c-content-navigate-breadcrumb__path > a.c-content-navigate-breadcrumb__link,div.c-section-menu__topbar > div.c-section-menu__title"],
        ["Localization","本地化","text","div.c-content-navigate-breadcrumb__section > span,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text"],
        ["Logo","标志","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Main language","主要语言","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Maintenance tasks","维护任务","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["MCP Server","MCP 服务器","text","div.c-content-navigate-breadcrumb__section > span,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text"],
        ["New Article","新建文章","text","span.c-base-button__inner > span.c-base-button__label"],
        ["No language added yet.","尚未添加语言。","text","div.c-base-empty-spot > div.c-base-empty-spot__title"],
        ["No page redirection yet.","尚未添加页面重定向。","text","div.c-base-empty-spot > div.c-base-empty-spot__title"],
        ["Page redirections","页面重定向","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Page Redirections","页面重定向","text","div.c-content-navigate-breadcrumb__section > span,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text"],
        ["Password-protect your Knowledge Base","为知识库设置密码保护","text","div.c-settings-header__main > h2.c-settings-header__title"],
        ["Public MCP Server","公共 MCP 服务器","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Re-generate all your Knowledge Base pages","重新生成所有知识库页面","text","div.c-website-helpdesk-settings-advanced__task-text > h6"],
        ["read access","读取权限","text","span.c-base-badge > div.c-base-badge__content"],
        ["Redirect old page URLs to new URLs","将旧页面 URL 重定向至新 URL","text","div.c-settings-header__main > h2.c-settings-header__title"],
        ["Run full re-synchronization","运行完整重新同步","text","span.c-base-button__inner > span.c-base-button__label"],
        ["Search","搜索","text","div.c-content-navigate-breadcrumb__search > span.c-content-navigate-breadcrumb__search-label"],
        ["Search in your articles...","搜索文章…","placeholder","div.c-field-input__container > input.c-field-input__field"],
        ["Set up a basic domain, and an optional custom domain using your own domain name for your site.","设置基础域名，也可用你自己的域名作为自定义域名。","text","div.c-settings-header__inner > div.c-settings-header__description"],
        ["Set up authentication to protect certain or all pages, and only allow certain users through.","设置身份验证，保护部分或全部页面，仅允许指定用户访问。","text","div.c-settings-header__inner > div.c-settings-header__description"],
        ["Settings","设置","text","div.c-content-navigate-breadcrumb__path > a.c-content-navigate-breadcrumb__link,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text,div.c-section-menu__topbar > div.c-section-menu__title"],
        ["Setup a domain name for your Knowledge Base","为知识库设置域名","text","div.c-settings-header__main > h2.c-settings-header__title"],
        ["Setup instructions","配置说明","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["They will appear here once available.","功能上线后将显示在这里。","text","div.c-coming-soon__text > p.c-coming-soon__text-line"],
        ["This workspace is not linked to any payment method. Link one to keep your subscription.","该工作区尚未关联支付方式。关联支付方式可维持续订。","text","div.c-base-alert__content > div"],
        ["User Docs","用户文档","text","div.c-helpdesk-tree__side > div.c-helpdesk-tree__title"],
        ["View Details","查看详情","text","span.c-base-button__inner > span.c-base-button__label"],
        ["View Online","在线查看","text","span.c-base-button__label > span"],
        ["We are working on a lot of exciting new features for your Knowledge Base.","我们正在为知识库开发新功能。","text","div.c-coming-soon__text > p.c-coming-soon__text-line"],
        ["write access","写入权限","text","span.c-base-badge > div.c-base-badge__content"],
        ["You can request a full re-synchronization of all your online pages. This will read all the content that you see on your Crisp dashboard and force a manual refresh on your online Knowledge Base, from scratch.","可请求重新同步所有在线页面。系统会读取 Crisp 后台中的全部内容，从头刷新在线知识库。","text","div.c-website-helpdesk-settings-advanced__task-text > p"],
        ["You normally do not have to run those tasks, but if something on your Knowledge Base feels broken then it might be a good time to run a maintenance.","通常无需运行这些任务。知识库出现异常时，可以尝试维护。","text","div.c-base-alert__content > div"],
        ["Your Knowledge Base can speak multiple languages! Define how localization behaves here.","知识库支持多种语言。可在此配置语言显示方式。","text","div.c-settings-header__inner > div.c-settings-header__description"]
      ],
      rules: [
        ["{n} articles for","{n} 篇文章，语言为","text",".c-helpdesk-tree__statistics > span"]
      ],
      overrides: [],
      fragments: []
    },
    // M · campaigns · ^/website/[^/]+/campaigns/(?:types/(?:all|automated|one-shot)|tags/all|templates/(?:all|static|custom))/?$
    {
      id: "M", slug: "campaigns", path: /^\/website\/[^\/]+\/campaigns\/(?:types\/(?:all|automated|one-shot)|tags\/all|templates\/(?:all|static|custom))\/?$/u,
      exact: [
        ["Actions","操作","text","div.c-common-table__th > div.c-common-table__title,span.c-base-button__inner > span.c-base-button__label"],
        ["All Tags","所有标签","text","div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text"],
        ["All Templates","所有模板","text","div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text"],
        ["All Types","所有类型","text","div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text"],
        ["Automated","自动化","text","div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text"],
        ["Campaign Name","活动名称","text","div.c-common-table__th > div.c-common-table__title"],
        ["Campaigns","活动","text","div.c-base-header__headline > div.c-base-header__title"],
        ["Campaigns | Crisp","活动 | Crisp","text","head > title"],
        ["Campaigns are used to send emails to targeted contacts. Create your first one!","可通过活动向指定联系人发送邮件。创建你的第一个活动。","text","div.c-base-empty-spot > div.c-base-empty-spot__description"],
        ["Contacts","联系人","text","div.c-common-table__th > div.c-common-table__title"],
        ["Crisp Templates","Crisp 模板","text","div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text"],
        ["Documentation","文档","text","span.c-base-button__inner > span.c-base-button__label"],
        ["Duplicate selected campaigns","复制选中的活动","text","div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label"],
        ["Last Update","最后更新","text","div.c-common-table__th > div.c-common-table__title"],
        ["New Campaign","新建活动","text","span.c-base-button__inner > span.c-base-button__label"],
        ["New Template","新建模板","text","span.c-base-button__inner > span.c-base-button__label"],
        ["One-Shot","单次活动","text","div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text"],
        ["Remove selected campaigns","移除选中的活动","text","div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label"],
        ["Search","搜索","placeholder","div.c-field-input__container > input.c-field-input__field"],
        ["Status","状态","text","div.c-common-table__th > div.c-common-table__title"],
        ["Tags","标签","text","div.c-section-menu-accordion__label-wrapper > span.c-section-menu-accordion__label"],
        ["Templates","模板","text","div.c-base-header__headline > div.c-base-header__title,div.c-section-menu-accordion__label-wrapper > span.c-section-menu-accordion__label"],
        ["Types","类型","text","div.c-section-menu-accordion__label-wrapper > span.c-section-menu-accordion__label"],
        ["You have no campaign.","暂无活动。","text","div.c-base-empty-spot > div.c-base-empty-spot__title"],
        ["Your Templates","你的模板","text","div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text"]
      ],
      rules: [],
      overrides: [],
      fragments: []
    },
    // A · analytics · ^/website/[^/]+/analytics(?:/|$)
    {
      id: "A", slug: "analytics", path: /^\/website\/[^\/]+\/analytics(?:\/|$)/u,
      exact: [
        ["Add chart","添加图表","text","span.c-base-button__inner > span.c-base-button__label"],
        ["Analytics","分析","text","div.c-base-header__headline > div.c-base-header__title"],
        ["Analytics | Crisp","分析 | Crisp","text","head > title"],
        ["Articles","文章","text","div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text"],
        ["Assigned","已分配","text","div.c-common-table__th > div.c-common-table__title"],
        ["Automated Conversations","自动化处理的会话","text","div.c-analytics-metric__title-wrapper > div.c-analytics-metric__title"],
        ["Automation Rating","自动化评分","text","div.c-analytics-metric__title-wrapper > div.c-analytics-metric__title"],
        ["Automations","自动化","text","div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text"],
        ["Campaigns Activity","活动互动","text","div.c-analytics-metric__title-wrapper > div.c-analytics-metric__title,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text"],
        ["Campaigns Reach","活动触达","text","div.c-analytics-metric__title-wrapper > div.c-analytics-metric__title"],
        ["Campaigns Reached","活动触达","text","div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text"],
        ["Channels","渠道","text","div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text"],
        ["Charts can either be duplicated from existing chart using \"Add to dashboard\" or created from this page.","可在现有图表上选择“添加到仪表盘”来复制图表，也可在此创建图表。","text","div.c-website-analytics-generic__empty > div.c-base-heading"],
        ["Chat Conversations","聊天会话","text","div.c-analytics-metric__title-wrapper > div.c-analytics-metric__title"],
        ["Comment","评论","text","div.c-common-table__th > div.c-common-table__title"],
        ["Contacts","联系人","text","div.c-section-menu-accordion__label-wrapper > span.c-section-menu-accordion__label"],
        ["Contacts Saved","新增联系人","text","div.c-analytics-metric__title-wrapper > div.c-analytics-metric__title,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text"],
        ["Contacts Saved Since A Week","最近一周新增联系人","text","div.c-analytics-metric__title-wrapper > div.c-analytics-metric__title"],
        ["Contacts Saved Yesterday","昨日新增联系人","text","div.c-analytics-metric__title-wrapper > div.c-analytics-metric__title"],
        ["Conversation state changes can take up to 15 minutes to appear.","会话状态的变化最多需要 15 分钟才会显示。","text","div.c-website-analytics-generic__live-latency > span"],
        ["Conversations","会话数","text","div.c-analytics-metric__title-wrapper > div.c-analytics-metric__title,div.c-common-table__th > div.c-common-table__title"],
        ["Conversations Per First Response Origin","按首次回复来源统计会话","text","div.c-analytics-metric__title-wrapper > div.c-analytics-metric__title"],
        ["Conversations Per Operator","按客服统计会话","text","div.c-analytics-metric__title-wrapper > div.c-analytics-metric__title"],
        ["Conversations Per Period","各时段会话数","text","div.c-analytics-metric__title-wrapper > div.c-analytics-metric__title"],
        ["Conversations Per Segment","按分群统计会话","text","div.c-analytics-metric__title-wrapper > div.c-analytics-metric__title"],
        ["Conversations SLA (above 1 hour on Office Hour)","会话 SLA（工作时段内超过 1 小时）","text","div.c-analytics-metric__title-wrapper > div.c-analytics-metric__title"],
        ["Conversations SLA Per Period (above 1 hour)","各时段会话 SLA（超过 1 小时）","text","div.c-analytics-metric__title-wrapper > div.c-analytics-metric__title"],
        ["Create new dashboard","新建仪表盘","text","div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text"],
        ["Custom date range","自定义日期范围","text","span.c-base-button__inner > span.c-base-button__label"],
        ["Daily Triggers","每日触发次数","text","div.c-analytics-metric__title-wrapper > div.c-analytics-metric__title"],
        ["Daily Visits","每日访问量","text","div.c-analytics-metric__title-wrapper > div.c-analytics-metric__title"],
        ["Dashboards","仪表盘","text","div.c-section-menu-accordion__label-wrapper > span.c-section-menu-accordion__label"],
        ["Data refreshed every 60 seconds","每 60 秒刷新一次数据","text","div.c-website-analytics-generic__live-refresh > span.c-website-analytics-generic__live-text"],
        ["Date","日期","text","div.c-common-table__th > div.c-common-table__title"],
        ["Downtimes","服务中断","text","div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text"],
        ["Downtimes Per Node","按节点统计中断次数","text","div.c-analytics-metric__title-wrapper > div.c-analytics-metric__title"],
        ["Email Conversations","邮件会话","text","div.c-analytics-metric__title-wrapper > div.c-analytics-metric__title"],
        ["First Response Time","首次响应时间","text","div.c-analytics-metric__title-wrapper > div.c-analytics-metric__title"],
        ["First Response time (Average)","首次响应时间（平均值）","text","div.c-common-table__th > div.c-common-table__title"],
        ["First Response time (Median)","首次响应时间（中位数）","text","div.c-common-table__th > div.c-common-table__title"],
        ["First Response Time (on Office Hour)","首次响应时间（工作时段内）","text","div.c-analytics-metric__title-wrapper > div.c-analytics-metric__title"],
        ["First Response Time Per Period","各时段首次响应时间","text","div.c-analytics-metric__title-wrapper > div.c-analytics-metric__title"],
        ["Fri","周五","text","div.c-analytics-metric-heat-map__labels > div.c-analytics-metric-heat-map__label"],
        ["Fully Automated Conversations","全自动处理的会话","text","div.c-analytics-metric__title-wrapper > div.c-analytics-metric__title"],
        ["Human First Response Time","人工首次响应时间","text","div.c-analytics-metric__title-wrapper > div.c-analytics-metric__title"],
        ["Knowledge Base","知识库","text","div.c-section-menu-accordion__label-wrapper > span.c-section-menu-accordion__label"],
        ["Knowledge Base Visits","知识库访问量","text","div.c-analytics-metric__title-wrapper > div.c-analytics-metric__title,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text"],
        ["Last month — 1st to 31st","上月（1 日至 31 日）","text","div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label"],
        ["Last week — Monday to Sunday","上周（周一至周日）","text","div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label"],
        ["Last year — January to December","去年（1 月至 12 月）","text","div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label"],
        ["Messages Per Operator","按客服统计消息","text","div.c-analytics-metric__title-wrapper > div.c-analytics-metric__title"],
        ["Messaging","消息","text","div.c-section-menu-accordion__label-wrapper > span.c-section-menu-accordion__label"],
        ["Mon","周一","text","div.c-analytics-metric-heat-map__labels > div.c-analytics-metric-heat-map__label"],
        ["Most Used Conversation Channels","最常用的会话渠道","text","div.c-analytics-metric__title-wrapper > div.c-analytics-metric__title"],
        ["Most Used Segments","最常用的分群","text","div.c-analytics-metric__title-wrapper > div.c-analytics-metric__title"],
        ["Most Used Shortcuts","最常用的快捷回复","text","div.c-analytics-metric__title-wrapper > div.c-analytics-metric__title"],
        ["Name","名称","text","div.c-common-table__th > div.c-common-table__title"],
        ["Oops! Looks like we don't have any data there at the moment.","此处暂无数据。","text","div.c-analytics-empty__text > span"],
        ["Operator","客服","text","div.c-common-table__th > div.c-common-table__title"],
        ["Operators","客服","text","div.c-analytics-metric__title-wrapper > div.c-analytics-metric__title,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text"],
        ["Others","其他","text","div.c-analytics-metric__title-wrapper > div.c-analytics-metric__title"],
        ["Overall Rating","总体评分","text","div.c-analytics-metric__title-wrapper > div.c-analytics-metric__title"],
        ["Overview","概览","text","div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text"],
        ["Pending Conversations","待处理会话","text","div.c-analytics-metric__title-wrapper > div.c-analytics-metric__title"],
        ["Popular searches Per Term","热门搜索词","text","div.c-analytics-metric__title-wrapper > div.c-analytics-metric__title"],
        ["Rating","评分","text","div.c-analytics-metric__title-wrapper > div.c-analytics-metric__title,div.c-common-table__th > div.c-common-table__title"],
        ["Ratings","评价","text","div.c-analytics-metric__title-wrapper > div.c-analytics-metric__title,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text"],
        ["Resolution Time (Average)","解决用时（平均值）","text","div.c-common-table__th > div.c-common-table__title"],
        ["Resolution Time (Median)","解决用时（中位数）","text","div.c-common-table__th > div.c-common-table__title"],
        ["Resolved Conversations","已解决会话","text","div.c-analytics-metric__title-wrapper > div.c-analytics-metric__title"],
        ["Responsiveness","响应情况","text","div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text"],
        ["Sat","周六","text","div.c-analytics-metric-heat-map__labels > div.c-analytics-metric-heat-map__label"],
        ["Saved Time","节省时间","text","div.c-analytics-metric__title-wrapper > div.c-analytics-metric__title"],
        ["Search","搜索","placeholder","div.c-field-input__container > input.c-field-input__field"],
        ["Search","搜索","text","div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text"],
        ["Searches Since A Week","最近一周搜索次数","text","div.c-analytics-metric__title-wrapper > div.c-analytics-metric__title"],
        ["Searches Yesterday","昨日搜索次数","text","div.c-analytics-metric__title-wrapper > div.c-analytics-metric__title"],
        ["Segments","分群","text","div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text"],
        ["Segments Saved","已保存的分群","text","div.c-analytics-metric__title-wrapper > div.c-analytics-metric__title"],
        ["Shortcuts","快捷回复","text","div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text"],
        ["Shortcuts Usage","快捷回复用量","text","div.c-analytics-metric__title-wrapper > div.c-analytics-metric__title"],
        ["Since a month — Last 30 days","最近一月（过去 30 天）","text","div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label"],
        ["Since a week — Last 7 days","最近一周（过去 7 天）","text","div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label,div.c-field-date-range-picker__container > div.c-field-date-range-picker__range"],
        ["Since a year — Last 365 days","最近一年（过去 365 天）","text","div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label"],
        ["SLAs","SLA","text","div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text"],
        ["Status Page","状态页","text","div.c-section-menu-accordion__label-wrapper > span.c-section-menu-accordion__label"],
        ["Sun","周日","text","div.c-analytics-metric-heat-map__labels > div.c-analytics-metric-heat-map__label"],
        ["Thu","周四","text","div.c-analytics-metric-heat-map__labels > div.c-analytics-metric-heat-map__label"],
        ["Time To Handle","处理用时","text","div.c-analytics-metric__title-wrapper > div.c-analytics-metric__title"],
        ["Today","今天","text","div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label"],
        ["Total Downtimes","中断总次数","text","div.c-analytics-metric__title-wrapper > div.c-analytics-metric__title"],
        ["Triggers","触发器","text","div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text"],
        ["Triggers Since A Week","最近一周触发次数","text","div.c-analytics-metric__title-wrapper > div.c-analytics-metric__title"],
        ["Triggers Yesterday","昨日触发次数","text","div.c-analytics-metric__title-wrapper > div.c-analytics-metric__title"],
        ["Tue","周二","text","div.c-analytics-metric-heat-map__labels > div.c-analytics-metric-heat-map__label"],
        ["Unresolved Conversations","未解决会话","text","div.c-analytics-metric__title-wrapper > div.c-analytics-metric__title"],
        ["Visitors","访客","text","div.c-analytics-metric__title-wrapper > div.c-analytics-metric__title,div.c-section-menu-accordion__label-wrapper > span.c-section-menu-accordion__label"],
        ["Visitors Per Country","按国家或地区统计访客","text","div.c-analytics-metric__title-wrapper > div.c-analytics-metric__title"],
        ["Visits Per Locale","按语言统计访问量","text","div.c-analytics-metric__title-wrapper > div.c-analytics-metric__title"],
        ["Visits Since A Week","最近一周访问量","text","div.c-analytics-metric__title-wrapper > div.c-analytics-metric__title"],
        ["Visits Yesterday","昨日访问量","text","div.c-analytics-metric__title-wrapper > div.c-analytics-metric__title"],
        ["Website Visits","网站访问","text","div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text"],
        ["Wed","周三","text","div.c-analytics-metric-heat-map__labels > div.c-analytics-metric-heat-map__label"],
        ["Workload","工作量","text","div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text"],
        ["Yesterday","昨天","text","div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label"],
        ["You have no charts in your dashboard","仪表盘中暂无图表","text","div.c-website-analytics-generic__empty > div.c-base-heading"]
      ],
      rules: [],
      overrides: [],
      fragments: []
    },
    // P · plugins · ^/website/[^/]+/plugins/filter(?:/|$)
    {
      id: "P", slug: "plugins", path: /^\/website\/[^\/]+\/plugins\/filter(?:\/|$)/u,
      exact: [
        ["All Plugins","所有插件","text","div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text"],
        ["Author website","作者网站","text","div.c-preview-plugin__link-wrap > a.c-base-link"],
        ["Automation","自动化","text","div.c-plugin-item__identity > span.c-plugin-item__category,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text"],
        ["Categories","分类","text","div.c-section-menu-accordion__label-wrapper > span.c-section-menu-accordion__label"],
        ["Contact author","联系作者","text","div.c-preview-plugin__link-wrap > a.c-base-link"],
        ["Crisp Features","Crisp 功能","text","div.c-plugin-item__identity > span.c-plugin-item__category,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text"],
        ["Get Help","获取帮助","text","span.c-base-button__inner > span.c-base-button__label"],
        ["Install","安装","text","span.c-base-button__label > span"],
        ["Installed Plugins","已安装插件","text","div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text"],
        ["Marketing","营销","text","div.c-plugin-item__identity > span.c-plugin-item__category,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text"],
        ["Messaging","消息","text","div.c-plugin-item__identity > span.c-plugin-item__category,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text"],
        ["Others","其他","text","div.c-plugin-item__identity > span.c-plugin-item__category,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text"],
        ["Plugins","插件","text","div.c-base-header__headline > div.c-base-header__title,div.c-section-menu-accordion__label-wrapper > span.c-section-menu-accordion__label"],
        ["Plugins | Crisp","插件 | Crisp","text","head > title"],
        ["Privacy policy","隐私政策","text","div.c-preview-plugin__link-wrap > a.c-base-link"],
        ["Search","搜索","placeholder","div.c-field-input__container > input.c-field-input__field"],
        ["Teamwork","团队协作","text","div.c-plugin-item__identity > span.c-plugin-item__category,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text"],
        ["Terms of use","使用条款","text","div.c-preview-plugin__link-wrap > a.c-base-link"],
        ["View all details","查看完整详情","text","div.c-preview-plugin__link-wrap > a.c-base-link"],
        ["View Details","查看详情","text","span.c-base-button__inner > span.c-base-button__label"]
      ],
      rules: [],
      overrides: [],
      fragments: []
    },
    // S · settings · ^/settings(?:/|$)
    {
      id: "S", slug: "settings", path: /^\/settings(?:\/|$)/u,
      exact: [
        ["(in total)","（总计）","text","span.c-base-progress__information > span.c-base-progress__label-secondary"],
        ["1. Copy the following code","1. 复制以下代码","text","div.c-integrations-popup__instructions > span"],
        ["2-Step","两步验证","text","div.c-field-link > label.c-field-label"],
        ["2. Add the code in your page","2. 将代码添加到页面","text","div.c-integrations-popup__instructions > span"],
        ["3. Extra","3. 其他选项","text","div.c-integrations-popup__instructions > span"],
        ["5/7 Live chat support","每周 5 天提供在线聊天支持","text","div.c-switch-plan-step__benefit > div.c-switch-plan-step__benefit-label"],
        ["A payment method can be linked to multiple workspaces (eg: if you have workspaces for multiple businesses)","一个支付方式可以关联多个工作区，例如你为不同业务设置了不同工作区。","text",".c-settings-billing-cards div.c-settings-billing-cards__heading > div.c-base-heading","/settings/billing/cards"],
        ["A phone number can be used for account recovery purposes. It is required for 2-Step.","手机号可用于恢复账户。启用两步验证时必须填写手机号。","text","div.c-field-phone > p.c-field-description"],
        ["A phone number is required for 2-Step.","启用两步验证需要手机号。","text",".c-settings-account-information div.c-field-link__container > div.c-base-heading","/settings/account/information"],
        ["Account","账户","text","div.c-content-navigate-breadcrumb__path > a.c-content-navigate-breadcrumb__link,div.c-section-menu-accordion__label-wrapper > span.c-section-menu-accordion__label"],
        ["Action","操作","text","div.c-settings-entries-column > span"],
        ["Actions","操作","text","div.c-settings-entries-column > span"],
        ["Add","添加","text","span.c-base-button__inner > span.c-base-button__label","/settings/website/:id/chatbox/search"],
        ["Add a blocked country","添加要屏蔽的国家或地区","text","span.c-base-button__inner > span.c-base-button__label","/settings/website/:id/chatbox/restrictions"],
        ["Add a blocked IP","添加要屏蔽的 IP","text","span.c-base-button__inner > span.c-base-button__label","/settings/website/:id/chatbox/restrictions"],
        ["Add a blocked locale","添加要屏蔽的语言","text","span.c-base-button__inner > span.c-base-button__label","/settings/website/:id/chatbox/restrictions"],
        ["Add a blocked page","添加要屏蔽的页面","text","span.c-base-button__inner > span.c-base-button__label","/settings/website/:id/chatbox/restrictions"],
        ["Add a new Service","添加服务","text","span.c-base-button__inner > span.c-base-button__label","/settings/website/:id/status/services"],
        ["Add a new shortcut","添加快捷回复","text","div.c-settings-website-messaging-shortcuts__heading > div.c-base-heading","/settings/website/:id/messaging/shortcuts"],
        ["Add a Web Hook","添加 Webhook","text","span.c-base-button__inner > span.c-base-button__label","/settings/website/:id/advanced"],
        ["Add additional domains","添加其他域名","text","div.c-field-link__actions > span.c-field-link__link"],
        ["Add an allowed page","添加允许显示的页面","text","span.c-base-button__inner > span.c-base-button__label","/settings/website/:id/chatbox/restrictions"],
        ["Add an announcement","添加公告","text","span.c-base-button__inner > span.c-base-button__label","/settings/website/:id/status/announcement"],
        ["Add an interval","添加时段","text",".c-settings-account-availability span.c-base-button__inner > span.c-base-button__label","/settings/account/availability"],
        ["Add and remove services & nodes to be monitored.","添加和移除要监控的服务及节点。","text","div.c-settings-header__inner > div.c-settings-header__description"],
        ["Add Blocking Rule","添加拦截规则","text","span.c-base-button__inner > span.c-base-button__label","/settings/website/:id/messaging/triage"],
        ["Add frequently asked questions from your users there, so that they appear as 1-click search suggestions in your search widget, helping reduce messages to your support.","在此添加用户常问的问题。它们会作为可一键点击的搜索建议显示在搜索组件中，减少发给客服的消息。","text","div.c-settings-website-chatbox-search__information > span.c-settings-website-chatbox-search__information-text"],
        ["Add new payment method","添加支付方式","text",".c-settings-billing-cards span.c-base-button__inner > span.c-base-button__label","/settings/billing/cards"],
        ["Add Operator","添加客服","text","span.c-base-button__inner > span.c-base-button__label","/settings/website/:id/operators"],
        ["Add people that will be able to handle support for the workspace.","添加可为此工作区提供支持的人员。","text","div.c-settings-header__inner > div.c-settings-header__description"],
        ["Add Routing Rule","添加路由规则","text","span.c-base-button__inner > span.c-base-button__label","/settings/website/:id/messaging/routing"],
        ["Add Rule","添加规则","text","span.c-base-button__inner > span.c-base-button__label","/settings/website/:id/messaging/triage"],
        ["Add Shortcut","添加快捷回复","text","span.c-base-button__inner > span.c-base-button__label","/settings/website/:id/messaging/shortcuts"],
        ["Add Sorting Rule","添加分类规则","text","span.c-base-button__inner > span.c-base-button__label","/settings/website/:id/messaging/triage"],
        ["Add Sub-Inbox","添加子收件箱","text","span.c-base-button__inner > span.c-base-button__label","/settings/website/:id/messaging/inboxes"],
        ["Add Team","添加团队","text","span.c-base-button__inner > span.c-base-button__label","/settings/website/:id/operators"],
        ["Additional sub-inboxes","额外子收件箱","text","div.c-settings-usage > label.c-field-label"],
        ["Advanced Chatbox restrictions","聊天窗口高级限制","text","div.c-field-link > label.c-field-label"],
        ["Advanced configuration","高级配置","text","div.c-content-navigate-breadcrumb__section > span,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text,div.c-settings-header__main > h2.c-settings-header__title"],
        ["All actions","所有操作","text","div.c-field-select__field > div.c-field-select__option","/settings/website/:id/audit"],
        ["All actions","所有操作","text","div.c-field-select__field > div.c-field-select__option","/settings/website/:id/messaging/triage"],
        ["All Crisp data will be permanently deleted and non-recoverable.","所有 Crisp 数据都将被永久删除，无法恢复。","text","div.c-field-link > label.c-field-label"],
        ["All keyboard shortcuts","所有键盘快捷键","text","div.c-field-link > label.c-field-label"],
        ["All operators","所有客服","text","div.c-field-select__field > div.c-field-select__option","/settings/website/:id/audit"],
        ["Allow audio recordings to be sent from the chatbox","允许在聊天窗口发送语音消息","text","div.c-field-toggle__container > label.c-field-label"],
        ["Allow files to be sent from the chatbox","允许在聊天窗口发送文件","text","div.c-field-toggle__container > label.c-field-label"],
        ["Allow visitors to create new conversations (multi-conversational chatbox)","允许访客创建新会话（多会话聊天窗口）","text","div.c-field-toggle__container > label.c-field-label"],
        ["Anti-bot protection level (only enable if under attack)","防机器人保护级别（仅在遭受攻击时启用）","text","div.c-field-select > label.c-field-label","/settings/website/:id/chatbox/security"],
        ["Anti-Bot Protections","防机器人保护","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Appearance","外观","text","div.c-content-navigate-breadcrumb__section > span,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text,div.c-settings-header__main > h2.c-settings-header__title"],
        ["Appearance","外观","text",".c-settings-account-interface div.c-field-select > label.c-field-label","/settings/account/interface"],
        ["Append a text signature at the bottom of all sent emails","在所有发出的邮件末尾附加文字签名","text","div.c-field-toggle__container > label.c-field-label"],
        ["as all operators are offline.","，因为所有客服均离线。","text","div.c-settings-website-operators__alert-content > span.c-settings-website-operators__alert-explain"],
        ["as at least one operator is online.","，因为至少有一名客服在线。","text","div.c-settings-website-operators__alert-content > span.c-settings-website-operators__alert-explain"],
        ["Ask visitors for their email address","要求访客提供邮箱地址","text","div.c-field-toggle__container > label.c-field-label"],
        ["Ask visitors for their phone number","要求访客提供电话号码","text","div.c-field-toggle__container > label.c-field-label"],
        ["Assign operator who responded upon response","回复时将会话分配给回复的客服","text","div.c-field-toggle__container > label.c-field-label"],
        ["Assign to operators even if they are offline","允许分配给离线客服","text","div.c-field-toggle__container > label.c-field-label"],
        ["Attachments","附件","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Authorized","已授权","text",".c-settings-account-security span.c-base-badge > div.c-base-badge__content","/settings/account/security"],
        ["Authorized apps","已授权的应用","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Auto-Detect","自动检测","text",".c-settings-account-interface div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label","/settings/account/interface"],
        ["Automatic","自动","text","div.c-field-select__field > div.c-field-select__option","/settings/website/:id/messaging/customization"],
        ["Automatic Triage","自动分流","text","div.c-content-navigate-breadcrumb__section > span,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text,div.c-settings-header__main > h2.c-settings-header__title"],
        ["Automatically organize conversations into sub-inboxes based on segments, user data, user locale, and more.","按分群、用户数据、用户语言等条件将会话自动归入子收件箱。","text","div.c-settings-header__inner > div.c-settings-header__description"],
        ["Automatically Saved","已自动保存","text","div.c-settings-header__status > span.c-settings-header__label"],
        ["Availability","在线状态","text","div.c-content-navigate-breadcrumb__section > span,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text,div.c-settings-header__main > h2.c-settings-header__title"],
        ["Availability Schedule","在线时间安排","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Available once a custom domain is set up in the Domains section.","在“域名”中设置自定义域名后可用。","text","div.c-field-toggle > p.c-field-description"],
        ["Avatar","头像","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Basic domain","基础域名","text","div.c-field-input__header > label.c-field-label"],
        ["Basic domain online","基础域名已启用","text","span.c-setup-domain-domains__status > span"],
        ["Behavior","行为","text","div.c-content-navigate-breadcrumb__section > span,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text,div.c-settings-header__main > h2.c-settings-header__title"],
        ["Billing","账单","text","div.c-content-navigate-breadcrumb__path > a.c-content-navigate-breadcrumb__link,div.c-content-navigate-breadcrumb__section > span,div.c-section-menu-accordion__label-wrapper > span.c-section-menu-accordion__label,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text,div.c-settings-header__main > h2.c-settings-header__title"],
        ["Billing owner","账单所有者","text","div.c-settings-billing-plans__owner > span"],
        ["Block and sort your incoming messages, regardless of where they come from.","拦截和分类来自各渠道的传入消息。","text","div.c-settings-header__inner > div.c-settings-header__description"],
        ["Block rules are processed first, and allow you to quickly dismiss messages that you do not want. Then, it will get to the Sort stage, where you can eg. apply segments.","系统先处理拦截规则，快速过滤不想接收的消息，再执行分类规则，例如为会话应用分群。","text","div.c-base-alert__content > span","/settings/website/:id/messaging/triage"],
        ["Block rules automatically send messages to your spam inbox, eg. stop email floods.","拦截规则会自动将消息移入垃圾消息，例如拦截大量涌入的邮件。","text","div.c-base-empty-spot > div.c-base-empty-spot__description"],
        ["Block Ruleset","拦截规则集","text","div.c-settings-content-card-section-heading > div.c-settings-content-card-section-heading__title"],
        ["Blocked visitors","已屏蔽的访客","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Campaign recipients limit","活动收件人数上限","text","div.c-settings-usage > label.c-field-label"],
        ["Cancel","取消","text","span.c-base-button__inner > span.c-base-button__label","/settings/website/:id/operators"],
        ["Cards","支付方式","text","div.c-content-navigate-breadcrumb__section > span,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text,div.c-settings-header__main > h2.c-settings-header__title"],
        ["Change how your Status Page looks and behaves.","更改状态页的外观和行为。","text","div.c-settings-header__inner > div.c-settings-header__description"],
        ["Change list layout","更改列表布局","text","span.c-base-button__inner > span.c-base-button__label","/settings/website/:id/messaging/customization"],
        ["Change password","更改密码","text",".c-settings-account-information span.c-base-button__inner > span.c-base-button__label","/settings/account/information"],
        ["Change Plan","更改套餐","text",".c-settings-billing-plans span.c-base-button__inner > span.c-base-button__label","/settings/billing/plans"],
        ["Chatbox","聊天窗口","text","div.c-content-navigate-breadcrumb__path > a.c-content-navigate-breadcrumb__link,div.c-field-link > label.c-field-label,div.c-section-menu-accordion__label-wrapper > span.c-section-menu-accordion__label"],
        ["Chatbox Avatars","聊天窗口头像","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Chatbox background (messages texture)","聊天窗口背景（消息区域纹理）","text","div.c-field-select > label.c-field-label","/settings/website/:id/chatbox/appearance"],
        ["Chatbox Button","聊天窗口按钮","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Chatbox Home","聊天窗口首页","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Chatbox language (autodetect, or force a language)","聊天窗口语言（自动检测或指定语言）","text","div.c-field-select > label.c-field-label","/settings/website/:id/chatbox/appearance"],
        ["Chatbox setup instructions","聊天窗口安装说明","text","span.c-base-button__inner > span.c-base-button__label","/settings/website/:id/integrations"],
        ["Chatbox Theme","聊天窗口主题","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Chinese (Taiwan) (中文（台灣）)","繁体中文（台灣）","text",".c-settings-account-interface div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label","/settings/account/interface"],
        ["Choose how you want to manage your notifications.","选择通知的接收方式。","text",".c-settings-account-notifications div.c-settings-account-notifications > div > div.c-base-heading","/settings/account/notifications"],
        ["Clear all block rules (IP & Email)","清除所有屏蔽规则（IP 和邮箱）","text","span.c-base-button__inner > span.c-base-button__label","/settings/website/:id/chatbox/restrictions"],
        ["Collect transparency logs from all team members","记录所有团队成员的操作日志","text","div.c-field-toggle__container > label.c-field-label"],
        ["Color mode (light or dark)","颜色模式（浅色或深色）","text","div.c-field-select > label.c-field-label","/settings/website/:id/chatbox/appearance"],
        ["Color theme (chatbox color)","配色主题（聊天窗口颜色）","text","div.c-field-select > label.c-field-label","/settings/website/:id/chatbox/appearance"],
        ["Command palette","命令面板","text","div.c-field-toggle__container > label.c-field-label"],
        ["Configuration","配置","text","div.c-content-navigate-breadcrumb__section > span,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text,div.c-settings-header__main > h2.c-settings-header__title"],
        ["Configure a new service announcement, or remove active one.","配置服务公告或移除当前公告。","text","div.c-settings-header__inner > div.c-settings-header__description"],
        ["Configure API token, Web Hooks, identity verification, and more.","配置 API 令牌、Webhook、身份验证等功能。","text","div.c-settings-header__inner > div.c-settings-header__description"],
        ["Configure security and privacy preferences here.","配置安全和隐私选项。","text","div.c-settings-header__inner > div.c-settings-header__description"],
        ["Configure the way you want to be notified (Email, Slack, Push).","配置通知方式（邮件、Slack、推送）。","text","div.c-settings-header__inner > div.c-settings-header__description"],
        ["Configure your workspace information. This defines how your workspace appear to your users.","配置工作区信息，决定用户看到的工作区信息。","text","div.c-settings-header__inner > div.c-settings-header__description"],
        ["Contact filters executed","已执行的联系人筛选次数","text","div.c-settings-usage > label.c-field-label"],
        ["Contact information","联系信息","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Contract Agreements","合同与协议","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Conversation filters executed","已执行的会话筛选次数","text","div.c-settings-usage > label.c-field-label"],
        ["Conversations list","会话列表","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Copy","复制","text","span.c-base-button__inner > span.c-base-button__label","/settings/website/:id/integrations"],
        ["Cork Screw","螺旋","text","div.c-field-select__field > div.c-field-select__option","/settings/website/:id/chatbox/appearance"],
        ["Create a new shortcut. Give it a !bang, a group tag, and write a message for this shortcut. Then, use it in conversations to quickly answer to visitors using the shortcut !bang.","新建一条快捷回复，为它设置 !bang 指令、分组标签和消息正文。之后可在会话中使用 !bang 快速回复访客。","text","div.c-settings-website-messaging-shortcuts__heading > div.c-base-heading","/settings/website/:id/messaging/shortcuts"],
        ["Create a new workspace","创建工作区","text","span.c-section-menu__link > span.c-section-menu__link-label"],
        ["Create and manage teams","创建和管理团队","text","div.c-settings-content-card__inner > div.c-base-heading","/settings/website/:id/operators"],
        ["Create routing rules to simplify and automate your daily work by automatically redirecting conversations to the right operator.","创建路由规则，将会话自动分配给合适的客服，简化日常工作。","text","div.c-base-empty-spot > div.c-base-empty-spot__description"],
        ["Create Sub-Inboxes to simplify your operators' work by categorizing conversations by type, topic, team, etc.","创建子收件箱，按类型、主题或团队对会话分类，方便客服处理。","text","div.c-base-empty-spot > div.c-base-empty-spot__description"],
        ["Create Token","创建令牌","text","span.c-base-button__inner > span.c-base-button__label","/settings/website/:id/advanced"],
        ["CRM contacts limit","CRM 联系人上限","text","div.c-settings-usage > label.c-field-label"],
        ["Custom domain","自定义域名","text","div.c-field-input__header > label.c-field-label"],
        ["Custom Email Signature","自定义邮件签名","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Custom Email SMTP","自定义发件 SMTP","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Customization","自定义","text","div.c-content-navigate-breadcrumb__section > span,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text,div.c-settings-header__main > h2.c-settings-header__title"],
        ["Customize how your chatbox looks like on your website or app.","自定义聊天窗口在网站或应用上的外观。","text","div.c-settings-header__inner > div.c-settings-header__description"],
        ["Czech (čeština)","捷克语（čeština）","text",".c-settings-account-interface div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label","/settings/account/interface"],
        ["Danger Zone™","危险操作","text","div.c-content-navigate-breadcrumb__section > span,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text,div.c-settings-header__main > h2.c-settings-header__title"],
        ["Danish (dansk)","丹麦语（dansk）","text",".c-settings-account-interface div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label","/settings/account/interface"],
        ["Dark Mode","深色模式","text",".c-settings-account-interface div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label","/settings/account/interface"],
        ["Data, Limits & Legal","数据、限制与法律","text","div.c-content-navigate-breadcrumb__section > span,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text,div.c-settings-header__main > h2.c-settings-header__title"],
        ["Date","日期","text","div.c-settings-entries-column > span"],
        ["Days","日期","text","div.c-field-tabs__wrapper > label.c-field-label"],
        ["Default (Blue)","默认（蓝色）","text","div.c-field-select__field > div.c-field-select__option","/settings/website/:id/chatbox/appearance"],
        ["Default (Recommended)","默认（推荐）","text","div.c-field-select__field > div.c-field-select__option","/settings/website/:id/chatbox/security"],
        ["Default (White)","默认（白色）","text","div.c-field-select__field > div.c-field-select__option","/settings/website/:id/chatbox/appearance"],
        ["Default section to show when the chatbox is opened","打开聊天窗口时默认显示的页面","text","div.c-field-select > label.c-field-label","/settings/website/:id/chatbox/behavior"],
        ["Define custom translations, use custom colors and change chatbox positions.","设置自定义译文、颜色和聊天窗口位置。","text","div.c-settings-header__inner > div.c-settings-header__description"],
        ["Delete workspace","删除工作区","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Delete workspace","删除工作区","text","span.c-base-button__inner > span.c-base-button__label","/settings/website/:id/danger"],
        ["Delete your account there.","在这里删除你的账户。","text",".c-settings-account-information div.c-base-heading > span.c-settings-account-information__delete-action","/settings/account/information"],
        ["Detect from user country","根据用户所在国家或地区检测","text","div.c-field-select__field > div.c-field-select__option","/settings/website/:id/chatbox/appearance"],
        ["Direct users to use search before reaching out","引导用户在联系客服前先搜索","text","div.c-field-toggle__container > label.c-field-label"],
        ["Disable all notifications","停用所有通知","text","div.c-field-toggle__container > label.c-field-label"],
        ["disabled","已停用","text","span.c-base-badge > div.c-base-badge__content","/settings/website/:id/advanced"],
        ["disabled","已停用","text","span.c-base-badge > div.c-base-badge__content","/settings/website/:id/email/behavior"],
        ["Disabled","已停用","text","span.c-base-badge > div.c-base-badge__content","/settings/website/:id/chatbox/notifications"],
        ["Do not auto-create chat sessions and cookies without user intent","未获得用户主动操作前，不自动创建聊天会话和 Cookie","text","div.c-field-link > label.c-field-label"],
        ["Do not use any fallback language","不使用备用语言","text","div.c-field-select__field > div.c-field-select__option","/settings/website/:id/advanced"],
        ["Domain","域名","text","div.c-field-input__header > label.c-field-label"],
        ["Domain is currently in use on your workspace.","工作区当前正在使用此域名。","text","div.c-base-navigation__left > div.c-base-heading","/settings/website/:id/email/domain"],
        ["Domain name","域名","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Domains","域名","text","div.c-content-navigate-breadcrumb__section > span,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text,div.c-settings-header__main > h2.c-settings-header__title"],
        ["Dutch (Nederlands)","荷兰语（Nederlands）","text",".c-settings-account-interface div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label","/settings/account/interface"],
        ["Edit","编辑","text","span.c-base-button__inner > span.c-base-button__label","/settings/website/:id/usage"],
        ["Email","电子邮件","text","div.c-content-navigate-breadcrumb__path > a.c-content-navigate-breadcrumb__link,div.c-field-input__header > label.c-field-label,div.c-section-menu-accordion__label-wrapper > span.c-section-menu-accordion__label,div.c-settings-website-channel__title > span"],
        ["Email","电子邮件","text","div.c-settings-website-integrations__category > div.c-base-heading","/settings/website/:id/integrations"],
        ["Email Behavior","邮件行为","text","div.c-content-navigate-breadcrumb__section > span,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text,div.c-settings-header__main > h2.c-settings-header__title"],
        ["Email Delivery","邮件送达","text","div.c-content-navigate-breadcrumb__section > span,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text,div.c-settings-header__main > h2.c-settings-header__title"],
        ["Email Domains","邮件域名","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Email me onboarding tips and product news","通过邮件发送入门提示和产品动态","text","div.c-field-toggle__container > label.c-field-label"],
        ["Email me paid invoices (only if you use a paid plan)","通过邮件发送已付款发票（限付费套餐）","text","div.c-field-toggle__container > label.c-field-label"],
        ["Email me transcripts of conversations","通过邮件发送会话记录","text","div.c-field-toggle__container > label.c-field-label"],
        ["Email me unread messages","通过邮件发送未读消息","text","div.c-field-toggle__container > label.c-field-label"],
        ["Email me user ratings","通过邮件发送用户评价","text","div.c-field-toggle__container > label.c-field-label"],
        ["Email notifications","邮件通知","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Email preview","邮件预览","text","div.c-field-select > label.c-field-label","/settings/website/:id/messaging/customization"],
        ["Email users transcripts of conversations","向用户发送包含会话记录的邮件","text","div.c-field-toggle__container > label.c-field-label"],
        ["Empty Last Active","暂无最近活跃时间","text","span.c-base-button__label > span","/settings/website/:id/operators"],
        ["Enable availability schedule","启用在线时间安排","text","div.c-field-toggle__container > label.c-field-label"],
        ["Enable editor actions shortcuts (? and !)","启用编辑器操作快捷键（? 和 !）","text","div.c-field-toggle__container > label.c-field-label"],
        ["Enable or disable features on your chatbox.","启用或停用聊天窗口功能。","text","div.c-settings-header__inner > div.c-settings-header__description"],
        ["Enable or disable routing and configure operators to assign based on rules.","启用或停用路由，并配置按规则分配的客服。","text","div.c-settings-header__inner > div.c-settings-header__description"],
        ["Enable push notifications for your chatbox mobile SDKs for mobile apps.","为移动应用的聊天窗口 SDK 启用推送通知。","text","div.c-settings-header__inner > div.c-settings-header__description"],
        ["Enable ratings (in chatbox and transcript emails)","启用评分（聊天窗口和会话记录邮件）","text","div.c-field-toggle__container > label.c-field-label"],
        ["Enable routing rules","启用路由规则","text","div.c-field-toggle__container > label.c-field-label"],
        ["Enable Search AI on my Crisp Chatbox widget","在 Crisp 聊天窗口组件中启用 AI 搜索","text","div.c-field-toggle__container > label.c-field-label"],
        ["Enable Two Factor Authentication","启用双重身份验证","text",".c-settings-account-information span.c-base-button__inner > span.c-base-button__label","/settings/account/information"],
        ["English","英语","text",".c-settings-account-interface div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label,.c-settings-account-interface div.c-field-select__field > div.c-field-select__option","/settings/account/interface"],
        ["Enter email to send invite to…","输入接收邀请的邮箱…","placeholder","div.c-field-input__container > input.c-field-input__field"],
        ["Enter your email address","输入邮箱地址","placeholder","div.c-field-input__container > input.c-field-input__field"],
        ["Enter your first name","输入名字","placeholder","div.c-field-input__container > input.c-field-input__field"],
        ["Enter your last name","输入姓氏","placeholder","div.c-field-input__container > input.c-field-input__field"],
        ["Feature Details","功能详情","text","div.c-switch-plan-step__header > div.c-switch-plan-step__header-title"],
        ["File smaller than 10 MB and at least 400px by 400px (1:1 ratio).","文件小于 10 MB，尺寸至少为 400 × 400 像素，宽高比为 1∶1。","text","div.c-field-image__label-wrapper > span.c-field-image__label"],
        ["File smaller than 5 MB and at least 400px by 400px (1:1 ratio).","文件小于 5 MB，尺寸至少为 400 × 400 像素，宽高比为 1∶1。","text","div.c-field-image__label-wrapper > span.c-field-image__instructions"],
        ["Files","文件","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Files uploaded","已上传文件数","text","div.c-settings-usage > label.c-field-label"],
        ["Filter by","筛选条件","text","div.c-settings-filters > label.c-field-label"],
        ["Filter choices…","筛选选项…","placeholder","div.c-field-input__container > input.c-field-input__field"],
        ["Filter in customizations…","搜索自定义设置…","placeholder","div.c-field-input__container > input.c-field-input__field"],
        ["Find a rule","查找规则","placeholder","div.c-field-input__container > input.c-field-input__field"],
        ["Fine-tune how the monitoring bot behaves with your services.","调整监控机器人对服务的监控方式。","text","div.c-settings-header__inner > div.c-settings-header__description"],
        ["Finnish (suomi)","芬兰语（suomi）","text",".c-settings-account-interface div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label","/settings/account/interface"],
        ["First Name","名字","text","div.c-field-input__header > label.c-field-label"],
        ["Force offline (invisible mode)","强制离线（隐身模式）","text","div.c-field-toggle__container > label.c-field-label"],
        ["Force operators to have Two Factor Authentication enabled","要求客服启用双重身份验证","text","div.c-field-toggle__container > label.c-field-label"],
        ["Force visitors to identify themselves (email or phone)","要求访客通过邮箱或手机号验证身份","text","div.c-field-toggle__container > label.c-field-label"],
        ["Forward to my tech team","转发给技术团队","text","div.c-field-input__header > label.c-field-label"],
        ["French (français)","法语（français）","text",".c-settings-account-interface div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label","/settings/account/interface"],
        ["Frequent searches","常用搜索","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Fri","周五","text","span.c-field-tabs__tab > span.c-field-tabs__tab-label"],
        ["Full Navigation (with categories)","完整导航（含分类）","text","div.c-field-select__field > div.c-field-select__option","/settings/website/:id/chatbox/behavior"],
        ["GDPR Data Processing Agreement","GDPR 数据处理协议","text","div.c-settings-contract > div.c-settings-contract__label"],
        ["General information","常规信息","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["General Interface","通用界面","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["General Options","常规选项","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["German (Deutsch)","德语（Deutsch）","text",".c-settings-account-interface div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label","/settings/account/interface"],
        ["Get help using Crisp","获取 Crisp 使用帮助","text","span.c-section-menu__link > span.c-section-menu__link-label"],
        ["Get your Status Page domain or configure a custom domain.","获取状态页域名或配置自定义域名。","text","div.c-settings-header__inner > div.c-settings-header__description"],
        ["Go to billing settings","前往账单设置","text",".c-settings-billing-plans span.c-base-button__inner > span.c-base-button__label","/settings/billing/plans"],
        ["Go to Cards…","前往支付方式…","text","div.c-settings-website-billing__card-actions > a.c-settings-website-billing__card-actions-go"],
        ["Go to restrictions","前往限制设置","text","div.c-field-link__actions > span.c-field-link__link"],
        ["Group nodes in a service","将节点归入同一服务","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Group your operators into teams, and reuse those teams across your Crisp workspace.","将客服分成团队，并在整个 Crisp 工作区中使用这些团队。","text","div.c-base-empty-spot > div.c-base-empty-spot__description"],
        ["Header avatars (shown in chatbox header)","页眉头像（显示在聊天窗口顶部）","text","div.c-field-select > label.c-field-label","/settings/website/:id/chatbox/appearance"],
        ["Hide Chatbox","隐藏聊天窗口","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Hide chatbox for countries","按国家或地区隐藏聊天窗口","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Hide chatbox for IPs","按 IP 隐藏聊天窗口","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Hide chatbox for locales","按语言隐藏聊天窗口","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Hide chatbox on pages","在指定页面隐藏聊天窗口","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Hide or block your chatbox for certain pages of your website, countries, etc.","在特定页面、国家或地区等条件下隐藏或阻止显示聊天窗口。","text","div.c-settings-header__inner > div.c-settings-header__description"],
        ["Hide the \"Send confirm\" popup","隐藏发送确认弹窗","text","div.c-field-toggle__container > label.c-field-label"],
        ["Hide the chatbox if all operators are away","所有客服均离开时隐藏聊天窗口","text","div.c-field-toggle__container > label.c-field-label"],
        ["Hide the chatbox on mobile devices","在移动设备上隐藏聊天窗口","text","div.c-field-toggle__container > label.c-field-label"],
        ["Hours","时间","text","div.c-field-link > label.c-field-label"],
        ["How can we help you with our website?","在我们的网站上遇到什么问题？我们可以帮你。","text","div.c-field-select__field > div.c-field-select__option","/settings/website/:id/chatbox/appearance"],
        ["Hungarian (magyar)","匈牙利语（magyar）","text",".c-settings-account-interface div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label","/settings/account/interface"],
        ["Icon","图标","text","div.c-field-image__label-wrapper > span.c-field-image__label,div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Identity Verification","身份验证","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["If the chatbox is not showing, try to reset your cache. You can also contact our support team.","如果聊天窗口没有显示，试着清除缓存，也可以联系支持团队。","text","div.c-integrations-popup__details > div.c-integrations-popup__instructions"],
        ["If you are member of a workspace with multiple operators, the chatbox will be seen as online if at least one operator is available, and away if all operators are unavailable.","有多名客服时，只要至少一人在线，聊天窗口就显示在线。所有客服均不在线时，将显示离开。","text",".c-settings-account-availability div.c-base-alert__content > span > span","/settings/account/availability"],
        ["Ignore user privacy choices (MagicType, MagicBrowse)","忽略用户的隐私选项（MagicType、MagicBrowse）","text","div.c-field-link > label.c-field-label"],
        ["In tag","所属标签","text","div.c-field-select > label.c-field-label","/settings/website/:id/messaging/shortcuts"],
        ["inactive","未启用","text","span.c-base-badge > div.c-base-badge__content","/settings/website/:id/email/delivery"],
        ["Inbox","收件箱","text","div.c-content-navigate-breadcrumb__path > a.c-content-navigate-breadcrumb__link,div.c-section-menu-accordion__label-wrapper > span.c-section-menu-accordion__label,div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Inbox & Routing will be evaluated after your Sort rules.","执行分类规则后，系统再判断收件箱和路由规则。","text","div.c-base-alert__content > span > span","/settings/website/:id/messaging/triage"],
        ["Include tracking pixels in emails sent to users (from Inbox and Campaigns)","在发给用户的邮件中加入追踪像素（来自收件箱和活动）","text","div.c-field-toggle__container > label.c-field-label"],
        ["Indonesian (Indonesia)","印度尼西亚语（Indonesia）","text",".c-settings-account-interface div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label","/settings/account/interface"],
        ["Information","信息","text","div.c-content-navigate-breadcrumb__section > span,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text,div.c-settings-header__main > h2.c-settings-header__title"],
        ["Initialize my status page","初始化状态页","text","span.c-base-button__inner > span.c-base-button__label","/settings/website/:id/status/announcement"],
        ["Initialize my status page","初始化状态页","text","span.c-base-button__inner > span.c-base-button__label","/settings/website/:id/status/customization"],
        ["Initialize my status page","初始化状态页","text","span.c-base-button__inner > span.c-base-button__label","/settings/website/:id/status/monitoring"],
        ["Initialize my status page","初始化状态页","text","span.c-base-button__inner > span.c-base-button__label","/settings/website/:id/status/notifications"],
        ["Initialize my status page","初始化状态页","text","span.c-base-button__inner > span.c-base-button__label","/settings/website/:id/status/reporter"],
        ["Initialize my status page","初始化状态页","text","span.c-base-button__inner > span.c-base-button__label","/settings/website/:id/status/services"],
        ["Initialize my status page","初始化状态页","text","span.c-base-button__inner > span.c-base-button__label","/settings/website/:id/status/setup"],
        ["Instagram username","Instagram 用户名","placeholder","div.c-field-input__container > input.c-field-input__field"],
        ["Install Plugin","安装插件","text","span.c-base-button__inner > span.c-base-button__label","/settings/website/:id/audit"],
        ["Install Plugin","安装插件","text","span.c-base-button__inner > span.c-base-button__label","/settings/website/:id/chatbox/search"],
        ["Install the Dedicated Email IP plugin","安装 Dedicated Email IP 插件","text","span.c-base-button__inner > span.c-base-button__label","/settings/website/:id/email/delivery"],
        ["Integrate Crisp on one of these channels to get in touch with your customers.","将 Crisp 接入以下任一渠道，与客户保持联系。","text","div.c-settings-content-card__inner > div.c-base-heading","/settings/website/:id/integrations"],
        ["Integrate Crisp with your website","将 Crisp 集成到你的网站","text","div.c-base-popup__header > div.c-base-popup__title"],
        ["Integrate with Crisp","集成 Crisp","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Interface","界面","text","div.c-content-navigate-breadcrumb__section > span,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text,div.c-settings-header__main > h2.c-settings-header__title"],
        ["Invite and manage operators","邀请和管理客服","text","div.c-settings-content-card__inner > div.c-base-heading","/settings/website/:id/operators"],
        ["Invite Operator","邀请客服","text","span.c-base-button__inner > span.c-base-button__label","/settings/website/:id/operators"],
        ["Invoices","发票","text","div.c-content-navigate-breadcrumb__section > span,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text,div.c-settings-header__main > h2.c-settings-header__title"],
        ["IP Address","IP 地址","text","div.c-settings-entries-column > span"],
        ["It complements your existing Inbox & Routing rules.","它是现有收件箱和路由规则的补充。","text","div.c-base-alert__content > span > span","/settings/website/:id/messaging/triage"],
        ["It is not recommended to disable them, as you won't get notified when you receive new messages.","停用后，收到新消息时将不会收到通知。建议保持开启。","text",".c-settings-account-notifications div.c-settings-account-notifications > div > div.c-base-heading","/settings/account/notifications"],
        ["Italian (italiano)","意大利语（italiano）","text",".c-settings-account-interface div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label","/settings/account/interface"],
        ["Japanese (日本語)","日语（日本語）","text",".c-settings-account-interface div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label","/settings/account/interface"],
        ["Keyboard shortcuts","键盘快捷键","text","div.c-content-navigate-breadcrumb__section > span,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text,div.c-settings-content-card__head-title > span.c-settings-content-card__name-label,div.c-settings-header__main > h2.c-settings-header__title"],
        ["Knowledge Base","知识库","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Knowledge Base navigation mode on the chatbox","聊天窗口的知识库导航模式","text","div.c-field-select > label.c-field-label","/settings/website/:id/chatbox/behavior"],
        ["Knowledge Base-only mode on the chatbox","聊天窗口仅显示知识库","text","div.c-field-toggle__container > label.c-field-label"],
        ["Korean (한국어)","韩语（한국어）","text",".c-settings-account-interface div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label","/settings/account/interface"],
        ["Language","语言","text",".c-settings-account-interface div.c-field-select > label.c-field-label","/settings/account/interface"],
        ["Last Active Operators","最近活跃的客服","text","div.c-field-select__field > div.c-field-select__option","/settings/website/:id/chatbox/appearance"],
        ["Last Name","姓氏","text","div.c-field-input__header > label.c-field-label"],
        ["Layout theme (chatbox header, etc.)","布局主题（聊天窗口页眉等）","text","div.c-field-select > label.c-field-label","/settings/website/:id/chatbox/appearance"],
        ["Leave workspace","退出工作区","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Leave workspace","退出工作区","text","span.c-base-button__inner > span.c-base-button__label","/settings/website/:id/danger"],
        ["Let your users use AI search to find answers from your AI Agent training data, right from your chatbox.","用户可在聊天窗口中使用 AI 搜索，从 AI 客服的训练数据中查找答案。","text","div.c-settings-header__inner > div.c-settings-header__description"],
        ["Light Mode","浅色模式","text",".c-settings-account-interface div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label","/settings/account/interface"],
        ["Light Mode","浅色模式","text","div.c-field-select__field > div.c-field-select__option","/settings/website/:id/chatbox/appearance"],
        ["Limits & Quotas Usage","限额与用量","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["List layout","列表布局","text","div.c-field-link > label.c-field-label"],
        ["LiveTranslate characters translated","LiveTranslate 已翻译字符数","text","div.c-settings-usage > label.c-field-label"],
        ["LiveTranslate messages translated","LiveTranslate 已翻译消息数","text","div.c-settings-usage > label.c-field-label"],
        ["Location","位置","text","div.c-settings-entries-column > span"],
        ["Lock the chatbox to website domain (and subdomains)","将聊天窗口限制在网站域名及其子域名","text","div.c-field-toggle__container > label.c-field-label"],
        ["Looking to remove your Crisp account?","要删除你的 Crisp 账户？","text",".c-settings-account-information div.c-base-heading > span","/settings/account/information"],
        ["Manage all shortcuts","管理所有快捷回复","text","div.c-settings-website-messaging-shortcuts__seach-heading > div.c-base-heading","/settings/website/:id/messaging/shortcuts"],
        ["Manage all workspace plans","管理所有工作区的套餐","text",".c-settings-billing-plans div.c-settings-billing-plans__heading > div.c-base-heading","/settings/billing/plans"],
        ["Manage all your workspace plan subscriptions.","管理各工作区的套餐订阅。","text",".c-settings-billing-plans div.c-settings-billing-plans__heading > div.c-base-heading","/settings/billing/plans"],
        ["Manage apps connected to your Crisp account. Review session history.","管理已连接到 Crisp 账户的应用，并查看登录记录。","text","div.c-settings-header__inner > div.c-settings-header__description"],
        ["Manage your interface preferences for a personalized experience.","管理界面偏好，自定义使用体验。","text","div.c-settings-header__inner > div.c-settings-header__description"],
        ["Manage your shortcuts. They are grouped by tag to help you organize them.","管理快捷回复。可按标签分组，方便整理。","text","div.c-settings-website-messaging-shortcuts__heading > div.c-base-heading","/settings/website/:id/messaging/shortcuts"],
        ["Medium","中等","text","span.c-base-badge > div.c-base-badge__content","/settings/website/:id/email/delivery"],
        ["Member","成员","text","div.c-field-select__field > div.c-field-select__option","/settings/website/:id/operators"],
        ["Message","消息","text","div.c-field-textarea__header > label.c-field-label"],
        ["Message avatars (shown beside messages)","消息头像（显示在消息旁）","text","div.c-field-select > label.c-field-label","/settings/website/:id/chatbox/appearance"],
        ["Message Shortcuts","消息快捷回复","text","div.c-content-navigate-breadcrumb__section > span,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text,div.c-settings-header__main > h2.c-settings-header__title"],
        ["Messages (default)","消息（默认）","text","div.c-field-select__field > div.c-field-select__option","/settings/website/:id/chatbox/behavior"],
        ["Messaging Plugins","消息渠道插件","text","div.c-settings-website-integrations__category > div.c-base-heading","/settings/website/:id/integrations"],
        ["Messenger username","Messenger 用户名","placeholder","div.c-field-input__container > input.c-field-input__field"],
        ["Mon","周一","text","span.c-field-tabs__tab > span.c-field-tabs__tab-label"],
        ["Monitored services","受监控的服务","text","div.c-content-navigate-breadcrumb__section > span,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text,div.c-settings-header__main > h2.c-settings-header__title"],
        ["Monitoring bot","监控机器人","text","div.c-content-navigate-breadcrumb__section > span,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text,div.c-settings-header__main > h2.c-settings-header__title"],
        ["Name","名称","text","div.c-field-input__header > label.c-field-label"],
        ["Name","名称","text","span.c-base-button__inner > span.c-base-button__label","/settings/website/:id/operators"],
        ["Native App SDKs","原生应用 SDK","text","div.c-settings-website-integrations__category > div.c-base-heading","/settings/website/:id/integrations"],
        ["No allowed page added yet","尚未添加允许显示的页面","text","div.c-base-empty-spot > div.c-base-empty-spot__title"],
        ["No announcement published","尚未发布公告","text","div.c-base-empty-spot > div.c-base-empty-spot__title"],
        ["No blocked country added yet","尚未添加屏蔽的国家或地区","text","div.c-base-empty-spot > div.c-base-empty-spot__title"],
        ["No blocked IP added yet","尚未添加屏蔽的 IP","text","div.c-base-empty-spot > div.c-base-empty-spot__title"],
        ["No blocked locale added yet","尚未添加屏蔽的语言","text","div.c-base-empty-spot > div.c-base-empty-spot__title"],
        ["No blocked page added yet","尚未添加屏蔽的页面","text","div.c-base-empty-spot > div.c-base-empty-spot__title"],
        ["No blocked visitor","暂无已屏蔽的访客","text","div.c-field-link > label.c-field-label"],
        ["No payment method. Add a payment method to start adding subscriptions to your workspaces!","暂无支付方式。添加支付方式，即可为工作区开通订阅。","text",".c-settings-billing-cards div.c-base-alert__content > div","/settings/billing/cards"],
        ["No Sub-Inboxes have been created yet","尚未创建子收件箱","text","div.c-base-empty-spot > div.c-base-empty-spot__title"],
        ["No team created yet.","尚未创建团队。","text","div.c-base-empty-spot > div.c-base-empty-spot__title"],
        ["Notification channels","通知渠道","text","div.c-content-navigate-breadcrumb__section > span,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text,div.c-settings-header__main > h2.c-settings-header__title"],
        ["Notifications","通知","text","div.c-content-navigate-breadcrumb__section > span,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text,div.c-settings-header__main > h2.c-settings-header__title"],
        ["Notify me of messages when I am offline","离线时通知我有新消息","text","div.c-field-toggle__container > label.c-field-label"],
        ["Notify me of messages when I am online","在线时通知我有新消息","text","div.c-field-toggle__container > label.c-field-label"],
        ["Notify me when a visitor is browsing my website","有访客浏览我的网站时通知我","text","div.c-field-toggle__container > label.c-field-label"],
        ["Notify users using Android","向 Android 用户发送通知","text","div.c-field-toggle__container > label.c-field-label"],
        ["Notify users using iOS","向 iOS 用户发送通知","text","div.c-field-toggle__container > label.c-field-label"],
        ["Offline","离线","text","div.c-settings-website-operators__alert-content > span > span"],
        ["Online","在线","text","span > span > span"],
        ["Online","在线","text",".c-settings-account-availability div.c-base-alert__content > span > span","/settings/account/availability"],
        ["Only your first name is visible to users. Your last name is kept private anytime.","用户只能看到你的名字，你的姓氏始终不公开。","text","div.c-field-input > p.c-field-description"],
        ["Operator","客服","text","div.c-settings-entries-column > span"],
        ["Operator Avatar","客服头像","text","div.c-field-select__field > div.c-field-select__option","/settings/website/:id/chatbox/appearance"],
        ["Operator email","客服邮箱","text","div.c-field-input__header > label.c-field-label"],
        ["Operator privacy mode (eg. disable read markers in chatbox)","客服隐私模式（例如关闭聊天窗口中的已读标记）","text","div.c-field-toggle__container > label.c-field-label"],
        ["Operator role","客服角色","text","div.c-field-select > label.c-field-label","/settings/website/:id/operators"],
        ["Operator Routing","客服路由","text","div.c-content-navigate-breadcrumb__section > span,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text,div.c-settings-header__main > h2.c-settings-header__title"],
        ["Operators","客服","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Operators & Teams","客服与团队","text","div.c-content-navigate-breadcrumb__section > span,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text,div.c-settings-header__main > h2.c-settings-header__title"],
        ["Operators can see what visitors write in real-time (MagicType)","允许客服实时查看访客正在输入的内容（MagicType）","text","div.c-field-toggle__container > label.c-field-label"],
        ["Other","其他","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Outbound Email IPs","邮件发件 IP","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Owner","所有者","text","span.c-base-badge > div.c-base-badge__content","/settings/website/:id/operators"],
        ["Password","密码","text","div.c-field-link > label.c-field-label"],
        ["Paste the Crisp chatbox code above in your page.","将上方的 Crisp 聊天窗口代码粘贴到你的页面。","text","div.c-integrations-popup__instructions > span"],
        ["Payment","付款","text","div.c-switch-plan-step__header > div.c-switch-plan-step__header-title"],
        ["Payments are done monthly or yearly based on your plan preferences.","按套餐设置选择的周期按月或按年付款。","text","div.c-settings-billing-banner__content > div.c-settings-billing-banner__description"],
        ["Perform dangerous operations on this workspace.","对该工作区执行危险操作。","text","div.c-settings-header__inner > div.c-settings-header__description"],
        ["Personal Details","个人资料","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Phone","电话","text","div.c-field-phone__header > label.c-field-label"],
        ["Place support in vacation (hide chatbox)","启用客服休假模式（隐藏聊天窗口）","text","div.c-field-toggle__container > label.c-field-label"],
        ["Plans & Subscriptions","套餐与订阅","text","div.c-content-navigate-breadcrumb__section > span,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text,div.c-settings-header__main > h2.c-settings-header__title"],
        ["Plans Details","套餐详情","text","div.c-switch-plan-step__header > div.c-switch-plan-step__header-title"],
        ["Play notification sounds","播放通知声音","text","div.c-field-toggle__container > label.c-field-label"],
        ["Please install the Overlay plugin to use Search AI on your chatbox.","请安装 Overlay 插件，以在聊天窗口使用 AI 搜索。","text","div.c-base-banner > div.c-base-banner__content"],
        ["Please install the Team Transparency Log plugin to see all your logs.","请安装团队操作日志插件，以查看所有日志。","text","div.c-base-banner > div.c-base-banner__content"],
        ["Polish (polski)","波兰语（polski）","text",".c-settings-account-interface div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label","/settings/account/interface"],
        ["Portuguese (Brazil) (português (Brasil))","葡萄牙语（巴西）（português (Brasil)）","text",".c-settings-account-interface div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label","/settings/account/interface"],
        ["Portuguese (português)","葡萄牙语（português）","text",".c-settings-account-interface div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label","/settings/account/interface"],
        ["Prevent non-owner operators to remove data (conversations & contacts)","禁止非所有者客服删除数据（会话和联系人）","text","div.c-field-toggle__container > label.c-field-label"],
        ["Privacy","隐私","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Privacy choices honored","已遵循隐私选项","text","span.c-base-button__inner > span.c-base-button__label","/settings/website/:id/chatbox/security"],
        ["Publish an announcement to warn your users about a maintenance or an ongoing incident.","发布公告，提醒用户即将进行维护或正在发生故障。","text","div.c-base-empty-spot > div.c-base-empty-spot__description"],
        ["Push notifications","推送通知","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Push Notifications","推送通知","text","div.c-content-navigate-breadcrumb__section > span,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text,div.c-settings-header__main > h2.c-settings-header__title"],
        ["Questions? Chat with us!","有问题？和我们聊聊！","text","div.c-field-select__field > div.c-field-select__option","/settings/website/:id/chatbox/appearance"],
        ["Re-run rules 24h after last operator reply","客服上次回复满 24 小时后重新运行规则","text","div.c-field-toggle__container > label.c-field-label"],
        ["Re-run rules if assigned operator is offline","已分配的客服离线时重新运行规则","text","div.c-field-toggle__container > label.c-field-label"],
        ["Recent login history","最近登录记录","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Refund if unsatisfied","不满意可退款","text","div.c-switch-plan-step__benefit > div.c-switch-plan-step__benefit-label"],
        ["reporter daemons","报告程序守护进程","text","div.c-base-alert__content > span > a.c-base-link","/settings/website/:id/status/reporter"],
        ["reporter libraries","报告程序库","text","div.c-base-alert__content > span > a.c-base-link","/settings/website/:id/status/reporter"],
        ["REST API + MCP Server Tokens","REST API 与 MCP 服务器令牌","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Restrictions","限制","text","div.c-content-navigate-breadcrumb__section > span,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text,div.c-settings-header__main > h2.c-settings-header__title"],
        ["Retrieve your reporter token, or generate a new one.","查看报告令牌或生成新令牌。","text","div.c-settings-header__inner > div.c-settings-header__description"],
        ["Reverse the position of the chatbox (show on the left)","AI 搜索","text","div.c-field-toggle__container > label.c-field-label"],
        ["Review your data usage, manage your legal compliance settings.","查看数据用量并管理合规设置。","text","div.c-settings-header__inner > div.c-settings-header__description"],
        ["Romanian (română)","罗马尼亚语（română）","text",".c-settings-account-interface div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label","/settings/account/interface"],
        ["Routing Rules","路由规则","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Rules","规则","text","div.c-settings-content-card-section-heading > div.c-settings-content-card-section-heading__title"],
        ["Russian (русский)","俄语（русский）","text",".c-settings-account-interface div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label","/settings/account/interface"],
        ["Same as System","跟随系统","text",".c-settings-account-interface div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label,.c-settings-account-interface div.c-field-select__field > div.c-field-select__option","/settings/account/interface"],
        ["Sat","周六","text","span.c-field-tabs__tab > span.c-field-tabs__tab-label"],
        ["Search","搜索","placeholder","div.c-field-input__container > input.c-field-input__field"],
        ["Search","搜索","text","div.c-content-navigate-breadcrumb__search > span.c-content-navigate-breadcrumb__search-label,div.c-field-toggle__container > label.c-field-label"],
        ["Search AI","将聊天窗口显示在左侧","text","div.c-content-navigate-breadcrumb__section > span,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text,div.c-settings-header__main > h2.c-settings-header__title"],
        ["Search AI Setup","AI 搜索设置","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Security","安全","text","div.c-content-navigate-breadcrumb__section > span,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text,div.c-settings-content-card__head-title > span.c-settings-content-card__name-label,div.c-settings-header__main > h2.c-settings-header__title"],
        ["Security log of important actions that workspace operators have taken.","记录工作区客服执行的重要操作。","text","div.c-settings-header__inner > div.c-settings-header__description"],
        ["See all integrations","查看所有集成","text","span.c-base-button__inner > span.c-base-button__label","/settings/website/:id/integrations"],
        ["See contract","查看合同","text","span.c-base-button__inner > span.c-base-button__label","/settings/website/:id/usage"],
        ["See keyboard shortcuts","查看键盘快捷键","text","div.c-field-link__actions > span.c-field-link__link"],
        ["See more","查看更多","text","div.c-settings-website-integrations__button-wrapper > span.c-settings-website-integrations__more"],
        ["Select the payment method to be used for this workspace, used for subscriptions payment.","选择用于支付该工作区订阅费用的支付方式。","text","div.c-settings-header__inner > div.c-settings-header__description"],
        ["Send all emails using my custom outbound SMTP server","使用自定义 SMTP 服务器发送所有邮件","text","div.c-field-toggle__container > label.c-field-label"],
        ["Send emails that might be junk to the Spam inbox","将疑似垃圾邮件移至垃圾消息","text","div.c-field-toggle__container > label.c-field-label"],
        ["Send files as attachments instead of links","以附件形式发送文件，不使用链接","text","div.c-field-toggle__container > label.c-field-label"],
        ["Send instructions","发送安装说明","text","span.c-base-button__inner > span.c-base-button__label","/settings/website/:id/integrations"],
        ["Service announcement","服务公告","text","div.c-content-navigate-breadcrumb__section > span,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text,div.c-settings-header__main > h2.c-settings-header__title"],
        ["Service status","服务状态","text","span.c-section-menu__link > span.c-section-menu__link-label"],
        ["Set me available when using the app","使用应用时将我设为在线","text","div.c-field-toggle__container > label.c-field-label"],
        ["Set your public contact information so that visitors have other ways to directly contact you.","设置公开联系信息，方便访客通过其他方式直接联系你。","text","div.c-settings-content-card__inner > div.c-base-heading","/settings/website/:id/information"],
        ["Set yourself available on schedule, by configuring days and times (in your timezone). Visitors will see you as away off scheduled hours, but they can still send you messages.","按你的时区设置在线日期和时间。访客会在排班以外的时段看到你处于离开状态，但仍可发送消息。","text",".c-settings-account-availability div.c-base-alert__content > span > span","/settings/account/availability"],
        ["Settings","设置","text","div.c-content-navigate-breadcrumb__path > a.c-content-navigate-breadcrumb__link"],
        ["Settings | Crisp","设置 | Crisp","text","head > title"],
        ["Setup & Integrations","安装与集成","text","div.c-content-navigate-breadcrumb__section > span,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text,div.c-settings-header__main > h2.c-settings-header__title"],
        ["Setup instructions","配置说明","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Shortcut","快捷回复","text","div.c-field-input__header > label.c-field-label"],
        ["Show a home section in the chatbox (helps guiding visitors)","在聊天窗口显示首页，引导访客操作","text","div.c-field-toggle__container > label.c-field-label"],
        ["Show activity metrics in the chatbox (eg: mean time to reply)","在聊天窗口显示活动指标（如平均回复时间）","text","div.c-field-toggle__container > label.c-field-label"],
        ["Show an alert when status reports dead (if Crisp Status is configured)","服务状态异常时显示提醒（需已配置 Crisp Status）","text","div.c-field-toggle__container > label.c-field-label"],
        ["Show channel","显示渠道","text","div.c-field-toggle__container > label.c-field-label"],
        ["Show chatbox only on pages","仅在指定页面显示聊天窗口","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Show dates on messages","显示消息日期","text","div.c-field-toggle__container > label.c-field-label"],
        ["Show Knowledge Base in the chatbox (if Crisp Knowledge Base is configured)","在聊天窗口显示知识库（需已配置 Crisp 知识库）","text","div.c-field-toggle__container > label.c-field-label"],
        ["Show last active operator face in chatbox button (when no chat is ongoing)","没有进行中的会话时，在聊天按钮上显示最近活跃客服的头像","text","div.c-field-toggle__container > label.c-field-label"],
        ["Show link previews in chatbox messages (eg: website image or video)","在聊天消息中显示链接预览（如网页图片或视频）","text","div.c-field-toggle__container > label.c-field-label"],
        ["Show notes in last message","在最后一条消息中显示备注","text","div.c-field-toggle__container > label.c-field-label"],
        ["Show online/away status (in chatbox and button)","在聊天窗口和按钮上显示在线或离开状态","text","div.c-field-toggle__container > label.c-field-label"],
        ["Show operator face in chatbox button (when a chat is ongoing)","有进行中的会话时，在聊天按钮上显示客服头像","text","div.c-field-toggle__container > label.c-field-label"],
        ["Show segments","显示分群","text","div.c-field-toggle__container > label.c-field-label"],
        ["Show subject","显示主题","text","div.c-field-toggle__container > label.c-field-label"],
        ["Show the availability tooltip when chatbox is closed","聊天窗口关闭时显示在线状态提示","text","div.c-field-toggle__container > label.c-field-label"],
        ["Show the option for visitors to continue by email","向访客显示改用邮件继续的选项","text","div.c-field-toggle__container > label.c-field-label"],
        ["Show waiting since date","显示开始等待的时间","text","div.c-field-toggle__container > label.c-field-label"],
        ["Show workspace logo in chatbox button","在聊天按钮上显示工作区标志","text","div.c-field-toggle__container > label.c-field-label"],
        ["Soon Inactive","即将失效","text",".c-settings-billing-plans span.c-base-badge > div.c-base-badge__content","/settings/billing/plans"],
        ["Sort rules automatically apply segments & data for messages, eg. add SLA segment.","分类规则会自动应用分群和数据，例如添加 SLA 分群。","text","div.c-base-empty-spot > div.c-base-empty-spot__description"],
        ["Sort Ruleset","分类规则集","text","div.c-settings-content-card-section-heading > div.c-settings-content-card-section-heading__title"],
        ["Spanish (español)","西班牙语（español）","text",".c-settings-account-interface div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label","/settings/account/interface"],
        ["State","状态","text","div.c-settings-entries-column > span"],
        ["Status","状态","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Status Page","状态页","text","div.c-content-navigate-breadcrumb__path > a.c-content-navigate-breadcrumb__link,div.c-section-menu-accordion__label-wrapper > span.c-section-menu-accordion__label"],
        ["Status page nodes limit","状态页节点上限","text","div.c-settings-usage > label.c-field-label"],
        ["Status reporter","状态报告","text","div.c-content-navigate-breadcrumb__section > span,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text,div.c-settings-header__main > h2.c-settings-header__title"],
        ["Sub-Inboxes","子收件箱","text","div.c-content-navigate-breadcrumb__section > span,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text,div.c-settings-header__main > h2.c-settings-header__title"],
        ["Suggest to play a wait game when operators are slow to reply","客服回复较慢时，建议访客玩小游戏打发时间","text","div.c-field-toggle__container > label.c-field-label"],
        ["Sun","周日","text","span.c-field-tabs__tab > span.c-field-tabs__tab-label"],
        ["Support is","客服状态：","text","div.c-settings-website-operators__alert-content > span > span"],
        ["Swedish (svenska)","瑞典语（svenska）","text",".c-settings-account-interface div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label","/settings/account/interface"],
        ["Team Transparency Log","团队操作日志","text","div.c-content-navigate-breadcrumb__section > span,div.c-section-menu-item__label-wrapper > div.c-section-menu-item__label-text,div.c-settings-content-card__head-title > span.c-settings-content-card__name-label,div.c-settings-header__main > h2.c-settings-header__title"],
        ["Teams","团队","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Telegram username","Telegram 用户名","placeholder","div.c-field-input__container > input.c-field-input__field"],
        ["Text theme (text visible on chatbox header)","文字主题（聊天窗口页眉中的文字）","text","div.c-field-select > label.c-field-label","/settings/website/:id/chatbox/appearance"],
        ["Thai (ไทย)","泰语（ไทย）","text",".c-settings-account-interface div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label","/settings/account/interface"],
        ["The Sort Ruleset does not replace your Inbox & Routing rules","分类规则集不会替代收件箱和路由规则","text","div.c-base-alert__content > div","/settings/website/:id/messaging/triage"],
        ["The sorting rules configured here allow you to transform conversation metadata, eg. set a segment.","此处的分类规则可修改会话元数据，例如设置分群。","text","div.c-base-alert__content > span > span","/settings/website/:id/messaging/triage"],
        ["The status page needs to be initialized before you can use it.","使用前需先初始化状态页。","text","div.c-base-alert__content > div","/settings/website/:id/status/announcement"],
        ["The status page needs to be initialized before you can use it.","使用前需先初始化状态页。","text","div.c-base-alert__content > div","/settings/website/:id/status/customization"],
        ["The status page needs to be initialized before you can use it.","使用前需先初始化状态页。","text","div.c-base-alert__content > div","/settings/website/:id/status/monitoring"],
        ["The status page needs to be initialized before you can use it.","使用前需先初始化状态页。","text","div.c-base-alert__content > div","/settings/website/:id/status/notifications"],
        ["The status page needs to be initialized before you can use it.","使用前需先初始化状态页。","text","div.c-base-alert__content > div","/settings/website/:id/status/reporter"],
        ["The status page needs to be initialized before you can use it.","使用前需先初始化状态页。","text","div.c-base-alert__content > div","/settings/website/:id/status/services"],
        ["The status page needs to be initialized before you can use it.","使用前需先初始化状态页。","text","div.c-base-alert__content > div","/settings/website/:id/status/setup"],
        ["There are no block rules","暂无拦截规则","text","div.c-base-empty-spot > div.c-base-empty-spot__title"],
        ["There are no sort rules","暂无分类规则","text","div.c-base-empty-spot > div.c-base-empty-spot__title"],
        ["Think of them like the filter rules of traditional email apps, but for every kind of messages coming to your Crisp Inbox: Chats, Emails, WhatsApp, etc.","它们类似于传统邮件应用的筛选规则，适用于进入 Crisp 收件箱的聊天、邮件、WhatsApp 等各类消息。","text","div.c-base-alert__content > span","/settings/website/:id/messaging/triage"],
        ["This domain does not require any setup (default domain provided by Crisp).","此域名无需配置，由 Crisp 默认提供。","text","div.c-base-alert__content > div","/settings/website/:id/email/domain"],
        ["This image will be shown to your visitors.","访客将看到这张图片。","text","div.c-field-image__label-wrapper > span.c-field-image__instructions"],
        ["This is a simulated chatbox. No message sent here will be delivered to your inbox. Only you see this.","这是模拟聊天窗口。此处发送的消息不会进入你的收件箱，只有你能看到。","text","div.c-settings-chatbox-widget-preview__banner > span.c-settings-chatbox-widget-preview__banner-label"],
        ["This is what you pay monthly.","这是每月应付金额。","text","div.c-settings-billing-banner__content > div.c-settings-billing-banner__title"],
        ["Those are your invoices for all your payment methods","这里显示所有支付方式对应的发票","text",".c-settings-billing-invoices div.c-base-heading > span","/settings/billing/invoices/all"],
        ["Thu","周四","text","span.c-field-tabs__tab > span.c-field-tabs__tab-label"],
        ["Time Ago","距今","text","div.c-settings-entries-column > span"],
        ["Timezone","时区","text",".c-settings-account-availability div.c-field-select > label.c-field-label","/settings/account/availability"],
        ["Total Privacy™ is inactive","Total Privacy™ 未启用","text","span.c-base-button__inner > span.c-base-button__label","/settings/website/:id/chatbox/security"],
        ["Transcribed audio messages","已转录语音消息数","text","div.c-settings-usage > label.c-field-label"],
        ["Triage rules help you block and sort your incoming messages.","分流规则帮助你拦截和分类传入消息。","text","div.c-base-alert__content > div","/settings/website/:id/messaging/triage"],
        ["Trial","试用","text","div.c-settings-billing-plans__bill > div.c-settings-billing-plans__bill-amount"],
        ["Triggers","触发器","text","div.c-settings-website-channel__title > span"],
        ["Try now and pay later","先试用，后付款","text","div.c-switch-plan-step__benefit > div.c-switch-plan-step__benefit-label"],
        ["Tue","周二","text","span.c-field-tabs__tab > span.c-field-tabs__tab-label"],
        ["Turkish (Türkçe)","土耳其语（Türkçe）","text",".c-settings-account-interface div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label","/settings/account/interface"],
        ["Ukrainian (українська)","乌克兰语（українська）","text",".c-settings-account-interface div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label","/settings/account/interface"],
        ["Update Payment","更新付款信息","text",".c-settings-billing-plans span.c-base-button__inner > span.c-base-button__label","/settings/billing/plans"],
        ["Upgrade and continue your trial","升级并继续试用","text","span.c-base-button__inner > span.c-base-button__label","/settings/website/:id/operators"],
        ["Upload image","上传图片","text",".c-settings-account-information span.c-base-button__inner > span.c-base-button__label","/settings/account/information"],
        ["Upload image","上传图片","text","span.c-base-button__inner > span.c-base-button__label","/settings/website/:id/chatbox/appearance"],
        ["Upload image","上传图片","text","span.c-base-button__inner > span.c-base-button__label","/settings/website/:id/information"],
        ["Upload signed","上传已签署文件","text","span.c-base-button__inner > span.c-base-button__label","/settings/website/:id/usage"],
        ["User Agent","用户代理","text","div.c-settings-entries-column > span"],
        ["Using medium-reputation shared pool","正在使用信誉中等的共享 IP 池","text","span.c-settings-ip-status__pool-value > span"],
        ["Verify domain setup","验证域名配置","text","span.c-base-button__inner > span.c-base-button__label","/settings/website/:id/email/domain"],
        ["Verify user emails with cryptographic signatures","使用加密签名验证用户邮箱","text","div.c-field-toggle__container > label.c-field-label"],
        ["Video Tutorial","视频教程","text","div.c-integrations-popup__video > div.c-integrations-popup__video-title"],
        ["Vietnamese (Tiếng Việt)","越南语（Tiếng Việt）","text",".c-settings-account-interface div.c-base-select-menu-item__inner > span.c-base-select-menu-item__label","/settings/account/interface"],
        ["View API reference","查看 API 参考","text","div.c-settings-content-card__inner > a.c-base-link","/settings/website/:id/advanced"],
        ["Visitors","访客","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Want to manage all payment cards?","要管理所有支付卡？","text","div.c-settings-website-billing__card-actions > div.c-base-heading","/settings/website/:id/billing"],
        ["Web Hooks","Webhook","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Website","网站","text","div.c-settings-website-integrations__category > div.c-base-heading","/settings/website/:id/integrations"],
        ["Website ID","网站 ID","text","div.c-field-input__header > label.c-field-label"],
        ["Wed","周三","text","span.c-field-tabs__tab > span.c-field-tabs__tab-label"],
        ["Welcome message (first message seen by users)","欢迎语（用户看到的第一条消息）","text","div.c-field-select > label.c-field-label","/settings/website/:id/chatbox/appearance"],
        ["What are outbound email IPs?","什么是邮件发件 IP？","text","div.c-base-alert__content > div","/settings/website/:id/email/delivery"],
        ["What are Triage Rules?","什么是分流规则？","text","div.c-base-alert__content > div","/settings/website/:id/messaging/triage"],
        ["What's new?","有什么新功能？","text","span.c-section-menu__link > span.c-section-menu__link-label"],
        ["When emails are sent to your users for your Crisp messages and campaigns, they are sent using an IP address that has a reputation attached to it. The likelihood that your emails go to spam is based on the IP reputation.","Crisp 通过具有一定信誉的 IP 地址发送消息和活动邮件。IP 信誉会影响邮件进入垃圾邮件文件夹的概率。","text","div.c-base-alert__content > div","/settings/website/:id/email/delivery"],
        ["Why?","为什么？","text","span.c-settings-ip-status__pool-value > a.c-base-link","/settings/website/:id/email/delivery"],
        ["Workspace","工作区","text","div.c-content-navigate-breadcrumb__path > a.c-content-navigate-breadcrumb__link,div.c-section-menu-accordion__label-wrapper > span.c-section-menu-accordion__label"],
        ["Workspace default language (if user language is unknown)","工作区默认语言（无法识别用户语言时使用）","text","div.c-field-select > label.c-field-label","/settings/website/:id/advanced"],
        ["Workspace Defaults","工作区默认设置","text","div.c-settings-content-card__head-title > span.c-settings-content-card__name-label"],
        ["Workspace operators limit","工作区客服人数上限","text","div.c-settings-usage > label.c-field-label"],
        ["X username","X 用户名","placeholder","div.c-field-input__container > input.c-field-input__field"],
        ["You are currently seen as:","你当前显示为：","text",".c-settings-account-availability div.c-base-alert__content > span > span","/settings/account/availability"],
        ["You are using the shared email IP pool","你正在使用共享邮件 IP 池","text","div.c-settings-ip-status__active > div.c-settings-ip-status__active-text"],
        ["You can add it in the HTML head section.","可以将代码添加到 HTML 的 head 区域。","text","div.c-integrations-popup__details > div.c-integrations-popup__instructions"],
        ["You can cancel or subscribe at anytime. No commitment.","可随时订阅或取消，无长期承诺。","text",".c-settings-billing-cards div.c-settings-billing-cards__heading > div.c-base-heading","/settings/billing/cards"],
        ["You can either use a default shared IP pool, or a dedicated IP address to improve email deliverability.","可使用默认的共享 IP 池，也可使用专用 IP 地址来提高邮件送达率。","text","div.c-base-alert > div.c-base-alert__content","/settings/website/:id/email/delivery"],
        ["You do not have any payment method. Add one to subscribe to paid features.","暂无支付方式。添加支付方式后即可订阅付费功能。","text",".c-settings-billing-plans div.c-base-alert__content > div","/settings/billing/plans"],
        ["You have no API Token","暂无 API 令牌","text","div.c-base-empty-spot > div.c-base-empty-spot__title"],
        ["You have no monitored service","暂无受监控的服务","text","div.c-base-empty-spot > div.c-base-empty-spot__title"],
        ["You have no routing rule","暂无路由规则","text","div.c-base-empty-spot > div.c-base-empty-spot__title"],
        ["You have no Web Hook","暂无 Webhook","text","div.c-base-empty-spot > div.c-base-empty-spot__title"],
        ["You may download those invoices regularly, to keep a copy of them.","可定期下载发票，留存副本。","text",".c-settings-billing-invoices div.c-base-heading > div.c-base-heading","/settings/billing/invoices/all"],
        ["You will not be able to access the workspace anymore.","你将无法再访问该工作区。","text","div.c-field-link > label.c-field-label"],
        ["Your API Token will appear here.","API 令牌将显示在这里。","text","div.c-base-empty-spot > div.c-base-empty-spot__description"],
        ["Your email is used to send you notifications. Your visitors will not see it.","此邮箱用于接收通知，访客看不到你的邮箱。","text","div.c-field-input > p.c-field-description"],
        ["Your monitored services will appear here.","受监控的服务将显示在这里。","text","div.c-base-empty-spot > div.c-base-empty-spot__description"],
        ["Your outbound email IP status","邮件发件 IP 状态","text","div.c-settings-subgroup__wrapper > span.c-settings-subgroup__title"],
        ["Your Web Hooks will appear here.","Webhook 将显示在这里。","text","div.c-base-empty-spot > div.c-base-empty-spot__description"]
      ],
      rules: [
        ["Every {n}d","每 {n} 天","text",".c-base-progress__label-secondary"],
        ["Every {n}h","每 {n} 小时","text",".c-base-progress__label-secondary"],
        ["Every {n}d · resets in {n}h","每 {n} 天 · {n} 小时后重置","text",".c-base-progress__label-secondary"]
      ],
      overrides: [],
      fragments: [
        ["p.c-settings-chatbox-widget-preview__title",["Preview","your widget:"],["预览","聊天窗口："]],
        ["span.c-settings-website-operators__operator-self",["(","you",")"],["（","你","）"]],
        [".c-settings-index__content .c-base-alert__content > div",["This is your workspace avatar. You can also change it in","Settings > Workspace > Information","."],["这是工作区头像。也可前往","设置 → 工作区 → 信息","进行更改。"]],
        [".c-settings-index__content .c-base-alert__content",["The token is used in","reporter libraries","and","reporter daemons",". It is private to your workspace."],["此令牌用于","报告程序库","和","报告程序守护进程","。仅此工作区可以使用该令牌。"]],
        [".c-settings-index__content .c-base-alert__content",["What are Triage Rules?","Triage rules help you block and sort your incoming messages.","Think of them like the filter rules of traditional email apps, but for every kind of messages coming to your Crisp Inbox: Chats, Emails, WhatsApp, etc.","Triage rules have 2 stages:","Block and","Sort.","Block rules are processed first, and allow you to quickly dismiss messages that you do not want. Then, it will get to the Sort stage, where you can eg. apply segments."],["什么是分流规则？","分流规则帮助你拦截和分类传入消息。","它们类似于传统邮件应用的筛选规则，适用于进入 Crisp 收件箱的聊天、邮件、WhatsApp 等各类消息。","分流规则分为两个阶段：","拦截和","分类。","系统先处理拦截规则，快速过滤不想接收的消息，再执行分类规则，例如为会话应用分群。"]],
        [".c-settings-index__content .c-base-alert__content",["The Sort Ruleset does not replace your Inbox & Routing rules","The sorting rules configured here allow you to transform conversation metadata, eg. set a segment.","It complements your existing Inbox & Routing rules.","They are processed before any other rules: your","Inbox & Routing will be evaluated after your Sort rules."],["分类规则集不会替代收件箱和路由规则","此处的分类规则可修改会话元数据，例如设置分群。","它是现有收件箱和路由规则的补充。","分流规则优先执行。","分类规则执行后，再判断收件箱和路由规则。"]]
      ]
    },
    // G · global-search · ^/(?:website|settings)(?:/|$)
    {
      id: "G", slug: "global-search", path: /^\/(?:website|settings)(?:\/|$)/u,
      exact: [],
      rules: [],
      overrides: [],
      fragments: [
        [".c-spotlight-suggestion__label",["Restrict","your search"],["缩小","搜索范围"]]
      ]
    }
  ];

  const ATTRS = ['placeholder', 'title', 'aria-label', 'alt', 'aria-description', 'value'];
  const BLOCK = [
    'script', 'style', 'noscript', 'code', 'pre', 'kbd', 'iframe',
    'read-frog', 'read-frog-selection', '.tp-extension',
    '[contenteditable]:not([contenteditable="false"])',
    'input[type=hidden]',
    '.c-base-avatar', '.c-conversation-menu-item', '.c-conversation-message',
    '.c-sidebar-menu-website__websites', '.c-sidebar__switcher-action',
    '.c-sidebar-controls .c-base-select-menu-item__label',
    '.c-integrations-popup__code', '.c-base-code', '.c-field-code', '.c-settings-entries-line',
    '.c-sidebar-menu-user__identity', '.c-sidebar-menu-user__profile',
    '.c-setup-trial-progress__wrapper', '.c-setup-widget__title-username',
    '.c-helpdesk-tree-item', '.c-website-helpdesk-article__editor',
    '.c-editor-composer__content', '.c-editor-composer__editor',
    '.c-common-table__tbody', '.c-base-table__body', 'table tbody',
    '.c-visitors-box-menu__items', '.c-magic-map', '.c-contact-profile',
    '.c-plugin-item__name', '.c-plugin-item__summary',
    '.c-preview-plugin__name', '.c-preview-plugin__description', '.c-preview-plugin__paragraph',
    '.c-section-menu-item[href*="/analytics/dashboard/"]',
    '.c-section-menu-item[href*="/campaigns/tags/"]:not([href$="/tags/all/"])'
  ].join(',');
  const BLOCK_CLASS = /(?:__|--)(?:secret|token|api-key|profile-email|email-address|website-name|operator-name|username|contact-name|workspace-name|contact-email|domain-name|card-number|invoice-number|hostname|conversation-body|attachment-name|integration-id|account-id|user-avatar|author-name|message-body|message-text|article-content|markdown-body|website-title|user-name|operator-email|user-email)(?:$|--)/u;
  const SAFE_DEBUG = [
    '.c-settings-header__title', '.c-settings-header__description', '.c-settings-content-card__name-label',
    '.c-sidebar-item__inner > .c-sidebar-item__inner-label', '.c-base-empty-spot__title',
    '.c-base-empty-spot__description', '.c-help-popup__option-label', '.c-mobile-popup__title'
  ].join(',');

  const normalize = raw => (raw || '').replace(/\s+/gu, ' ').trim();
  const keepWhitespace = (raw, text) => raw.match(/^\s*/u)[0] + text + raw.match(/\s*$/u)[0];
  const escapeRegex = text => text.replace(/[.*+?^$\{\}()|[\]\\]/gu, '\\$&');
  const textState = new WeakMap();
  const attrState = new WeakMap();
  const pending = new Set();
  let pathname = '';
  let route = '';
  let active = [];
  let timer = 0;
  let processing = false;
  const debug = (() => {
    try { return localStorage.getItem('crisp.zhCN.debug') === '1'; }
    catch { return false; }
  })();
  const misses = new Set();

  function exactIndex(rows) {
    const index = new Map();
    for (const [key, value, type, selector, path] of rows) {
      const match = index.get(key) || [];
      match.push({ value, type, selector, path });
      index.set(key, match);
    }
    return index;
  }

  function compileRules(rows) {
    return rows.map(([source, value, type, selector]) => ({
      pattern: new RegExp('^' + source.split('{n}').map(escapeRegex).join('([0-9]+)') + '$', 'u'),
      value, type, selector
    }));
  }

  const common = exactIndex(COMMON_EXACT);
  const commonRules = compileRules(COMMON_RULES);
  const scopes = SCOPES.map(scope => ({
    ...scope, exact: exactIndex(scope.exact), overrides: exactIndex(scope.overrides), rules: compileRules(scope.rules)
  }));

  function exact(index, key, element, type) {
    return index.get(key)?.find(entry =>
      type === entry.type && (!entry.path || entry.path === route) && element.matches(entry.selector)
    )?.value;
  }

  function template(rules, key, element, type) {
    for (const rule of rules) {
      const match = rule.pattern.exec(key);
      if (!match || type !== rule.type || !element.matches(rule.selector)) continue;
      let index = 1;
      return rule.value.replace(/\{n\}/gu, () => match[index++]);
    }
  }

  function lookup(key, element, type) {
    for (const scope of active) {
      const override = exact(scope.overrides, key, element, type);
      if (override !== undefined) return override;
    }
    for (const scope of active) {
      const translated = exact(scope.exact, key, element, type);
      if (translated !== undefined) return translated;
    }
    const commonText = exact(common, key, element, type);
    if (commonText !== undefined) return commonText;
    for (const scope of active) {
      const translated = template(scope.rules, key, element, type);
      if (translated !== undefined) return translated;
    }
    return template(commonRules, key, element, type);
  }

  function isBlocked(element) {
    if (!element || element.closest(BLOCK)) return true;
    for (let ancestor = element; ancestor && ancestor.id !== 'app'; ancestor = ancestor.parentElement) {
      if ([...ancestor.classList].some(name => BLOCK_CLASS.test(name))) return true;
    }
    return false;
  }

  function inScope(element) {
    return !!element && (element.matches('head > title') || element.closest('#app')) && !isBlocked(element);
  }

  function debugMiss(key, element, type) {
    if (!debug || misses.size >= 100 || type !== 'text' || !element.matches(SAFE_DEBUG)) return;
    if (!/[A-Za-z]{2}/u.test(key) || /[\u3400-\u9fff]/u.test(key) || !element.getClientRects().length) return;
    if (element.matches('.c-sidebar-item__inner-label') && !element.closest(
      '.js-sidebar-item-link--inbox,.js-sidebar-item-link--agent,.js-sidebar-item-link--visitors,' +
      '.js-sidebar-item-link--contacts,.js-sidebar-item-link--helpdesk,.js-sidebar-item-link--campaigns,' +
      '.js-sidebar-item-link--analytics,.js-sidebar-item-link--plugins,.js-sidebar-item-link--settings'
    )) return;
    // 隐去词条里的自由文本、数值和凭据。仅保留通用界面词，方便在原页面定位。
    const safe = key
      .replace(/(?:https?:\/\/|www\.)\S+/giu, '{url}')
      .replace(/\S+@\S+/gu, '{email}')
      .replace(/\b[\w-]+(?:\.[\w-]+)+\b/gu, '{domain}')
      .replace(/\b[\w+/-]{16,}={0,2}\b/gu, '{token}')
      .replace(/[$€£¥]\s*[\d,.]+/gu, '{amount}')
      .replace(/\b\d+(?:[.,:/-]\d+)*\b/gu, '{n}')
      .replace(/\b[a-z][a-z'-]*\b/giu, word =>
        /^(?:add|all|and|cancel|close|configure|create|delete|edit|enable|for|in|more|new|no|not|open|or|remove|save|search|select|settings|the|to|update|view|with|your)$/iu.test(word) ? word : '{text}')
      .replace(/[^a-z{}:.,?!\s-]+/giu, '{text}');
    const signature = active.map(scope => scope.id).join(',') + ':' + safe;
    if (misses.has(signature)) return;
    misses.add(signature);
    console.info('[Crisp zh-CN]', signature);
  }

  function sourceOf(node) {
    const old = textState.get(node);
    return old && old.value === node.nodeValue ? old.source : node.nodeValue;
  }

  function writeText(node, source, value) {
    if (node.nodeValue === value) return;
    textState.set(node, { source, value });
    node.nodeValue = value;
  }

  function processText(node, fragments) {
    const element = node.parentElement;
    if (!inScope(element) || fragments.has(node) || element.closest('textarea')) return;
    const source = sourceOf(node);
    const key = normalize(source);
    if (!key) return;
    const value = lookup(key, element, 'text');
    if (value !== undefined) writeText(node, source, keepWhitespace(source, value));
    else {
      writeText(node, source, source);
      debugMiss(key, element, 'text');
    }
  }

  function processAttributes(element) {
    if (!inScope(element)) return;
    for (const name of ATTRS) {
      if (!element.hasAttribute(name)) continue;
      if (name === 'value' && !element.matches('input[type=button],input[type=submit],input[type=reset]')) continue;
      const old = attrState.get(element)?.get(name);
      const current = element.getAttribute(name);
      const source = old?.value === current ? old.source : current;
      const value = lookup(normalize(source), element, name);
      const next = value === undefined ? source : keepWhitespace(source, value);
      if (next === current) continue;
      const saved = attrState.get(element) || new Map();
      saved.set(name, { source, value: next });
      attrState.set(element, saved);
      element.setAttribute(name, next);
    }
  }

  function applyFragments() {
    const changed = new WeakSet();
    for (const scope of active) {
      for (const [selector, source, target] of scope.fragments) {
        for (const element of document.querySelectorAll(selector)) {
          if (!inScope(element) || element.querySelector(BLOCK)) continue;
          const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
          const nodes = [];
          for (let node = walker.nextNode(); node; node = walker.nextNode()) {
            if (normalize(sourceOf(node))) nodes.push(node);
          }
          if (nodes.length !== source.length || nodes.some((node, index) =>
            isBlocked(node.parentElement) || normalize(sourceOf(node)) !== source[index]
          )) continue;
          nodes.forEach((node, index) => {
            const raw = sourceOf(node);
            changed.add(node);
            writeText(node, raw, target[index]);
          });
        }
      }
    }
    return changed;
  }

  function* walk(root) {
    if (root.nodeType === Node.TEXT_NODE) {
      yield root;
      return;
    }
    if (root.nodeType === Node.ELEMENT_NODE) {
      if (isBlocked(root)) return;
      yield root;
    }
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        return node.nodeType === Node.ELEMENT_NODE && isBlocked(node) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
      }
    });
    for (let node = walker.nextNode(); node; node = walker.nextNode()) yield node;
  }

  function queue(root) {
    if (!root) return;
    if (pending.has(document)) return;
    if (root === document || pending.size >= 120) {
      pending.clear();
      pending.add(document);
    } else pending.add(root);
    if (!processing && !timer) timer = setTimeout(flush, 24);
  }

  function flush() {
    timer = 0;
    processing = true;
    if (location.pathname !== pathname) {
      pathname = location.pathname;
      route = pathname.replace(/\/website\/[^/]+/u, '/website/:id').replace(/\/$/u, '');
      active = scopes.filter(scope => scope.path.test(pathname));
      pending.clear();
      pending.add(document);
    }
    const fragments = applyFragments();
    const roots = [...pending];
    pending.clear();
    const connected = roots.filter(root => root === document || root.isConnected);
    const minimal = connected.filter(root => !connected.some(other => other !== root && other.contains(root)));
    const iterator = (function* () {
      for (const root of minimal) yield* walk(root);
    })();
    function chunk() {
      const until = performance.now() + 7;
      let count = 0;
      for (let next = iterator.next(); !next.done; next = iterator.next()) {
        const node = next.value;
        if (node.nodeType === Node.TEXT_NODE) processText(node, fragments);
        else processAttributes(node);
        if (++count === 300 || performance.now() >= until) {
          setTimeout(chunk, 0);
          return;
        }
      }
      processing = false;
      if (pending.size && !timer) timer = setTimeout(flush, 24);
    }
    chunk();
  }

  const observer = new MutationObserver(records => {
    for (const record of records) {
      if (record.type === 'characterData') {
        if (textState.get(record.target)?.value !== record.target.nodeValue) queue(record.target);
      } else if (record.type === 'attributes') {
        if (record.attributeName === 'value' && !record.target.matches('input[type=button],input[type=submit],input[type=reset]')) continue;
        const old = attrState.get(record.target)?.get(record.attributeName);
        if (old?.value !== record.target.getAttribute(record.attributeName)) queue(record.target);
      } else {
        for (const node of record.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) queue(node);
        }
        if (record.removedNodes.length) queue(record.target);
      }
    }
  });
  observer.observe(document, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  for (const method of ['pushState', 'replaceState']) {
    const original = history[method];
    history[method] = function (...args) {
      const result = Reflect.apply(original, this, args);
      if (location.pathname !== pathname) queue(document);
      return result;
    };
  }
  addEventListener('popstate', () => queue(document));
  queue(document);
})();
