import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  // Check if the request is for an admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Allow access to login page
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next()
    }
    
    // Get the token from the request
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    })
    
    // Check if user is authenticated and has admin role
    if (!token || !token.role || token.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
  ]
}
