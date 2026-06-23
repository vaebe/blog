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
