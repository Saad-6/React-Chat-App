import { useEffect, useState } from 'react'
import { SearchResult } from './search-result'
import { Modal } from './modal'
import { Button } from './UI/button'
import { Input } from './UI/input'
import { APIResponse } from '../Interfaces/APIResponse'
import { SearchContactModel } from '../Interfaces/SearchContactModel'
import {jwtDecode} from 'jwt-decode'; // Ensure correct import
import { SuccessToast } from '../Components/UI/SuccessToast';
import { FailureToast } from '../Components/UI/FailiureToast';
import { AddContactModel } from '../Interfaces/AddContactModel'
interface AddContactModalProps {
  isOpen: boolean
  onClose: () => void
}
interface DecodedToken {
    id: string; // Example claim
    name: string;
    email: string;
    // Add other fields based on your JWT payload
  }

export function AddContactModal({ isOpen, onClose }: AddContactModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentUserId,setCurrentUserId] = useState('');
  const [otherUserId,setOtherUserId] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [EmailOrPhone, setEmailOrPhone] = useState<SearchContactModel>({
    EmailOrPhone : ''
  })
  const [searchResult, setSearchResult] = useState<any | null>(null)

  useEffect(() => {
    // Fetch JWT token from localStorage
    const token = localStorage.getItem('jwtToken');
    
    if (token) {
      try {

        const decoded = jwtDecode<DecodedToken>(token); // Correct usage of jwtDecode
        setCurrentUserId(decoded.id);
        // You can now use the token, for example in API requests
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    } else {
      console.log('No token found');
    }
  }, []);
  const handleSearch = async () => {
    // Construct the payload directly
    const searchPayload: SearchContactModel = {
      EmailOrPhone: searchQuery,
    };
  
    const res = await fetch('https://localhost:7032/SearchContact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchPayload), // Use the local variable instead of state
    });
  
    const result: APIResponse = await res.json();
  
    if (result.success) {
      setSearchResult(result.result);
      setOtherUserId(result.result.id);
      console.log(otherUserId)
    } else {
      console.log('Search failed');
    }
  };
  const onAddContact = async () => {
    console.log("Add contact button cliced")
    const model : AddContactModel = {
        SenderUserId : currentUserId,
        RecieverUserId : otherUserId
    } ;
    const res = await fetch('https://localhost:7032/AddContact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(model), // Use the local variable instead of state
    });
  
    const result: APIResponse = await res.json();
    onClose(); 
    if(result.success){
setShowSuccessToast(true);
setToastMessage("Contact Added!");

    }else{
setShowErrorToast(true);
setToastMessage("An Error Occured");
    }
  };

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
          <SearchResult result={searchResult} onAddContact={() => {
            // Handle adding contact
            onAddContact();
            onClose()
          }} />
        )}
         {showSuccessToast && <SuccessToast message={toastMessage} />}
      {showErrorToast && <FailureToast message={toastMessage} />}
      </div>
    </Modal>
  )
}