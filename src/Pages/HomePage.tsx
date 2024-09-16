import React, { useEffect, useState } from 'react'
import { Menu, UserPlus } from 'lucide-react'
import { ContactsList } from '../Components/Contact-List'
import { jwtDecode } from 'jwt-decode'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ContactModel } from '../Interfaces/ContactModel'
import { ApiResponse, ChatResponseModel, MessageModel, UserModel } from '../Interfaces/Collective-Interfaces'
import { FriendRequestsModal } from '../Components/FriendRequestModal'
import { Button } from '../Components/UI/button'
import { Avatar, AvatarFallback, AvatarImage } from '../Components/UI/avatar'
import { MainChatArea } from '../Components/Main-Chat'


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
  const [isFriendRequestsModalOpen, setIsFriendRequestsModalOpen] = useState(false)
  const [socket, setSocket] = useState<WebSocket | null>(null)

  const navigate = useNavigate()
  const { chatId } = useParams<{ chatId: string }>()

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
      initializeWebSocket(decoded.id)
    }
  }, [navigate])

  useEffect(() => {
    if (currentUser && allContacts.length > 0 && chatId) {
      const contact = allContacts.find(c => c.contactId === chatId)
      if (contact) {
        handleChatSelect(contact)
      }
    }
  }, [currentUser, allContacts, chatId])

  const initializeWebSocket = (userId: string) => {
    const newSocket = new WebSocket(`wss://localhost:7032/ws?userId=${userId}`);
    setSocket(newSocket);

    newSocket.onmessage = (event) => {
      const messageData: MessageModel = JSON.parse(event.data);
      console.log("Message received from websocket: ", messageData);
      if (messageData.senderUserId !== userId) {
        updateChatAndContacts(messageData);
      }
    };

    newSocket.onclose = () => {
      console.log("WebSocket connection closed");
      // Attempt to reconnect after a delay
      setTimeout(() => initializeWebSocket(userId), 5000);
    };

    return () => {
      if (newSocket.readyState === WebSocket.OPEN) {
        newSocket.close();
      }
    };
  }

  const updateChatAndContacts = (newMessage: MessageModel) => {
    // Update selected chat if it's the current chat
    setSelectedChat((prevChat) => {
      if (prevChat && (prevChat.participants[0].id === newMessage.senderUserId || prevChat.participants[1].id === newMessage.senderUserId)) {
        return {
          ...prevChat,
          messages: [...prevChat.messages, newMessage]
        };
      }
      return prevChat;
    });
  
    // Update contacts list
    setAllContacts((prevContacts) => {
      const updatedContacts = prevContacts.map((contact) => {
        if (contact.contactId === newMessage.senderUserId) {
          return {
            ...contact,
            lastMessage: newMessage,
            lastMessageTime: new Date(newMessage.sentTime),
          };
        }
        return contact;
      });
  
      return updatedContacts.sort(
        (a, b) => new Date(b.lastMessage.sentTime).getTime() - new Date(a.lastMessage.sentTime).getTime()
      );
    });
  }
  

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
        setAllContacts(result.result.sort((a, b) => 
          new Date(b.lastMessage.sentTime).getTime() - new Date(a.lastMessage.sentTime).getTime()
        ))
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
        navigate(`/chat/${contact.contactId}`, { replace: true })
      } else {
        console.log("Failed to fetch chat messages:", result.message)
      }
    } catch (error) {
      console.error('Error fetching chat messages:', error)
    }
  }

  const handleSendMessage = async (message: MessageModel) => {
    if (selectedChat) {
      updateChatAndContacts(message);
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
      }
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <Menu className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">Chats</h1>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFriendRequestsModalOpen(true)}
          >
            <UserPlus className="h-6 w-6" />
          </Button>
          <Link to="/profile">
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
              <AvatarFallback>{currentUser?.name.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className={`${isSidebarOpen ? 'block' : 'hidden'} md:block`}>
          <ContactsList contacts={allContacts} onSelectChat={handleChatSelect} />
        </div>

        <MainChatArea 
          selectedChat={selectedChat} 
          currentUser={currentUser} 
          onSendMessage={handleSendMessage}
        />
      </div>

      <FriendRequestsModal
        isOpen={isFriendRequestsModalOpen}
        reRender={() => {
          if (currentUser?.id) {
            fetchUserData(currentUser.id);
          }
        }}
        onClose={() => setIsFriendRequestsModalOpen(false)}
        currentUser={currentUser}
      />
    </div>
  )
}