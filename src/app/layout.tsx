import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TruthGuard X | AI Misinformation Intelligence",
  description: "Autonomous AI System for Detecting and Containing Misinformation Across the Internet.",
};

import Navbar from "@/components/Navbar";
import { Providers } from "./Providers";
import BackgroundLayers from "@/components/BackgroundLayers";
import CustomCursor from "@/components/CustomCursor";
import Footer from "@/components/Footer";
import FlagIcon from "@/components/FlagIcon";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen transition-colors duration-300`}
      >
        <BackgroundLayers />
        <CustomCursor />
        {/* Flag always floats above everything */}
        <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 pointer-events-none opacity-90 brightness-150" style={{zIndex: 2147483647}}>
          <FlagIcon className="w-10 h-6 md:w-16 md:h-10 shadow-2xl skew-x-2" />
        </div>
        <Providers>
          <Navbar />
          <main className="flex-grow flex flex-col relative z-10">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
