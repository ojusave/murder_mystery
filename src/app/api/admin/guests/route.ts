import { NextRequest, NextResponse } from 'next/server';
import { getServerAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { sendApprovalEmail, sendRejectionEmail } from '@/lib/email';

export async function GET(request: NextRequest) {
  const session = await getServerAuth(request);
  
  if (!session || !session.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const guests = await prisma.guest.findMany({
      include: {
        character: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(guests);
  } catch (error) {
    console.error('Error fetching guests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch guests' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const session = await getServerAuth(request);
  
  if (!session || !session.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { guestId, action, data } = body;

    if (!guestId) {
      return NextResponse.json(
        { error: 'Guest ID is required' },
        { status: 400 }
      );
    }

    if (action === 'updateStatus') {
      const { status } = data;
      if (!status) {
        return NextResponse.json(
          { error: 'Status is required' },
          { status: 400 }
        );
      }

      const guest = await prisma.guest.update({
        where: { id: guestId },
        data: { status },
      });

      // Send email immediately instead of queuing
      try {
        if (status === 'approved') {
          await sendApprovalEmail(guest);
        } else if (status === 'rejected') {
          await sendRejectionEmail(guest);
        }
        
        // Still create email event for tracking
        await prisma.emailEvent.create({
          data: {
            guestId: guest.id,
            type: status === 'approved' ? 'approved' : 'rejected',
            status: 'sent',
            subject: status === 'approved' 
              ? 'RSVP Approved - The Black Lotus Murder Mystery' 
              : 'RSVP Update - The Black Lotus Murder Mystery',
            message: status === 'approved'
              ? `🎉 Congratulations ${guest.legalName}!\n\nYour RSVP has been approved! You're officially invited to The Black Lotus Murder Mystery event.\n\nEvent Details:\n• Date: November 1st, 2025\n• Time: 8:00 PM - 12:00 AM\n• Location: Fremont\n• Dress Code: Costumes required\n\nYou can view your guest portal and character assignment (when available) at: ${process.env.APP_BASE_URL}/guest/${guest.token}\n\nWe're excited to see you there!\n\nBest regards,\nBrO-J and Half-Chai (A D T)`
              : `Hi ${guest.legalName},\n\nThank you for your interest in The Black Lotus Murder Mystery event. Unfortunately, we're unable to accommodate your RSVP at this time.\n\nIf you have any questions or believe this was sent in error, please contact us directly.\n\nBest regards,\nBrO-J and Half-Chai (A D T)`,
          },
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Still update the guest status even if email fails
        await prisma.emailEvent.create({
          data: {
            guestId: guest.id,
            type: status === 'approved' ? 'approved' : 'rejected',
            status: 'failed',
            error: emailError instanceof Error ? emailError.message : 'Unknown error',
            subject: status === 'approved' 
              ? 'RSVP Approved - The Black Lotus Murder Mystery' 
              : 'RSVP Update - The Black Lotus Murder Mystery',
            message: status === 'approved'
              ? `🎉 Congratulations ${guest.legalName}!\n\nYour RSVP has been approved! You're officially invited to The Black Lotus Murder Mystery event.\n\nEvent Details:\n• Date: November 1st, 2025\n• Time: 8:00 PM - 12:00 AM\n• Location: Fremont\n• Dress Code: Costumes required\n\nYou can view your guest portal and character assignment (when available) at: ${process.env.APP_BASE_URL}/guest/${guest.token}\n\nWe're excited to see you there!\n\nBest regards,\nBrO-J and Half-Chai (A D T)`
              : `Hi ${guest.legalName},\n\nThank you for your interest in The Black Lotus Murder Mystery event. Unfortunately, we're unable to accommodate your RSVP at this time.\n\nIf you have any questions or believe this was sent in error, please contact us directly.\n\nBest regards,\nBrO-J and Half-Chai (A D T)`,
          },
        });
      }

      return NextResponse.json({ success: true });
    }

    if (action === 'updateDetails') {
      const {
        email,
        legalName,
        wantsToPlay,
        bringOptions,
        bringOther,
        volunteerDecor,
        willDressUp,
        genderPref,
        charNamePref,
        charNameMode,
        charInfoTiming,
        talents,
        talentsOther,
        ackPairing,
        ackAdultThemes,
        ackWaiver,
        waiverVersion,
        suggestions
      } = data;

      const updateData: any = {};
      
      if (email !== undefined) updateData.email = email;
      if (legalName !== undefined) updateData.legalName = legalName;
      if (wantsToPlay !== undefined) updateData.wantsToPlay = wantsToPlay;
      if (bringOptions !== undefined) updateData.bringOptions = bringOptions;
      if (bringOther !== undefined) updateData.bringOther = bringOther;
      if (volunteerDecor !== undefined) updateData.volunteerDecor = volunteerDecor;
      if (willDressUp !== undefined) updateData.willDressUp = willDressUp;
      if (genderPref !== undefined) updateData.genderPref = genderPref;
      if (charNamePref !== undefined) updateData.charNamePref = charNamePref;
      if (charNameMode !== undefined) updateData.charNameMode = charNameMode;
      if (charInfoTiming !== undefined) updateData.charInfoTiming = charInfoTiming;
      if (talents !== undefined) updateData.talents = talents;
      if (talentsOther !== undefined) updateData.talentsOther = talentsOther;
      if (ackPairing !== undefined) updateData.ackPairing = ackPairing;
      if (ackAdultThemes !== undefined) updateData.ackAdultThemes = ackAdultThemes;
      if (ackWaiver !== undefined) updateData.ackWaiver = ackWaiver;
      if (waiverVersion !== undefined) updateData.waiverVersion = waiverVersion;
      if (suggestions !== undefined) updateData.suggestions = suggestions;

      const guest = await prisma.guest.update({
        where: { id: guestId },
        data: updateData,
      });

      return NextResponse.json({ success: true, guest });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating guest:', error);
    return NextResponse.json(
      { error: 'Failed to update guest' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerAuth(request);
  
  if (!session || !session.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { guestId } = body;

    if (!guestId) {
      return NextResponse.json(
        { error: 'Guest ID is required' },
        { status: 400 }
      );
    }

    // Get the guest info before deletion to send email notification
    const guest = await prisma.guest.findUnique({
      where: { id: guestId },
    });

    if (!guest) {
      return NextResponse.json(
        { error: 'Guest not found' },
        { status: 404 }
      );
    }

    // Send email notification before deletion
    try {
      await prisma.emailEvent.create({
        data: {
          guestId: guestId,
          type: 'registration_deleted',
          status: 'queued',
          subject: 'Registration Deleted - The Black Lotus Murder Mystery',
          message: `Hi ${guest.legalName},\n\nYour registration for The Black Lotus Murder Mystery has been deleted by the hosts.\n\nThis means you are no longer registered for the event. If you believe this was done in error, please contact the hosts immediately.\n\nIf you wish to re-register, you can submit a new RSVP.\n\nBest regards,\nBrO-J and Half-Chai (A D T)`,
        },
      });
    } catch (emailError) {
      console.error('Failed to create email event for registration deletion:', emailError);
      // Continue with deletion even if email event creation fails
    }

    // Delete the guest and all related records (cascade delete)
    await prisma.guest.delete({
      where: { id: guestId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting guest:', error);
    return NextResponse.json(
      { error: 'Failed to delete guest' },
      { status: 500 }
    );
  }
}
