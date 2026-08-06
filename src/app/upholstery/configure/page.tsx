import type { Metadata } from "next";
import { UpholsteryConfiguratorWizard } from "@/components/configurator/UpholsteryConfiguratorWizard";

export const metadata: Metadata = {
  title: "בניית הזמנה | ריפוד | מושל הוילונות",
};

export default function ConfigureUpholstery() {
  return <UpholsteryConfiguratorWizard />;
}
