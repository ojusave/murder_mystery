import { NextResponse } from 'next/server'

export async function middleware() {
  // For NextAuth v4, we'll handle authentication in the API routes
  // This middleware just ensures the admin routes exist
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
  ]
}
