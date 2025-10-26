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

async function getAllApprovedGuestsWithCharacters() {
  const guests = await prisma.guest.findMany({
    where: {
      status: 'approved',
      character: {
        isNot: null,
      },
    },
    include: {
      character: true,
    },
    orderBy: {
      character: {
        displayName: 'asc',
      },
    },
  });

  return guests;
}

export default async function GuestListPortal({ params }: GuestListPortalProps) {
  const { token } = await params;
  const guest = await getGuestByToken(token);
  
  // Verify that the guest has been accepted and has a character assigned
  if (!guest || guest.status !== 'approved' || !guest.character) {
    notFound();
  }

  const allGuests = await getAllApprovedGuestsWithCharacters();

  // Get host information (these should be added manually or from config)
  const hosts = [
    { name: 'BrO-J', occupation: 'Host' },
    { name: 'Half-Chai', occupation: 'Host' },
  ];

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
              Attendees for The Black Lotus Murder Mystery
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-white mb-4">Hosts</h3>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 hover:bg-gray-800/50">
                    <TableHead className="text-white">Character Name</TableHead>
                    <TableHead className="text-white">Character Occupation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hosts.map((host, index) => (
                    <TableRow key={index} className="border-gray-700 hover:bg-gray-800/30">
                      <TableCell className="text-white font-medium">{host.name}</TableCell>
                      <TableCell className="text-gray-300">{host.occupation}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold text-white mb-4">Guests</h3>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 hover:bg-gray-800/50">
                    <TableHead className="text-white">Character Name</TableHead>
                    <TableHead className="text-white">Character Occupation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allGuests.map((guest) => {
                    // Extract occupation from character traits
                    const occupation = guest.character?.traits && typeof guest.character.traits === 'object' 
                      ? (guest.character.traits as any).occupation || 'N/A'
                      : 'N/A';
                    
                    return (
                      <TableRow key={guest.id} className="border-gray-700 hover:bg-gray-800/30">
                        <TableCell className="text-white font-medium">{guest.character?.displayName || 'N/A'}</TableCell>
                        <TableCell className="text-gray-300">{occupation}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            <div className="mt-8 bg-purple-900/30 rounded-lg p-4">
              <p className="text-gray-300 text-sm text-center">
                This page shows all approved guests and their character assignments. 
                Real names are hidden for privacy - only character names are displayed.
              </p>
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

