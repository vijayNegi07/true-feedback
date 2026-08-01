import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.mode";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/lib/sendVerificationEmail";
import { NextResponse } from "next/server";
import crypto from 'crypto'



export async function Post(request:Request){
    

    try{
        await dbConnect();

        const{username, email, password} = await request.json();

        const userExists = await UserModel.findOne({username});

        if(userExists){
            //user exists
            //may is nor verified or is verified
            if(userExists.email != email){
                //the user exists but with the different email
                //means username is already taken
                return NextResponse.json({success:false, message:"Username is already taken! "})
            }
        }

        //from above it can be said
        //1) the user is first timer
        //2) the user with username and email exists -> may be not verified, or verified
        //3) the user doesnot exists with the username but may exist with the email (wants to update its credentials)

        const userExistsWithEmail = await UserModel.findOne({email});


        const verificationCode = crypto.randomInt(100000, 1000000).toString();
        const codeExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        const hashedPassword = await bcrypt.hash(password, 10);

        if(userExistsWithEmail){
            if(userExistsWithEmail.isVerified){
                //return the user
                return NextResponse.json(
                { success: false, message: "Could not create account with these details." },
                { status: 409 }
                );
            }

            //its clear that the user is not verified 
            //want to verify or update its detail
            if(userExistsWithEmail.username != username){
                //want to change the username and then verify

                //check if mandatory for the new username -> may an account exists with that username
                const usernameTaken = await UserModel.find({username, _id: { $ne: userExistsWithEmail._id },});
                if(usernameTaken){
                    return NextResponse.json({
                        success:false,
                        message:"Username is already taken"
                    },{status:409})
                }

                userExistsWithEmail.username = username;
            }

            //the user only wants to verify and not update the username
            userExistsWithEmail.verifyCode = verificationCode;
            userExistsWithEmail.verifyCodeExpiry = codeExpiry;
            userExistsWithEmail.password = hashedPassword;
            await userExistsWithEmail.save();

        }else{
            const newUser = await UserModel.create({
                username,
                email,
                password:hashedPassword,
                verifyCode:verificationCode,
                verifyCodeExpiry:codeExpiry,
                isAcceptingMessage:true,
                isVerified:false,
                message:[]
            })

            try {
                await newUser.save();
            } catch (err: any) {
                // Unique index race: two concurrent signups slipped past the findOne
                // checks above and both tried to insert. Mongo duplicate key = 11000.
                if (err?.code === 11000) {
                    return NextResponse.json(
                        { success: false, message: "Username or email already in use." },
                        { status: 409 }
                    );
                }
            throw err;
            }
        }

        const emailResponse = await sendVerificationEmail(email, username, password)

        if(!emailResponse.success){
            return NextResponse.json(
                {success:false, message: "Account created, but we couldn't send the verification email. Please request a new code."},{status:500})
        }

        return NextResponse.json(
            {success:false, message: "User created successfully. Please verify your email."},{status:201})

        
    } catch (error) {
        console.log("Error while creating user account! ", error);
        return Response.json({
            success:false,
            message:"User account creation failed! "
        },{status:500})
        
    }
}