import { Message } from "./Message";
import { User } from "./User";

export interface Chat {
    participants?: User[]; // Optional array of User objects
    messages?: Message[]; // Optional array of Message objects
  }