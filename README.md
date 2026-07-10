# Ayni Studios — Web

Next.js 16 marketing site and (future) client portal for [Ayni Studios](https://ayni-studios.com).

**Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Firebase (Auth + Firestore), MDX (stories), Resend (email), Stripe + `@react-pdf/renderer` (billing — framework only, not deployed), hosted on Firebase App Hosting.

## Getting started

```bash
cp .env.local.example .env.local   # fill in CJN_PASSWORD etc.
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## First-time setup (one-time, after cloning)

1. **Create Firebase project.** In the [Firebase Console](https://console.firebase.google.com) (signed in as `studiosayni@gmail.com`), create a project named `aynistudios`. Enable **Authentication** (Email/Password + Google providers) and **Firestore**.
2. **Paste the web config** into `app/lib/firebase.ts` (replace the `REPLACE_ME` placeholders).
3. **Allowlist yourself.** In Firestore, create `_allowlist/humanity@ayni-studios.com` with:
   ```
   { email: "humanity@ayni-studios.com", workspaceId: "ayni-admin", role: "admin", addedAt: "<iso>" }
   ```
4. **Seed the Library.** Create documents in the `_library` collection (see `_docs/AYNI_ARCHITECTURE.md` for the schema).
5. **Set the CJN password** in `.env.local` (`CJN_PASSWORD=...`). On App Hosting, set it as a secret:
   ```
   firebase apphosting:secrets:set CJN_PASSWORD
   ```

## Repo layout

```
app/
├── components/        # Navbar, Footer, WordRotator, PartnerLogos
├── lib/               # firebase, stories, allowlist, cjn, types, serial, currency,
│                      # stripe, email, emailSenders, payments, generateInvoicePDF, adminAuth
├── api/cjn/auth/      # POST endpoint that sets the CJN unlock cookie
├── api/create-checkout-session/   # Starts Stripe Checkout from an invoice
├── api/stripe-webhook/            # Stripe → markInvoicePaid + confirmation emails
├── api/invoice/[invoiceNumber]/   # Invoice/receipt PDF download (email-gated)
├── api/admin/mark-invoice-paid/   # Admin-only (x-admin-key) — Zelle/bank confirmations
├── api/admin/send-invoice-email/  # Admin-only — emails invoice + flips Draft→Sent
├── library/           # /library — Firestore-backed
├── stories/           # /stories + /stories/[slug] — MDX-backed
├── cjn/               # /cjn (password-gated) + /cjn/enter (password form)
├── login/ signup/     # Firebase Auth UI (allowlist-gated)
├── complete-profile/  # First-time Google users
├── admin/             # Allowlist-gated admin UI — dashboard, clients, projects, invoices
├── workspace/[workspaceId]/       # Client portal — projects + receipts + pay-links
├── pay/[invoiceId]/   # Public pay page (token = Firestore auto-ID)
├── pdf/InvoicePDF.tsx # White + amber + Barlow-adjacent invoice / receipt template
├── emails/            # Resend templates (InvoiceIssued, PaymentConfirmed, AdminPaymentAlert)
├── layout.tsx         # Root layout (Barlow font, Navbar/Footer, Toaster, SEO meta)
├── page.tsx           # Homepage
├── sitemap.ts         # /sitemap.xml (incl. all stories)
└── robots.ts          # /robots.txt

content/stories/       # MDX posts with frontmatter (title, excerpt, date, cover...)
proxy.ts               # CJN password gate (Next 16 proxy — formerly middleware)
```

## Billing (framework only — not deployed yet)

Scaffold for an admin-invoiced flow with Stripe + Zelle + bank transfer, single PDF for both invoices and receipts (with a `PAID` badge when settled), and year-keyed numbering `AS-PRJ-YYYY-NNNN` / `AS-INV-YYYY-NNNN`.

- **Admin UI:** `/admin` — create clients, projects with milestones (50/50, 25/25/25/25, etc.), generate invoices per milestone, email them, mark them paid.
- **Client portal:** `/workspace/[workspaceId]` — clients see their projects, current phase (one of `Payment pending`, `Planning`, `Filming`, `Editing`, `Revisions`, `Complete`), outstanding balances, and receipts.
- **Public pay page:** `/pay/[invoiceId]` — the Firestore auto-ID is the unguessable token. Offers Stripe card checkout + Zelle + bank transfer.
- **Data model & flow:** see `_docs/AYNI_ARCHITECTURE.md` → *DATABASE ARCHITECTURE* and *BILLING FLOW*.

Before going live, add secrets to Cloud Secret Manager:

```
firebase apphosting:secrets:set STRIPE_SECRET_KEY
firebase apphosting:secrets:set STRIPE_WEBHOOK_SECRET
firebase apphosting:secrets:set ADMIN_API_KEY
```

Configure the Stripe webhook endpoint in the Stripe dashboard to `https://<host>/api/stripe-webhook` (event: `checkout.session.completed`), and verify `ayni-studios.com` in Resend so outbound email ships from `humanity@ayni-studios.com`.

## Writing a new story

Drop a file in `content/stories/my-slug.mdx`:

```mdx
---
title: My Story
excerpt: One-line hook.
date: 2026-04-20
author: Noah G Beilin
categories: [Amazon, Conservation]
cover: /brand/stories/my-cover.jpg
---

Your prose here. Full MDX supported.
```

Commit + push. The sitemap + article page regenerate automatically.
