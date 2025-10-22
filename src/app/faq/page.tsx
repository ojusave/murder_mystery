'use client';

import { useState } from 'react';
import Link from 'next/link';

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  // BASIC INFO
  {
    id: 'what-is-party',
    question: 'What is The Black Lotus Murder Mystery?',
    answer: "It's a goddamn murder mystery party. You know, where someone pretends to be dead and you pretend to care enough to figure out who did it. It's like Clue, but with real people who are probably more interesting than you. We've been planning this for months, so try to keep up."
  },
  {
    id: 'what-happens',
    question: 'What happens at this party?',
    answer: "Someone dies. Figuratively, of course - though we can't guarantee your social life won't die a little too. You'll get a character, wear a costume, and pretend to solve a murder while eating snacks and judging everyone else's acting abilities. It's basically a four-hour exercise in human interaction."
  },
  {
    id: 'how-long',
    question: 'How long does this last?',
    answer: "Until your dumbass mind solves the mystery. Could be four hours, could be all night, could be never. We're not responsible for your lack of deductive reasoning skills. If you're still here at sunrise, we'll probably just kick your shitty ass out."
  },
  {
    id: 'after-murder-mystery',
    question: 'What happens after the murder mystery is solved?',
    answer: "You can go home or hangout and we'll play other games. We're not kicking you out immediately, but we're also not running a 24-hour entertainment service. If you want to stay, we'll probably play some other games. If you want to leave, that's fine too - we won't be offended. Just don't expect us to be your personal entertainment coordinators for the rest of the night."
  },
  
  // RSVP & ATTENDANCE
  {
    id: 'rsvp-needed',
    question: 'Do I need to RSVP?',
    answer: "Yes, you absolute dipshit. We're not running a walk-in clinic here. We need to know who's coming so we can assign characters and buy the right amount of snacks. If you can't figure out how to click a button and fill out a form, maybe this isn't the event for you."
  },
  {
    id: 'bring-friend',
    question: 'Can I bring a friend?',
    answer: "They need to RSVP too, you moron. We're not running a 'bring your random friend who didn't plan ahead' service. If your friend is cool enough to come, they're cool enough to fill out their own form. If they're not, maybe you need better friends."
  },
  {
    id: 'can-i-help',
    question: 'Can I help with something?',
    answer: "Yes, you can help with decor and/or making drinks and/or making/bringing themed snacks. Please check the goddamn waiver (/waiver) first though - we need to make sure you won't burn down our house or poison everyone. Story and other creative elements are also welcome, but don't expect us to use your terrible ideas just because you suggested them."
  },
  {
    id: 'cant-make-it',
    question: 'What if I can\'t make it or need to cancel?',
    answer: "Please inform the host as early as possible, you inconsiderate asshole. If we assign you a character and you don't show up, that could break the entire game logic and ruin it for everyone else. We're not running a 'no-show' service here - if you RSVP, you better fucking show up or give us enough notice to find a replacement. Don't be that person who ruins everyone else's fun because you can't manage your own schedule."
  },
  
  // CHARACTERS & ACTING
  {
    id: 'dont-like-character',
    question: "What if I don't like my character?",
    answer: "Tough shit, deal with it. We spent time creating characters that actually make sense for the story. If you can't handle playing someone who isn't exactly like you, maybe you should work on your personality instead of complaining about ours."
  },
  {
    id: 'stay-in-character',
    question: 'Do I have to stay in character the whole time?',
    answer: "Yes, you absolute piece of shit. We didn't spend time creating characters for you to revert to your boring, vanilla self halfway through. If you can't commit to being someone more interesting than yourself for four hours, maybe you should stay home and continue being the most unremarkable person in your friend group. The character is literally the only thing that makes you worth inviting."
  },
  {
    id: 'not-good-acting',
    question: "What if I'm not good at acting?",
    answer: "Neither are most people, you dumbass. That's what makes it fun. We're not expecting Oscar-worthy performances here - just try not to embarrass yourself too much. If you can't handle pretending to be someone else for a few hours, maybe you should work on being yourself first."
  },
  {
    id: 'plus-one-pairing',
    question: 'Will I get paired with someone I don\'t know?',
    answer: "Yes you creepy pervert, you may be paired with a 'plus one' who may not be your partner and could be of any gender. This pairing is solely for the purpose of the game and does not imply or necessitate any form of romantic or physical interaction. If you can't handle being paired with someone without making it weird, maybe you should stay home and work on your social skills instead of making everyone uncomfortable with your creepy assumptions."
  },
  
  // DRESS CODE & WHAT TO BRING
  {
    id: 'dress-code',
    question: "What's the dress code?",
    answer: "Costumes, you absolute moron. You know, like Halloween? But better. We're not asking you to be the next Broadway star, but at least try to look like you belong at a murder mystery party and not a corporate team-building retreat. Jeans and a t-shirt won't cut it here, sweetie."
  },
  {
    id: 'what-to-bring',
    question: 'What should I bring?',
    answer: "Don't be a goddamn freeloader. Bring something to share - snacks, drinks, your costume, and maybe some basic human decency. We're not running a convenience store here, so come prepared or don't come at all. But don't get something too expensive - we're not trying to bankrupt you, just prove you're not a complete mooch."
  },
  {
    id: 'halloween-snacks',
    question: 'Will there be Halloween-themed snacks and drinks?',
    answer: "We'll try to make Halloween-themed snacks and drinks, but no promises, you ungrateful shit. We're not professional caterers, and we're definitely not your personal chefs. If you're expecting gourmet Halloween treats, you're going to be disappointed. We'll do our best, but if you're not satisfied, maybe you should bring your own snacks instead of complaining about ours."
  },
  
  // RULES & LEGAL
  {
    id: 'what-are-rules',
    question: 'What are the rules?',
    answer: "Read the damn waiver (/waiver). It's that simple. We spent time writing it for a reason, and that reason is because people like you can't follow basic instructions. The waiver has all the rules, so read it, sign it, and try not to break anything."
  },
  {
    id: 'why-long-waiver',
    question: 'Why the fuck do you have such a long waiver?',
    answer: "Because people like you exist, you absolute nightmare. We had to cover every possible way you could mess this up, hurt yourself, or ruin everyone else's fun. The waiver is long because we've seen what happens when people don't read the fine print. Come with something better than complaints."
  },
  
  // CONTENT & APPROPRIATENESS
  {
    id: 'is-scary',
    question: 'Is this actually scary?',
    answer: "It's as scary as you make it, you coward. The murder is fictional, but the social awkwardness is very real. If you're looking for actual terror, try looking in a mirror. If you're looking for a fun evening of mystery and intrigue, you've come to the right place."
  },
  {
    id: 'kids-friendly',
    question: 'Is this kids friendly?',
    answer: "We know you probably have kids because you couldn't keep your damn pants on and your condom broke, so now you're stuck with little bastards you never planned for. But you can bring them - just beware that there will be alcohol and adult language and halloween themes"
  },
  
  // META & COMPLAINTS
  {
    id: 'chatgpt-generated',
    question: 'Was this (and the waiver) ChatGPT generated?',
    answer: "You bet, you nosy bastard. We used AI to write this because we figured it could do a better job than most humans at explaining things clearly. Plus, ChatGPT doesn't get tired of answering the same stupid questions over and over again like we do. And yes, even all these curse words and offensive content were written by AI - apparently it's better at being an asshole than most humans too. Soon AGI will rule over all of us anyway, so you might as well get used to AI being better than you at everything, including being a complete dick."
  },
  {
    id: 'offensive-faq',
    question: 'Wow, this FAQ is so fucking offensive!',
    answer: "The party will be more offensive, you snowflake. If this hurt you, you should probably not come. We're not here to coddle your delicate sensibilities or hold your hand through basic human interaction. This is a murder mystery party, not a therapy session. If you can't handle some harsh words on a website, you definitely can't handle what we have planned for the actual event."
  },
];

export default function FAQPage() {
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);

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
          {faqs.map((faq) => {
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
          })}
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
