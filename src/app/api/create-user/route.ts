
import { connectDB } from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { auth } from "@/lib/auth";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { signUp } from "@/app/actions/auth";


export async function POST(request:Request){
    connectDB();

    const {userId, username, email, password} = await request.json();

    try {

        const betterAuthRes = await signUp({email,username,password});

        if(!betterAuthRes.success){
            return NextResponse.json({success:false,message:"Better Auth failed! " }, {status:500});
        }        

        const ID = new mongoose.Types.ObjectId(betterAuthRes.authData?.user.id);

        const user = await UserModel.create({userId:ID, username});

        if(!user){
            return NextResponse.json({success:false, message:"User creation failed! USER->MODEL "}, {status:500});
        }


        return NextResponse.json({success:true, message:"User created"},{status:200});

    } catch (error) {
        console.log("There is some error while creating own user", error);
        
        return NextResponse.json({success:false, message:"User creation failed! USER->MODEL "}, {status:500});
    }

    



}