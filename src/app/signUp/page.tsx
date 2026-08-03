import React from 'react'
import { signUp } from '../actions/auth';

function SignUpPage() {
  return (
    <div className='flex flex-col items-center justify-center h-screen gap-4'>
        <h1 className='text-2xl font-bold '>Sign Up</h1>
        <form action={signUp} className='flex flex-col gap-4 w-64'>
            <input type="text" name='email' placeholder='Email' required />
            <input type="text" name='name' placeholder='Name' required />
            <input type="password" name='password' placeholder='Password' required />
            <button type='submit'>Sign Up</button>
        </form>
    </div>
  )
}

export default SignUpPage;