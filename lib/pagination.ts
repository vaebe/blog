/**
 * 分页工具函数
 */

/**
 * 从 URL 查询参数中解析分页参数
 * @param searchParams URL 查询参数
 * @param defaultPage 默认页码
 * @param defaultPageSize 默认每页大小
 * @returns 分页参数
 */
export function parsePaginationParams(
  searchParams: URLSearchParams,
  defaultPage: number = 1,
  defaultPageSize: number = 10
) {
  const page = parseInt(searchParams.get('page') || String(defaultPage))
  const pageSize = parseInt(searchParams.get('pageSize') || String(defaultPageSize))

  return {
    page,
    pageSize,
    skip: (page - 1) * pageSize
  }
}

/**
 * 计算分页结果
 * @param total 总记录数
 * @param page 当前页码
 * @param pageSize 每页大小
 * @returns 分页结果
 */
export function calculatePaginationResult(total: number, page: number, pageSize: number) {
  return {
    total,
    currentPage: page,
    totalPages: Math.ceil(total / pageSize)
  }
}

/**
 * 分页参数类型
 */
export interface PaginationParams {
  page: number
  pageSize: number
  skip: number
}

/**
 * 分页结果类型
 */
export interface PaginationResult {
  total: number
  currentPage: number
  totalPages: number
}
