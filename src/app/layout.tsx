import type { Metadata } from "next";
import { Geist, Geist_Mono, Creepster, Nosifer, Butcherman } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/auth-provider";
import BackgroundMusic from "@/components/BackgroundMusic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const creepster = Creepster({
  variable: "--font-creepster",
  subsets: ["latin"],
  weight: "400",
});

const nosifer = Nosifer({
  variable: "--font-nosifer",
  subsets: ["latin"],
  weight: "400",
});

const butcherman = Butcherman({
  variable: "--font-butcherman",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "The Black Lotus: A Halloween Murder Mystery",
  description: "A Halloween Murder Mystery Event hosted by BrO-J and Half-Chai (A-D-T)",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" }
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${creepster.variable} ${nosifer.variable} ${butcherman.variable} antialiased`}
      >
        <div className="bg-red-900 text-white text-center py-2 px-4 border-b-2 border-red-700">
          <p className="font-bold text-sm md:text-base">
            PRIVATE EVENT SITE – NOT FOR PUBLIC DISTRIBUTION
          </p>
          <p className="text-xs md:text-sm opacity-90">
            This site is satire for a private event at a private residence for our close friends who are invited to this event. If you stumbled upon this site, you are not invited and this is not for you. Not affiliated with any company or organization.
          </p>
        </div>
        <AuthProvider>
          {children}
          <BackgroundMusic />
        </AuthProvider>
      </body>
    </html>
  );
}
