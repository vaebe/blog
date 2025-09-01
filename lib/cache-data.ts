import { z } from 'zod'
import type { ApiRes } from './utils'
import { prisma } from '@/prisma'
import { randomUUID } from 'crypto'
import { TimeInSeconds } from './enums'
import type { CacheData } from '@prisma/client'

const createCacheDataSchema = z.object({
  key: z.string().min(1, { message: '缓存数据的 key 不能为空！' }),
  data: z.string().min(1, { message: '缓存数据不能为空' }),
  desc: z.string().optional()
})

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
        id: randomUUID().replaceAll('-', ''),
        key: key,
        data: data,
        desc: desc
      }
    })

    return { code: 0, msg: '创建缓存数据成功！', data: res }
  } catch (error) {
    return { code: -1, msg: `创建缓存数据失败：${error}` }
  }
}

export async function getCacheData(key: string): Promise<ApiRes<CacheData>> {
  try {
    if (!key) {
      return { code: 400, msg: '缓存数据的 key 不能为空！' }
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/cache-data?key=${key}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      next: { revalidate: TimeInSeconds.oneHour } // 数据缓存一个小时
    })

    if (!response.ok) {
      const errorMessage = await response.text()
      return { code: -1, msg: `获取缓存数据失败: ${response.statusText} - ${errorMessage}` }
    }

    return response.json()
  } catch (error) {
    return { code: -1, msg: `获取缓存数据失败：${error}` }
  }
}
