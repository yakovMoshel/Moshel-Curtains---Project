import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UpholsteryConfiguratorWizard } from "@/components/configurator/UpholsteryConfiguratorWizard";

describe("UpholsteryConfiguratorWizard", () => {
  it("walks through the full flow with no size step and builds a correct WhatsApp link", async () => {
    const user = userEvent.setup();
    render(<UpholsteryConfiguratorWizard />);

    await user.click(screen.getByRole("button", { name: /קטיפה/ }));
    await user.click(screen.getByRole("button", { name: "הבא" }));

    await user.click(screen.getByRole("button", { name: "ירוק זית" }));
    await user.click(screen.getByRole("button", { name: "כורסא" }));
    await user.click(screen.getByRole("button", { name: "הבא" }));

    expect(screen.getByText("קטיפה")).toBeInTheDocument();
    expect(screen.getByText("ירוק זית")).toBeInTheDocument();
    expect(screen.getByText("כורסא")).toBeInTheDocument();

    const link = screen.getByRole("link", { name: "שלח הזמנה בוואטסאפ" });
    expect(link).toHaveAttribute("href", expect.stringContaining("https://wa.me/972526286837"));
    expect(link).toHaveAttribute(
      "href",
      expect.stringContaining(encodeURIComponent("פריט: כורסא")),
    );
  });

  it("keeps the next button disabled until both a color and a furniture piece are chosen", async () => {
    const user = userEvent.setup();
    render(<UpholsteryConfiguratorWizard />);

    await user.click(screen.getByRole("button", { name: /קטיפה/ }));
    await user.click(screen.getByRole("button", { name: "הבא" }));

    expect(screen.getByRole("button", { name: "הבא" })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "ירוק זית" }));
    expect(screen.getByRole("button", { name: "הבא" })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "כורסא" }));
    expect(screen.getByRole("button", { name: "הבא" })).toBeEnabled();
  });
});
