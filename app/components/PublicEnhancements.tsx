"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import dynamic from "next/dynamic";
import { useReportWebVitals } from "next/web-vitals";
import { isPublicPath } from "../lib/publicContent";
import { ANALYTICS_ID, CONSENT_KEY, trackEvent } from "../lib/marketingEvents";
const ParticleField = dynamic(() => import("./ParticleField"));
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("ayni-consent", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("ayni-consent", callback);
  };
}
function snapshot() {
  try {
    return localStorage.getItem(CONSENT_KEY) || "unset";
  } catch {
    return "no";
  }
}
function choose(value: string) {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    /* analytics stays disabled */
  }
  window.dispatchEvent(new Event("ayni-consent"));
}
const reportVitals: Parameters<typeof useReportWebVitals>[0] = (metric) =>
  trackEvent(metric.name, {
    value:
      metric.name === "CLS"
        ? Math.round(metric.value * 1000)
        : Math.round(metric.value),
    metric_id: metric.id,
  });
function Analytics() {
  const path = usePathname();
  const consent = useSyncExternalStore(subscribe, snapshot, () => "pending");
  const [ready, setReady] = useState(false);
  useReportWebVitals(reportVitals);
  useEffect(() => {
    if (consent !== "yes" || !ready) return;
    trackEvent("page_view");
  }, [path, consent, ready]);
  useEffect(() => {
    if (consent !== "yes") return;
    const click = (e: MouseEvent) => {
      const target =
        e.target instanceof Element
          ? e.target.closest<HTMLElement>("[data-track]")
          : null;
      if (target?.dataset.track) trackEvent(target.dataset.track);
    };
    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, [consent]);
  return (
    <>
      {consent === "yes" && (
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_ID}`}
          strategy="afterInteractive"
          onReady={() => {
            window.dataLayer = window.dataLayer || [];
            window.gtag = function () {
              // Google’s command queue expects an Arguments object.
              // eslint-disable-next-line prefer-rest-params
              window.dataLayer!.push(arguments);
            };
            window.gtag("consent", "update", {
              analytics_storage: "granted",
              ad_storage: "denied",
              ad_user_data: "denied",
              ad_personalization: "denied",
            });
            window.gtag("js", new Date());
            window.gtag("config", ANALYTICS_ID, {
              page_location: window.location.origin + window.location.pathname,
              send_page_view: false,
              allow_google_signals: false,
              allow_ad_personalization_signals: false,
            });
            setReady(true);
          }}
        />
      )}
      {consent === "unset" && (
        <aside className="analytics-choice" aria-label="Optional analytics">
          <p>May we use optional usage measurement to improve the website?</p>
          <button type="button" onClick={() => choose("yes")}>
            Allow analytics
          </button>
          <button type="button" onClick={() => choose("no")}>
            No thanks
          </button>
        </aside>
      )}
      {consent !== "pending" && consent !== "unset" && (
        <button
          type="button"
          className="analytics-settings"
          onClick={() => {
            window.gtag?.("consent", "update", { analytics_storage: "denied" });
            choose("unset");
          }}
        >
          Analytics preferences
        </button>
      )}
    </>
  );
}
export default function PublicEnhancements() {
  const path = usePathname();
  const consent = useSyncExternalStore(subscribe, snapshot, () => "pending");
  useEffect(() => {
    if (!/^G-[A-Z0-9]+$/.test(ANALYTICS_ID)) return;
    const enabled = isPublicPath(path) && consent === "yes";
    // A previously loaded tag must also stop collecting when a visitor
    // enters a client-only route or withdraws their choice.
    (window as unknown as Record<string, unknown>)[
      `ga-disable-${ANALYTICS_ID}`
    ] = !enabled;
    window.gtag?.("consent", "update", {
      analytics_storage: enabled ? "granted" : "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  }, [path, consent]);
  if (!isPublicPath(path)) return <ParticleField />;
  return /^G-[A-Z0-9]+$/.test(ANALYTICS_ID) ? <Analytics /> : null;
}
