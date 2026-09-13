# Public-site relaunch implementation

Implemented locally on September 13, 2026. No deployment, client outreach, or live inquiry email was performed.

## Implemented

- New homepage and responsive navigation, with a persistent mobile wordmark and project inquiry action.
- Editorial hero using existing responsive imagery, with the original five-pillar animation beside the copy on screens at least 900px wide. A pause/play control is provided; smaller screens and reduced-motion preferences receive the existing poster without mounting video sources. The background remains still, and public routes no longer load the carousel or particle animation. Four Barlow weights replace six.
- Selected-work grid and partner section, including Panasonic's official wordmark. COP30 and IUCN are identified separately as showcases.
- Three project pages: Panasonic/LUMIX and the Amazon women artisans' collective; Conservation Diaries; and the BCRN film shown at COP30 and IUCN 2025.
- Three service pages, a services overview, a studio page, contact, and public-site privacy information.
- Nine editorial film pages with players present in rendered HTML. Published dates are from the public YouTube pages; VideoObject and video sitemap entries use those dates. Later catalog additions also get watch pages, but require verified upload dates before receiving video rich-result metadata.
- Distinct titles, descriptions, canonicals, and 1200 × 630 social images. The sitemap includes the new public pages. Public canonical identity is independent of local app/auth URLs.
- Refined small-size vector mark, a dark-stroke variant, and new favicon/Apple icon exports. Original logo assets are retained. The full-detail identity has not been replaced in external materials.
- Project inquiry endpoint with validation, a honeypot, same-origin checking, fixed recipient, and bounded per-instance rate limiting. Email is sent through Resend only when the visitor submits a valid brief. No automatic customer confirmation message is sent.
- Without a delivery key, the form clearly offers an email draft instead of claiming to send. Text is retained on delivery errors, with a copy option and direct email alternative.
- Optional consent-based analytics hooks for public page views, inquiry actions, successful delivery, and Web Vitals. Private routes disable a previously loaded GA tag. No form values are sent as event properties.

## Source of truth

`app/lib/publicContent.ts` holds curated project, service, and film content. Known editorial copy is deliberately independent of legacy catalog descriptions; current catalog thumbnail overrides and additional films are read through `app/lib/publicFilms.ts`. The original library/admin data model is unchanged. Update the editorial records when retiring or revising curated films. `CONTENT_UPDATED` is an editorial revision date, not the time of every page request.

Private navigation and footer were preserved as separate components. Portal, payment, and CDN functionality were not changed. The shared font set and favicon do apply across the application.

## Evidence and claims

- Panasonic: Noah confirmed that Panasonic Global supplied its latest camera model for filming a women artisans' collective in the Amazon rainforest, with the resulting content intended for product/channel promotion. The project is labeled **In production**. No camera model, collective name, sales lift, or audience metrics have been invented.
- The Panasonic logo was exported from the official [Panasonic brand history page](https://holdings.panasonic/global/corporate/brand/history.html). Source asset: `https://holdings.panasonic/content/dam/holdings/global/en/corporate/brand/history/panasoniclogo_img_pc.png`. The local WebP changes format/size, not artwork or color.
- BCRN: the current [Emirates Nature–WWF programme page](https://www.emiratesnaturewwf.ae/en/page/building-community-resilience-to-natural-hazards-programme) uses **Building Community Resilience to Natural Hazards** and embeds film `KA5wK3R5ClM`.
- The supplied [IUCN launch announcement](https://www.linkedin.com/posts/bcrnd-programme-ugcPost-7383458820187996160-FfsO/) states a **US$10 million** UAE Aid Agency anchor commitment. The site uses that documented amount as programme context. Noah's report of a broader US$20 million funding connection is retained here as a follow-up item; the public copy does not claim that the film secured that amount.
- Noah confirmed that the same BCRN film appeared at the COP30 Panda event and the UAE government pavilion at IUCN 2025. The case study links to the supplied [COP30 event recording](https://www.youtube.com/watch?v=OXzyJNhF0GU).
- Conservation Diaries and existing film descriptions derive from the published portfolio. The oil-spill description no longer introduces the unresolved Galápagos/Peru geographical connection; its existing film title is retained.
- Studio positioning and the meaning of Ayni derive from the local business brand/overview documents and the published studio film. AI-assisted workflows are described as in development. No unsupported pricing or savings claim is published.

## Configuration before launch

1. **Booking:** all public project CTAs now open the studio’s [15-minute Google Calendar scheduler](https://calendar.app.google/wqfU6XWyx2Z2vkwR8). The contact page offers the same booking link and direct contact alternatives. Resend setup is deferred at Noah’s request; the previously built inquiry form/API remain unused by the public UI.
2. **Public domain:** `NEXT_PUBLIC_SITE_URL` defaults to `https://ayni-studios.com`. Keep it set to the canonical public domain. `NEXT_PUBLIC_BASE_URL` remains available for existing app flows and does not determine marketing canonicals.
3. **Search Console:** optionally set `GOOGLE_SITE_VERIFICATION` to the HTML verification token. After deployment, verify ownership in the existing account, submit `/sitemap.xml`, and inspect an example service, project, and film URL. DNS/account verification and submissions require the relevant account access and were not performed.
4. **Measurement:** optionally set `NEXT_PUBLIC_GA_MEASUREMENT_ID` at build time. Use a property with automatic/enhanced measurement disabled because events are sent explicitly. No measurement property was created or connected. Validate consent and collection in that property's DebugView before relying on conversion reports.
5. **Funding context:** expand the BCRN funding statement only after identifying a source for the broader amount and the precise relationship to the film.
6. **Content development:** add approved testimonials, detailed team bios/photos, Panasonic production stills and the final film when available. These were not fabricated. Further film transcripts should be reviewed for accuracy before publication.
7. **Performance:** establish field LCP/INP/CLS after deployment. Removing decorative downloads is an implementation change, not a claimed measured score. PageSpeed's API was quota-limited during the initial audit.

The inquiry limiter is per server instance, not distributed. If public form abuse becomes material, use a shared limiter or supported bot-protection service. The current implementation deliberately avoids adding a database collection or changing CDN controls.

## Validation

- `npm run lint`
- `node --test tests/public-site.test.mjs`: seven tests covering content references, input validation, origin/body rejection, fixed email recipient, provider failure/configuration, and rate limiting. Resend is replaced by a mock; no external messages are sent.
- `npm run build`: production compilation, TypeScript, and generation of public/static routes.
- Browser review at desktop and mobile widths, including homepage, project, inquiry, and film metadata/player markup.
- Public route, canonical, sitemap, image, and social-preview checks against the local production server.

Results: all 21 public sitemap pages returned successfully with one H1, one production canonical, and a social image. All 42 referenced local image/social assets returned successfully. All nine film pages contain a rendered player and VideoObject, and all nine appear in the video sitemap. See `relaunch-validation.json`. The initial relaunch validation recorded four font preloads and zero canvas elements. A subsequent hero revision restores one video on desktop, with a poster-only fallback on small screens and for reduced motion. Mobile checks at 320px and 390px found no horizontal overflow in the reviewed page templates; desktop was reviewed at 1280px.

## Measurement plan

Track qualified inquiries and won projects alongside public-page impressions and clicks. An email draft or WhatsApp click is an intent signal, not a completed lead. `generate_lead` fires only after the email provider accepts an inquiry; it is not proof of inbox delivery or a qualified sale. Review service/project search terms and lead quality over the first 30–90 days rather than interpreting a handful of visits as a reliable conversion test.

AI workflow and pricing work remains an operational follow-up: trial transcription, logging, selects, subtitle drafts, and versioning on representative jobs; record editorial hours, revisions, tool costs, and quality before setting packages or making turnaround/savings claims.

## Hero animation revision

Restored the original transparent five-pillar animation in a separate desktop column beside the service copy and inquiry links. The background photograph remains static. A keyboard-accessible pause/play button controls motion. Below 900px or when reduced motion is preferred, only the existing poster is rendered; preference and viewport changes are observed live. The original HEVC-first source ordering is retained for Safari transparency.

Validation: lint and production build passed. Browser checks at 1280px confirmed WebM playback and pause/play behavior. At 390px the poster loaded with zero video/source elements, and 390px/320px checks found no horizontal overflow. Safari and system reduced-motion emulation were not independently tested in this pass. The local production preview was refreshed on port 3003; nothing was deployed.

## Launch booking flow

Noah authorized deployment and selected Google Calendar for initial conversations. All public project CTAs link directly to the shared scheduler using `BOOKING_URL` in `app/lib/publicContent.ts`. The contact and privacy pages describe this flow. Optional `booking_click` events record link clicks only, not completed appointments. No Resend credentials or analytics services were configured. Team/testimonial additions are deferred until after the videos are uploaded; Search Console and analytics setup are deferred until after deployment.
