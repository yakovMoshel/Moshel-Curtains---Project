import { ScrollSequenceProvider } from "@/components/scroll-sequence";

export default function Home() {
  return (
    <main>
      <h1 className="sr-only">מושל הוילונות — וילונות, תריסים, ריפוד ומפות בהתאמה אישית</h1>
      <ScrollSequenceProvider />
      {/* Gallery, About, and Contact sections are built out in later tasks. */}
    </main>
  );
}
