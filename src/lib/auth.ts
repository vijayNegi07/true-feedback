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
    plugins:[
       
        emailOTP({
            async sendVerificationOTP({email, otp, type}){
                if (type === "sign-in") { 
                    // Send the OTP for sign in
                } else if (type === "email-verification") { 
                    // Send the OTP for email verification
                } else { 
                    sendVerificationEmail(email, "vijay", otp)
                } 
            }
        }),
         nextCookies(),
    
    ]
})