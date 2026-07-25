# Ayni Studios Web — Dev Tasks

_Last updated: 2026-07-24_

> Tracks active development tasks, bugs, and the completed work log for `aynistudios-web`.
> New bugs and unplanned tasks go in **Untracked** first. Run a workspace audit to promote them to the master `todo.md` as A-### items.
> Cross-reference: `../../Noah95/todo.md` (A-### prefix) | `../../Noah95/status.md`

---

## Tracked (in master todo)

_No active app dev tasks currently tracked in master todo. Check `../../Noah95/todo.md` for A-### items if new work is in flight._

---

## Untracked (pending promotion to master todo)

<!-- Drop new bugs and unplanned tasks here. Include: what broke, where, and any reproduction steps. -->
<!-- Run workspace-audit to review and promote items to A-### in the master todo. -->

- **Launch checklist — 🚀 SITE WENT LIVE on ayni-studios.com 2026-07-10 (~09:51 PT):**
  1. ~~Blaze upgrade~~ ✅
  2. ~~Allowlist seed~~ ✅ (owner ran `scripts/seed-allowlist.py`; note: a stale April test doc `_allowlist/Q288za15…` with misspelled `workspaceid` remains — inert, delete at leisure)
  3. ~~Firestore + Storage rules deployed~~ ✅
  4. ~~GitHub + App Hosting backend~~ ✅ — repo `studiosayni/aynistudios`, auto-rollouts from `main`; backend `aynistudios-web`
  5. Review pillar-word translations in `app/lib/pillarWords.ts` (flagged for native review) — still open
  6. ~~DNS cutover~~ ✅ — apex live with cert (gotcha for the record: the certificatemanager ACME CNAME had been placed on `@`, breaking apex resolution; moved to the `_acme-challenge_…` host and cert minted ~40 min later)
  7. **Still open:** add `www.ayni-studios.com` as a second custom domain in App Hosting (DNS CNAME already points at the apex; Auth authorized domains already include it)
- ~~**Mobile device pass**~~ ✅ Done 2026-07-24 — real-device pass on iOS Safari + iOS Chrome surfaced three genuine bugs (opaque hero video, dead library page, missing thumbnails), all fixed same day; see Recently Completed. Layouts themselves were fine.
- **UX review follow-ups (2026-07-24)** — from a full pass over Main + Library. Deferred at Noah's direction; none are blocking. Roughly by impact:
  1. **Hero CTAs fall below the fold on short viewports.** The hero's height is driven by the fixed-aspect word-cloud video (896×504), not the viewport, so total content is ~857px regardless. On a 13" MacBook (~750px viewport) "View the Library" / "Client Portal" are both off-screen, and the scroll cue already sits below the fold at 873px. Cap the video with `max-h-[38vh]` or a `clamp()` and tighten `py-20` on short viewports.
  2. **Duplicate and *conflicting* titles on library cards.** Six of seven thumbnails have the title burned into the artwork, and the card repeats it — often differently: thumb "OIL SPILL THREATENS AN ENTIRE ECOSYSTEM" vs title "Oil Spill Threatens the Galápagos"; "RESCUED PRIMATES OF THE AMAZON" vs "Orphaned Monkeys of the Amazon Rainforest"; "A HIGHWAY OF HOPE AND CORRUPTION IN THE AMAZON" vs "The Bridge to Nowhere". Fix via `thumbnailUrl` overrides pointing at clean frames, or reconcile the copy.
  3. **Featured plays inline, every other card ejects to youtube.com** in a new tab, with no external-link affordance. Reusing the lite-YouTube facade (or a lightbox) for grid cards would keep people in the library.
  4. **Homepage ends on the Malcolm X quote with no CTA;** the only conversion section (Clients & Contact) is buried mid-page. Consider moving the quote up near the hero and closing on the CTA.
  5. **Partner logos are hard to read** — `opacity-60 grayscale` plus wildly inconsistent optical sizing (teamLab/La Isla render as tiny emblems next to full-width IFRC-WWF). Per-logo sizing + ~75% resting opacity. They're also not linked.
  6. ~~**YouTube handle mismatch**~~ ✅ Done 2026-07-25 — worse than a mismatch: `Footer.tsx` linked `@ayni-studios`, which returns **HTTP 404**. The footer's YouTube icon had been dead. `@Ayni.Studios` (the JSON-LD value) is the real channel — verified 200 + title "Ayni Studios - YouTube". Footer corrected.
  7. ~~**Contrast failures**~~ ✅ Done 2026-07-25 — footer copyright `/40`→`/60` (3.25:1 → 5.86:1), navbar "Logout" and "Access is invite-only" `/50`→`/60` (4.37:1 → 5.86:1). All now clear the 4.5:1 floor for normal-size text. The footer's amber `#FEB040/70` was measured at 5.58:1 and left alone.
  8. **Hero stills bypass `next/image`** (raw `<img>`, lint rule disabled) — no responsive sizing, no AVIF/WebP, so a phone downloads the same 383KB desktop JPEG. Four stills (~966KB) + video (~1.4MB) ≈ 2.4MB above the fold.
  9. **Consider dropping `unoptimized` on library thumbnails.** Routing them through `/_next/image` serves AVIF/WebP at the right size *and* makes them immune to client-side blockers (they'd come from our own origin). Tradeoff: image traffic lands on the App Hosting bill.
  10. Smaller — mostly done 2026-07-25:
      - ~~Navbar active-page state~~ ✅ `/library` renders the Library link in amber with `aria-current="page"`.
      - ~~Signed-in portal card dead space~~ ✅ CTA pinned with `mt-auto`; trailing space inside both cards is now an identical 41px (was ~128px on the portal card).
      - ~~Barlow weight 800~~ ✅ removed from `layout.tsx` — zero uses, one fewer font preload. 500 stays: ParticleField sets it as a raw canvas font string, not a Tailwind class, so it isn't greppable as a utility.
      - ~~`/admin/library` on the old `youtubeThumb()` path~~ ✅ moved to the shared `LibraryThumbnail` — admin now gets the same fallback chain and 1280×720 artwork.
      - **Still open: category/year filtering on `/library`.** Deliberately skipped — with 7 items, filter chrome costs more than it returns. Revisit when the catalog is large enough that scanning it is actual work.

---

## Roadmap / Backlog

Items identified but not yet prioritized:

- **Phase 2 remainder:** migrate the billing API routes (Stripe webhook, invoice PDF, mark-paid, send-invoice-email) from `x-admin-key` to `firebase-admin` ID-token verification (`app/lib/firebaseAdmin.ts` + `/api/portal/notify` are the pattern); verify ayni-studios.com in Resend + set `RESEND_API_KEY` secret so portal notifications actually send (they currently no-op with a log).
- **Stripe deployment:** Card checkout framework is scaffolded but not deployed — activate when billing is ready.

---

## Recently Completed

0000. **Mobile bug sweep — hero alpha, library data path, thumbnails (2026-07-24)** — Three real bugs found by a UX review + real-device pass, all shipped same day:
   - **Hero word-cloud was opaque on Safari and all iOS browsers.** Both encodes were correct all along; only the `<source>` order was wrong. WebKit plays VP9/WebM but ignores its alpha, so it claimed the WebM and never reached the HEVC file built for it. Swapped so `hvc1` is listed first — engines that can't decode it fall through to the WebM, so Chrome/Firefox are untouched. Added a dev-only check logging the resolved source per engine. Confirmed transparent on desktop Safari, iOS Safari and iOS Chrome. Details + the `ffprobe` alpha-detection trap are in AYNI_ARCHITECTURE.md.
   - **`/library` and the homepage carousel were dead on mobile** — permanently "Loading library" / never-filling skeletons. Root cause: the Firestore *client* SDK is offline-first, so behind a network filter on `googleapis.com` it waits rather than rejecting and the promise never settles (which is also why the error state never showed). Both surfaces now read server-side via the Admin SDK and ship the catalog in the HTML; `/library` became a plain server component with no loading state, killing the ~8s blank load. Split `libraryShared.ts` out so server code doesn't import the client SDK, which also keeps `firebase/auth` + `firebase/firestore` out of the library page's client bundle. Both routes prerender with `revalidate = 300`. **Portal/auth deliberately still use the client SDK.**
   - **`/library` finally has its own metadata** — impossible while it was a client component; it had been inheriting the homepage title everywhere.
   - **Thumbnails:** grid + carousel were requesting `hqdefault` (480×360, letterboxed) into ~400px slots with *no* error handling — a failed request left a bare black rectangle. New shared `LibraryThumbnail` + `thumbnailChain()` walks maxres → hq → `img.youtube.com` mirror → branded placeholder. Testing caught a flaw in the first cut: YouTube returns a 404 with a decodable 120×90 grey body, so `onError` never fires and the chain stalled; now also advances on `naturalWidth <= 120`. All surfaces serve 1280×720.
   - Verified: production build clean, `tsc` clean, lint unchanged at the 9 pre-existing `admin/` errors, catalog present in raw server HTML, and the whole thing confirmed working on a real phone.
   - Follow-ups from the same review are logged in **Untracked** above (deferred, none blocking).

000. **Phase 2 core — review portal (2026-07-10)** — The frame.io-replacement loop, built while DNS propagated:
   - Infra: default Storage bucket created (`aynistudios-fe09b.firebasestorage.app`, US-EAST4); locked-down **Firestore + Storage rules deployed to production** (replacing April's permissive scaffold rules); `firebase-admin` + `server-only` installed.
   - Data layer: `app/lib/reviewAssets.ts` (`_assets` + versions + comments, notify helper), `app/lib/firebaseAdmin.ts` (ADC).
   - UI: Review section on workspace home + `UploadAssetModal` (resumable, progress/cancel, orphan cleanup) + review room at `/workspace/[ws]/review/[assetId]` (player, version switcher, time-coded comments with click-to-seek, resolve, approve/request-changes, admin status + new-version upload); admin dashboard gained a workspace switcher.
   - Notifications: `/api/portal/notify` (ID-token verified; admin action → client contacts, client action → studio; graceful no-op until Resend is configured).
   - Deploy/DNS same day: GitHub repo `studiosayni/aynistudios` connected to App Hosting backend `aynistudios-web` (rollout-000 failed on an empty env value in apphosting.yaml; fixed in rollout-001 ✓ staging live); custom-domain DNS corrected at Namecheap (ACME CNAME was on `@`; moved to `_acme-challenge_…` host) — cert issuance in progress at time of writing.
   - Not yet verified end-to-end: needs `scripts/seed-allowlist.py` run first (sign-in requires an allowlist doc), then the upload → comment → approve loop on staging.

00. **CJN + Stories removal (2026-07-10)** — Removed both surfaces entirely at Noah's direction (supersedes the earlier keep-in-footer decision): `app/stories/`, `app/cjn/`, `/api/cjn/auth`, `proxy.ts` (existed only for the CJN gate), `app/lib/{stories,cjn}.ts`, `content/stories/`; dropped `next-mdx-remote` + `gray-matter` deps and the `CJN_PASSWORD` secret from `apphosting.yaml`/`.env.local.example`; footer Explore trimmed to Library + Client Portal; sitemap/robots updated. Post-redesign polish same day: hero one type-step smaller with a fixed-width rotating-word slot (no line reflow), particles ~1.5× denser at 11–17px, partner logos enlarged (h-14/h-16 + auto-trimmed source padding), IFRC-WWF ↔ Al Faris positions swapped. Note: old `/stories` and `/cjn` URLs will 404 after DNS cutover.

0. **Marketing redesign Phase 1 (2026-07-09)** — Main/Library/Portal redesign per approved plan:
   - **ParticleField** (`app/components/ParticleField.tsx` + `app/lib/pillarWords.ts`): site-wide canvas backdrop, 5 pillars × ~14 languages, hero-intensity → ambient, hidden on admin/workspace, reduced-motion/hidden-tab safe. Replaces the hero video (archived to brand_assets; ~4.3MB removed from the bundle).
   - **Main page rebuild:** full-viewport hero, `LibraryCarousel` (scroll-snap + drag + auto-advance), iCloud-style `PortalSignInCard` (inline Firebase sign-in, welcome-back state) + `ContactCard` on the shared `GlassCard` primitive, Organization JSON-LD.
   - **Library:** featured hero card with lite-YouTube facade (embed only on click), grid restyled; `featured` flag in schema.
   - **Admin:** `/admin/library` CRUD (doc ID = YouTube ID, single-holder featured toggle).
   - **Nav/footer:** top nav slimmed to Library + Portal (smart routing for signed-in users); footer gains Explore column (Library/Stories/CJN/Portal).
   - **Auth refactor:** shared `app/lib/authRouting.ts`; signup now creates the account before the allowlist check (rules-compatible) and deletes uninvited accounts.
   - **Firebase bootstrap:** real client config for `aynistudios-fe09b` (the actual project ID — `.firebaserc` fixed), `_library` seeded with the 7 live productions (real YouTube IDs/titles/dates pulled from the live site + channel `@Ayni.Studios`), locked-down `firestore.rules` + `storage.rules` in-repo, `workspaceId` denormalized onto projects/invoices for provable list rules.
   - Verified in-browser (desktop): hero/particles, carousel with live data, featured play-facade, login, footer links; production build clean. Owner launch checklist in Untracked above.

1. **Initial scaffold (2026-04-19)** — Marketing v1 aligned with live ayni-studios.com: Home, Library, Stories routes. Password-gated CJN landing (`/cjn`, `/cjn/enter`). Invite-only auth skeleton with Firebase Auth (email/pass + Google), Firestore allowlist, and `complete-profile` flow.
2. **Admin panel** — Dashboard + billing UI gated by `role === "admin"` in Firestore allowlist. Client directory, project list + creation wizard with milestones, project detail with milestone management and per-milestone invoice generation.
3. **Client portal** — `/workspace/[workspaceId]` and `/workspace/[workspaceId]/projects/[projectId]` — client-facing project view with status, pending invoices, and receipts.
4. **Payment infrastructure** — Public pay page (`/pay/[invoiceId]`) with Stripe Checkout, Zelle, and bank transfer options. Stripe webhook handler flips invoice to Paid and fires confirmation emails.
5. **PDF invoices** — On-demand generation via `@react-pdf/renderer`. Download endpoint: `/api/invoice/[invoiceNumber]?email=…` (ownership-verified).
