import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './UI/avatar'
import { ContactModel } from '../Interfaces/ContactModel'

interface ContactItemProps {
  contact: ContactModel
  onSelect: (contact: ContactModel) => void
}

export const ContactItem: React.FC<ContactItemProps> = ({ contact, onSelect }) => {
  const handleClick = () => {
    onSelect(contact)
  }

  // Safely get the first character of the contact name, or use a fallback
  const getAvatarFallback = () => {
    if (contact.contactName && typeof contact.contactName === 'string') {
      return contact.contactName.charAt(0).toUpperCase()
    }
    return '?'
  }

  return (
    <div
      className="flex items-center space-x-4 p-3 hover:bg-gray-100 cursor-pointer"
      onClick={handleClick}
    >
      <Avatar>
        <AvatarImage src={contact.contactPicture || "/placeholder.svg?height=40&width=40"} alt={contact.contactName || "Contact"} />
        <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {contact.contactName || "Unknown Contact"}
        </p>
        <p className="text-sm text-gray-500 truncate">
          {contact.lastMessage?.content || "No messages yet"}
        </p>
      </div>
      {contact.lastMessageTime && (
        <span className="text-xs text-gray-400">
          {new Date(contact.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      )}
    </div>
  )
}