import remarkGfm from 'remark-gfm'
import remarkGemoji from 'remark-gemoji'
import rehypeSlug from 'rehype-slug'
import rehypeSanitize from 'rehype-sanitize'

export const remarkPlugins = [remarkGfm, remarkGemoji]

// 文章(可信):仅加锚点,保留高亮/样式所需 class/id
export const rehypePlugins = [rehypeSlug]

// 留言板(不可信):额外净化
export const sanitizeRehypePlugins = [rehypeSlug, rehypeSanitize]
