import { sendJson } from '@/lib/utils'
import { prisma } from '@/prisma'
import nodemailer from 'nodemailer'

// 添加留言
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { toEmail, subject, text, html } = body

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
    return sendJson({ msg: '邮件发送成功' })
  } catch (error) {
    return sendJson({ code: -1, msg: `发送邮件失败: ${error}` })
  }
}
