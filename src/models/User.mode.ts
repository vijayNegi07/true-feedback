import mongoose,{Schema, Document} from "mongoose";
import { string } from "zod";
import { tr } from "zod/locales";

export interface Message extends Document{
    content:string,
    createdAt:Date,
}

const MessageSchema: Schema<Message> = new Schema({
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    }
})

export interface User extends Document{
    username:string,
    password:string,
    email:string,
    verifyCode:string,
    verifyCodeExpiry:Date,
    isVerified:Boolean,
    isAcceptingMessage:Boolean,
    message:Message[]

}

const UserSchema: Schema<User> = new Schema({
    username:{
        type:String,
        required:[true, "Username is required"],
        unique:true,
        trim:true
    },
    email:{
        type:String,
        required:[true, "Email is required"],
        unique:true,
        match:[/^[^@]+@[^@]+\.[^@]+$/,"Email must be valid"]
    },
    password:{
        type:String,
        required:[true, "Password is required"],
    },
    verifyCode:{
        type:String,
        required:[true, "Verify Code is required"],
        unique:true,
    },
    verifyCodeExpiry:{
        type:Date,
        required:true,
    },
    isAcceptingMessage:{
        type:Boolean,
        default:true
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    message:[MessageSchema]

})



const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

export default UserModel;