import { NextRequest, NextResponse } from 'next/server';
import { getServerAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const session = await getServerAuth(request);
  
  if (!session || !session.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const unassignedCharacters = await prisma.character.findMany({
      where: {
        guestId: null,
      },
      orderBy: {
        displayName: 'asc',
      },
    });

    return NextResponse.json({ characters: unassignedCharacters });
  } catch (error) {
    console.error('Error fetching unassigned characters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch characters' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerAuth(request);
  
  if (!session || !session.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { guestId, displayName, backstory, hostNotes } = await request.json();

    if (!displayName || !backstory) {
      return NextResponse.json(
        { error: 'Display name and backstory are required' },
        { status: 400 }
      );
    }

    const character = await prisma.character.create({
      data: {
        guestId: guestId || null, // Allow null for unassigned characters
        displayName,
        traits: { backstory: backstory },
        notesPrivate: hostNotes,
        assignedAt: guestId ? new Date() : null, // Only set assignedAt if guestId is provided
      },
    });

    // Queue email notification only if character is assigned to a guest
    if (guestId) {
      await prisma.emailEvent.create({
        data: {
          guestId: guestId,
          type: 'character_assigned',
          status: 'queued',
          subject: 'Character Assigned - The Black Lotus Murder Mystery',
          message: `🎭 Your character has been assigned!\n\nCheck your guest portal to see your character details and backstory. This will help you prepare for your role in the murder mystery.\n\nVisit your guest portal: ${process.env.APP_BASE_URL || 'https://mm.saveoj.us'}/guest/[your-token]\n\nGet ready to bring your character to life!\n\nBest regards,\nBrO-J and Half-Chai (A D T)`,
        },
      });
    }

    return NextResponse.json({ success: true, character });
  } catch (error) {
    console.error('Error creating character:', error);
    return NextResponse.json(
      { error: 'Failed to create character' },
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
    const { characterId, guestId, displayName, backstory, hostNotes } = await request.json();

    if (!characterId) {
      return NextResponse.json(
        { error: 'Character ID is required' },
        { status: 400 }
      );
    }

    // Get the current character to check if it's being assigned to a new guest
    const currentCharacter = await prisma.character.findUnique({
      where: { id: characterId },
      include: { guest: true },
    });

    if (!currentCharacter) {
      return NextResponse.json(
        { error: 'Character not found' },
        { status: 404 }
      );
    }

    const updateData: any = {};
    
    if (displayName !== undefined) updateData.displayName = displayName;
    if (hostNotes !== undefined) updateData.notesPrivate = hostNotes;
    if (guestId !== undefined) {
      updateData.guestId = guestId;
      updateData.assignedAt = guestId ? new Date() : null;
    }
    
    if (backstory !== undefined) {
      updateData.traits = { backstory: backstory };
    }

    const character = await prisma.character.update({
      where: { id: characterId },
      data: updateData,
      include: { guest: true },
    });

    // Queue email notifications based on what changed
    if (guestId && !currentCharacter.guestId) {
      // Character is being assigned to a guest for the first time
      await prisma.emailEvent.create({
        data: {
          guestId: guestId,
          type: 'character_assigned',
          status: 'queued',
          subject: 'Character Assigned - The Black Lotus Murder Mystery',
          message: `🎭 Your character has been assigned!\n\nCheck your guest portal to see your character details and backstory. This will help you prepare for your role in the murder mystery.\n\nVisit your guest portal: ${process.env.APP_BASE_URL || 'https://mm.saveoj.us'}/guest/[your-token]\n\nGet ready to bring your character to life!\n\nBest regards,\nBrO-J and Half-Chai (A D T)`,
        },
      });
    } else if (currentCharacter.guestId && (displayName !== undefined || backstory !== undefined)) {
      // Character details are being updated for an assigned guest
      await prisma.emailEvent.create({
        data: {
          guestId: currentCharacter.guestId,
          type: 'character_updated',
          status: 'queued',
          subject: 'Character Updated - The Black Lotus Murder Mystery',
          message: `🎭 Your character details have been updated!\n\nCheck your guest portal to see the updated character information and backstory.\n\nVisit your guest portal: ${process.env.APP_BASE_URL || 'https://mm.saveoj.us'}/guest/[your-token]\n\nBest regards,\nBrO-J and Half-Chai (A D T)`,
        },
      });
    }

    return NextResponse.json({ success: true, character });
  } catch (error) {
    console.error('Error updating character:', error);
    return NextResponse.json(
      { error: 'Failed to update character' },
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
    const { characterId } = await request.json();

    if (!characterId) {
      return NextResponse.json(
        { error: 'Character ID is required' },
        { status: 400 }
      );
    }

    // Get the character and guest info before deleting
    const character = await prisma.character.findUnique({
      where: { id: characterId },
      include: { guest: true },
    });

    if (!character) {
      return NextResponse.json(
        { error: 'Character not found' },
        { status: 404 }
      );
    }

    // Send email notification if character was assigned to a guest
    if (character.guestId) {
      await prisma.emailEvent.create({
        data: {
          guestId: character.guestId,
          type: 'character_removed',
          status: 'queued',
          subject: 'Character Assignment Removed - The Black Lotus Murder Mystery',
          message: `🎭 Your character assignment has been removed.\n\nThis may be due to changes in the event planning or character assignments. You may receive a new character assignment soon.\n\nIf you have any questions, please contact the hosts directly.\n\nBest regards,\nBrO-J and Half-Chai (A D T)`,
        },
      });
    }

    // Delete the character
    await prisma.character.delete({
      where: { id: characterId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting character:', error);
    return NextResponse.json(
      { error: 'Failed to delete character' },
      { status: 500 }
    );
  }
}
