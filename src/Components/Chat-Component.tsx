import { Search } from 'lucide-react'
import { Input } from './UI/input'


export function SearchComponent() {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <Input type="text" placeholder="Search contacts" className="pl-10 w-full" />
    </div>
  )
}