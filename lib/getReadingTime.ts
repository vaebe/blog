/**
 * 从 Markdown 内容中去除代码块
 * @param content
 * @returns {string}
 */
function removeCodeBlocks(content: string): string {
  // 匹配 Markdown 中的代码块 ``` ``` 并将其去除
  return content.replace(/```[\s\S]*?```/g, '')
}

/**
 * 从内容中提取汉字
 * @param content
 * @returns {string[]}
 */
function getChinese(content: string): string[] {
  return content.match(/\p{Script=Han}/gu) || []
}

/**
 * 从内容中提取拉丁文单词
 * @param content
 * @returns {string[]}
 */
function getWords(content: string): string[] {
  // \p{L} 匹配任何字母字符，\p{N} 匹配任何数字字符，允许符号 @ 和 .
  return content.match(/[\p{L}\p{N}@./]+/gu) || []
}

/**
 * 计算内容字数，排除代码块
 * @param content
 * @returns {number}
 */
function getWordCount(content: string): number {
  const cleanedContent = removeCodeBlocks(content) // 去除代码块后的内容
  const chineseCount = getChinese(cleanedContent).length
  const wordCount = getWords(cleanedContent).reduce((acc, word) => {
    const trimmed = word.trim()
    return acc + (trimmed === '' ? 0 : trimmed.split(/\s+/u).length)
  }, 0)

  return chineseCount + wordCount
}

/**
 * 计算阅读时间，排除代码块
 * @param content
 * @param wordsPerMinute 每分钟阅读字数，默认200
 * @returns {{minutes: number, words: number}}
 */
export function getReadingTime(
  content: string,
  wordsPerMinute = 300
): { minutes: number; words: number } {
  const wordCount = getWordCount(content)
  const minutes = Math.round((wordCount / wordsPerMinute) * 100) / 100 // 保留两位小数

  return { minutes, words: wordCount }
}
