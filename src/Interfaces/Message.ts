import { Chat } from "./Chat";
import { User } from "./User";

export interface Message {
    content?: string; // Optional string property
    senderUser?: User; // Optional User object
    receiverUser?: User; // Optional User object
    chatId?: number; // Optional number property
    chat?: Chat; // Optional Chat object
    sentTime: Date; // Required Date property with default value of current time
    readTime: Date; // Date property
    readStatus: boolean; // Boolean property with default value of false
  }