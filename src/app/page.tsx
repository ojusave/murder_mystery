import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: 'url(/a9m7eb.gif)',
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/60"></div>
      {/* Header */}
      <header className="container mx-auto px-4 py-6 relative z-10">
        <nav className="flex justify-between items-center">
          <div></div>
          <Link href="/admin/login">
            <Button variant="outline" className="text-gray-800 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-400">
              Host Login
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-6 drop-shadow-2xl font-creepster tracking-wider">
            The Black Lotus
          </h1>
          <h2 className="text-3xl text-red-400 mb-8 drop-shadow-lg font-nosifer tracking-wide">
            A Halloween Murder Mystery
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto drop-shadow-md">
            Join us for an unforgettable evening of mystery, intrigue, and Halloween thrills. 
            Step into a world where every guest has a secret, every character has a motive, 
            and the truth lies hidden in the shadows.
          </p>
          
          {/* Event Details */}
          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-8 mb-12 max-w-2xl mx-auto border border-white/20">
            <h3 className="text-2xl font-semibold text-white mb-6 drop-shadow-lg font-butcherman tracking-wide">Event Details</h3>
            <div className="space-y-4 text-gray-300">
              <p><strong className="text-white">Date:</strong> November 1st, 2025</p>
              <p><strong className="text-white">Time:</strong> 8:00 PM - 12:00 AM</p>
              <p><strong className="text-white">Location:</strong> Fremont</p>
              <p><strong className="text-white">Dress Code:</strong> Costumes required</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/rsvp">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg">
                RSVP Now
              </Button>
            </Link>
            <Link href="/waiver">
              <Button variant="outline" size="lg" className="text-gray-800 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-400 px-8 py-4 text-lg">
                Read Waiver
              </Button>
            </Link>
          </div>
        </div>




      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-gray-700 relative z-10">
        <div className="text-center text-gray-400">
        </div>
      </footer>
    </div>
  );
}
