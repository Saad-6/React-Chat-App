import { useEffect, useState } from 'react'
import { Menu } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../Components/UI/avatar'
import { Button } from '../Components/UI/button'
import { MainChatArea } from '../Components/Main-Chat'
import { ContactsList } from '../Components/Contact-List'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import { ContactModel } from '../Interfaces/ContactModel'
import { ApiResponse, ChatResponseModel, UserModel } from '../Interfaces/Collective-Interfaces'

interface DecodedToken {
  id: string;
  fullName: string;
  email: string;
}

export default function HomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [allContacts, setAllContacts] = useState<ContactModel[]>([])
  const [selectedChat, setSelectedChat] = useState<ChatResponseModel | null>(null)
  const [currentUser, setCurrentUser] = useState<UserModel | null>(null)

  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('jwtToken')
    if (!token) {
      navigate("/login")
    } else {
      const decoded = jwtDecode<DecodedToken>(token)
      setCurrentUser({
        id: decoded.id,
        name: decoded.fullName,
        isOnline: true,
        lastSeen: new Date().toISOString()
      });
      console.log("Decoded token:", decoded)
      fetchUserData(decoded.id)
    }
  }, [navigate])

  useEffect(() => {
    console.log("Current user updated:", currentUser)
  }, [currentUser])

  const fetchUserData = async (userId: string) => {
    try {
      const res = await fetch('https://localhost:7032/GetChatThumbnails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Id: userId }),
      })
      const result: ApiResponse<ContactModel[]> = await res.json()
      if (result.success) {
        setAllContacts(result.result)
        console.log("All contacts fetched:", result.result)
      } else {
        console.log("Result not success:", result.message)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const handleChatSelect = async (contact: ContactModel) => {
    if (!currentUser) return

    try {
      console.log("Selecting chat with:", contact)
      const res = await fetch('https://localhost:7032/GetChatMessages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          UserId: currentUser.id, 
          OtherUserId: contact.contactId 
        }),
      })
      const result: ApiResponse<ChatResponseModel> = await res.json()
      if (result.success) {
        console.log("Chat messages fetched:", result.result)
        setSelectedChat(result.result)
      } else {
        console.log("Failed to fetch chat messages:", result.message)
      }
    } catch (error) {
      console.error('Error fetching chat messages:', error)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <Menu className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">Chats</h1>
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
          <AvatarFallback>{currentUser?.name.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className={`${isSidebarOpen ? 'block' : 'hidden'} md:block`}>
          <ContactsList contacts={allContacts} onSelectChat={handleChatSelect} />
        </div>

        <MainChatArea selectedChat={selectedChat} currentUser={currentUser} />
      </div>
    </div>
  )
}