import { Message } from "./Message";

export interface ContactModel {
    contactId: string;
    contactName: string;
    contactEmail: string;
    contactPicture: string;
    lastMessage: Message;
    lastMessageTime: Date;
    readTime: Date | null; // Allow null for readTime
    status: string | null;
  }