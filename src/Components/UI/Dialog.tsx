import React, { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <div className="z-50 bg-white rounded-lg shadow-lg">{children}</div>
    </div>,
    document.body
  )
}

interface DialogContentProps {
  className?: string;
  children: ReactNode;
}

export const DialogContent: React.FC<DialogContentProps> = ({ className = '', children }) => (
  <div className={`relative p-6 ${className}`}>
    {children}
  </div>
)

interface DialogHeaderProps {
  className?: string;
  children: ReactNode;
}

export const DialogHeader: React.FC<DialogHeaderProps> = ({ className = '', children }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
)

interface DialogTitleProps {
  className?: string;
  children: ReactNode;
}

export const DialogTitle: React.FC<DialogTitleProps> = ({ className = '', children }) => (
  <h2 className={`text-lg font-semibold ${className}`}>
    {children}
  </h2>
)

interface DialogCloseProps {
  onClose: () => void;
}

export const DialogClose: React.FC<DialogCloseProps> = ({ onClose }) => (
  <button
    onClick={onClose}
    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
  >
    <X className="h-4 w-4" />
    <span className="sr-only">Close</span>
  </button>
)