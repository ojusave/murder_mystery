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
      return {
        id: char.id,
        name: char.displayName,
        role: traits?.occupation || '',
        description: traits?.backstory || '',
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

