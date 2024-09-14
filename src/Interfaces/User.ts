import { Chat } from "./Chat";
import { Contact } from "./Contact";
import { Profile } from "./Profile";

export interface User  {
    isOnline: boolean; // Required boolean property with default value
    lastSeen: string; // Required Date property with default value
    name?: string; // Optional string property
    contacts?: Contact[]; // Optional array of Contact objects
    chats?: Chat[]; // Optional array of Chat objects
    profile?: Profile; // Optional Profile object
  }