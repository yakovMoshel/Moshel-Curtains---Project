import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TableclothConfiguratorWizard } from "@/components/configurator/TableclothConfiguratorWizard";

describe("TableclothConfiguratorWizard", () => {
  it("supports a round tablecloth flow with a diameter field", async () => {
    const user = userEvent.setup();
    render(<TableclothConfiguratorWizard />);

    await user.click(screen.getByRole("button", { name: /פשתן טהור/ }));
    await user.click(screen.getByRole("button", { name: "הבא" }));

    await user.click(screen.getByRole("button", { name: "שמנת קלאסי" }));
    await user.click(screen.getByRole("button", { name: "עגול" }));

    expect(screen.getByRole("button", { name: "הבא" })).toBeDisabled();

    await user.type(screen.getByLabelText('קוטר (ס"מ)'), "140");
    expect(screen.getByRole("button", { name: "הבא" })).toBeEnabled();

    await user.click(screen.getByRole("button", { name: "הבא" }));

    expect(screen.getByText('קוטר 140 ס"מ')).toBeInTheDocument();

    const link = screen.getByRole("link", { name: "שלח הזמנה בוואטסאפ" });
    expect(link).toHaveAttribute(
      "href",
      expect.stringContaining(encodeURIComponent('מידות: קוטר 140 ס"מ')),
    );
  });

  it("supports a rectangular tablecloth flow with length/width fields", async () => {
    const user = userEvent.setup();
    render(<TableclothConfiguratorWizard />);

    await user.click(screen.getByRole("button", { name: /פשתן טהור/ }));
    await user.click(screen.getByRole("button", { name: "הבא" }));

    await user.click(screen.getByRole("button", { name: "שמנת קלאסי" }));
    await user.click(screen.getByRole("button", { name: "מלבני/מרובע" }));

    await user.type(screen.getByLabelText('אורך (ס"מ)'), "200");
    await user.type(screen.getByLabelText('רוחב (ס"מ)'), "120");
    expect(screen.getByRole("button", { name: "הבא" })).toBeEnabled();

    await user.click(screen.getByRole("button", { name: "הבא" }));

    expect(screen.getByText('200 ס"מ (אורך) × 120 ס"מ (רוחב)')).toBeInTheDocument();
  });

  it("clears the previous shape's dimension fields when switching shape", async () => {
    const user = userEvent.setup();
    render(<TableclothConfiguratorWizard />);

    await user.click(screen.getByRole("button", { name: /פשתן טהור/ }));
    await user.click(screen.getByRole("button", { name: "הבא" }));

    await user.click(screen.getByRole("button", { name: "שמנת קלאסי" }));
    await user.click(screen.getByRole("button", { name: "עגול" }));
    await user.type(screen.getByLabelText('קוטר (ס"מ)'), "140");

    await user.click(screen.getByRole("button", { name: "מלבני/מרובע" }));

    expect(screen.queryByLabelText('קוטר (ס"מ)')).not.toBeInTheDocument();
    expect(screen.getByLabelText('אורך (ס"מ)')).toHaveValue(null);
    expect(screen.getByRole("button", { name: "הבא" })).toBeDisabled();
  });
});
