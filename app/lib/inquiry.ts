export const INQUIRY_TYPES = [
  "Documentary production",
  "Brand & impact content",
  "Editing & post-production",
  "Something else",
] as const;
export type Inquiry = {
  name: string;
  email: string;
  organization: string;
  service: string;
  timeline: string;
  budget: string;
  brief: string;
  website: string;
};
const text = (v: unknown, max: number) =>
  typeof v === "string" && v.length <= max ? v.trim() : "";
export function validateInquiry(
  value: unknown,
): { ok: true; data: Inquiry } | { ok: false; message: string } {
  if (!value || typeof value !== "object")
    return { ok: false, message: "Please complete the project brief." };
  const v = value as Record<string, unknown>;
  if (typeof v.website === "string" && v.website.trim())
    return { ok: false, message: "Unable to send this request." };
  const data = {
    name: text(v.name, 100),
    email: text(v.email, 254),
    organization: text(v.organization, 160),
    service: text(v.service, 80),
    timeline: text(v.timeline, 160),
    budget: text(v.budget, 80),
    brief: text(v.brief, 5000),
    website: "",
  };
  if (!data.name || !data.organization)
    return { ok: false, message: "Please add your name and organization." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    return { ok: false, message: "Please enter a valid email address." };
  if (!INQUIRY_TYPES.some((s) => s === data.service))
    return { ok: false, message: "Please choose a project type." };
  if (data.brief.length < 20)
    return {
      ok: false,
      message:
        "Tell us a little more about the project (at least 20 characters).",
    };
  return { ok: true, data };
}
export function inquiryText(d: Inquiry) {
  return [
    `Name: ${d.name}`,
    `Email: ${d.email}`,
    `Organization: ${d.organization}`,
    `Project type: ${d.service}`,
    `Timeline: ${d.timeline || "Not specified"}`,
    `Budget: ${d.budget || "Not specified"}`,
    "",
    d.brief,
  ].join("\n");
}
