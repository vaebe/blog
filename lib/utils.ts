import { type ClassValue, clsx } from 'clsx'
import { NextResponse } from 'next/server'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface SendJson {
  code?: number
  data?: any
  msg?: string
}
export function sendJson(opts: SendJson) {
  return NextResponse.json({ code: 0, msg: '', ...opts }, { status: 200 })
}
