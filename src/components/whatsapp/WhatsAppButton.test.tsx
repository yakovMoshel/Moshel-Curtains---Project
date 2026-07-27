import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";

describe("WhatsAppButton", () => {
  it("links to the business's wa.me number", () => {
    render(<WhatsAppButton />);
    const link = screen.getByRole("link", { name: "פנייה בוואטסאפ" });
    expect(link).toHaveAttribute("href", expect.stringContaining("https://wa.me/972526286837"));
    expect(link).toHaveAttribute("target", "_blank");
  });
});
