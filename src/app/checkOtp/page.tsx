import React from 'react'
import { checkValidOTP } from '../actions/auth';

function CheckOtp() {
  return (
    <div className='flex flex-col items-center justify-center h-screen gap-4'>
                <h1 className='text-2xl font-bold '>Sign Up</h1>
                <form action={checkValidOTP} className='flex flex-col gap-4 w-64'>
                    <input type="text" name='email' placeholder='Email' required />
                    <input type="text" name='otp' placeholder='OTP' required />
                    <button type='submit'>Verfify</button>
                </form>
            </div>
  )
}

export default CheckOtp;