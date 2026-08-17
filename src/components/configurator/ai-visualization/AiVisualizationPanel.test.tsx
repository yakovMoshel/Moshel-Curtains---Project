import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AiVisualizationPanel } from "@/components/configurator/ai-visualization/AiVisualizationPanel";

const selection = {
  category: "curtains" as const,
  typeLabel: "וילון קלאסי",
  colorLabel: "כחול נייבי",
};

function openPanelAndUpload(fileName = "photo.png") {
  const file = new File([new Uint8Array(10)], fileName, { type: "image/png" });
  return file;
}

describe("AiVisualizationPanel", () => {
  beforeEach(() => {
    vi.stubGlobal("URL", {
      ...URL,
      createObjectURL: vi.fn(() => "blob:mock"),
      revokeObjectURL: vi.fn(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("shows loading then the result on a successful upload", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ image: "base64data", mimeType: "image/png" }),
      }),
    );

    render(<AiVisualizationPanel selection={selection} whatsAppOrderMessage="הודעת הזמנה" />);

    await user.click(screen.getByRole("button", { name: "רוצה לראות איך זה ייראה אצלכם בבית?" }));

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(fileInput, openPanelAndUpload());

    await waitFor(() => {
      expect(screen.getByRole("link", { name: "הורד תמונה" })).toBeInTheDocument();
    });
    expect(screen.getByRole("link", { name: "שלח הזמנה בוואטסאפ" })).toBeInTheDocument();
  });

  it("shows an error message when the upload fails", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ error: "אירעה שגיאה" }),
      }),
    );

    render(<AiVisualizationPanel selection={selection} whatsAppOrderMessage="הודעת הזמנה" />);

    await user.click(screen.getByRole("button", { name: "רוצה לראות איך זה ייראה אצלכם בבית?" }));
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(fileInput, openPanelAndUpload());

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("אירעה שגיאה");
    });
  });
});
