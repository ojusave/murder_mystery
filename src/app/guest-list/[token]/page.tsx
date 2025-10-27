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

  // Organize characters by category
  const hosts = [
    { name: 'Gone "Case" Adams', role: 'Hotel Owner', description: 'Your Host for Tonight, husband of Mala "Ria" Adams' },
    { name: 'Mala "Ria" Adams', role: 'Hotel Owner', description: 'Your Host for Tonight, Wife of Gone "Case" Adams' },
  ];

  const staff = [
    { name: 'Lurch', role: 'Butler', description: 'Works at Hotel Black lotus. The Manager, the butler, he\'s your go-to guy when you need anything.' },
    { name: 'Martha Scruher\'t', role: 'Hotel Chef', description: 'Your Chef for Tonight' },
  ];

  const guests = [
    { name: 'Meghan Sparkle', role: 'Former Actress now a "Humanitarian" and "Philanthropist"', description: 'Wife of Harry Grindsor' },
    { name: 'Harry "the spare" Grindsor', role: 'Ousted Prince of the Royal Grindsor Family', description: 'Husband to Megan Sparkle. Was 5th in line for the throne, but famously denounced his royal title and called his grandma, Queen Racistabeth, "a colonial warlord with pearls"' },
    { name: 'Ivanka Plump', role: 'Mayor of the City', description: 'Married to Jared Krusher' },
    { name: 'Jared Krusher', role: 'Lawyer', description: 'Husband of Ivanka Plump' },
    { name: 'Barney Stinson', role: 'Banker at Goliath National Bank', description: 'Married to Robin Stinson. Well-known Philanderer' },
    { name: 'Robin Stinson', role: 'Rich Socialite', description: 'Once a low-budget teen pop singer on regional TV and now a famous socialite after inheriting her father\'s wealth after his death. She is famously known for organizing "Sheet Gala".' },
    { name: 'Todd Kohlhepp', role: 'Realtor', description: 'Married to Laura Kohlhepp. The best realtor in the city. There is not a single house in the city that he hasn\'t sold, including the current hotel "Black Lotus" to its owners.' },
    { name: 'Laura Kohlhepp', role: 'Police Chief', description: 'Married to Todd Kohlhepp' },
    { name: 'Pornhub Goswimmy', role: 'Journalist for Poopublic News', description: 'Famous Articles:\n• Bodies Found Inside Abandoned Mansion Outside City Limits – Police Deny Serial Killer Rumors\n• Sheet Gala Scandal $5 Million \'Charity\' Money Vanishes Overnight\n• Royal Crisis: Prince Forced Out of Line of Succession After Marrying a Commoner' },
    { name: 'E\'mma Artscammer', role: 'Art Dealer', description: 'Dealer of fine artwork' },
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
                  {hosts.map((character, index) => (
                    <TableRow key={index} className="border-gray-700 hover:bg-gray-800/30">
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
                  {staff.map((character, index) => (
                    <TableRow key={index} className="border-gray-700 hover:bg-gray-800/30">
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
                  {guests.map((character, index) => (
                    <TableRow key={index} className="border-gray-700 hover:bg-gray-800/30">
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

