import { authClient } from "@/lib/auth-client"
import { connectDB } from "@/lib/dbConnect"
import { NextResponse } from "next/server";
import UserModel from "@/models/User.model";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import mongoose from "mongoose";


export async function POST(request: Request) {
    console.log("hello");
    
    connectDB();
    const session = await auth.api.getSession({
        headers: await headers() // some endpoints might require headers
    })

    if (!session || !session.user) {
        //no active user
        return NextResponse.json({success:false, message:"User not authenticated"},{status:500});
    }

    try {
         const userId = new mongoose.Types.ObjectId(session?.user.id);

        const {acceptingMessageStatus} = await request.json();

        const firstUser = await UserModel.findOneAndUpdate({userId},{isAcceptingMessage:acceptingMessageStatus},
            {new:true})

        // const user = await UserModel.findByIdAndUpdate({userId}, 
        //     {isAcceptingMessage:acceptingMessageStatus},
        //     {new:true}
        // )

        if(!firstUser){
            return NextResponse.json({
            success:false,
            message:"User accepting messages status updation failed",
        },{status:200});
        }

        
        
        return NextResponse.json({
            success:true,
            message:"Accepting Message status updated",
            firstUser
        },{status:200});


    } catch (error) {
        console.log("There is some error while updating user accepting message status, ", error);
        return NextResponse.json({});
    }

    
}

export async function GET(request: Request) {

    connectDB();
    const session = await auth.api.getSession({
        headers: await headers() // some endpoints might require headers
    })
   
    

    if (!session || !session.user) {
        //no active user
        
         return NextResponse.json({success:false, message:"User not authenticated"},{status:500});
    }

    try {
        const id = session?.user.id;
        const userId = new mongoose.Types.ObjectId(id);

        const user = await UserModel.findOne({userId});

        if(!user){
            console.log("User is not there");
            
            return NextResponse.json({
            success:false,
            message:"User not found",
        },{status:404});
        }

        console.log(user.isAcceptingMessage);
        
        return NextResponse.json({
            success:true,
            message:"User found and status fetched successfully",
            isAcceptingMessage: user.isAcceptingMessage
        },{status:200});


    } catch (error) {
        console.log(session);
        console.log("There is some error while fetching user accepting message status, ", error);
        return NextResponse.json({success:false, message:"User accepting message status fetch failed"},{status:500});
    }

    
}