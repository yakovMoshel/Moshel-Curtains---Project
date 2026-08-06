import type { Metadata } from "next";
import { TableclothConfiguratorWizard } from "@/components/configurator/TableclothConfiguratorWizard";

export const metadata: Metadata = {
  title: "בניית הזמנה | מפות | מושל הוילונות",
};

export default function ConfigureTablecloths() {
  return <TableclothConfiguratorWizard />;
}
