# @uiw/react-md-editor 迁移 + 文章流程完善 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 用 `@uiw/react-md-editor` 替换已停维护的 ByteMD,维持 Markdown 存储,统一渲染管线(文章/留言板),并完善创建/编辑/查看流程(共享表单、草稿、未保存提醒、校验、元数据自动化、查看页增强)。

**Architecture:** 编辑器(客户端,`MDEditor` 动态导入)与渲染器(`@uiw/react-markdown-preview`,服务端 SSR)共享同一份 remark/rehype 插件;文章存 Markdown 源文不变;查看页保持 Server Component;留言板复用渲染器并 sanitize;create/edit 抽出共享 `ArticleEditorForm`。

**Tech Stack:** Next 16(App Router + Turbopack)、React 19、TypeScript、`@uiw/react-md-editor`、`@uiw/react-markdown-preview`、remark-gfm/remark-gemoji/rehype-slug/rehype-sanitize、medium-zoom、Vitest(新增,用于纯函数 TDD)、现有 ImageKit / sensitive-word-tool / sonner / next-themes。

## Global Constraints

- 存储格式:文章 `content` 仍存 **Markdown 源文**(`prisma` schema 不改、不写迁移脚本)。
- 代码高亮**内置**(`rehype-prism-plus`/Prism),**不**安装 `rehype-highlight`,**不**保留 `highlight.js`。
- `rehype-sanitize` **仅**用于留言板(不可信),文章(管理员可信)不做 sanitize。
- 必须引入两份 CSS:`@uiw/react-md-editor/markdown-editor.css`、`@uiw/react-markdown-preview/markdown.css`。
- `MDEditor` 必须 `next/dynamic` + `{ ssr: false }`;**不**引入 `next-remove-imports`,除非 Task 1 验证 Turbopack 构建失败。
- 不实现:数学、Mermaid、脚注、frontmatter、后端草稿、协作编辑。
- 保留能力:GFM(表格/任务列表/删除线)、代码高亮、图片上传、gemoji。
- 包管理用 `pnpm`;提交信息用 conventional commits;结尾保留现有 Co-Authored-By 规范(由执行者按仓库约定处理)。

---

## Task 1: 依赖安装 + Vitest + Next16/Turbopack 渲染验证(风险闸口)

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `app/(dev)/md-spike/page.tsx`(临时验证页,任务末删除)
- Create: `components/editor/_spike-editor.tsx`(临时,任务末删除)

**Interfaces:**
- Produces: 已安装依赖;确认「`MDEditor` 动态导入 + `MarkdownPreview` 在 Server Component SSR + 两份 CSS」在 Turbopack 下可构建。后续 Task 决定是否需要降级查看页为客户端渲染。

- [ ] **Step 1: 安装运行时依赖**

```bash
pnpm add @uiw/react-md-editor @uiw/react-markdown-preview remark-gfm remark-gemoji rehype-slug rehype-sanitize medium-zoom
```

- [ ] **Step 2: 安装并配置 Vitest(纯函数测试用)**

```bash
pnpm add -D vitest
```

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') }
  },
  test: {
    environment: 'node',
    include: ['lib/**/*.test.ts']
  }
})
```

Add to `package.json` scripts:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: 写一个最小验证页(Server Component 内 SSR 渲染器 + 客户端编辑器)**

Create `components/editor/_spike-editor.tsx`:

```tsx
'use client'
import dynamic from 'next/dynamic'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

export function SpikeEditor() {
  return <MDEditor value={'# hello\n\n```ts\nconst a = 1\n```'} height={200} />
}
```

Create `app/(dev)/md-spike/page.tsx`:

```tsx
import MarkdownPreview from '@uiw/react-markdown-preview'
import '@uiw/react-markdown-preview/markdown.css'
import { SpikeEditor } from '@/components/editor/_spike-editor'

export default function Page() {
  const md = '# SSR Heading\n\n- [x] task\n\n:rocket: `code`'
  return (
    <div data-color-mode="light">
      <MarkdownPreview source={md} />
      <SpikeEditor />
    </div>
  )
}
```

- [ ] **Step 4: 验证构建(关键闸口)**

Run: `pnpm build`
Expected: 构建成功,无 "module not found" / CSS / RSC 报错。
- 若 `MarkdownPreview` 在 Server Component 报 RSC 错误(如要求 client),记录之:Task 3 的 `MarkdownContent` 改为 `'use client'` 客户端渲染(仍可在 Server Component 中作为子组件使用),其余计划不变。
- 若 CSS import 在 Turbopack 报错,才考虑 `next-remove-imports`;否则不引入。

- [ ] **Step 5: 验证 lint**

Run: `pnpm lint`
Expected: 通过(临时文件无 lint 错误)。

- [ ] **Step 6: 删除临时验证文件**

```bash
rm -r "app/(dev)" components/editor/_spike-editor.tsx
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: 安装 md-editor 迁移依赖并验证 Turbopack 构建"
```

---

## Task 2: 共享渲染插件 + Markdown 纯函数工具(TDD)

**Files:**
- Create: `lib/markdown/plugins.ts`
- Create: `lib/markdown/extract.ts`
- Test: `lib/markdown/extract.test.ts`

**Interfaces:**
- Produces:
  - `lib/markdown/plugins.ts`: `export const remarkPlugins: PluggableList`(remark-gfm + remark-gemoji);`export const rehypePlugins: PluggableList`(rehype-slug);`export const sanitizeRehypePlugins: PluggableList`(rehype-slug + rehype-sanitize)。
  - `lib/markdown/extract.ts`: `export function extractFirstImageUrl(markdown: string): string | null`;`export function summarize(markdown: string, maxLen?: number): string`。

- [ ] **Step 1: 写失败测试**

Create `lib/markdown/extract.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { extractFirstImageUrl, summarize } from './extract'

describe('extractFirstImageUrl', () => {
  it('returns first markdown image url', () => {
    expect(extractFirstImageUrl('a\n![alt](https://x.com/a.png) b')).toBe('https://x.com/a.png')
  })
  it('returns null when no image', () => {
    expect(extractFirstImageUrl('no image here')).toBeNull()
  })
})

describe('summarize', () => {
  it('strips markdown syntax to plain text', () => {
    expect(summarize('# Title\n\n**bold** and `code`')).toBe('Title bold and code')
  })
  it('truncates to maxLen with ellipsis', () => {
    expect(summarize('abcdefghij', 5)).toBe('abcde…')
  })
})
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm test`
Expected: FAIL（`extract.ts` 不存在 / 函数未定义）

- [ ] **Step 3: 实现 extract.ts**

```ts
/** 提取正文中第一张 Markdown 图片的 URL,无则返回 null */
export function extractFirstImageUrl(markdown: string): string | null {
  const match = markdown.match(/!\[[^\]]*\]\(([^)\s]+)[^)]*\)/)
  return match ? match[1] : null
}

/** 把 Markdown 粗略转为纯文本并截断,用于自动摘要 */
export function summarize(markdown: string, maxLen = 100): string {
  const text = markdown
    .replace(/```[\s\S]*?```/g, ' ') // 代码块
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // 图片
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // 链接保留文字
    .replace(/[#>*_`~\-]/g, ' ') // 常见标记符
    .replace(/\s+/g, ' ')
    .trim()
  return text.length > maxLen ? text.slice(0, maxLen) + '…' : text
}
```

- [ ] **Step 4: 实现 plugins.ts**

```ts
import type { PluggableList } from 'unified'
import remarkGfm from 'remark-gfm'
import remarkGemoji from 'remark-gemoji'
import rehypeSlug from 'rehype-slug'
import rehypeSanitize from 'rehype-sanitize'

export const remarkPlugins: PluggableList = [remarkGfm, remarkGemoji]

// 文章(可信):仅加锚点,保留高亮/样式所需 class/id
export const rehypePlugins: PluggableList = [rehypeSlug]

// 留言板(不可信):额外净化
export const sanitizeRehypePlugins: PluggableList = [rehypeSlug, rehypeSanitize]
```

- [ ] **Step 5: 运行测试确认通过**

Run: `pnpm test`
Expected: PASS（4 个用例全绿）

- [ ] **Step 6: Commit**

```bash
git add lib/markdown/plugins.ts lib/markdown/extract.ts lib/markdown/extract.test.ts
git commit -m "feat: 新增共享 markdown 渲染插件与提取工具"
```

---

## Task 3: 统一渲染组件 MarkdownContent

**Files:**
- Create: `lib/markdown/markdown-content.tsx`

**Interfaces:**
- Consumes: `remarkPlugins`, `rehypePlugins`, `sanitizeRehypePlugins`（Task 2）。
- Produces: `export function MarkdownContent(props: { source: string; sanitize?: boolean; className?: string }): JSX.Element`，渲染 `.wmde-markdown` 容器。

- [ ] **Step 1: 实现组件**

> 注:若 Task 1 Step 4 发现 `MarkdownPreview` 不能在 Server Component 渲染,则在本文件首行加 `'use client'`（其余不变;它仍可被 Server Component `ArticleDetail` 作为子组件引用)。

```tsx
import MarkdownPreview from '@uiw/react-markdown-preview'
import '@uiw/react-markdown-preview/markdown.css'
import { remarkPlugins, rehypePlugins, sanitizeRehypePlugins } from './plugins'

interface MarkdownContentProps {
  source: string
  /** 公开不可信内容(如留言)传 true 启用 XSS 净化 */
  sanitize?: boolean
  className?: string
}

export function MarkdownContent({ source, sanitize = false, className }: MarkdownContentProps) {
  return (
    <MarkdownPreview
      source={source}
      remarkPlugins={remarkPlugins}
      rehypePlugins={sanitize ? sanitizeRehypePlugins : rehypePlugins}
      className={className}
      wrapperElement={{ 'data-color-mode': undefined } as never}
    />
  )
}
```

- [ ] **Step 2: 临时挂到 dev 验证一次渲染(可选,手动)**

在任一现有页面临时插入 `<MarkdownContent source={'# hi\n\n```ts\nconst a=1\n```'} />`,`pnpm dev` 打开确认:标题、代码高亮、暗色(切换主题)正常。确认后移除临时代码。

- [ ] **Step 3: 验证构建**

Run: `pnpm build`
Expected: 通过。

- [ ] **Step 4: Commit**

```bash
git add lib/markdown/markdown-content.tsx
git commit -m "feat: 新增统一 markdown 渲染组件 MarkdownContent"
```

---

## Task 4: 编辑器组件 MarkdownEditor

**Files:**
- Create: `components/editor/markdown-editor.tsx`

**Interfaces:**
- Consumes: `remarkPlugins`, `rehypePlugins`（Task 2)。
- Produces: `export function MarkdownEditor(props: { value: string; onChange: (value: string) => void }): JSX.Element`。

- [ ] **Step 1: 实现组件(动态导入 + 共享插件 + 暗色)**

```tsx
'use client'

import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
import { remarkPlugins, rehypePlugins } from '@/lib/markdown/plugins'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), {
  ssr: false,
  loading: () => (
    <div className="py-8 text-center text-gray-500 dark:text-gray-400">编辑器加载中...</div>
  )
})

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const { resolvedTheme } = useTheme()
  return (
    <div data-color-mode={resolvedTheme === 'dark' ? 'dark' : 'light'}>
      <MDEditor
        value={value}
        height={'calc(100vh - 60px)' as unknown as number}
        onChange={(v) => onChange(v ?? '')}
        previewOptions={{ remarkPlugins, rehypePlugins }}
      />
    </div>
  )
}
```

- [ ] **Step 2: 验证 lint + 构建**

Run: `pnpm lint && pnpm build`
Expected: 通过。

- [ ] **Step 3: Commit**

```bash
git add components/editor/markdown-editor.tsx
git commit -m "feat: 新增基于 @uiw/react-md-editor 的 MarkdownEditor 组件"
```

---

## Task 5: 编辑器图片上传(onPaste/onDrop → ImageKit)

**Files:**
- Create: `components/editor/use-image-upload.ts`
- Modify: `components/editor/markdown-editor.tsx`

**Interfaces:**
- Consumes: `uploadFile`（`@/app/actions/image-kit`)、`toast`（sonner)。
- Produces: `export function createImageHandlers(insert: (md: string) => void): { onPaste: (e: React.ClipboardEvent) => void; onDrop: (e: React.DragEvent) => void }`。

- [ ] **Step 1: 实现上传处理工具**

```ts
import type React from 'react'
import { toast } from 'sonner'
import { uploadFile } from '@/app/actions/image-kit'

async function uploadAndInsert(files: File[], insert: (md: string) => void) {
  for (const file of files) {
    if (!file.type.startsWith('image/')) continue
    const res = await uploadFile({ file, fileName: file.name })
    if (res?.code === 0 && res.data?.url) {
      insert(`![${file.name}](${res.data.url})\n`)
    } else {
      toast('图片上传失败，请重试!')
    }
  }
}

/** 生成编辑器 onPaste / onDrop 处理器:把图片上传到 ImageKit 后插入 Markdown */
export function createImageHandlers(insert: (md: string) => void) {
  return {
    onPaste: (e: React.ClipboardEvent) => {
      const files = Array.from(e.clipboardData?.files ?? [])
      if (files.some((f) => f.type.startsWith('image/'))) {
        e.preventDefault()
        void uploadAndInsert(files, insert)
      }
    },
    onDrop: (e: React.DragEvent) => {
      const files = Array.from(e.dataTransfer?.files ?? [])
      if (files.some((f) => f.type.startsWith('image/'))) {
        e.preventDefault()
        void uploadAndInsert(files, insert)
      }
    }
  }
}
```

- [ ] **Step 2: 接入 MarkdownEditor(把图片 markdown 追加到 value 末尾)**

修改 `components/editor/markdown-editor.tsx`,在组件内构造 insert 并把 handlers 传给 `MDEditor` 的 `textareaProps`:

```tsx
import { createImageHandlers } from './use-image-upload'
// ...在 MarkdownEditor 内、return 之前:
const handlers = createImageHandlers((md) => onChange((value ? value + '\n' : '') + md))
// ...给 MDEditor 增加:
//   textareaProps={{ onPaste: handlers.onPaste, onDrop: handlers.onDrop }}
```

最终 `<MDEditor>` 增加 `textareaProps={{ onPaste: handlers.onPaste, onDrop: handlers.onDrop }}`。

- [ ] **Step 3: 验证 lint + 构建**

Run: `pnpm lint && pnpm build`
Expected: 通过。

- [ ] **Step 4: 手动验证(dev)**

`pnpm dev` → 进入 `/article/add`(Task 8 后)或临时挂载 → 粘贴/拖拽一张图片 → 编辑器出现 `![name](url)` 且预览显示图片。

- [ ] **Step 5: Commit**

```bash
git add components/editor/use-image-upload.ts components/editor/markdown-editor.tsx
git commit -m "feat: 编辑器支持粘贴/拖拽图片上传至 ImageKit"
```

---

## Task 6: 查看页接入 MarkdownContent + 锚点适配

**Files:**
- Modify: `app/(main)/article/[id]/ArticleDetail.tsx`
- Modify: `app/(main)/article/[id]/anchor/index.tsx`

**Interfaces:**
- Consumes: `MarkdownContent`（Task 3)。
- Produces: 查看页正文用统一渲染器;`Anchor` 监听 `.wmde-markdown` 标题。

- [ ] **Step 1: 替换 ArticleDetail 渲染器**

在 `app/(main)/article/[id]/ArticleDetail.tsx`:
- 删除 `import { BytemdViewer } from '@/components/bytemd/viewer'`,改 `import { MarkdownContent } from '@/lib/markdown/markdown-content'`。
- 把 `<BytemdViewer content={article.content ?? ''} />` 改为:

```tsx
<div className="wmde-markdown-var">
  <MarkdownContent source={article.content ?? ''} />
</div>
```

（`source=01` / 无正文分支与现有掘金跳转逻辑保持不变。)

- [ ] **Step 2: 适配 Anchor 选择器**

在 `app/(main)/article/[id]/anchor/index.tsx`,把两处 `.markdown-body` 选择器改为 `.wmde-markdown`:
- `document.querySelectorAll('.wmde-markdown h1, .wmde-markdown h2, .wmde-markdown h3, .wmde-markdown h4')`
- `const markdownBody = document.querySelector('.wmde-markdown')`

> 标题 id 现由 `rehype-slug`(Task 2)在 SSR 时生成且稳定;保留 Anchor 中 `if (!element.id) element.id = generateUUID()` 作为兜底即可。

- [ ] **Step 3: 验证构建 + 手动**

Run: `pnpm build`
Expected: 通过。
手动:`pnpm dev` 打开一篇 `source=00` 文章,正文渲染正常、目录点击跳转正常、`source=01` 仍显示去掘金按钮。

- [ ] **Step 4: Commit**

```bash
git add "app/(main)/article/[id]/ArticleDetail.tsx" "app/(main)/article/[id]/anchor/index.tsx"
git commit -m "feat: 文章查看页改用统一渲染器并适配目录锚点"
```

---

## Task 7: 查看页增强(阅读进度 / 代码复制 / 图片放大)

**Files:**
- Create: `app/(main)/article/[id]/reading-progress.tsx`
- Create: `app/(main)/article/[id]/content-enhancers.tsx`
- Modify: `app/(main)/article/[id]/ArticleDetail.tsx`

**Interfaces:**
- Produces: `export function ReadingProgress(): JSX.Element`;`export function ContentEnhancers(): JSX.Element`(挂载即对 `.wmde-markdown` 内代码块加复制按钮、对图片启用 medium-zoom)。

- [ ] **Step 1: 阅读进度条**

Create `app/(main)/article/[id]/reading-progress.tsx`:

```tsx
'use client'
import { useEffect, useState } from 'react'

export function ReadingProgress() {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight || 1)
      setPct(Math.min(100, Math.max(0, scrolled * 100)))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div className="fixed inset-x-0 top-0 z-50 h-1 bg-transparent">
      <div className="h-full bg-primary transition-[width]" style={{ width: `${pct}%` }} />
    </div>
  )
}
```

- [ ] **Step 2: 代码复制 + 图片放大增强**

Create `app/(main)/article/[id]/content-enhancers.tsx`:

```tsx
'use client'
import { useEffect } from 'react'
import mediumZoom from 'medium-zoom'
import { toast } from 'sonner'

export function ContentEnhancers() {
  useEffect(() => {
    const root = document.querySelector('.wmde-markdown')
    if (!root) return

    // 图片放大
    const zoom = mediumZoom(root.querySelectorAll('img'), { background: 'rgba(0,0,0,.8)' })

    // 代码块复制按钮
    const pres = Array.from(root.querySelectorAll('pre'))
    const cleanups: Array<() => void> = []
    for (const pre of pres) {
      const el = pre as HTMLElement
      el.style.position = 'relative'
      const btn = document.createElement('button')
      btn.textContent = '复制'
      btn.className =
        'absolute right-2 top-2 rounded bg-black/40 px-2 py-0.5 text-xs text-white hover:bg-black/60'
      const onClick = () => {
        void navigator.clipboard.writeText(pre.innerText).then(() => toast('已复制'))
      }
      btn.addEventListener('click', onClick)
      el.appendChild(btn)
      cleanups.push(() => {
        btn.removeEventListener('click', onClick)
        btn.remove()
      })
    }

    return () => {
      zoom.detach()
      cleanups.forEach((fn) => fn())
    }
  }, [])
  return null
}
```

- [ ] **Step 3: 挂载到 ArticleDetail(仅 hasContent 分支)**

在 `ArticleDetail.tsx` 顶部 `import { ReadingProgress } from './reading-progress'` 与 `import { ContentEnhancers } from './content-enhancers'`;在文章根 `<article>` 内开头渲染 `<ReadingProgress />`,在正文 `MarkdownContent` 容器后渲染 `<ContentEnhancers />`(均仅 `hasContent` 时)。

- [ ] **Step 4: 验证构建 + 手动**

Run: `pnpm build`
Expected: 通过。
手动:滚动有进度条;代码块出现复制按钮且能复制;点击图片放大。

- [ ] **Step 5: Commit**

```bash
git add "app/(main)/article/[id]/reading-progress.tsx" "app/(main)/article/[id]/content-enhancers.tsx" "app/(main)/article/[id]/ArticleDetail.tsx"
git commit -m "feat: 文章查看页增加阅读进度/代码复制/图片放大"
```

---

## Task 8: 创建/编辑共享组件 ArticleEditorForm

**Files:**
- Create: `app/article/components/ArticleEditorForm.tsx`
- Modify: `app/article/add/page.tsx`
- Modify: `app/article/edit/[id]/EditArticle.tsx`

**Interfaces:**
- Consumes: `MarkdownEditor`（Task 4)、`LayoutHeader`（现有)、`RequireAdmin`（现有)、`PublishArticleInfo`（`@/types`)。
- Produces: `export function ArticleEditorForm(props: { initial: PublishArticleInfo; publishButName: string }): JSX.Element`。

- [ ] **Step 1: 实现共享组件(抽取 add/edit 公共结构)**

```tsx
'use client'

import { useImmer } from 'use-immer'
import { PublishArticleInfo } from '@/types'
import { LayoutHeader } from '@/app/article/components/header'
import { RequireAdmin } from '@/components/auth/require-admin'
import { MarkdownEditor } from '@/components/editor/markdown-editor'

interface ArticleEditorFormProps {
  initial: PublishArticleInfo
  publishButName: string
}

export function ArticleEditorForm({ initial, publishButName }: ArticleEditorFormProps) {
  const [articleInfo, updateArticleInfo] = useImmer<PublishArticleInfo>(initial)

  return (
    <RequireAdmin>
      <div className="h-screen overflow-hidden">
        <LayoutHeader
          articleInfo={articleInfo}
          updateArticleInfo={updateArticleInfo}
          publishButName={publishButName}
        />
        <MarkdownEditor
          value={articleInfo.content}
          onChange={(val) =>
            updateArticleInfo((draft) => {
              draft.content = val
            })
          }
        />
      </div>
    </RequireAdmin>
  )
}
```

- [ ] **Step 2: add 页改用共享组件**

替换 `app/article/add/page.tsx` 为:

```tsx
'use client'
import { ArticleEditorForm } from '@/app/article/components/ArticleEditorForm'

export default function PublishArticle() {
  return (
    <ArticleEditorForm
      publishButName="新增"
      initial={{ id: '', title: '', content: '', classify: '', coverImg: '', summary: '' }}
    />
  )
}
```

- [ ] **Step 3: edit 页改用共享组件(保留数据加载)**

修改 `app/article/edit/[id]/EditArticle.tsx`:保留 `use(params)` 取 id 与 `useEffect` 拉取详情逻辑,但把渲染替换为 `<ArticleEditorForm>`。由于初始值需异步填充,改为本地 state 加载完成后再渲染:

```tsx
'use client'

import { useEffect, useState, use } from 'react'
import { toast } from 'sonner'
import { PublishArticleInfo } from '@/types'
import { ArticleEditorForm } from '@/app/article/components/ArticleEditorForm'

export function EditArticle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [initial, setInitial] = useState<PublishArticleInfo | null>(null)

  useEffect(() => {
    async function getData() {
      const res = await fetch(`/api/articles/details?id=${id}`).then((r) => r.json())
      if (res.code !== 0) {
        toast('获取文章详情失败!')
        return
      }
      setInitial({
        id,
        title: res.data.title || '',
        classify: res.data.classify || '',
        coverImg: res.data.coverImg || '',
        summary: res.data.summary || '',
        content: res.data.content || ''
      })
    }
    getData()
  }, [id])

  if (!initial) return <div className="h-screen" />
  return <ArticleEditorForm publishButName="编辑" initial={initial} />
}
```

- [ ] **Step 4: 验证 lint + 构建 + 手动**

Run: `pnpm lint && pnpm build`
Expected: 通过。
手动:`/article/add` 与 `/article/edit/[id]` 均能编辑、发布、回填正常。

- [ ] **Step 5: Commit**

```bash
git add app/article/components/ArticleEditorForm.tsx app/article/add/page.tsx "app/article/edit/[id]/EditArticle.tsx"
git commit -m "refactor: 抽出创建/编辑共享组件 ArticleEditorForm"
```

---

## Task 9: 草稿自动保存与恢复(localStorage)

**Files:**
- Create: `lib/use-article-draft.ts`
- Test: `lib/use-article-draft.test.ts`(纯函数部分)
- Modify: `app/article/components/ArticleEditorForm.tsx`

**Interfaces:**
- Produces:
  - `export function draftKey(id: string | undefined): string`(纯函数,可测)。
  - `export function useArticleDraft(id: string | undefined, info: PublishArticleInfo, apply: (d: PublishArticleInfo) => void): void`(防抖写入 + 首次提示恢复)。

- [ ] **Step 1: 写失败测试(draftKey 纯函数)**

Create `lib/use-article-draft.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { draftKey } from './use-article-draft'

describe('draftKey', () => {
  it('uses "new" for empty id', () => {
    expect(draftKey('')).toBe('article-draft:new')
    expect(draftKey(undefined)).toBe('article-draft:new')
  })
  it('uses id when present', () => {
    expect(draftKey('abc')).toBe('article-draft:abc')
  })
})
```

- [ ] **Step 2: 运行确认失败**

Run: `pnpm test`
Expected: FAIL（模块不存在)

- [ ] **Step 3: 实现 hook + 纯函数**

```ts
import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { PublishArticleInfo } from '@/types'

export function draftKey(id: string | undefined): string {
  return `article-draft:${id ? id : 'new'}`
}

export function useArticleDraft(
  id: string | undefined,
  info: PublishArticleInfo,
  apply: (d: PublishArticleInfo) => void
): void {
  const key = draftKey(id)
  const restored = useRef(false)

  // 进入时尝试恢复
  useEffect(() => {
    if (restored.current) return
    restored.current = true
    try {
      const raw = localStorage.getItem(key)
      if (!raw) return
      const draft = JSON.parse(raw) as PublishArticleInfo
      if (draft.content || draft.title) {
        toast('检测到未发布草稿', {
          action: { label: '恢复', onClick: () => apply(draft) }
        })
      }
    } catch {
      /* ignore */
    }
  }, [key, apply])

  // 防抖保存
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(info))
      } catch {
        /* ignore */
      }
    }, 2000)
    return () => clearTimeout(t)
  }, [key, info])
}
```

- [ ] **Step 4: 运行确认通过**

Run: `pnpm test`
Expected: PASS

- [ ] **Step 5: 接入 ArticleEditorForm**

在 `ArticleEditorForm` 内调用:

```tsx
import { useArticleDraft } from '@/lib/use-article-draft'
// 组件内:
useArticleDraft(initial.id, articleInfo, (d) => updateArticleInfo(() => d))
```

- [ ] **Step 6: 验证 + 手动**

Run: `pnpm lint && pnpm build && pnpm test`
Expected: 全通过。
手动:输入内容等 2s,刷新页面 → 出现「恢复」提示,点击后内容回填。

- [ ] **Step 7: Commit**

```bash
git add lib/use-article-draft.ts lib/use-article-draft.test.ts app/article/components/ArticleEditorForm.tsx
git commit -m "feat: 文章编辑支持 localStorage 草稿自动保存与恢复"
```

---

## Task 10: 未保存改动离开提醒

**Files:**
- Create: `lib/use-unsaved-guard.ts`
- Modify: `app/article/components/ArticleEditorForm.tsx`

**Interfaces:**
- Produces: `export function useUnsavedGuard(dirty: boolean): void`(`beforeunload` 提示)。

- [ ] **Step 1: 实现 hook**

```ts
import { useEffect } from 'react'

/** dirty 为 true 时,关闭/刷新页面弹浏览器原生确认 */
export function useUnsavedGuard(dirty: boolean): void {
  useEffect(() => {
    if (!dirty) return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirty])
}
```

- [ ] **Step 2: 接入 ArticleEditorForm**

在 `ArticleEditorForm` 内用「当前内容 != 初始内容」判断 dirty:

```tsx
import { useUnsavedGuard } from '@/lib/use-unsaved-guard'
// 组件内:
const dirty =
  articleInfo.title !== initial.title || articleInfo.content !== initial.content
useUnsavedGuard(dirty)
```

> 说明:Next App Router 暂无稳定的内部路由离开拦截 API,本任务覆盖关闭/刷新场景(`beforeunload`);应用内跳转的二次确认不在本次范围(YAGNI,可后续按需补)。

- [ ] **Step 3: 验证 + 手动**

Run: `pnpm lint && pnpm build`
Expected: 通过。
手动:改动后刷新/关闭标签 → 浏览器弹确认;未改动则不弹。

- [ ] **Step 4: Commit**

```bash
git add lib/use-unsaved-guard.ts app/article/components/ArticleEditorForm.tsx
git commit -m "feat: 文章编辑未保存改动时离开弹确认"
```

---

## Task 11: 发布前校验(前端) + 元数据自动化

**Files:**
- Modify: `app/article/components/publish-dialog/form.tsx`
- Modify: `app/article/components/header.tsx`

**Interfaces:**
- Consumes: `summarize`, `extractFirstImageUrl`（Task 2)、`containsSensitiveWord`（`@/lib/sensitive-words`)。
- Produces: 发布对话框打开时,空摘要自动用 `summarize(content)` 预填、空封面自动用 `extractFirstImageUrl(content)` 预填;`header.tsx` 的 `submitArticle` 增加敏感词校验。

- [ ] **Step 1: 摘要/封面自动化(form.tsx)**

在 `PublishForm` 的 `useEffect` 里,reset 时对空字段填默认值:

```tsx
import { summarize, extractFirstImageUrl } from '@/lib/markdown/extract'
// 替换原 useEffect:
useEffect(() => {
  if (!articleInfo) return
  reset({
    classify: articleInfo.classify,
    summary: articleInfo.summary || summarize(articleInfo.content),
    coverImg: articleInfo.coverImg || extractFirstImageUrl(articleInfo.content) || ''
  })
}, [articleInfo, reset])
```

- [ ] **Step 2: 敏感词校验(header.tsx)**

在 `submitArticle` 的空校验之后、`fetch` 之前加入:

```tsx
import { containsSensitiveWord } from '@/lib/sensitive-words'
// 在 if (!info.content) {...} 之后:
if (containsSensitiveWord(`${info.title} ${info.content} ${info.summary}`)) {
  toast('内容包含敏感词，请修改后再发布!')
  return { code: -1, msg: '内容包含敏感词' }
}
```

- [ ] **Step 3: 验证 + 手动**

Run: `pnpm lint && pnpm build`
Expected: 通过。
手动:正文有图片/文字时打开发布框,摘要与封面自动预填;含敏感词时发布被拦截。

- [ ] **Step 4: Commit**

```bash
git add app/article/components/publish-dialog/form.tsx app/article/components/header.tsx
git commit -m "feat: 发布前自动填充摘要/封面并增加敏感词校验"
```

---

## Task 12: 服务端写库前校验(add / update)

**Files:**
- Create: `lib/articles/validate.ts`
- Test: `lib/articles/validate.test.ts`
- Modify: `app/api/articles/add/route.ts`
- Modify: `app/api/articles/update/route.ts`

**Interfaces:**
- Consumes: `containsSensitiveWord`（`@/lib/sensitive-words`)。
- Produces: `export function validateArticleInput(input: { title?: string; content?: string; summary?: string }): { ok: true } | { ok: false; msg: string }`。

- [ ] **Step 1: 写失败测试**

Create `lib/articles/validate.test.ts`:

```ts
import { describe, it, expect, vi } from 'vitest'
vi.mock('@/lib/sensitive-words', () => ({
  containsSensitiveWord: (t: string) => t.includes('敏感')
}))
import { validateArticleInput } from './validate'

describe('validateArticleInput', () => {
  it('rejects empty title', () => {
    expect(validateArticleInput({ title: '', content: 'x' })).toEqual({
      ok: false,
      msg: '文章标题不能为空'
    })
  })
  it('rejects empty content', () => {
    expect(validateArticleInput({ title: 't', content: '' })).toEqual({
      ok: false,
      msg: '文章内容不能为空'
    })
  })
  it('rejects sensitive words', () => {
    expect(validateArticleInput({ title: 't', content: '含敏感词' }).ok).toBe(false)
  })
  it('passes valid input', () => {
    expect(validateArticleInput({ title: 't', content: 'hello' })).toEqual({ ok: true })
  })
})
```

- [ ] **Step 2: 运行确认失败**

Run: `pnpm test`
Expected: FAIL

- [ ] **Step 3: 实现校验**

```ts
import { containsSensitiveWord } from '@/lib/sensitive-words'

export function validateArticleInput(input: {
  title?: string
  content?: string
  summary?: string
}): { ok: true } | { ok: false; msg: string } {
  if (!input.title?.trim()) return { ok: false, msg: '文章标题不能为空' }
  if (!input.content?.trim()) return { ok: false, msg: '文章内容不能为空' }
  if (containsSensitiveWord(`${input.title} ${input.content} ${input.summary ?? ''}`)) {
    return { ok: false, msg: '内容包含敏感词' }
  }
  return { ok: true }
}
```

- [ ] **Step 4: 运行确认通过**

Run: `pnpm test`
Expected: PASS

- [ ] **Step 5: 接入 add 路由**

在 `app/api/articles/add/route.ts` 解构 body 后、`prisma.article.create` 前:

```ts
import { validateArticleInput } from '@/lib/articles/validate'
// ...
const valid = validateArticleInput({ title, content, summary })
if (!valid.ok) return sendJson({ code: -1, msg: valid.msg })
```

- [ ] **Step 6: 接入 update 路由**

在 `app/api/articles/update/route.ts` 解构 body 后、`prisma.article.update` 前加入同样三行(复用 `validateArticleInput({ title, content, summary })`)。

- [ ] **Step 7: 验证**

Run: `pnpm test && pnpm lint && pnpm build`
Expected: 全通过。

- [ ] **Step 8: Commit**

```bash
git add lib/articles/validate.ts lib/articles/validate.test.ts app/api/articles/add/route.ts app/api/articles/update/route.ts
git commit -m "feat: 文章新增/更新接口增加服务端校验(空内容+敏感词)"
```

---

## Task 13: 留言板改用 MarkdownContent

**Files:**
- Modify: `app/(main)/guestbook/MessagesList.tsx`

**Interfaces:**
- Consumes: `MarkdownContent`（Task 3,`sanitize` 模式)。

- [ ] **Step 1: 替换渲染器**

在 `app/(main)/guestbook/MessagesList.tsx`:
- 删除 `import { BytemdViewer } from '@/components/bytemd/viewer'`,改 `import { MarkdownContent } from '@/lib/markdown/markdown-content'`。
- 把 `<BytemdViewer content={info.content}></BytemdViewer>` 改为:

```tsx
<MarkdownContent source={info.content} sanitize />
```

- [ ] **Step 2: 验证 + 手动**

Run: `pnpm lint && pnpm build`
Expected: 通过。
手动:留言板 markdown 正常渲染;尝试含 `<script>` 的留言内容不会执行(被 sanitize)。

- [ ] **Step 3: Commit**

```bash
git add "app/(main)/guestbook/MessagesList.tsx"
git commit -m "feat: 留言板改用统一渲染器并启用净化"
```

---

## Task 14: 移除 ByteMD 及残留依赖,最终核验

**Files:**
- Delete: `components/bytemd/`(整目录)
- Modify: `package.json`

**Interfaces:**
- Produces: 项目无任何 `bytemd` / `@bytemd/*` 引用;构建通过。

- [ ] **Step 1: 确认无引用**

Run: `grep -rn "bytemd\|@bytemd\|juejin-markdown-themes\|highlight.js" app components lib --include="*.ts" --include="*.tsx"`
Expected: 无结果(若有,先消除;`juejin-markdown-themes`/`highlight.js` 若被同步脚本等其它处使用则保留,并据实更新本步)。

- [ ] **Step 2: 删除 bytemd 组件目录**

```bash
rm -r components/bytemd
```

- [ ] **Step 3: 卸载依赖**

```bash
pnpm remove bytemd @bytemd/react @bytemd/plugin-breaks @bytemd/plugin-footnotes @bytemd/plugin-frontmatter @bytemd/plugin-gemoji @bytemd/plugin-gfm @bytemd/plugin-highlight-ssr @bytemd/plugin-math @bytemd/plugin-math-ssr @bytemd/plugin-medium-zoom @bytemd/plugin-mermaid
```

若确认无其它引用,再卸载:

```bash
pnpm remove juejin-markdown-themes highlight.js
```

- [ ] **Step 4: 最终核验**

Run: `pnpm lint && pnpm test && pnpm build`
Expected: 全通过,无 bytemd 残留。

- [ ] **Step 5: 手动回归**

`pnpm dev` 走查:新增文章 → 编辑 → 查看(含目录/进度/复制/放大)→ 留言板渲染 → 暗色模式。逐项确认验收标准 1–7。

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: 移除 ByteMD 及相关依赖,完成编辑器迁移"
```

---

## 自检对照(Spec 覆盖)

- 编辑器替换 → Task 4/5;统一渲染器 → Task 3;查看页 → Task 6/7;留言板 → Task 13。
- 存储维持 Markdown、Prism 内置高亮、仅留言板 sanitize、两份 CSS、Turbopack 验证 → Task 1/2/3 + Global Constraints。
- create/edit 共享、草稿、未保存提醒、前端校验、元数据自动化 → Task 8/9/10/11。
- 服务端校验 → Task 12。
- gemoji → Task 2(remark-gemoji);图片上传 → Task 5;TOC/进度/复制/放大 → Task 6/7。
- 彻底移除 bytemd + lint/build 通过 → Task 14。
