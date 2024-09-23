'use client'

import React, { useEffect, useState } from 'react'
import { Phone, Video, MoreVertical } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './UI/avatar'
import { Button } from './UI/button'
import { CallModal } from './Call-Modal'
import { ParticipantsModel } from '../Interfaces/Participants'

interface ChatHeaderProps {
  name: string
  status: string
  avatar: string
  participants: ParticipantsModel | undefined
  currentUserId: string
  callModalOpen: boolean
  isCallRejected: boolean
}

export function ChatHeader({ 
  name, 
  status, 
  avatar, 
  participants, 
  currentUserId, 
  callModalOpen, 
  isCallRejected 
}: ChatHeaderProps) {
  const [isCallModalOpen, setIsCallModalOpen] = useState(false)

  useEffect(() => {
    setIsCallModalOpen(callModalOpen)
  }, [callModalOpen])

  const handleCallClick = async () => {
    if (!participants) return

    try {
      const response = await fetch('https://localhost:7032/Ring', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          SenderUserId: currentUserId,
          RecieverUserId: participants.RecieverUserId,
        }),
      })

      const result = await response.json()
      if (result.success) {
        setIsCallModalOpen(true)
      } else {
        console.error('Call failed:', result.message)
        // Handle call failure (e.g., show an error message)
      }
    } catch (error) {
      console.error('Error making call:', error)
      // Handle error (e.g., show an error message)
    }
  }

  const handleCloseCallModal = () => {
    setIsCallModalOpen(false)
  }

  return (
    <>
      <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 md:h-10 md:w-10">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
            <p className="text-sm text-gray-600">{status}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:inline-flex"
            onClick={handleCallClick}
          >
            <Phone className="h-5 w-5" />
            <span className="sr-only">Call</span>
          </Button>
          <Button variant="ghost" size="icon" className="hidden md:inline-flex">
            <Video className="h-5 w-5" />
            <span className="sr-only">Video call</span>
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
            <span className="sr-only">More options</span>
          </Button>
        </div>
      </div>
      <CallModal
        isOpen={isCallModalOpen}
        onClose={handleCloseCallModal}
        name={name}
        avatar={avatar}
        status={status}
        participants={participants}
        isCallRejected={isCallRejected}
      />
    </>
  )
}