import { sendJson } from '@/lib/utils'
import jwt from 'jsonwebtoken'

// 添加留言
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { payload } = body

    // 过期时间 2 分钟
    const expiresIn = Math.floor(new Date().getTime() / 1000) + 120

    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY ?? ''

    const token = jwt.sign(payload.uploadPayload, privateKey, {
      expiresIn: expiresIn,
      header: {
        alg: 'HS256',
        typ: 'JWT',
        kid: payload.publicKey
      }
    })

    return sendJson({ data: token })
  } catch (err) {
    console.log(err)
    return sendJson({ code: -1, msg: '获取上传 token 失败!' })
  }
}
