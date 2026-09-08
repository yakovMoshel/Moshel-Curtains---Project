import type { Metadata } from "next";
import { AddressCard, BUSINESS_ADDRESS, ContactForm } from "@/components/contact";

export const metadata: Metadata = {
  title: "צור קשר | מושל הוילונות",
  description: `צרו קשר עם מושל הוילונות בכתובת ${BUSINESS_ADDRESS}, או השאירו פרטים ונחזור אליכם בהקדם.`,
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  return (
    <main className="bg-curtain-cream">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-8 py-16 sm:px-16">
        <div className="animate-fade-in-up max-w-xl">
          <p className="mb-2 text-sm font-medium tracking-[0.2em] text-curtain-taupe uppercase">
            נשמח לפגוש אתכם
          </p>
          <h1 className="font-serif text-4xl font-normal tracking-tight text-curtain-espresso sm:text-5xl">
            בואו לבקר אותנו
          </h1>
          <p className="mt-4 text-lg text-curtain-espresso/80">
            השאירו פרטים ונחזור אליכם בהקדם, או פנו אלינו ישירות בוואטסאפ.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <AddressCard />
          <div className="rounded-sm border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <ContactForm />
          </div>
        </div>
      </div>
    </main>
  );
}
