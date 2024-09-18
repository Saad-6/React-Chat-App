import { useEffect, useState } from 'react'
import { SearchResult } from './search-result'
import { Modal } from './modal'
import { APIResponse } from '../Interfaces/APIResponse'
import { SearchContactModel } from '../Interfaces/SearchContactModel'
import { jwtDecode } from 'jwt-decode'
import { SuccessToast } from '../Components/UI/SuccessToast'
import { FailureToast } from '../Components/UI/FailiureToast'
import { AddContactModel } from '../Interfaces/AddContactModel'
import { Button } from './UI/button'
import { Input } from './UI/input'


interface AddContactModalProps {
  isOpen: boolean
  onClose: () => void
}

interface DecodedToken {
  id: string
  name: string
  email: string
}

export function AddContactModal({ isOpen, onClose }: AddContactModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentUserId, setCurrentUserId] = useState('')
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [showErrorToast, setShowErrorToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [searchResult, setSearchResult] = useState<any | null>(null)
  const [noUserFound, setNoUserFound] = useState(false)
  const [isAddingContact, setIsAddingContact] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('jwtToken')
    
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token)
        setCurrentUserId(decoded.id)
      } catch (error) {
        console.error('Error decoding token:', error)
      }
    } else {
      console.log('No token found')
    }
  }, [])

  const handleSearch = async () => {
    const searchPayload: SearchContactModel = {
      EmailOrPhone: searchQuery,
      UserId: currentUserId,
    };
  
    const res = await fetch('https://localhost:7032/SearchContact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchPayload),
    });
  
    const result: APIResponse = await res.json();
  
    if (result.success) {
      console.log("Result is success ");
      if (result.result) {
        console.log("Result.Result exists")
        setSearchResult(result.result);
        setNoUserFound(false);
      } else {
        setSearchResult(null);
        setNoUserFound(true);
      }
    } else {
      console.log('Search failed');
      setShowErrorToast(true);
      setToastMessage("Search failed. Please try again.");
    }
  };

  const onAddContact = async (id: string): Promise<boolean> => {
    console.log("Add contact button clicked")
    if (isAddingContact) return false;
    setIsAddingContact(true);

    const model: AddContactModel = {
      SenderUserId: currentUserId,
      RecieverUserId: id
    }
    try {
      const res = await fetch('https://localhost:7032/SendRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(model),
      })
    
      const result: APIResponse = await res.json()
      
      if (result.result) {
        setShowSuccessToast(true)
        setToastMessage("Contact request sent!")
        return true
      } else {
        setShowErrorToast(true)
        setToastMessage("An error occurred while sending the request")
        return false
      }
    } catch (error) {
      console.error("Error adding contact:", error)
      setShowErrorToast(true)
      setToastMessage("An error occurred while sending the request")
      return false
    } finally {
      setIsAddingContact(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Contact">
      <div className="grid gap-4 py-4">
        <div className="flex items-center gap-4">
          <Input
            id="search"
            placeholder="Enter email or phone"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow"
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>
        {searchResult && (
          <SearchResult 
            currentUserId={currentUserId}
            result={searchResult} 
            onAddContact={onAddContact}
          />
        )}
        {noUserFound && (
          <p className="text-center text-gray-500">No users found</p>
        )}
        {showSuccessToast && <SuccessToast message={toastMessage} />}
        {showErrorToast && <FailureToast message={toastMessage} />}
      </div>
    </Modal>
  );
}