import { z } from 'zod'
import { cacheLife, cacheTag, revalidateTag } from 'next/cache'
import type { ApiRes } from './utils'
import { prisma } from '@/lib/prisma'
import { generateUUID } from '@/lib/utils'

const createCacheDataSchema = z.object({
  key: z.string().min(1, { message: '缓存数据的 key 不能为空！' }),
  data: z.string().min(1, { message: '缓存数据不能为空' }),
  desc: z.string().optional()
})

// 单条缓存数据对应的 tag，写入后用 revalidateTag 失效读取缓存
function cacheDataTag(key: string) {
  return `cache-data-${key}`
}

export async function createCacheData(
  props: z.infer<typeof createCacheDataSchema>
): Promise<ApiRes> {
  try {
    const parsed = createCacheDataSchema.safeParse(props)

    if (!parsed.success) {
      // 当解析失败时，返回第一个错误信息
      const errorMessage = parsed.error.issues[0].message
      return { code: 400, data: null, msg: errorMessage }
    }

    const { key, data, desc = '' } = parsed.data

    const res = await prisma.cacheData.upsert({
      where: {
        key: key
      },
      update: {
        data: data,
        desc: desc
      },
      create: {
        id: generateUUID(),
        key: key,
        data: data,
        desc: desc
      }
    })

    // 数据更新后失效对应 key 的读取缓存
    revalidateTag(cacheDataTag(key), 'max')

    return { code: 0, msg: '创建缓存数据成功！', data: res }
  } catch (error) {
    return { code: -1, msg: `创建缓存数据失败：${error}` }
  }
}

interface GetCacheDataProps {
  key: string
}

// 直接查 Prisma 并用 Cache Components 缓存，替代原先 fetch 自身 /api/cache-data 的写法
async function getCacheData(key: string) {
  'use cache'
  cacheTag(cacheDataTag(key))
  cacheLife('hours')

  return prisma.cacheData.findUnique({
    where: { key }
  })
}

export async function getCacheDataByKey<T>(props: GetCacheDataProps): Promise<ApiRes<T>> {
  try {
    if (!props.key) {
      return { code: 400, msg: '缓存数据的 key 不能为空！' }
    }

    const cacheData = await getCacheData(props.key)

    const raw = cacheData?.data
    if (!raw) {
      return { code: 0, msg: '缓存数据为空' }
    }

    const data = JSON.parse(raw) as T

    return { code: 0, data, msg: '获取缓存数据成功' }
  } catch (error) {
    return { code: -1, msg: `获取缓存数据失败：${error}` }
  }
}
