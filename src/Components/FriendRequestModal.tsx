import { useState, useEffect } from 'react'
import { X, UserPlus, UserMinus } from 'lucide-react'
import { UserModel } from '../Interfaces/Collective-Interfaces'
import { Button } from './UI/button'
import { Avatar, AvatarFallback, AvatarImage } from './UI/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './UI/Dialog'
import { ScrollArea } from './UI/scroll-area'


interface FriendRequest {
  id: number
  name: string
  avatar: string
}

interface FriendRequestsModalProps {
  isOpen: boolean
  onClose: () => void
  currentUser: UserModel | null
  reRender?: () => void; 
}

export function FriendRequestsModal({ isOpen, onClose, currentUser ,reRender }: FriendRequestsModalProps) {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && currentUser) {
      fetchFriendRequests()
    }
  }, [isOpen, currentUser])

  const fetchFriendRequests = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`https://localhost:7032/FriendRequests`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Id: currentUser?.id }),
      })
      if (!response.ok) {
        throw new Error('Failed to fetch friend requests')
      }
      const data = await response.json()
      console.log("Server sent ", data)
      setFriendRequests(data.result)
      console.log("Friend Requests ", friendRequests)
    } catch (err) {
      setError('Failed to load friend requests. Please try again.')
      console.error('Error fetching friend requests:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAccept = async (id: number) => {
    try {
      const response = await fetch(`https://localhost:7032/FriendRequests/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })
      if (!response.ok) {
        throw new Error('Failed to accept friend request')
      }
      setFriendRequests(requests => requests.filter(request => request.id !== id))
      // call this function here
      if (reRender) {
        reRender();
      }
    } catch (err) {
      setError('Failed to accept friend request. Please try again.')
      console.error('Error accepting friend request:', err)
    }
  }

  const handleReject = async (id: number) => {
    try {
      const response = await fetch(`https://localhost:7032/FriendRequests/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })
      if (!response.ok) {
        throw new Error('Failed to reject friend request')
      }
      setFriendRequests(requests => requests.filter(request => request.id !== id))
    } catch (err) {
      setError('Failed to reject friend request. Please try again.')
      console.error('Error rejecting friend request:', err)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-2xl font-semibold">Friend Requests</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="absolute right-4 top-4">
            <X className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>
        <ScrollArea className="flex-grow py-6 px-4">
          {isLoading ? (
            <div className="text-center text-lg">Loading friend requests...</div>
          ) : error ? (
            <div className="text-center text-red-500 text-lg">{error}</div>
          ) : friendRequests.length === 0 ? (
            <div className="text-center text-gray-500 text-lg">No friend requests</div>
          ) : (
            <ul className="space-y-6">
              {friendRequests.map(request => (
                <li key={request.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12" >
                      <AvatarImage src={request.avatar} alt={request.name} />
                      <AvatarFallback>{request.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-lg" style={{margin:"0px 20px"}}>{request.name}</span>
                  </div>
                  <div className="space-x-3">
                    <Button size="sm" onClick={() => handleAccept(request.id)}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Accept
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleReject(request.id)}>
                      <UserMinus className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}