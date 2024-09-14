import { MessageModel } from "../Interfaces/Collective-Interfaces"
import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'

interface ChatMessagesProps {
  messages: MessageModel[]
  currentUserId: string
}

export function ChatMessages({ messages, currentUserId }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((message, index) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`flex ${message.senderUserId === currentUserId ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-sm ${
              message.senderUserId === currentUserId
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-800'
            }`}
          >
            <p className="text-sm">{message.content}</p>
            <div className={`text-xs mt-1 ${
              message.senderUserId === currentUserId ? 'text-blue-100' : 'text-gray-500'
            }`}>
              {format(new Date(message.sentTime), 'HH:mm')}
            </div>
          </div>
        </motion.div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}