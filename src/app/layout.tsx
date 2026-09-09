import type { Metadata } from "next";
import { Rubik, Frank_Ruhl_Libre } from "next/font/google";
import { WhatsAppButton } from "@/components/whatsapp";
import { LocalBusinessJsonLd } from "@/components/seo/LocalBusinessJsonLd";
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

const SITE_URL = "https://moshelhavilonot.co.il";
const SITE_TITLE = "מושל הוילונות";
const SITE_DESCRIPTION =
  "וילונות, תריסים, ריפוד ומפות בהתאמה אישית — מושל הוילונות. פועלים באזור ירושלים, בית שמש, מודיעין, בנימין, שומרון, תל אביב והמרכז.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: ["מושל הוילונות", "וילונות", "תריסים", "ריפוד", "מפות", "ירושלים"],
  alternates: { canonical: "/" },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_TITLE,
    locale: "he_IL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
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
        <LocalBusinessJsonLd />
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
