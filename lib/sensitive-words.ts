import SensitiveWordTool from 'sensitive-word-tool'

// 干扰词，会被自动忽略
const noiseWords =
  ' \t\r\n~!@#$%^&*()_+-=【】、{}|;\':"，。、《》？αβγδεζηθικλμνξοπρστυφχψωΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ。，、；：？！…—·ˉ¨‘’“”々～‖∶＂＇｀｜〃〔〕〈〉《》「」『』．〖〗【】（）［］｛｝ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩⅪⅫ⒈⒉⒊⒋⒌⒍⒎⒏⒐⒑⒒⒓⒔⒕⒖⒗⒘⒙⒚⒛㈠㈡㈢㈣㈤㈥㈦㈧㈨㈩①②③④⑤⑥⑦⑧⑨⑩⑴⑵⑶⑷⑸⑹⑺⑻⑼⑽⑾⑿⒀⒁⒂⒃⒄⒅⒆⒇≈≡≠＝≤≥＜＞≮≯∷±＋－×÷／∫∮∝∞∧∨∑∏∪∩∈∵∴⊥∥∠⌒⊙≌∽√§№☆★○●◎◇◆□℃‰€■△▲※→←↑↓〓¤°＃＆＠＼︿＿￣―♂♀┌┍┎┐┑┒┓─┄┈├┝┞┟┠┡┢┣│┆┊┬┭┮┯┰┱┲┳┼┽┾┿╀╁╂╃└┕┖┗┘┙┚┛━┅┉┤┥┦┧┨┩┪┫┃┇┋┴┵┶┷┸┹┺┻╋╊╉╈╇╆╅╄'

const sensitiveWordTool = new SensitiveWordTool({
  useDefaultWords: true,
  noiseWords
})

/**
 * 检测文本中是否包含敏感词
 * @param text 待检测的文本
 * @returns 是否包含敏感词
 */
export function containsSensitiveWord(text: string): boolean {
  return sensitiveWordTool.verify(text)
}

/**
 * 获取文本中的敏感词列表
 * @param text 待检测的文本
 * @returns 敏感词列表
 */
export function getSensitiveWords(text: string): string[] {
  return sensitiveWordTool.match(text)
}

/**
 * 过滤文本中的敏感词（替换为 *）
 * @param text 待过滤的文本
 * @param filterChar 替换字符，默认为 *
 * @returns 过滤后的文本
 */
export function filterSensitiveWords(text: string, filterChar: string = '*'): string {
  return sensitiveWordTool.filter(text, filterChar)
}
