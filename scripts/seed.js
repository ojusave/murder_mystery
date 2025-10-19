import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  console.log('Starting database seed...');

  try {
    // Create admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@blacklotus.party';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    const existingAdmin = await prisma.adminUser.findUnique({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      console.log('Admin user already exists');
    } else {
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      
      const admin = await prisma.adminUser.create({
        data: {
          email: adminEmail,
          passwordHash: hashedPassword,
        },
      });

      console.log(`Admin user created: ${admin.email}`);
    }

    // Create sample guests for demo
    const sampleGuests = [
      {
        email: 'john.doe@example.com',
        legalName: 'John Doe',
        wantsToPlay: 'Yes',
        ackWaiver: true,
        waiverVersion: '2024-10-28',
        bringOptions: ['a. Snacks / munchies (… No Pork or Beef)', 'd. Beverages'],
        bringOther: '',
        volunteerDecor: true,
        willDressUp: 'Of course…',
        genderPref: 'Male',
        charNamePref: '',
        charNameMode: 'I leave the fate…',
        charInfoTiming: 'Yes… tell me earlier',
        talents: ['good at cracking jokes…', 'take leadership…'],
        talentsOther: '',
        ackPairing: true,
        ackAdultThemes: true,
        suggestions: 'Looking forward to a great mystery!',
        status: 'approved',
        token: 'sample-token-1',
      },
      {
        email: 'jane.smith@example.com',
        legalName: 'Jane Smith',
        wantsToPlay: 'Yes',
        ackWaiver: true,
        waiverVersion: '2024-10-28',
        bringOptions: ['b. Liquor and liqueurs (Whiskey, tequila etc)'],
        bringOther: '',
        volunteerDecor: false,
        willDressUp: 'I will try, but no commitments',
        genderPref: 'Female',
        charNamePref: 'Mysterious Countess',
        charNameMode: 'Other:',
        charInfoTiming: 'I am very busy… give me on arrival',
        talents: ['dance as if MJ…', 'sing so well…'],
        talentsOther: '',
        ackPairing: true,
        ackAdultThemes: true,
        suggestions: 'Love the theme! Can\'t wait.',
        status: 'pending',
        token: 'sample-token-2',
      },
    ];

    for (const guestData of sampleGuests) {
      const existingGuest = await prisma.guest.findUnique({
        where: { email: guestData.email },
      });

      if (!existingGuest) {
        const guest = await prisma.guest.create({
          data: guestData,
        });

        console.log(`Sample guest created: ${guest.email}`);

        // Create character for approved guest
        if (guest.status === 'approved') {
          const character = await prisma.character.create({
            data: {
              guestId: guest.id,
              displayName: 'The Mysterious Detective',
              traits: {
                personality: 'Observant and analytical',
                background: 'Former police detective turned private investigator',
                motivation: 'Seeking justice for past injustices',
                secret: 'Has a personal connection to the case',
              },
              notesPrivate: 'Good at reading people, use this to guide other guests',
              assignedAt: new Date(),
            },
          });

          console.log(`Character created for ${guest.email}: ${character.displayName}`);
        }
      }
    }

    console.log('Database seed completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run seed if called directly
if (require.main === module) {
  seed()
    .then(() => {
      console.log('Seed script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seed script failed:', error);
      process.exit(1);
    });
}

export default seed;
