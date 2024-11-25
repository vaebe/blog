import { CoreMessage, streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import { console } from 'inspector'

export async function POST(req: Request) {
  // 未登录返回 null
  const session = await getServerSession(authOptions)

  // 判断用户 id 是否存在执行对应的逻辑
  if (session?.user.id) {
  }

  interface ReqProps {
    messages: CoreMessage[]
    data: Record<string, string | number>
  }

  const { messages, data }: ReqProps = await req.json()

  // conversationId 对话id
  console.log(data.conversationId)

  // 创建AI的客户端实例
  const openai = createOpenAI({
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1', // AI的API基础URL
    compatibility: 'strict', // 设置兼容模式为严格模式
    apiKey: process.env.A_LI_AI_API_KEY // 从环境变量获取API密钥
  })

  // 使用streamText函数创建流式文本响应
  const result = await streamText({
    model: openai('qwen-turbo-latest'), // 模型名称
    system: '你是一名优秀的前端开发工程师', // 设置AI助手的系统角色提示
    messages, // 传入用户消息历史
    onFinish: ({ finishReason, text, responseMessages, response }) => {
      console.log(finishReason, text, JSON.stringify(responseMessages), response)
    }
  })

  // 将结果转换为数据流响应并返回
  return result.toDataStreamResponse()
}
