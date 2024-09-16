import { Chat } from "./Chats";
import { ContactList } from "./ContactList";
import { Profile } from "./Profile";

export interface User {
    id : string,
    isOnline: boolean;
    lastSeen: string;
    name: string | null;
    contacts: ContactList | null;
    chats: Chat[] | null;
    profile: Profile | null;
}