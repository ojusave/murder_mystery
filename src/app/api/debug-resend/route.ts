import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST() {
  try {
    console.log('=== Resend Debug Test ===');
    
    // Check if RESEND_API_KEY is available
    const resendApiKey = process.env.RESEND_API_KEY;
    console.log('RESEND_API_KEY available:', !!resendApiKey);
    
    if (!resendApiKey) {
      return NextResponse.json({
        success: false,
        error: 'RESEND_API_KEY environment variable is not set',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }
    
    // Show partial API key for debugging (first 8 chars)
    const partialKey = resendApiKey.substring(0, 8) + '...';
    console.log('RESEND_API_KEY (partial):', partialKey);
    
    const resend = new Resend(resendApiKey);
    
    // Test with a simple email
    const testEmail = {
      from: 'Black Lotus <noreply@saveoj.us>',
      to: 'test@example.com',
      subject: 'Resend Debug Test',
      html: '<p>This is a test email to verify Resend configuration.</p>',
    };
    
    console.log('Attempting to send test email:', testEmail);
    
    const result = await resend.emails.send(testEmail);
    
    console.log('Resend API response:', result);
    
    return NextResponse.json({
      success: true,
      message: 'Resend test completed',
      resendResponse: result,
      testEmail: testEmail,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Resend debug error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
