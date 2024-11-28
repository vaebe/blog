import { generateText, CoreMessage } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import { sendJson } from '@/lib/utils'
import { prisma } from '@/prisma'
import { AIMessage } from '@prisma/client'

function generatePromptText(list: Array<AIMessage>) {
  const msg = list.map((item) => ({
    content: item.content,
    role: item.role as CoreMessage['role']
  }))

  return `
    根据以下一段对话内容，提取其核心信息，并生成一个标题和描述：
    对话内容："${JSON.stringify(msg)}"。
    非常重要
      - 无需使用 markdown 格式返回。
    要求：
      - 标题不超过18个字。
      - 描述不超过50字。
      - 保持语言简洁明了。
      - 输出结果格式为：{"name":"","desc":""}。
  `
}

export async function GET(req: Request) {
  // 未登录返回 null
  const session = await getServerSession(authOptions)

  if (!session) {
    return sendJson({ code: 401, msg: `无权限!` })
  }

  const url = new URL(req.url)
  const conversationId = url.searchParams.get('conversationId')

  if (!conversationId) {
    return sendJson({ code: 400, msg: '参数不正确!' })
  }

  try {
    // 查询开始对话的两条数据生成标题
    const conversationData = await prisma.aIMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      skip: 0,
      take: 2
    })

    if (!conversationData.length) {
      return sendJson({ code: -1, msg: `生成对话名称失败,对话信息不存在!` })
    }

    // 创建AI的客户端实例
    const openai = createOpenAI({
      baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1', // AI的API基础URL
      compatibility: 'strict', // 设置兼容模式为严格模式
      apiKey: process.env.A_LI_AI_API_KEY // 从环境变量获取API密钥
    })

    const result = await generateText({
      model: openai('qwen-turbo-latest'), // 模型名称
      prompt: generatePromptText(conversationData) // 设置AI助手的系统角色提示
    })

    const info = JSON.parse(result.text)

    // 将数据保存到数据库
    await prisma.aIConversation.update({
      where: { id: conversationId },
      data: {
        name: info.name,
        desc: info.desc
      }
    })

    return sendJson({ data: info })
  } catch (error) {
    console.error(`生成对话名称失败:${error}`)
    return sendJson({ code: -1, msg: `生成对话名称 ${error}` })
  }
}
