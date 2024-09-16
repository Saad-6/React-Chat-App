import React, { useState } from 'react'
import { Check } from 'lucide-react'
import { AddContactModel } from '../Interfaces/AddContactModel'
import { APIResponse } from '../Interfaces/APIResponse'
import { Button } from './UI/button'
import { Avatar, AvatarFallback, AvatarImage } from './UI/avatar'

interface SearchResultProps {
  result: {
    id: string
    name: string
    email: string
    avatar: string
  } | null
  currentUserId: string
  onAddContact: (id: string) => Promise<boolean>
}

export function SearchResult({ result, currentUserId, onAddContact }: SearchResultProps) {
  const [requestSent, setRequestSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAddContact = async () => {
    if (!result) return

    setIsLoading(true)
    setError(null)

    try {
      const model: AddContactModel = {
        SenderUserId: currentUserId,
        RecieverUserId: result.id
      }

      const res = await fetch('https://localhost:7032/SendRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(model),
      })

      const apiResponse: APIResponse = await res.json()

      if (apiResponse.success) {
        const success = await onAddContact(result.id)
        if (success) {
          setRequestSent(true)
        } else {
          setError("Failed to add contact")
        }
      } else {
        setError(apiResponse.message || "An error occurred while sending the request")
      }
    } catch (error) {
      console.error('Error adding contact:', error)
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (!result) {
    return <div className="p-4 bg-gray-50 rounded-md text-center">No user found</div>
  }

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={result.avatar} alt={result.name} />
          <AvatarFallback>{result.name ? result.name.charAt(0) : '?'}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{result.name || 'Unknown'}</h3>
          <p className="text-sm text-gray-500">{result.email || 'No email provided'}</p>
        </div>
      </div>
      
      <div className="relative w-[120px] h-[40px]">
        <Button
          onClick={handleAddContact}
          disabled={requestSent || isLoading}
          className={`w-full h-full absolute inset-0 transition-opacity duration-300 ${
            requestSent ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          {isLoading ? 'Sending...' : 'Send Request'}
        </Button>
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
          requestSent ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
          <Check className="text-green-500 w-6 h-6" />
        </div>
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  )
}