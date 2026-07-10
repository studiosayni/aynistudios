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

- **Launch checklist (owner actions, redesign Phase 1 → live):**
  1. Upgrade project `aynistudios-fe09b` to Blaze (App Hosting + Storage need it): https://console.firebase.google.com/project/aynistudios-fe09b/usage/details
  2. `python3 scripts/seed-allowlist.py` — creates the two admin `_allowlist` docs
  3. `firebase deploy --only firestore:rules` — replaces the permissive scaffold rules from April
  4. `git init` + push to GitHub + connect App Hosting backend `aynistudios-web` → staging deploy on default URL
  5. Review pillar-word translations in `app/lib/pillarWords.ts` (flagged for native review)
  6. DNS cutover + add `ayni-studios.com` to Auth authorized domains
- **Mobile device pass:** verify Main/Library/portal cards on a real phone once staging is up (Chrome window couldn't shrink below ~500px during local verification; layouts are standard mobile-first Tailwind).

---

## Roadmap / Backlog

Items identified but not yet prioritized:

- **Phase 2 — review portal (frame.io replacement):** `_assets` + versions + time-coded comments data model, Firebase Storage uploads (`workspaces/{ws}/assets/...`, rules already written in `storage.rules`), review room UI (player + comment rail + approve/request-changes), `firebase-admin` migration of API routes (closes the admin-auth-hardening item), Resend notifications. Requires Blaze + Resend domain verification.
- **Stripe deployment:** Card checkout framework is scaffolded but not deployed — activate when billing is ready.

---

## Recently Completed

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
