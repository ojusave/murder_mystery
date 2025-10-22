'use client';

import { useState } from 'react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  character: 'april' | 'max' | 'wednesday';
}

const faqs: FAQ[] = [
  // BASIC INFO
  {
    id: 'what-is-party',
    question: 'What is The Black Lotus Murder Mystery?',
    answer: "It's a murder mystery party. You know, where someone pretends to be dead and you pretend to care enough to figure out who did it. It's like Clue, but with real people who are probably more interesting than you. We've been planning this for months, so try to keep up.",
    character: 'april'
  },
  {
    id: 'what-happens',
    question: 'What happens at this party?',
    answer: "Someone dies. Figuratively, of course - though we can't guarantee your social life won't die a little too. You'll get a character, wear a costume, and pretend to solve a murder while eating snacks and judging everyone else's acting abilities. It's basically a four-hour exercise in human interaction.",
    character: 'wednesday'
  },
  {
    id: 'how-long',
    question: 'How long does this last?',
    answer: "Until your dumb mind solves the mystery. Could be four hours, could be all night, could be never. We're not responsible for your lack of deductive reasoning skills. If you're still here at sunrise, we'll probably just kick you out.",
    character: 'wednesday'
  },
  {
    id: 'after-murder-mystery',
    question: 'What happens after the murder mystery is solved?',
    answer: "You can go home or hangout and we'll play other games. We're not kicking you out immediately, but we're also not running a 24-hour entertainment service. If you want to stay, we'll probably play some other games. If you want to leave, that's fine too - we won't be offended. Just don't expect us to be your personal entertainment coordinators for the rest of the night.",
    character: 'april'
  },
  
  // RSVP & ATTENDANCE
  {
    id: 'rsvp-needed',
    question: 'Do I need to RSVP?',
    answer: "Yes. We're not running a walk-in clinic here. We need to know who's coming so we can assign characters and buy the right amount of snacks. If you can't figure out how to click a button and fill out a form, maybe this isn't the event for you.",
    character: 'april'
  },
  {
    id: 'bring-friend',
    question: 'Can I bring a friend?',
    answer: "They need to RSVP too. We're not running a 'bring your random friend who didn't plan ahead' service. If your friend is cool enough to come, they're cool enough to fill out their own form. If they're not, maybe you need better friends.",
    character: 'max'
  },
  
  // CHARACTERS & ACTING
  {
    id: 'dont-like-character',
    question: "What if I don't like my character?",
    answer: "Tough. We spent time creating characters that actually make sense for the story. If you can't handle playing someone who isn't exactly like you, maybe you should work on your personality instead of complaining about ours.",
    character: 'april'
  },
  {
    id: 'stay-in-character',
    question: 'Do I have to stay in character the whole time?',
    answer: "Yes, you absolute disappointment. We didn't spend time creating characters for you to revert to your boring, vanilla self halfway through. If you can't commit to being someone more interesting than yourself for four hours, maybe you should stay home and continue being the most unremarkable person in your friend group. The character is literally the only thing that makes you worth inviting.",
    character: 'max'
  },
  {
    id: 'not-good-acting',
    question: "What if I'm not good at acting?",
    answer: "Neither are most people. That's what makes it fun. We're not expecting Oscar-worthy performances here - just try not to embarrass yourself too much. If you can't handle pretending to be someone else for a few hours, maybe you should work on being yourself first.",
    character: 'april'
  },
  
  // DRESS CODE & WHAT TO BRING
  {
    id: 'dress-code',
    question: "What's the dress code?",
    answer: "Costumes. You know, like Halloween? But better. We're not asking you to be the next Broadway star, but at least try to look like you belong at a murder mystery party and not a corporate team-building retreat. Jeans and a t-shirt won't cut it here, sweetie.",
    character: 'max'
  },
  {
    id: 'what-to-bring',
    question: 'What should I bring?',
    answer: "Don't be a freeloader. Bring something to share - snacks, drinks, your costume, and maybe some basic human decency. We're not running a convenience store here, so come prepared or don't come at all. But don't get something too expensive - we're not trying to bankrupt you, just prove you're not a complete mooch.",
    character: 'max'
  },
  
  // RULES & LEGAL
  {
    id: 'what-are-rules',
    question: 'What are the rules?',
    answer: "Read the waiver. It's that simple. We spent time writing it for a reason, and that reason is because people like you can't follow basic instructions. The waiver has all the rules, so read it, sign it, and try not to break anything.",
    character: 'april'
  },
  {
    id: 'why-long-waiver',
    question: 'Why the fuck do you have such a long waiver?',
    answer: "Because people like you exist. We had to cover every possible way you could mess this up, hurt yourself, or ruin everyone else's fun. The waiver is long because we've seen what happens when people don't read the fine print. Come with something better than complaints.",
    character: 'max'
  },
  
  // CONTENT & APPROPRIATENESS
  {
    id: 'is-scary',
    question: 'Is this actually scary?',
    answer: "It's as scary as you make it. The murder is fictional, but the social awkwardness is very real. If you're looking for actual terror, try looking in a mirror. If you're looking for a fun evening of mystery and intrigue, you've come to the right place.",
    character: 'wednesday'
  },
  {
    id: 'kids-friendly',
    question: 'Is this kids friendly?',
    answer: "No. We know you probably have kids because you couldn't keep your pants on and your condom broke, so now you're stuck with little bastards you never planned for. But you can bring them - just beware that there will be alcohol and adult language and halloween themes",
    character: 'april'
  },
  
  // META & COMPLAINTS
  {
    id: 'chatgpt-generated',
    question: 'Was this ChatGPT generated?',
    answer: "You bet. We used AI to write this because we figured it could do a better job than most humans at explaining things clearly. Plus, ChatGPT doesn't get tired of answering the same stupid questions over and over again like we do.",
    character: 'wednesday'
  },
  {
    id: 'offensive-faq',
    question: 'Wow, this FAQ is fucking offensive!',
    answer: "The party will be more offensive. If this hurt you, you should probably not come. We're not here to coddle your delicate sensibilities or hold your hand through basic human interaction. This is a murder mystery party, not a therapy session. If you can't handle some harsh words on a website, you definitely can't handle what we have planned for the actual event.",
    character: 'wednesday'
  },
];

const characterStyles = {
  april: {
    name: 'April Ludgate',
    color: 'text-gray-400',
    bgColor: 'bg-gray-800',
    borderColor: 'border-gray-600',
    icon: '😐'
  },
  max: {
    name: 'Max Black',
    color: 'text-pink-400',
    bgColor: 'bg-pink-900',
    borderColor: 'border-pink-600',
    icon: '💅'
  },
  wednesday: {
    name: 'Wednesday Addams',
    color: 'text-purple-400',
    bgColor: 'bg-purple-900',
    borderColor: 'border-purple-600',
    icon: '🖤'
  }
};

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
            const style = characterStyles[faq.character];
            const isOpen = openFAQ === faq.id;
            
            return (
              <div
                key={faq.id}
                className={`${style.bgColor} ${style.borderColor} border rounded-lg overflow-hidden transition-all duration-300 ${
                  isOpen ? 'shadow-2xl' : 'shadow-lg hover:shadow-xl'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-black hover:bg-opacity-20 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{style.icon}</span>
                    <h3 className={`text-lg font-semibold ${style.color}`}>
                      {faq.question}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm ${style.color} opacity-70`}>
                      {style.name}
                    </span>
                    <svg
                      className={`w-5 h-5 ${style.color} transition-transform duration-200 ${
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
                  </div>
                </button>
                
                {isOpen && (
                  <div className="px-6 pb-4">
                    <div className={`${style.color} text-base leading-relaxed`}>
                      {faq.answer}
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
              <a
                href="/rsvp"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                RSVP Now
              </a>
              <a
                href="/"
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Back to Home
              </a>
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
