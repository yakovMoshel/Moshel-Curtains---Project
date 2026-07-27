import type { Metadata } from "next";
import { ContactForm } from "@/components/contact";

export const metadata: Metadata = {
  title: "צור קשר | מושל הוילונות",
};

export default function Contact() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-8 py-16 sm:px-16">
      <h1 className="text-4xl font-semibold tracking-tight text-stone-900">צור קשר</h1>
      <p className="max-w-xl text-lg text-stone-700">
        השאירו פרטים ונחזור אליכם בהקדם, או פנו אלינו ישירות בוואטסאפ.
      </p>
      <ContactForm />
    </main>
  );
}
