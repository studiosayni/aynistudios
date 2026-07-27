# Ayni Studios Web — Dev Tasks

_Last updated: 2026-07-27_

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

**Launch leftovers** (site went live 2026-07-10):
- Add `www.ayni-studios.com` as a second custom domain in App Hosting. DNS CNAME already points at the apex and Auth authorized domains already include it — only the App Hosting side is missing.
- Review pillar-word translations in `app/lib/pillarWords.ts` — flagged for native review, never done.
- Stale April test doc `_allowlist/Q288za15…` with a misspelled `workspaceid`. Inert; delete at leisure.

**Open from the July 2026 UX pass** (none blocking):
- **App Hosting serves no image optimizer.** `/_next/image` 404s in production, so `next/image` silently degrades to a raw `src` with no `srcset`. Worked around for the brand assets (see `scripts/build-brand-assets.py`), but **library thumbnails are still unoptimised in production** and still fetched from `i.ytimg.com` rather than our origin — so they remain exposed to the ad blockers and DNS filters that broke the catalog on mobile. Worth finding out whether optimization can be enabled for the backend; if it can, thumbnails improve for free and the hero could move back to `next/image`.
- **Partner logos are not linked**, and 9 of 12 have white backgrounds baked into the source art. Linking is a business call (brand.md restricts partner-logo use to co-branded materials with explicit permission). Sourcing genuinely transparent or reversed-out variants for all twelve would let the wall drop the white chips and go back to bare marks on the dark background.
- **No category/year filtering on `/library`**, though both fields exist in the schema. Deliberately skipped — with 7 items the filter chrome costs more than it returns. Revisit when scanning the catalog is actual work.
- **Library card artwork carries its own burned-in headlines**, which sit above the card title. Investigated and deliberately left alone — the thumbnails are strong design and the Firestore titles were verified correct against the real YouTube titles. Only a set of hand-picked clean 16:9 stills exported from the masters would improve it, wired in via the existing `thumbnailUrl` override. Asset work, not code.

---

## Roadmap / Backlog

Items identified but not yet prioritized:

- **Phase 2 remainder:** migrate the billing API routes (Stripe webhook, invoice PDF, mark-paid, send-invoice-email) from `x-admin-key` to `firebase-admin` ID-token verification (`app/lib/firebaseAdmin.ts` + `/api/portal/notify` are the pattern); verify ayni-studios.com in Resend + set `RESEND_API_KEY` secret so portal notifications actually send (they currently no-op with a log).
- **Stripe deployment:** Card checkout framework is scaffolded but not deployed — activate when billing is ready.
- **Client-role end-to-end test** of the review portal (upload → comment → approve) — never run against a real client account.

---

## Recently Completed

00000. **UX review + mobile bug sweep (2026-07-24 → 07-27)** — a full pass over Main and Library that started as a design review and turned up several real defects. All shipped and verified live.

   **Bugs that were breaking things for real visitors**
   - *Hero word-cloud was opaque on Safari and every iOS browser.* Both video encodes were correct all along; only the `<source>` order was wrong. WebKit plays VP9/WebM but ignores its alpha channel, so it claimed the WebM and never reached the HEVC file built for it. HEVC is now listed first; engines that can't decode `hvc1` fall through, so Chrome/Firefox are untouched.
   - *`/library` and the homepage carousel were dead on mobile* — permanently "Loading library" and never-filling skeletons. The Firestore **client** SDK is offline-first, so behind a network filter on `googleapis.com` it waits rather than rejecting and the promise never settles (which is also why the error state never appeared). Both surfaces now read server-side via the Admin SDK and ship the catalog in the HTML. Portal and auth deliberately still use the client SDK.
   - *The footer's YouTube icon was a dead link* — `@ayni-studios` returns HTTP 404. Corrected to `@Ayni.Studios`.
   - *`/library` had no metadata of its own*, inheriting the homepage title on every share, bookmark and search result. Fixed as a side effect of becoming a server component.
   - *Thumbnails had no error handling at all* — a failed request left a bare black rectangle. Now a fallback chain (maxres → hq → `img.youtube.com` mirror → branded placeholder).

   **Design and flow**
   - Hero sized from available viewport height, so the CTAs and scroll cue no longer fall below the fold on laptops (fits 550–1200px+).
   - Homepage reordered to close on the CTA instead of dead-ending on the Malcolm X quote.
   - Library cards open a player overlay instead of ejecting to youtube.com, while remaining real anchors so modified clicks and crawlers still work.
   - Partner logos put on uniform white chips — the source assets are inconsistently prepared (8 of 12 have white baked in), which no amount of opacity tuning could reconcile.
   - Three WCAG contrast failures fixed; navbar gained an active-page state.

   **Performance**
   - `/brand` assets were `Cache-Control: max-age=0` — re-downloaded on *every* visit, including the ~1.4MB word-cloud video. Now a day of freshness plus a week of stale-while-revalidate.
   - Pre-built WebP for all brand assets (`scripts/build-brand-assets.py`), since App Hosting runs no image optimizer. Hero stills 341KB → 81–130KB on a phone; brand mark 122KB → 8.7KB; partner set 426KB → ~87KB.
   - Deleted `public/images/` — ~40MB of v1-era photography referenced nowhere but deployed on every build. `public/` went 45MB → 5.8MB.
   - Lint backlog cleared: 9 errors → **0 errors, 0 warnings**, so `eslint` is finally usable as a gate.

   **Gotchas worth not rediscovering** (all now also in AYNI_ARCHITECTURE.md)
   - **`ffprobe` cannot confirm video alpha.** `pix_fmt` reads `yuv420p` for both hero files *even though both carry alpha* — VP9 keeps it in BlockAdditional, HEVC in an auxiliary layer. Check `TAG:ALPHA_MODE=1` and `ffmpeg -bsf:v trace_headers` instead. This cost two wrong diagnoses.
   - **App Hosting's missing optimizer fails silently.** `next/image` does not warn; it just stops emitting `srcset`. Check deployed HTML for `/_next/image`, never assume.
   - **YouTube answers a missing thumbnail with a 404 carrying a decodable 120×90 body**, so the browser fires `load`, not `error` — an `onError`-only fallback chain stalls on a grey blob exactly where `maxresdefault` goes missing.
   - **`<dialog>`'s native `close` event could not be relied on** — Escape closed the dialog with no event firing at all, leaving the player mounted with audio running. The overlay owns the Escape key directly.
   - **`<canvas>` is a replaced element**, so `position: fixed` + `inset-0` does *not* stretch it; it took its attribute size and rendered at 2× with only its top-left quarter visible. Needs explicit `h-full w-full`.
   - **A raw NUL byte in `ParticleField.tsx`** made git treat the file as binary (unreviewable diffs) and `grep` silently return nothing.

0000. **Mobile bug sweep detail (2026-07-24)** — superseded by the consolidated entry above; kept for the specifics of the Firestore/SSR migration: `libraryShared.ts` was split out so server code doesn't import the client SDK, which also keeps `firebase/auth` and `firebase/firestore` out of the library page's client bundle. Both public routes prerender with `revalidate = 300`.

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
