'use client'
import ReactDOM from 'react-dom'

interface Props {
  isLoading: boolean
  message?: string
}

export function FullScreenLoading({ isLoading, message = 'Loading...' }: Props) {
  return ReactDOM.createPortal(
    <div>
      {isLoading && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-t-4 border-white border-solid rounded-full animate-spin"></div>
            <p className="mt-4 text-lg font-semibold text-white">{message}</p>
          </div>
        </div>
      )}
    </div>,
    document.body
  )
}
