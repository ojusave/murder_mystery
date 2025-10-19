import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

const rsvpSchema = z.object({
  email: z.string().email(),
  legalName: z.string().min(1),
  wantsToPlay: z.enum(['Yes', 'No, I think I would just be interested in a regular party']),
  ackWaiver: z.boolean().refine(val => val === true),
  bringOptions: z.array(z.string()).min(1),
  bringOther: z.string().optional(),
  volunteerDecor: z.boolean(),
  willDressUp: z.enum(['Of course, who goes to a halloween murder mystery without dressing up?', 'I will try, but no commitments']),
  genderPref: z.enum(['Male', 'Female', 'Other:']),
  genderOther: z.string().optional(),
  charNamePref: z.string().optional(),
  charNameMode: z.enum(['I leave the fate of my character in your capable hands', 'Other:']),
  charNameOther: z.string().optional(),
  charInfoTiming: z.enum(['Yes. If I get to know about this before, I will have enough time to get into the character and plan my attire accordingly', 'I am very busy. The host should consider themselves lucky that I am attending this party. You can give me a character once I show up.']),
  talents: z.array(z.string()).optional(),
  talentsOther: z.string().optional(),
  ackPairing: z.boolean().refine(val => val === true),
  ackAdultThemes: z.boolean().refine(val => val === true),
  suggestions: z.string().optional(),
}).refine((data) => {
  // If genderPref is "Other:", then genderOther must be provided
  if (data.genderPref === 'Other:' && (!data.genderOther || data.genderOther.trim() === '')) {
    return false;
  }
  return true;
}, {
  message: "Please specify your gender preference",
  path: ["genderOther"]
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
    const body = await request.json();
    
    // Validate the request body
    const validatedData = rsvpSchema.parse(body);
    
    // Check if email already exists
    const existingGuest = await prisma.guest.findUnique({
      where: { email: validatedData.email },
    });

    if (existingGuest) {
      return NextResponse.json(
        { error: 'An RSVP with this email address already exists' },
        { status: 409 }
      );
    }
    
    // Generate a unique token for the guest portal
    const token = uuidv4().replace(/-/g, '').substring(0, 16);
    
    // Create the guest record
    const guest = await prisma.guest.create({
      data: {
        email: validatedData.email,
        legalName: validatedData.legalName,
        wantsToPlay: validatedData.wantsToPlay,
        ackWaiver: validatedData.ackWaiver,
        waiverVersion: '2024-10-28', // Current waiver version
        bringOptions: validatedData.bringOptions,
        bringOther: validatedData.bringOther,
        volunteerDecor: validatedData.volunteerDecor,
        willDressUp: validatedData.willDressUp,
        genderPref: validatedData.genderPref,
        genderOther: validatedData.genderOther,
        charNamePref: validatedData.charNamePref,
        charNameMode: validatedData.charNameMode,
        charNameOther: validatedData.charNameOther,
        charInfoTiming: validatedData.charInfoTiming,
        talents: validatedData.talents || [],
        talentsOther: validatedData.talentsOther,
        ackPairing: validatedData.ackPairing,
        ackAdultThemes: validatedData.ackAdultThemes,
        suggestions: validatedData.suggestions,
        token: token,
        status: 'pending',
      },
    });

    // Queue email notification (this will be processed by the background worker)
    await prisma.emailEvent.create({
      data: {
        guestId: guest.id,
        type: 'rsvp_received',
        status: 'queued',
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'RSVP submitted successfully',
      token: token 
    });

  } catch (error) {
    console.error('RSVP submission error:', error);
    
    if (error instanceof z.ZodError) {
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

    return NextResponse.json(
      { error: 'Failed to submit RSVP' },
      { status: 500 }
    );
  }
}
