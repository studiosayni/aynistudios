**Ayni Studios — public website relaunch audit**

September 13, 2026

The strongest relaunch opportunity is to make Ayni's production expertise easier to understand, evaluate, and hire. The current design has a coherent cinematic identity, but its hierarchy emphasizes watching content and accessing existing projects. Your client experience deserves a much more prominent role in both the design and the searchable content.

Recommendation: retain the dark palette, amber accent, documentary imagery, and hand/aperture identity. Refine the logo for small screens, simplify the motion, and rebuild the public content around selected work, services, and documented credibility. A full rebrand is a lower priority than these changes.

**What was reviewed**

Live homepage and library at 1280 × 720 and 390 × 844; public navigation, imagery, partner marks, headings, metadata, robots.txt, and sitemap.xml; their corresponding public-facing source components and local logo assets. Public search results and current Google Search Central guidance informed the SEO recommendations. Customer portal functionality, CDN infrastructure, and payment pipelines were excluded.

No application code or live content was changed. This file is the audit deliverable. Recommendations below are design judgments or source-backed findings, not measured conversion lifts. Search Console, analytics, backlink inventory, keyword volumes, and real-user performance were unavailable. A PageSpeed API request returned HTTP 429/quota exceeded; there is no valid Lighthouse score or Core Web Vitals baseline from this audit. Mobile findings are viewport tests, not physical iPhone/Safari testing.

**Priorities**

| Priority | Finding | Recommended change | Relative effort |
| --- | --- | --- | --- |
| First | The first screen does not clearly explain what a new client can commission | Explicit service headline, short audience statement, prominent project inquiry action | Small |
| First | The navigation highlights Portal; the hero offers Library and Client Portal | Lead with Work, Services, About, and Start a project; retain a secondary client login link | Small |
| First | Client work has no individual on-site project URLs | Publish three substantial project pages linked from the homepage and relevant services | Medium; proof gathering is the main dependency |
| First | Client/partner relationships and event appearances share one logo grid | Separate relationship labels and explain each event appearance through a linked project | Small to medium |
| Next | Mobile navigation hides the studio name | Build a compact icon-and-name lockup that remains legible on mobile | Small |
| Next | No canonical link or social preview image was found on either public page | Add per-page canonicals and designed Open Graph/Twitter images | Small |
| Next | Automatic motion competes with portfolio evaluation | Use a static selected-work grid and a quieter hero; complete motion controls | Medium |
| Next | No dedicated service, studio/team, or inquiry page | Create a small, connected set of useful buyer-facing pages | Medium |
| Later | Savings from AI-assisted editing are a future intention | Validate the workflow, then introduce scoped offers and substantiated value claims | Depends on delivery trials |

**Layout and visual direction**

The dark blue-green background and amber buttons work well with the environmental imagery. Keep that recognizable combination. The existing responsive images and consistent portfolio card proportions are useful foundations. Both inspected mobile pages fit the 390px viewport without horizontal page overflow.

The hero currently presents an unfinished phrase, “Media forged for our…”, completed visually by a multilingual animated word cloud. It conveys values, but a buyer must infer the actual service. Retain the phrase as a smaller brand line, and give the main heading a complete, static proposition. A draft direction:

> Documentary films and impact videos for organizations changing the world.
>
> From field production to the final edit, we help conservation organizations, institutions, and purpose-led brands tell stories that move people.
>
> **Start a project** · **Explore our work**

This is proposed positioning, not approved publication copy. Name government clients and specific capabilities only where your project record supports them. Keep the service statement visible without video playback or JavaScript.

The first mobile screen currently spends most of its height on the values animation and two buttons, with no explanatory sentence. The layout fits, but the available space could work harder. A strong still with more visible human detail, a shorter headline, two lines of description, and one primary action would feel more confident. The current combination of darkened footage, a strong scrim, a video graphic, and background particles can obscure the very filmmaking you want to showcase.

Suggested homepage order:

1. Compact navigation with the full studio name and a project inquiry action.
2. Clear proposition over one excellent production still or restrained reel treatment.
3. A short credibility statement and four to six carefully selected organization marks, with accurate relationship labels.
4. Three selected projects: image, full client name, Ayni's role, deliverables, and a link to the project story.
5. Three clear services: documentary production, impact/campaign films, and editing/post-production.
6. Named client testimonial or a documented event showcase with context.
7. A brief studio/team introduction and practical explanation of how projects run.
8. A focused inquiry invitation with direct email available.

The rotating homepage carousel can advance your strongest institutional work out of view while a visitor is still reading. A fixed three-project grid provides a more reliable sales narrative. Preserve the wider library as a browsing destination; label the buyer-facing navigation “Work” or “Selected work.” There is no need to change the existing /library URL solely to change its label.

The oversized “What Is Ayni?” feature currently dominates the library, including much of the first desktop screen. It is a good studio-story asset, but a commissioned project is a stronger default feature for acquisition. Move the brand film into the studio introduction or make it one of several deliberate editorial choices. Distinguish commissioned work and original documentaries through clear labels; with the present eight items, elaborate filtering is unnecessary.

On mobile, the featured title and play control sit on artwork that already contains prominent lettering. Use clean production stills for website cards where possible, and put title/client information below them. This also makes longer titles easier to read than repeated thumbnail text and uppercase overlays.

Use sentence case for project descriptions and more headings. Reserve wide tracking and uppercase for short labels and selected brand moments. The tiny 10px category/partner labels deserve more readable sizing. Add restrained surface variation through photography and a warm neutral proof or services section if desired; repeating glass panels is not necessary to maintain the brand.

Replace the large Malcolm X quotation in the acquisition path with your own evidence: a specific testimonial, production story, or description of the studio's editorial principles. The quotation occupies considerable space and introduces media manipulation at the point where a prospective client needs confidence in your process. It can still belong in an editorial discussion elsewhere if it is central to the studio's philosophy.

The full login panel also occupies prime homepage space before the contact card on mobile. Give project inquiries that space and retain client access in navigation/footer. This is a public-page hierarchy recommendation; it does not require redesigning the portal.

**Logo assessment**

Keep the hand/aperture concept. Its human and filmmaking associations fit Ayni's positioning, and it provides more character than an interchangeable initials mark. The challenge is optical clarity: the intricate intersecting lines compete at navigation and favicon sizes. The wordmark is bold and readable on desktop, but disappears below the large breakpoint, leaving unfamiliar visitors with the symbol alone.

Develop a modest identity system:

- A refined full-detail master for large applications and film end cards.
- A simplified small-size mark with fewer interior intersections and more open negative space.
- A compact horizontal icon + Ayni Studios lockup for mobile navigation.
- Approved light/dark and one-color variants, delivered as clean vector masters and appropriate raster exports.

Judge the small mark at 16, 24, 32, and 40px on actual light and dark surfaces before selecting it. Adjust optical stroke weight rather than merely scaling the large artwork. In the current navigation it appears about 40px; the footer uses 25px. The public asset set contains raster variants rather than an SVG master; obtain the original vector artwork before redrawing. No final logo redesign is implied by this audit.

For third-party marks, the consistent light tiles solve a real problem: source logos have mixed background treatments. Improve hierarchy by showing fewer at once and standardizing their apparent visual size. Obtain approved alternate assets if needed; avoid casually recoloring partners' brands.

Include Panasonic Global among the featured partners, using the appropriate Panasonic logo asset and identifying the work as support for its LUMIX channel. Noah confirmed this current relationship in the audit follow-up. Use LUMIX branding within the corresponding project presentation where appropriate; avoid presenting Panasonic and LUMIX as two separate client wins for the same engagement.

**Turn credibility into searchable project evidence**

The live site groups COP30 and IUCN with partner/client marks, but does not explain which film appeared, where, why, or what Ayni produced. That is valuable evidence reduced to decoration. Use separate descriptions such as “Produced with” and “Work showcased at,” based on the actual relationship. A pavilion screening is different from an event-wide commission or endorsement.

Ayni's public LinkedIn post describes work shown at the UAE pavilion during the IUCN World Congress in Abu Dhabi, supporting an Emirates Nature–WWF, WWF International, and IFRC partnership announcement. It describes gathering, curating, and editing footage from multiple countries. This is a concrete basis for a project story, although it remains a studio-authored account rather than independent confirmation. [Ayni Studios on LinkedIn](https://www.linkedin.com/company/ayni-studios)

For COP30, your statement and the website mark establish the lead to develop, but this audit did not independently verify the specific screening or commissioning relationship. Collect the film title, commissioning organization, pavilion/session, date, exact production role, and an event or partner link. Do the same for government projects, identifying direct versus subcontracted work accurately. Do not turn these into generic “trusted by governments worldwide” copy without supporting records.

The Panasonic Global relationship adds a useful commercial example alongside the conservation and institutional work. Proposed project title: “Panasonic Global — Supporting the LUMIX Channel.” A factual opening based on Noah's update is: “Ayni Studios is working with Panasonic Global to help promote its LUMIX channel.” Expand this with the specific scope, published examples, Ayni's contribution, and results as those details become available. Channel strategy, video production, editing, publishing, and audience growth are not yet established as deliverables by this update and should not be assumed.

Start with three pages: Panasonic Global / LUMIX channel promotion, an Emirates Nature–WWF Conservation Diaries project, and the strongest documented event-showcased film. Develop the IUCN and COP30 stories according to the available evidence. If two appearances concern the same film, one strong page can describe both; avoid manufacturing duplicate case studies. If the Panasonic work is still in progress, label it as an ongoing collaboration and expand it into a results-led case study when appropriate.

Each project page should answer:

- Who commissioned it, what they needed, and who the audience was.
- What Ayni specifically handled: production, interviews, editorial, finishing, or another defined role.
- What was delivered, including versions/languages where relevant.
- Where the work appeared, with precise wording and public evidence.
- What happened as a result, using documented outcomes or client feedback rather than invented metrics.
- How a visitor can commission something comparable.

Use the film prominently, add meaningful written context, selected stills, credits, and an edited transcript when appropriate. Expand client abbreviations such as ENWWF to Emirates Nature–WWF on first mention. Check editorial consistency before publication: the library's Galápagos-titled oil-spill item currently describes an incident off Peru. That may have an explanation, but the relationship needs to be made clear.

Google's guidance emphasizes useful original information and evidence of firsthand experience. Your production decisions, field experience, and client outcomes are the raw material; generic AI-written articles would add much less. [Google: helpful, reliable content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)

**SEO architecture and acquisition**

The live sitemap contains just the homepage and /library. This is the site's listed public content footprint, not proof that Google has indexed exactly two pages. The site already has server-rendered portfolio text, basic page descriptions, organization structured data, and a robots.txt sitemap reference. Preserve those foundations.

Build a focused page set around actual services and evidence. The following search themes are hypotheses to validate, not keyword-volume or ranking findings:

| Proposed destination | Buyer intent to address | Supporting content |
| --- | --- | --- |
| Documentary production service | documentary production company; NGO documentary production | Relevant finished films, field capability, process, client roles |
| Impact/campaign films service | conservation video production; nonprofit campaign films | Conservation Diaries and comparable commissioned work |
| Brand/channel promotion within the services overview | brand content and channel promotion; refine search themes once scope is documented | Panasonic Global / LUMIX collaboration, using the actual work performed |
| Editing/post-production service | documentary video editing; editing supplied footage | The multi-country footage project, edit process, deliverables |
| Individual project pages | Client + project + production role; event + film | Exact credits, partner references, film, story |
| About/studio page | Ayni Studios; named filmmakers and experience | Team biographies, field photos, approach, verified credits |
| Contact/project inquiry page | A visitor ready to commission work | Simple brief fields, direct email, expectations |

Start with three service pages only if you can meaningfully distinguish the offering and evidence. Otherwise consolidate until more proof is available. Keep Los Angeles/global context truthful. Avoid mass-producing near-identical city pages for locations without a substantive business presence or service story.

Make commercial brand work visible in the homepage services description alongside documentary and impact production. Panasonic Global / LUMIX provides a concrete example of helping a brand promote its channel. Initially place this within the existing services overview rather than creating a thin standalone service page; let the documented engagement determine the eventual service label and search focus.

Link service pages to relevant projects, projects back to services and related work, and all of them to a clear inquiry destination. A future inquiry form should ask only for useful qualification: name, work email, organization, project type, timeline, optional budget range, and a short brief. Keep email as an alternative and publish response-time commitments only if sustainable.

Concrete technical improvements:

- Add explicit self-referencing canonicals per indexable public page. Neither inspected page currently renders one. This is a consistency improvement, not evidence of an existing duplicate-content penalty.
- Add distinct Open Graph/Twitter images; neither page currently has an og:image despite the large-image Twitter card declaration. Use readable studio/project artwork, typically 1200 × 630, and test the resulting previews.
- Make titles describe the service or project rather than relying on “Library” or the brand slogan. Example homepage direction: “Documentary & Impact Video Production | Ayni Studios.”
- Extend the sitemap as useful pages are published. Replace generation-time lastModified values with actual significant content-update dates, or omit dates where unknown. [Google: sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- Add the verified LinkedIn company profile to the existing organization identity references and public footer. Preserve consistent business details across profiles.
- Validate structured data against visible content. Do not invent awards, reviews, ratings, or affiliations to populate schema.

Video needs special attention. Library links currently point to YouTube; normal clicks open a local modal, and the featured iframe is also inserted only after a click. There were zero iframes in the initially rendered library. This is efficient for browsing, but it leaves Ayni without dedicated watch pages and makes video discovery depend on an interaction Google says not to require.

Give selected films stable on-site URLs. Where video-search visibility is a goal, make the individual video the page's main purpose and expose the player without requiring a click to create it. Provide accurate VideoObject metadata and stable thumbnails, then verify rendered output and video indexing through Search Console. Keep lightweight preview cards on listing pages. A text-led case study can still rank normally; adding an incidental video does not automatically qualify it as a watch page. [Google: video SEO](https://developers.google.com/search/docs/appearance/video)

Improve off-site evidence through existing relationships: request a relevant credit and project link from a client's project page, partner announcement, or event recap when appropriate. Update YouTube descriptions to link to the corresponding Ayni project and commissioning service. These are recommended follow-up actions; no outreach was sent.

**Performance and accessibility**

The frontend already uses responsive WebP stills, deferred secondary hero images, lazy portfolio thumbnails, and click-loaded YouTube players. Avoid discarding these improvements during a redesign.

The hero word-cloud assets are approximately 1.3MB per format. Browsers normally select one format, so these should not be added together as a single page transfer. The video uses autoplay and preload=auto; the live homepage also declares six font preloads. Both are candidates for simplification, but their effect on loading speed has not been quantified here.

Use a poster-first/static mobile hero or a smaller optional animation, retain just the font weights the redesigned public site needs, and reserve dimensions for hero media before metadata arrives. Pause hero work offscreen. The particle canvas already respects reduced motion and pauses in hidden tabs, but it continues drawing while the page is visible; test a static or hero-only treatment before spending time on micro-optimizations.

Motion handling is incomplete. The hero's reduced-motion branch pauses the word video, but does not stop the background rotation timer and opacity crossfades. The carousel suppresses auto-advance for reduced-motion users and pauses on hover, but lacks a visible pause control and focus-based pause. Use a static grid or provide user controls for continuing automatic movement, with keyboard behavior tested. [W3C: Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)

Complete a focused keyboard and accessibility pass during implementation: skip-to-content link, visible focus, sensible heading hierarchy, descriptive project links, larger small labels, stable video sizing, and reduced-motion changes while the page is open. This audit is not a full WCAG conformance evaluation.

Establish a production baseline before claiming a speed improvement. Measure mobile and desktop separately; use real-user 75th-percentile targets of LCP ≤ 2.5s, INP ≤ 200ms, and CLS ≤ 0.1. Lighthouse can help diagnose loading and main-thread work, but does not replace field measurements. [Web Vitals guidance](https://web.dev/articles/vitals)

**AI-assisted editing and pricing**

Lead the relaunch with craft, experience, and clear deliverables. Present efficiency as a client benefit once demonstrated: easier reuse of footage, more useful versions, or a lower cost for a defined scope. “Cheap AI videos” would create a different quality expectation from the institutional work you want to win.

Trial AI assistance in transcription, logging, interview selects, subtitle drafts, translation drafts, versioning, and approved footage search. Keep story decisions, factual accuracy, translation review, and final finishing accountable to named people. Explain relevant practices simply in the process page; there is no need to turn the homepage into a tool inventory.

Potential future offers are a supplied-footage edit, a campaign film with defined cutdowns, or recurring post-production support. Set pricing after measuring editorial hours, review rounds, tool costs, and delivery quality on representative jobs. Publish clear scope and starting prices only when those economics support them; no defensible price or percentage savings can be derived from the website audit alone.

For search content, AI can help turn verified project records into drafts that a filmmaker reviews. Google's AI search features do not require special AI files or a separate schema strategy; useful textual content, internal links, and accurate structured data remain the foundation. [Google: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)

**Suggested relaunch sequence and measurement**

First pass: refine homepage copy and hierarchy, keep the name visible on mobile, elevate selected work, improve social previews/canonicals, and settle the small-size logo direction. Assemble project evidence and testimonials in parallel with the design work.

Second pass: publish three substantive project pages, the initial service pages, a studio page, and a focused inquiry destination. Verify each page's links, metadata, rendered video behavior, and factual claims before launch.

After launch: connect or review Search Console, submit the expanded sitemap, establish real-user performance measurement, and track project inquiries. No common analytics integration was found in the inspected source; external measurement arrangements were not verified. Use the current account setup if one already exists.

Track non-brand impressions/clicks to service and project pages, inquiry starts/submissions, qualified leads, proposals, and won work. Email and WhatsApp clicks are intent signals, not completed inquiries. At low traffic, evaluate lead quality and patterns over time rather than claiming statistical certainty from a small A/B test. Use the first 30–90 days to improve pages that attract relevant searches or produce substantive inquiries.

The first implementation should be a clearer homepage plus three evidence-rich project pages. That makes the visual relaunch and the SEO investment reinforce the same business outcome.

**Implementation references**

- [Homepage structure](/Users/Noah/Noah95_apps/aynistudios-web/app/page.tsx:65)
- [Hero heading and motion](/Users/Noah/Noah95_apps/aynistudios-web/app/components/HeroSection.tsx:39)
- [Mobile wordmark visibility](/Users/Noah/Noah95_apps/aynistudios-web/app/components/Navbar.tsx:52)
- [Partner/event grid](/Users/Noah/Noah95_apps/aynistudios-web/app/components/PartnerLogos.tsx:23)
- [Library presentation and metadata](/Users/Noah/Noah95_apps/aynistudios-web/app/library/page.tsx:14)
- [Outbound project URLs](/Users/Noah/Noah95_apps/aynistudios-web/app/components/PlayLink.tsx:29)
- [Click-created featured player](/Users/Noah/Noah95_apps/aynistudios-web/app/components/FeaturedVideoCard.tsx:17)
- [Global metadata and font weights](/Users/Noah/Noah95_apps/aynistudios-web/app/layout.tsx:15)
- [Sitemap dates](/Users/Noah/Noah95_apps/aynistudios-web/app/sitemap.ts:9)
