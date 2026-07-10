# Ayni Studios Web — Dev Tasks

_Last updated: 2026-07-09_

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
- **Mobile device pass:** verify Main/Library/portal cards on a real phone once staging is up (Chrome window couldn't shrink below ~500px during local verification; layouts are standard mobile-first Tailwind).

---

## Roadmap / Backlog

Items identified but not yet prioritized:

- **Phase 2 remainder:** migrate the billing API routes (Stripe webhook, invoice PDF, mark-paid, send-invoice-email) from `x-admin-key` to `firebase-admin` ID-token verification (`app/lib/firebaseAdmin.ts` + `/api/portal/notify` are the pattern); verify ayni-studios.com in Resend + set `RESEND_API_KEY` secret so portal notifications actually send (they currently no-op with a log).
- **Stripe deployment:** Card checkout framework is scaffolded but not deployed — activate when billing is ready.

---

## Recently Completed

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
