"use server"

import { auth } from "@/lib/auth";
import next from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function signUp(formData:FormData){
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    const password = formData.get("password") as string;

    console.log(email, password, name);
    
    await auth.api.signUpEmail({
        body:{
            email, 
            password,
            name
        }
    })

    redirect("/")
}

export async function signIn(formData:FormData){
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;


    await auth.api.signInEmail({
        body:{
            email, 
            password
        }
    })

    redirect("/")
}

export async function signOut(formData:FormData){
    const user = await auth.api.signOut({
        headers : await headers()
    })

    redirect("/")
}

export async function sendOtp(formData:FormData){
    const email = formData.get("email") as string;

   await auth.api.requestPasswordResetEmailOTP({
        body: {
            email, // required
        },
    });

    redirect("/reset-password")
}

export async function checkValidOTP(formData:FormData){
    const email = formData.get("email") as string;
    const otp = formData.get("otp") as string;


    await auth.api.checkVerificationOTP({
    body: {
        email, // required
        type: "forget-password", // required
        otp, // required
    },
});

    console.log("valid Otp");

    const password = formData.get("password") as string;

    await auth.api.resetPasswordEmailOTP({
    body: {
        email, // required
        otp, // required
        password, // required
    },
});

redirect("/")
    
    
}

export async function resetPassword(formData : FormData){
    const email = formData.get("email") as string;
    const otp = formData.get("otp") as string;
    const password = formData.get("password") as string;

    await auth.api.resetPasswordEmailOTP({
    body: {
        email, // required
        otp, // required
        password, // required
    },
});

redirect("/")
}