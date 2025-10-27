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
    { name: 'Gone "Case" Adams', occupation: 'Hotel Owner', whatYouKnow: 'Your Host for Tonight, husband of Mala "Ria" Adams' },
    { name: 'Mala "Ria" Adams', occupation: 'Hotel Owner', whatYouKnow: 'Your Host for Tonight, Wife of Gomez "Case" Adams' },
    { name: 'Lurch', occupation: 'Butler', whatYouKnow: 'Works at Hotel Black lotus. The Manager, the butler, he\'s your go-to guy when you need anything.' },
    { name: 'Chef Dumpsterella', occupation: 'Hotel Chef', whatYouKnow: 'Your Chef for Tonight' },
    { name: 'Meghan Sparkle', occupation: 'Former Actress now a "Humanitarian" and "Philanthropist"', whatYouKnow: 'Wife of Harry Grindsor' },
    { name: 'Harry "the spare" Grindsor', occupation: 'Ousted Prince of the Royal Grindsor Family', whatYouKnow: 'Husband to Meghan Sparkle. Ousted from the royal family by his brother Gilliam and Katie "future ice queen" Grindsor because of his marriage to Meghan. Currently 5th in line for the Throne.' },
    { name: 'Tracy Ramoray', occupation: 'Mayor of the City', whatYouKnow: 'Married to Vincent Ramoray' },
    { name: 'Drake Ramoray', occupation: 'Lawyer', whatYouKnow: 'Husband of Tracy Ramoray' },
    { name: 'Barney Stinson', occupation: 'Banker at Goliath National Bank', whatYouKnow: 'Married to Robin Stinson. Well-known Philanderer' },
    { name: 'Robin Stinson', occupation: 'Rich Socialite', whatYouKnow: 'Once a low-budget teen pop singer on regional TV and now a famous socialite after inheriting her father\'s wealth after his death. She is famously known for organizing "Sheet Gala".' },
    { name: 'Todd Kohlhepp', occupation: 'Realtor', whatYouKnow: 'Married to Laura Kohlhepp. The best realtor in the city. There is not a single house in the city that he hasn\'t sold, including the current hotel "Black Lotus" to its owners.' },
    { name: 'Laura Kohlhepp', occupation: 'Police Chief', whatYouKnow: 'Married to Todd Kohlhepp' },
    { name: 'Pornhub Goswimmy', occupation: 'Journalist for Poopublic News', whatYouKnow: 'Famous Articles:\n• Serial Killer in the city who finds and tortures people in basements\n• Last Sheet-Gala organized by Robin Stinson, all the money was embezzled, but by whom?\n• Is all well between Meghan and Prince Harry?' },
    { name: 'E\'mma Artscammer', occupation: 'Art Dealer', whatYouKnow: '' },
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
              Host, Staff and Guests for Black Lotus Hotel Grand Re-Opening
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 hover:bg-gray-800/50">
                    <TableHead className="text-white">Name</TableHead>
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

