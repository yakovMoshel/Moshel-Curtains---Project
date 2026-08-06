import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BlindConfiguratorWizard } from "@/components/configurator/BlindConfiguratorWizard";

describe("BlindConfiguratorWizard", () => {
  it("walks through the full flow and builds a correct WhatsApp link", async () => {
    const user = userEvent.setup();
    render(<BlindConfiguratorWizard />);

    await user.click(screen.getByRole("button", { name: /תריס גלילה חשמלי/ }));
    await user.click(screen.getByRole("button", { name: "הבא" }));

    await user.click(screen.getByRole("button", { name: "אנתרציט" }));
    await user.type(screen.getByLabelText('רוחב (ס"מ)'), "150");
    await user.type(screen.getByLabelText('גובה (ס"מ)'), "220");
    await user.click(screen.getByRole("button", { name: "הבא" }));

    expect(screen.getByText("תריס גלילה חשמלי")).toBeInTheDocument();
    expect(screen.getByText("אנתרציט")).toBeInTheDocument();
    expect(screen.getByText('150 ס"מ (רוחב) × 220 ס"מ (גובה)')).toBeInTheDocument();

    const link = screen.getByRole("link", { name: "שלח הזמנה בוואטסאפ" });
    expect(link).toHaveAttribute("href", expect.stringContaining("https://wa.me/972526286837"));
    expect(link).toHaveAttribute(
      "href",
      expect.stringContaining(encodeURIComponent("סוג: תריס גלילה חשמלי")),
    );
  });

  it("keeps the next button disabled until both a color and a valid size are set", async () => {
    const user = userEvent.setup();
    render(<BlindConfiguratorWizard />);

    await user.click(screen.getByRole("button", { name: /תריס גלילה חשמלי/ }));
    await user.click(screen.getByRole("button", { name: "הבא" }));

    expect(screen.getByRole("button", { name: "הבא" })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "אנתרציט" }));
    expect(screen.getByRole("button", { name: "הבא" })).toBeDisabled();

    await user.type(screen.getByLabelText('רוחב (ס"מ)'), "150");
    await user.type(screen.getByLabelText('גובה (ס"מ)'), "220");
    expect(screen.getByRole("button", { name: "הבא" })).toBeEnabled();
  });
});
