import { Avatar, AvatarFallback, AvatarImage } from "./UI/avatar"
import { ContactModel } from '../Interfaces/ContactModel'

interface ContactItemProps {
  contact: ContactModel
  onSelect: () => void
}

export function ContactItem({ contact, onSelect }: ContactItemProps) {
  return (
    <div className="flex items-center p-3 hover:bg-gray-100 cursor-pointer" onClick={onSelect}>
      <Avatar className="h-10 w-10">
        <AvatarImage src={contact.contactPicture || "/placeholder.svg?height=40&width=40"} alt={contact.contactName} />
        <AvatarFallback>{contact.contactName.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="ml-3 flex-1 overflow-hidden">
        <div className="flex justify-between items-baseline">
          <h2 className="text-sm font-semibold text-gray-800 truncate">{contact.contactName}</h2>
          <span className="text-xs text-gray-500">{/*contact.lastMessage.sentTime*/}</span>
        </div>
        <p className="text-sm text-gray-600 truncate">{contact.lastMessage.content}</p>
      </div>
      <div className={`w-2 h-2 rounded-full ${contact.contactEmail === 'online' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
    </div>
  )
}