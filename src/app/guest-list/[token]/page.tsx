import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface GuestListPortalProps {
  params: Promise<{
    token: string;
  }>;
}

async function getGuestByToken(token: string) {
  const guest = await prisma.guest.findUnique({
    where: { token },
    include: {
      character: true,
    },
  });

  return guest;
}

// Public descriptions that should be preserved (not from database backstory)
const PUBLIC_DESCRIPTIONS: Record<string, string> = {
  'Gomez Adams': 'Your Host for Tonight, husband of Morticia Adams',
  'Gone "Case" Adams': 'Your Host for Tonight, husband of Mala "Ria" Adams',
  'Morticia Adams': 'Your Host for Tonight, Wife of Gomez Adams',
  'Mala "Ria" Adams': 'Your Host for Tonight, Wife of Gone "Case" Adams',
  'Creep Lurch': 'Works at Hotel Black lotus. The Manager, the butler, he\'s your go-to guy when you need anything.',
  'Lurch': 'Works at Hotel Black lotus. The Manager, the butler, he\'s your go-to guy when you need anything.',
  'Martha Scruher\'t': 'Your Chef for Tonight',
  'Meghan Sparkle': 'Wife of Harry Grindsor',
  'Harry "the spare" Grindsor': 'Husband to Megan Sparkle. Was 5th in line for the throne, but famously denounced his royal title and called his grandma, Queen Racistabeth, "a colonial warlord with pearls"',
  'Harry Grindsor': 'Husband to Megan Sparkle. Was 5th in line for the throne, but famously denounced his royal title and called his grandma, Queen Racistabeth, "a colonial warlord with pearls"',
  'Ivanka Plump': 'Married to Jared Krusher',
  'Jared Krusher': 'Husband of Ivanka Plump',
  'Barney Stinson': 'Married to Robin Stinson. Well-known Philanderer',
  'Robin Stinson': 'Once a low-budget teen pop singer on regional TV and now a famous socialite after inheriting her father\'s wealth after his death. She is famously known for organizing "Sheet Gala".',
  'Lala Kroft': 'Once a low-budget teen pop singer on regional TV and now a famous socialite after inheriting her father\'s wealth after his death. She is famously known for organizing "Sheet Gala".',
  'Todd Kohlhepp': 'Married to Laura Kohlhepp. The best realtor in the city. There is not a single house in the city that he hasn\'t sold, including the current hotel "Black Lotus" to its owners.',
  'Bribara Kohlhepp': 'Married to Todd Kohlhepp',
  'Laura Kohlhepp': 'Married to Todd Kohlhepp',
  'Pornhub Goswimmy': 'Famous Articles:\n• Bodies Found Inside Abandoned Mansion Outside City Limits – Police Deny Serial Killer Rumors\n• Sheet Gala Scandal $5 Million \'Charity\' Money Vanishes Overnight\n• Royal Crisis: Prince Forced Out of Line of Succession After Marrying a Commoner',
  'E\'mma Artscammer': 'Dealer of fine artwork',
};

async function getAllAssignedCharacters() {
  const characters = await prisma.character.findMany({
    where: {
      guestId: { not: null },
    },
    include: {
      guest: {
        select: {
          status: true,
        },
      },
    },
    orderBy: {
      displayName: 'asc',
    },
  });

  return characters
    .filter(char => char.guest?.status === 'approved')
    .map(char => {
      const traits = char.traits as any;
      const displayName = char.displayName;
      // Use public description if available, otherwise use occupation as fallback
      const publicDescription = PUBLIC_DESCRIPTIONS[displayName] || traits?.occupation || '';
      
      return {
        id: char.id,
        name: displayName,
        role: traits?.occupation || '',
        description: publicDescription,
      };
    });
}

function categorizeCharacters(characters: Array<{ id: string; name: string; role: string; description: string }>) {
  const hosts: Array<{ id: string; name: string; role: string; description: string }> = [];
  const staff: Array<{ id: string; name: string; role: string; description: string }> = [];
  const guests: Array<{ id: string; name: string; role: string; description: string }> = [];

  characters.forEach(char => {
    const roleLower = char.role.toLowerCase();
    if (roleLower.includes('hotel owner') || roleLower.includes('host')) {
      hosts.push(char);
    } else if (roleLower.includes('butler') || roleLower.includes('chef') || roleLower.includes('staff') || roleLower.includes('manager')) {
      staff.push(char);
    } else {
      guests.push(char);
    }
  });

  return { hosts, staff, guests };
}

export default async function GuestListPortal({ params }: GuestListPortalProps) {
  const { token } = await params;
  const guest = await getGuestByToken(token);
  
  // Verify that the guest has been accepted and has a character assigned
  if (!guest || guest.status !== 'approved' || !guest.character) {
    notFound();
  }

  // Fetch all assigned characters from database
  const allCharacters = await getAllAssignedCharacters();
  const { hosts, staff, guests } = categorizeCharacters(allCharacters);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">The Black Lotus</h1>
          <div className="text-gray-300">
            Guest List
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <Card className="bg-black/30 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-white text-center">
              Guest List
            </CardTitle>
            <CardDescription className="text-gray-300 text-center">
              Host, Staff and Guests for Black Lotus Hotel Grand Re-Opening
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Hosts Section */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-white mb-4">Host</h3>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 hover:bg-gray-800/50">
                    <TableHead className="text-white">Name</TableHead>
                    <TableHead className="text-white">Role</TableHead>
                    <TableHead className="text-white">Public Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hosts.map((character) => (
                    <TableRow key={character.id || character.name} className="border-gray-700 hover:bg-gray-800/30">
                      <TableCell className="text-white font-medium">{character.name}</TableCell>
                      <TableCell className="text-gray-300">{character.role}</TableCell>
                      <TableCell className="text-gray-300 whitespace-pre-line">{character.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Staff Section */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-white mb-4">Staff</h3>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 hover:bg-gray-800/50">
                    <TableHead className="text-white">Name</TableHead>
                    <TableHead className="text-white">Role</TableHead>
                    <TableHead className="text-white">Public Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staff.map((character) => (
                    <TableRow key={character.id || character.name} className="border-gray-700 hover:bg-gray-800/30">
                      <TableCell className="text-white font-medium">{character.name}</TableCell>
                      <TableCell className="text-gray-300">{character.role}</TableCell>
                      <TableCell className="text-gray-300 whitespace-pre-line">{character.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Guests Section */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-white mb-4">Guests</h3>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 hover:bg-gray-800/50">
                    <TableHead className="text-white">Name</TableHead>
                    <TableHead className="text-white">Role</TableHead>
                    <TableHead className="text-white">Public Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {guests.map((character) => (
                    <TableRow key={character.id || character.name} className="border-gray-700 hover:bg-gray-800/30">
                      <TableCell className="text-white font-medium">{character.name}</TableCell>
                      <TableCell className="text-gray-300">{character.role}</TableCell>
                      <TableCell className="text-gray-300 whitespace-pre-line">{character.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-gray-700 mt-16">
        <div className="text-center text-gray-400">
          <p>View your personal guest portal for more details</p>
        </div>
      </footer>
    </div>
  );
}

