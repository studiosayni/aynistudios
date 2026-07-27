# PROJECT: Ayni Studios Web
**Studio:** Ayni Studios (Noah G Beilin)
**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Firebase (Auth + Firestore).
**External:** Resend (transactional email), Stripe (card checkout — framework only, not deployed), `@react-pdf/renderer` (invoice/receipt PDFs), YouTube (video CDN via library records).
**Hosting:** Firebase App Hosting (project ID `aynistudios-fe09b` — display name "aynistudios"; backend `aynistudios-web`, us-east4, Blaze). Deploys automatically from `main` on GitHub repo `studiosayni/aynistudios`. Default URL: aynistudios-web--aynistudios-fe09b.us-east4.hosted.app.

## CURRENT STATE (As of July 24, 2026 — LIVE)
**ayni-studios.com serves the redesigned site from App Hosting** (cutover completed 2026-07-10). Marketing v2 (particle hero, carousel, portal cards, featured library) + Phase 2 review portal core (assets/versions/time-coded comments, Storage uploads, notify endpoint) are deployed; Firestore/Storage rules are locked down in production.

**2026-07-24 — first real-device pass, three bugs fixed** (see `_docs/tasks.md`): the hero word-cloud was rendering opaque on Safari/iOS (`<source>` order), and `/library` + the homepage carousel were entirely dead on mobile because the Firestore *client* SDK hangs rather than erroring behind a network filter. Both public surfaces now read the catalog server-side; the portal and auth keep the client SDK by design. Verified on iOS Safari + iOS Chrome.

Open items: `www` custom domain, Resend verification (portal emails currently no-op), billing-route migration to `firebase-admin`, client-role end-to-end test, plus a batch of deferred UX-review follow-ups — see `_docs/tasks.md`.

## SITE-WIDE BACKDROP (ParticleField) + HERO MEDIA
`app/components/ParticleField.tsx` renders a fixed z-0 canvas behind all pages: the five brand pillars drifting/cross-fading in ~14 languages (word data in `app/lib/pillarWords.ts` — single editable const, translations pending native review). Full intensity over the Main hero → dims to 35% ambient on scroll/other routes; unmounted on `/admin` + `/workspace`; static frame under `prefers-reduced-motion`; pauses when the tab is hidden; DPR capped at 2.

The hero (`app/components/HeroSection.tsx`) layers: crossfading full-bleed editorial stills (`public/brand/hero/hero-*.jpg`, 7.5s holds, Ken Burns) under a center scrim, and the original brand word-cloud animation as a transparent video below the tagline — dual-encoded from `brand_assets-aynistudios/videos/Main_2-4.mov` as VP9-alpha WebM (Chrome/Firefox; note: libvpx alpha requires `-auto-alt-ref 0`) + HEVC-alpha MP4 with the `hvc1` tag (Safari), with a 44KB transparent poster as a no-playback fallback. The 4.3MB source `.mov` is gitignored.

⚠️ **`<source>` order is load-bearing — the HEVC MP4 must be listed first.** WebKit plays VP9/WebM but silently *ignores its alpha channel*, so with the WebM first Safari and every iOS browser (all WebKit, including iOS Chrome/Firefox) claimed it and rendered the word-cloud as an opaque black block, never reaching the HEVC file encoded for them. Engines that can't decode `hvc1` skip that source and fall through to the WebM, so Chrome/Firefox are unaffected — verified: Chrome returns an empty `canPlayType('video/mp4; codecs="hvc1"')`. If Chrome ever starts reporting `hvc1` support it would take the MP4 and lose alpha (Chrome has no HEVC-alpha support); `HeroSection.tsx` carries a dev-only console check that logs the resolved source per engine and warns on a mismatch. Fixed 2026-07-24.

⚠️ Verifying alpha with `ffprobe` is a trap: **`pix_fmt` reports `yuv420p` for both files even though both carry alpha**, because VP9 stores it in WebM BlockAdditional side data and HEVC in an auxiliary picture layer — neither surfaces at stream level. Check `TAG:ALPHA_MODE=1` for the WebM, and `ffmpeg -bsf:v trace_headers` for `Alpha Channel Information` / `nuh_layer_id: 1` for the MP4. ⚠️ The Claude-in-Chrome automated browser cannot navigate directly to a video file (a direct `.webm` URL hangs at `readyState 0`); in-page playback does work — verify video changes by eye.

## IMAGE HANDLING
⚠️ **Firebase App Hosting does not serve the Next image optimizer.** `/_next/image` returns **404 in production** (verified 2026-07-27; response header `x-fah-adapter: nextjs-14.0.21`). The build itself is configured correctly — `required-server-files.json` shows `unoptimized: false`, loader `default` — and the optimizer works on a local `next build && next start`, so the override happens in App Hosting's build. The failure is **silent**: `next/image` degrades to emitting the raw `src` with **no `srcset` at all**, so every device downloads the full-size original. Do not assume `next/image` is buying responsive delivery here; check the deployed HTML for `/_next/image`.

Consequences, and what we do instead:
- **Hero stills** use a plain `<img>` with a hand-built `srcset` over pre-generated WebP variants (`scripts/build-hero-variants.py`, widths 640/960/1280/1920, q65 — they sit at 45% opacity behind a scrim so they tolerate compression). Regenerate and commit after swapping any `public/brand/hero/hero-*.jpg`. Measured: a phone pulls 81–130KB instead of 341KB (62–76% less); desktop 247KB (28% less).
- **Library thumbnails** still pass through `next/image` without `unoptimized`. That is harmless but currently inert in production — it neither resizes nor shields them from the ad blockers and DNS filters that eat `i.ytimg.com`. The fallback chain in `LibraryThumbnail` is what actually protects that surface.
- If image optimization is ever enabled on the backend, the thumbnails start benefiting automatically and the hero could move back to `next/image`.

**Cache headers.** `public/` assets shipped with `Cache-Control: public, max-age=0` — re-downloaded on every visit, including the ~1.4MB word-cloud video. `next.config.ts` now sets `max-age=86400, stale-while-revalidate=604800` for `/brand/:path*`. Deliberately not `immutable`: filenames are stable, so a year-long immutable cache would strand returning visitors on replaced artwork. Hashed `/_next/static` assets already get a year + immutable, which is how we know App Hosting honours these headers.

⚠️ `public/images/` is ~40MB of v1-era photography (41 tracked files) that **nothing in `app/` references** and that is still deployed. Not a runtime cost — nobody requests it — but it bloats the repo and every build. Candidate for removal once someone confirms it isn't a working asset library.

## ROUTES
| Route | Source | Notes |
|---|---|---|
| `/` | Server component; `_library` read server-side (`revalidate = 300`) | Full-viewport hero (rotating pillar word over the particle backdrop), library carousel (`LibraryCarousel` — receives items as a prop), inline portal sign-in card (`PortalSignInCard`) + contact card, partner logos, Malcolm X quote, Organization JSON-LD |
| `/library` | Server component; `_library` read server-side (`revalidate = 300`) | Featured hero card (lite-YouTube facade — embed loads on click) + grid; grid cards link out to YouTube. Exports its own `metadata` (was a client component and could not, so it inherited the homepage title). |
| `/admin/library` | Client-rendered | CRUD for `_library` incl. featured toggle. Doc ID convention: the YouTube video ID. |
| `/login`, `/signup` | Firebase Auth | Email/Pass + Google; gated by Firestore `_allowlist/{email}` |
| `/complete-profile` | Firebase Auth | First-time Google users set their full name and get workspace routed |
| `/admin` | Client-rendered (AdminGate) | Dashboard + billing UI for the Ayni team. Gated by Firestore allowlist `role === "admin"`. |
| `/admin/clients` | Client-rendered | Client directory — list + inline create form. |
| `/admin/projects` | Client-rendered | Project list + creation wizard with milestones. |
| `/admin/projects/[id]` | Client-rendered | Project detail — milestones, status, generate invoice per milestone. |
| `/admin/invoices/[id]` | Client-rendered | Invoice detail — copy pay-link, email invoice, mark paid off-platform. |
| `/workspace/[workspaceId]` | Client-rendered (WorkspaceGate) | Portal home — Review section (assets in review, upload) + visible projects/billing. |
| `/workspace/[workspaceId]/review/[assetId]` | Client-rendered | Review room — player, version switcher, time-coded comments (click → seek), approve/request-changes; admin can set any status + upload new versions. |
| `/workspace/[workspaceId]/projects/[projectId]` | Client-rendered | Client-facing project view — status, pending invoices, receipts. |
| `/api/portal/notify` | Route handler | Verifies Firebase ID token (`firebase-admin`), emails the review counterpart via Resend (no-ops with a warning until `RESEND_API_KEY` is configured). |
| `/pay/[invoiceId]` | Server-rendered | Public pay page — Stripe Checkout + Zelle + bank transfer options. Token is the Firestore auto-ID. |
| `/api/create-checkout-session` | Route handler | Starts a Stripe Checkout session for a given invoice. |
| `/api/stripe-webhook` | Route handler | Verifies Stripe signature, flips invoice to Paid, fires emails. |
| `/api/invoice/[invoiceNumber]?email=…` | Route handler | Downloads invoice/receipt PDF; email must match the client's contactEmail. |
| `/api/admin/mark-invoice-paid` | Route handler | Admin-only (x-admin-key). Used for Zelle/bank transfer confirmations. |
| `/api/admin/send-invoice-email` | Route handler | Admin-only. Emails the invoice + PDF; flips Draft → Sent. |

## DATABASE ARCHITECTURE (Firestore)
- **`_allowlist/{lowercaseEmail}`** — admin-managed invite list.
  - `email` (string, original casing)
  - `workspaceId` (string) — e.g. `ayni-admin` for internal team, `client-wwf` for a client
  - `role` — `"admin"` | `"client"`
  - `addedAt` — ISO timestamp
- **`_users/{uid}`** — user profile, written at signup / complete-profile.
  - `fullName`, `email`, `role`, `workspaceId`, `createdAt`
- **`_library/{docId}`** — production catalog, rendered on `/library` + homepage carousel. Managed in `/admin/library`. Doc ID = the YouTube video ID.
  - **Access is split across three modules, deliberately.** `app/lib/libraryShared.ts` holds the types and pure helpers and imports *no* Firebase, so server components can use it without dragging the client SDK (and its `getAuth()`/`getFirestore()` module-scope calls) into their bundle. `app/lib/libraryServer.ts` is `server-only` and reads via the Admin SDK — this is what `/` and `/library` use. `app/lib/library.ts` keeps the client-SDK `fetchLibrary()` for `/admin/library` and re-exports the shared helpers for back-compat.
  - **Why the public surfaces read server-side (2026-07-24):** both pages used to fetch with the client SDK in a `useEffect`. On a network that filters `googleapis.com` the SDK does **not** reject — it is offline-first and simply waits — so the promise stayed pending and `/library` sat on "Loading library" forever while the carousel held its skeletons. Reproduced on a phone where the rest of the site rendered fine. Reading server-side means the visitor's device never contacts Firestore for catalog content. The portal/auth surfaces still use the client SDK by design.
  - `title` (string, required)
  - `client` (string, optional) — e.g. `"ENWWF"`, `"Amazon Expeditions"`
  - `year` (number, optional)
  - `description` (string, optional)
  - `youtubeId` (string, optional) — e.g. `"dQw4w9WgXcQ"`; drives thumbnail + outbound link
  - `thumbnailUrl` (string, optional) — override for non-YouTube sources
  - `category` (string, optional) — e.g. `"Documentary Series"`, `"Brand"`
  - `sortKey` (string, required for ordering) — library is sorted `desc` by this field. Use `"2026-04-19"`-style ISO dates for natural chronological order.
  - `featured` (boolean, optional) — hero slot on `/library` (admin UI keeps it single-holder; falls back to newest)
  - **Artwork** is resolved by `thumbnailChain()` + `app/components/LibraryThumbnail.tsx`, shared by the grid, the carousel and the featured card. The chain is: `thumbnailUrl` override → `maxresdefault`/`hqdefault` on `i.ytimg.com` → the same pair on `img.youtube.com` (a distinct hostname that often survives a blocklist catching the first) → a branded placeholder (hamsa mark on a gradient) so a dead thumbnail is never a black void. ⚠️ **`onError` alone is not enough:** YouTube answers a missing frame with a 404 carrying a *decodable* 120×90 grey body, so the browser fires `load`, not `error` — the chain also advances when `naturalWidth <= 120`. Without that it stalls on a grey blob exactly where `maxresdefault` goes missing (older/short uploads). `/admin/library` still uses the older direct `youtubeThumb()` path.
### Review portal (Phase 2)
- **`_assets/{docId}`** — a deliverable under review in a workspace. Helpers in `app/lib/reviewAssets.ts`.
  - `workspaceId` (query key — all portal queries filter on it so rules verify from the query shape)
  - `title`, `status` (`"in_review"` | `"approved"` | `"changes_requested"`), `currentVersion` (0 until v1 lands)
  - `createdBy`/`createdByName`, `createdAt`, `lastActivityAt` (bumped on upload/comment/status; list sorts by it client-side — no composite index needed)
- **`_assets/{id}/versions/{docId}`** — one per uploaded cut: `n`, `storagePath`, `downloadUrl` (tokened, stored at upload), `size`, `contentType`, `uploadedBy(Name)`, `note?`, `createdAt`. A new version flips the asset back to `in_review`.
- **`_assets/{id}/comments/{docId}`** — `versionN`, `tSeconds` (null = general), `body`, `authorUid/Name/Role`, `resolved`, `createdAt`.
- **Storage layout:** `workspaces/{workspaceId}/assets/{assetId}/v{n}/{filename}` in bucket `aynistudios-fe09b.firebasestorage.app` (US-EAST4, colocated with the backend). Browser-playable video/images/PDF, ≤2 GB, uploaded with `uploadBytesResumable` (progress + cancel in `UploadAssetModal`; an aborted first upload deletes the orphan asset doc).

### Billing collections
- **`_clients/{docId}`** — persistent client directory (bill-to + workspace mapping).
  - `name`, `shortName?`, `contactName`, `contactEmail`, `contactPhone?`, `billingAddress`, `taxId?`, `preferredCurrency` (USD/AED), `workspaceId`, `notes?`, `createdAt`, `updatedAt`
- **`_projects/{docId}`** — project = engagement between Ayni and a client.
  - `projectNumber` — `AS-PRJ-YYYY-NNNN` (via `nextProjectNumber()`)
  - `clientId`, `workspaceId` (denormalized from the client so security rules can verify client queries without joins), `title`, `scope` (output-focused quote wording)
  - `status` — one of 6 client-visible statuses (`Payment pending` | `Planning` | `Filming` | `Editing` | `Revisions` | `Complete`)
  - `currency` (USD/AED), `scopeAmount` (total contract value, sum of milestones)
  - `milestones: Milestone[]` — `{ id, label, amount, status: "pending" | "invoiced" | "paid", invoiceId? }`
  - `visibleToClient: boolean` — if false, hidden from the client's workspace view
- **`_invoices/{docId}`** — **the Firestore auto-ID doubles as the secret pay-link token** at `/pay/{id}`.
  - `invoiceNumber` — `AS-INV-YYYY-NNNN` (via `nextInvoiceNumber()`)
  - `projectId`, `clientId`, `workspaceId` (denormalized — see `_projects`), `milestoneId?`, `milestoneLabel?` (snapshot)
  - `amount`, `currency`, `lineItems: LineItem[]`
  - `status` — `"Draft"` | `"Sent"` | `"Paid"` | `"Void"`
  - `paymentMethod?` — `"Stripe"` | `"Zelle"` | `"Bank Transfer"`
  - `stripeCheckoutSessionId?`, `stripePaymentIntentId?`
  - `issuedAt?` (when moved from Draft → Sent), `dueDate?`, `paidAt?`, `paidNote?`
- **`_serialCounters/{name}`** — year-keyed atomic counters. Doc names follow `AS-PRJ-YYYY` and `AS-INV-YYYY`; `nextSerial()` runs inside a Firestore transaction so counters never double-allocate across racing writes.
- **`_projectNumberIndex/{projectNumber}`** — trivial `{projectId}` pointer so we can look up projects by their human-readable number without a query.

### Milestone state machine
`pending` → (admin generates invoice) → `invoiced` → (Stripe webhook or admin mark-paid) → `paid`. The project's `milestones[]` array is updated atomically inside `markInvoicePaid` / `createInvoiceFromMilestone` so status stays in lockstep with the corresponding invoice.

## ENVIRONMENT VARIABLES
| Variable | Where | Purpose |
|---|---|---|
| `RESEND_API_KEY` | Cloud Secret Manager | Resend — wired when a contact form ships. |
| `RESEND_FROM` | `apphosting.yaml` | `"Ayni Studios <humanity@ayni-studios.com>"` |
| `ADMIN_EMAIL` | `apphosting.yaml` | `humanity@ayni-studios.com` |
| `NEXT_PUBLIC_BASE_URL` | `apphosting.yaml` | Used by `sitemap.ts`, `robots.ts`, and `metadataBase`. |
| `STRIPE_SECRET_KEY` | Cloud Secret Manager | Server-only. `sk_test_…` in dev. |
| `STRIPE_WEBHOOK_SECRET` | Cloud Secret Manager | Signing secret for the Stripe webhook endpoint. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `apphosting.yaml` | Public — exposed to the client for Stripe.js if/when a Checkout Elements flow is added. |
| `NEXT_PUBLIC_ZELLE_CONTACT` | `apphosting.yaml` | Display-only Zelle address rendered on the pay page + PDF. |
| `ADMIN_API_KEY` | Cloud Secret Manager | Gates `/api/admin/*` routes. The admin UI prompts once, stores in `localStorage`. Rotate by updating this value. |

Firebase **client** config is hardcoded in `app/lib/firebase.ts` (keys are public — see Firebase docs on API key safety). Real values are in place for project `aynistudios-fe09b` (note: the project's *display name* is "aynistudios" but every CLI/API call needs the `-fe09b` ID).

## SECURITY RULES
`firestore.rules` + `storage.rules` live in the repo (registered in `firebase.json`). Deploy with `firebase deploy --only firestore:rules` (storage rules deploy with Phase 2 — the default bucket needs Blaze).
- The two studio-owner emails are hardcoded bootstrap admins; everyone else's role comes from their `_allowlist` doc.
- Client-side queries always filter on `workspaceId` (denormalized onto `_projects`/`_invoices`) so list rules are provable from the query shape.
- `_library` is public-read; `_invoices` single-doc `get` is open (the doc ID is the pay-link token) but `list` is not.
- Signup flow creates the Auth account **first**, then reads the user's own allowlist doc (rules only allow reading your own entry), deleting the account if not invited.
- **Known gap (billing routes):** the Stripe webhook / invoice PDF / mark-paid routes still use the client SDK server-side and are blocked by these rules — migrate them to `firebase-admin` (now installed; see `app/lib/firebaseAdmin.ts`) before Stripe goes live. `/api/portal/notify` already uses the admin SDK and is the reference pattern.
- One-time bootstrap: `scripts/seed-allowlist.py` creates the two admin `_allowlist` docs (run by the owner; needs gcloud auth).
- Rules were deployed to production on 2026-07-10 (both Firestore and Storage).

## SEO PRIMITIVES
- `app/layout.tsx` — site-level OpenGraph + Twitter + title template (`%s — Ayni Studios`), `metadataBase` from env.
- `app/page.tsx` — Organization JSON-LD.
- `app/library/page.tsx` — page-level `metadata` (title + description + OG). Only possible since it became a server component; as a client component it silently inherited the homepage title on every share, bookmark and search result.
- ⚠️ Any route that needs its own `metadata` **cannot** be a client component. Fetch server-side and keep the interactive parts as child client components.
- `app/sitemap.ts` — static routes (`/`, `/library`).
- `app/robots.ts` — disallows `/admin`, `/login`, `/signup`, `/complete-profile`, `/workspace`.

## BILLING FLOW
1. Admin creates a **client** in `/admin/clients` (or re-uses existing).
2. Admin creates a **project** in `/admin/projects` with milestones (e.g. 50/50, 25/25/25/25). Scope amount = sum of milestones.
3. For each milestone that's due: admin clicks **Invoice** on `/admin/projects/[id]` — `createInvoiceFromMilestone` generates `AS-INV-YYYY-NNNN`, creates a Draft invoice, flips the milestone to `invoiced`.
4. Admin opens the invoice in `/admin/invoices/[id]`, clicks **Email invoice to client** — Resend sends `InvoiceIssuedEmail` with the PDF attached and the pay-link; invoice flips `Draft → Sent`.
5. Client opens `/pay/{invoiceId}` (the auto-ID is the unguessable token). They can pay by card (Stripe Checkout), Zelle, or bank transfer.
6. **Stripe path:** webhook receives `checkout.session.completed`, `markInvoicePaid` runs transactionally (invoice → Paid, milestone → paid), client gets `PaymentConfirmedEmail` with receipt PDF, admin gets `AdminPaymentAlertEmail`.
7. **Off-platform path:** admin confirms payment externally, then uses **Mark paid** on the invoice detail page. Same transactional update + same emails.

## NEXT STEPS / ROADMAP
1. ~~Brand assets~~ ✅ Done (July 2026) — all 12 partner logos in `public/brand/partners/`, navbar icon wired.
2. ~~Firebase config + library seed~~ ✅ Done (July 2026) — real config, `_library` seeded with the 7 live productions. **Remaining:** owner runs `scripts/seed-allowlist.py` + `firebase deploy --only firestore:rules`.
3. **Blaze upgrade + staging deploy.** Upgrade `aynistudios-fe09b` to Blaze (App Hosting requires it), create the App Hosting backend `aynistudios-web`, test on the default URL before DNS cutover. Note: App Hosting deploys from a connected GitHub repo — this folder is not yet a git repository.
4. **DNS cutover.** Attach ayni-studios.com to App Hosting; flip DNS at the registrar; add `ayni-studios.com` to Firebase Auth authorized domains.
5. **Phase 2 — review portal.** frame.io-style review loop (assets/versions/time-coded comments, Firebase Storage + `firebase-admin` migration of the API routes, Resend notifications). Full spec in the approved redesign plan; tracked in `_docs/tasks.md`.
6. **Stripe go-live.** Create the new Stripe account under `studiosayni@gmail.com`, swap test keys for live keys in Cloud Secret Manager, configure the webhook endpoint in Stripe pointing at `/api/stripe-webhook`, verify `ayni-studios.com` in Resend. Billing code is scaffold-ready but intentionally undeployed until then.
7. **Contact form (future).** Replace mailto on `/cjn` and homepage with Resend-backed form once `ayni-studios.com` domain is verified in Resend.
