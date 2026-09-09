import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "עלינו | מושל הוילונות",
  description:
    "מושל הוילונות — וילונות, תריסים, ריפוד ומפות בהתאמה אישית, לבתים ולעסקים באזור ירושלים, בית שמש, מודיעין, בנימין, שומרון, תל אביב והמרכז.",
  alternates: { canonical: "/about" },
};

export default function About() {
  return (
    <main className="bg-curtain-cream">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-8 py-16 sm:px-16">
        <div className="animate-fade-in-up max-w-xl">
          <p className="mb-2 text-sm font-medium tracking-[0.2em] text-curtain-taupe uppercase">
            מי אנחנו
          </p>
          <h1 className="font-serif text-4xl font-normal tracking-tight text-curtain-espresso sm:text-5xl">
            מושל הוילונות — התאמה אישית שמתחילה בהקשבה
          </h1>
          <p className="mt-4 text-lg text-curtain-espresso/80">
            מושל הוילונות מתמחה בוילונות, תריסים, ריפוד ומפות בד בהתאמה אישית — מהבחירה הראשונה ועד
            ההתקנה בבית.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-3 rounded-sm border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-semibold tracking-tight text-curtain-espresso">
              אזורי שירות
            </h2>
            <p className="text-base text-curtain-espresso/80">
              אנחנו יוצאים אליכם הביתה בירושלים ובסביבתה, וגם באזור בית שמש, מודיעין, בנימין,
              שומרון, תל אביב והמרכז. איפה שלא תהיו, נשמח להגיע ולהתאים את הפתרון המדויק בשבילכם.
            </p>
          </div>

          <div className="flex flex-col gap-3 rounded-sm border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-semibold tracking-tight text-curtain-espresso">
              מוסדות ועסקים
            </h2>
            <p className="text-base text-curtain-espresso/80">
              לצד לקוחות פרטיים, אנחנו עובדים גם עם מוסדות לימודים, בתי מלון ועסקים שזקוקים לפתרונות
              הצללה וריפוד באיכות גבוהה ובהיקף גדול. אם אתם מייצגים מוסד או עסק ומחפשים ליווי מקצועי
              מתחילת הפרויקט ועד סופו, נשמח לשמוע מכם ולתאם פגישה.
            </p>
            <Link
              href="/contact"
              className="mt-2 w-fit text-sm font-medium text-curtain-espresso underline"
            >
              צרו קשר
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
