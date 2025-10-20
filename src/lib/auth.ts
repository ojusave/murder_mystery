import NextAuth from 'next-auth/next'
import CredentialsProvider from 'next-auth/providers/credentials'
import * as bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

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
}

export default NextAuth(authOptions)

// Export handlers for API routes
export const handlers = {
  GET: NextAuth(authOptions),
  POST: NextAuth(authOptions)
}

// Custom auth function for API routes
export async function getServerAuth(request: NextRequest) {
  const sessionToken = request.cookies.get('next-auth.session-token')?.value || 
                      request.cookies.get('__Secure-next-auth.session-token')?.value;
  
  if (!sessionToken) {
    return null;
  }

  try {
    // For NextAuth v4, we'll decode the JWT token manually
    const decoded = jwt.verify(sessionToken, process.env.NEXTAUTH_SECRET!);
    
    if (decoded && typeof decoded === 'object' && 'role' in decoded && decoded.role === 'admin') {
      return {
        user: {
          id: decoded.sub,
          email: decoded.email,
          role: decoded.role
        }
      };
    }
    
    return null;
  } catch (error) {
    console.error('Auth token verification failed:', error);
    return null;
  }
}
