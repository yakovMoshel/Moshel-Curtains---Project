import type { Metadata } from "next";
import { BlindConfiguratorWizard } from "@/components/configurator/BlindConfiguratorWizard";

export const metadata: Metadata = {
  title: "בניית הזמנה | תריסים | מושל הוילונות",
  description: "בנו הזמנת תריסים בהתאמה אישית — בחירת סוג, חומר, מידות והדמיה.",
  alternates: { canonical: "/blinds/configure" },
};

export default function ConfigureBlinds() {
  return <BlindConfiguratorWizard />;
}
