# ByteMD → @uiw/react-md-editor 编辑器替换 + 文章流程完善 设计文档

- 日期:2026-06-22
- 状态:已确认,待实现
- 背景:当前 Markdown 编辑器 ByteMD(`bytemd` ^1.22.0 + 一系列 `@bytemd/plugin-*`)已基本停止维护,需替换为活跃维护、且渲染层基于标准 remark/rehype 生态的方案,以避免再次被单一不可维护的库锁定;并借此完善文章创建、编辑、查看流程。

## 目标

1. 用 **`@uiw/react-md-editor`** 替换 ByteMD 作为文章编辑器(保持「源码 + 实时预览」分屏体验)。
2. 文章查看页与留言板改用基于 **remark/rehype(react-markdown)** 的统一渲染管线,彻底移除 bytemd。
3. 统一并完善创建 / 编辑 / 查看文章的逻辑与交互体验。

## 关键决策(已确认)

| 决策点 | 结论 |
|---|---|
| 编辑器 | `@uiw/react-md-editor`(源码 + 预览分屏) |
| 存储格式 | **维持 Markdown 源文**(`content String` 不变,无 schema 变更、无数据迁移) |
| 渲染管线 | 共享一份 remark/rehype 插件配置;编辑器预览与查看页/留言板复用同一份 |
| 查看页渲染 | 服务端 `react-markdown`(Server Component SSR 出 HTML,利于 SEO/首屏) |
| 留言板渲染 | 复用同一渲染管线,移除对 bytemd 的依赖 |
| 保留能力 | GFM(表格、任务列表、删除线等)、代码块语法高亮、图片上传 |
| 不实现 | 数学公式、Mermaid、脚注、frontmatter、gemoji |
| 掘金同步文章(`source=01`) | 行为不变:详情页展示跳转掘金按钮,不渲染正文 |

## 选型理由(为何 @uiw 而非 md-editor-rt / TipTap)

- **避免重蹈 ByteMD 覆辙**:渲染层落在 remark/rehype 这一不会消失的标准生态,即便将来更换编辑器组件,渲染管线与数据(纯 Markdown)均可平滑迁移,锁定最低。
- **与现有架构融合**:查看页保持 Server Component,用 react-markdown 直接 SSR,SEO/首屏可控;样式沿用 `@tailwindcss/typography` 的 `prose`。
- TipTap 被否决:要求把存储改为 ProseMirror JSON,数据范式变更与迁移成本高,且数学/Mermaid 需自定义 Node。
- md-editor-rt 被否决:开箱即用但为单作者项目、框架锁定较强、自带样式体系与 Tailwind `prose` 需协调。

## 范围约束(YAGNI)

- **不**实现数学、Mermaid、脚注、frontmatter、gemoji。
- **不**改 `content` 字段类型,**不**写数据迁移脚本(存储仍是 Markdown)。
- **不**做协作编辑、版本历史。

---

## 模块 1:统一渲染管线(基础)

新建 `lib/markdown/`,作为编辑器预览、文章查看页、留言板共用的单一渲染来源。

| 文件 | 职责 |
|---|---|
| `lib/markdown/plugins.ts` | 导出共享的 `remarkPlugins`(`remark-gfm`)与 `rehypePlugins`(`rehype-highlight` 代码高亮、必要的 `rehype-sanitize` 配置)。编辑器预览与查看页/留言板都引用它 |
| `lib/markdown/MarkdownContent.tsx` | 服务端可渲染的 `<MarkdownContent source={md} />`,内部用 `react-markdown` + 上述插件,输出套 `prose` 样式的 HTML;Server Component 友好 |

**核心设计点:** 所有 Markdown → HTML 的渲染只有这一处实现,保证「编辑预览 == 文章查看 == 留言板」三处一致,且未来可独立于编辑器组件演进。

**安全:** 文章内容由管理员产出,留言由公开用户产出;统一经 `rehype-sanitize`(或限制 `rehype-raw` 使用)防 XSS,留言板尤其需要。

---

## 模块 2:编辑器组件(替换核心)

新建 `components/editor/` 取代 `components/bytemd/`:

| 文件 | 职责 | 依赖 |
|---|---|---|
| `components/editor/markdown-editor.tsx` | `<MarkdownEditor>` 客户端组件:封装 `@uiw/react-md-editor` 的 `MDEditor`,`value`/`onChange` 受控;`previewOptions` 传入 `lib/markdown/plugins.ts` 的同一份插件;暗色模式适配(`next-themes`,通过 `data-color-mode`);按需 `next/dynamic` 动态导入避免进入初始包 | `lib/markdown/plugins.ts` |
| `components/editor/use-image-upload.ts` | 图片上传 hook/工具:监听编辑器的 `onPaste` / `onDrop`,调用现有 `app/actions/image-kit.ts` 的 `uploadFile`,成功后把 `![alt](url)` 插入光标处;失败 toast(`sonner`) | `uploadFile` |

**接口(供模块 4 使用):**
```ts
interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
}
export function MarkdownEditor(props: MarkdownEditorProps): JSX.Element
```

**图片上传:** 复用 ImageKit 上传(含 MD5 去重、JWT、按日期分目录),保持现有体验。

---

## 模块 3:查看页(`app/(main)/article/[id]`)

`ArticleDetail` 保持 Server Component,逻辑基本不变,仅把渲染器换掉:

1. `source=00` 且有正文 → `<MarkdownContent source={article.content} />`(SSR 出 HTML)。
2. `source=01` 或无正文 → 保持现状:展示「去掘金读全文」或「暂无正文」。
3. 客户端增强(独立 hydration 小岛,不破坏 SSR):
   - 目录 TOC:从渲染后的标题生成(沿用/改造现有 `anchor/index.tsx`,容器 class 由 `.markdown-body` 调整为渲染容器实际 class,如 `.prose`)
   - 顶部阅读进度条
   - 代码块「复制」按钮
   - 图片点击放大(轻量 lightbox,替代原 medium-zoom)
4. 阅读时长:`getReadingTime(article.content)` 仍直接吃 Markdown 源文,**无需改动**(存储仍是 Markdown)。

---

## 模块 4:创建 / 编辑流程统一(`app/article`)

- 现状:`add/page.tsx` 与 `edit/[id]/EditArticle.tsx` 为两套近似逻辑,各自挂 `BytemdEditor`。
- 改造:抽出共享组件 **`ArticleEditorForm`**,create 传空初始值、edit 传已加载文章,消除重复;内部使用模块 2 的 `<MarkdownEditor>`。
- 集成交互能力:
  - **草稿 / 自动保存:** 防抖(约 2s)写 `localStorage`,key 按 article id(新建用 `"new"`);进入时若存在更新草稿则提示「恢复草稿」。
  - **离开未保存提醒:** 有未保存改动时,`beforeunload` 与应用内路由跳转均弹确认。
  - **发布前校验:** 拦截空标题 / 空正文;敏感词检查复用 `lib/sensitive-words.ts` 的 `containsSensitiveWord`(对标题 + 正文);失败明确 toast。
  - **元数据自动化:** 摘要可一键从正文提取纯文本截取;封面默认取正文第一张图(可手动覆盖)。

---

## 模块 5:留言板渲染替换 + 交互/UX 优化

- **留言板**(`app/(main)/guestbook/MessagesList.tsx`):`BytemdViewer` → `<MarkdownContent>`,经 `rehype-sanitize` 净化,移除 bytemd 依赖。
- 发布对话框(`app/article/components/publish-dialog`)逻辑保留,与新 `ArticleEditorForm` 对接;校验、loading、错误提示统一。
- 编辑器空状态 placeholder 引导;暗色模式适配;全流程 `sonner` toast 反馈。

---

## 依赖变更

**新增:**
- `@uiw/react-md-editor`
- `react-markdown`
- `remark-gfm`
- `rehype-highlight`(代码高亮;沿用 `highlight.js` 主题 CSS)
- `rehype-sanitize`(留言板 XSS 防护)

**移除:**
- `bytemd`、`@bytemd/react`、所有 `@bytemd/plugin-*`
- `juejin-markdown-themes`(确认仅编辑器使用后移除)

**保留/复用:** `highlight.js`(其主题 CSS)、`app/actions/image-kit.ts`、`lib/sensitive-words.ts`、`lib/getReadingTime.ts`、`sonner`、`next-themes`。

---

## 受影响文件清单(预估)

| 操作 | 路径 |
|---|---|
| 删除 | `components/bytemd/{editor,viewer,plugins}.tsx`、`components/bytemd/*.scss` |
| 新增 | `lib/markdown/plugins.ts`、`lib/markdown/MarkdownContent.tsx` |
| 新增 | `components/editor/markdown-editor.tsx`、`components/editor/use-image-upload.ts` |
| 新增 | `app/article/components/ArticleEditorForm.tsx`(创建/编辑共享) |
| 改造 | `app/article/add/page.tsx` |
| 改造 | `app/article/edit/[id]/page.tsx`、`EditArticle.tsx` |
| 改造 | `app/(main)/article/[id]/ArticleDetail.tsx`、`anchor/index.tsx` |
| 改造 | `app/(main)/guestbook/MessagesList.tsx` |
| 改造 | `app/api/articles/add`、`app/api/articles/update`(发布前服务端校验:空内容 + 敏感词) |
| 改造 | `app/article/components/publish-dialog/*`(对接新表单) |
| 改造 | `package.json` |

---

## 验收标准

1. 新建文章:用 `@uiw/react-md-editor` 编辑(分屏预览、表格、代码高亮、任务列表、图片粘贴/拖拽上传),发布后 `content` 为 Markdown 源文。
2. 编辑文章:加载已有 Markdown 正确还原,保存后内容一致;create/edit 复用 `ArticleEditorForm`。
3. 查看文章(`source=00`):SSR 渲染 HTML,样式与编辑预览一致;TOC / 阅读进度 / 代码复制 / 图片放大均可用。
4. 查看文章(`source=01`):展示跳转掘金按钮,不渲染正文。
5. 留言板:用统一渲染管线渲染 Markdown 并经净化,无 bytemd 引用。
6. 草稿自动保存与恢复、未保存离开提醒、发布前校验(空内容 + 敏感词)均生效。
7. 项目中不再残留 `bytemd` / `@bytemd/*` 引用,`pnpm lint` 与 `pnpm build` 通过。
