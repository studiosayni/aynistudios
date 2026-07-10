# PROJECT: Ayni Studios Web
**Studio:** Ayni Studios (Noah G Beilin)
**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Firebase (Auth + Firestore).
**External:** Resend (transactional email), Stripe (card checkout — framework only, not deployed), `@react-pdf/renderer` (invoice/receipt PDFs), YouTube (video CDN via library records).
**Hosting:** Firebase App Hosting (project ID `aynistudios-fe09b` — display name "aynistudios"; backend `aynistudios-web`). ⚠️ Deploy requires the Blaze plan (project is on Spark as of July 2026).

## CURRENT STATE (As of July 9, 2026)
Marketing v2 redesign built (Phase 1 of the Main/Library/Portal plan): particle-word hero replaces the old video concept, homepage carousel + iCloud-style sign-in/contact cards, featured Library hero with lite-YouTube facade, admin library manager, locked-down Firestore rules in-repo. Firebase client config is real (`aynistudios-fe09b`), `_library` is seeded with the 7 live productions. Awaiting: Blaze upgrade → staging deploy → DNS cutover; then Phase 2 (frame.io-style review portal — see `_docs/tasks.md`).

## SITE-WIDE BACKDROP (ParticleField)
`app/components/ParticleField.tsx` renders a fixed z-0 canvas behind all pages: the five brand pillars drifting/cross-fading in ~14 languages (word data in `app/lib/pillarWords.ts` — single editable const, translations pending native review). Full intensity over the Main hero → dims to 35% ambient on scroll/other routes; unmounted on `/admin` + `/workspace`; static frame under `prefers-reduced-motion`; pauses when the tab is hidden; DPR capped at 2. The old hero video (`Main_2-4.mov`) is archived in `brand_assets-aynistudios/videos/` and no longer ships.

## ROUTES
| Route | Source | Notes |
|---|---|---|
| `/` | Hardcoded (`app/page.tsx`) | Full-viewport hero (rotating pillar word over the particle backdrop), library carousel (`LibraryCarousel`), inline portal sign-in card (`PortalSignInCard`) + contact card, partner logos, Malcolm X quote, Organization JSON-LD |
| `/library` | Firestore `_library` (client-side fetch) | Featured hero card (lite-YouTube facade — embed loads on click) + grid; grid cards link out to YouTube |
| `/admin/library` | Client-rendered | CRUD for `_library` incl. featured toggle. Doc ID convention: the YouTube video ID. |
| `/login`, `/signup` | Firebase Auth | Email/Pass + Google; gated by Firestore `_allowlist/{email}` |
| `/complete-profile` | Firebase Auth | First-time Google users set their full name and get workspace routed |
| `/admin` | Client-rendered (AdminGate) | Dashboard + billing UI for the Ayni team. Gated by Firestore allowlist `role === "admin"`. |
| `/admin/clients` | Client-rendered | Client directory — list + inline create form. |
| `/admin/projects` | Client-rendered | Project list + creation wizard with milestones. |
| `/admin/projects/[id]` | Client-rendered | Project detail — milestones, status, generate invoice per milestone. |
| `/admin/invoices/[id]` | Client-rendered | Invoice detail — copy pay-link, email invoice, mark paid off-platform. |
| `/workspace/[workspaceId]` | Client-rendered (WorkspaceGate) | Client portal home — list of their visible projects. |
| `/workspace/[workspaceId]/projects/[projectId]` | Client-rendered | Client-facing project view — status, pending invoices, receipts. |
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
- **`_library/{docId}`** — production catalog, rendered on `/library` + homepage carousel. Managed in `/admin/library`; shared access helpers in `app/lib/library.ts`. Doc ID = the YouTube video ID.
  - `title` (string, required)
  - `client` (string, optional) — e.g. `"ENWWF"`, `"Amazon Expeditions"`
  - `year` (number, optional)
  - `description` (string, optional)
  - `youtubeId` (string, optional) — e.g. `"dQw4w9WgXcQ"`; drives thumbnail + outbound link
  - `thumbnailUrl` (string, optional) — override for non-YouTube sources
  - `category` (string, optional) — e.g. `"Documentary Series"`, `"Brand"`
  - `sortKey` (string, required for ordering) — library is sorted `desc` by this field. Use `"2026-04-19"`-style ISO dates for natural chronological order.
  - `featured` (boolean, optional) — hero slot on `/library` (admin UI keeps it single-holder; falls back to newest)
- **`_workspaces/{workspaceId}`** *(not yet built — reserved for the portal)*

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
- **Known gap (Phase 2):** API routes (Stripe webhook, invoice PDF, mark-paid) still use the client SDK server-side and are blocked by these rules — they migrate to `firebase-admin` with the portal build. Stripe isn't deployed, so nothing user-facing breaks meanwhile.
- One-time bootstrap: `scripts/seed-allowlist.py` creates the two admin `_allowlist` docs (run by the owner; needs gcloud auth).

## SEO PRIMITIVES
- `app/layout.tsx` — site-level OpenGraph + Twitter + title template (`%s — Ayni Studios`), `metadataBase` from env.
- `app/page.tsx` — Organization JSON-LD.
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
