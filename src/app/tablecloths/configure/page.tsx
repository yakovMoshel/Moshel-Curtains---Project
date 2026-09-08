import type { Metadata } from "next";
import { TableclothConfiguratorWizard } from "@/components/configurator/TableclothConfiguratorWizard";

export const metadata: Metadata = {
  title: "בניית הזמנה | מפות | מושל הוילונות",
  description: "בנו הזמנת מפת בד בהתאמה אישית — בחירת מידות, בד והדמיה.",
  alternates: { canonical: "/tablecloths/configure" },
};

export default function ConfigureTablecloths() {
  return <TableclothConfiguratorWizard />;
}
