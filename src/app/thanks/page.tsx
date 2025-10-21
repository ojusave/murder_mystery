import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ThanksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white">
            Black Lotus
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-12">
            <h1 className="text-4xl font-bold text-white mb-6">
              Thank You for Your RSVP!
            </h1>
            
            <p className="text-xl text-gray-300 mb-8">
              Your RSVP has been successfully submitted. We're excited to have you join us for 
              The Black Lotus: A Halloween Murder Mystery!
            </p>

            <div className="bg-purple-900/30 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">What Happens Next?</h2>
              <div className="text-gray-300 space-y-3 text-left">
                <p>• We'll review your RSVP and get back to you within 24-48 hours</p>
                <p>• If approved, you'll receive an email with your guest portal link</p>
                <p>• Once assigned, you'll get your character details and instructions</p>
                <p>• Keep an eye on your email for updates and reminders</p>
              </div>
            </div>

            <div className="space-y-4">
              <Link href="/">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4">
                  Return to Home
                </Button>
              </Link>
              
              <div className="text-gray-400 text-sm">
                <p>Questions? Contact us at [email@darklotus.party]</p>
              </div>
            </div>
          </div>
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
