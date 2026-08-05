import { authClient } from "@/lib/auth-client"
import { connectDB } from "@/lib/dbConnect"
import { NextResponse } from "next/server";
import UserModel from "@/models/User.model";


export async function POST(request: Request) {

    connectDB();
    const { data: session } = await authClient.getSession()

    if (!session || !session.user) {
        //no active user
        return NextResponse.json({success:false, message:"User not authenticated"},{status:500});
    }

    try {
         const userId = session?.user.id;

        const {acceptingMessageStatus} = await request.json();

        const user = await UserModel.findByIdAndUpdate(userId, 
            {isAcceptingMessage:acceptingMessageStatus},
            {new:true}
        )

        if(!user){
            return NextResponse.json({
            success:false,
            message:"User accepting messages status updation failed",
        },{status:200});
        }

        return NextResponse.json({
            success:true,
            message:"Accepting Message status updated",
            user
        },{status:200});


    } catch (error) {
        console.log("There is some error while updating user accepting message status, ", error);
        return NextResponse.json({});
    }

    
}

export async function GET(request: Request) {

    connectDB();
    const { data: session } = await authClient.getSession()

    if (!session || !session.user) {
        //no active user
         return NextResponse.json({success:false, message:"User not authenticated"},{status:500});
    }

    try {
        const userId = session?.user.id;

        const user = await UserModel.findById(userId);

        if(!user){
            return NextResponse.json({
            success:false,
            message:"User not found",
        },{status:404});
        }

        return NextResponse.json({
            success:true,
            message:"User found and status fetched successfully",
            isAcceptingMessage: user.isAcceptingMessage
        },{status:200});


    } catch (error) {
        console.log("There is some error while updating user accepting message status, ", error);
        return NextResponse.json({success:false, message:"User accepting message status fetch failed"},{status:500});
    }

    
}