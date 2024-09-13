import { CheckCircle } from 'lucide-react'

interface SuccessToastProps {
  message: string
}

export function FailureToast({ message }: SuccessToastProps) {
  return (
    <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in-up">
      <CheckCircle className="h-5 w-5" />
      <span>{message}</span>
    </div>
  )
}