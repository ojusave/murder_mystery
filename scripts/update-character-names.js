const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateCharacterNames() {
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

    console.log('Character name updates completed!');

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

    console.log('\nUpdated characters:');
    updated.forEach(char => {
      console.log(`  - ${char.displayName} (ID: ${char.id})`);
    });

  } catch (error) {
    console.error('Error updating character names:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateCharacterNames()
  .then(() => {
    console.log('\nScript completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });

