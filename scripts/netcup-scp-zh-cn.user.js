// ==UserScript==
// @name         netcup SCP 简体中文
// @namespace    https://github.com/asiananlee/zh-cn-userscripts
// @version      0.1.1
// @description  netcup SCP 服务器控制面板英文界面的简体中文汉化；保留用户数据、代码与凭据。
// @author       asiananlee
// @license      MIT
// @homepageURL  https://github.com/asiananlee/zh-cn-userscripts
// @supportURL   https://github.com/asiananlee/zh-cn-userscripts/issues
// @match        https://www.servercontrolpanel.de/scp-ui/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/*
 * 最后核对：2026-11-28
 * 覆盖范围：www.servercontrolpanel.de/scp-ui/ 登录后英文界面（仅在顶栏选择 EN 时生效，切换 DE 保持原样），涵盖共享导航/页脚/手机菜单、服务器列表、服务器详情全部标签（概览、电源控制、性能统计外围控件、应用目录界面框架、磁盘/镜像/快照/光驱/救援系统、网络、防火墙、访问密码、设置、日志、远程屏幕工具栏与剪贴板）、账户设置与日志、SSH 密钥（含创建弹窗）、防火墙策略（含创建与规则弹窗）、REST API 设置与文档（鉴权指南与 Swagger 授权弹窗）。同时在根节点设置 lang="zh-CN" 与纯本机系统简体中文字体回退（不联网加载外部字体，保留图标与等宽代码字体）。
 * 已知未覆盖：性能统计与远程屏幕 <canvas> 画布内部文字；关机/挂起态下的电源与救援操作界面；Docker 镜像下的已安装应用列表与管理态；已有快照/自定义镜像/自定义 ISO/SSH 密钥/自定义防火墙策略行内编辑删除与确认弹窗；表单提交后的服务端 Toast 与错误提示；外跳至 /realms/scp/account 的密码/2FA/Passkey 页面；REST API 文档页 Swagger OpenAPI 接口规范正文与开源应用目录的第三方软件简介；本版调试输出已在本地复核，实站重放记录来自 0.1.0；切换 DE 语言回退及 Tampermonkey 扩展安装未验证。
 * 不翻译：用户姓名、客户编号、邮箱、服务器编号/主机名/昵称、IPv4/IPv6、MAC 地址、机房地名、系统/ISO 发行版名称、开源应用品牌名与第三方简介、418 项时区与 34 项键盘布局代码、虚拟键盘键帽、日志中的镜像文件名、代码与命令行、URL、数字与容量单位。
 * 调试默认关闭：将 localStorage 的 netcup-scp.zhCN.debug 设为 '1' 后刷新；删除该键或设为 '0' 后刷新关闭。
 * 调试时，控制台只列出有漏译的页面分区和控件类型，每个位置组合只列一次，每次加载最多 100 条。
 */
(() => {
  'use strict';

  if (window.top !== window.self || location.hostname !== 'www.servercontrolpanel.de') return;
  const instance = Symbol.for('netcup-scp.zhCN.0.1.1');
  if (window[instance]) return;
  window[instance] = true;

  // 仅在文档根节点设置简体中文语言标记与纯本机系统字体回退，不联网加载字体，不改动布局与图标/代码字体。
  const SYSTEM_ZH_FONT = '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei UI", "Microsoft YaHei", "Noto Sans CJK SC", "Source Han Sans SC", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  function applySystemFont(enabled) {
    const root = document.documentElement;
    if (!root) return;
    if (enabled) {
      if (root.lang !== 'zh-CN') root.lang = 'zh-CN';
      if (!root.style.fontFamily.includes('PingFang SC')) root.style.fontFamily = SYSTEM_ZH_FONT;
    } else {
      if (root.lang === 'zh-CN') root.removeAttribute('lang');
      if (root.style.fontFamily.includes('PingFang SC')) root.style.fontFamily = '';
    }
  }

  // 1. 公共词典：全站导航、页脚、分页、通用按钮与跨页面复用文案。
  const COMMON_EXACT = new Map([
    ['Access', '访问密码'],
    ['Account', '账户'],
    ['Action', '操作'],
    ['Actions', '操作'],
    ['Active', '已启用'],
    ['API', 'API'],
    ['Apply', '应用'],
    ['Apps', '应用'],
    ['Back', '返回'],
    ['Back to top', '返回顶部'],
    ['Cancel', '取消'],
    ['Close', '关闭'],
    ['Control', '电源控制'],
    ['Copy', '复制'],
    ['CPU', 'CPU'],
    ['Create', '创建'],
    ['Dark mode', '深色模式'],
    ['Date', '日期'],
    ['Delete', '删除'],
    ['Description', '描述'],
    ['Disk', '磁盘'],
    ['Disk IOPS', '磁盘 IOPS'],
    ['Disks', '磁盘'],
    ['DVD Drive', '光驱'],
    ['Firewall', '防火墙'],
    ['Firewall Policies', '防火墙策略'],
    ['First page', '第一页'],
    ['General', '概览'],
    ['Generate', '生成'],
    ['Hostname', '主机名'],
    ['Images', '镜像'],
    ['Install', '安装'],
    ['Install App', '安装应用'],
    ['Image installation is running.', '正在安装镜像。'],
    ['Last page', '最后一页'],
    ['Light mode', '浅色模式'],
    ['Loading...', '加载中…'],
    ['Log', '日志'],
    ['Logout', '退出登录'],
    ['Logs', '日志'],
    ['Media', '媒体'],
    ['Menu', '菜单'],
    ['Name', '名称'],
    ['Network', '网络'],
    ['Network Bytes', '网络流量'],
    ['Network PPS', '网络包速率'],
    ['Next page', '下一页'],
    ['Overview', '概览'],
    ['Pagination', '分页导航'],
    ['Password', '密码'],
    ['per page', '条/页'],
    ['Press Ctrl+K to open the server selection. Arrow keys can be used for selection.', '按 Ctrl+K 打开服务器选择，可使用方向键切换。'],
    ['Previous page', '上一页'],
    ['Product', '产品'],
    ['RAM', '内存'],
    ['Rescue System', '救援系统'],
    ['REST API Docs', 'REST API 文档'],
    ['REST API Settings', 'REST API 设置'],
    ['Running', '运行中'],
    ['Save', '保存'],
    ['Screen', '远程屏幕'],
    ['Search...', '搜索…'],
    ['Servers', '服务器'],
    ['Settings', '设置'],
    ['Size', '大小'],
    ['Snapshots', '快照'],
    ['SSH Keys', 'SSH 密钥'],
    ['Statistics', '性能统计'],
    ['Status', '状态'],
    ['Type', '类型'],
    ['Uploaded', '上传时间'],
    ['Username', '用户名'],
    ['(Recommended)', '（推荐）'],
    ['netcup Help Center', 'netcup 帮助中心'],
    ['netcup Kundenforum', 'netcup 用户论坛'],
    ['netcup Shop', 'netcup 商店']
  ]);

  const COMMON_RULES = [
    ['Interface: {id}', '接口：{id}']
  ];

  // 2. 页面分区：按路径正则区分特定页面文案、覆盖项与碎片化句子。
  const SCOPES = [
    // S01 servers-list ^/scp-ui/servers/?$
    {
      id: 'S01',
      slug: 'servers-list',
      path: /^\/scp-ui\/servers\/?$/,
      exact: new Map([
        ['Welcome', '欢迎'],
        ['No servers found.', '未找到服务器。']
      ]),
      rules: [],
      overrides: new Map(),
      fragments: [
        {
          tag: 'span',
          guard: 'nc-servers-hero',
          source: 'Welcome ,',
          atoms: [
            ['Welcome', '欢迎'],
            [',', '，']
          ]
        },
        {
          tag: 'span',
          guard: 'nc-datatable',
          source: 'Showing {n} to {n} of {n} entries',
          atoms: [
            ['Showing', '显示第'],
            ['{n}', '{n}'],
            ['to', '至'],
            ['{n}', '{n}'],
            ['of', '项，共'],
            ['{n}', '{n}'],
            ['entries', '项']
          ]
        }
      ]
    },

    // V01 server-general ^/scp-ui/servers/[^/]+(?:/general)?/?$
    {
      id: 'V01',
      slug: 'server-general',
      path: /^\/scp-ui\/servers\/[^/]+(?:\/general)?\/?$/,
      exact: new Map([
        ['Architecture', '架构'],
        ['Boot Device', '启动设备'],
        ['CPUs', 'CPU 核心数'],
        ['Exports', '镜像导出额度'],
        ['Firewall (#Policies)', '防火墙（策略数）'],
        ['General Information', '基本信息'],
        ['Hardware', '硬件配置'],
        ['HDD', '硬盘'],
        ['ISO', 'ISO 镜像'],
        ['MAC', 'MAC 地址'],
        ['Nickname', '昵称'],
        ['Open Console', '打开控制台'],
        ['Site', '机房位置'],
        ['State', '运行状态'],
        ['Traffic (current month)', '本月流量'],
        ['Uptime', '运行时间']
      ]),
      rules: [
        ['{n} left', '剩余 {n} 次'],
        ['{n}d {n}h {n}m', '{n} 天 {n:2} 小时 {n:3} 分钟']
      ],
      overrides: new Map(),
      fragments: []
    },

    // V02 server-control ^/scp-ui/servers/[^/]+/control/?$
    {
      id: 'V02',
      slug: 'server-control',
      path: /^\/scp-ui\/servers\/[^/]+\/control\/?$/,
      exact: new Map([
        ['ACPI Shutdown', 'ACPI 关机'],
        ['Current state:', '当前状态：'],
        ['Immediately power off the server. Unsaved data may be lost.', '立即关闭服务器电源。未保存的数据可能会丢失。'],
        ['Power Off', '强制断电'],
        ['Power off and restart the server.', '关闭电源并重新启动服务器。'],
        ['Powercycle', '断电重启'],
        ['Reset the server. This is equivalent to pressing the reset button.', '重置服务器，相当于按下实体复位键。'],
        ['Send an ACPI shutdown signal to the server. The operating system will perform a graceful shutdown.', '向服务器发送 ACPI 关机信号，操作系统将执行正常关机。'],
        ['Suspend', '挂起'],
        ['Suspend the server. The server state will be saved to memory.', '挂起服务器，服务器状态将保存到内存中。']
      ]),
      rules: [],
      overrides: new Map([
        ['Reset', '硬重启']
      ]),
      fragments: []
    },

    // V03 server-statistics ^/scp-ui/servers/[^/]+/statistics(?:/.*)?$
    {
      id: 'V03',
      slug: 'server-statistics',
      path: /^\/scp-ui\/servers\/[^/]+\/statistics(?:\/.*)?$/,
      exact: new Map([
        ['Export as PNG', '导出为 PNG'],
        ['Last 24 hours', '最近 24 小时'],
        ['Last 31 days', '最近 31 天'],
        ['Last 6 hours', '最近 6 小时'],
        ['Last 7 days', '最近 7 天'],
        ['Pan', '平移'],
        ['Reset Zoom', '重置缩放'],
        ['Zoom In', '放大'],
        ['Zoom Out', '缩小']
      ]),
      rules: [],
      overrides: new Map(),
      fragments: []
    },

    // V04-V05 server-apps ^/scp-ui/servers/[^/]+/apps(?:/.*)?$
    {
      id: 'V04',
      slug: 'server-apps',
      path: /^\/scp-ui\/servers\/[^/]+\/apps(?:\/.*)?$/,
      exact: new Map([
        ['AI & Automation', 'AI 与自动化'],
        ['Categories', '应用分类'],
        ['Communication', '即时通讯'],
        ['Data', '数据'],
        ['Databases & Messaging', '数据库与消息队列'],
        ['Development', '开发工具'],
        ['Install new App', '安装新应用'],
        ['Monitoring', '监控告警'],
        ['No apps found.', '未找到应用。'],
        ['Security', '安全'],
        ['Web', 'Web 应用']
      ]),
      rules: [],
      overrides: new Map(),
      fragments: [
        {
          tag: 'span',
          guard: 'nc-warning',
          source: 'Your server is currently incompatible. Please install a Docker-based image under Media › Images . In special cases (e.g. a custom image setup with an app-compatible image), this can also be fixed by clicking Restore compatibility .',
          atoms: [
            ['Your server is currently incompatible. Please install a Docker-based image under', '当前服务器暂不兼容。请先在'],
            ['Media › Images', '媒体 › 镜像'],
            ['.', '中安装基于 Docker 的镜像。'],
            ['In special cases (e.g. a custom image setup with an app-compatible image), this can also be fixed by clicking', '特殊情况下（例如使用兼容应用的自定义镜像），也可以点击'],
            ['Restore compatibility', '恢复兼容性'],
            ['.', '进行修复。']
          ]
        }
      ]
    },

    // V06 server-media-disks ^/scp-ui/servers/[^/]+/media(?:/disks)?/?$
    {
      id: 'V06',
      slug: 'server-media-disks',
      path: /^\/scp-ui\/servers\/[^/]+\/media(?:\/disks)?\/?$/,
      exact: new Map([
        ['All disks', '所有磁盘'],
        ['Changing the driver requires a server restart.', '更改驱动需要重启服务器。'],
        ['Format Disk', '格式化磁盘'],
        ['Leave the Server stopped', '完成后保持服务器关机'],
        ['No entries found.', '暂无记录。'],
        ['Space', '空间占用'],
        ['Space reflects reserved storage on the host system and may differ from actual disk usage. If it does, running a storage optimization is recommended. Encrypted volumes may not display correctly, as unused blocks cannot be detected.', '此处显示的是宿主机上已预留的存储空间，可能与实际磁盘使用量不同。如有差异，建议运行存储优化。加密卷因无法检测未使用块，可能无法正确显示。'],
        ['Start Storage Optimization', '开始存储优化'],
        ['Storage Driver', '存储驱动'],
        ['Storage Optimization', '存储优化'],
        ['The server must be shut down to format a disk.', '格式化磁盘前必须先关闭服务器。']
      ]),
      rules: [],
      overrides: new Map(),
      fragments: [
        {
          tag: 'span',
          guard: 'nc-media-disks',
          source: '{n} of {n} used',
          atoms: [
            ['{n}', '{n}'],
            ['of', '/'],
            ['{n}', '{n}'],
            ['used', '已用']
          ]
        },
        {
          tag: 'div',
          guard: 'nc-media-disks',
          source: '{n} of {n} used',
          atoms: [
            ['{n}', '{n}'],
            ['of', '/'],
            ['{n}', '{n}'],
            ['used', '已用']
          ]
        },
        {
          tag: 'td',
          guard: 'nc-media-disks',
          source: '{n} of {n} used',
          atoms: [
            ['{n}', '{n}'],
            ['of', '/'],
            ['{n}', '{n}'],
            ['used', '已用']
          ]
        }
      ]
    },

    // V07 server-media-images ^/scp-ui/servers/[^/]+/media/images/?$
    {
      id: 'V07',
      slug: 'server-media-images',
      path: /^\/scp-ui\/servers\/[^/]+\/media\/images\/?$/,
      exact: new Map([
        ['A large partition for the OS that contains all available disk space.', '为操作系统分配单个大分区，占用全部可用磁盘空间。'],
        ['App Images', '应用镜像'],
        ['Application', '应用'],
        ['Create additional user', '创建附加用户'],
        ['Custom image upload', '上传自定义镜像'],
        ['Custom Images', '自定义镜像'],
        ['Custom Script', '自定义脚本'],
        ['e.g. admin', '例如 admin'],
        ['e.g. myimage.qcow2', '例如 myimage.qcow2'],
        ['Generate Upload URL', '生成上传链接'],
        ['If no browser is available for the upload, you can generate a valid URL here and execute the upload via the command line using a tool such as curl.', '如果无法通过浏览器上传，你可以在此处生成有效链接，再通过 curl 等命令行工具执行上传。'],
        ['Installation method', '安装方式'],
        ['Locale', '语言区域'],
        ['Min. 8 chars, uppercase, lowercase, number', '至少 8 位，需包含大小写字母和数字'],
        ['minimal', '精简版'],
        ['Minimal', '精简版'],
        ['Minimal installation', '精简安装'],
        ['No uploaded images.', '暂无已上传的镜像。'],
        ['Only files of type qcow, qcow2 and raw are officially supported.', '官方仅支持 qcow、qcow2 和 raw 格式文件。'],
        ['Operating System Images', '操作系统镜像'],
        ['Partitioning', '分区方案'],
        ['Preinstalled Docker', '预装 Docker'],
        ['Select a distribution to install on the server. All data on the primary disk will be lost.', '选择要安装到服务器的发行版。主磁盘上的所有数据都将丢失。'],
        ['Select file or drag & drop', '选择文件或拖放到此处'],
        ['Send e-mail to me', '向我发送邮件通知'],
        ['Source', '来源'],
        ['The given script will be executed at the end of the image installation. Please make sure that the script is executable (annotated with a Shebang #!). Whether a script language is being supported or not depends on the installed image. The maximum number of characters for a script is limited to 10,000 characters. In case you need to support a script that is more than the character limit, you could use e.g. a wget/curl script that downloads the script from a secure remote location.', '所填脚本将在镜像安装结束时执行。请确保脚本具备可执行格式（开头带有 Shebang `#!`）。支持的脚本语言取决于所安装的镜像。脚本最长限制为 10,000 个字符；如需超出长度限制，可使用 wget/curl 脚本从安全的远程位置下载执行。'],
        ['The OS is installed on a small partition. The remaining disk space can be partitioned as needed.', '将操作系统安装在一个较小分区中，其余磁盘空间可按需自行分区。'],
        ['The upload URL is valid for 24 hours.', '上传链接有效期为 24 小时。'],
        ['Timezone', '时区'],
        ['Uploads and exports are automatically deleted after 48h.', '上传和导出的镜像将在 48 小时后自动删除。'],
        ['User Password', '用户密码']
      ]),
      rules: [],
      overrides: new Map(),
      fragments: []
    },

    // V08 server-media-snapshots ^/scp-ui/servers/[^/]+/media/snapshots/?$
    {
      id: 'V08',
      slug: 'server-media-snapshots',
      path: /^\/scp-ui\/servers\/[^/]+\/media\/snapshots\/?$/,
      exact: new Map([
        ['Create Snapshot', '创建快照'],
        ['Creation Date', '创建时间'],
        ['No snapshots found.', '暂无快照。'],
        ['Offline Snapshot', '离线快照'],
        ['Online Snapshot', '在线快照'],
        ['Online snapshots are not available when UEFI boot is enabled.', '启用 UEFI 启动时无法使用在线快照。']
      ]),
      rules: [],
      overrides: new Map(),
      fragments: []
    },

    // V09 server-media-dvd-drive ^/scp-ui/servers/[^/]+/media/dvd-drive/?$
    {
      id: 'V09',
      slug: 'server-media-dvd-drive',
      path: /^\/scp-ui\/servers\/[^/]+\/media\/dvd-drive\/?$/,
      exact: new Map([
        ['Attach', '挂载'],
        ['Boot from CD-ROM', '从光驱启动'],
        ['Custom ISO upload', '上传自定义 ISO'],
        ['Custom ISOs', '自定义 ISO'],
        ['e.g. ubuntu-server.iso', '例如 ubuntu-server.iso'],
        ['Generate Upload URL', '生成上传链接'],
        ['If no browser is available for the upload, you can generate a valid URL here and execute the upload via the command line using a tool such as curl.', '如果无法通过浏览器上传，你可以在此处生成有效链接，再通过 curl 等命令行工具执行上传。'],
        ['ISOs are automatically deleted after 48 hours.', 'ISO 文件将在 48 小时后自动删除。'],
        ['No uploaded ISOs.', '暂无已上传的 ISO。'],
        ['Official DVDs', '官方光盘镜像'],
        ['Only files of type iso are officially supported.', '官方仅支持 iso 格式文件。'],
        ['Select a DVD to insert into the virtual drive of the server.', '选择要插入服务器虚拟光驱的光盘镜像。'],
        ['Select file or drag & drop', '选择文件或拖放到此处'],
        ['The upload URL is valid for 24 hours.', '上传链接有效期为 24 小时。']
      ]),
      rules: [],
      overrides: new Map(),
      fragments: []
    },

    // V10 server-media-rescue-system ^/scp-ui/servers/[^/]+/media/rescue-system/?$
    {
      id: 'V10',
      slug: 'server-media-rescue-system',
      path: /^\/scp-ui\/servers\/[^/]+\/media\/rescue-system\/?$/,
      exact: new Map([
        ['After activating the rescue system, the server is started automatically. You can then log in after the boot via SSH with the root user or use the server console.', '激活救援系统后，服务器将自动启动。启动完成后，你可以通过 SSH 使用 root 用户登录，或使用服务器控制台。'],
        ['The rescue system must be explicitly deactivated again after use. A reboot does not automatically deactivate the rescue system.', '使用完毕后必须手动停用救援系统，重启服务器不会自动停用。'],
        ['The server must be shut off before activating the rescue system.', '激活救援系统前必须先关闭服务器。']
      ]),
      rules: [],
      overrides: new Map(),
      fragments: []
    },

    // V11 server-network ^/scp-ui/servers/[^/]+/network/?$
    {
      id: 'V11',
      slug: 'server-network',
      path: /^\/scp-ui\/servers\/[^/]+\/network\/?$/,
      exact: new Map([
        ['Driver', '网卡驱动'],
        ['Gateway / Routed to', '网关 / 路由目标'],
        ['IPv4 Addresses', 'IPv4 地址'],
        ['IPv6 Addresses', 'IPv6 地址'],
        ['MAC Address', 'MAC 地址'],
        ['Reverse DNS', '反向 DNS'],
        ['Speed', '速率']
      ]),
      rules: [],
      overrides: new Map(),
      fragments: []
    },

    // V12 server-firewall ^/scp-ui/servers/[^/]+/firewall/?$
    {
      id: 'V12',
      slug: 'server-firewall',
      path: /^\/scp-ui\/servers\/[^/]+\/firewall\/?$/,
      exact: new Map([
        ['Accept', '允许'],
        ['Accept all', '全部允许'],
        ['allow ICMP (ping) on IPv4 and IPv6', '允许 IPv4 和 IPv6 的 ICMP（ping）流量'],
        ['allow incoming ping', '允许入站 ping'],
        ['allow incoming ping6', '允许入站 ping6'],
        ['allow outgoing ping', '允许出站 ping'],
        ['allow outgoing ping6', '允许出站 ping6'],
        ['ANY', '任意'],
        ['Applied automatically at the end', '在规则末尾自动应用'],
        ['blocks outgoing SMTP (Mail) traffic', '拦截出站 SMTP（邮件）流量'],
        ['Collapse all', '全部折叠'],
        ['Copy to clipboard', '复制到剪贴板'],
        ['Default', '默认'],
        ['Drop', '丢弃'],
        ['drop outgoing SMTP', '丢弃出站 SMTP'],
        ['drop outgoing SMTPS', '丢弃出站 SMTPS'],
        ['drop outgoing submission', '丢弃出站邮件提交端口'],
        ['Edit Firewall Policies', '编辑防火墙策略'],
        ['Edit Policies', '编辑策略'],
        ['Expand all', '全部展开'],
        ['Firewall active', '启用防火墙'],
        ['Implicit Rules', '隐式规则'],
        ['INCOMING', '入站'],
        ['Interface', '网络接口'],
        ['IPs', 'IP 地址'],
        ['MAC', 'MAC 地址'],
        ['netcup Mail block', 'netcup 邮件拦截'],
        ['netcup Ping allow', 'netcup Ping 放行'],
        ['No firewall policies have been created yet.', '尚未创建任何防火墙策略。'],
        ['OUTGOING', '出站'],
        ['Restore Default Policies', '恢复默认策略'],
        ['Rules are evaluated from top to bottom until the first matching rule applies.', '规则按从上到下的顺序匹配，直到第一条命中的规则生效。'],
        ['Select the Firewall Policies to apply to this server. Drag and drop to reorder.', '选择要应用到此服务器的防火墙策略，可拖放调整顺序。'],
        ['System', '系统']
      ]),
      rules: [],
      overrides: new Map(),
      fragments: []
    },

    // V13 server-access ^/scp-ui/servers/[^/]+/access/?$
    {
      id: 'V13',
      slug: 'server-access',
      path: /^\/scp-ui\/servers\/[^/]+\/access\/?$/,
      exact: new Map([
        ['At least 8 characters, including uppercase, lowercase, and a digit', '至少 8 个字符，需包含大写字母、小写字母和数字'],
        ['Hide password', '隐藏密码'],
        ['Set a new root password. Currently, this only works for Linux-based servers.', '设置新的 root 密码。目前仅支持 Linux 服务器。'],
        ['Set Password', '设置密码'],
        ['Set Root Password', '设置 Root 密码'],
        ['Show password', '显示密码'],
        ['The password shown here is a newly generated suggestion, not your current password. Feel free to change it.', '此处显示的是新生成的建议密码，而非你当前的密码，可自由修改。']
      ]),
      rules: [],
      overrides: new Map(),
      fragments: []
    },

    // V14 server-settings ^/scp-ui/servers/[^/]+/settings/?$
    {
      id: 'V14',
      slug: 'server-settings',
      path: /^\/scp-ui\/servers\/[^/]+\/settings\/?$/,
      exact: new Map([
        ['Automatically start the server when the host system boots.', '宿主机启动时自动启动此服务器。'],
        ['Autostart', '自动启动'],
        ['Boot Order', '启动顺序'],
        ['CD-ROM', '光驱'],
        ['Cores per Socket', '每插槽核心数'],
        ['CPU Topology', 'CPU 拓扑'],
        ['Distribute the CPUs across sockets and cores. The total number of CPUs remains unchanged.', '将 CPU 分配到不同插槽与核心，CPU 总核心数保持不变。'],
        ['Hard Disk', '硬盘'],
        ['Keyboard Layout', '键盘布局'],
        ['Keyboard layout for the VNC console.', 'VNC 控制台使用的键盘布局。'],
        ['Linux (Legacy)', 'Linux（传统模式）'],
        ['Number of CPUs', 'CPU 总数'],
        ['Optimizes the hypervisor for the selected operating system.', '针对所选操作系统优化虚拟化平台配置。'],
        ['OS Optimization', '操作系统优化'],
        ['Set the boot priority. The server boots from the first available device.', '设置启动优先级，服务器将从第一个可用设备启动。'],
        ['Sockets', '插槽数'],
        ['UEFI Boot', 'UEFI 启动'],
        ['Use UEFI firmware instead of legacy BIOS.', '使用 UEFI 固件替代传统 BIOS。']
      ]),
      rules: [],
      overrides: new Map(),
      fragments: []
    },

    // V15 server-log ^/scp-ui/servers/[^/]+/log/?$
    {
      id: 'V15',
      slug: 'server-log',
      path: /^\/scp-ui\/servers\/[^/]+\/log\/?$/,
      exact: new Map([
        ['Event', '事件'],
        ['INFO', '信息'],
        ['New image installed', '已安装新镜像'],
        ['No log entries available.', '暂无日志记录。'],
        ['No log entries found.', '暂无日志记录。']
      ]),
      rules: [],
      overrides: new Map(),
      fragments: [
        {
          tag: 'span',
          guard: 'nc-datatable',
          source: 'Showing {n} to {n} of {n} entries',
          atoms: [
            ['Showing', '显示第'],
            ['{n}', '{n}'],
            ['to', '至'],
            ['{n}', '{n}'],
            ['of', '项，共'],
            ['{n}', '{n}'],
            ['entries', '项']
          ]
        }
      ]
    },

    // V16 server-screen ^/scp-ui/servers/[^/]+/screen/?$
    {
      id: 'V16',
      slug: 'server-screen',
      path: /^\/scp-ui\/servers\/[^/]+\/screen\/?$/,
      exact: new Map([
        ['Clipboard', '剪贴板'],
        ['Fullscreen', '全屏'],
        ['Keyboard', '虚拟键盘'],
        ['Open (new window)', '新窗口打开'],
        ['Paste', '粘贴'],
        ['Paste text here to send to remote...', '在此粘贴要发送到远程主机的文本…'],
        ['Scale to Fit', '适应窗口'],
        ['Screenshot', '截图'],
        ['Type as Keys', '模拟按键输入']
      ]),
      rules: [],
      overrides: new Map(),
      fragments: []
    },

    // A01 account-settings ^/scp-ui/account(?:/settings)?/?$
    {
      id: 'A01',
      slug: 'account-settings',
      path: /^\/scp-ui\/account(?:\/settings)?\/?$/,
      exact: new Map([
        ['Account Data', '账户资料'],
        ['Account Settings', '账户设置'],
        ['Activate Passkey', '启用通行密钥'],
        ['Activate Two-Factor Authentication', '启用双重身份验证'],
        ['Change Password', '修改密码'],
        ['Easy Password Mode', '简易密码模式'],
        ['Email', '邮箱'],
        ['English', '英语（English）'],
        ['First Name', '名'],
        ['German', '德语（German）'],
        ['Language', '语言'],
        ['Last Name', '姓'],
        ['Passwordless Login (Passkey)', '无密码登录（Passkey）'],
        ['Timezone', '时区'],
        ['Two-Factor Authentication (Passkey)', '双重身份验证（Passkey）'],
        ['Two-Factor Authentication (TOTP)', '双重身份验证（TOTP）'],
        ['With this option you can globally disable all password prompts, for example while reinstalling a virtual server.', '开启此选项后，将全局关闭所有密码确认提示（例如重装虚拟服务器时）。']
      ]),
      rules: [],
      overrides: new Map(),
      fragments: []
    },

    // A02 account-log ^/scp-ui/account/log/?$
    {
      id: 'A02',
      slug: 'account-log',
      path: /^\/scp-ui\/account\/log\/?$/,
      exact: new Map([
        ['Message', '消息'],
        ['No log entries found.', '暂无日志记录。']
      ]),
      rules: [],
      overrides: new Map(),
      fragments: []
    },

    // K01 ssh-keys ^/scp-ui/ssh-keys/?$
    {
      id: 'K01',
      slug: 'ssh-keys',
      path: /^\/scp-ui\/ssh-keys\/?$/,
      exact: new Map([
        ['Created on', '创建时间'],
        ['Create SSH Key', '创建 SSH 密钥'],
        ['No SSH keys defined.', '尚未添加 SSH 密钥。'],
        ['SSH Key', 'SSH 密钥'],
        ['The SSH key is only installed when an image is installed and the option to use it is selected. It is not applied to existing servers.', 'SSH 密钥仅在安装镜像并勾选对应选项时写入，不会自动应用到现有服务器。']
      ]),
      rules: [],
      overrides: new Map(),
      fragments: []
    },

    // F01 firewall-policies ^/scp-ui/firewall-policies/?$
    {
      id: 'F01',
      slug: 'firewall-policies',
      path: /^\/scp-ui\/firewall-policies\/?$/,
      exact: new Map([
        ['ACCEPT', '允许'],
        ['Add Rule', '添加规则'],
        ['Create Firewall Policy', '创建防火墙策略'],
        ['Destinations', '目标地址'],
        ['Direction', '方向'],
        ['Drag the grip handle to reorder rules.', '拖动左侧手柄可调整规则顺序。'],
        ['DROP', '丢弃'],
        ['Dst Ports', '目标端口'],
        ['INCOMING', '入站'],
        ['No firewall policies defined.', '尚未定义防火墙策略。'],
        ['No rules defined. Click "Add Rule" to create one.', '尚未定义规则。点击“添加规则”创建一条。'],
        ['OUTGOING', '出站'],
        ['Protocol', '协议'],
        ['Rules', '规则'],
        ['Sources', '源地址'],
        ['Src Ports', '源端口']
      ]),
      rules: [],
      overrides: new Map([
        ['Action', '动作']
      ]),
      fragments: []
    },

    // P01 api-rest-settings ^/scp-ui/api(?:/rest-settings)?/?$
    {
      id: 'P01',
      slug: 'api-rest-settings',
      path: /^\/scp-ui\/api(?:\/rest-settings)?\/?$/,
      exact: new Map([
        ['Comma-separated list of IP addresses or CIDR ranges allowed to use the REST API. Leave empty to allow all IPs.', '允许访问 REST API 的 IP 地址或 CIDR 网段列表（以逗号分隔）。留空表示允许所有 IP。'],
        ['Infrastructure, automated.', '自动化管理你的基础设施。'],
        ['IP Filter', 'IP 过滤'],
        ['REST API Security', 'REST API 安全']
      ]),
      rules: [],
      overrides: new Map(),
      fragments: []
    },

    // P02 api-rest-docs ^/scp-ui/api/rest-docs/?$
    {
      id: 'P02',
      slug: 'api-rest-docs',
      path: /^\/scp-ui\/api\/rest-docs\/?$/,
      exact: new Map([
        ['Accept grant access to SCP with privileges profile, offline_access, roles, email after submitting your credentials.', '提交凭据后，同意向 SCP 授予 profile、offline_access、roles 和 email 权限。'],
        ['API requires the following scopes. Select which ones you want to grant to Swagger UI.', 'API 需要以下权限范围，请选择要授予 Swagger UI 的范围。'],
        ['Apply given OAuth2 credentials', '应用所填写的 OAuth2 凭据'],
        ['Authentication', '身份验证'],
        ['Authorization', '授权'],
        ['Authorization header', 'Authorization 请求头'],
        ['Authorization URL:', '授权地址（Authorization URL）：'],
        ['Authorize', '授权'],
        ['Available authorizations', '可用授权方式'],
        ['Client credentials location:', '客户端凭据位置：'],
        ['Flow:', '授权流程：'],
        ['Forgotten refresh tokens can be revoked in the Account Console (Menu "Applications" - Application "scp" - Button "Remove access"):', '遗忘的刷新令牌可在账户控制台中撤销（菜单“Applications”→ 应用“scp”→ 按钮“Remove access”）：'],
        ['Generate access token and offline access refresh token with device_code from response in step "Generate verification URI".', '使用“生成验证 URI”步骤响应中的 device_code，生成访问令牌和离线刷新令牌。'],
        ['Generate offline access refresh token', '生成离线访问刷新令牌'],
        ['Generate verification URI.', '生成验证 URI。'],
        ['If the refresh token is leaked or no longer needed it could be revoked.', '如果刷新令牌泄露或不再需要，可将其撤销。'],
        ['Infrastructure, automated.', '自动化管理你的基础设施。'],
        ['Open', '打开'],
        ['Open verification_uri_complete from response in Browser and enter your user credentials.', '在浏览器中打开响应中的 verification_uri_complete，并输入你的用户凭据。'],
        ['OpenID Connect URL:', 'OpenID Connect 地址：'],
        ['Refresh access token', '刷新访问令牌'],
        ['Request body', '请求体'],
        ['Revoke refresh token', '撤销刷新令牌'],
        ['Schemas', '数据模型'],
        ['Scopes are used to grant an application different levels of access to data on behalf of the end user. Each API may declare one or more scopes.', '权限范围（Scopes）用于代表终端用户向应用授予不同级别的数据访问权限，每个 API 可声明一个或多个范围。'],
        ['Scopes:', '权限范围：'],
        ['select all', '全选'],
        ['select none', '全不选'],
        ['The offline refresh token can be used multiple times and does not expire as long as it is used at least once every 30 days.', '离线刷新令牌可多次使用；只要每 30 天内至少使用一次就不会过期。'],
        ['To use the API, you need a bearer access token. Each request must include the bearer access token in the HTTP Authorization header. There are three relevant processes for handling access tokens:', '使用 API 需要 Bearer 访问令牌，每次请求都必须在 HTTP Authorization 请求头中携带该令牌。处理访问令牌涉及以下三个主要流程：'],
        ['Token URL:', '令牌地址（Token URL）：'],
        ['Use access token within the next 300 seconds to access the API. See "Refresh access token" how to obtain a new access token.', '请在 300 秒内使用访问令牌调用 API。获取新访问令牌的方法见“刷新访问令牌”。'],
        ['Use the following endpoint to find out the ID of the user.', '使用以下端点查询当前用户的 ID。'],
        ['User Info', '用户信息']
      ]),
      rules: [],
      overrides: new Map(),
      fragments: []
    }
  ];

  // 3. 配置：属性白名单、必须跳过的区域及免报调试项。
  const ATTRS = ['placeholder', 'title', 'aria-label', 'alt', 'aria-description', 'value'];
  const BLOCK = 'script,style,noscript,code,pre,kbd,textarea,iframe,[contenteditable="true"],[contenteditable=""],nc-language,nc-user-name,nc-server-name-secondary,nc-site,read-frog,.read-frog';
  const PRESERVED = new Set([
    'EN', 'DE', 'SCP', 'netcup', 'netcup SCP', 'netcup GmbH', 'API', 'CPU', 'IPv4', 'IPv6',
    'CIDR', 'ISO', 'HDD', 'AMD64', 'VIRTIO', 'SCSI', 'IDE', 'virtio', 'e1000', 'e1000e',
    'rtl8139', 'vmxnet3', 'TCP', 'UDP', 'ICMP', 'ICMPv6', 'SMTP (TCP)', 'SMTPS (TCP)',
    'Ctrl+Alt+Del', 'Linux', 'Windows', 'BSD', 'vda', 'vdb', 'vdc', 'MBit/s', 'GiB', 'MiB'
  ]);

  const PLACEHOLDER_PATTERNS = {
    '{n}': '([\\d,.]+(?:\\s*(?:GiB|MiB|TiB|KiB|GB|MB|TB|KB|B|%))?)',
    '{amount}': '([$€£¥]\\s*[\\d,.]+|[\\d,.]+\\s*(?:EUR|USD))',
    '{date}': '(\\d{2}\\.\\d{2}\\.\\d{4}(?:\\s+\\d{2}:\\d{2})?|\\d{4}-\\d{2}-\\d{2})',
    '{user}': '(.+?)',
    '{domain}': '([A-Za-z0-9.-]+\\.[A-Za-z]{2,})',
    '{email}': '([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,})',
    '{url}': '(https?:\\/\\/\\S+)',
    '{id}': '([A-Za-z0-9:._-]+)',
    '{token}': '([A-Za-z0-9._-]{8,})',
    '{ip}': '([0-9a-fA-F:.]+(?:\\/\\d{1,3})?)',
    '{model}': '(.+?)',
    '{provider}': '(.+?)'
  };
  const PLACEHOLDER_RE = /\{(n|amount|date|user|domain|email|url|id|token|ip|model|provider)\}/g;

  function normalize(text) {
    return (text || '').replace(/\s+/g, ' ').trim();
  }

  function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function compileTemplate(pattern) {
    const names = [];
    let regexText = '^';
    let lastIndex = 0;
    PLACEHOLDER_RE.lastIndex = 0;
    for (const match of pattern.matchAll(PLACEHOLDER_RE)) {
      regexText += escapeRegex(pattern.slice(lastIndex, match.index));
      const token = match[0];
      names.push(match[1]);
      regexText += PLACEHOLDER_PATTERNS[token];
      lastIndex = match.index + token.length;
    }
    regexText += escapeRegex(pattern.slice(lastIndex)) + '$';
    return { regex: new RegExp(regexText), names };
  }

  function compileRule([source, target]) {
    const compiled = compileTemplate(source);
    return { source, target, regex: compiled.regex, names: compiled.names };
  }

  function applyRule(rule, text) {
    const match = rule.regex.exec(text);
    if (!match) return null;
    const byName = new Map();
    rule.names.forEach((name, idx) => {
      if (!byName.has(name)) byName.set(name, []);
      byName.get(name).push(match[idx + 1]);
    });
    const used = new Map();
    return rule.target.replace(/\{(n|amount|date|user|domain|email|url|id|token|ip|model|provider)(?::(\d+))?\}/g, (_, name, indexStr) => {
      const list = byName.get(name) || [];
      if (indexStr) return list[Number(indexStr) - 1] ?? '';
      const pos = used.get(name) || 0;
      used.set(name, pos + 1);
      return list[pos] ?? list[0] ?? '';
    });
  }

  const COMPILED_COMMON_RULES = COMMON_RULES.map(compileRule);
  for (const scope of SCOPES) {
    scope.compiledRules = scope.rules.map(compileRule);
    scope.compiledFragments = scope.fragments.map(frag => {
      const fullCompiled = compileTemplate(frag.source);
      const spacedCompiled = compileTemplate(frag.atoms.map(([s]) => s).join(' '));
      return {
        tag: frag.tag,
        guard: frag.guard || null,
        fullRegex: fullCompiled.regex,
        spacedRegex: spacedCompiled.regex,
        atoms: frag.atoms.map(compileRule)
      };
    });
  }

  // 4. 引擎：EN 语言判断、标题映射、匹配、跳过判断、写入、调试输出、MutationObserver 与路由监听。
  function isEnglishMode() {
    const active = document.querySelector('nc-language button.active');
    if (!active) return true;
    return normalize(active.textContent) === 'EN';
  }

  const TITLE_SECTION_MAP = new Map([
    ['General', '概览'],
    ['Control', '电源控制'],
    ['Statistics', '性能统计'],
    ['Apps', '应用'],
    ['Media', '媒体'],
    ['Network', '网络'],
    ['Firewall', '防火墙'],
    ['Access', '访问密码'],
    ['Settings', '设置'],
    ['Log', '日志'],
    ['Screen', '远程屏幕']
  ]);

  const TITLE_EXACT = new Map([
    ['netcup SCP: Servers', 'netcup SCP：服务器'],
    ['netcup SCP: Account - Settings', 'netcup SCP：账户 - 设置'],
    ['netcup SCP: Account - Logs', 'netcup SCP：账户 - 日志'],
    ['netcup SCP: Ssh-keys', 'netcup SCP：SSH 密钥'],
    ['netcup SCP: Firewall-policies', 'netcup SCP：防火墙策略'],
    ['netcup SCP: Api - REST API Settings', 'netcup SCP：API - REST API 设置'],
    ['netcup SCP: Api - REST API Docs', 'netcup SCP：API - REST API 文档']
  ]);

  let lastTitleSource = '';
  let lastTitleWritten = '';
  function translateTitle() {
    if (!isEnglishMode()) {
      if (lastTitleWritten && document.title === lastTitleWritten && lastTitleSource) {
        document.title = lastTitleSource;
      }
      lastTitleWritten = '';
      return;
    }
    const current = document.title;
    const source = current === lastTitleWritten ? lastTitleSource : current;
    const norm = normalize(source);
    let translated = TITLE_EXACT.get(norm) || null;
    if (!translated) {
      const m1 = /^netcup SCP: Servers - (General|Control|Statistics|Apps|Media|Network|Firewall|Access|Settings|Log|Screen)$/.exec(norm);
      if (m1) translated = `netcup SCP：服务器 - ${TITLE_SECTION_MAP.get(m1[1])}`;
    }
    if (!translated) {
      const m2 = /^netcup SCP: Servers - (.+?) - (General|Control|Statistics|Apps|Media|Network|Firewall|Access|Settings|Log|Screen)$/.exec(norm);
      if (m2) translated = `netcup SCP：服务器 - ${m2[1]} - ${TITLE_SECTION_MAP.get(m2[2])}`;
    }
    if (translated && document.title !== translated) {
      lastTitleSource = source;
      lastTitleWritten = translated;
      document.title = translated;
    }
  }

  let pathname = location.pathname;
  let currentScopes = [];
  let currentRules = [];
  let currentFragments = new Map();

  function selectPath() {
    pathname = location.pathname;
    currentScopes = SCOPES.filter(scope => scope.path.test(pathname));
    currentRules = [...currentScopes.flatMap(scope => scope.compiledRules), ...COMPILED_COMMON_RULES];
    currentFragments = new Map();
    for (const scope of currentScopes) {
      for (const frag of scope.compiledFragments) {
        if (!currentFragments.has(frag.tag)) currentFragments.set(frag.tag, []);
        currentFragments.get(frag.tag).push(frag);
      }
    }
  }
  selectPath();

  function translateText(normText) {
    for (const scope of currentScopes) if (scope.overrides.has(normText)) return scope.overrides.get(normText);
    for (const scope of currentScopes) if (scope.exact.has(normText)) return scope.exact.get(normText);
    if (COMMON_EXACT.has(normText)) return COMMON_EXACT.get(normText);
    for (const rule of currentRules) {
      const res = applyRule(rule, normText);
      if (res !== null) return res;
    }
    return null;
  }

  function skip(element, type = 'text') {
    if (!element || element.closest(BLOCK)) return true;
    if (element.closest('svg')) return true;
    if (type === 'text' && element.closest('input,textarea')) return true;
    // 跳过大列表技术下拉（418 项 IANA 时区、34 项键盘布局代码等）
    if (element.tagName === 'OPTION') {
      const sel = element.closest('select');
      if (sel && sel.options.length > 20) return true;
    }
    // 跳过开源应用目录的第三方应用名与英文介绍（保留界面框架与分类筛选）
    if (element.closest('.nc-app-card-name, .nc-app-card-description')) return true;
    // 跳过操作系统镜像与光驱 ISO 发行版名称（保留下方特性标签如 Minimal / Application）
    if (element.closest('.nc-image-card-name')) return true;
    // 跳过服务器选择触发器中的服务器名称（保留提示文案）
    if (element.closest('nc-topbar-search .nc-search-select-trigger, nc-topbar-search .nc-search-select-option')) return true;
    // 跳过虚拟键盘键帽（保留顶部特殊符号栏中的 Paste 按钮）
    if (element.closest('nc-vnc-keyboard .nc-osk-key') && normalize(element.textContent) !== 'Paste') return true;
    // 跳过 Swagger UI 内的 OpenAPI 接口技术规范与 Schema 定义（保留鉴权说明、顶部按钮与 Authorize 弹窗）
    if (element.closest('#swagger-ui .opblock-tag-section, #swagger-ui .models .model-container, #swagger-ui .models .model-box, #swagger-ui .json-schema-2020-12, #swagger-ui .information-container')) return true;
    // 跳过账户资料表中不含按钮的用户私有数据格（姓名、用户名、邮箱）
    const accTd = element.closest('nc-account-settings nc-box:first-of-type td:nth-child(2)');
    if (accTd && !element.closest('button')) return true;
    // 跳过服务器日志展开后的镜像文件名/原始详情
    if (element.closest('nc-server-log tr.nc-log-details, nc-server-log .nc-log-detail')) return true;
    return false;
  }

  const originalText = new WeakMap();
  const originalAttributes = new WeakMap();
  const ownText = new WeakMap();
  const ownAttributes = new WeakMap();
  const touchedTextNodes = new Set();
  const touchedAttrElements = new Set();

  function keepWhitespace(raw, replacement) {
    const lead = raw.match(/^\s*/u)?.[0] || '';
    const trail = raw.match(/\s*$/u)?.[0] || '';
    return lead + replacement + trail;
  }

  function getTextSource(node) {
    const raw = node.nodeValue || '';
    const prev = originalText.get(node);
    return prev && raw === prev.written ? prev.source : raw;
  }

  function writeText(node, source, result, fragment = false) {
    const value = result === '' ? '' : keepWhitespace(source, result);
    originalText.set(node, { source, written: value, fragment, path: pathname });
    touchedTextNodes.add(node);
    if (node.nodeValue !== value) {
      ownText.set(node, value);
      node.nodeValue = value;
    }
  }

  function restoreAll() {
    for (const node of touchedTextNodes) {
      if (!node.isConnected) { touchedTextNodes.delete(node); continue; }
      const prev = originalText.get(node);
      if (prev && node.nodeValue === prev.written && prev.written !== prev.source) {
        ownText.set(node, prev.source);
        node.nodeValue = prev.source;
      }
      originalText.delete(node);
      touchedTextNodes.delete(node);
    }
    for (const el of touchedAttrElements) {
      if (!el.isConnected) { touchedAttrElements.delete(el); continue; }
      const cache = originalAttributes.get(el);
      if (cache) {
        for (const [name, prev] of cache) {
          if (el.getAttribute(name) === prev.written && prev.written !== prev.source) {
            let writes = ownAttributes.get(el);
            if (!writes) ownAttributes.set(el, writes = new Map());
            writes.set(name, prev.source);
            el.setAttribute(name, prev.source);
          }
        }
        cache.clear();
      }
      touchedAttrElements.delete(el);
    }
  }

  function processText(node) {
    if (!node.isConnected || skip(node.parentElement, 'text')) return;
    const source = getTextSource(node);
    const norm = normalize(source);
    if (!norm) return;
    const prev = originalText.get(node);
    if (prev?.fragment && prev.path === pathname && node.nodeValue === prev.written) return;
    const result = translateText(norm);
    if (result !== null) {
      writeText(node, source, result);
    } else {
      if (prev && node.nodeValue === prev.written && prev.written !== source) {
        ownText.set(node, source);
        node.nodeValue = source;
        originalText.delete(node);
      }
      collectMiss(norm, node.parentElement, 'text');
    }
  }

  function processAttributes(element) {
    if (skip(element, 'attr')) return;
    let cache = originalAttributes.get(element);
    if (!cache) originalAttributes.set(element, cache = new Map());
    for (const name of ATTRS) {
      if (name === 'value' && !(element.tagName === 'INPUT' && /^(button|submit|reset)$/i.test(element.type))) continue;
      if (!element.hasAttribute(name)) continue;
      const raw = element.getAttribute(name);
      const prev = cache.get(name);
      const source = prev && raw === prev.written ? prev.source : raw;
      const norm = normalize(source);
      if (!norm) continue;
      const result = translateText(norm);
      if (result === null) {
        if (prev && raw === prev.written) {
          let writes = ownAttributes.get(element);
          if (!writes) ownAttributes.set(element, writes = new Map());
          writes.set(name, source);
          element.setAttribute(name, source);
          cache.delete(name);
        } else {
          collectMiss(norm, element, 'attr:' + name);
        }
        continue;
      }
      const value = keepWhitespace(source, result);
      cache.set(name, { source, written: value });
      touchedAttrElements.add(element);
      if (raw !== value) {
        let writes = ownAttributes.get(element);
        if (!writes) ownAttributes.set(element, writes = new Map());
        writes.set(name, value);
        element.setAttribute(name, value);
      }
    }
  }

  function leafTextNodes(element) {
    const list = [];
    const walker = (element.ownerDocument || document).createTreeWalker(element, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (!skip(node.parentElement, 'text') && !node.parentElement.closest('select,option') && normalize(getTextSource(node))) {
        list.push(node);
      }
    }
    return list;
  }

  function processFragment(element) {
    const rules = currentFragments.get(element.tagName.toLowerCase());
    if (!rules) return;
    let nodes = null;
    for (const rule of rules) {
      if (rule.guard && !element.closest(rule.guard)) continue;
      if (!nodes) nodes = leafTextNodes(element);
      if (nodes.length !== rule.atoms.length) continue;
      const joined = normalize(nodes.map(getTextSource).join(''));
      const spaced = normalize(nodes.map(n => normalize(getTextSource(n))).join(' '));
      if (!rule.fullRegex.test(joined) && !rule.fullRegex.test(spaced) && !rule.spacedRegex.test(spaced)) continue;
      const outputs = nodes.map((node, i) => applyRule(rule.atoms[i], normalize(getTextSource(node))));
      if (outputs.some(res => res === null)) continue;
      nodes.forEach((node, i) => writeText(node, getTextSource(node), outputs[i], true));
      return;
    }
  }

  let debug = false;
  try { debug = localStorage.getItem('netcup-scp.zhCN.debug') === '1'; } catch (_) { /* storage unavailable */ }
  const reported = new Set();
  function collectMiss(text, element, type) {
    if (!debug || reported.size >= 100 || !/[A-Za-z]{2}/.test(text) || PRESERVED.has(text)) return;
    const control = element.closest('button,label,h1,h2,h3,h4,h5,h6,th,p,summary,a,nc-warning,nc-information,nc-modal,nc-notification-toast');
    if (!control && type === 'text') return;
    const scope = currentScopes[0]?.slug || 'shared-shell';
    const locationHint = [scope, control?.localName || 'element', type].join(' / ');
    if (reported.has(locationHint)) return;
    reported.add(locationHint);
    console.info('[netcup SCP 简体中文] 未匹配位置', locationHint);
  }

  const roots = new Set();
  let activeWalker = null;
  let activeRoot = null;
  let scheduled = false;
  let lastEnglish = true;

  function schedule(root = document.documentElement) {
    if (!root) return;
    if (root.nodeType !== 1) root = root.parentElement;
    if (!root || root.nodeType !== 1 || !root.isConnected || root.closest(BLOCK)) return;
    for (let parent = root, depth = 0; parent && depth < 6; parent = parent.parentElement, depth++) {
      if (currentFragments.has(parent.tagName?.toLowerCase())) { root = parent; break; }
    }
    if (root === document.documentElement) roots.clear();
    if (!roots.has(document.documentElement)) roots.add(root);
    if (!scheduled) { scheduled = true; setTimeout(flush, 24); }
  }

  function processElement(element) {
    if (element.closest(BLOCK)) return;
    processFragment(element);
    processAttributes(element);
  }

  function flush() {
    scheduled = false;
    const english = isEnglishMode();
    applySystemFont(english);
    translateTitle();
    if (!english) {
      if (lastEnglish) {
        lastEnglish = false;
        restoreAll();
      }
      activeWalker = null;
      activeRoot = null;
      roots.clear();
      return;
    }
    if (!lastEnglish) {
      lastEnglish = true;
      activeWalker = null;
      activeRoot = null;
      roots.clear();
      roots.add(document.documentElement);
    }
    if (location.pathname !== pathname) {
      selectPath();
      activeWalker = null;
      activeRoot = null;
      roots.clear();
      roots.add(document.documentElement);
    }
    const deadline = performance.now() + 8;
    let visited = 0;
    while ((activeWalker || roots.size) && performance.now() < deadline && visited < 600) {
      if (!activeWalker) {
        activeRoot = roots.values().next().value;
        roots.delete(activeRoot);
        if (!activeRoot || !activeRoot.isConnected) continue;
        processElement(activeRoot);
        activeWalker = (activeRoot.ownerDocument || document).createTreeWalker(
          activeRoot,
          NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
          {
            acceptNode(node) {
              return node.nodeType === 1 && node.matches(BLOCK) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
            }
          }
        );
      }
      const node = activeWalker.nextNode();
      if (!node) { activeWalker = null; activeRoot = null; continue; }
      if (node.nodeType === 3) processText(node);
      else processElement(node);
      visited++;
    }
    if (activeWalker || roots.size) {
      scheduled = true;
      setTimeout(flush, 0);
    }
  }

  function observeChanges(records) {
    let langChanged = false;
    for (const record of records) {
      if (record.type === 'attributes' && record.attributeName === 'class') {
        if (record.target.closest?.('nc-language')) langChanged = true;
        continue;
      }
      if (record.type === 'characterData') {
        if (ownText.get(record.target) === record.target.nodeValue) continue;
        schedule(record.target.parentElement);
      } else if (record.type === 'attributes') {
        if (ownAttributes.get(record.target)?.get(record.attributeName) === record.target.getAttribute(record.attributeName)) continue;
        schedule(record.target);
      } else {
        for (const node of record.addedNodes) {
          if (node.nodeType === 8) continue;
          if (node.nodeType === 1 && (node.tagName === 'NC-LANGUAGE' || node.querySelector?.('nc-language'))) langChanged = true;
          schedule(node);
        }
      }
    }
    if (langChanged) schedule(document.documentElement);
  }

  const observer = new MutationObserver(observeChanges);
  observer.observe(document, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: [...ATTRS, 'class']
  });

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
  document.addEventListener('DOMContentLoaded', () => {
    applySystemFont(isEnglishMode());
    schedule(document.documentElement);
  }, { once: true });

  if (document.documentElement) {
    applySystemFont(isEnglishMode());
    schedule(document.documentElement);
  }
})();
