import { NextRequest, NextResponse } from 'next/server';
import { getServerAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  const session = await getServerAuth(request);
  
  if (!session || !session.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Update Laura Kohlhepp to Bribara Kohlhepp
    const result = await prisma.character.updateMany({
      where: { displayName: 'Laura Kohlhepp' },
      data: { displayName: 'Bribara Kohlhepp' },
    });

    // Verify update
    const updated = await prisma.character.findFirst({
      where: { displayName: 'Bribara Kohlhepp' },
      select: {
        id: true,
        displayName: true,
        guestId: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Updated Laura Kohlhepp to Bribara Kohlhepp',
      recordsUpdated: result.count,
      updatedCharacter: updated,
    });
  } catch (error) {
    console.error('Error updating character name:', error);
    return NextResponse.json(
      { error: 'Failed to update character name', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

