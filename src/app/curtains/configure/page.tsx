import type { Metadata } from "next";
import { ConfiguratorWizard } from "@/components/configurator";

export const metadata: Metadata = {
  title: "בניית הזמנה | וילונות | מושל הוילונות",
};

export default function ConfigureCurtains() {
  return <ConfiguratorWizard />;
}
