'use client'
import { FC } from 'react'
import ReactDOM from 'react-dom'

interface Props {
  isLoading: boolean
  message?: string
}

export const FullScreenLoading: FC<Props> = ({ isLoading, message = 'Loading...' }) => {
  if (!isLoading) return null

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-xs">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-t-4 border-white border-solid rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-semibold text-white">{message}</p>
      </div>
    </div>,
    document.body
  )
}
