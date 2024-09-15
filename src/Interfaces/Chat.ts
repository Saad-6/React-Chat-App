import { Message } from "./Message";
import { User } from "./User";

export interface Chat {
    participants?: User[]; 
    messages?: Message[]; 
  }