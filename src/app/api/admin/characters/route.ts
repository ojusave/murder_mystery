import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  const session = await auth();
  
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { guestId, displayName, traits, notesPrivate } = await request.json();

    if (!guestId || !displayName || !traits) {
      return NextResponse.json(
        { error: 'Guest ID, display name, and traits are required' },
        { status: 400 }
      );
    }

    // Parse traits if it's a JSON string
    let parsedTraits;
    try {
      parsedTraits = typeof traits === 'string' ? JSON.parse(traits) : traits;
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid traits format. Must be valid JSON.' },
        { status: 400 }
      );
    }

    const character = await prisma.character.create({
      data: {
        guestId,
        displayName,
        traits: parsedTraits,
        notesPrivate,
        assignedAt: new Date(),
      },
    });

    // Queue email notification
    await prisma.emailEvent.create({
      data: {
        guestId: guestId,
        type: 'character_assigned',
        status: 'queued',
      },
    });

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
  const session = await auth();
  
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { characterId, displayName, traits, notesPrivate } = await request.json();

    if (!characterId) {
      return NextResponse.json(
        { error: 'Character ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    
    if (displayName !== undefined) updateData.displayName = displayName;
    if (notesPrivate !== undefined) updateData.notesPrivate = notesPrivate;
    
    if (traits !== undefined) {
      let parsedTraits = traits;
      if (typeof traits === 'string') {
        try {
          parsedTraits = JSON.parse(traits);
        } catch (error) {
          return NextResponse.json(
            { error: 'Invalid traits format. Must be valid JSON.' },
            { status: 400 }
          );
        }
      }
      updateData.traits = parsedTraits;
    }

    const character = await prisma.character.update({
      where: { id: characterId },
      data: updateData,
    });

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
  const session = await auth();
  
  if (!session || session.user.role !== 'admin') {
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
