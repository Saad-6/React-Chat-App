import { useState } from 'react'
import { Search, MessageCircle, Phone, Video, MoreVertical, Send, Menu } from 'lucide-react'
import { Button } from '../Components/UI/button';
import { Input } from '../Components/UI/input';
import { Avatar, AvatarFallback, AvatarImage } from '../Components/UI/avatar';


interface Contact {
  id: number;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
  lastMessage: string;
}

export default function HomePage() {
  const [contacts] = useState<Contact[]>([
    { id: 1, name: "Alice Smith", avatar: "/placeholder.svg?height=32&width=32", status: 'online', lastMessage: "Hey, how's it going?" },
    { id: 2, name: "Bob Johnson", avatar: "/placeholder.svg?height=32&width=32", status: 'offline', lastMessage: "See you tomorrow!" },
    { id: 3, name: "Carol Williams", avatar: "/placeholder.svg?height=32&width=32", status: 'online', lastMessage: "Thanks for your help!" },
  ]);

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
        <div className={`bg-white w-full md:w-80 border-r border-gray-200 flex-shrink-0 ${isSidebarOpen ? 'block' : 'hidden'} md:block`}>
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input type="text" placeholder="Search contacts" className="pl-10 w-full" />
            </div>
          </div>
          <div className="overflow-y-auto h-[calc(100vh-8rem)]">
            {contacts.map((contact) => (
              <div key={contact.id} className="flex items-center p-3 hover:bg-gray-100 cursor-pointer">
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
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 md:h-10 md:w-10">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Current chat" />
                <AvatarFallback>AC</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <h2 className="text-lg font-semibold text-gray-800">Alice Smith</h2>
                <p className="text-sm text-gray-600">Online</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" className="hidden md:inline-flex"><Phone className="h-5 w-5" /></Button>
              <Button variant="ghost" size="icon" className="hidden md:inline-flex"><Video className="h-5 w-5" /></Button>
              <Button variant="ghost" size="icon"><MoreVertical className="h-5 w-5" /></Button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="flex justify-end">
              <div className="bg-primary text-primary-foreground rounded-lg py-2 px-4 max-w-[75%] md:max-w-md">
                Hey Alice! How's your day going?
              </div>
            </div>
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-800 rounded-lg py-2 px-4 max-w-[75%] md:max-w-md">
                Hi there! It's going well, thanks for asking. How about yours?
              </div>
            </div>
          </div>

          {/* Message Input */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex items-center space-x-2">
              <Input type="text" placeholder="Type a message..." className="flex-1" />
              <Button><Send className="h-5 w-5" /></Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}