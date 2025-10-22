'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function FAQPage() {
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const response = await fetch('/api/faqs');
      if (response.ok) {
        const data = await response.json();
        setFaqs(data);
      } else {
        setError('Failed to load FAQs');
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      setError('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  const toggleFAQ = (id: string) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading FAQs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Error loading FAQs</div>
          <button 
            onClick={fetchFaqs}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            The Black Lotus
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-300 mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Questions so basic, we're surprised you need to ask them. But here we are, 
            holding your hand through the obvious.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-300 text-xl mb-4">No FAQs available yet.</p>
              <p className="text-gray-400">Check back later or contact the hosts directly.</p>
            </div>
          ) : (
            faqs.map((faq) => {
              const isOpen = openFAQ === faq.id;
              
              return (
                <div
                  key={faq.id}
                  className="bg-gray-800 border border-gray-600 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-700 transition-colors duration-200"
                  >
                    <h3 className="text-lg font-semibold text-white">
                      {faq.question}
                    </h3>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  
                  {isOpen && (
                    <div className="px-6 pb-4">
                      <div className="text-gray-300 text-base leading-relaxed">
                        {faq.answer.split(' ').map((word, index) => {
                          if (word.startsWith('(/') && word.endsWith(')')) {
                            const path = word.slice(1, -1);
                            return (
                              <Link key={index} href={path} className="text-purple-400 hover:text-purple-300 underline">
                                {path}
                              </Link>
                            );
                          }
                          return word + ' ';
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="text-center mt-12">
          <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-white mb-3">
              Still Have Questions?
            </h3>
            <p className="text-gray-400 mb-4">
              If you've read through all of this and still need help, 
              maybe you should reconsider your life choices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/rsvp"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                RSVP Now
              </Link>
              <Link
                href="/"
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Hosted by BrO-J & Half-Chai (A-D-T) • November 1st, 2025 • 8:00 PM - 12:00 AM
          </p>
        </div>
      </div>
    </div>
  );
}