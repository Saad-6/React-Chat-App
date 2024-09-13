interface Message {
    id: number;
    content: string;
    sender: 'user' | 'other';
  }
  
  interface ChatMessagesProps {
    messages: Message[];
  }
  
  export function ChatMessages({ messages }: ChatMessagesProps) {
    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`rounded-lg py-2 px-4 max-w-[75%] md:max-w-md ${
              message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-gray-200 text-gray-800'
            }`}>
              {message.content}
            </div>
          </div>
        ))}
      </div>
    )
  }