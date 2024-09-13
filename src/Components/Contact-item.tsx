import { Avatar, AvatarFallback, AvatarImage } from "./UI/avatar";


interface ContactItemProps {
  contact: {
    id: number;
    name: string;
    avatar: string;
    status: 'online' | 'offline';
    lastMessage: string;
  };
}

export function ContactItem({ contact }: ContactItemProps) {
  return (
    <div className="flex items-center p-3 hover:bg-gray-100 cursor-pointer">
      <Avatar className="h-10 w-10">
        <AvatarImage src={contact.avatar} alt={contact.name} />
        <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="ml-3 flex-1 overflow-hidden">
        <div className="flex justify-between items-baseline">
          <h2 className="text-sm font-semibold text-gray-800 truncate">{contact.name}</h2>
          <span className="text-xs text-gray-500">12:34 PM</span>
        </div>
        <p className="text-sm text-gray-600 truncate">{contact.lastMessage}</p>
      </div>
      <div className={`w-2 h-2 rounded-full ${contact.status === 'online' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
    </div>
  )
}