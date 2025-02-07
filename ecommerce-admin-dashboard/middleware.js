import { NextResponse } from 'next/server';
import {getToken} from "next-auth/jwt"
 
export async function middleware(request) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const url = request.nextUrl
  const pathname = url.pathname; 

  //If logged in, prevent access to "/login" (Redirect to Dashboard)
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  //If NOT logged in, prevent access to "/dashboard" (Redirect to Login)
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
 
export const config = {
    matcher: [
        "/",
        "/login",
        "/dashboard/:path*"
    ],
};

