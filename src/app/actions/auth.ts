"use server";

import { auth } from "@/lib/auth";
import next from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import * as z from "zod";
import { signUpValidation } from "@/schemas/inputValidation.schema";
import UserModel from "@/models/User.model";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";

export async function signUp(data: z.infer<typeof signUpValidation>) {
  const { email, password, username } = data;

  console.log(email, password, username);

  try {
    const authData = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: username,
      },
    });

    console.log("Better auth -> ", authData);
    
    // if (!authData.token) {
    //   return {
    //     success: false,
    //     message: "AuthFailed",
    //   };
    // }

    return {
      success: true,
      message: "User created",
      authData
    };
  } catch (error) {
    console.log("Better auth Sign Up failed! ", error);

    return {
      success: false,
      message: "Better auth Failed",
    };
  }
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  redirect("/");
}

export async function signOut(formData: FormData) {
  const user = await auth.api.signOut({
    headers: await headers(),
  });

  redirect("/");
}

export async function sendOtp(formData: FormData) {
  const email = formData.get("email") as string;

  await auth.api.requestPasswordResetEmailOTP({
    body: {
      email, // required
    },
  });

  redirect("/reset-password");
}

export async function checkValidOTP(formData: FormData) {
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

  redirect("/");
}

export async function resetPassword(formData: FormData) {
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

  redirect("/");
}
