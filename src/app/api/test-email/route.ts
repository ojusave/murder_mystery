import { NextResponse } from 'next/server';
import { sendRSVPConfirmationEmail } from '@/lib/email';

export async function POST() {
  try {
    console.log('Email test endpoint called');
    
    // Check if RESEND_API_KEY is available
    const hasResendKey = !!process.env.RESEND_API_KEY;
    console.log('RESEND_API_KEY available:', hasResendKey);
    
    if (!hasResendKey) {
      return NextResponse.json({
        success: false,
        error: 'RESEND_API_KEY environment variable is not set',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }
    
    // Create a test guest object
    const testGuest = {
      id: 'test-123',
      email: 'test@example.com', // Change this to your email for testing
      legalName: 'Test User',
      token: 'test-token-123'
    };
    
    console.log('Attempting to send test email to:', testGuest.email);
    
    // Try to send the email
    await sendRSVPConfirmationEmail(testGuest);
    
    console.log('Test email sent successfully');
    
    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      testGuest: {
        email: testGuest.email,
        legalName: testGuest.legalName
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Email test error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
