import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { Avatar, AvatarFallback, AvatarImage } from '../Components/UI/avatar'
import { Button } from '../Components/UI/button'
import { ArrowLeft, Mail, User, Shield } from 'lucide-react'
import { Input } from '../Components/UI/input'

interface UserModel {
    fullName: string,
    id: string,
    userName: string,
    email: string,
    role: string
}

interface DecodedToken {
  id: string;
  fullName: string;
  email: string;
}

export default function UserProfilePage() {
    console.log("Entered profile");
  const [user, setUser] = useState<UserModel | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('jwtToken')
    if (!token) {
      navigate("/login")
    } else {
      const decoded = jwtDecode<DecodedToken>(token)
      setUser({
        id: decoded.id,
        fullName: decoded.fullName,
        userName: decoded.fullName.toLowerCase().replace(' ', '.'), // Generate a username
        email: decoded.email,
        role: 'User' // Default role, adjust as needed
      })
    }
  }, [navigate])

  const handleSave = () => {
    // In a real application, you would save the changes to the backend here
    setIsEditing(false)
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative h-48 bg-blue-600">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 text-white"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </div>
        <div className="relative px-4 py-5 sm:px-6">
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
            <Avatar className="h-32 w-32 rounded-full ring-4 ring-white">
              <AvatarImage src="/placeholder.svg?height=128&width=128" alt={user.fullName} />
              <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
          <div className="mt-16 text-center">
            <h3 className="text-3xl font-bold text-gray-900">{user.fullName}</h3>
            <p className="mt-1 text-sm text-gray-500">@{user.userName}</p>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Mail className="mr-2 h-5 w-5" /> Email
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {isEditing ? (
                  <Input defaultValue={user.email} />
                ) : (
                  user.email
                )}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <User className="mr-2 h-5 w-5" /> Username
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {isEditing ? (
                  <Input defaultValue={user.userName} />
                ) : (
                  user.userName
                )}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Shield className="mr-2 h-5 w-5" /> Role
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{user.role}</dd>
            </div>
          </dl>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          {isEditing ? (
            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          ) : (
            <div className="flex justify-end">
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}