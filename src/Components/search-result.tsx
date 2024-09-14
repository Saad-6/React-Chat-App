import { Avatar, AvatarFallback, AvatarImage } from "./UI/avatar"
import { Button } from "./UI/button"

interface SearchResultProps {
  result: {
    id: number
    name: string
    email: string
    avatar: string
  }
  onAddContact: () => void
}

export function SearchResult({ result, onAddContact }: SearchResultProps) {
    
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={result.avatar} alt={result.name} />
          <AvatarFallback>{result.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{result.name}</h3>
          <p className="text-sm text-gray-500">{result.email}</p>
        </div>
      </div>
      <Button onClick={onAddContact}>Add</Button>
    </div>
  )
}