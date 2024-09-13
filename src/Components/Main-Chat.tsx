import { useState } from 'react'
import { ChatHeader } from './Chat-Header';
import { ChatMessages } from './Chat-Message';
import { ChatInput } from './Chat-Input';


interface Message {
  id: number;
  content: string;
  sender: 'user' | 'other';
}

export function MainChatArea() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, content: "Hey Alice! How's your day going?", sender: 'user' },
    { id: 2, content: "Hi there! It's going well, thanks for asking. How about yours?", sender: 'other' },
  ])

  const handleSendMessage = (content: string) => {
    setMessages(prev => [...prev, { id: prev.length + 1, content, sender: 'user' }])
  }

  return (
    <div className="flex-1 flex flex-col">
      <ChatHeader name="Alice Smith" status="Online" avatar="/placeholder.svg?height=40&width=40" />
      <ChatMessages messages={messages} />
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  )
}