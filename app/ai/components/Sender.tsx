import { Button } from '@/components/ui/button'
import { ArrowUpIcon, StopCircle } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/hooks/use-toast'
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface SenderProps {
  onSubmit: () => void
  input: string
  setInput: (value: string) => void
  isLoading: boolean
  stop: () => void
  className?: string
}

function Sender({ onSubmit, input, setInput, isLoading, stop, className }: SenderProps) {
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
    setInput(event.target.value)
    adjustHeight()
  }

  function sendMsg() {
    if (isLoading || !input.trim()) {
      return
    }

    onSubmit()

    setTimeout(() => {
      adjustHeight()
    }, 0)
  }

  return (
    <div className="w-full relative">
      <Textarea
        ref={textareaRef}
        placeholder="Send a message..."
        value={input}
        onChange={handleInput}
        className={cn(
          'min-h-[24px] max-h-[calc(45dvh)] overflow-hidden resize-none rounded-xl text-base bg-muted',
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
              sendMsg()
            }
          }
        }}
      />

      <div className="absolute bottom-1 right-1">
        <Button size="sm" disabled={isLoading || !input.trim()} onClick={sendMsg}>
          <ArrowUpIcon size={18} />
        </Button>

        {isLoading && (
          <Button type="button" size="sm" variant="outline" onClick={() => stop()}>
            <StopCircle size={18} />
          </Button>
        )}
      </div>
    </div>
  )
}

export { Sender }
export default Sender
