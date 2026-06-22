# ByteMD → TipTap 编辑器替换 + 文章流程完善 设计文档

- 日期:2026-06-22
- 状态:已确认,待实现
- 背景:当前 Markdown 编辑器 ByteMD(`bytemd` ^1.22.0 + 一系列 `@bytemd/plugin-*`)已基本停止维护,需替换为活跃维护的方案,并借此完善文章创建、编辑、查看流程。

## 目标

1. 用 **TipTap** 替换 ByteMD 作为文章编辑与渲染引擎。
2. 文章内容存储从 Markdown 源文改为 **ProseMirror JSON**。
3. 统一并完善创建 / 编辑 / 查看文章的逻辑与交互体验。

## 关键决策(已确认)

| 决策点 | 结论 |
|---|---|
| 编辑器 | TipTap(ProseMirror 系) |
| 存储格式 | ProseMirror JSON(`editor.getJSON()`),落库为字符串 |
| 掘金同步文章(`source=01`) | 不进编辑器,详情页直接跳转掘金阅读,正文不再渲染 |
| 存量数据 | **零存量**,无需迁移脚本,无需改 Prisma schema 类型 |
| 保留能力 | 基础富文本、表格、代码块+语法高亮、图片上传、任务列表 |
| 移除能力 | 数学公式、Mermaid、脚注、frontmatter、gemoji |
| 查看页渲染 | 服务端 `generateHTML`(保持 Server Component,利于 SEO/首屏) |

## 范围约束(YAGNI)

- **不**实现数学公式、Mermaid、脚注、frontmatter、gemoji —— 因此**不需要任何自定义 ProseMirror Node**,所有扩展均为 TipTap 官方现成扩展。
- **不**改 Prisma `content` 字段类型,**不**写数据迁移脚本(无存量数据)。
- **不**做协作编辑、版本历史等富功能。

---

## 模块 1:编辑器层(替换核心)

新建 `components/editor/` 目录取代 `components/bytemd/`,职责拆分:

| 文件 | 职责 | 依赖 |
|---|---|---|
| `extensions.ts` | 共享 TipTap 扩展配置:StarterKit、Table(+ row/cell/header)、CodeBlockLowlight + lowlight、Image、Link、TaskList/TaskItem、Placeholder。**编辑端与服务端渲染共用同一份配置** | TipTap 官方扩展 |
| `editor.tsx` | `<RichTextEditor>` 客户端组件:挂载 TipTap、绑定工具栏、图片拖拽/粘贴上传(复用 `app/actions/image-kit.ts` 的 `uploadFile`)、暗色模式适配 | `extensions.ts` |
| `toolbar.tsx` | 自建格式工具栏(TipTap 不带 UI):加粗/斜体/标题/列表/引用/表格/代码块/任务列表/图片/链接;用现有 Radix/shadcn + lucide 图标搭建,响应式 | — |
| `render-server.ts` | 服务端 `renderArticleHtml(json)`:用 `@tiptap/html` 的 `generateHTML(json, extensions)` 输出 HTML 字符串,代码块经 lowlight 输出带 class 的高亮标签 | `extensions.ts` |

**核心设计点:** `extensions.ts` 同时被编辑器与服务端渲染引用,这是"编辑预览 == 查看页"一致性的根本保证,也是采用 TipTap 的核心价值。

**图片上传:** 复用现有 ImageKit 上传逻辑(`uploadFile`,含 MD5 去重、JWT、按日期分目录)。编辑器拦截 drop / paste 事件,上传成功后插入 `Image` 节点。

---

## 模块 2:数据存储

- `prisma/schema.prisma` 中 `Article.content String` **类型保持不变**。
- `source=00`(博客自创):`content` 存 `JSON.stringify(editor.getJSON())`。
- `source=01`(掘金同步):`content` 维持原样(markdown 字符串),详情页不再渲染,仅用于跳转。
- 渲染与编辑入口按 `source` 分支判断。
- 零存量数据 → 无迁移脚本、无 schema 类型变更。

> 备注:不改用 Prisma `Json` 类型,是为避免与同字段中的掘金 markdown 字符串产生语义/类型冲突。

---

## 模块 3:查看页(`app/(main)/article/[id]`)

`ArticleDetail` 保持 Server Component:

1. `source=01` → 渲染卡片 + "前往掘金阅读"跳转按钮,不渲染正文。
2. `source=00` → `JSON.parse(content)` → `renderArticleHtml()` → `dangerouslySetInnerHTML`,套用 `prose`(@tailwindcss/typography)+ highlight.js 主题 CSS。
3. 客户端增强(独立 hydration 小岛,不破坏 SSR):
   - 目录 TOC(从 JSON heading 节点提取,锚点跳转)
   - 顶部阅读进度条
   - 代码块"复制"按钮
   - 图片点击放大(轻量 lightbox,替代原 medium-zoom)

**容错:** `JSON.parse` 失败或内容为空时,渲染友好的空状态/错误提示,不抛崩溃。

---

## 模块 4:创建 / 编辑流程统一(`app/article`)

- 现状:`add/page.tsx` 与 `edit/[id]/EditArticle.tsx` 为两套逻辑。
- 改造:抽出共享组件 **`ArticleEditorForm`**,create 传空初始值、edit 传已有文章数据,消除重复。
- 集成交互能力:
  - **草稿 / 自动保存:** 防抖(约 2s)自动写 `localStorage`,key 按 article id(新建用 `"new"`);打开时若存在更新的本地草稿则提示"恢复草稿"。
  - **离开未保存提醒:** 有未保存改动时,`beforeunload` 与应用内路由跳转均弹确认。
  - **发布前校验:** 拦截空标题 / 空正文;敏感词检查(复用 `sensitive-word-tool`);失败给明确 toast。
  - **元数据自动化:** 摘要可一键从正文提取纯文本截取;封面默认取正文第一张图(可手动覆盖)。

---

## 模块 5:交互 / UX 优化

- 发布对话框(`app/article/components/publish-dialog`)逻辑保留,与新 `ArticleEditorForm` 对接;校验状态、loading、错误提示统一。
- 工具栏响应式 + 暗色模式适配(`next-themes`)。
- 编辑器空状态 Placeholder 引导。
- 全流程统一 toast 反馈(`sonner`)。

---

## 依赖变更

**新增:**
- `@tiptap/react`、`@tiptap/starter-kit`
- `@tiptap/extension-table`(及 table-row / table-cell / table-header)
- `@tiptap/extension-code-block-lowlight` + `lowlight`
- `@tiptap/extension-image`
- `@tiptap/extension-link`
- `@tiptap/extension-task-list` + `@tiptap/extension-task-item`
- `@tiptap/extension-placeholder`
- `@tiptap/html`

**移除:**
- `bytemd`、所有 `@bytemd/plugin-*`、`@bytemd/react`
- `juejin-markdown-themes`(若仅编辑器使用,确认无其它引用后移除)
- 视情况:`highlight.js` 改由 lowlight 使用(保留其主题 CSS)

---

## 受影响文件清单(预估)

| 操作 | 路径 |
|---|---|
| 删除 | `components/bytemd/{editor,viewer,plugins}.tsx` |
| 新增 | `components/editor/{extensions,editor,toolbar,render-server}.ts(x)` |
| 新增 | `app/article/components/ArticleEditorForm.tsx`(创建/编辑共享) |
| 改造 | `app/article/add/page.tsx` |
| 改造 | `app/article/edit/[id]/page.tsx`、`EditArticle.tsx` |
| 改造 | `app/(main)/article/[id]/ArticleDetail.tsx`(分 source 渲染 + 增强) |
| 改造 | `app/api/articles/add`、文章更新接口(发布前校验) |
| 改造 | `app/article/components/publish-dialog/*`(对接新表单) |
| 改造 | `package.json`(依赖增删) |

---

## 验收标准

1. 新建文章:用 TipTap 编辑(含表格、代码高亮、图片上传、任务列表),发布后 `content` 为 ProseMirror JSON。
2. 编辑文章:加载已有 JSON 正确还原编辑态,保存后内容一致。
3. 查看文章(`source=00`):SSR 渲染 HTML,样式与编辑态一致,TOC / 进度条 / 代码复制 / 图片放大均可用。
4. 查看文章(`source=01`):展示跳转掘金按钮,不渲染正文。
5. 草稿自动保存与恢复、未保存离开提醒、发布前校验(空内容 + 敏感词)均生效。
6. 项目中不再残留 `bytemd` / `@bytemd/*` 引用,`pnpm build` 与 `pnpm lint` 通过。
