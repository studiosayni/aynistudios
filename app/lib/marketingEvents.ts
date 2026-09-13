import { isPublicPath } from "./publicContent";
export const ANALYTICS_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";
export const CONSENT_KEY = "ayni-analytics-consent";
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
export function analyticsAllowed() {
  try {
    return localStorage.getItem(CONSENT_KEY) === "yes";
  } catch {
    return false;
  }
}
export function trackEvent(
  name: string,
  params: Record<string, string | number> = {},
) {
  if (
    typeof window === "undefined" ||
    !analyticsAllowed() ||
    !isPublicPath(window.location.pathname)
  )
    return;
  window.gtag?.("event", name, {
    ...params,
    page_location: window.location.origin + window.location.pathname,
    page_path: window.location.pathname,
  });
}
