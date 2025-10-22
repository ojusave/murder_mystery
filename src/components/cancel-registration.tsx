'use client';

import { useState } from 'react';

interface CancelRegistrationProps {
  guestId: string;
  onCancel: () => void;
}

export default function CancelRegistration({ guestId, onCancel }: CancelRegistrationProps) {
  const [isLoading, setIsLoading] = useState(false);

  const cancelRegistration = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/guest/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ guestId }),
      });

      if (response.ok) {
        alert('Your registration has been cancelled. You will receive a confirmation email.');
        onCancel(); // Refresh the page or update state
        window.location.reload(); // Simple refresh for now
      } else {
        const error = await response.json();
        alert(`Failed to cancel registration: ${error.error}`);
      }
    } catch (error) {
      console.error('Error cancelling registration:', error);
      alert('Failed to cancel registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={() => {
        if (confirm('Are you sure you want to cancel your registration? This action cannot be undone.')) {
          cancelRegistration();
        }
      }}
      disabled={isLoading}
      className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white px-4 py-2 rounded-lg font-medium transition-colors"
    >
      {isLoading ? 'Cancelling...' : 'Cancel My Registration'}
    </button>
  );
}
