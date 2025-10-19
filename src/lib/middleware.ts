import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function withAuth(
  handler: (req: NextRequest, context?: Record<string, unknown>) => Promise<NextResponse>
) {
  return async (req: NextRequest, context?: Record<string, unknown>) => {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    return handler(req, context)
  }
}
