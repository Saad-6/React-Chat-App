import { Chat } from "./Chat";
import { Contact } from "./Contact";
import { Profile } from "./Profile";

export interface User  {
  id :  string;
    isOnline: boolean; 
    lastSeen: string; 
    name?: string; 
    contacts?: Contact[]; 
    chats?: Chat[]; 
    profile?: Profile; 
  }