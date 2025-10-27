import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CancelRegistration from '@/components/cancel-registration';

interface GuestPortalProps {
  params: Promise<{
    token: string;
  }>;
}

async function getGuestByToken(token: string) {
  const guest = await prisma.guest.findUnique({
    where: { token },
    include: {
      character: true,
      emailEvents: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  return guest;
}

export default async function GuestPortal({ params }: GuestPortalProps) {
  const { token } = await params;
  const guest = await getGuestByToken(token);

  if (!guest) {
    notFound();
  }

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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Not Approved';
      case 'pending':
      default:
        return 'Under Review';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Black Lotus</h1>
          <div className="text-gray-300">
            Welcome, {guest.legalName}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Status Card */}
          <Card className="bg-black/30 backdrop-blur-sm border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white flex items-center gap-4">
                RSVP Status
                <Badge className={`${getStatusColor(guest.status)} text-white`}>
                  {getStatusText(guest.status)}
                </Badge>
              </CardTitle>
              <CardDescription className="text-gray-300">
                Your RSVP was submitted on {guest.createdAt.toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-300">
                <p><strong className="text-white">Email:</strong> {guest.email}</p>
                {guest.suggestions && (
                  <div>
                    <strong className="text-white">Your Suggestions:</strong>
                    <p className="mt-1 italic">"{guest.suggestions}"</p>
                  </div>
                )}
                
                {/* Welcome message for new RSVPs */}
                <div className="bg-purple-900/30 rounded-lg p-4 mt-6">
                  <h3 className="text-lg font-semibold text-white mb-2">🎉 Welcome to Black Lotus!</h3>
                  <p className="text-sm text-gray-300">
                    Your RSVP has been successfully submitted! You can bookmark this page to check your status anytime.
                    We'll review your application and get back to you within 24-48 hours.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Character Assignment Card */}
          {guest.character && (
            <Card className="bg-black/30 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">
                  Your Character Assignment
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Assigned on {guest.character.assignedAt?.toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {guest.character.displayName}
                    </h3>
                    <div className="bg-purple-900/30 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-white mb-3">Character Traits</h4>
                      <div className="space-y-2 text-gray-300">
                        {guest.character.traits && typeof guest.character.traits === 'object' && guest.character.traits !== null ? (
                          (guest.character.traits as any).backstory ? (
                            <div>
                              <strong className="text-white">Backstory:</strong>
                              <p className="mt-1">{String((guest.character.traits as any).backstory)}</p>
                            </div>
                          ) : (
                            Object.entries(guest.character.traits as Record<string, unknown>).map(([key, value]) => (
                              <div key={key}>
                                <strong className="text-white">{key}:</strong> {String(value)}
                              </div>
                            ))
                          )
                        ) : (
                          <p>{String(guest.character.traits)}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {guest.character.notesPrivate && (
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-white mb-2">Private Notes</h4>
                      <p className="text-gray-300">{guest.character.notesPrivate}</p>
                    </div>
                  )}
                  
                  <div className="bg-purple-900/30 rounded-lg p-4">
                    <a 
                      href={`/guest-list/${guest.token}`}
                      className="inline-flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                      View Guest List & Character Information
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructions Card */}
          <Card className="bg-black/30 backdrop-blur-sm border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white">
                Event Instructions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-300">
                {guest.status === 'pending' && (
                  <div className="bg-yellow-900/30 border border-yellow-500 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-yellow-300 mb-2">Under Review</h4>
                    <p>Your RSVP is currently being reviewed. You'll receive an email notification once a decision has been made.</p>
                  </div>
                )}

                {guest.status === 'rejected' && (
                  <div className="bg-red-900/30 border border-red-500 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-red-300 mb-2">Not Approved</h4>
                    <p>Unfortunately, we're unable to accommodate your RSVP at this time. Thank you for your interest in The Black Lotus Murder Mystery.</p>
                  </div>
                )}

                {guest.status === 'approved' && !guest.character && (
                  <div className="bg-green-900/30 border border-green-500 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-green-300 mb-2">Approved!</h4>
                    <p>Congratulations! Your RSVP has been approved. You'll receive your character assignment soon.</p>
                  </div>
                )}

                {guest.status === 'approved' && guest.character && (
                  <div className="space-y-4">
                    <div className="bg-green-900/30 border border-green-500 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-green-300 mb-2">Ready to Play!</h4>
                      <p>You're all set for The Black Lotus Murder Mystery! Here's what you need to know:</p>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-white mb-3">Event Details</h4>
                      <div className="space-y-2">
                        <p><strong className="text-white">Date:</strong> November 1st, 2025</p>
                        <p><strong className="text-white">Time:</strong> 8:00 PM - 12:00 AM</p>
                        <p><strong className="text-white">Location:</strong> [Venue TBD]</p>
                        <p><strong className="text-white">Dress Code:</strong> Costumes encouraged!</p>
                      </div>
                    </div>

                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-white mb-3">What to Bring</h4>
                      <div className="space-y-1">
                        {guest.bringOptions.map((option, index) => (
                          <p key={index}>• {option}</p>
                        ))}
                        {guest.bringOther && <p>• {guest.bringOther}</p>}
                      </div>
                    </div>

                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-white mb-3">Your Talents</h4>
                      <div className="space-y-1">
                        {guest.talents.map((talent, index) => (
                          <p key={index}>• {talent}</p>
                        ))}
                        {guest.talentsOther && <p>• {guest.talentsOther}</p>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>


          {/* Cancel Registration */}
          {guest.status !== 'cancelled' && (
            <Card className="bg-black/30 backdrop-blur-sm border-red-700">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white">
                  ⚠️ Cancel Registration
                </CardTitle>
                <CardDescription className="text-gray-300">
                  If you can no longer attend, you can cancel your registration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-300 mb-4">
                  This action cannot be undone. You will receive a confirmation email and the hosts will be notified.
                </p>
                <CancelRegistration guestId={guest.id} />
              </CardContent>
            </Card>
          )}

          {/* Email Timeline */}
          <Card className="bg-black/30 backdrop-blur-sm border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white">
                📧 Email Timeline
              </CardTitle>
              <CardDescription className="text-gray-300">
                Messages sent to you from the hosts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {guest.emailEvents && guest.emailEvents.length > 0 ? (
                <div className="space-y-4">
                  {guest.emailEvents.map((event) => (
                    <div key={event.id} className="bg-gray-800/50 rounded-lg p-4 border-l-4 border-purple-500">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-semibold text-white">
                          {event.type === 'bulk_email' ? '📢 Host Message' : 
                           event.type === 'rsvp_received' ? '📧 RSVP Confirmation' :
                           event.type === 'approved' ? '✅ RSVP Approved' :
                           event.type === 'rejected' ? '❌ RSVP Update' :
                           event.type === 'character_assigned' ? '🎭 Character Assigned' :
                           event.type === 'character_updated' ? '🎭 Character Updated' :
                           event.type === 'character_removed' ? '🎭 Character Removed' :
                           event.type === 'cancellation' ? '🚫 Registration Cancelled' :
                           event.type === 'registration_deleted' ? '🗑️ Registration Deleted' :
                           '📧 Email Notification'}
                        </h4>
                        <span className="text-sm text-gray-400">
                          {new Date(event.createdAt).toLocaleDateString('en-US', { timeZone: 'America/Los_Angeles' })} at {new Date(event.createdAt).toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles', hour: '2-digit', minute: '2-digit' })} PST
                        </span>
                      </div>
                      
                      {/* Show subject if available */}
                      {(event as any).subject && (
                        <h5 className="text-md font-medium text-purple-300 mb-2">
                          {(event as any).subject}
                        </h5>
                      )}
                      
                      {/* Show message content if available */}
                      {(event as any).message && (
                        <div className="text-gray-300 whitespace-pre-wrap mb-3">
                          {(event as any).message}
                        </div>
                      )}
                      
                      {/* Show meaningful content based on email type */}
                      {!((event as any).subject || (event as any).message) && (
                        <div className="text-gray-300">
                          {event.type === 'rsvp_received' && (
                            <p>Your RSVP has been received and is being reviewed by the hosts. You'll receive an update once it's processed.</p>
                          )}
                          {event.type === 'approved' && (
                            <p>🎉 Congratulations! Your RSVP has been approved. You're officially invited to The Black Lotus Murder Mystery event!</p>
                          )}
                          {event.type === 'rejected' && (
                            <p>Your RSVP status has been updated. Please contact the hosts if you have any questions.</p>
                          )}
                          {event.type === 'character_assigned' && (
                            <p>🎭 Your character has been assigned! Check the Character Assignment section above to see your role details.</p>
                          )}
                          {event.type === 'character_updated' && (
                            <p>🎭 Your character details have been updated! Check the Character Assignment section above to see the changes.</p>
                          )}
                          {event.type === 'character_removed' && (
                            <p>🎭 Your character assignment has been removed. You may receive a new character assignment soon.</p>
                          )}
                          {event.type === 'cancellation' && (
                            <p>Your registration has been cancelled. If this was done in error, please contact the hosts immediately.</p>
                          )}
                          {event.type === 'registration_deleted' && (
                            <p>🗑️ Your registration has been deleted by the hosts. If you believe this was done in error, please contact them immediately.</p>
                          )}
                          {event.type === 'bulk_email' && (
                            <p>This is a message from the hosts. Please check the subject and content above for details.</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No messages yet</p>
                  <p className="text-sm text-gray-500 mt-2">
                    You'll see host messages and updates here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-gray-700 mt-16">
        <div className="text-center text-gray-400">
        </div>
      </footer>
    </div>
  );
}
