// Editorial content for the public website. Keep claims tied to the sources
// in _docs/relaunch-implementation.md; dates below are content revisions.
export const CONTENT_UPDATED = "2026-09-15";
export const NATURE_FOR_LIFE = {
  filmSlug: "orphaned-monkeys-of-the-amazon",
  sourceUrl: "https://www.learningfornature.org/en/nature-for-life-hub-2024/day3/",
  recognition: "Selected for UNDP’s Nature for Life Hub 2024",
} as const;
export const BOOKING_URL = "https://calendar.app.google/wqfU6XWyx2Z2vkwR8";
export const STUDIO_EMAIL = "humanity@ayni-studios.com";
export const STUDIO_ADDRESS = {
  streetAddress: "28130 Avenue Crocker, Unit 318",
  addressLocality: "Valencia",
  addressRegion: "CA",
  postalCode: "91355",
  addressCountry: "US",
} as const;
// Valencia sits inside the city of Santa Clarita, Los Angeles County — the
// local search entity Google and Gemini resolve the address to. Coordinates
// are from OpenStreetMap for the street address above.
export const STUDIO_GEO = { latitude: 34.435142, longitude: -118.585437 } as const;
// The Google Business Profile (created 2026-09-16). The cid link opens the
// profile itself rather than a search for the address.
export const STUDIO_MAPS_URL = "https://maps.google.com/maps?cid=4980682438578051182";
export const GOOGLE_PROFILE_URLS = [
  STUDIO_MAPS_URL,
  "https://www.google.com/search?kgmid=/g/11zxngbfsl",
] as const;
export const LOCATION_PATH = "/video-production-los-angeles";
// One sentence every location-bearing surface reuses, so search engines and
// AI answers see the same facts everywhere: where the studio is, what it
// makes, and how far it works.
export const LOCATION_STATEMENT =
  "Ayni Studios is a documentary and impact video production company based in Valencia, California, in the Santa Clarita Valley of Los Angeles County. We film across Los Angeles and work with organizations worldwide.";
export const SERVICE_AREAS = [
  { "@type": "City", name: "Los Angeles", sameAs: "https://en.wikipedia.org/wiki/Los_Angeles" },
  { "@type": "City", name: "Santa Clarita", sameAs: "https://en.wikipedia.org/wiki/Santa_Clarita,_California" },
  { "@type": "Place", name: "Valencia, California", sameAs: "https://en.wikipedia.org/wiki/Valencia,_Santa_Clarita,_California" },
  { "@type": "AdministrativeArea", name: "Los Angeles County", sameAs: "https://en.wikipedia.org/wiki/Los_Angeles_County,_California" },
  { "@type": "State", name: "California", sameAs: "https://en.wikipedia.org/wiki/California" },
  { "@type": "Country", name: "United States", sameAs: "https://en.wikipedia.org/wiki/United_States" },
  { "@type": "Place", name: "Worldwide" },
] as const;
// Last material content change per public path. The sitemap reports these
// as <lastmod>; a page not listed here falls back to CONTENT_UPDATED. Update
// the date when the page's visible content changes, not on every deploy —
// Google ignores lastmod once it stops matching reality.
export const PAGE_UPDATED: Record<string, string> = {
  "/": "2026-09-18",
  "/library": "2026-09-15",
  "/services": "2026-09-15",
  "/guides": "2026-09-22",
  "/about": "2026-09-18",
  "/contact": "2026-09-15",
  "/privacy": "2026-09-13",
  [LOCATION_PATH]: "2026-09-15",
  "/guides/affordable-video-production": "2026-09-13",
  "/guides/choosing-a-storytelling-company": "2026-09-13",
  "/work/audio-to-animated-legacy-film": "2026-09-22",
  "/work/conservation-diaries": "2026-09-15",
  "/work/panasonic-lumix": "2026-09-15",
  "/work/nature-and-resilience": "2026-09-15",
  "/work/seafood-souq-south-africa": "2026-09-15",
  "/work/goumbook-sustainability-stories": "2026-09-15",
  "/work/amazonia-expeditions": "2026-09-15",
  "/work/mahdi-laith-marine-conservation": "2026-09-15",
  "/services/documentary-production": "2026-09-15",
  "/services/brand-and-impact-content": "2026-09-15",
  "/services/editing-and-post-production": "2026-09-13",
  "/services/ngo-video-production": "2026-09-15",
  "/services/environmental-conservation-filmmaking": "2026-09-15",
  "/services/legacy-films": "2026-09-13",
  "/services/remote-video-production": "2026-09-13",
};
// Public canonical identity is separate from the app's local/auth base URL.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://ayni-studios.com"
).replace(/\/$/, "");

export const services = [
  {
    slug: "documentary-production",
    number: "01",
    title: "Documentary production",
    short: "Real people. Real places. Stories worth staying with.",
    description:
      "Documentary production for conservation groups, institutions, and brands. Field storytelling, interviews, and episodic films with a human perspective.",
    intro:
      "Some stories need time on the ground. We bring a documentary approach to people, places, and the questions that connect them—whether the result is a standalone film or an ongoing series.",
    audience:
      "For organizations with a story to tell about their people, communities, research, or work in the field.",
    offerings: [
      "Story development and interview planning",
      "Field production and documentary interviews",
      "Standalone films and episodic series",
      "Editorial development through the final cut",
    ],
    process: [
      "Understand the story, the people involved, and the audience you want to reach.",
      "Plan the access, interviews, locations, and production approach around the story.",
      "Shape the footage into a film, with agreed review stages and delivery formats.",
    ],
    projectSlugs: ["conservation-diaries", "seafood-souq-south-africa", "amazonia-expeditions"],
    question: "Do we need a finished brief?",
    answer:
      "No. Tell us what you are working on, who the film should reach, and any important dates. We can help develop the story and define the production scope with you.",
  },
  {
    slug: "brand-and-impact-content",
    number: "02",
    title: "Brand & impact content",
    short: "Make the work you do mean something to the people watching.",
    description:
      "Brand storytelling, impact films, and channel promotion for organizations with something to share. See our Panasonic Global and institutional work.",
    intro:
      "A strong brand story starts with something real. We help organizations find that story and connect it with an audience through films, editorial planning, and content partnerships.",
    audience:
      "For brand teams, nonprofits, and institutions communicating a campaign, a partnership, or an ongoing body of work.",
    offerings: [
      "Brand and institutional storytelling",
      "Campaign and partnership films",
      "Editorial planning and series development",
      "Channel promotion and content strategy",
    ],
    process: [
      "Define the audience, message, and role the content needs to play.",
      "Choose an editorial approach and formats that fit the campaign or channel.",
      "Create and review the content against the agreed brief and delivery plan.",
    ],
    projectSlugs: ["panasonic-lumix", "seafood-souq-south-africa", "goumbook-sustainability-stories", "amazonia-expeditions", "mahdi-laith-marine-conservation", "nature-and-resilience"],
    question: "Can we work together beyond a single film?",
    answer:
      "Yes. We can discuss a series, channel-focused collaboration, or ongoing content plan. We agree the scope and deliverables around your goals rather than assuming every organization needs the same package.",
  },
  {
    slug: "editing-and-post-production",
    number: "03",
    title: "Editing & post-production",
    short: "Bring scattered footage into one clear, compelling story.",
    description:
      "Documentary and brand video editing from Ayni Studios. We turn interviews, field footage, and multi-contributor material into a coherent finished story.",
    intro:
      "The story does not end when filming stops. We work with footage from your team, partners, or multiple locations to find the thread that brings it together.",
    audience:
      "For teams with existing footage, interview material, or contributors in different locations who need a clear editorial direction.",
    offerings: [
      "Footage review and editorial development",
      "Interview-led and documentary editing",
      "Stories assembled from multiple contributors",
      "Delivery versions defined around your audience",
    ],
    process: [
      "Review the material, brief, technical requirements, and any gaps.",
      "Develop the narrative and share cuts through agreed feedback rounds.",
      "Finish the edit and prepare the versions included in your scope.",
    ],
    projectSlugs: ["nature-and-resilience", "audio-to-animated-legacy-film"],
    question: "Can you edit footage our team has already filmed?",
    answer:
      "Yes. Tell us what you have, what you want to make, and where it will be shown. We will review the material and propose an approach before agreeing the edit scope.",
  },
  {
    "slug": "ngo-video-production",
    "number": "04",
    "title": "NGO & nonprofit video production",
    "short": "Make your mission understandable. Keep people at the centre.",
    "description": "NGO and nonprofit storytelling, programme films, and donor communications, with WWF and IFRC programme experience behind our documentary-led production.",
    "intro": "Ayni Studios creates films for NGOs, nonprofits, and organizations working on social and environmental impact. We help turn programme information, field interviews, and partner footage into a story that audiences can understand and connect with.",
    "audience": "For communications teams explaining a programme, engaging supporters, reporting on work, or preparing a film for a launch, conference, or campaign.",
    "offerings": [
      "Programme launch and impact films",
      "Community and participant stories",
      "Donor and supporter communications",
      "Films assembled from partner or field-team footage",
      "Versions for events, websites, and social channels"
    ],
    "process": [
      "Identify the audience, the programme story, and which claims can be supported by your evidence.",
      "Agree participant permissions, interview plans, and partner review responsibilities before production.",
      "Choose new filming, existing footage, filming kits, audio-led animation, or local filmmakers to suit the brief.",
      "Review the narrative with your team and prepare the agreed event and digital versions."
    ],
    "projectSlugs": [
      "nature-and-resilience",
      "conservation-diaries",
      "goumbook-sustainability-stories"
    ],
    "question": "Have you worked on films involving international NGOs?",
    "answer": "Yes. Our BCRN programme film involved Emirates Nature–WWF, WWF International, and the International Federation of Red Cross and Red Crescent Societies (IFRC). We gathered and edited footage from multiple countries into one narrative. The film was showcased at COP30 and the IUCN World Conservation Congress 2025; the case study links to programme sources."
  },
  {
    "slug": "environmental-conservation-filmmaking",
    "number": "05",
    "title": "Environmental & conservation storytelling",
    "short": "Connect ecosystems, evidence, and the people doing the work.",
    "description": "Conservation documentaries by Ayni Studios, including They Live in Our World, selected for UNDP’s Nature for Life Hub 2024. See our environmental films.",
    "intro": "Ayni Studios makes environmental and conservation films that connect the natural world with human experience. Our work includes mangrove restoration and citizen science in the UAE, documentary stories in the Amazon, and a programme film about nature-based solutions and community resilience.",
    "audience": "For conservation organizations, environmental NGOs, researchers, foundations, and brands with a specific, substantiated environmental story to share.",
    "offerings": [
      "Conservation documentaries and episodic series",
      "Interviews with researchers and conservation practitioners",
      "Community perspectives on environmental change",
      "Nature-based solutions and programme explainers",
      "Environmental brand and partnership stories"
    ],
    "process": [
      "Define the environmental question, the people closest to it, and the evidence needed to explain it accurately.",
      "Plan interviews and imagery around location access, seasonal conditions, and participant needs.",
      "Choose field production or a combination of partner footage, local filmmakers, and editorial work.",
      "Review scientific terminology and claims with your designated subject experts before final delivery."
    ],
    "projectSlugs": [
      "conservation-diaries",
      "nature-and-resilience",
      "panasonic-lumix",
      "seafood-souq-south-africa",
      "goumbook-sustainability-stories",
      "amazonia-expeditions",
      "mahdi-laith-marine-conservation"
    ],
    "question": "What makes an environmental film more than beautiful nature footage?",
    "answer": "A clear question and a human perspective give the imagery meaning. In The Conservation Diaries, mangrove restoration and citizen science offer specific ways into the wider conservation story. The aim is to connect what people see with what is happening, why it matters, and who is involved."
  },
  {
    "slug": "legacy-films",
    "number": "06",
    "title": "Legacy films & life stories",
    "short": "Preserve the voices, memories, and decisions that shaped a life.",
    "description": "Personal, family, founder, and organizational legacy films that combine interviews, archive material, existing recordings, and audio-led animation.",
    "intro": "Ayni Studios offers legacy videos for individuals, families, founders, organizations, and institutions. A legacy film can preserve a person’s life story, the memories of a family, or the people and decisions behind an organization’s history.",
    "audience": "For families preserving memories, founders reflecting on their journey, and organizations marking a milestone or passing knowledge to the next generation.",
    "offerings": [
      "Personal biographies and family life stories",
      "Founder interviews and organizational histories",
      "Archive photographs, home videos, and recorded memories",
      "Audio-led stories with animation",
      "Private family films or versions intended for public sharing"
    ],
    "process": [
      "Discuss whose story is being told, who should see it, and which memories matter most.",
      "Review available photographs, recordings, and documents, including permission to use them.",
      "Choose interviews with a filmmaker, a filming kit, existing footage, or audio recordings with animated visuals.",
      "Shape the story with agreed family or organizational reviewers and confirm the final delivery audience."
    ],
    "projectSlugs": ["audio-to-animated-legacy-film"],
    "question": "Can we make a legacy film from audio or older family footage?",
    "answer": "Yes. Existing audio, home videos, and photographs can provide the starting point. We can build an animated narrative around supplied audio or combine recordings with interviews and archive material. We review the material’s quality and permissions first, and agree which memories, people, and visuals belong in the film."
  },
  {
    "slug": "remote-video-production",
    "number": "07",
    "title": "Remote & flexible video production",
    "short": "Your footage. Our kits. Local filmmakers. One considered story.",
    "description": "Send existing footage, use a filming kit, turn audio into an animated story, or work with local filmmakers, to suit your budget and deadline.",
    "intro": "Ayni Studios offers several ways to make a film without sending a full production crew to every location. You can send us footage you already have, receive a filming kit, supply audio for an animated narrative, or work with filmmakers in local communities around the world.",
    "audience": "For NGOs, brands, institutions, and families that need a production approach suited to a limited budget, dispersed contributors, recurring content, or a time-sensitive story.",
    "offerings": [
      "Editing and storytelling from your existing footage",
      "Filming kits sent to your team or contributors",
      "Animated narratives built around supplied audio",
      "Production with filmmakers in local communities",
      "A combined approach for multiple locations and formats"
    ],
    "process": [
      "Share your brief, budget range, deadline, locations, and any footage or recordings already available.",
      "Choose the combination of existing material, filming kits, audio-led animation, and local filming that the story needs.",
      "Agree capture requirements, contributor responsibilities, kit logistics, and the edit and review plan.",
      "Bring the contributions into a coherent narrative and deliver the versions included in the scope."
    ],
    "projectSlugs": [
      "audio-to-animated-legacy-film",
      "nature-and-resilience"
    ],
    "question": "Can remote production reduce video costs and turnaround time?",
    "answer": "It can. Existing footage can remove the need for a new shoot; filming kits and local filmmakers can reduce crew travel; supplied audio can become the basis of an animated film. Shared planning and capture requirements can also improve consistency and make recurring content easier to produce. Savings and timing depend on the material, locations, animation complexity, logistics, and review process, so we scope each project individually."
  },
] as const;

// A still per service for the homepage and services grid, from a film we made
// for that kind of client, routed through next/image like every other
// thumbnail. `image` is the 4:5 portrait the homepage reveal and the cards
// use; `wide` is the full frame for the 16:7 masthead on the service page.
// Prefer a frame graded from the 4K master (public/brand/services/) over
// YouTube's maxres thumbnail, which is 720p with burned-in subtitles.
export const serviceArt: Record<
  string,
  { image: string; alt: string; wide?: string }
> = {
  "documentary-production": {
    image: "/brand/services/documentary-production-1280.webp",
    wide: "/brand/services/documentary-production-wide-1920.webp",
    alt: "A river guide looking back from a canoe in heavy rain on the Tahuayo, Peruvian Amazon",
  },
  "brand-and-impact-content": {
    image: "/brand/services/brand-and-impact-content-1280.webp",
    wide: "/brand/services/brand-and-impact-content-wide-1920.webp",
    alt: "Two Leaders of Change volunteers wading through a mangrove at sunset",
  },
  "editing-and-post-production": {
    image: "/brand/services/editing-and-post-production-1280.webp",
    wide: "/brand/services/editing-and-post-production-wide-1920.webp",
    alt: "A spider specimen lit pink inside a glass cylinder, surrounded by coloured lights",
  },
  "ngo-video-production": {
    image: "/brand/services/ngo-video-production-1280.webp",
    wide: "/brand/services/ngo-video-production-wide-1920.webp",
    alt: "A capuchin monkey holding a piece of fruit and looking up through the canopy",
  },
  "environmental-conservation-filmmaking": {
    image: "/brand/services/environmental-conservation-filmmaking-1280.webp",
    wide: "/brand/services/environmental-conservation-filmmaking-wide-1920.webp",
    alt: "Stacked hardwood logs on a riverbank at dusk, seen from the water",
  },
  "legacy-films": {
    image: "/brand/services/legacy-films-1280.webp",
    wide: "/brand/services/legacy-films-wide-1920.webp",
    alt: "Painted animation of a small boat of people in a shaft of light on a stormy sea, from The Surgeon Who Crossed the Sea",
  },
  "remote-video-production": {
    image: "/brand/hero/hero-24-1280.webp",
    alt: "Volunteers wading through shallow mangrove water with sample trays, from Ayni Studios’ editorial photography",
  },
};

export type Project = {
  slug: string;
  title: string;
  client: string;
  category: string;
  summary: string;
  // Search/tab title when "client: title" runs past ~60 characters, where
  // Google cuts it off. The page heading keeps `title`.
  seoTitle?: string;
  status?: string;
  kind?: "sample";
  image?: string;
  imageAlt?: string;
  logo?: string;
  context: string;
  role: string;
  details: { label: string; value: string }[];
  paragraphs: string[];
  serviceSlugs: string[];
  filmIds?: string[];
  source?: { label: string; href: string };
  moreSources?: { label: string; href: string }[];
};

export const projects: Project[] = [
{
  "slug": "audio-to-animated-legacy-film",
  "kind": "sample",
  "title": "From narration to an animated life story",
  "client": "Ayni Studios",
  "category": "Audio-led animation · Legacy film",
  "summary": "Produced by Ayni Studios, The Surgeon Who Crossed the Sea turns a surgeon’s voice narration into an animated life story of painted imagery and photographs.",
  "image": "https://i.ytimg.com/vi/iZRQlh6dnS0/maxresdefault.jpg",
  "imageAlt": "Painted portrait of a surgeon from The Surgeon Who Crossed the Sea",
  "context": "The Surgeon Who Crossed the Sea tells a personal story through narration, painted imagery, and photographs. It follows Dr. Tuan T. Lam’s journey from leaving Vietnam as a child to his later life as a surgeon. The film’s published description identifies his own writing as the source of the story.",
  "role": "Produced by Ayni Studios. We took the surgeon’s voice narration and turned it into an animation, using illustrated scenes and photographs to bring his life story to the screen.",
  "details": [
    {
      "label": "Sample film",
      "value": "The Surgeon Who Crossed the Sea"
    },
    {
      "label": "Format",
      "value": "Narrated animation with painted imagery and photographs"
    },
    {
      "label": "Story source",
      "value": "The surgeon’s voice narration"
    },
    {
      "label": "Duration",
      "value": "3 minutes 59 seconds"
    },
    {
      "label": "Use case",
      "value": "Personal legacy and life-story filmmaking"
    }
  ],
  "paragraphs": [
    "The voice gives the film its narrative thread. Illustrated scenes give viewers a way to picture events from the past, while photographs connect the story with the people behind it. The source description distinguishes the imagined paintings from the real photographs at the end.",
    "For clients, this offers a useful starting point: a recorded memory, interview, narration, or written life story. It can be especially helpful when the events happened long ago, contributors live in different places, or a new location shoot would not add much to the story.",
    "With Ayni, the process begins by reviewing the story, audio, photographs, and intended audience. We agree the narrative structure and visual approach, develop the animated sequence, and refine the film through the review stages included in the scope.",
    "Audio-led production can reduce the need for travel, location filming, and on-camera interviews. The animation style, running time, audio quality, and revisions still determine the work involved. This example shows a creative approach, not a published budget or turnaround benchmark.",
    "The same approach can support a family history, founder biography, organizational milestone, or an interview-led impact story. We distinguish illustrative scenes from documentary evidence and agree how a person’s words and likeness will be used."
  ],
  "serviceSlugs": [
    "legacy-films",
    "remote-video-production",
    "editing-and-post-production"
  ],
  "filmIds": [
    "iZRQlh6dnS0"
  ],
  "source": {
    "label": "Watch the original upload on YouTube",
    "href": "https://www.youtube.com/watch?v=iZRQlh6dnS0"
  }
},
  {
    slug: "conservation-diaries",
    title: "The Conservation Diaries",
    client: "Emirates Nature–WWF",
    category: "Documentary series",
    summary:
      "Stories of conservation, from restoring mangroves to the people documenting the UAE’s natural world.",
    image: "https://i.ytimg.com/vi/71RKXOFeaco/maxresdefault.jpg",
    imageAlt: "The Floating Forest, an episode of The Conservation Diaries",
    context:
      "Conservation is a story about people as much as landscapes. The Conservation Diaries brings the work of Emirates Nature–WWF into view through an episodic documentary format.",
    role: "Documentary storytelling produced with Emirates Nature–WWF.",
    details: [
      { label: "Partner", value: "Emirates Nature–WWF" },
      { label: "Format", value: "Documentary series" },
      { label: "Focus", value: "Conservation in the UAE" },
    ],
    paragraphs: [
      "The Floating Forest explores mangrove restoration in the UAE. Voices of Change follows citizen scientists mapping the country’s species and habitats.",
      "Together, the episodes make space for both the environments being protected and the people doing the work. Each offers a way into a larger conservation story through a specific place or human perspective.",
    ],
    serviceSlugs: ["documentary-production", "brand-and-impact-content", "environmental-conservation-filmmaking", "ngo-video-production"],
    filmIds: ["71RKXOFeaco", "qrDvFXIixPY"],
  },
  {
    slug: "panasonic-lumix",
    seoTitle: "Panasonic LUMIX: Women artisans of the Amazon",
    title: "Women artisans of the Amazon",
    client: "Panasonic Global · LUMIX",
    category: "Brand & documentary collaboration",
    status: "In production",
    logo: "/brand/partners/panasonic.webp",
    summary:
      "An Amazon women artisans’ collective, filmed in collaboration with Panasonic Global for LUMIX.",
    context:
      "Ayni Studios is working with Panasonic Global to film a women artisans’ collective in the Amazon rainforest, using a camera supplied by Panasonic for the production.",
    role: "Filming the collective’s story for content that will support Panasonic’s LUMIX product and channel promotion.",
    details: [
      { label: "Partner", value: "Panasonic Global / LUMIX" },
      { label: "Story", value: "A women artisans’ collective" },
      { label: "Location", value: "Amazon rainforest" },
      { label: "Status", value: "In production" },
    ],
    paragraphs: [
      "Panasonic has supplied its latest camera model for the project. The resulting content will help demonstrate the product through a real production and highlight Panasonic’s engagement with Ayni’s work.",
      "At the centre is the collective: women, their craft, and the place where they work. The collaboration brings a documentary subject into a brand story, connecting filmmaking technology with the people and experiences it helps us share.",
    ],
    serviceSlugs: ["brand-and-impact-content", "documentary-production"],
  },
  {
    slug: "nature-and-resilience",
    seoTitle: "BCRN film for Emirates Nature–WWF and IFRC",
    title: "Nature as our first line of defence",
    client: "Emirates Nature–WWF · WWF · IFRC",
    category: "BCRN programme film",
    logo: "/brand/partners/ifrc-wwf.webp",
    image: "https://i.ytimg.com/vi/KA5wK3R5ClM/maxresdefault.jpg",
    imageAlt: "Building Community Resilience to Natural Hazards programme film",
    summary:
      "One film supporting a global initiative. Showcased at COP30 and the IUCN World Conservation Congress 2025.",
    context:
      "The Building Community Resilience to Natural Hazards (BCRN) programme brings conservation and humanitarian organizations together around nature-based solutions in Asia Pacific. Ayni created a film to help communicate that shared ambition.",
    role: "Gathering, curating, and editing footage from multiple countries into a unified narrative.",
    details: [
      {
        label: "Organizations",
        value: "Emirates Nature–WWF, WWF International & IFRC",
      },
      { label: "Ayni’s role", value: "Footage curation & editing" },
      {
        label: "Showcases",
        value: "COP30 & IUCN World Conservation Congress 2025",
      },
      {
        label: "Programme launch",
        value: "US$10 million anchor commitment from the UAE Aid Agency",
      },
    ],
    paragraphs: [
      "Our team worked closely with the partner organizations to gather and curate footage from multiple countries. We connected those perspectives in a unified story about human resilience and nature-led solutions.",
      "The film was shown on a panel at the UAE government pavilion during the IUCN World Conservation Congress 2025 in Abu Dhabi. The programme’s launch announcement records a US$10 million anchor commitment from the UAE Aid Agency.",
      "The same film was showcased at a COP30 Panda event introducing the next phase of the global partnership. It is also featured on Emirates Nature–WWF’s programme page, giving the story a life beyond the launch events.",
    ],
    serviceSlugs: ["editing-and-post-production", "brand-and-impact-content", "ngo-video-production", "remote-video-production"],
    filmIds: ["KA5wK3R5ClM"],
    source: {
      label: "Explore the programme and film at Emirates Nature–WWF",
      href: "https://www.emiratesnaturewwf.ae/en/page/building-community-resilience-to-natural-hazards-programme",
    },
    moreSources: [
      {
        label: "Read the IUCN launch announcement",
        href: "https://www.linkedin.com/posts/bcrnd-programme-ugcPost-7383458820187996160-FfsO/",
      },
      {
        label: "Watch the COP30 event recording",
        href: "https://www.youtube.com/watch?v=OXzyJNhF0GU",
      },
    ],
  },
{
  "slug": "seafood-souq-south-africa",
  "seoTitle": "Seafood Souq: Tuna traceability in Cape Town",
  "title": "Seafood traceability, from the water onwards",
  "client": "Seafood Souq",
  "category": "Brand documentary · Supply-chain transparency",
  "summary": "An Ayni Studios film made in Cape Town, South Africa, connecting pole-and-line tuna fishing with Seafood Souq’s work on digital seafood traceability.",
  "image": "https://i.ytimg.com/vi/Z1qjvzce4Cs/maxresdefault.jpg",
  "imageAlt": "Seafood Souq x ICV: Digitising South Africa Tuna Pole & Line Fisheries",
  "context": "Seafood supply chains span oceans, ports, and markets. Seafood Souq uses digital technology to support transparency and accountability across that journey. Its partnership with a pole-and-line tuna fishing company in Cape Town provides a specific setting for explaining that work.",
  "role": "Ayni Studios made this film in South Africa to promote Seafood Souq and tell the story of its partnership with ICV in the pole-and-line tuna fishery.",
  "details": [
    {
      "label": "Client",
      "value": "Seafood Souq"
    },
    {
      "label": "Location",
      "value": "Cape Town, South Africa"
    },
    {
      "label": "Featured partnership",
      "value": "Seafood Souq × ICV"
    },
    {
      "label": "Format",
      "value": "Brand documentary"
    },
    {
      "label": "Focus",
      "value": "Digital traceability and seafood supply-chain transparency"
    }
  ],
  "paragraphs": [
    "The film connects a technology business with the fishing community and industry it serves. A concrete place and partnership give audiences a way into the wider question of where seafood comes from and how information follows it through the supply chain.",
    "For businesses communicating environmental or social commitments, this is a useful storytelling approach: show the work in context, explain the intended benefit, and give the people and places behind the partnership a visible role.",
    "Seafood Souq published the film on its own channel under the title “Seafood Souq x ICV – Digitising South Africa Tuna Pole & Line Fisheries.” It is an example of our brand and environmental storytelling work, with the finished film available below."
  ],
  "serviceSlugs": [
    "brand-and-impact-content",
    "documentary-production",
    "environmental-conservation-filmmaking"
  ],
  "filmIds": [
    "Z1qjvzce4Cs"
  ],
  "source": {
    "label": "Watch Seafood Souq’s original upload",
    "href": "https://www.youtube.com/watch?v=Z1qjvzce4Cs"
  }
},
{
  "slug": "goumbook-sustainability-stories",
  "seoTitle": "Goumbook: Sustainability films in the UAE",
  "title": "Sustainability through people and action",
  "client": "Goumbook",
  "category": "Brand stories · Community impact films",
  "summary": "Four Ayni Studios films for Goumbook: its founder story, Give a Ghaf, food-waste recovery, and coastal conservation in the UAE.",
  "image": "https://i.ytimg.com/vi/F1bQIX2dM4s/maxresdefault.jpg",
  "imageAlt": "Goumbook: Changing Mindsets in the UAE and beyond",
  "context": "Goumbook’s work brings together sustainability education, businesses, and communities. These four films offer different ways into that mission: the organization’s story, its origins in tree planting, and two examples of community action.",
  "role": "Ayni Studios created these video samples for Goumbook, which published the films on its own YouTube channel.",
  "details": [
    {
      "label": "Client",
      "value": "Goumbook"
    },
    {
      "label": "Region",
      "value": "United Arab Emirates"
    },
    {
      "label": "Collection",
      "value": "Four published films"
    },
    {
      "label": "Formats",
      "value": "Founder story, programme storytelling, and community impact films"
    }
  ],
  "paragraphs": [
    "Changing Mindsets in the UAE and Beyond introduces the organization through its founder, Tatiana, and the work connecting education, business engagement, and regional collaboration.",
    "The Give a Ghaf origin story uses the tree-planting programme to explore Goumbook’s beginnings and its connection to desert biodiversity, water awareness, and the natural world.",
    "Fighting Food Waste, Feeding Communities follows the Eat It or Save It initiative during Ramadan. The film connects food recovery with meals for communities in Dubai.",
    "Community in Action documents a coastal clean-up and marine release at Jebel Ali Wildlife Sanctuary, with Goumbook’s Drop It initiative supporting the event.",
    "Together, the collection shows how an organization can communicate at different levels: explain its purpose, preserve its origin story, and share specific examples of its work. Each film has a dedicated watch page below."
  ],
  "serviceSlugs": [
    "brand-and-impact-content",
    "environmental-conservation-filmmaking",
    "ngo-video-production"
  ],
  "filmIds": [
    "F1bQIX2dM4s",
    "My_X9Av1Fmw",
    "nOMAU0T7qaU",
    "UBsFG4uQniA"
  ],
  "source": {
    "label": "Explore Goumbook’s YouTube channel",
    "href": "https://www.youtube.com/@Goumbook"
  }
},
{
  "slug": "amazonia-expeditions",
  "seoTitle": "Amazonia Expeditions: Peruvian Amazon films",
  "title": "Life and adventure in the Peruvian Amazon",
  "client": "Amazonia Expeditions",
  "category": "Travel films · Wildlife storytelling",
  "summary": "Four Ayni Studios films for Amazonia Expeditions, bringing rainforest wildlife, the journey to Tahuayo Lodge, and a canopy adventure to its audience.",
  "image": "https://i.ytimg.com/vi/oa8rEH-oN40/maxresdefault.jpg",
  "imageAlt": "Canopy Zipline Experience, a film for Amazonia Expeditions",
  "context": "For a travel business, the destination is more than a location. These films introduce the experiences, wildlife, and journeys that shape a visit to the Peruvian Amazon with Amazonia Expeditions.",
  "role": "Ayni Studios produced these four films for Amazonia Expeditions. The company published them on its own YouTube channel, with an Ayni Studios production credit in each description.",
  "details": [
    {
      "label": "Client",
      "value": "Amazonia Expeditions"
    },
    {
      "label": "Location",
      "value": "Peruvian Amazon"
    },
    {
      "label": "Collection",
      "value": "Four published films"
    },
    {
      "label": "Focus",
      "value": "Travel experiences, rainforest wildlife, and destination storytelling"
    }
  ],
  "paragraphs": [
    "Journey to the Lodge follows Amazonia Expeditions owner Dolly Beaver on the river journey from Iquitos towards Tahuayo Lodge. It introduces the route into the rainforest as part of the experience itself.",
    "The Saki Monkey and Searching for the Red Uakari bring two primates into focus, giving the audience a closer look at the wildlife around the company’s rainforest lodges.",
    "Canopy Zipline Experience shifts the perspective above the forest floor. Alongside the river journey and wildlife films, it shows a different part of the visitor experience.",
    "The collection is an example of how short films can work together for a travel or hospitality brand: introduce a place, answer a visitor’s curiosity, and show distinct reasons to explore it. Each film can also stand on its own on the client’s channel."
  ],
  "serviceSlugs": [
    "brand-and-impact-content",
    "documentary-production",
    "environmental-conservation-filmmaking"
  ],
  "filmIds": [
    "QkDwrFqKS6w",
    "0xWwD1A-65w",
    "F5k8-wiNgnQ",
    "oa8rEH-oN40"
  ],
  "source": {
    "label": "Explore Amazonia Expeditions’ YouTube channel",
    "href": "https://www.youtube.com/@amazoniaexpeditions"
  }
},
{
  "slug": "mahdi-laith-marine-conservation",
  "seoTitle": "Mahdi Laith: Marine conservation film",
  "title": "Marine conservation with Mahdi Laith",
  "client": "Mahdi Laith",
  "category": "Creator collaboration · Environmental storytelling",
  "summary": "Ayni Studios’ collaboration with environmental creator Mahdi Laith on a film about releasing sharks and stingrays at Jebel Ali Reserve in Dubai.",
  "image": "https://i.ytimg.com/vi/iQOZ8iwQA1Q/maxresdefault.jpg",
  "imageAlt": "Releasing Sharks and Stingrays, published by Mahdi Laith",
  "context": "A marine release at Jebel Ali Reserve in Dubai provides the setting for this collaboration with environmental creator Mahdi Laith. The film brings a specific conservation activity to the audience of his own channel.",
  "role": "Ayni Studios collaborated with Mahdi Laith on this film, which he published on his YouTube channel in January 2024.",
  "details": [
    {
      "label": "Collaborator",
      "value": "Mahdi Laith"
    },
    {
      "label": "Location",
      "value": "Jebel Ali Reserve, Dubai, UAE"
    },
    {
      "label": "Published",
      "value": "January 2024"
    },
    {
      "label": "Format",
      "value": "Environmental creator collaboration"
    },
    {
      "label": "Subject",
      "value": "Release of sharks and stingrays"
    }
  ],
  "paragraphs": [
    "The published description explains that the marine animals were bred at Atlantis before their release. The film follows that return to the sea through the perspective of an environmental creator.",
    "For organizations working with creators, a specific event offers a clear story to share: what is happening, where it takes place, and why the activity matters. This project is one example of Ayni’s work connecting environmental subjects with creator-led communication.",
    "The original upload carries an Arabic and English title. The watch page below presents the film as published on Mahdi’s channel and links back to the original source."
  ],
  "serviceSlugs": [
    "brand-and-impact-content",
    "environmental-conservation-filmmaking"
  ],
  "filmIds": [
    "iQOZ8iwQA1Q"
  ],
  "source": {
    "label": "Watch Mahdi Laith’s original upload",
    "href": "https://www.youtube.com/watch?v=iQOZ8iwQA1Q"
  }
},
];

export type Film = {
  slug: string;
  youtubeId: string;
  title: string;
  subtitle?: string;
  recognition?: string;
  sourceUrl?: string;
  description: string;
  category: string;
  client?: string;
  year?: number;
  uploadDate?: string;
  projectSlug?: string;
  duration?: string;
  serviceSlugs?: string[];
  viewingNotes?: { title: string; text: string }[];
};

// Published catalog snapshot: also provides a useful fallback if the catalog
// cannot be fetched. New records remain available through the live catalog.
export const films: Film[] = [
{
  "slug": "amazonia-the-saki-monkey",
  "youtubeId": "0xWwD1A-65w",
  "title": "The Saki Monkey",
  "description": "Produced by Ayni Studios for Amazonia Expeditions, this short film introduces the saki monkey and rainforest wildlife around its Peruvian Amazon lodges.",
  "client": "Amazonia Expeditions",
  "category": "Wildlife film",
  "year": 2025,
  "uploadDate": "2025-08-20T14:15:04-07:00",
  "duration": "PT1M57S",
  "projectSlug": "amazonia-expeditions",
  "sourceUrl": "https://www.youtube.com/watch?v=0xWwD1A-65w"
},
{
  "slug": "amazonia-canopy-zipline",
  "youtubeId": "oa8rEH-oN40",
  "title": "Soaring Through the Amazon Rainforest: Canopy Zipline Experience",
  "description": "An Ayni Studios film for Amazonia Expeditions, showing a canopy zipline experience and a different perspective on the Peruvian Amazon rainforest.",
  "client": "Amazonia Expeditions",
  "category": "Travel & adventure film",
  "year": 2026,
  "uploadDate": "2026-01-09T10:04:59-08:00",
  "duration": "PT1M22S",
  "projectSlug": "amazonia-expeditions",
  "sourceUrl": "https://www.youtube.com/watch?v=oa8rEH-oN40"
},
{
  "slug": "amazonia-journey-to-the-lodge",
  "youtubeId": "QkDwrFqKS6w",
  "title": "Journey to the Lodge",
  "description": "An Ayni Studios film for Amazonia Expeditions, following owner Dolly Beaver on a river journey towards Tahuayo Lodge in the Peruvian Amazon.",
  "client": "Amazonia Expeditions",
  "category": "Travel & destination film",
  "year": 2025,
  "uploadDate": "2025-07-18T10:42:18-07:00",
  "duration": "PT1M58S",
  "projectSlug": "amazonia-expeditions",
  "sourceUrl": "https://www.youtube.com/watch?v=QkDwrFqKS6w"
},
{
  "slug": "amazonia-red-uakari",
  "youtubeId": "F5k8-wiNgnQ",
  "title": "Searching for the Red Uakari",
  "description": "Produced by Ayni Studios for Amazonia Expeditions, this short wildlife film follows the search for the bald red uakari monkey in the Peruvian Amazon.",
  "client": "Amazonia Expeditions",
  "category": "Wildlife film",
  "year": 2025,
  "uploadDate": "2025-08-12T15:36:15-07:00",
  "duration": "PT1M12S",
  "projectSlug": "amazonia-expeditions",
  "sourceUrl": "https://www.youtube.com/watch?v=F5k8-wiNgnQ"
},
{
  "slug": "mahdi-laith-sharks-and-stingrays",
  "youtubeId": "iQOZ8iwQA1Q",
  "title": "Releasing Sharks and Stingrays with Mahdi Laith",
  "description": "A collaboration between Ayni Studios and environmental creator Mahdi Laith, documenting a shark and stingray release at Jebel Ali Reserve in Dubai.",
  "client": "Mahdi Laith",
  "category": "Environmental creator collaboration",
  "year": 2024,
  "uploadDate": "2024-01-29T13:37:29-08:00",
  "duration": "PT3M55S",
  "projectSlug": "mahdi-laith-marine-conservation",
  "sourceUrl": "https://www.youtube.com/watch?v=iQOZ8iwQA1Q"
},
{
  "slug": "seafood-souq-south-africa-tuna",
  "youtubeId": "Z1qjvzce4Cs",
  "title": "Seafood Souq × ICV: South Africa’s Pole-and-Line Tuna Fishery",
  "description": "An Ayni Studios film made in Cape Town for Seafood Souq, exploring its ICV partnership and digital transparency in the seafood supply chain.",
  "client": "Seafood Souq",
  "category": "Brand documentary",
  "year": 2025,
  "uploadDate": "2025-06-12T10:08:59-07:00",
  "duration": "PT9M36S",
  "projectSlug": "seafood-souq-south-africa",
  "sourceUrl": "https://www.youtube.com/watch?v=Z1qjvzce4Cs"
},
{
  "slug": "goumbook-changing-mindsets",
  "youtubeId": "F1bQIX2dM4s",
  "title": "Goumbook: Changing Mindsets in the UAE and Beyond",
  "description": "An Ayni Studios film for Goumbook: founder Tatiana introduces its story and its work in sustainability education, business engagement, and collaboration.",
  "client": "Goumbook",
  "category": "Founder & brand story",
  "year": 2025,
  "uploadDate": "2025-09-15T01:27:28-07:00",
  "duration": "PT2M11S",
  "projectSlug": "goumbook-sustainability-stories",
  "sourceUrl": "https://www.youtube.com/watch?v=F1bQIX2dM4s"
},
{
  "slug": "goumbook-give-a-ghaf-origin-story",
  "youtubeId": "My_X9Av1Fmw",
  "title": "Give a Ghaf: Goumbook’s Origin Story",
  "description": "An Ayni Studios film for Goumbook on how the Give a Ghaf tree-planting programme links its origin story with water awareness and biodiversity in the UAE.",
  "client": "Goumbook",
  "category": "Environmental storytelling",
  "year": 2025,
  "uploadDate": "2025-07-03T00:02:14-07:00",
  "duration": "PT4M7S",
  "projectSlug": "goumbook-sustainability-stories",
  "sourceUrl": "https://www.youtube.com/watch?v=My_X9Av1Fmw"
},
{
  "slug": "goumbook-food-waste-ramadan",
  "youtubeId": "nOMAU0T7qaU",
  "title": "Fighting Food Waste, Feeding Communities",
  "description": "An Ayni Studios film for Goumbook on its Eat It or Save It initiative during Ramadan, connecting food-waste recovery with meals for communities in Dubai.",
  "client": "Goumbook",
  "category": "Community impact film",
  "year": 2025,
  "uploadDate": "2025-06-24T05:44:26-07:00",
  "duration": "PT1M30S",
  "projectSlug": "goumbook-sustainability-stories",
  "sourceUrl": "https://www.youtube.com/watch?v=nOMAU0T7qaU"
},
{
  "slug": "goumbook-jebel-ali-clean-up",
  "youtubeId": "UBsFG4uQniA",
  "title": "Community in Action at Jebel Ali Sanctuary",
  "description": "An Ayni Studios film for Goumbook about a coastal clean-up and marine release at Jebel Ali Wildlife Sanctuary, supported by the Drop It initiative.",
  "client": "Goumbook",
  "category": "Conservation & community film",
  "year": 2025,
  "uploadDate": "2025-06-24T06:01:53-07:00",
  "duration": "PT1M30S",
  "projectSlug": "goumbook-sustainability-stories",
  "sourceUrl": "https://www.youtube.com/watch?v=UBsFG4uQniA"
},
{
  "slug": "the-surgeon-who-crossed-the-sea",
  "youtubeId": "iZRQlh6dnS0",
  "title": "The Surgeon Who Crossed the Sea",
  "description": "Produced by Ayni Studios, this legacy film turns Dr. Tuan T. Lam’s voice narration into an animation with painted imagery and photographs.",
  "category": "Narrated animation · Legacy film",
  "year": 2026,
  "uploadDate": "2026-08-19T23:05:12-07:00",
  "duration": "PT3M59S",
  "projectSlug": "audio-to-animated-legacy-film",
  "serviceSlugs": [
    "legacy-films",
    "remote-video-production",
    "editing-and-post-production"
  ],
  "viewingNotes": [
    {
      "title": "A life story carried by narration",
      "text": "Ayni Studios took the surgeon’s voice narration and turned it into an animated life story. Painted scenes interpret the past, and photographs connect the story with real people."
    },
    {
      "title": "From your audio to an animated film",
      "text": "Ayni can use a recorded interview, memory, or narration as the starting point for an animated story. We review the material, agree the narrative and visual style, and develop the film around its intended audience. Legacy films, founder stories, and impact narratives can all use this approach."
    }
  ]
},
  {
    slug: "building-community-resilience",
    youtubeId: "KA5wK3R5ClM",
    title: "Building Community Resilience to Natural Hazards",
    description:
      "Ayni Studios’ BCRN programme film, bringing footage from multiple countries into a shared story about nature and resilience. Showcased at COP30 and the IUCN World Conservation Congress 2025.",
    category: "Programme film",
    client: "Emirates Nature–WWF · WWF · IFRC",
    year: 2025,
    uploadDate: "2025-10-13T03:00:33-07:00",
    projectSlug: "nature-and-resilience",
  },
  {
    slug: "the-floating-forest",
    youtubeId: "71RKXOFeaco",
    uploadDate: "2026-06-08T06:45:11-07:00",
    title: "Conservation Diaries: The Floating Forest",
    description:
      "An episode of The Conservation Diaries, produced with Emirates Nature–WWF, exploring mangrove restoration in the UAE.",
    category: "Documentary series",
    client: "Emirates Nature–WWF",
    year: 2026,
    projectSlug: "conservation-diaries",
  },
  {
    slug: "voices-of-change",
    youtubeId: "qrDvFXIixPY",
    uploadDate: "2026-07-28T05:26:24-07:00",
    title: "Conservation Diaries: Voices of Change",
    description:
      "Citizen scientists mapping the UAE’s species and habitats. An episode of The Conservation Diaries produced with Emirates Nature–WWF.",
    category: "Documentary series",
    client: "Emirates Nature–WWF",
    year: 2026,
    projectSlug: "conservation-diaries",
  },
  {
    slug: "commercial-fishing-in-the-amazon",
    youtubeId: "6vw_pS96Odg",
    uploadDate: "2026-02-18T13:35:25-08:00",
    title: "Commercial Fishing in the Amazon Threatens Livelihoods",
    description:
      "A documentary exploring how commercial fishing pressures are reshaping life along the rivers of the Amazon rainforest.",
    category: "Documentary",
    year: 2026,
  },
  {
    slug: "do-plants-have-spirits",
    youtubeId: "ejvyfpOlyRA",
    uploadDate: "2026-02-10T09:01:06-08:00",
    title: "Do Plants Have Spirits?",
    description:
      "A documentary exploring the relationship between plants, belief, and the people who see the natural world as a connection to the divine.",
    category: "Documentary",
    year: 2026,
  },
  {
    slug: "oil-spill-threatens-the-galapagos",
    youtubeId: "-LDcp9SWahw",
    uploadDate: "2024-08-31T03:03:15-07:00",
    title: "Oil Spill Threatens the Galápagos",
    description:
      "An Ayni Studios documentary about an environmental threat and its consequences for the natural world.",
    category: "Documentary",
    year: 2024,
  },
  {
    slug: "orphaned-monkeys-of-the-amazon",
    youtubeId: "QELtdAIjjs0",
    uploadDate: "2024-06-02T06:02:48-07:00",
    title: "They Live in Our World",
    subtitle: "Orphaned Monkeys of the Amazon Rainforest",
    recognition: NATURE_FOR_LIFE.recognition,
    sourceUrl: NATURE_FOR_LIFE.sourceUrl,
    description:
      "They Live in Our World, an Ayni Studios documentary about orphaned monkeys in the Amazon rainforest, selected for UNDP’s Nature for Life Hub 2024.",
    serviceSlugs: ["environmental-conservation-filmmaking", "documentary-production", "ngo-video-production"],
    viewingNotes: [{
      title: "Conservation through a shared world",
      text: "At La Isla de Los Monos, a primate sanctuary in the Peruvian Amazon, the film observes the lives of rescued monkeys and the people caring for them. It connects this intimate perspective with the environmental pressures facing the surrounding rainforest.",
    }],
    category: "Documentary",
    year: 2024,
  },
  {
    slug: "the-bridge-to-nowhere",
    youtubeId: "ArxMcIPRSdk",
    uploadDate: "2024-04-30T08:45:00-07:00",
    title: "The Bridge to Nowhere",
    description:
      "An Ayni Studios documentary exploring infrastructure challenges in the Amazon rainforest.",
    category: "Documentary",
    year: 2024,
  },
  {
    slug: "what-is-ayni",
    youtubeId: "qNLdmBfmlxU",
    uploadDate: "2025-09-09T12:24:06-07:00",
    title: "What Is Ayni?",
    description:
      "The Andean principle of sacred reciprocity that gives the studio its name and shapes its approach to storytelling.",
    category: "Studio film",
    year: 2025,
  },
];

export const getProject = (slug: string) =>
  projects.find((p) => p.slug === slug);
export const getService = (slug: string) =>
  services.find((s) => s.slug === slug);

export function isPublicPath(path: string) {
  return (
    path === "/" ||
    [
      "/library",
      "/work",
      "/films",
      "/services",
      "/about",
      "/contact",
      "/privacy",
      "/guides",
      LOCATION_PATH,
    ].some((prefix) => path === prefix || path.startsWith(`${prefix}/`))
  );
}
