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
