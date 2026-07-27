import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import emailjs from "@emailjs/browser";
import { ContactForm } from "@/components/contact/ContactForm";

vi.mock("@emailjs/browser", () => ({
  default: { send: vi.fn() },
}));

const mockedSend = vi.mocked(emailjs.send);

describe("ContactForm", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_EMAILJS_SERVICE_ID", "service_test");
    vi.stubEnv("NEXT_PUBLIC_EMAILJS_TEMPLATE_ID", "template_test");
    vi.stubEnv("NEXT_PUBLIC_EMAILJS_PUBLIC_KEY", "public_test");
    mockedSend.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("shows a validation error per required field and does not submit", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.click(screen.getByRole("button", { name: "שליחה" }));

    expect(await screen.findAllByRole("alert")).toHaveLength(3);
    expect(mockedSend).not.toHaveBeenCalled();
  });

  it("rejects an invalid phone number", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText("שם מלא"), "יעקב");
    await user.type(screen.getByLabelText("טלפון"), "123");
    await user.selectOptions(screen.getByLabelText("סוג מוצר"), "curtains");
    await user.click(screen.getByRole("button", { name: "שליחה" }));

    expect(await screen.findByText("מספר טלפון לא תקין")).toBeInTheDocument();
    expect(mockedSend).not.toHaveBeenCalled();
  });

  it("calls EmailJS and shows a success message for valid input", async () => {
    mockedSend.mockResolvedValueOnce({ status: 200, text: "OK" });
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText("שם מלא"), "יעקב");
    await user.type(screen.getByLabelText("טלפון"), "0526286837");
    await user.selectOptions(screen.getByLabelText("סוג מוצר"), "curtains");
    await user.click(screen.getByRole("button", { name: "שליחה" }));

    await waitFor(() => expect(mockedSend).toHaveBeenCalledTimes(1));
    expect(mockedSend).toHaveBeenCalledWith(
      "service_test",
      "template_test",
      expect.objectContaining({ from_name: "יעקב", phone: "0526286837", product_type: "curtains" }),
      { publicKey: "public_test" },
    );
    expect(await screen.findByRole("status")).toHaveTextContent("הפנייה נשלחה בהצלחה");
  });

  it("shows an error message when EmailJS rejects", async () => {
    mockedSend.mockRejectedValueOnce(new Error("network error"));
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText("שם מלא"), "יעקב");
    await user.type(screen.getByLabelText("טלפון"), "0526286837");
    await user.selectOptions(screen.getByLabelText("סוג מוצר"), "curtains");
    await user.click(screen.getByRole("button", { name: "שליחה" }));

    expect(
      await screen.findByText("אירעה שגיאה בשליחת הטופס, נסו שוב מאוחר יותר."),
    ).toBeInTheDocument();
  });
});
