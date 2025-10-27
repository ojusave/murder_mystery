const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const characters = [
  {
    displayName: 'Gone "Case" Adams',
    occupation: 'Hotel Owner',
    backstory: 'Your Host for Tonight, husband of Morticia Adams',
  },
  {
    displayName: 'Mala "Ria" Adams',
    occupation: 'Hotel Owner',
    backstory: 'Your Host for Tonight, Wife of Gomez Adams',
  },
  {
    displayName: 'Lurch',
    occupation: 'Butler',
    backstory: 'Works at Hotel Black lotus. The Manager, the butler, he\'s your go-to guy when you need anything.',
  },
  {
    displayName: 'Chef Dumpsterella',
    occupation: 'Hotel Chef',
    backstory: 'Your Chef for Tonight',
  },
  {
    displayName: 'Meghan Sparkle',
    occupation: 'Former Actress now a "Humanitarian" and "Philanthropist"',
    backstory: 'Wife of Harry Grindsor',
  },
  {
    displayName: 'Harry "the spare" Grindsor',
    occupation: 'Ousted Prince of the Royal Grindsor Family',
    backstory: 'Husband to Megan Sparkle. Was 5th in line for the throne, but famously denounced his royal title and called his grandma, Queen Racistabeth, "a colonial warlord with pearls"',
  },
  {
    displayName: 'Tracy Ramoray',
    occupation: 'Mayor of the City',
    backstory: 'Married to Vincent Ramoray',
  },
  {
    displayName: 'Drake Ramoray',
    occupation: 'Lawyer',
    backstory: 'Husband of Tracy Ramoray',
  },
  {
    displayName: 'Barney Stinson',
    occupation: 'Banker at Goliath National Bank',
    backstory: 'Married to Robin Stinson. Well-known Philanderer',
  },
  {
    displayName: 'Robin Stinson',
    occupation: 'Rich Socialite',
    backstory: 'Once a low-budget teen pop singer on regional TV and now a famous socialite after inheriting her father\'s wealth after his death. She is famously known for organizing "Sheet Gala".',
  },
  {
    displayName: 'Todd Kohlhepp',
    occupation: 'Realtor',
    backstory: 'Married to Laura Kohlhepp. The best realtor in the city. There is not a single house in the city that he hasn\'t sold, including the current hotel "Black Lotus" to its owners.',
  },
  {
    displayName: 'Laura Kohlhepp',
    occupation: 'Police Chief',
    backstory: 'Married to Todd Kohlhepp',
  },
  {
    displayName: 'Pornhub Goswimmy',
    occupation: 'Journalist for Poopublic News',
    backstory: 'Famous Articles:\n• Bodies Found Inside Abandoned Mansion Outside City Limits – Police Deny Serial Killer Rumors\n• Sheet Gala Scandal $5 Million \'Charity\' Money Vanishes Overnight\n• Royal Crisis: Prince Forced Out of Line of Succession After Marrying a Commoner',
  },
  {
    displayName: 'E\'mma Artscammer',
    occupation: 'Art Dealer',
    backstory: 'Dealer of fine artwork',
  },
];

async function main() {
  console.log('Seeding characters...');
  
  for (const character of characters) {
    try {
      await prisma.character.create({
        data: {
          displayName: character.displayName,
          traits: {
            occupation: character.occupation,
            backstory: character.backstory,
          },
        },
      });
      console.log(`Created: ${character.displayName}`);
    } catch (error) {
      console.error(`Error creating ${character.displayName}:`, error.message);
    }
  }
  
  console.log('Finished seeding characters!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

