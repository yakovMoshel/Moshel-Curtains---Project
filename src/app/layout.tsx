import type { Metadata } from "next";
import { Rubik, Frank_Ruhl_Libre } from "next/font/google";
import { WhatsAppButton } from "@/components/whatsapp";
import "./globals.css";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["hebrew", "latin"],
});

const frankRuhlLibre = Frank_Ruhl_Libre({
  variable: "--font-frank-ruhl",
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500"],
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
    <html
      lang="he"
      dir="rtl"
      className={`${rubik.variable} ${frankRuhlLibre.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
