import { createContext } from 'react'
import type { Updater } from 'use-immer'

// 定义数据类型
export interface AiSharedData {
  layoutSidebar: boolean
}

// 定义 Context 类型
interface AiContextType {
  aiSharedData: AiSharedData
  setAiSharedData: Updater<AiSharedData>
}

// 提供默认值（可以是一个空对象或默认数据）
export const defaultAiSharedData: AiContextType = {
  aiSharedData: {
    layoutSidebar: true
  },
  setAiSharedData: () => {}
}

// 创建 Context
export const AiSharedDataContext = createContext<AiContextType>(defaultAiSharedData)
