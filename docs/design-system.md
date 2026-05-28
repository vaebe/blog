# 设计系统文档

> 本文是博客视觉与交互的**唯一权威来源**。后续任何设计改动都应先对照本文,保持一致;
> 若要打破某条约定,先更新本文再改代码。

---

## 一、设计理念：「会开玩笑的工程师」+ 信号橙

定位:vaebe 的声音是**务实、爽利、带点皮**(手摸手教程、踩坑实录、"求求你们了对代码质量有点要求"、猫头像)。
不是高冷编辑,是一个有手艺、敢表达、会自嘲的工程师。设计要传达这个,而不是又一个"安全的高级模板"。

核心信条:

1. **有观点 > 安全**。曾经走过"墨色臻简"的单色路线,被判定撞进了 2026 最饱和的"高级 AI"套路(衬线+单色+玻璃+大写标签),已废弃。现在用**一个真颜色(信号橙)承重**来建立辨识度。timid palette = invisible。
2. **信号橙是声音,不是点缀**。橙色出现在链接、主操作按钮、激活态、年份数字、焦点环、关键 hover、背景氛围光晕。Committed 策略,大胆用,别在边缘用中性色对冲掉。
3. **排版与留白承重**。字号体系、间距节奏、字重建立层级。展示字用有性格的 Bricolage Grotesque,不用黑名单上的 Instrument Serif。
4. **材质极简、实色为主**。卡片是实色 + 发丝边 + 轻软阴影。**毛玻璃不是默认材质**——全站只有命令面板一处用玻璃(它真正悬浮在内容上)。
5. **动效为"手感",不为"炫"**。动效回应用户意图(刻意 hover→响应、加载编排、视图过渡),**不要恒定的、自顾自的、求关注的动效**。
6. **细节见功底 + 整站一致**。一套 token,reduced-motion 降级,⌘K,数字滚动缓动,字距。

### 红线（绝对不要,违反即重写）

来自 impeccable 的 critique,这些是最直白的"AI 做的"信号 / 已踩过的坑:

- ❌ **毛玻璃当默认材质**。玻璃只留命令面板一处。卡片一律实色。
- ❌ **Hero 指标盘**(大数字 + 小标签 + 一堆 supporting stats)。数据降级成一行朴素 byline。
- ❌ **侧边竖条**(`border-left`/绝对定位的彩色左竖条当强调)。用整边框、背景微色块或前置标签。
- ❌ **通栏重复的大写字距小标签**(`uppercase tracking-...` 当栏目语法)。用常规字重小标题。
- ❌ **Instrument Serif**(在 brand reflex-reject 字体黑名单里)。展示字用 Bricolage Grotesque。
- ❌ **渐变文字**(`background-clip:text` + gradient)。强调用字重/字号/橙色实色。
- ❌ **跟随鼠标的填充式光晕 / 呼吸光 / 持续粒子**(求关注的动效)。
- ❌ **em dash / `--`** 出现在界面文案。用逗号、冒号、句号、括号。

---

## 二、设计令牌（Design Tokens）

定义在 `app/globals.css`(OKLCH,明暗双套)。**改配色只动这里。**

### 字体（`@theme`）
| 用途 | 变量 / 工具类 | 字体 |
|---|---|---|
| 正文 | `--font-sans` / `font-sans` | Geist + 中文回退 |
| 等宽 | `--font-mono` / `font-mono` | Geist Mono |
| 展示 | `--font-display` / `font-display` | **Bricolage Grotesque**(700) + 中文 sans 回退 |

`font-display` 主要给拉丁文与数字大标题(姓名 `vaebe`、年份)。中文标题走无衬线粗体即可。
(Bricolage 是怪诞体,中文回退到系统 sans 不违和,比当年的衬线方案宽松。)

### 颜色：信号橙
| 角色 | 浅色 | 深色 |
|---|---|---|
| `--background` | `oklch(0.985 0.007 75)` 暖纸白 | `oklch(0.18 0.01 50)` 暖近黑 |
| `--foreground` | `oklch(0.22 0.012 55)` 暖墨 | `oklch(0.95 0.008 75)` 暖近白 |
| `--card` | `oklch(0.995 0.005 75)` | `oklch(0.22 0.01 50)` |
| `--primary`(信号橙,=CTA) | `oklch(0.66 0.21 42)` ≈ #ff4500 | `oklch(0.7 0.2 45)` |
| `--primary-foreground` | `oklch(0.99 0.012 75)` 近白(白字配橙) | 同 |
| `--accent`(橙色微色块/hover) | `oklch(0.95 0.035 55)` | `oklch(0.3 0.05 45)` |
| `--muted-foreground` | `oklch(0.5 0.018 55)` | `oklch(0.7 0.015 70)` |
| `--border` | `oklch(0.9 0.012 65)` | `oklch(0.99 0.01 75 / 10%)` |
| `--ring`(焦点,橙) | `oklch(0.66 0.21 42)` | `oklch(0.7 0.2 45)` |
| `--destructive`(红,区别于橙) | `oklch(0.52 0.2 22)` | `oklch(0.62 0.2 22)` |

**橙色出现在哪**:链接、主按钮(shadcn primary)、激活态导航、年份数字(`text-primary`)、头衔圆点、焦点环、关键 hover、背景氛围光晕。

`--radius: 0.75rem`。圆角:`rounded-2xl`(卡片)、`rounded-full`(按钮/药丸)、`rounded-3xl`(Hero)。

### 阴影 / 玻璃 / 背景（`globals.css`）
- `.shadow-soft` / `.shadow-soft-lg` — 极淡弥散软阴影,卡片默认 / hover 抬起。禁用 `shadow-md`。
- `.glass` / `.glass-strong` — **只给命令面板**。其它任何面都不要用。
- 背景(`body`,`background-attachment: fixed`):顶部光晕 + **右上信号橙微光** + 左下暖光斑 + `56px` CSS 网格(`color-mix(var(--foreground) 5%/6%)`,明暗自适应)。网格是刻意保留的工程氛围,不是禁令项。

---

## 三、组件与模式约定

- **卡片**:`rounded-2xl border border-border bg-card shadow-soft` + 合适 padding。hover 反馈 `hover:-translate-y-0.5`(+ 文章卡 `hover:border-primary/40`)。**不要玻璃、不要跟随光晕。**
- **Hero**(`components/hero/hero.tsx`):**编辑式无卡片版面**——超大名字(`lg:text-[7.5rem]`)左对齐占 12 栅格的 9 列,头像在右 3 列(`-rotate-3` 静态歪头 + 3D 倾斜)。下方头衔/简介/CTA 在窄列(`max-w-xl`)左对齐,不再居中。数据是**一行朴素 byline**(数字 `font-semibold text-foreground`,标签平实),不是指标盘。
- **按钮层级**:主操作 = `bg-primary`(橙)实心,一屏一个;次操作 = 描边 / ghost。圆角 `rounded-full`。
- **链接**:`text-primary` 或 `hover:text-primary`(橙)。
- **复用交互组件**:`count-up.tsx`(数字滚动)、`magnetic.tsx`(磁吸)、`command-palette.tsx`(⌘K/Ctrl+K,监听 `toggle-command-palette` 事件)、`app/(main)/template.tsx`(路由淡入)、`reveal.tsx`。
- **编辑式列表行** = `components/article/article-row.tsx`(`ArticleRow`):统一的列表行原型(标题/摘要/meta 数组/右上箭头微动),首页"掘金文章"与"文章列表页"都用它。新增文章/链接类列表先复用它,**别再重写一份**。
- **主题切换**(`theme-switch.tsx`):View Transitions 圆形扩散,`580ms`,曲线 `[0.22,1,0.36,1]`;配套 `::view-transition-*` 在 `globals.css`。
- **动效总则**:一律 `useReducedMotion()` 降级;缓动统一 `[0.22,1,0.36,1]`;加载用递增 `delay`。

### 页眉与页脚

- **Header**(`components/layout/header.tsx`):透明顶,滚动后 `bg-background/90` + 发丝下边 + `backdrop-blur-sm`。导航**不用 pill**,改成**文字 + 橙色小圆点**激活标记(`absolute bottom-0 h-1 w-1 rounded-full bg-primary` 居中),hover 仅文字色变深。Logo 旁有 `vaebe` 衬线展示字。右侧 ⌘K 提示 + 登录按钮(`bg-primary` + `shadow-soft`)或用户菜单。
- **Footer**(`components/layout/footer.tsx`):3 栏编辑式版面 `md:grid-cols-[1.4fr_1fr_1.6fr]` —— **品牌+圆形社交按钮**(GitHub/掘金/RSS,hover 边框/色转橙) / **导航小标题列表** / **订阅说明 + 邮箱表单**。底部一条分隔线 + 版权 + License 行。`mt-20 border-t`,`max-w-5xl` 对齐首页。License 链接走 `NEXT_PUBLIC_GITHUB_USER_NAME` + `NEXT_PUBLIC_GITHUB_REPO_NAME`(后者缺省 fallback 为 `blog`)。

### 浮层与菜单细节

- **用户菜单**(`UserAvatar` in header):头像 `h-7 ring-1 ring-border`,旁边名字 + 一个旋转 `chevron-down`(`group-data-[state=open]:rotate-180`);触发按钮 hover `bg-accent` rounded-full;名字在 `<sm` 隐藏。弹出菜单顶部一栏显示**名字加粗 + 邮箱 muted**两行,而非单一 `DropdownMenuLabel`;`退出登录` 用 `text-muted-foreground` 略弱化(focus 时回 foreground)。
- **主题切换菜单**(`theme-switch.tsx`):每项末尾用**橙色 `lucide:check`** 标当前激活主题。

### 文章列表与留言板

- **文章列表** (`app/(main)/article/list`):页眉 h1 用 `text-5xl md:text-6xl font-bold tracking-tight`**(中文,所以走 sans bold,不要套 `font-display`/Bricolage)** + 总数行;按年分组,年份数字 `font-display text-primary` 大字;条目复用 `ArticleRow`。与首页"掘金"section 同形态。
- **文章详情** (`app/(main)/article/[id]`):**RSC**,服务端 `getArticleById` 拉数据,缺失走 `next/navigation` 的 `notFound()`。正文存在 → 玻璃化外卡 + 桌面端粘性目录侧栏;正文为空(同步自掘金)→ 居中 "去掘金读全文" 橙色 CTA,目录侧栏隐藏。
- **留言板** (`app/(main)/guestbook`):**RSC + Suspense** 流式注入初始消息(`InitialMessages`,不再客户端 `useEffect` 拉取),客户端只负责发表/新增本地刷新。标题 `text-4xl md:text-5xl`;消息列表是**编辑式时间线**(`divide-y border-y` 而非每条一卡),头像 + 名字 + `fromNow` 时间在顶,正文 `sm:pl-12` 缩进对齐于名字。AddMessage 编辑框仍是卡(输入需要明确边界)。

---

## 四、布局约定

- 主容器:首页用 `max-w-5xl mx-auto px-4`(给 Hero 大字与 bento 留呼吸空间),其它页可继续 `max-w-4xl`。文章详情:`max-w-5xl` + 桌面 `lg:grid-cols-[minmax(0,1fr)_220px]` + 右侧 `sticky top-24` 目录。
- 首页区块纵向节奏 `space-y-16`。
- 文章列表年份分组:外层 wrapper `mt-12 first:mt-0`,标题 `mb-6`,年份数字 `text-primary`。
- 文章「导读」:整边框 + `bg-accent/40` 微色块 + 橙色 `导读` 小标签;**无左竖条**。

---

## 五、页面落地状态

| 页面 | 状态 |
|---|---|
| 首页 / Hero / 技术栈 / 掘金 / GitHub | ✅ 信号橙 |
| 文章列表 / 文章详情 / 留言板 / 404 / 页眉页脚 | ✅ 信号橙 |
| 后台编辑器 `article/add`、`article/edit`(管理端) | ⬜ 未统一,优先级低 |

**作品优先 + 三种形态打破同质**:首页顺序 Hero → 精选项目 → 掘金文章 → 技术栈,**每个 section 用不同形态**:
- **精选项目** = bento 卡片网格(`md:grid-cols-3 md:auto-rows-[260px]` + 首项 `md:col-span-2 md:row-span-2 featured`)。`ProjectCard` 是自绘富信息卡:圆形 owner 头像(`github.com/{owner}.png`,稳定)+ owner/repo + 描述 + 数据行 + 底部语言色条,背景按 `primaryLanguage.color` 上色(`color-mix(in oklab, ${color} 12%, transparent)` 做径向渐变,**不要再用 `${color}1f` 那种 hex+alpha 拼接**)+ 角落 `</>` 纹理;featured 卡头像/标题/描述自动放大。纯 CSS,仅头像一张稳定外链图。
- **掘金文章**(`JueJinArticles`) = **编辑式列表**(不是卡片网格):`divide-y border-y` 单列发丝分隔行,标题 hover 转橙 + 右侧延伸式 `arrow-up-right` 箭头微动,meta 用纯文字 `日期 · 阅读数 · 赞数`。头部右侧有 "去主页看更多" 链接。
- **技术栈**(`TechnologyStack`) = CSS marquee 跑马灯(`@keyframes marquee`),不套 `ContentCard`(`<section>` + 标题 + 跑马灯),芯片 hover 边框/图标转橙。

这三种形态(卡片 bento / 编辑列表 / 跑马灯)是**刻意的视觉节奏变化**,避免 critique 点名的 "identical card grids"。三个 section 都不套 `ContentCard`,只用裸 `<section>` + 一致的 `h2 mb-7 text-2xl font-semibold tracking-tight` 标题。
(放弃过 GitHub OG 图 `opengraph.githubassets.com` 方案:它是给爬虫用的、懒生成+限流,浏览器直链不稳定,经常只有热门仓库出图。勿再用。)
文章详情正文为空时:juejin 来源(`source !== '00'`)显示"去掘金读全文"CTA,本地空文章显示"暂无正文",并隐藏目录侧栏。

**已知待办**:critique 的全部 P1/P2/P3 均已落地(身份/玻璃/Hero 指标盘/导读竖条/大写标签/作品可见/Bento 不对称)。剩下的是细枝末节:后台编辑器 `article/add`、`article/edit` 未统一(管理端,优先级低)。

> 文章列表条目链接指向 juejin.cn 外链(文章从掘金同步)。`public/grid.svg` / `grid-black.svg` 未使用(网格用 CSS 画在 body),可删。

---

## 六、快速调参索引

| 想改什么 | 改哪里 |
|---|---|
| 配色(明/暗) | `globals.css` 的 `:root` / `.dark` |
| 信号橙色相/饱和 | `--primary` / `--ring`(hue 42~45) |
| 圆角 | `--radius` |
| 网格密度 / 深浅 | `body` 背景 `56px 56px` / `color-mix(... X%)` |
| 氛围光斑 | `body` 背景的 `radial-gradient` 尺寸与 `at X% Y%` |
| 主题切换速度 | `theme-switch.tsx` 的 `duration` |
| 玻璃(仅命令面板) | `.glass` / `.glass-strong` |
| 项目卡语言色浓淡 | `GithubProject` 里 `color-mix(in oklab, ${color} 12%, transparent)` 的百分比 |
| 列表行节奏 | `components/article/article-row.tsx` |
