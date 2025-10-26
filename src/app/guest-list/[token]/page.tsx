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

export default async function GuestListPortal({ params }: GuestListPortalProps) {
  const { token } = await params;
  const guest = await getGuestByToken(token);
  
  // Verify that the guest has been accepted and has a character assigned
  if (!guest || guest.status !== 'approved' || !guest.character) {
    notFound();
  }

  // Hardcoded character list as requested
  const allCharacters = [
    { name: 'Gomez Adams', occupation: 'Hotel Owner', whatYouKnow: 'Your Host for Tonight' },
    { name: 'Morticia Adams', occupation: 'Hotel Owner', whatYouKnow: 'Your Host for Tonight' },
    { name: 'Lurch', occupation: 'Butler', whatYouKnow: 'Hotel Butler' },
    { name: 'Chef Dumpsterella', occupation: 'Hotel Chef', whatYouKnow: 'Hotel Chef' },
    { name: 'Meghan Sparkle', occupation: 'Failed Actress', whatYouKnow: 'Wife of Harry Windsor' },
    { name: 'Harry "the spare" windsor', occupation: 'Ex Prince', whatYouKnow: 'Husband to Meghan Sparkle. The second in line for the royal succession, but ousted by the royals because of his marriage to Meghan Sparkle' },
    { name: 'Mayor Dixie', occupation: 'Mayor', whatYouKnow: '' },
    { name: 'Vincent Drake', occupation: 'Banker', whatYouKnow: '' },
    { name: 'Barney Stinson', occupation: 'Philanderer Husband', whatYouKnow: '' },
    { name: 'Robin Stinson', occupation: 'Rich Socialite', whatYouKnow: 'Famous socialite and the organizer of "Sheet Gala". But her last gala was a scandal. The money was transferred to an offshore account and she has been accused of embezzling funds' },
    { name: 'Todd Kohlhepp', occupation: 'Realtor', whatYouKnow: 'The best realtor in the city. There is not a single house that he hasn\'t sold, including the current hotel "Black Lotus" to its owners.' },
    { name: 'Laura Kohlhepp', occupation: 'Police Chief', whatYouKnow: 'Commissioner of Police' },
    { name: 'Pornhub Goswimmy', occupation: 'Journalist', whatYouKnow: '• Serial Killer in the city who finds and tortures people in basements\n• Last Sheet-Gala organized by Robin Stinson, all the money was embezzled, but by whom ?\n• Is all well between Megan and Prince Harry ?' },
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
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 hover:bg-gray-800/50">
                    <TableHead className="text-white">Character Name</TableHead>
                    <TableHead className="text-white">Occupation</TableHead>
                    <TableHead className="text-white">What you know ?</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allCharacters.map((character, index) => (
                    <TableRow key={index} className="border-gray-700 hover:bg-gray-800/30">
                      <TableCell className="text-white font-medium">{character.name}</TableCell>
                      <TableCell className="text-gray-300">{character.occupation}</TableCell>
                      <TableCell className="text-gray-300 whitespace-pre-line">{character.whatYouKnow}</TableCell>
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

