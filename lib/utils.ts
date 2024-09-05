import { type ClassValue, clsx } from 'clsx'
import { NextResponse } from 'next/server'
import { twMerge } from 'tailwind-merge'
import { Article } from '@prisma/client'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getApiUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_BASE_API}${path}`
}

interface SendJson {
  code?: number
  data?: any
  msg?: string
}
export function sendJson(opts: SendJson) {
  return NextResponse.json({ code: 0, msg: '', ...opts }, { status: 200 })
}

export function getArticleDetailsUrl(info: Article) {
  return info.source === '00' ? `/article/${info.id}` : `https://juejin.cn/post/${info.id}`
}
