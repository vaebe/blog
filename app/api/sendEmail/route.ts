import { sendJson, emailRegex } from '@/lib/utils'
import { prisma } from '@/prisma'
import nodemailer from 'nodemailer'

// 发送邮件
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { toEmail, subject, text, html } = body

    // 检查邮箱格式是否正确
    if (!emailRegex.test(toEmail)) {
      return sendJson({ code: -1, msg: '邮箱格式不正确' })
    }

    if (!subject || !(text || html)) {
      return sendJson({ code: -1, msg: '参数不正确' })
    }

    // 先查询邮箱是否已经存在
    const existingEmail = await prisma.subscriber.findUnique({
      where: {
        email: toEmail
      }
    })

    if (existingEmail) {
      return sendJson({ code: -1, msg: '邮箱已订阅' })
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: parseInt(process.env.EMAIL_SERVER_PORT as string),
      secure: true, // 465 端口为 true 其他为 false
      auth: {
        user: process.env.EMAIL_SERVER_USER, // 你的QQ邮箱
        pass: process.env.EMAIL_SERVER_PASSWORD // QQ邮箱授权码，不是QQ密码
      }
    })

    // 邮件内容
    const mailData = {
      from: process.env.EMAIL_FROM,
      to: toEmail, // 收件人邮箱
      subject: subject, // 邮件主题
      text: text, // 纯文本内容
      html: html // HTML内容
    }

    await transporter.sendMail(mailData)

    // 发送邮件成功后,将邮箱保存到数据库
    await prisma.subscriber.create({
      data: {
        email: toEmail
      }
    })

    return sendJson({ msg: '邮件发送成功' })
  } catch (error) {
    return sendJson({ code: -1, msg: `发送邮件失败：${error}` })
  }
}
