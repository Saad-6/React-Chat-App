import { useState, useEffect } from 'react'
import { ChatHeader } from './Chat-Header'
import { ChatMessages } from './Chat-Message'
import { ChatInput } from './Chat-Input'
import { ChatResponseModel, MessageModel, UserModel } from '../Interfaces/Collective-Interfaces'

interface MainChatAreaProps {
  selectedChat: ChatResponseModel | null
  currentUser: UserModel | null
  onSendMessage: (message: MessageModel) => void
}

export function MainChatArea({ selectedChat, currentUser, onSendMessage }: MainChatAreaProps) {
  const [localMessages, setLocalMessages] = useState<MessageModel[]>([])

  useEffect(() => {
    if (selectedChat) {
      console.log("Selected chat updated:", selectedChat)
      setLocalMessages(selectedChat.messages || [])
    } else {
      setLocalMessages([])
    }
  }, [selectedChat])

  useEffect(() => {
    console.log("Local messages updated:", localMessages)
  }, [localMessages])

  const handleSendMessage = async (content: string) => {
    if (!currentUser || !selectedChat) return

    const otherUser = selectedChat.participants.find(p => p.id !== currentUser.id)
    if (!otherUser) return

    try {
      const response = await fetch('https://localhost:7032/SendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          SenderId: currentUser.id,
          ReceiverId: otherUser.id,
          Content: content
        }),
      })

      const result = await response.json()

      if (result.success) {
        const newMessage: MessageModel = {
          id: result.result.id,
          content: content,
          senderUserId: currentUser.id,
          receiverUserId: otherUser.id,
          sentTime: result.result.sentTime,
          readTime: result.result.readTime,
          readStatus: false
        }

        setLocalMessages(prev => [...prev, newMessage])
        onSendMessage(newMessage)
      } else {
        console.error('Failed to send message:', result.message)
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  if (!selectedChat || !currentUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg">Select a chat to start messaging</p>
      </div>
    )
  }

  const otherUser = selectedChat.participants.find(p => p.id !== currentUser.id)

  return (
    <div className="flex-1 flex flex-col">
      <ChatHeader 
        name={otherUser?.name || 'Unknown'} 
        status={otherUser?.isOnline ? 'Online' : 'Offline'} 
        avatar="/placeholder.svg?height=40&width=40" 
      />
      <ChatMessages messages={localMessages} currentUserId={currentUser.id} />
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  )
}