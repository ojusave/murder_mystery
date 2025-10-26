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

async function getAllCharacters() {
  const characters = await prisma.character.findMany({
    orderBy: {
      displayName: 'asc',
    },
  });

  return characters;
}

export default async function GuestListPortal({ params }: GuestListPortalProps) {
  const { token } = await params;
  const guest = await getGuestByToken(token);
  
  // Verify that the guest has been accepted and has a character assigned
  if (!guest || guest.status !== 'approved' || !guest.character) {
    notFound();
  }

  const allCharacters = await getAllCharacters();

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
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 hover:bg-gray-800/50">
                    <TableHead className="text-white">Character Name</TableHead>
                    <TableHead className="text-white">Character Occupation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allCharacters.map((character) => {
                    // Extract occupation from character traits
                    const occupation = character.traits && typeof character.traits === 'object' 
                      ? (character.traits as any).occupation || 'N/A'
                      : 'N/A';
                    
                    return (
                      <TableRow key={character.id} className="border-gray-700 hover:bg-gray-800/30">
                        <TableCell className="text-white font-medium">{character.displayName}</TableCell>
                        <TableCell className="text-gray-300">{occupation}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            <div className="mt-8 bg-purple-900/30 rounded-lg p-4">
              <p className="text-gray-300 text-sm text-center">
                This page shows all characters for The Black Lotus Murder Mystery.
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

