import { Search, UserPlus } from 'lucide-react'

import { useState } from 'react'
import { AddContactModal } from './add-contact-modal'
import { Input } from './UI/input'
import { Button } from './UI/button'

export function SearchComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="relative flex items-center space-x-2">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input type="text" placeholder="Search contacts" className="pl-10 w-full" />
      </div>
      <Button variant="outline" size="icon" onClick={() => setIsModalOpen(true)}>
        <UserPlus className="h-4 w-4" />
        <span className="sr-only">Add Contact</span>
      </Button>
      <AddContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}