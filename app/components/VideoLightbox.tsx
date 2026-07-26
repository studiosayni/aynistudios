"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { LibraryItem } from "../lib/libraryShared";

// Shared player overlay for library cards. Before this, the featured card
// played inline while every grid and carousel card was a plain outbound link —
// so browsing the library taught you "clicking plays here", then threw you to
// youtube.com. Cards now open here instead.
//
// Built on native <dialog> + showModal(), which gives focus trapping, Escape,
// backdrop rendering and background inertness for free; the only things left
// to do by hand are scroll lock and dismissing on a backdrop click.

type LightboxApi = { open: (item: LibraryItem) => void };

const LightboxContext = createContext<LightboxApi | null>(null);

// Null when no provider is mounted — callers fall back to their plain href.
export function useLightbox(): LightboxApi | null {
  return useContext(LightboxContext);
}

export function LightboxProvider({ children }: { children: React.ReactNode }) {
  const [item, setItem] = useState<LibraryItem | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = useCallback((next: LibraryItem) => setItem(next), []);

  // Escape dismisses <dialog> natively. Verified in-browser that neither
  // React's synthetic onClose nor a native "close" listener fires reliably
  // here — the dialog went open=false with no event at all, leaving state
  // stale, the iframe mounted (video and audio still running) and scroll
  // locked. So own the Escape key directly rather than depending on that
  // event. The native close listener stays as a harmless second line.
  useEffect(() => {
    if (!item) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setItem(null);
    };
    const dialog = dialogRef.current;
    const syncClosed = () => setItem(null);
    document.addEventListener("keydown", onKeyDown);
    dialog?.addEventListener("close", syncClosed);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      dialog?.removeEventListener("close", syncClosed);
    };
  }, [item]);

  // Drive the dialog from state, and hold background scroll while it's open.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (item) {
      if (!dialog.open) dialog.showModal();
      const previous = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previous;
      };
    }
    if (dialog.open) dialog.close();
  }, [item]);

  return (
    <LightboxContext.Provider value={{ open }}>
      {children}

      <dialog
        ref={dialogRef}
        aria-label={item ? `${item.title} — video player` : undefined}
        // A click landing on the dialog itself is a backdrop click; anything
        // inside the player stops at the wrapper below.
        onClick={(e) => {
          if (e.target === dialogRef.current) setItem(null);
        }}
        // Width is also capped from the available height, so the 16:9 player
        // plus its header can never overflow a short viewport. 9rem is the
        // header and breathing room above/below.
        className="m-auto w-[min(92vw,68rem,calc((100svh-9rem)*16/9))] max-w-none bg-transparent p-0 text-[#DCE4EB] backdrop:bg-[#080F11]/85 backdrop:backdrop-blur-sm"
      >
        {item && (
          <div onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-6 pb-3">
              <div className="min-w-0">
                {item.category && (
                  <span className="text-[10px] font-bold uppercase tracked text-[#FEB040]">
                    {item.category}
                  </span>
                )}
                <h2 className="mt-1 text-lg md:text-2xl font-bold uppercase tracked-tight leading-tight text-white">
                  {item.title}
                </h2>
              </div>
              <button
                onClick={() => setItem(null)}
                aria-label="Close video"
                className="shrink-0 rounded-full border border-[#1b282d] w-10 h-10 flex items-center justify-center text-[#DCE4EB]/70 hover:border-[#FEB040] hover:text-[#FEB040] transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.75}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="relative aspect-video overflow-hidden rounded-2xl border border-[#1b282d] bg-black shadow-2xl">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${item.youtubeId}?autoplay=1&rel=0`}
                title={item.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </div>
        )}
      </dialog>
    </LightboxContext.Provider>
  );
}
