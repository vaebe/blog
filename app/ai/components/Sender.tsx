import { Button } from '@/components/ui/button'
import { Send, StopCircle } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'

interface SenderProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  input: string
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>
  ) => void
  isLoading: boolean
  stop: () => void
}

function Sender({ onSubmit, input, handleInputChange, isLoading, stop }: SenderProps) {
  return (
    <form onSubmit={onSubmit} className="w-full flex items-end space-x-2 relative">
      <Textarea
        disabled={isLoading}
        value={input}
        onChange={handleInputChange}
        placeholder="在此处输入您的消息..."
        rows={2}
        className="pr-14"
      />

      <div className=" absolute bottom-0 right-0 z-10">
        <Button type="submit" disabled={isLoading || !input.trim()}>
          <Send className="h-4 w-4" />
        </Button>

        {isLoading && (
          <Button type="button" variant="outline" onClick={() => stop()}>
            <StopCircle className="h-4 w-4" />
          </Button>
        )}
      </div>
    </form>
  )
}

export { Sender }
export default Sender
