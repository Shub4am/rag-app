import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import Link from "next/link";
import { MessageCircleMore } from 'lucide-react';
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Root LM - Chat with Your Documents",
  description: "Upload PDFs, CSVs, or web URLs and have intelligent conversations with your content.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        cssLayerName: 'clerk',
      }}
    >
      <html lang="en">
        <body
          className={`${montserrat.className} antialiased`}
        >
          <header className="relative z-50 px-6 py-4 backdrop-blur-2xl bg-black/50 text-white">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-2">
                <MessageCircleMore className="h-8 w-8 text-white" />
                <span className="text-2xl font-bold">Root LM</span>
              </Link>

              <div className="hidden md:flex items-center space-x-8">
                <SignedOut>
                  <Link href="#features" className="hover:text-green-300 transition-colors">Features</Link>
                  <Link href="#how-it-works" className="hover:text-green-300 transition-colors">How it Works</Link>
                  <Link href="#pricing" className="hover:text-green-300 transition-colors">Pricing</Link>
                  <SignInButton>
                    <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 px-6 py-2 rounded-lg transition-colors cursor-pointer">
                      Sign In
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <UserButton appearance={{
                    elements: {
                      userButtonBox: 'hover:scale-110 transition-transform'
                    }
                  }} />
                </SignedIn>
              </div>
            </div>
          </header>

          {children}

          <Toaster toastOptions={{
            style: { background: "black", color: "white", fontSize: "16px", borderStyle: "solid", borderColor: 'white', borderWidth: "2px" }
          }} />
        </body>
      </html>
    </ClerkProvider>
  );
}