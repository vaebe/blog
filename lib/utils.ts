import { type ClassValue, clsx } from 'clsx'
import { NextResponse } from 'next/server'
import { twMerge } from 'tailwind-merge'
import { Article } from '@prisma/client'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface SendJson {
  code?: number
  data?: unknown
  msg?: string
}
export function sendJson(opts: SendJson) {
  return NextResponse.json({ code: 0, msg: '', ...opts }, { status: 200 })
}

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function getFileHash(file: File) {
  const arrayBuffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

// 获取跳转文章详情路径
export function getJumpArticleDetailsUrl(info: Article) {
  return info.source === '00' ? `/article/${info.id}` : `https://juejin.cn/post/${info.id}`
}
