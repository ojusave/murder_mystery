import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
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
            where: { email: credentials.email }
          })

          if (!admin) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
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
        session.user.id = token.sub
        session.user.role = token.role
      }
      return session
    }
  },
  pages: {
    signIn: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
})
