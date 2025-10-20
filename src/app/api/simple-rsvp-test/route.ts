import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    console.log('Simple RSVP test endpoint called');
    
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('Database connection successful');
    
    // Get request body
    const body = await request.json();
    console.log('Request body:', body);
    
    // Create a minimal test guest
    const testGuest = await prisma.guest.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        legalName: 'Test User',
        wantsToPlay: 'Yes',
        ackWaiver: true,
        bringOptions: ['a. Snacks / munchies (nachos, chips, pizza, cheese sticks, nuggets etc) -- No Pork or Beef'],
        volunteerDecor: false,
        willDressUp: 'Of course, who goes to a halloween murder mystery without dressing up?',
        genderPref: 'Male',
        charNameMode: 'I leave the fate of my character in your capable hands',
        charInfoTiming: 'Yes. If I get to know about this before, I will have enough time to get into the character and plan my attire accordingly',
        talents: [],
        ackPairing: true,
        ackAdultThemes: true,
        token: `test-${Date.now()}`,
        status: 'pending',
      },
    });
    
    console.log('Test guest created successfully:', testGuest.id);
    
    // Clean up immediately
    await prisma.guest.delete({
      where: { id: testGuest.id }
    });
    
    console.log('Test guest cleaned up');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Simple RSVP test successful',
      timestamp: new Date().toISOString(),
      testId: testGuest.id
    });

  } catch (error) {
    console.error('Simple RSVP test error:', error);
    
    return NextResponse.json(
      { 
        error: 'Simple RSVP test failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
