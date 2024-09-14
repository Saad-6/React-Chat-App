export interface SendMessageResponse {
    messageId: number;
    chatId: number;
    sentTime: string;
  }
  
  // Add this to your existing ApiResponse type
  export interface ApiResponse<T> {
    result: T;
    success: boolean;
    message?: string;
  }
  
  export interface UserModel {
    id: string;
    name: string;
    isOnline: boolean;
    lastSeen: string;
  }
  
  export interface MessageModel {
    id: number;
    content: string;
    senderUserId: string;
    receiverUserId: string;
    sentTime: string;
    readTime: string;
    readStatus: boolean;
  }
  
  export interface ChatResponseModel {
    chatId: number;
    participants: UserModel[];
    messages: MessageModel[];
  }