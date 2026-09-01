import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
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
    vi.useRealTimers();
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

    render(
      <AiVisualizationPanel
        selection={selection}
        whatsAppOrderMessage="הודעת הזמנה"
        whatsAppHref="https://wa.me/972526286837?text=הודעת+הזמנה"
      />,
    );

    await user.click(screen.getByRole("button", { name: "רוצה לראות איך זה ייראה אצלכם בבית?" }));

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(fileInput, openPanelAndUpload());

    await waitFor(() => {
      expect(screen.getByRole("link", { name: "הורד תמונה" })).toBeInTheDocument();
    });

    // Only one WhatsApp control should be visible once a result is showing —
    // the plain order link is hidden and replaced by the result's own link,
    // which points straight at the business number with the attach-instruction
    // line appended.
    const whatsAppLinks = screen.getAllByRole("link", { name: "שלח הזמנה בוואטסאפ" });
    expect(whatsAppLinks).toHaveLength(1);
    const href = whatsAppLinks[0]?.getAttribute("href") ?? "";
    expect(decodeURIComponent(href)).toContain("הודעת הזמנה");
    expect(decodeURIComponent(href)).toContain("נא לצרף אותה להודעה");
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

    render(
      <AiVisualizationPanel
        selection={selection}
        whatsAppOrderMessage="הודעת הזמנה"
        whatsAppHref="https://wa.me/972526286837?text=הודעת+הזמנה"
      />,
    );

    await user.click(screen.getByRole("button", { name: "רוצה לראות איך זה ייראה אצלכם בבית?" }));
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(fileInput, openPanelAndUpload());

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("אירעה שגיאה");
    });

    // The plain order link should still be visible — only success hides it.
    expect(screen.getByRole("link", { name: "שלח הזמנה בוואטסאפ" })).toBeInTheDocument();
  });

  it("shows a timeout error if the request takes too long", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((_url: string, init?: RequestInit) => {
        return new Promise((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => {
            reject(new DOMException("Aborted", "AbortError"));
          });
        });
      }),
    );

    render(
      <AiVisualizationPanel
        selection={selection}
        whatsAppOrderMessage="הודעת הזמנה"
        whatsAppHref="https://wa.me/972526286837?text=הודעת+הזמנה"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "רוצה לראות איך זה ייראה אצלכם בבית?" }));
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

    vi.useFakeTimers();
    fireEvent.change(fileInput, { target: { files: [openPanelAndUpload()] } });

    await act(() => vi.advanceTimersByTimeAsync(90_000));
    vi.useRealTimers();

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("יצירת ההדמיה לוקחת יותר זמן מהצפוי");
    });
  });
});
