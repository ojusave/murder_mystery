const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function migrateDatabase() {
  try {
    console.log('Starting database migration...');
    
    // Check if the reminder columns exist
    const result = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'guests' 
      AND column_name IN ('reminder_one_week_sent', 'reminder_two_day_sent', 'reminder_one_day_sent', 'reminder_five_hour_sent')
    `;
    
    const existingColumns = result.map(row => row.column_name);
    console.log('Existing reminder columns:', existingColumns);
    
    // Add missing columns
    const columnsToAdd = [
      { name: 'reminder_one_week_sent', exists: existingColumns.includes('reminder_one_week_sent') },
      { name: 'reminder_two_day_sent', exists: existingColumns.includes('reminder_two_day_sent') },
      { name: 'reminder_one_day_sent', exists: existingColumns.includes('reminder_one_day_sent') },
      { name: 'reminder_five_hour_sent', exists: existingColumns.includes('reminder_five_hour_sent') }
    ];
    
    for (const column of columnsToAdd) {
      if (!column.exists) {
        console.log(`Adding column: ${column.name}`);
        await prisma.$executeRawUnsafe(`ALTER TABLE guests ADD COLUMN ${column.name} BOOLEAN DEFAULT FALSE`);
        console.log(`✓ Added column: ${column.name}`);
      } else {
        console.log(`✓ Column already exists: ${column.name}`);
      }
    }
    
    console.log('Database migration completed successfully!');
    
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateDatabase()
    .then(() => {
      console.log('Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateDatabase };
