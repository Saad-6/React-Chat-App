import { SearchComponent } from './Chat-Component'
import { ContactItem } from './Contact-item'
import { ContactModel } from '../Interfaces/ContactModel'

interface ContactsListProps {
  contacts: ContactModel[]
  onSelectChat: (contact: ContactModel) => void
}

export function ContactsList({ contacts, onSelectChat }: ContactsListProps) {
  return (
    <div className="bg-white w-full md:w-80 border-r border-gray-200 flex-shrink-0">
      <div className="p-4">
        <SearchComponent />
      </div>
      <div className="overflow-y-auto h-[calc(100vh-8rem)]">
        {contacts.map((contact) => (
          <ContactItem key={contact.contactId} contact={contact} onSelect={() => onSelectChat(contact)} />

        ))}
      </div>
    </div>
  )
}