import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import { WhatsAppButton } from "@/components/whatsapp";
import "./globals.css";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["hebrew", "latin"],
});

export const metadata: Metadata = {
  title: "מושל הוילונות",
  description: "וילונות, תריסים, ריפוד ומפות בהתאמה אישית — מושל הוילונות",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`${rubik.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
