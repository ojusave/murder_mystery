import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    console.log('Test RSVP endpoint called');
    
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('Database connection successful');
    
    // Test basic guest creation with minimal data
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
    
    console.log('Test guest created:', testGuest.id);
    
    // Clean up test data
    await prisma.guest.delete({
      where: { id: testGuest.id }
    });
    
    console.log('Test guest cleaned up');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Test RSVP successful',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Test RSVP error:', error);
    
    return NextResponse.json(
      { 
        error: 'Test RSVP failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
