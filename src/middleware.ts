import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  const { pathname } = request.nextUrl

  if (token && (
    pathname === "/" ||
    pathname === "/sign-in" ||
    pathname === "/sign-up" ||
    pathname === "/verify"
  )) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  if (!token && pathname.startsWith("/dashboard")) {
    const signInUrl = request.nextUrl.clone()
    signInUrl.pathname = "/sign-in"
    
    signInUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/",
    "/sign-in",
    "/sign-up",
    "/verify",
    "/dashboard/:path*"
  ],
}
