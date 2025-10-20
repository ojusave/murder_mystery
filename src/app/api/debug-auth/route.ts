import { NextRequest, NextResponse } from 'next/server';
import { getServerAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerAuth(request);
    
    return NextResponse.json({
      hasSession: !!session,
      session: session ? {
        user: session.user,
        // Don't expose sensitive data
      } : null,
      cookies: {
        'next-auth.session-token': request.cookies.get('next-auth.session-token')?.value ? 'present' : 'missing',
        '__Secure-next-auth.session-token': request.cookies.get('__Secure-next-auth.session-token')?.value ? 'present' : 'missing',
      },
      headers: {
        authorization: request.headers.get('authorization'),
        cookie: request.headers.get('cookie') ? 'present' : 'missing',
      }
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      hasSession: false,
    });
  }
}
