import { sendJson } from '@/lib/utils'

export async function GET() {
  return sendJson({ data: 'hello world' })
}
