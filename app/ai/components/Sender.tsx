import { Button } from '@/components/ui/button'
import { ArrowUpIcon, StopCircle } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/hooks/use-toast'
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface SenderProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  input: string
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>
  ) => void
  isLoading: boolean
  stop: () => void
  className?: string
}

function Sender({ onSubmit, input, handleInputChange, isLoading, stop, className }: SenderProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`
    }
  }

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight()
    }
  }, [])

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange(event)
    adjustHeight()
  }

  return (
    <form onSubmit={onSubmit} className="w-full relative">
      <Textarea
        ref={textareaRef}
        placeholder="Send a message..."
        value={input}
        onChange={handleInput}
        className={cn(
          'min-h-[24px] max-h-[calc(75dvh)] overflow-hidden resize-none rounded-xl text-base bg-muted',
          className
        )}
        rows={3}
        autoFocus
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()

            if (isLoading) {
              toast({
                description: 'Please wait for the model to finish its response!',
                variant: 'destructive'
              })
            } else {
              // todo 会车提交消息
            }
          }
        }}
      />

      <div className="absolute bottom-1 right-1">
        <Button type="submit" size="sm" disabled={isLoading || !input.trim()}>
          <ArrowUpIcon size={18} />
        </Button>

        {isLoading && (
          <Button type="button" size="sm" variant="outline" onClick={() => stop()}>
            <StopCircle size={18} />
          </Button>
        )}
      </div>
    </form>
  )
}

export { Sender }
export default Sender
