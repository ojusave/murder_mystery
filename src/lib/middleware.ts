import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function withAuth(
  handler: (req: NextRequest, context?: Record<string, unknown>) => Promise<NextResponse>
) {
  return async (req: NextRequest, context?: Record<string, unknown>) => {
    const session = await auth()
    
    if (!session || !session.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    return handler(req, context)
  }
}
