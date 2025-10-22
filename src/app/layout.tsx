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
  description: "A Halloween Murder Mystery Event hosted by BrO-J and Half-Chai",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" }
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
        <AuthProvider>
          {children}
          <BackgroundMusic />
        </AuthProvider>
      </body>
    </html>
  );
}
