import { Message } from "@/models/User.mode";

export interface ApiResponse{
    success:boolean,
    message:string,
    isAcceptingMessage?:boolean,
    messages?:Array<Message>
}