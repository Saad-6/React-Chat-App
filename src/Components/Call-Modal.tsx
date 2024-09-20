import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, X } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './UI/avatar'
import { Button } from './UI/button'

interface CallModalProps {
  isOpen: boolean
  onClose: () => void
  name: string
  avatar: string
  status : string
}

export function CallModal({ isOpen, onClose, name, avatar,status }: CallModalProps) {
  const [callStatus, setCallStatus] = useState('Calling...')

  useEffect(() => {
    if (isOpen) {
        const timer = setTimeout(() => {
            if(status === "Online"){
                
                setCallStatus('Ringing')
            }
        }, 3000)
        return () => clearTimeout(timer)
      }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            exit={{ y: 50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            <div className="p-8 text-center">
              <Avatar className="mx-auto mb-6 h-24 w-24 ring-4 ring-white">
                <AvatarImage src={avatar} alt={name} />
                <AvatarFallback>{name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="text-3xl font-bold text-white mb-2">{name}</h2>
              <p className="text-xl text-indigo-100 mb-8">{callStatus}</p>
              <div className="flex justify-center space-x-4">
                <Button
                  size="lg"
                  variant="destructive"
                  className="rounded-full h-16 w-16 bg-red-500 hover:bg-red-600 transition-colors duration-300"
                  onClick={onClose}
                >
                  <X className="h-8 w-8" />
                </Button>
              </div>
            </div>
            <div className="bg-indigo-900 bg-opacity-50 p-4">
              <div className="flex justify-between items-center text-indigo-100">
                <span>Call duration: 00:00</span>
                <span className="animate-pulse">
                  <Phone className="h-5 w-5" />
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}