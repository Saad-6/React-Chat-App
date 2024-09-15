import { Chat } from "./Chat";
import { User } from "./User";

export interface Message {
    content?: string; 
    senderUser?: User; 
    receiverUser?: User; 
    chatId?: number; 
    chat?: Chat; 
    sentTime: Date; 
    readTime: Date; 
    readStatus: boolean; 
  }