import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: "RAG APP",
  description: "Chat with documents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.className} antialiased`}
      >
        {children}
        <p className="text-center py-2">Root LM can be inaccurate, please verify its responses. </p>
      </body>
    </html>
  );
}
