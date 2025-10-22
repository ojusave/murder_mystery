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

interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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
  const [createCharacterDialogOpen, setCreateCharacterDialogOpen] = useState(false);
  const [characterForm, setCharacterForm] = useState({
    displayName: '',
    backstory: '',
    hostNotes: '',
  });
  const [selectedGuests, setSelectedGuests] = useState<string[]>([]);
  const [unassignedCharacters, setUnassignedCharacters] = useState<any[]>([]);
  const [bulkEmailDialogOpen, setBulkEmailDialogOpen] = useState(false);
  const [bulkEmailForm, setBulkEmailForm] = useState({
    subject: '',
    message: '',
  });
  
  // FAQ state
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [createFaqDialogOpen, setCreateFaqDialogOpen] = useState(false);
  const [editFaqDialogOpen, setEditFaqDialogOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<FAQ | null>(null);
  const [faqForm, setFaqForm] = useState({
    question: '',
    answer: '',
    order: 0,
    isActive: true,
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
      fetchUnassignedCharacters();
      fetchFaqs();
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

  const fetchUnassignedCharacters = async () => {
    try {
      const response = await fetch('/api/admin/characters', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setUnassignedCharacters(data.characters);
      }
    } catch (error) {
      console.error('Error fetching unassigned characters:', error);
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
        fetchUnassignedCharacters();
      }
    } catch (error) {
      console.error('Error assigning character:', error);
    }
  };

  const createCharacter = async () => {
    try {
      const response = await fetch('/api/admin/characters', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          displayName: characterForm.displayName,
          backstory: characterForm.backstory,
          hostNotes: characterForm.hostNotes,
        }),
      });

      if (response.ok) {
        setCreateCharacterDialogOpen(false);
        setCharacterForm({ displayName: '', backstory: '', hostNotes: '' });
        fetchGuests();
        fetchUnassignedCharacters();
      }
    } catch (error) {
      console.error('Error creating character:', error);
    }
  };

  const assignExistingCharacter = async (characterId: string) => {
    if (!selectedGuest) return;

    try {
      const response = await fetch('/api/admin/characters', {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          characterId: characterId,
          guestId: selectedGuest.id,
        }),
      });

      if (response.ok) {
        setCharacterDialogOpen(false);
        fetchGuests();
        fetchUnassignedCharacters();
      }
    } catch (error) {
      console.error('Error assigning existing character:', error);
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

  // FAQ functions
  const fetchFaqs = async () => {
    try {
      const response = await fetch('/api/admin/faq-file', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFaqs(data);
      } else {
        console.error('Failed to fetch FAQs');
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    }
  };

  const createFaq = async () => {
    // Validate form
    if (!faqForm.question.trim() || !faqForm.answer.trim()) {
      alert('Please fill in both question and answer fields');
      return;
    }

    console.log('Creating FAQ with data:', faqForm);

    try {
      const newFaqs = [...faqs, { ...faqForm, id: `faq-${Date.now()}` }];
      console.log('Sending FAQs to API:', newFaqs.length, 'total FAQs');
      
      const response = await fetch('/api/admin/faq-file', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ faqs: newFaqs }),
      });

      console.log('API response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('FAQ created successfully:', result);
        setCreateFaqDialogOpen(false);
        setFaqForm({ question: '', answer: '', order: 0, isActive: true });
        fetchFaqs();
      } else {
        const error = await response.json();
        console.error('API error:', error);
        alert(`Failed to create FAQ: ${error.error}`);
      }
    } catch (error) {
      console.error('Error creating FAQ:', error);
      alert('Failed to create FAQ');
    }
  };

  const updateFaq = async () => {
    if (!selectedFaq) return;

    try {
      const updatedFaqs = faqs.map(faq => 
        faq.id === selectedFaq.id 
          ? { ...faqForm, id: selectedFaq.id }
          : faq
      );
      
      const response = await fetch('/api/admin/faq-file', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ faqs: updatedFaqs }),
      });

      if (response.ok) {
        setEditFaqDialogOpen(false);
        setFaqForm({ question: '', answer: '', order: 0, isActive: true });
        setSelectedFaq(null);
        fetchFaqs();
      } else {
        const error = await response.json();
        alert(`Failed to update FAQ: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating FAQ:', error);
      alert('Failed to update FAQ');
    }
  };

  const deleteFaq = async (faqId: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      const filteredFaqs = faqs.filter(faq => faq.id !== faqId);
      
      const response = await fetch('/api/admin/faq-file', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ faqs: filteredFaqs }),
      });

      if (response.ok) {
        fetchFaqs();
      } else {
        const error = await response.json();
        alert(`Failed to delete FAQ: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      alert('Failed to delete FAQ');
    }
  };

  const openEditFaqDialog = (faq: FAQ) => {
    setSelectedFaq(faq);
    setFaqForm({
      question: faq.question,
      answer: faq.answer,
      order: faq.order,
      isActive: faq.isActive,
    });
    setEditFaqDialogOpen(true);
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
            <TabsTrigger value="faqs" className="text-gray-200 data-[state=active]:bg-purple-600 data-[state=active]:text-white">FAQs</TabsTrigger>
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
                              <DialogContent className="bg-gray-800 border-gray-600 max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle className="text-white">
                                    Assign Character to {guest.legalName}
                                  </DialogTitle>
                                  <DialogDescription className="text-gray-300">
                                    Choose to create a new character or assign an existing unassigned character
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-6">
                                  {/* Option 1: Assign Existing Character */}
                                  <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-white">Assign Existing Character</h3>
                                    <div className="max-h-60 overflow-y-auto space-y-2">
                                      {unassignedCharacters.length > 0 ? (
                                        unassignedCharacters.map((character) => (
                                          <div key={character.id} className="bg-gray-700 p-3 rounded border border-gray-600">
                                            <div className="flex justify-between items-start">
                                              <div>
                                                <h4 className="text-white font-medium">{character.displayName}</h4>
                                                <p className="text-gray-300 text-sm mt-1">
                                                  {(character.traits as any)?.backstory?.substring(0, 100)}...
                                                </p>
                                              </div>
                                              <Button
                                                size="sm"
                                                onClick={() => assignExistingCharacter(character.id)}
                                                className="bg-purple-600 hover:bg-purple-700 text-white"
                                              >
                                                Assign
                                              </Button>
                                            </div>
                                          </div>
                                        ))
                                      ) : (
                                        <div className="text-gray-400 text-sm italic">
                                          No unassigned characters available. Create a new character below.
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Divider */}
                                  <div className="border-t border-gray-600"></div>

                                  {/* Option 2: Create New Character */}
                                  <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-white">Create New Character</h3>
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
                                  </div>

                                  <div className="flex gap-2">
                                    <Button
                                      onClick={assignCharacter}
                                      className="bg-purple-600 hover:bg-purple-700 text-white"
                                    >
                                      Assign Character
                                    </Button>
                                    <Button
                                      variant="outline"
                                      onClick={() => setCharacterDialogOpen(false)}
                                      className="text-gray-800 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-400"
                                    >
                                      Cancel
                                    </Button>
                                  </div>
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
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl font-bold text-white">
                      Character Management
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      Manage character assignments and details
                    </CardDescription>
                  </div>
                  <Dialog open={createCharacterDialogOpen} onOpenChange={setCreateCharacterDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                        Create Character
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-800 border-gray-600">
                      <DialogHeader>
                        <DialogTitle className="text-white">
                          Create New Character
                        </DialogTitle>
                        <DialogDescription className="text-gray-300">
                          Create a character that can be assigned later
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="create-displayName" className="text-white">
                            Character Name
                          </Label>
                          <Input
                            id="create-displayName"
                            value={characterForm.displayName}
                            onChange={(e) => setCharacterForm({
                              ...characterForm,
                              displayName: e.target.value
                            })}
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="create-backstory" className="text-white">
                            Backstory / History
                          </Label>
                          <Textarea
                            id="create-backstory"
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
                          <Label htmlFor="create-hostNotes" className="text-white">
                            Host Notes
                          </Label>
                          <Textarea
                            id="create-hostNotes"
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
                            onClick={createCharacter}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            Create Character
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setCreateCharacterDialogOpen(false)}
                            className="text-gray-800 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-400"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Unassigned Characters */}
                  {unassignedCharacters.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Unassigned Characters</h3>
                      <div className="space-y-4">
                        {unassignedCharacters.map((character) => (
                          <Card key={character.id} className="bg-gray-800/50 border-gray-600">
                            <CardContent className="p-6">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h4 className="text-lg font-semibold text-white">
                                    {character.displayName}
                                  </h4>
                                  <Badge variant="outline" className="text-yellow-300 border-yellow-300">
                                    Unassigned
                                  </Badge>
                                </div>
                              </div>

                              <div className="mb-4">
                                <h5 className="text-sm font-medium text-gray-300 mb-2">Backstory:</h5>
                                <div className="bg-gray-700 p-3 rounded text-sm text-gray-200">
                                  <pre className="whitespace-pre-wrap">
                                    {(character.traits as any)?.backstory || 'No backstory provided'}
                                  </pre>
                                </div>
                              </div>

                              {character.notesPrivate && (
                                <div className="mb-4">
                                  <h5 className="text-sm font-medium text-gray-300 mb-2">Host Notes:</h5>
                                  <p className="text-sm text-gray-200 bg-gray-700 p-3 rounded">
                                    {character.notesPrivate}
                                  </p>
                                </div>
                              )}

                              <div className="flex gap-2 flex-wrap">
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => deleteCharacter(character.id)}
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                  Delete Character
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Assigned Characters */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Assigned Characters</h3>
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
                              <h4 className="text-sm font-medium text-gray-300 mb-2">Backstory:</h4>
                              <div className="bg-gray-700 p-3 rounded text-sm text-gray-200">
                                <pre className="whitespace-pre-wrap">
                                  {(guest.character?.traits as any)?.backstory || 'No backstory provided'}
                                </pre>
                              </div>
                            </div>

                            {guest.character?.notesPrivate && (
                              <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-300 mb-2">Host Notes:</h4>
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
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      {guests.filter(guest => guest.character).length === 0 && unassignedCharacters.length === 0 && (
                        <div className="text-center py-8">
                          <p className="text-gray-300">No characters created yet.</p>
                          <p className="text-sm text-gray-400 mt-2">
                            Create your first character using the button above.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FAQs Tab */}
          <TabsContent value="faqs">
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-600">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl font-bold text-white">
                      FAQ Management
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      Manage frequently asked questions
                    </CardDescription>
                  </div>
                  <Dialog open={createFaqDialogOpen} onOpenChange={setCreateFaqDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                        Create FAQ
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-800 border-gray-600 max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-white">
                          Create New FAQ
                        </DialogTitle>
                        <DialogDescription className="text-gray-300">
                          Add a new frequently asked question
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="create-faq-question" className="text-white">
                            Question
                          </Label>
                          <Input
                            id="create-faq-question"
                            value={faqForm.question}
                            onChange={(e) => setFaqForm({
                              ...faqForm,
                              question: e.target.value
                            })}
                            className="bg-gray-700 border-gray-600 text-white"
                            placeholder="Enter the question..."
                          />
                        </div>
                        <div>
                          <Label htmlFor="create-faq-answer" className="text-white">
                            Answer
                          </Label>
                          <Textarea
                            id="create-faq-answer"
                            value={faqForm.answer}
                            onChange={(e) => setFaqForm({
                              ...faqForm,
                              answer: e.target.value
                            })}
                            className="bg-gray-700 border-gray-600 text-white"
                            rows={6}
                            placeholder="Enter the answer..."
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="create-faq-order" className="text-white">
                              Order
                            </Label>
                            <Input
                              id="create-faq-order"
                              type="number"
                              value={faqForm.order}
                              onChange={(e) => setFaqForm({
                                ...faqForm,
                                order: parseInt(e.target.value) || 0
                              })}
                              className="bg-gray-700 border-gray-600 text-white"
                              placeholder="0"
                            />
                          </div>
                          <div className="flex items-center space-x-2 mt-6">
                            <input
                              type="checkbox"
                              id="create-faq-active"
                              checked={faqForm.isActive}
                              onChange={(e) => setFaqForm({
                                ...faqForm,
                                isActive: e.target.checked
                              })}
                              className="rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500"
                            />
                            <Label htmlFor="create-faq-active" className="text-white">
                              Active
                            </Label>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={createFaq}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            Create FAQ
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setCreateFaqDialogOpen(false)}
                            className="text-gray-800 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-400"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {faqs.map((faq) => (
                    <Card key={faq.id} className="bg-gray-800/50 border-gray-600">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white mb-2">
                              {faq.question}
                            </h3>
                            <div className="text-gray-300 text-sm leading-relaxed">
                              {faq.answer}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2 ml-4">
                            <div className="flex gap-2">
                              <Badge variant="outline" className="text-gray-300 border-gray-300">
                                Order: {faq.order}
                              </Badge>
                              <Badge className={faq.isActive ? "bg-green-600 text-white" : "bg-red-600 text-white"}>
                                {faq.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            <div className="text-xs text-gray-400">
                              Created: {new Date(faq.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 flex-wrap">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditFaqDialog(faq)}
                            className="text-gray-800 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-400"
                          >
                            Edit FAQ
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteFaq(faq.id)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            Delete FAQ
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {faqs.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-300">No FAQs created yet.</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Create your first FAQ using the button above.
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

      {/* Edit FAQ Dialog */}
      <Dialog open={editFaqDialogOpen} onOpenChange={setEditFaqDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-600 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">
              Edit FAQ
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Update the frequently asked question
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-faq-question" className="text-white">
                Question
              </Label>
              <Input
                id="edit-faq-question"
                value={faqForm.question}
                onChange={(e) => setFaqForm({
                  ...faqForm,
                  question: e.target.value
                })}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter the question..."
              />
            </div>
            <div>
              <Label htmlFor="edit-faq-answer" className="text-white">
                Answer
              </Label>
              <Textarea
                id="edit-faq-answer"
                value={faqForm.answer}
                onChange={(e) => setFaqForm({
                  ...faqForm,
                  answer: e.target.value
                })}
                className="bg-gray-700 border-gray-600 text-white"
                rows={6}
                placeholder="Enter the answer..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-faq-order" className="text-white">
                  Order
                </Label>
                <Input
                  id="edit-faq-order"
                  type="number"
                  value={faqForm.order}
                  onChange={(e) => setFaqForm({
                    ...faqForm,
                    order: parseInt(e.target.value) || 0
                  })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="0"
                />
              </div>
              <div className="flex items-center space-x-2 mt-6">
                <input
                  type="checkbox"
                  id="edit-faq-active"
                  checked={faqForm.isActive}
                  onChange={(e) => setFaqForm({
                    ...faqForm,
                    isActive: e.target.checked
                  })}
                  className="rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500"
                />
                <Label htmlFor="edit-faq-active" className="text-white">
                  Active
                </Label>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={updateFaq}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Update FAQ
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditFaqDialogOpen(false)}
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
