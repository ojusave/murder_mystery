'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Guest {
  id: string;
  email: string;
  legalName: string;
  wantsToPlay: string;
  status: string;
  token: string;
  createdAt: string;
  bringOptions?: string[];
  bringOther?: string;
  volunteerDecor?: boolean;
  willDressUp?: string;
  genderPref?: string;
  genderOther?: string;
  charNamePref?: string;
  charNameMode?: string;
  charNameOther?: string;
  charInfoTiming?: string;
  talents?: string[];
  talentsOther?: string;
  ackPairing?: boolean;
  ackAdultThemes?: boolean;
  ackWaiver?: boolean;
  waiverVersion?: string;
  suggestions?: string;
  character?: {
    id: string;
    displayName: string;
    traits: Record<string, unknown>;
    notesPrivate?: string;
    assignedAt?: string;
  };
}

export default function AdminDashboard() {
  const sessionResult = useSession();
  const { data: session, status } = sessionResult || { data: null, status: 'loading' };
  const router = useRouter();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [characterDialogOpen, setCharacterDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editCharacterDialogOpen, setEditCharacterDialogOpen] = useState(false);
  const [characterForm, setCharacterForm] = useState({
    displayName: '',
    backstory: '',
    hostNotes: '',
  });
  const [selectedGuests, setSelectedGuests] = useState<string[]>([]);
  const [bulkEmailDialogOpen, setBulkEmailDialogOpen] = useState(false);
  const [bulkEmailForm, setBulkEmailForm] = useState({
    subject: '',
    message: '',
  });
  const [editForm, setEditForm] = useState({
    email: '',
    legalName: '',
    wantsToPlay: '',
    bringOptions: [] as string[],
    bringOther: '',
    volunteerDecor: false,
    willDressUp: '',
    genderPref: '',
    charNamePref: '',
    charNameMode: '',
    charInfoTiming: '',
    talents: [] as string[],
    talentsOther: '',
    ackPairing: false,
    ackAdultThemes: false,
    ackWaiver: false,
    waiverVersion: '',
    suggestions: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      console.log('Session found:', session);
      fetchGuests();
    } else {
      console.log('No session found, status:', status);
    }
  }, [session, status]);

  const fetchGuests = async () => {
    try {
      console.log('Fetching guests...');
      const response = await fetch('/api/admin/guests', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Guests data:', data);
        setGuests(data);
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        alert(`Failed to fetch guests: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error fetching guests:', error);
      alert('Network error fetching guests');
    } finally {
      setLoading(false);
    }
  };

  const updateGuestStatus = async (guestId: string, status: string) => {
    try {
      const response = await fetch('/api/admin/guests', {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          guestId, 
          action: 'updateStatus',
          data: { status }
        }),
      });

      if (response.ok) {
        fetchGuests();
      }
    } catch (error) {
      console.error('Error updating guest status:', error);
    }
  };

  const deleteGuest = async (guestId: string) => {
    if (!confirm('Are you sure you want to delete this registration? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/guests', {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ guestId }),
      });

      if (response.ok) {
        fetchGuests();
      } else {
        const error = await response.json();
        alert(`Failed to delete registration: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting guest:', error);
      alert('Failed to delete registration');
    }
  };

  // Bulk selection functions
  const handleSelectGuest = (guestId: string) => {
    setSelectedGuests(prev => 
      prev.includes(guestId) 
        ? prev.filter(id => id !== guestId)
        : [...prev, guestId]
    );
  };

  const handleSelectAll = () => {
    if (selectedGuests.length === guests.length) {
      setSelectedGuests([]);
    } else {
      setSelectedGuests(guests.map(guest => guest.id));
    }
  };

  const handleBulkEmail = async () => {
    if (selectedGuests.length === 0) return;
    
    try {
      const response = await fetch('/api/admin/bulk-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestIds: selectedGuests,
          subject: bulkEmailForm.subject,
          message: bulkEmailForm.message,
        }),
      });

      if (response.ok) {
        setBulkEmailDialogOpen(false);
        setBulkEmailForm({ subject: '', message: '' });
        setSelectedGuests([]);
        alert(`Bulk email sent to ${selectedGuests.length} guests!`);
      } else {
        console.error('Failed to send bulk email');
      }
    } catch (error) {
      console.error('Error sending bulk email:', error);
    }
  };

  const openEditDialog = (guest: Guest) => {
    setSelectedGuest(guest);
    setEditForm({
      email: guest.email,
      legalName: guest.legalName,
      wantsToPlay: guest.wantsToPlay,
      bringOptions: guest.bringOptions || [],
      bringOther: guest.bringOther || '',
      volunteerDecor: guest.volunteerDecor || false,
      willDressUp: guest.willDressUp || '',
      genderPref: guest.genderPref || '',
      charNamePref: guest.charNamePref || '',
      charNameMode: guest.charNameMode || '',
      charInfoTiming: guest.charInfoTiming || '',
      talents: guest.talents || [],
      talentsOther: guest.talentsOther || '',
      ackPairing: guest.ackPairing || false,
      ackAdultThemes: guest.ackAdultThemes || false,
      ackWaiver: guest.ackWaiver || false,
      waiverVersion: guest.waiverVersion || '',
      suggestions: guest.suggestions || '',
    });
    setEditDialogOpen(true);
  };

  const updateGuestDetails = async () => {
    if (!selectedGuest) return;

    try {
      const response = await fetch('/api/admin/guests', {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guestId: selectedGuest.id,
          action: 'updateDetails',
          data: editForm,
        }),
      });

      if (response.ok) {
        setEditDialogOpen(false);
        setEditForm({
          email: '',
          legalName: '',
          wantsToPlay: '',
          bringOptions: [],
          bringOther: '',
          volunteerDecor: false,
          willDressUp: '',
          genderPref: '',
          charNamePref: '',
          charNameMode: '',
          charInfoTiming: '',
          talents: [],
          talentsOther: '',
          ackPairing: false,
          ackAdultThemes: false,
          ackWaiver: false,
          waiverVersion: '',
          suggestions: '',
        });
        fetchGuests();
      }
    } catch (error) {
      console.error('Error updating guest details:', error);
    }
  };

  const assignCharacter = async () => {
    if (!selectedGuest) return;

    try {
      const response = await fetch('/api/admin/characters', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guestId: selectedGuest.id,
          displayName: characterForm.displayName,
          backstory: characterForm.backstory,
          hostNotes: characterForm.hostNotes,
        }),
      });

      if (response.ok) {
        setCharacterDialogOpen(false);
        setCharacterForm({ displayName: '', backstory: '', hostNotes: '' });
        fetchGuests();
      }
    } catch (error) {
      console.error('Error assigning character:', error);
    }
  };

  const openEditCharacterDialog = (guest: Guest) => {
    if (!guest.character) return;
    
    setSelectedGuest(guest);
    setCharacterForm({
      displayName: guest.character.displayName,
      backstory: typeof guest.character.traits === 'object' 
        ? JSON.stringify(guest.character.traits, null, 2) 
        : guest.character.traits || '',
      hostNotes: guest.character.notesPrivate || '',
    });
    setEditCharacterDialogOpen(true);
  };

  const updateCharacter = async () => {
    if (!selectedGuest?.character) return;

    try {
      const response = await fetch('/api/admin/characters', {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          characterId: selectedGuest.character.id,
          displayName: characterForm.displayName,
          backstory: characterForm.backstory,
          hostNotes: characterForm.hostNotes,
        }),
      });

      if (response.ok) {
        setEditCharacterDialogOpen(false);
        setCharacterForm({ displayName: '', backstory: '', hostNotes: '' });
        fetchGuests();
      }
    } catch (error) {
      console.error('Error updating character:', error);
    }
  };

  const deleteCharacter = async (characterId: string) => {
    if (!confirm('Are you sure you want to delete this character assignment?')) return;

    try {
      const response = await fetch('/api/admin/characters', {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ characterId }),
      });

      if (response.ok) {
        fetchGuests();
      }
    } catch (error) {
      console.error('Error deleting character:', error);
    }
  };

  const filteredGuests = guests.filter(guest =>
    guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.legalName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-600';
      case 'rejected':
        return 'bg-red-600';
      case 'pending':
      default:
        return 'bg-yellow-600';
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Black Lotus Admin</h1>
          <div className="flex gap-4">
            <Link href="/">
              <Button variant="outline" className="text-gray-800 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-400">
                View Site
              </Button>
            </Link>
            <Button
              onClick={() => router.push('/api/auth/signout')}
              variant="outline"
              className="text-gray-800 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-400"
            >
              Sign Out
            </Button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="guests" className="space-y-8">
          <TabsList className="bg-gray-800/50 backdrop-blur-sm border-gray-600">
            <TabsTrigger value="guests" className="text-gray-200 data-[state=active]:bg-purple-600 data-[state=active]:text-white">RSVPs</TabsTrigger>
            <TabsTrigger value="characters" className="text-gray-200 data-[state=active]:bg-purple-600 data-[state=active]:text-white">Characters</TabsTrigger>
            <TabsTrigger value="settings" className="text-gray-200 data-[state=active]:bg-purple-600 data-[state=active]:text-white">Settings</TabsTrigger>
          </TabsList>

          {/* RSVPs Tab */}
          <TabsContent value="guests" className="space-y-6">
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-600">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">
                  RSVP Management
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Review and manage guest RSVPs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <Input
                    placeholder="Search by email or name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>

                {/* Bulk Actions */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-white">
                      <input
                        type="checkbox"
                        checked={selectedGuests.length === filteredGuests.length && filteredGuests.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500"
                      />
                      Select All ({selectedGuests.length} selected)
                    </label>
                  </div>
                  <div className="flex gap-2">
                    {selectedGuests.length > 0 && (
                      <Button
                        onClick={() => setBulkEmailDialogOpen(true)}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        Bulk Email ({selectedGuests.length})
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredGuests.map((guest) => (
                    <Card key={guest.id} className="bg-gray-800/50 border-gray-600">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={selectedGuests.includes(guest.id)}
                              onChange={() => handleSelectGuest(guest.id)}
                              className="mt-1 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500"
                            />
                            <div>
                              <h3 className="text-lg font-semibold text-white">
                                {guest.legalName}
                              </h3>
                              <p className="text-gray-300">{guest.email}</p>
                              <p className="text-sm text-gray-400">
                                Submitted: {new Date(guest.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Badge className={`${getStatusColor(guest.status)} text-white`}>
                            {guest.status}
                          </Badge>
                        </div>

                        <div className="mb-4">
                          <p className="text-gray-300">
                            <strong>Interest:</strong> {guest.wantsToPlay}
                          </p>
                        </div>

                        <div className="flex gap-2 flex-wrap">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDialog(guest)}
                            className="text-gray-800 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-400"
                          >
                            Edit Details
                          </Button>
                          
                          {guest.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => updateGuestStatus(guest.id, 'approved')}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => updateGuestStatus(guest.id, 'rejected')}
                              >
                                Reject
                              </Button>
                            </>
                          )}

                          {guest.status === 'approved' && !guest.character && (
                            <Dialog open={characterDialogOpen} onOpenChange={setCharacterDialogOpen}>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  onClick={() => setSelectedGuest(guest)}
                                  className="bg-purple-600 hover:bg-purple-700 text-white"
                                >
                                  Assign Character
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-gray-800 border-gray-600">
                                <DialogHeader>
                                  <DialogTitle className="text-white">
                                    Assign Character to {guest.legalName}
                                  </DialogTitle>
                                  <DialogDescription className="text-gray-300">
                                    Create a character assignment for this guest
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="displayName" className="text-white">
                                      Character Name
                                    </Label>
                                    <Input
                                      id="displayName"
                                      value={characterForm.displayName}
                                      onChange={(e) => setCharacterForm({
                                        ...characterForm,
                                        displayName: e.target.value
                                      })}
                                      className="bg-gray-700 border-gray-600 text-white"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="backstory" className="text-white">
                                      Backstory / History
                                    </Label>
                                    <Textarea
                                      id="backstory"
                                      value={characterForm.backstory}
                                      onChange={(e) => setCharacterForm({
                                        ...characterForm,
                                        backstory: e.target.value
                                      })}
                                      className="bg-gray-700 border-gray-600 text-white"
                                      rows={4}
                                      placeholder="Describe the character's background, history, and personality..."
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="hostNotes" className="text-white">
                                      Host Notes
                                    </Label>
                                    <Textarea
                                      id="hostNotes"
                                      value={characterForm.hostNotes}
                                      onChange={(e) => setCharacterForm({
                                        ...characterForm,
                                        hostNotes: e.target.value
                                      })}
                                      className="bg-gray-700 border-gray-600 text-white"
                                      rows={3}
                                      placeholder="Private notes for the host about this character..."
                                    />
                                  </div>
                                  <Button
                                    onClick={assignCharacter}
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                                  >
                                    Assign Character
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}

                          {guest.character && (
                            <>
                              <Badge variant="outline" className="text-purple-300 border-purple-300">
                                Character: {guest.character.displayName}
                              </Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openEditCharacterDialog(guest)}
                                className="text-purple-800 bg-purple-100 border-purple-300 hover:bg-purple-200 hover:text-purple-900 hover:border-purple-400"
                              >
                                Edit Character
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteCharacter(guest.character!.id)}
                                className="text-red-800 bg-red-100 border-red-300 hover:bg-red-200 hover:text-red-900 hover:border-red-400"
                              >
                                Delete Character
                              </Button>
                            </>
                          )}

                          <Link href={`/guest/${guest.token}`}>
                            <Button size="sm" variant="outline" className="text-gray-800 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-400">
                              View Guest Portal
                            </Button>
                          </Link>
                          
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteGuest(guest.id)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            Delete Registration
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Characters Tab */}
          <TabsContent value="characters">
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-600">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">
                  Character Management
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Manage character assignments and details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {guests.filter(guest => guest.character).map((guest) => (
                    <Card key={guest.id} className="bg-gray-800/50 border-gray-600">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-white">
                              {guest.character?.displayName}
                            </h3>
                            <p className="text-gray-300">Assigned to: {guest.legalName}</p>
                            <p className="text-sm text-gray-400">{guest.email}</p>
                          </div>
                          <Badge className="bg-purple-600 text-white">
                            Assigned
                          </Badge>
                        </div>

                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-300 mb-2">Character Traits:</h4>
                          <div className="bg-gray-700 p-3 rounded text-sm text-gray-200">
                            <pre className="whitespace-pre-wrap">
                              {JSON.stringify(guest.character?.traits, null, 2)}
                            </pre>
                          </div>
                        </div>

                        {guest.character?.notesPrivate && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-300 mb-2">Private Notes:</h4>
                            <p className="text-sm text-gray-200 bg-gray-700 p-3 rounded">
                              {guest.character.notesPrivate}
                            </p>
                          </div>
                        )}

                        <div className="flex gap-2 flex-wrap">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditCharacterDialog(guest)}
                            className="text-purple-300 border-purple-300 hover:bg-purple-300 hover:text-gray-900"
                          >
                            Edit Character
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteCharacter(guest.character!.id)}
                            className="text-red-300 border-red-300 hover:bg-red-300 hover:text-gray-900"
                          >
                            Delete Character
                          </Button>
                          <Link href={`/guest/${guest.token}`}>
                            <Button size="sm" variant="outline" className="text-gray-800 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-400">
                              View Guest Portal
                            </Button>
                          </Link>
                          
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteGuest(guest.id)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            Delete Registration
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {guests.filter(guest => guest.character).length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-300">No characters assigned yet.</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Assign characters to approved guests from the RSVPs tab.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-600">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">
                  Settings
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Configure event settings and email preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Settings panel coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Edit Guest Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-600 max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">
              Edit Guest Details - {selectedGuest?.legalName}
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Update guest information and preferences
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-email" className="text-white">Email</Label>
                <Input
                  id="edit-email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="edit-legalName" className="text-white">Legal Name</Label>
                <Input
                  id="edit-legalName"
                  value={editForm.legalName}
                  onChange={(e) => setEditForm({...editForm, legalName: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-wantsToPlay" className="text-white">Wants to Play</Label>
              <Input
                id="edit-wantsToPlay"
                value={editForm.wantsToPlay}
                onChange={(e) => setEditForm({...editForm, wantsToPlay: e.target.value})}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="edit-genderPref" className="text-white">Gender Preference</Label>
              <Input
                id="edit-genderPref"
                value={editForm.genderPref}
                onChange={(e) => setEditForm({...editForm, genderPref: e.target.value})}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="edit-charNamePref" className="text-white">Character Name Preference</Label>
              <Input
                id="edit-charNamePref"
                value={editForm.charNamePref}
                onChange={(e) => setEditForm({...editForm, charNamePref: e.target.value})}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="edit-willDressUp" className="text-white">Will Dress Up</Label>
              <Input
                id="edit-willDressUp"
                value={editForm.willDressUp}
                onChange={(e) => setEditForm({...editForm, willDressUp: e.target.value})}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="edit-suggestions" className="text-white">Suggestions</Label>
              <Textarea
                id="edit-suggestions"
                value={editForm.suggestions}
                onChange={(e) => setEditForm({...editForm, suggestions: e.target.value})}
                className="bg-gray-700 border-gray-600 text-white"
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={updateGuestDetails}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
                className="text-gray-800 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-400"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Character Dialog */}
      <Dialog open={editCharacterDialogOpen} onOpenChange={setEditCharacterDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-600">
          <DialogHeader>
            <DialogTitle className="text-white">
              Edit Character - {selectedGuest?.character?.displayName}
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Update character details and traits
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-char-displayName" className="text-white">
                Character Name
              </Label>
              <Input
                id="edit-char-displayName"
                value={characterForm.displayName}
                onChange={(e) => setCharacterForm({
                  ...characterForm,
                  displayName: e.target.value
                })}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="edit-char-backstory" className="text-white">
                Backstory / History
              </Label>
              <Textarea
                id="edit-char-backstory"
                value={characterForm.backstory}
                onChange={(e) => setCharacterForm({
                  ...characterForm,
                  backstory: e.target.value
                })}
                className="bg-gray-700 border-gray-600 text-white"
                rows={6}
                placeholder="Describe the character's background, history, and personality..."
              />
            </div>
            <div>
              <Label htmlFor="edit-char-hostNotes" className="text-white">
                Host Notes
              </Label>
              <Textarea
                id="edit-char-hostNotes"
                value={characterForm.hostNotes}
                onChange={(e) => setCharacterForm({
                  ...characterForm,
                  hostNotes: e.target.value
                })}
                className="bg-gray-700 border-gray-600 text-white"
                rows={3}
                placeholder="Private notes for the host about this character..."
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={updateCharacter}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Update Character
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditCharacterDialogOpen(false)}
                className="text-gray-800 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-400"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Email Dialog */}
      <Dialog open={bulkEmailDialogOpen} onOpenChange={setBulkEmailDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-600">
          <DialogHeader>
            <DialogTitle className="text-white">
              Send Bulk Email
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Send an email to {selectedGuests.length} selected guests
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="bulk-email-subject" className="text-white">
                Subject
              </Label>
              <Input
                id="bulk-email-subject"
                value={bulkEmailForm.subject}
                onChange={(e) => setBulkEmailForm({
                  ...bulkEmailForm,
                  subject: e.target.value
                })}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Email subject..."
              />
            </div>
            <div>
              <Label htmlFor="bulk-email-message" className="text-white">
                Message
              </Label>
              <Textarea
                id="bulk-email-message"
                value={bulkEmailForm.message}
                onChange={(e) => setBulkEmailForm({
                  ...bulkEmailForm,
                  message: e.target.value
                })}
                className="bg-gray-700 border-gray-600 text-white"
                rows={8}
                placeholder="Your message to the guests..."
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleBulkEmail}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Send Email to {selectedGuests.length} Guests
              </Button>
              <Button
                variant="outline"
                onClick={() => setBulkEmailDialogOpen(false)}
                className="text-gray-800 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-400"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-gray-700 mt-16">
        <div className="text-center text-gray-400">
        </div>
      </footer>
    </div>
  );
}
