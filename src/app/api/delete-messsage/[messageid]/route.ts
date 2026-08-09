import { authClient } from "@/lib/auth-client"
import { connectDB } from "@/lib/dbConnect"
import { NextResponse } from "next/server";
import UserModel from "@/models/User.model";
import mongoose from "mongoose";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";


export async function DELETE(request: Request,  { params }: { params: Promise<{ messageid: string }> }) {

    
    const { messageid } = await params;

  console.log("Message ID:", messageid);
    
    const messageId = new mongoose.Types.ObjectId(messageid);

    console.log("message Id", messageId);
    

   

    connectDB();
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session || !session.user) {
        console.log("user  nahi h->");
        
        //no active user
         return NextResponse.json({success:false, message:"User not authenticated"},{status:500});
    }

    try {
        const userId = new mongoose.Types.ObjectId(session?.user.id);

        console.log("user id hai-> ", userId);
        

        const updateRes = await UserModel.updateOne(
            {userId:userId},
            {$pull:{message:{_id:messageId}}} 
        )

        console.log("User is fetched", updateRes.matchedCount);
        
        if(updateRes.modifiedCount == 0){
            console.log("not found message");
            
            return NextResponse.json({
            success:false,
            message:"Message Deletion failed",
        },{status:500});
        }

        return NextResponse.json({
            success:true,
            message:"Message Delete Success",
        },{status:200});


    } catch (error) {
        console.log("There is some error while fetching user messages ", error);
        return NextResponse.json({
            success:false,
            message:"Message Deletion failed",
        },{status:500});
    }
}