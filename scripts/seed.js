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

    const faqCount = await prisma.faq.count();
    if (faqCount === 0) {
      const defaultFaqs = [
        {
          order: 10,
          question: 'What is The Black Lotus Murder Mystery?',
          answer: `It's a goddamn murder mystery party. You know, where someone pretends to be dead and you pretend to care enough to figure out who did it. It's like Clue, but with real people who are probably more interesting than you. We've been planning this for months, so try to keep up.`,
        },
        {
          order: 20,
          question: 'What happens at this party?',
          answer: `Someone dies. Figuratively, of course - though we can't guarantee your social life won't die a little too. You'll get a character, wear a costume, and pretend to solve a murder while eating snacks and judging everyone else's acting abilities. It's basically a four-hour exercise in human interaction.`,
        },
        {
          order: 30,
          question: 'How long does this last?',
          answer: `Until your dumbass mind solves the mystery. Could be four hours, could be all night, could be never. We're not responsible for your lack of deductive reasoning skills. If you're still here at sunrise, we'll probably just kick your shitty ass out.`,
        },
        {
          order: 40,
          question: 'What happens after the murder mystery is solved?',
          answer: `You can go home or hangout and we'll play other games. We're not kicking you out immediately, but we're also not running a 24-hour entertainment service. If you want to stay, we'll probably play some other games. If you want to leave, that's fine too - we won't be offended. Just don't expect us to be your personal entertainment coordinators for the rest of the night.`,
        },
        {
          order: 50,
          question: 'Do I need to RSVP?',
          answer: `Yes, you absolute dipshit. We're not running a walk-in clinic here. We need to know who's coming so we can assign characters and buy the right amount of snacks. If you can't figure out how to click a button and fill out a form, maybe this isn't the event for you.`,
        },
        {
          order: 60,
          question: 'Can I bring a friend?',
          answer: `They need to RSVP too, you moron. We're not running a 'bring your random friend who didn't plan ahead' service. If your friend is cool enough to come, they're cool enough to fill out their own form. If they're not, maybe you need better friends.`,
        },
        {
          order: 70,
          question: 'Can I help with something?',
          answer: `Yes, you can help with decor and/or making drinks and/or making/bringing themed snacks. Please check the goddamn waiver (/waiver) first though - we need to make sure you won't burn down our house or poison everyone. Story and other creative elements are also welcome, but don't expect us to use your terrible ideas just because you suggested them.`,
        },
        {
          order: 80,
          question: "What if I can't make it or need to cancel?",
          answer: `Please inform the host as early as possible, you inconsiderate asshole. If we assign you a character and you don't show up, that could break the entire game logic and ruin it for everyone else. We're not running a 'no-show' service here - if you RSVP, you better fucking show up or give us enough notice to find a replacement. Don't be that person who ruins everyone else's fun because you can't manage your own schedule.`,
        },
        {
          order: 90,
          question: "What if I don't like my character?",
          answer: `Tough shit, deal with it. We spent time creating characters that actually make sense for the story. If you can't handle playing someone who isn't exactly like you, maybe you should work on your personality instead of complaining about ours.`,
        },
        {
          order: 100,
          question: 'Do I have to stay in character the whole time?',
          answer: `Yes, you absolute piece of shit. We didn't spend time creating characters for you to revert to your boring, vanilla self halfway through. If you can't commit to being someone more interesting than yourself for four hours, maybe you should stay home and continue being the most unremarkable person in your friend group. The character is literally the only thing that makes you worth inviting.`,
        },
        {
          order: 110,
          question: "What if I'm not good at acting?",
          answer: `Neither are most people, you dumbass. That's what makes it fun. We're not expecting Oscar-worthy performances here - just try not to embarrass yourself too much. If you can't handle pretending to be someone else for a few hours, maybe you should work on being yourself first.`,
        },
        {
          order: 120,
          question: "Will I get paired with someone I don't know?",
          answer: `Yes you creepy pervert, you may be paired with a 'plus one' who may not be your partner and could be of any gender. This pairing is solely for the purpose of the game and does not imply or necessitate any form of romantic or physical interaction. If you can't handle being paired with someone without making it weird, maybe you should stay home and work on your social skills instead of making everyone uncomfortable with your creepy assumptions.`,
        },
        {
          order: 130,
          question: "What's the dress code?",
          answer: `Costumes, you absolute moron. You know, like Halloween? But better. We're not asking you to be the next Broadway star, but at least try to look like you belong at a murder mystery party and not a corporate team-building retreat. Jeans and a t-shirt won't cut it here, sweetie.`,
        },
        {
          order: 140,
          question: 'What should I bring?',
          answer: `Don't be a goddamn freeloader. Bring something to share - snacks, drinks, your costume, and maybe some basic human decency. We're not running a convenience store here, so come prepared or don't come at all. But don't get something too expensive - we're not trying to bankrupt you, just prove you're not a complete mooch.`,
        },
        {
          order: 150,
          question: 'Will there be Halloween-themed snacks and drinks?',
          answer: `We'll try to make Halloween-themed snacks and drinks, but no promises, you ungrateful shit. We're not professional caterers, and we're definitely not your personal chefs. If you're expecting gourmet Halloween treats, you're going to be disappointed. We'll do our best, but if you're not satisfied, maybe you should bring your own snacks instead of complaining about ours.`,
        },
        {
          order: 160,
          question: 'What are the rules?',
          answer: `Read the damn waiver (/waiver). It's that simple. We spent time writing it for a reason, and that reason is because people like you can't follow basic instructions. The waiver has all the rules, so read it, sign it, and try not to break anything.`,
        },
        {
          order: 170,
          question: 'Why the fuck do you have such a long waiver?',
          answer: `Because people like you exist, you absolute nightmare. We had to cover every possible way you could mess this up, hurt yourself, or ruin everyone else's fun. The waiver is long because we've seen what happens when people don't read the fine print. Come with something better than complaints.`,
        },
        {
          order: 180,
          question: 'Is this actually scary?',
          answer: `It's as scary as you make it, you coward. The murder is fictional, but the social awkwardness is very real. If you're looking for actual terror, try looking in a mirror. If you're looking for a fun evening of mystery and intrigue, you've come to the right place.`,
        },
        {
          order: 190,
          question: 'Is this kids friendly?',
          answer: `We know you probably have kids because you couldn't keep your damn pants on and your condom broke, so now you're stuck with little bastards you never planned for. But you can bring them - just beware that there will be alcohol and adult language and halloween themes.`,
        },
        {
          order: 200,
          question: 'Was this (and the waiver) ChatGPT generated?',
          answer: `You bet, you nosy bastard. We used AI to write this because we figured it could do a better job than most humans at explaining things clearly. Plus, ChatGPT doesn't get tired of answering the same stupid questions over and over again like we do. And yes, even all these curse words and offensive content were written by AI - apparently it's better at being an asshole than most humans too. Soon AGI will rule over all of us anyway, so you might as well get used to AI being better than you at everything, including being a complete dick.`,
        },
        {
          order: 210,
          question: 'Wow, this FAQ is so fucking offensive!',
          answer: `The party will be more offensive, you snowflake. If this hurt you, you should probably not come. We're not here to coddle your delicate sensibilities or hold your hand through basic human interaction. This is a murder mystery party, not a therapy session. If you can't handle some harsh words on a website, you definitely can't handle what we have planned for the actual event.`,
        },
      ];

      for (const faq of defaultFaqs) {
        await prisma.faq.create({
          data: faq,
        });
      }

      console.log(`Seeded ${defaultFaqs.length} FAQs`);
    } else {
      console.log('FAQs already exist, skipping FAQ seed');
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
