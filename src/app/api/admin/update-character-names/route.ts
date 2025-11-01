import { NextRequest, NextResponse } from 'next/server';
import { getServerAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  const session = await getServerAuth(request);
  
  if (!session || !session.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('Starting character name updates...');

    // Update Mala "Ria" Adams to Morticia Adams
    const morticia = await prisma.character.updateMany({
      where: { displayName: 'Mala "Ria" Adams' },
      data: { displayName: 'Morticia Adams' },
    });
    console.log(`Updated Morticia Adams: ${morticia.count} record(s)`);

    // Update Gone Case Adam to Gomez Adams
    const gomez = await prisma.character.updateMany({
      where: { displayName: 'Gone Case Adam' },
      data: { displayName: 'Gomez Adams' },
    });
    console.log(`Updated Gomez Adams: ${gomez.count} record(s)`);

    // Update Laura Kohlhepp to Bribara Kohlhepp
    const bribara = await prisma.character.updateMany({
      where: { displayName: 'Laura Kohlhepp' },
      data: { displayName: 'Bribara Kohlhepp' },
    });
    console.log(`Updated Bribara Kohlhepp: ${bribara.count} record(s)`);

    // Update Lurch to Creep Lurch
    const lurch = await prisma.character.updateMany({
      where: { displayName: 'Lurch' },
      data: { displayName: 'Creep Lurch' },
    });
    console.log(`Updated Creep Lurch: ${lurch.count} record(s)`);

    // Verify updates
    const updated = await prisma.character.findMany({
      where: {
        displayName: {
          in: ['Morticia Adams', 'Gomez Adams', 'Bribara Kohlhepp', 'Creep Lurch'],
        },
      },
      select: {
        id: true,
        displayName: true,
        guestId: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Character names updated successfully',
      updates: {
        morticia: morticia.count,
        gomez: gomez.count,
        bribara: bribara.count,
        lurch: lurch.count,
      },
      updatedCharacters: updated,
    });
  } catch (error) {
    console.error('Error updating character names:', error);
    return NextResponse.json(
      { error: 'Failed to update character names', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

