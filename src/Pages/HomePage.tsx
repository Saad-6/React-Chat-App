import { useEffect, useState } from 'react'
import { LogOut, Menu, UserPlus } from 'lucide-react'
import { ContactsList } from '../Components/Contact-List'
import { jwtDecode } from 'jwt-decode'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ContactModel } from '../Interfaces/ContactModel'
import { ApiResponse, ChatResponseModel, MessageModel, UserModel } from '../Interfaces/Collective-Interfaces'
import { FriendRequestsModal } from '../Components/FriendRequestModal'
import { Button } from '../Components/UI/button'
import { Avatar, AvatarFallback, AvatarImage } from '../Components/UI/avatar'
import { MainChatArea } from '../Components/Main-Chat'
import { IncomingCallModal } from '../Components/Incoming-call-modal'

interface DecodedToken {
  id: string;
  fullName: string;
  email: string;
}

export default function HomePage() {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [allContacts, setAllContacts] = useState<ContactModel[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatResponseModel | null>(null);
  const [currentUser, setCurrentUser] = useState<UserModel | null>(null);
  const [isFriendRequestsModalOpen, setIsFriendRequestsModalOpen] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { chatId } = useParams<{ chatId: string }>();
  const [incomingCall, setIncomingCall] = useState<{ Name: string; Avatar: string , OtherUserId : string } | null>(null);
  const [callModalOpen,setCallModalOpen] = useState(false);
  const [isCallRejected, setIsCallRejected] = useState(false)
  // Check If the user is logged in
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
      })
      fetchUserData(decoded.id)
    }
  }, [navigate]);
  // when a chat is selected and the user relaods , it should open the same chat
  useEffect(() => {
    if (currentUser && allContacts.length > 0 && chatId) {
      const contact = allContacts.find(c => c.contactId === chatId)
      if (contact) {
        handleChatSelect(contact)
      }
    }
  }, [currentUser, allContacts, chatId]);

  // Initialiye WebSocket Connection and Only when currentUser is set
  useEffect(() => {
    if (currentUser) {
      setIsLoading(false);
      initializeWebSocket(currentUser.id)
    }
  }, [currentUser]);
  useEffect(()=>{
   console.log("Call modal open : ",callModalOpen);
  },[callModalOpen])
  // Initiate the socket connection by sending userId as the parameter
  const initializeWebSocket = (userId: string) => {
        
    const newSocket = new WebSocket(`wss://localhost:7032/ws?userId=${userId}`)

    console.log("Web socket connection established")
    
    setSocket(newSocket)

    // This is where the message from the server is received
    newSocket.onmessage = (event) => {
        const payload = JSON.parse(event.data)
        console.log("Message received from websocket: ", payload)

        if (!currentUser) {
          console.log("currentUser is not set yet")
          return
        }
            // This means the other user sent a message and is received here in real time
        if (payload.type === "message") {
          const messageData: MessageModel = payload.data
          updateChatAndContacts(messageData)
        } 
           // This means the other user sent a message for the first time so we re-render the contact list essentially showing the message
        else if (payload.type === "thumbnaillist") {
          if (currentUser.id) {
            console.log("user id exists, about to call fetchData")
            fetchUserData(currentUser.id)
          }
        }
           // This means the other user sent a call request so we show the incoming call modal
        else if (payload.type === "call") {
          // Handle incoming call
          setIncomingCall(payload.data)
        }
        else if (payload.type === "endcall") {
          console.log("Call rejected by user")
          setIsCallRejected(true)
          setTimeout(() => {
            setCallModalOpen(false)
            setIsCallRejected(false)
          }, 2000)
         
        }
    }
    // When the socket connection is closed , keep trying to reconnect after a small delay
    newSocket.onclose = () => {
      console.log("WebSocket connection closed")
      setTimeout(() => initializeWebSocket(userId), 5000)
    }

    return () => {
      if (newSocket.readyState === WebSocket.OPEN) {
        newSocket.close()
      }
    }
  }
  // Call accepted
  const handleAcceptCall = () => {
    console.log("Call accepted")
    setIncomingCall(null)
    setCallModalOpen(true)
  }

  const handleDeclineCall = () => {
    console.log("Call declined")
    rejectCall()
    setIncomingCall(null)
  }
  // When this user sends a message , update that message locally in the local message and thumbnail states
  const updateChatAndContacts = (newMessage: MessageModel) => {
    setSelectedChat((prevChat) => {
      if (prevChat && (prevChat.participants[0].id === newMessage.senderUserId || prevChat.participants[1].id === newMessage.senderUserId)) {
        return {
          ...prevChat,
          messages: [...prevChat.messages, newMessage]
        }
      }
      return prevChat
    })

    setAllContacts((prevContacts) => {
      let updatedContacts = prevContacts.map((contact) => {
        if (contact.contactId === newMessage.senderUserId || contact.contactId === newMessage.receiverUserId) {
          return {
            ...contact,
            lastMessage: newMessage,
            lastMessageTime: new Date(newMessage.sentTime),
          }
        }
        return contact
      })
      return updatedContacts.sort(
        (a, b) => new Date(b.lastMessage?.sentTime || 0).getTime() - new Date(a.lastMessage?.sentTime || 0).getTime()
      )
    })
  }
  // Fetched the current user's contacts and their last messages , basically the thumbnails for all user chats
  const fetchUserData = async (userId: string) => {
    try {
      console.log("in fetch data with userId >", userId)
      const res = await fetch('https://localhost:7032/GetChatThumbnails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Id: userId }),
      });
      const result: ApiResponse<ContactModel[]> = await res.json();
      if (result.success) {
        setAllContacts(result.result.sort((a, b) =>
          new Date(b.lastMessage?.sentTime || 0).getTime() - new Date(a.lastMessage?.sentTime || 0).getTime()
        ))
      } else {
        console.log("Result not success:", result.message);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }
  // This triggers when the user clicks on one of the chat thumbnails, so we actually fetch that chat 
  const handleChatSelect = async (contact: ContactModel) => {
    if (!currentUser) return
    try {
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
        setSelectedChat(result.result)
        navigate(`/chat/${contact.contactId}`, { replace: true })
      } else {
        console.log("Failed to fetch chat messages:", result.message)
      }
    } catch (error) {
      console.error('Error fetching chat messages:', error)
    }
  }
  // Update message locally
  const handleSendMessage = async (message: MessageModel) => {
    if (selectedChat) {
      updateChatAndContacts(message)
     // if (socket && socket.readyState === WebSocket.OPEN) {
       // socket.send(JSON.stringify(message))
     // }
    }
  }
  const rejectCall = async () =>{
    try{
      const res = await fetch('https://localhost:7032/EndCall', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ SenderUserId: currentUser?.id , RecieverUserId : incomingCall?.OtherUserId}),
      });

    }catch(error){
      console.log("An error occured rejecting the call : ",error);
    }
  }
  // Logout
  const handleLogout = () => {
    localStorage.removeItem('jwtToken')
    navigate('/login')
  }
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
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
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-6 w-6" />
          </Button>
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
          callModalOpen={callModalOpen}
          isCallRejected={isCallRejected}
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
     <IncomingCallModal
        isOpen={!!incomingCall}
        onAccept={handleAcceptCall}
        onDecline={handleDeclineCall}
        name={incomingCall?.Name || ''}
        avatar={incomingCall?.Avatar || ''}
      />
    </div>
  
  )
}