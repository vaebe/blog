import { sendJson } from '@/lib/utils'
import jwt from 'jsonwebtoken'

// 添加留言
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { payload } = body

    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY ?? ''

    const token = jwt.sign(payload.uploadPayload, privateKey, {
      expiresIn: 60, // token 过期时间最大 3600 秒
      header: {
        alg: 'HS256',
        typ: 'JWT',
        kid: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY
      }
    })

    return sendJson({ data: token })
  } catch (err) {
    console.error(err)
    return sendJson({ code: -1, msg: '获取上传 token 失败!' })
  }
}
