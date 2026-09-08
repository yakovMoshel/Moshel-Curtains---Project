import type { Metadata } from "next";
import { ConfiguratorWizard } from "@/components/configurator";

export const metadata: Metadata = {
  title: "בניית הזמנה | וילונות | מושל הוילונות",
  description: "בנו הזמנת וילונות בהתאמה אישית — בחירת סוג, בד, מידות והדמיה.",
  alternates: { canonical: "/curtains/configure" },
};

export default function ConfigureCurtains() {
  return <ConfiguratorWizard />;
}
