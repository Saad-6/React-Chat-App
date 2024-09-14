import { Message } from "./Message";

export interface  ContactModel{
    lastMessage : Message;
    chatId:number;
    id : number;
    contactEmail : string;
    contactPhone : string;
    contactId : string;
    contactName : string;
    contactPicture : string;
    status : string | null;
}