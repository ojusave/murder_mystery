import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const session = await auth();
  
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
  const session = await auth();
  
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

      // Queue email notification
      await prisma.emailEvent.create({
        data: {
          guestId: guest.id,
          type: status === 'approved' ? 'approved' : 'rejected',
          status: 'queued',
        },
      });

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
  const session = await auth();
  
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
