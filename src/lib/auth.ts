import NextAuth from 'next-auth/next'
import CredentialsProvider from 'next-auth/providers/credentials'
import * as bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
// import NextAuthJWT from 'next-auth/jwt'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Check against environment variables first
        const adminEmail = process.env.ADMIN_EMAIL
        const adminPassword = process.env.ADMIN_PASSWORD

        if (adminEmail && adminPassword && 
            credentials.email === adminEmail && 
            credentials.password === adminPassword) {
          return {
            id: 'admin',
            email: adminEmail,
            role: 'admin'
          }
        }

        // Fallback to database check
        try {
          const admin = await prisma.adminUser.findUnique({
            where: { email: credentials.email as string }
          })

          if (!admin) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            admin.passwordHash
          )

          if (!isPasswordValid) {
            return null
          }

          return {
            id: admin.id,
            email: admin.email,
            role: 'admin'
          }
        } catch (error) {
          console.error('Auth database error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role
      }
      return session
    }
  },
  pages: {
    signIn: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}

export default NextAuth(authOptions)

// Export handlers for API routes
export const handlers = {
  GET: NextAuth(authOptions),
  POST: NextAuth(authOptions)
}

// Custom auth function for API routes
export async function getServerAuth(request: NextRequest) {
  // Get the session token from cookies
  const sessionToken = request.cookies.get('next-auth.session-token')?.value || 
                      request.cookies.get('__Secure-next-auth.session-token')?.value;
  
  if (!sessionToken) {
    console.log('No session token found in cookies');
    return null;
  }

  // Check if NEXTAUTH_SECRET is available
  if (!process.env.NEXTAUTH_SECRET) {
    console.error('NEXTAUTH_SECRET environment variable is not set');
    return null;
  }

  try {
    // Use NextAuth's built-in JWT verification instead of manual decoding
    const NextAuthJWT = require('next-auth/jwt');
    const token = await NextAuthJWT.getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    if (token && token.role === 'admin') {
      console.log('JWT verified successfully:', { 
        sub: token.sub, 
        email: token.email, 
        role: token.role 
      });
      
      return {
        user: {
          id: token.sub,
          email: token.email,
          role: token.role
        }
      };
    }
    
    console.log('JWT token does not have admin role or is invalid');
    return null;
  } catch (error) {
    console.error('Auth token verification failed:', error);
    return null;
  }
}
