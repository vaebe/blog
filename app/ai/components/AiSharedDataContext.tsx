import { createContext } from 'react'
import type { Updater } from 'use-immer'
import { AIConversation } from '@prisma/client'

// 定义数据类型
export interface AiSharedData {
  layoutSidebar: boolean // 对话侧边栏展开状态
  curConversationId: string // 当前对话 id
  aiFirstMsg: string // 首次发送给 ai 的文本
  conversationList: Array<AIConversation>
}

// 定义 Context 类型
interface AiContextType {
  aiSharedData: AiSharedData
  setAiSharedData: Updater<AiSharedData>
}

// 提供默认值（可以是一个空对象或默认数据）
export const defaultAiSharedData: AiContextType = {
  aiSharedData: {
    layoutSidebar: true,
    curConversationId: '',
    aiFirstMsg: '',
    conversationList: []
  },
  setAiSharedData: () => {}
}

// 创建 Context
export const AiSharedDataContext = createContext<AiContextType>(defaultAiSharedData)
