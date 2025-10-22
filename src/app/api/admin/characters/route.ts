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
    });

    // Queue email notification if character is being assigned to a guest
    if (guestId && !character.guestId) {
      await prisma.emailEvent.create({
        data: {
          guestId: guestId,
          type: 'character_assigned',
          status: 'queued',
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
