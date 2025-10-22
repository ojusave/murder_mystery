'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/faqs');
        if (!response.ok) {
          throw new Error('Failed to load FAQs');
        }
        const data: FAQ[] = await response.json();
        setFaqs(data);
        if (data.length > 0) {
          setOpenFAQ(data[0].id);
        }
      } catch (err) {
        console.error('Error loading FAQs:', err);
        setError('Failed to load FAQs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  const toggleFAQ = (id: string) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

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
          {loading && (
            <div className="text-center text-gray-300">Loading FAQs...</div>
          )}
          {!loading && error && (
            <div className="text-center text-red-400">{error}</div>
          )}
          {!loading && !error && faqs.length === 0 && (
            <div className="text-center text-gray-300">No FAQs available yet. Check back soon!</div>
          )}
          {!loading && !error && faqs.map((faq) => {
            const isOpen = openFAQ === faq.id;

            return (
              <div
                key={faq.id}
                className="bg-gray-800/60 rounded-xl shadow-xl overflow-hidden border border-gray-700 hover:border-purple-500/50 transition-all duration-300"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full text-left px-6 py-5 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <span className="text-sm uppercase tracking-wide text-purple-400 font-semibold">FAQ</span>
                      <span className="text-xl font-semibold text-white">{faq.question}</span>
                    </div>
                    <span className={`text-2xl font-bold text-purple-400 transform transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
                      +
                    </span>
                  </div>
                </button>
                <div
                  className={`px-6 transition-all duration-300 ease-in-out ${
                    isOpen
                      ? 'max-h-[500px] py-4 opacity-100'
                      : 'max-h-0 py-0 opacity-0 overflow-hidden'
                  }`}
                >
                  <p className="text-gray-300 leading-relaxed text-lg">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-center text-gray-400 mt-12">
        Still confused? <Link href="/rsvp" className="text-purple-400 hover:text-purple-300">RSVP</Link> or
        <span className="text-purple-400"> message the hosts directly.</span>
      </div>
    </div>
  );
}
