import { Send } from 'lucide-react'
import { Input } from './UI/input';
import { Button } from './UI/button';


interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const input = form.elements.namedItem('message') as HTMLInputElement
    if (input.value.trim()) {
      onSendMessage(input.value)
      input.value = ''
    }
  }

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <Input type="text" name="message" placeholder="Type a message..." className="flex-1" />
        <Button type="submit"><Send className="h-5 w-5" /></Button>
      </form>
    </div>
  )
}