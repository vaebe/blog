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
