// Editorial content for the public website. Keep claims tied to the sources
// in _docs/relaunch-implementation.md; dates below are content revisions.
export const CONTENT_UPDATED = "2026-09-13";
export const BOOKING_URL = "https://calendar.app.google/wqfU6XWyx2Z2vkwR8";
export const STUDIO_EMAIL = "humanity@ayni-studios.com";
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
      "Documentary production for conservation organizations, institutions, and brands. Field storytelling, interviews, and episodic films with a human perspective.",
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
    projectSlugs: ["conservation-diaries"],
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
      "Brand storytelling, impact films, and channel promotion for organizations with something meaningful to share. Explore Ayni Studios’ Panasonic Global and institutional work.",
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
    projectSlugs: ["panasonic-lumix", "nature-and-resilience"],
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
      "Documentary and brand video editing from Ayni Studios. Turn interviews, field footage, and material from multiple contributors into a coherent finished story.",
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
    projectSlugs: ["nature-and-resilience"],
    question: "Can you edit footage our team has already filmed?",
    answer:
      "Yes. Tell us what you have, what you want to make, and where it will be shown. We will review the material and propose an approach before agreeing the edit scope.",
  },
] as const;

export type Project = {
  slug: string;
  title: string;
  client: string;
  category: string;
  summary: string;
  status?: string;
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
    serviceSlugs: ["documentary-production", "brand-and-impact-content"],
    filmIds: ["71RKXOFeaco", "qrDvFXIixPY"],
  },
  {
    slug: "panasonic-lumix",
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
    serviceSlugs: ["editing-and-post-production", "brand-and-impact-content"],
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
];

export type Film = {
  slug: string;
  youtubeId: string;
  title: string;
  description: string;
  category: string;
  client?: string;
  year?: number;
  uploadDate?: string;
  projectSlug?: string;
};

// Published catalog snapshot: also provides a useful fallback if the catalog
// cannot be fetched. New records remain available through the live catalog.
export const films: Film[] = [
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
    title: "Orphaned Monkeys of the Amazon Rainforest",
    description:
      "The orphaned monkeys of the Amazon rainforest and the people who care for them.",
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
    ].some((prefix) => path === prefix || path.startsWith(`${prefix}/`))
  );
}
