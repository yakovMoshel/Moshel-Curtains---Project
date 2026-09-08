"use client";

import { useState, type FormEvent } from "react";
import emailjs from "@emailjs/browser";
import {
  PRODUCT_OPTIONS,
  validateContactForm,
  type ContactFormErrors,
  type ContactFormValues,
} from "@/components/contact/validation";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

const EMPTY_VALUES: ContactFormValues = { name: "", phone: "", productType: "" };

export function ContactForm() {
  const [values, setValues] = useState<ContactFormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");

  function updateField<K extends keyof ContactFormValues>(field: K, value: string): void {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    const validationErrors = validateContactForm(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      console.error("EmailJS environment variables are not configured.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: values.name,
          phone: values.phone,
          product_type: values.productType,
        },
        { publicKey },
      );
      setStatus("success");
      setValues(EMPTY_VALUES);
    } catch (err) {
      console.error("Failed to send contact form via EmailJS", err);
      setStatus("error");
    }
  }

  const inputClassName =
    "rounded-sm border border-curtain-tan bg-curtain-cream px-4 py-2 text-curtain-espresso focus:border-curtain-gold focus:ring-2 focus:ring-curtain-gold/40 focus:outline-none";

  return (
    <form onSubmit={handleSubmit} noValidate className="flex max-w-md flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm font-medium text-curtain-espresso">
          שם מלא
        </label>
        <input
          id="name"
          type="text"
          value={values.name}
          onChange={(e) => updateField("name", e.target.value)}
          className={inputClassName}
        />
        {errors.name && (
          <p role="alert" className="text-sm text-red-700">
            {errors.name}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="phone" className="text-sm font-medium text-curtain-espresso">
          טלפון
        </label>
        <input
          id="phone"
          type="tel"
          value={values.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          className={inputClassName}
        />
        {errors.phone && (
          <p role="alert" className="text-sm text-red-700">
            {errors.phone}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="productType" className="text-sm font-medium text-curtain-espresso">
          סוג מוצר
        </label>
        <select
          id="productType"
          value={values.productType}
          onChange={(e) => updateField("productType", e.target.value)}
          className={inputClassName}
        >
          <option value="">בחרו סוג מוצר</option>
          {PRODUCT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.productType && (
          <p role="alert" className="text-sm text-red-700">
            {errors.productType}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded-sm bg-curtain-espresso px-6 py-3 text-sm font-medium text-curtain-cream transition-transform duration-300 hover:scale-[1.02] focus:ring-2 focus:ring-curtain-gold/40 focus:outline-none disabled:opacity-50 disabled:hover:scale-100"
      >
        {status === "submitting" ? "שולח..." : "שליחה"}
      </button>

      {status === "success" && (
        <p role="status" className="text-sm text-green-700">
          הפנייה נשלחה בהצלחה, ניצור קשר בהקדם.
        </p>
      )}
      {status === "error" && (
        <p role="alert" className="text-sm text-red-700">
          אירעה שגיאה בשליחת הטופס, נסו שוב מאוחר יותר.
        </p>
      )}
    </form>
  );
}
