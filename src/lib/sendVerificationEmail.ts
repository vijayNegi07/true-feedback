import { Resend } from 'resend';
import { ApiResponse } from '@/types/ApiResponse';
import VerificationEmail from '../../emails/VerificationEmails';

export async function sendVerificationEmail(
    email:string,
    username:string,
    verificationCode:string
):Promise<ApiResponse> {
    try {
        await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: email,
        subject: 'True Feedback -> Verification Email',
        react: VerificationEmail({username, otp:verificationCode}),
        });

        return {
            success:true,
            message:"Verification email sent successfully"
        }

    } catch (error) {
        console.log("Error sending email ->", error);
        
        return {
            success:false,
            message:"Failed to send email "
        }
        
    }
}






export const resend = new Resend(process.env.RESEND_API_KEY);