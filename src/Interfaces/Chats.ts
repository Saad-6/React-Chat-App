import { Message } from "./Message";
import { User } from "./User";

export interface Chat  {
    id : number,
    participants: User[] | null;
    messages: Message[] | null;
}