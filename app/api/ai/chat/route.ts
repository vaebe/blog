import { CoreMessage, streamText } from 'ai' // 导入AI相关的核心类型和流式文本处理函数
import { createOpenAI } from '@ai-sdk/openai' // 导入创建OpenAI客户端的函数

// POST请求处理函数
export async function POST(req: Request) {
  // 从请求体中解构获取消息数组
  const { messages }: { messages: CoreMessage[] } = await req.json()

  // 创建智谱AI的客户端实例
  const openai = createOpenAI({
    baseURL: 'https://open.bigmodel.cn/api/paas/v4/', // 智谱AI的API基础URL
    compatibility: 'strict', // 设置兼容模式为严格模式
    apiKey: process.env.ZHI_PU_AI_API_KEY // 从环境变量获取API密钥
  })

  // 使用streamText函数创建流式文本响应
  const result = await streamText({
    model: openai('glm-4-flash'), // 使用智谱AI的GLM-4-Flash模型
    system: '你是一名优秀的开发工程师', // 设置AI助手的系统角色提示
    messages // 传入用户消息历史
  })

  // 将结果转换为数据流响应并返回
  return result.toDataStreamResponse()
}
