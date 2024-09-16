import { User } from "./User";


export interface ContactList {
    id : number,
    owner: User | null;
    contacts: User[] | null;
}