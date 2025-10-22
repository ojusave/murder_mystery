import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const FAQ_FILE_PATH = path.join(process.cwd(), 'src/app/faq/page.tsx')

interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
}

export async function GET() {
  try {
    const fileContent = await fs.readFile(FAQ_FILE_PATH, 'utf-8')
    
    // Extract FAQs from the static data in the file using a safer approach
    const faqMatch = fileContent.match(/const staticFaqs: FAQ\[\] = \[([\s\S]*?)\];/)
    if (!faqMatch) {
      return NextResponse.json({ error: 'Could not find FAQ data in file' }, { status: 500 })
    }
    
    // Create a safe evaluation context
    const faqContent = faqMatch[1]
    
    // Use Function constructor to safely evaluate the FAQ array
    try {
      const faqs = new Function('return [' + faqContent + ']')() as FAQ[]
      return NextResponse.json(faqs)
    } catch (error) {
      console.error('Error parsing FAQ data:', error)
      return NextResponse.json({ error: 'Failed to parse FAQ data' }, { status: 500 })
    }
  } catch (error) {
    console.error('Error reading FAQ file:', error)
    return NextResponse.json({ error: 'Failed to read FAQ file' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { faqs }: { faqs: FAQ[] } = await request.json()
    
    // Sort FAQs by order
    const sortedFaqs = faqs.sort((a, b) => a.order - b.order)
    
    // Generate the new file content
    const faqDataString = sortedFaqs.map(faq => 
      `  {
    id: '${faq.id}',
    question: '${faq.question.replace(/'/g, "\\'")}',
    answer: '${faq.answer.replace(/'/g, "\\'")}',
    order: ${faq.order},
    isActive: ${faq.isActive}
  }`
    ).join(',\n')
    
    const newFileContent = `'use client';

import { useState } from 'react';
import Link from 'next/link';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
}

// Static FAQ data as fallback
const staticFaqs: FAQ[] = [
${faqDataString}
];

export default function FAQPage() {
  const [faqs] = useState<FAQ[]>(staticFaqs);
  const [openFAQ, setOpenFAQ] = useState<string | null>(staticFaqs[0]?.id || null);

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
                      <div className="flex items-center gap-4">
                        <span className="text-sm uppercase tracking-wide text-purple-400 font-semibold">FAQ</span>
                        <span className="text-xl font-semibold text-white">{faq.question}</span>
                      </div>
                      <span className={\`text-2xl font-bold text-purple-400 transform transition-transform duration-300 \${isOpen ? 'rotate-45' : ''}\`}>
                        +
                      </span>
                    </div>
                  </button>
                  <div
                    className={\`px-6 transition-all duration-300 ease-in-out \${
                      isOpen
                        ? 'max-h-[500px] py-4 opacity-100'
                        : 'max-h-0 py-0 opacity-0 overflow-hidden'
                    }\`}
                  >
                    <p className="text-gray-300 leading-relaxed text-lg">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="text-center text-gray-400 mt-12">
          Still confused? <Link href="/rsvp" className="text-purple-400 hover:text-purple-300">RSVP</Link> or
          <span className="text-purple-400"> message the hosts directly.</span>
        </div>
      </div>
    </div>
  );
}`
    
    // Write the new file content
    await fs.writeFile(FAQ_FILE_PATH, newFileContent, 'utf-8')
    
    return NextResponse.json({ 
      success: true, 
      message: 'FAQ file updated successfully',
      faqCount: sortedFaqs.length
    })
  } catch (error) {
    console.error('Error updating FAQ file:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
