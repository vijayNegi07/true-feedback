import React from 'react'
import { signIn } from '../actions/auth';
import { sendOtp } from '../actions/auth';
import Link from 'next/link';

function SignIn() {
  return (
    <div className='flex flex-col items-center justify-center h-screen gap-4'>
            <h1 className='text-2xl font-bold '>Sign Up</h1>
            <form action={signIn} className='flex flex-col gap-4 w-64'>
                <input type="text" name='email' placeholder='Email' required />
                <input type="password" name='password' placeholder='Passowrd' required />
                {/* <Link href={"/forget-passoword"}>Forgot passowrd?</Link> */}
                <button formAction={sendOtp}>Forgot password?</button>
                <button type='submit'>Sign Up</button>
            </form>
        </div>
  )
}

export default SignIn;