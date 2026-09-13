"use client";
import { useState } from "react";
import Link from "next/link";
import { INQUIRY_TYPES, inquiryText, validateInquiry } from "../lib/inquiry";
import { trackEvent } from "../lib/marketingEvents";

export default function InquiryForm({
  initialService = "",
  canSend = false,
}: {
  initialService?: string;
  canSend?: boolean;
}) {
  const [state, setState] = useState<
    "idle" | "sending" | "sent" | "draft" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  async function submit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const result = validateInquiry(data);
    if (!result.ok) {
      setState("error");
      setMessage(result.message);
      return;
    }
    if (!canSend) {
      const subject = encodeURIComponent(
        `Project inquiry: ${result.data.service}`,
      );
      const body = encodeURIComponent(inquiryText(result.data));
      window.location.href = `mailto:humanity@ayni-studios.com?subject=${subject}&body=${body}`;
      setState("draft");
      trackEvent("email_draft_open");
      return;
    }
    setState("sending");
    setMessage("");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      const reply = await res.json();
      if (!res.ok) throw new Error(reply.error || "Unable to send your brief.");
      setState("sent");
      trackEvent("generate_lead");
      form.reset();
    } catch (error) {
      setState("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "We could not send your brief. Please email us directly.",
      );
    }
  }
  async function copy(form: HTMLFormElement) {
    const result = validateInquiry(Object.fromEntries(new FormData(form)));
    if (!result.ok) {
      setMessage(result.message);
      return;
    }
    try {
      await navigator.clipboard.writeText(inquiryText(result.data));
      setMessage(
        "Brief copied. You can paste it into an email to humanity@ayni-studios.com.",
      );
    } catch {
      setMessage(
        "Copy is unavailable here. Your brief is still in the form; please select and copy your text.",
      );
    }
  }
  return (
    <form
      onSubmit={submit}
      className="inquiry-form"
      aria-label="Project inquiry"
      aria-busy={state === "sending"}
    >
      <div className="form-row">
        <label>
          Your name
          <input name="name" autoComplete="name" required maxLength={100} />
        </label>
        <label>
          Work email
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
          />
        </label>
      </div>
      <label>
        Organization
        <input
          name="organization"
          autoComplete="organization"
          required
          maxLength={160}
        />
      </label>
      <label>
        What can we help with?
        <select name="service" required defaultValue={initialService}>
          <option value="" disabled>
            Choose a project type
          </option>
          {INQUIRY_TYPES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
      <div className="form-row">
        <label>
          Timeline <span>(optional)</span>
          <input
            name="timeline"
            placeholder="A launch date, or still exploring"
            maxLength={160}
          />
        </label>
        <label>
          Budget range <span>(optional)</span>
          <input
            name="budget"
            placeholder="Include your currency"
            maxLength={80}
          />
        </label>
      </div>
      <label>
        Tell us about the project
        <textarea
          name="brief"
          required
          minLength={20}
          maxLength={5000}
          placeholder="What’s the story, who is it for, and what would you like to create?"
        />
      </label>
      <div className="honeypot" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <p className="small-copy">
        We’ll use these details to respond to your inquiry. Please leave
        confidential material out of this first brief.{" "}
        <Link href="/privacy" className="underline">
          Privacy details
        </Link>
        .
      </p>
      <div className="button-row">
        <button type="submit" className="button" disabled={state === "sending"}>
          {state === "sending"
            ? "Sending…"
            : canSend
              ? "Send project brief"
              : "Open email draft"}
          <span aria-hidden="true">↗</span>
        </button>
        <a
          href="mailto:humanity@ayni-studios.com"
          className="text-link"
          data-track="email_click"
        >
          Email instead
        </a>
      </div>
      {!canSend && (
        <p className="small-copy">
          Your email app will open with your brief ready to review and send.
        </p>
      )}
      {state === "draft" && (
        <div className="form-notice" role="status">
          <p>
            Your brief is ready in your email app. Send it there to reach us. If
            the app did not open, copy the brief and email
            humanity@ayni-studios.com.
          </p>
          <button
            type="button"
            className="text-link underline"
            onClick={(e) => {
              if (e.currentTarget.form) void copy(e.currentTarget.form);
            }}
          >
            Copy your brief
          </button>
          {message && <p>{message}</p>}
        </div>
      )}
      {state === "sent" && (
        <p className="form-notice" role="status">
          Your brief has been sent. Thank you for getting in touch—we’ll respond
          using the email address you provided.
        </p>
      )}
      {state === "error" && (
        <div className="form-notice form-error" role="alert">
          <p>{message}</p>
          <button
            type="button"
            className="text-link underline"
            onClick={(e) => {
              if (e.currentTarget.form) void copy(e.currentTarget.form);
            }}
          >
            Copy your brief
          </button>
        </div>
      )}
    </form>
  );
}
