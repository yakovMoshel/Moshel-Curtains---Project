import type { Metadata } from "next";
import { UpholsteryConfiguratorWizard } from "@/components/configurator/UpholsteryConfiguratorWizard";

export const metadata: Metadata = {
  title: "בניית הזמנה | ריפוד | מושל הוילונות",
  description: "בנו הזמנת ריפוד בהתאמה אישית — בחירת בד, רהיט והדמיה.",
  alternates: { canonical: "/upholstery/configure" },
};

export default function ConfigureUpholstery() {
  return <UpholsteryConfiguratorWizard />;
}
