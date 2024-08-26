import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getApiUrl (path: string) {
  return `${process.env.NEXT_PUBLIC_BASE_API}${path}`
}