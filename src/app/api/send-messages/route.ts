import { authClient } from "@/lib/auth-client"
import { connectDB } from "@/lib/dbConnect"
import { NextResponse } from "next/server";
import UserModel from "@/models/User.model";
import { Message } from "@/models/User.model";

export async function POST(request: Request) {
    connectDB();
   
    try {
        console.log("here at post");
        
        const{username, title, body} = await request.json();
        console.log(username, title, body);
        
        const user = await UserModel.findOne(username);

        if(!user){
            console.log("User not found");
            
            return NextResponse.json({
            success:false,
            message:"User not found",
        },{status:404});
        }

        if(!user.isAcceptingMessage){
            return NextResponse.json({
            success:false,
            message:"User not accepting messages",
        },{status:404});
        }

        const message = {title,description:body, createdAt: new Date()}

        user.message.push(message as Message);
        await user.save();

        return NextResponse.json({
            success:true,
            message:"Message sent to user",
        },{status:200});


    } catch (error) {
        console.log("There is some error while sending messages ", error);
        return NextResponse.json({success:false, message:"Message sent failed"},{status:500});
    }    
}