import {betterAuth} from "better-auth"
import { getClient} from "./dbConnect"
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { emailOTP } from "better-auth/plugins";
import { sendVerificationEmail } from "./sendVerificationEmail";

const client = await getClient();

export const auth = betterAuth({
    database:mongodbAdapter(client),
    emailAndPassword:{
        enabled:true
    },
    user: {
        deleteUser: { 
            enabled: true
        } 
    },
    baseURL: process.env.BETTER_AUTH_URL,
    trustedOrigins: [
        "https://true-feedback-dubt.vercel.app",
        "http://localhost:3000", // keep local dev working too
    ],
    plugins:[
       
        emailOTP({
            async sendVerificationOTP({email, otp, type}){
                if (type === "sign-in") { 
                    // Send the OTP for sign in
                } else if (type === "email-verification") { 
                    sendVerificationEmail(email, "vijay", otp)
                } else { 
                    sendVerificationEmail(email, "vijay", otp)
                } 
            }
        }),
         nextCookies(),
    
    ]
})