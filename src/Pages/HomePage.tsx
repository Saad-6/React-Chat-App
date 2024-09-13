import { useState } from 'react'
import { Menu } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '../Components/UI/avatar';
import { Button } from '../Components/UI/button';
import { MainChatArea } from '../Components/Main-Chat';
import { ContactsList } from '../Components/Contact-List';


interface Contact {
  id: number;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
  lastMessage: string;
}

export default function HomePage() {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <Menu className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">Chats</h1>
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className={`${isSidebarOpen ? 'block' : 'hidden'} md:block`}>
          <ContactsList contacts={contacts} />
        </div>

        {/* Main Chat Area */}
        <MainChatArea />
      </div>
    </div>
  )
}