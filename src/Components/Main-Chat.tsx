'use client'

import { useState, useEffect } from 'react'
import { ChatHeader } from './Chat-Header'
import { ChatMessages } from './Chat-Message'
import { ChatInput } from './Chat-Input'
import { ChatResponseModel, MessageModel, UserModel } from '../Interfaces/Collective-Interfaces'
import { ParticipantsModel } from '../Interfaces/Participants'

interface MainChatAreaProps {
  selectedChat: ChatResponseModel | null
  currentUser: UserModel | null
  onSendMessage: (message: MessageModel) => void
  callState: {
    isIncomingCall: boolean
    isOutgoingCall: boolean
    callStatus: 'idle' | 'ringing' | 'ongoing' | 'ended' | 'calling'
    callerName: string
    callerAvatar: string
    callerId: string
  }
  initiateCall: (recipientId: string, senderUserId:string, recipientName: string, recipientAvatar: string) => void
  endCall: () => void
}

export function MainChatArea({ 
  selectedChat, 
  currentUser, 
  onSendMessage, 
  callState,
  initiateCall,
  endCall
}: MainChatAreaProps) {
  const [localMessages, setLocalMessages] = useState<MessageModel[]>([])
  const [otherUserOnlineStatus, setOtherUserOnlineStatus] = useState(false)
  const [bothUsers, setBothUsers] = useState<ParticipantsModel>()
  const [otherUser, setOtherUser] = useState<UserModel | null>()

  useEffect(() => {
    if (currentUser && selectedChat) {
      const newOtherUser = selectedChat.participants.find(m => m.id !== currentUser.id)
      setOtherUser(newOtherUser || null)
      if (newOtherUser) {
        const collectiveModel: ParticipantsModel = { SenderUserId: currentUser.id, RecieverUserId: newOtherUser.id }
        setBothUsers(collectiveModel)
        console.log("Both users set")
      }
    }

    if (selectedChat) { 
      setLocalMessages(selectedChat.messages || [])
      setOtherUserOnlineStatus(false)
      if (otherUser) {
        getOnlineStatus(otherUser.id)
      }
    } else {
      setLocalMessages([])
    }
  }, [selectedChat, currentUser, otherUser])

  const getOnlineStatus = async (otherUserId: string) => {
    try {
      const res = await fetch('https://localhost:7032/GetOnlineStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Id: otherUserId }),
      })
      const result = await res.json()
      if (result.result) {
        setOtherUserOnlineStatus(result.result)
      }
    } catch (error) {
      console.log("API request could not be made: ", error)
    }
  }

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

  return (
    <div className="flex-1 flex flex-col">
      <ChatHeader 
        name={otherUser?.name || 'Unknown'} 
        status={otherUserOnlineStatus ? 'Online' : 'Offline'} 
        avatar="/placeholder.svg?height=40&width=40" 
        participants={bothUsers}
        currentUserId={currentUser.id}
        initiateCall={initiateCall}
      />
      <ChatMessages messages={localMessages} currentUserId={currentUser.id} />
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  )
}