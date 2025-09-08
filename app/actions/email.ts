'use server'

import { prisma } from '@/lib/prisma'
import nodemailer from 'nodemailer'
import { z } from 'zod'
import type { ApiRes } from '@/lib/utils'

const SendEmailSchema = z.object({
  toEmail: z.email({ message: '邮箱格式不正确！' }),
  subject: z.string().optional(),
  text: z.string().optional(),
  html: z.string().optional()
})

// 发送邮件
export async function sendEmail(props: z.infer<typeof SendEmailSchema>): Promise<ApiRes> {
  try {
    const parsed = SendEmailSchema.safeParse(props)

    if (!parsed.success) {
      // 当解析失败时，返回第一个错误信息
      const errorMessage = parsed.error.issues[0].message
      return { code: 400, data: null, msg: errorMessage }
    }

    const { toEmail, subject, text, html } = parsed.data

    if (!subject || !(text || html)) {
      return { code: -1, msg: '参数不正确' }
    }

    // 先查询邮箱是否已经存在
    const existingEmail = await prisma.subscriber.findUnique({
      where: {
        email: toEmail
      }
    })

    if (existingEmail) {
      return { code: -1, msg: '邮箱已订阅' }
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

    return { code: 0, msg: '邮件发送成功' }
  } catch (error) {
    return { code: -1, msg: `发送邮件失败：${error}` }
  }
}
