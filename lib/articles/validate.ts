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
