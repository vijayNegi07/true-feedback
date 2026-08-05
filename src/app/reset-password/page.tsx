'use client'
import React, { useState } from 'react'
import { resetPassword } from '../actions/auth';

import { authClient } from '@/lib/auth-client';

function ResetPassoword() {
      const [valid, setValid] = useState(false);

    async function checkValid(formData:FormData) {
        const email = formData.get("email") as string;
        const otp = formData.get("otp") as string;
        
        const { data, error } = await authClient.emailOtp.checkVerificationOtp({
            email, // required
            type: "forget-password", // required
            otp, // required
        });

        setValid(true);

    }

    async function checkValidOTP(formData:FormData) {
        const password = formData.get("password") as string;
        const email = formData.get("email") as string;
        const otp = formData.get("otp") as string;

        const { data, error } = await authClient.emailOtp.resetPassword({
        email, // required
        otp, // required
        password, // required
    });
    }

  

  return (
    <div className='flex flex-col items-center justify-center h-screen gap-4'>
                <h1 className='text-2xl font-bold '>Sign Up</h1>
                <form action={checkValidOTP} className='flex flex-col gap-4 w-64'>
                    <input type="text" name='email' placeholder='Email' required />
                    <input type="text" name='otp' placeholder='OTP' required />
                    {!valid ? (
                        <button formAction={checkValid}>Valid OTP</button>
                    ):(
                    <div>
                        <input type="password" name='password' placeholder='Passowrd' required />
                    
                        <button type='submit'>Reset</button>
                    </div>
                    )}
                </form>
            </div>
  )
}

export default ResetPassoword;