import mongoose,{Schema, Document} from "mongoose";
import { string } from "zod";
import { tr } from "zod/locales";

export interface Message extends Document{
    title:string,
    description:string,
    createdAt:Date,
}


const MessageSchema: Schema<Message> = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    }
})

export interface User extends Document{
    userId:mongoose.Types.ObjectId,
    username:string,
    isAcceptingMessage:Boolean,
    message:Message[]

}

const UserSchema: Schema<User> = new Schema({
    userId: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
  },

  username: {
    type: String,
    required: true,
    unique: true,
  },
    isAcceptingMessage:{
        type:Boolean,
        default:true
    },
    message:[MessageSchema]

})



const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

export default UserModel;