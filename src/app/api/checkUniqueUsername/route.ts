import { getClient } from "@/lib/dbConnect";
import {success, z} from "zod";
import { usernameValidation } from "@/schemas/inputValidation.schema";
import { NextResponse } from "next/server";
import { username } from "better-auth/plugins";


const usernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request:Request) {
    
    const db = await getClient();

    try {
        const {searchParams}= new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }

        const result = usernameQuerySchema.safeParse(queryParam);
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || [];
            return NextResponse.json({
                success:false,
                message: usernameErrors.length > 0 ? usernameErrors.join(",") : "Invalid Query params"
            },{status:502})
        }

        const {username} = result.data;

        const usersCollection = db.collection("user"); // Better Auth's default collection name

        const user = await usersCollection.findOne({name:username,emailVerified:true });

        if(user){
            return NextResponse.json({
            success:false,
            message:`${username} not available`
        },{status:500})
        }

        return NextResponse.json({
            success:true,
            message:"Username is unique"
        },{status:200})


    } catch (error) {
        console.log("Error username validation");
        return NextResponse.json({
            success:false,
            message:"Error username validation"
        },{status:500})
    }
}



