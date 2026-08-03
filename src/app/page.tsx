import Image from "next/image";
import {auth} from "../lib/auth"
import { headers } from "next/headers";
import Link from "next/link";
import { signOut } from "./actions/auth";


export default async function Home() {

  const session = await auth.api.getSession({
    headers: await headers()
  })

 if(!session){
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-4xl font-bold">Test</h1>
      <div className="flex gap-4 mt-8">
        <button>
          <Link href="/signUp">SignUp</Link>
        </button>
        <button>
          <Link href="/signIn">SignIn</Link>
        </button>
      </div>
    </div>
  )
 }

 return (
  <div className='flex flex-col items-center justify-center h-screen gap-4'>
          <h1 className='text-2xl font-bold '>Sign Up</h1>
          <div className="mt-8 text-center">
            <p className="text-lg mb-4"> User Id : {session.user.id}</p>
            <form action={signOut} className='flex flex-col gap-4 w-64'>
              <button type='submit'>Sign Out</button>
          </form>
          </div>
          
      </div>
 )
}
