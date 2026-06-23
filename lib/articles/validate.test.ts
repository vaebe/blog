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
