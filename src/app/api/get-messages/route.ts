import { authClient } from "@/lib/auth-client"
import { connectDB } from "@/lib/dbConnect"
import { NextResponse } from "next/server";
import UserModel from "@/models/User.model";
import mongoose from "mongoose";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";


export async function GET(request: Request) {

    connectDB();
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session || !session.user) {
        //no active user
         return NextResponse.json({success:false, message:"User not authenticated"},{status:500});
    }

    try {
        const userId = new mongoose.Types.ObjectId(session?.user.id);
        
        const user = await UserModel.aggregate([
            {$match: {userId: userId}},
            {$unwind: "$message"},
            {$sort: {"message.createdAt" : -1}},
            {$group: {_id:"$_id", messages:{$push: "$message"}}} 
        
        ])
        

        if(!user || user.length === 0){
            return NextResponse.json({
            success:false,
            message:"User not found",
        },{status:404});
        }

        return NextResponse.json({
            success:true,
            message:"User found",
            messages: user[0].messages
        },{status:200});


    } catch (error) {
        console.log("There is some error while fetching user messages ", error);
        return NextResponse.json({success:false, message:"User messages fetching failed"},{status:500});
    }    
}