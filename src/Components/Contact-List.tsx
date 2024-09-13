
import { SearchComponent } from './Chat-Component';
import { ContactItem } from './Contact-item';


interface Contact {
  id: number;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
  lastMessage: string;
}

interface ContactsListProps {
  contacts: Contact[];
}

export function ContactsList({ contacts }: ContactsListProps) {
  return (
    <div className="bg-white w-full md:w-80 border-r border-gray-200 flex-shrink-0">
      <div className="p-4">
        <SearchComponent />
      </div>
      <div className="overflow-y-auto h-[calc(100vh-8rem)]">
        {contacts.map((contact) => (
          <ContactItem key={contact.id} contact={contact} />
        ))}
      </div>
    </div>
  )
}