'use client';

import { useState } from 'react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
}

interface FAQClientProps {
  faqs: FAQ[];
}

export default function FAQClient({ faqs }: FAQClientProps) {
  const [openFAQ, setOpenFAQ] = useState<string | null>(faqs[0]?.id || null);

  const toggleFAQ = (id: string) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {faqs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-300">No FAQs available yet. Check back soon!</p>
        </div>
      ) : (
        faqs.map((faq) => {
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
                  <div className="flex items-center">
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
                <p className="text-gray-300 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: faq.answer.replace(/waiver/g, '<a href="/waiver" class="text-purple-400 hover:text-purple-300 underline">waiver</a>') }} />
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
