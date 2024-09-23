'use client'

import { useState, useCallback } from 'react'

interface CallState {
  isIncomingCall: boolean
  isOutgoingCall: boolean
  callStatus: 'idle' | 'ringing' | 'ongoing' | 'ended' | 'calling'
  callerName: string
  callerAvatar: string
  callerId: string
}

export function useCallHandling() {
  const [callState, setCallState] = useState<CallState>({
    isIncomingCall: false,
    isOutgoingCall: false,
    callStatus: 'idle',
    callerName: '',
    callerAvatar: '',
    callerId: '',
  })

  const initiateCall = useCallback(async (recipientId: string, SenderUserId:string, recipientName: string, recipientAvatar: string) => {
    try {
        console.log("rec id",recipientId,"cur id",SenderUserId);
      const response = await fetch('https://localhost:7032/Ring', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          SenderUserId: SenderUserId, // Replace with actual current user ID
          RecieverUserId: recipientId,
        }),
      })

      const result = await response.json()
      if (result.success) {
        setCallState({
          isIncomingCall: false,
          isOutgoingCall: true,
          callStatus: 'ringing',
          callerName: recipientName,
          callerAvatar: recipientAvatar,
          callerId: recipientId,
        })
      } else {
        setCallState({
            isIncomingCall: false,
            isOutgoingCall: true,
            callStatus: 'calling',
            callerName: recipientName,
            callerAvatar: recipientAvatar,
            callerId: recipientId,
          })
      }
    } catch (error) {
      console.error('Error making call:', error)
    }
  }, [])

  const handleIncomingCall = useCallback((callerName: string, callerAvatar: string, callerId: string) => {
    console.log("handleincpmong triggered");
    setCallState({
      isIncomingCall: true,
      isOutgoingCall: false,
      callStatus: 'ringing',
      callerName,
      callerAvatar,
      callerId,
    })
  }, [])

  const acceptCall = useCallback(() => {
    setCallState(prev => ({ ...prev, callStatus: 'ongoing' }))
  }, [])

  const endCall = useCallback(async () => {
    try {
      await fetch('https://localhost:7032/EndCall', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          SenderUserId: 'currentUserId', // Replace with actual current user ID
          RecieverUserId: callState.callerId 
        }),
      })

      setCallState(prev => ({ ...prev, callStatus: 'ended' }))
      
      setTimeout(() => {
        setCallState({
          isIncomingCall: false,
          isOutgoingCall: false,
          callStatus: 'idle',
          callerName: '',
          callerAvatar: '',
          callerId: '',
        })
      }, 2000)
    } catch (error) {
      console.log("An error occurred ending the call: ", error)
    }
  }, [callState.callerId])

  return {
    callState,
    initiateCall,
    handleIncomingCall,
    acceptCall,
    endCall,
  }
}