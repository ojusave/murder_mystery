import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    console.log('Health check started');
    
    // Test database connection
    const dbTest = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('Database test result:', dbTest);
    
    // Test basic guest count
    const guestCount = await prisma.guest.count();
    console.log('Guest count:', guestCount);
    
    // Check environment variables
    const envCheck = {
      DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Missing',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set' : 'Missing',
      NODE_ENV: process.env.NODE_ENV,
      APP_BASE_URL: process.env.APP_BASE_URL,
    };
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        api: 'operational',
        guestCount: guestCount,
      },
      environment: envCheck,
      version: '1.0.0'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        environment: {
          DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Missing',
          NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set' : 'Missing',
          NODE_ENV: process.env.NODE_ENV,
        }
      },
      { status: 503 }
    );
  }
}