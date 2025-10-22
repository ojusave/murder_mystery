import type { Metadata } from "next";
import { Geist, Geist_Mono, Creepster, Nosifer, Butcherman } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/auth-provider";

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
  description: "A Halloween Murder Mystery Event hosted by BrO-J and Half-Chai",
  icons: {
    icon: "/black-lotus-poster.jpg",
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
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
