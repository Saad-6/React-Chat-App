import { Phone, Video, MoreVertical } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage} from './UI/avatar';
import { Button } from './UI/button';


interface ChatHeaderProps {
  name: string;
  status: string;
  avatar: string;
}

export function ChatHeader({ name, status, avatar }: ChatHeaderProps) {
  return (
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
        <Button variant="ghost" size="icon" className="hidden md:inline-flex"><Phone className="h-5 w-5" /></Button>
        <Button variant="ghost" size="icon" className="hidden md:inline-flex"><Video className="h-5 w-5" /></Button>
        <Button variant="ghost" size="icon"><MoreVertical className="h-5 w-5" /></Button>
      </div>
    </div>
  )
}