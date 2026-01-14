/**
 * 文件上传配置
 */

// 允许的图片类型
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/bmp',
  'image/tiff'
]

// 允许的图片扩展名
export const ALLOWED_IMAGE_EXTENSIONS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.webp',
  '.svg',
  '.bmp',
  '.tiff',
  '.tif'
]

// 最大文件大小（字节）- 5MB
export const MAX_FILE_SIZE = 5 * 1024 * 1024

// 最小文件大小（字节）- 1KB
export const MIN_FILE_SIZE = 1 * 1024

/**
 * 验证文件类型是否为允许的图片类型
 * @param file 文件对象
 * @returns 是否为允许的图片类型
 */
export function isAllowedImageType(file: File): boolean {
  return ALLOWED_IMAGE_TYPES.includes(file.type)
}

/**
 * 验证文件扩展名是否为允许的图片扩展名
 * @param fileName 文件名
 * @returns 是否为允许的图片扩展名
 */
export function isAllowedImageExtension(fileName: string): boolean {
  const ext = fileName.toLowerCase().substring(fileName.lastIndexOf('.'))
  return ALLOWED_IMAGE_EXTENSIONS.includes(ext)
}

/**
 * 验证文件大小是否在允许范围内
 * @param file 文件对象
 * @returns 文件大小是否在允许范围内
 */
export function isFileSizeValid(file: File): boolean {
  return file.size >= MIN_FILE_SIZE && file.size <= MAX_FILE_SIZE
}

/**
 * 获取文件大小的可读格式
 * @param bytes 文件大小（字节）
 * @returns 可读的文件大小字符串
 */
export function getReadableFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}