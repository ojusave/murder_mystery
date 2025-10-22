import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { sendRSVPConfirmationEmail, sendHostNotificationEmail } from '@/lib/email';

const rsvpSchema = z.object({
  email: z.string().email(),
  legalName: z.string().min(1),
  willDressUp: z.enum(['Of course, who goes to a halloween murder mystery without dressing up?', 'I will try, but no commitments']),
  charNameMode: z.enum(['I leave the fate of my character in your capable hands', 'Other:']),
  charNameOther: z.string().optional(),
  ackPairing: z.boolean().refine(val => val === true),
  ackAdultThemes: z.boolean().refine(val => val === true),
  ackWaiver: z.boolean().refine(val => val === true),
}).refine((data) => {
  // If charNameMode is "Other:", then charNameOther must be provided
  if (data.charNameMode === 'Other:' && (!data.charNameOther || data.charNameOther.trim() === '')) {
    return false;
  }
  return true;
}, {
  message: "Please specify your character name preference",
  path: ["charNameOther"]
});

export async function POST(request: NextRequest) {
  try {
    // Test database connection first
    await prisma.$queryRaw`SELECT 1`;
    
    const body = await request.json();
    
    // Validate the request body
    const validatedData = rsvpSchema.parse(body);
    
    // Check if email already exists
    const existingGuest = await prisma.guest.findUnique({
      where: { email: validatedData.email },
    });

    if (existingGuest) {
      return NextResponse.json(
        { 
          error: 'An RSVP with this email address already exists',
          existingGuestId: existingGuest.id,
          message: 'If you need to update your RSVP, please contact the host directly.'
        },
        { status: 409 }
      );
    }
    
    // Generate a unique token for the guest portal
    const token = uuidv4().replace(/-/g, '').substring(0, 16);
    
    // Create the guest record with ONLY the fields from the RSVP form
    // Note: Database has NOT NULL constraints on unused fields, so we add minimal defaults
    const guest = await prisma.guest.create({
      data: {
        email: validatedData.email,
        legalName: validatedData.legalName,
        willDressUp: validatedData.willDressUp,
        charNameMode: validatedData.charNameMode,
        charNameOther: validatedData.charNameOther,
        ackPairing: validatedData.ackPairing,
        ackAdultThemes: validatedData.ackAdultThemes,
        ackWaiver: validatedData.ackWaiver,
        waiverVersion: '2024-10-28',
        // Required by database but not in RSVP form - using minimal defaults
        wantsToPlay: 'Yes',
        volunteerDecor: false,
        genderPref: 'No preference',
        charInfoTiming: 'I am very busy… give me on arrival',
        token: token,
        status: 'pending',
      },
    });

    // Send confirmation email immediately
    try {
      console.log('Attempting to send RSVP confirmation email to:', guest.email);
      console.log('RESEND_API_KEY available:', !!process.env.RESEND_API_KEY);
      console.log('EMAIL_FROM:', process.env.EMAIL_FROM);
      
      await sendRSVPConfirmationEmail(guest);
      
      console.log('RSVP confirmation email sent successfully to:', guest.email);
      
      // Create email event for tracking
      await prisma.emailEvent.create({
        data: {
          guestId: guest.id,
          type: 'rsvp_received',
          status: 'sent',
        },
      });

      // Send host notification email
      try {
        console.log('Sending host notification email for:', guest.email);
        await sendHostNotificationEmail(guest);
        console.log('Host notification email sent successfully');
        
        // Create email event for host notification
        await prisma.emailEvent.create({
          data: {
            guestId: guest.id,
            type: 'host_notification',
            status: 'sent',
          },
        });
      } catch (hostEmailError) {
        console.error('Host notification email failed:', hostEmailError);
        
        // Still create email event for tracking, but mark as failed
        await prisma.emailEvent.create({
          data: {
            guestId: guest.id,
            type: 'host_notification',
            status: 'failed',
            error: hostEmailError instanceof Error ? hostEmailError.message : 'Unknown error',
          },
        });
      }
    } catch (emailError) {
      console.error('RSVP confirmation email failed:', emailError);
      console.error('Email error details:', {
        message: emailError instanceof Error ? emailError.message : 'Unknown error',
        stack: emailError instanceof Error ? emailError.stack : undefined,
        guestEmail: guest.email,
        resendKeyAvailable: !!process.env.RESEND_API_KEY
      });
      
      // Still create email event for tracking, but mark as failed
      await prisma.emailEvent.create({
        data: {
          guestId: guest.id,
          type: 'rsvp_received',
          status: 'failed',
          error: emailError instanceof Error ? emailError.message : 'Unknown error',
        },
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'RSVP submitted successfully',
      token: token 
    });

  } catch (error) {
    console.error('RSVP submission error:', error);
    
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.issues);
      return NextResponse.json(
        { error: 'Invalid form data', details: error.issues },
        { status: 400 }
      );
    }

    // Handle Prisma unique constraint violation
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002' && 'meta' in error && error.meta && typeof error.meta === 'object' && 'target' in error.meta && Array.isArray(error.meta.target) && error.meta.target.includes('email')) {
      return NextResponse.json(
        { error: 'An RSVP with this email address already exists' },
        { status: 409 }
      );
    }

    // Handle database connection errors
    if (error && typeof error === 'object' && 'code' in error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Database connection failed. Please try again later.' },
        { status: 503 }
      );
    }

    // More detailed error logging for debugging
    console.error('Unexpected error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error
    });

    return NextResponse.json(
      { error: 'Failed to submit RSVP. Please try again later.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Test database connection first
    await prisma.$queryRaw`SELECT 1`;
    
    const body = await request.json();
    
    // Validate the request body
    const validatedData = rsvpSchema.parse(body);
    
    // Check if email exists
    const existingGuest = await prisma.guest.findUnique({
      where: { email: validatedData.email },
    });

    if (!existingGuest) {
      return NextResponse.json(
        { error: 'No RSVP found with this email address' },
        { status: 404 }
      );
    }
    
    // Update the guest record with ONLY the fields from the RSVP form
    // Note: Database has NOT NULL constraints on unused fields, so we add minimal defaults
    const updatedGuest = await prisma.guest.update({
      where: { email: validatedData.email },
      data: {
        legalName: validatedData.legalName,
        willDressUp: validatedData.willDressUp,
        charNameMode: validatedData.charNameMode,
        charNameOther: validatedData.charNameOther,
        ackPairing: validatedData.ackPairing,
        ackAdultThemes: validatedData.ackAdultThemes,
        ackWaiver: validatedData.ackWaiver,
        waiverVersion: '2024-10-28',
        // Required by database but not in RSVP form - using minimal defaults
        wantsToPlay: 'Yes',
        volunteerDecor: false,
        genderPref: 'No preference',
        charInfoTiming: 'I am very busy… give me on arrival',
        status: 'pending',
      },
    });

    // Send update confirmation email immediately
    try {
      console.log('Attempting to send RSVP update confirmation email to:', updatedGuest.email);
      console.log('RESEND_API_KEY available:', !!process.env.RESEND_API_KEY);
      
      await sendRSVPConfirmationEmail(updatedGuest);
      
      console.log('RSVP update confirmation email sent successfully to:', updatedGuest.email);
      
      // Create email event for tracking
      await prisma.emailEvent.create({
        data: {
          guestId: updatedGuest.id,
          type: 'rsvp_updated',
          status: 'sent',
        },
      });
    } catch (emailError) {
      console.error('RSVP update confirmation email failed:', emailError);
      console.error('Email error details:', {
        message: emailError instanceof Error ? emailError.message : 'Unknown error',
        stack: emailError instanceof Error ? emailError.stack : undefined,
        guestEmail: updatedGuest.email,
        resendKeyAvailable: !!process.env.RESEND_API_KEY
      });
      
      // Still create email event for tracking, but mark as failed
      await prisma.emailEvent.create({
        data: {
          guestId: updatedGuest.id,
          type: 'rsvp_updated',
          status: 'failed',
          error: emailError instanceof Error ? emailError.message : 'Unknown error',
        },
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'RSVP updated successfully',
      token: updatedGuest.token 
    });

  } catch (error) {
    console.error('RSVP update error:', error);
    
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.issues);
      return NextResponse.json(
        { error: 'Invalid form data', details: error.issues },
        { status: 400 }
      );
    }

    // Handle database connection errors
    if (error && typeof error === 'object' && 'code' in error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Database connection failed. Please try again later.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update RSVP. Please try again later.' },
      { status: 500 }
    );
  }
}
