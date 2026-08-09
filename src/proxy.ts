import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from './lib/auth'
import { headers } from 'next/headers';
 
// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {

    const session = await auth.api.getSession({
        headers: await headers()
    });

    const isAuthenticated = !!session;
  const pathname = request.nextUrl.pathname;

  // Authenticated users shouldn't see auth pages
  if (
    isAuthenticated &&
    (pathname === "/signUp" || pathname === "/sigIn" )
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Unauthenticated users shouldn't access dashboard
  if (!isAuthenticated && pathname === "/dashboard") {
    return NextResponse.redirect(new URL("/signIn", request.url));
  }

  return NextResponse.next();
}
 
export const config = {
  matcher: ["/signUp",
            "/signIn",
            "/dashboard",

  ],
}