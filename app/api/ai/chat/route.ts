import { CoreMessage, streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json()

  const openai = createOpenAI({
    baseURL: 'https://open.bigmodel.cn/api/paas/v4/',
    compatibility: 'strict',
    apiKey: process.env.ZHI_PU_AI_API_KEY
  })

  const result = await streamText({
    model: openai('glm-4-flash'),
    system: '你是一名优秀的开发工程师',
    messages
  })

  return result.toDataStreamResponse()
}
