import type { Metadata } from "next";
import { BlindConfiguratorWizard } from "@/components/configurator/BlindConfiguratorWizard";

export const metadata: Metadata = {
  title: "בניית הזמנה | תריסים | מושל הוילונות",
};

export default function ConfigureBlinds() {
  return <BlindConfiguratorWizard />;
}
