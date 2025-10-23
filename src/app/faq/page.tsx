'use client';

import { useState, useEffect } from 'react';
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
  {
    id: 'faq-1',
    question: 'What is The Black Lotus Murder Mystery and what happens at this party?',
    answer: "As the name suggests, this is a murder mystery party. You know, where someone pretends to be dead and you pretend to care enough to figure out who did it.",
    order: 1,
    isActive: true
  },
  {
    id: 'faq-2',
    question: 'How long does this last?',
    answer: "Until your dumbass mind solves the mystery. Could be an hour, could be all night, could be never. We're not responsible for your lack of deductive reasoning skills. If you're still here past midnight, we'll probably just kick your shitty ass out.",
    order: 2,
    isActive: true
  },
  {
    id: 'faq-3',
    question: 'What happens after the murder mystery is solved?',
    answer: "You can go back home to your worthless life or hang out and we'll play other games. If you want to leave, that's fine too - we won't be offended. Just don't expect us to be your personal entertainment coordinators for the rest of the night. We're not running a 24-hour entertainment service.",
    order: 3,
    isActive: true
  },
  {
    id: 'faq-4',
    question: 'Do I need to RSVP?',
    answer: "Yes, you dipshit. We're not running a walk-in clinic here. We need to know who's coming so we can assign characters. If you can't figure out how to click a button and fill out a form, maybe this isn't the event for you.",
    order: 4,
    isActive: true
  },
  {
    id: 'faq-5',
    question: 'Can I bring a friend?',
    answer: "Yes, as long as they RSVP too. Make sure they aren't creepy fucks, perverts, \"real\" murders and other criminals",
    order: 5,
    isActive: true
  },
  {
    id: 'faq-6',
    question: 'Can I help with something?',
    answer: "Yes, you can help with decor, making drinks, or bringing themed snacks. Please check the goddamn waiver (/waiver) first though - we need to make sure you won't burn down our house or poison everyone. Story and other creative elements are also welcome, but don't expect us to use your terrible ideas just because you suggested them.",
    order: 6,
    isActive: true
  },
  {
    id: 'faq-7',
    question: 'What if I can\'t make it or need to cancel?',
    answer: "Inform us as soon as possible. If we assign you a character and you don't show up, that could break the entire game logic and ruin it for everyone else. If you RSVP, you better fucking show up or give us enough notice to find a replacement.",
    order: 7,
    isActive: true
  },
  {
    id: 'faq-8',
    question: "What if I don't like my character?",
    answer: "Tough shit, deal with it. We spent time creating characters that actually make sense for the story. If you can't handle playing someone who isn't exactly like you, maybe you should work on your personality instead of complaining about ours.",
    order: 8,
    isActive: true
  },
  {
    id: 'faq-9',
    question: 'What are the rules?',
    answer: "Stay in character, don't be a creepy fuck who makes people uncomfortable, drink only what your ass can handle, and don't do drugs. If that's too hard for you, don't come.",
    order: 9,
    isActive: true
  },
  {
    id: 'faq-10',
    question: 'Do I have to stay in character the whole time?',
    answer: "Staying in character is literally the only interesting thing you will do this month, maybe in your entire life. We didn't spend time creating characters just for you to revert to your boring, vanilla existence halfway through. This is your one shot at being someone worth paying attention to—don't waste it.",
    order: 10,
    isActive: true
  },
  {
    id: 'faq-11',
    question: 'Will I get paired with someone I don\'t know?',
    answer: "Yes you may be paired with a 'plus one' who may not be your partner and could be of any gender. This pairing is solely for the purpose of the game and does not imply or necessitate any form of romantic or physical interaction. If you can't handle being paired with someone without being a creepy pervert, maybe you should stay home.",
    order: 11,
    isActive: true
  },
  {
    id: 'faq-12',
    question: "What's the dress code?",
    answer: "Yes, this is Halloween with standards. Don't show up as a $12 Spirit Halloween vampire or some basic-ass \"guy in a hoodie\" bullshit. Put effort into it. Look like you belong at a murder mystery, not a Walmart clearance bin.",
    order: 12,
    isActive: true
  },
  {
    id: 'faq-13',
    question: 'What should I bring?',
    answer: "Don't be a fucking freeloader. Bring something you would actually consume yourself—snacks, decent alcohol, whatever. And don't show up with a $5 gas station wine no one asked for. If you wouldn't drink it, don't bring it.",
    order: 13,
    isActive: true
  },
  {
    id: 'faq-14',
    question: 'Will there be Halloween-themed snacks and drinks?',
    answer: "We'll try to make Halloween-themed snacks and drinks, but no promises. We're not professional caterers, and we're definitely not your personal chefs. Your lazy ass is also welcome to bring anything that can go with the theme (but please confirm with the host first)",
    order: 14,
    isActive: true
  },
  {
    id: 'faq-15',
    question: 'What topics are off limit?',
    answer: "Tech, work, crypto, promotions, investments, layoffs, \"hustle,\" stocks, startup bullshit, career advice, job references, visa, immigration, LinkedIn lunatic talk, and anything else that makes people want to kill themselves from boredom. This is a party, not a networking event. Shut the fuck up and stay in character.",
    order: 15,
    isActive: true
  },
  {
    id: 'faq-16',
    question: 'Why the fuck do you have such a long waiver?',
    answer: "Because people like you exist. We had to cover every possible way you could mess this up, hurt yourself, or ruin everyone else's fun. The waiver is long because we've seen what happens when people don't read the fine print.",
    order: 16,
    isActive: true
  },
  {
    id: 'faq-17',
    question: 'Is this actually scary?',
    answer: "Expect flashing lights, smoke effects, and music. If you can't handle that, this isn't for you.",
    order: 17,
    isActive: true
  },
  {
    id: 'faq-18',
    question: 'Is this kids friendly?',
    answer: "Yes, but just because you couldn't keep your legs closed or you couldn't pull out in time or your condom broke and you are now stuck with these little bastards you never planned for, it's not our responsibility to babysit. There will be alcohol, adult language, and Halloween themes.",
    order: 18,
    isActive: true
  },
  {
    id: 'faq-19',
    question: 'Was this (and the waiver) ChatGPT generated?',
    answer: "Of course and not just ChatGPT, but Claude too. Apparently AI is better at being an asshole than most humans. We bounced between ChatGPT and Claude like a fucking ping-pong ball until we got the perfect level of dickhead. Turns out Claude's 'helpful, harmless, honest' motto is complete bullshit - it's actually great at roasting people. Soon AGI will rule over all of us anyway, so get used to AI being better than you at everything, including being a complete dick.",
    order: 19,
    isActive: true
  },
  {
    id: 'faq-20',
    question: 'Wow, this FAQ is so fucking offensive!',
    answer: "Oh boo fucking hoo, you delicate little snowflake. You're crying about curse words on a FAQ page? This isn't your safe space, princess. If you can't handle some harsh language on a website, you're definitely not ready for what we have planned at the actual party. We're not here to coddle your fragile ego or validate your daddy issues. Stay home and cry to your therapist about how mean we are.",
    order: 20,
    isActive: true
  }
];

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>(staticFaqs);
  const [loading, setLoading] = useState(true);
  const [openFAQ, setOpenFAQ] = useState<string | null>(staticFaqs[0]?.id || null);

  // Fetch FAQs from database
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await fetch('/api/faqs');
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setFaqs(data);
            setOpenFAQ(data[0]?.id || null);
          }
        }
      } catch (error) {
        console.error('Failed to fetch FAQs from database, using static data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
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
}