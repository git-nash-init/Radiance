// Single source of truth for project facts. Every value here is taken from
// the supplied brochure / company profile / client messages — see
// ASSET_AUDIT.md. Do not add claims that are not in those sources.

export const project = {
  name: "RADIANCE",
  tagline: "Crafting Spaces, Elevating Lives", // brochure (typo "Elevationg" corrected)
  positioning: "Premium Lifestyle Residence", // brochure + logo
  logoLine: "Live a premium lifestyle",
  location: "Dombivli East",
  address: {
    lines: ["Plot No. 29/30/46, Opp. Vedant Co-op Society", "Near P & T Chowk, Hanuman Mandir", "Dombivli East, Maharashtra"],
    oneLine: "Plot No. 29/30/46, Opp. Vedant Co-op Society, near P & T Chowk, Hanuman Mandir, Dombivli East",
  },
  // Pin taken from the map embedded in the client's 3DVista tour.
  geo: { lat: 19.203104, lng: 73.08951 },
  rera: "PR1330002600193",
  reraUrl: "https://maharera.maharashtra.gov.in/",
  phone: { display: "+91 86899 27656", tel: "+918689927656", whatsapp: "918689927656" },
  email: "radiance@adinarayanbuildconllp.com",
} as const;

export const developer = {
  name: "Adinarayan Buildcon LLP",
  shortName: "Adinarayan Buildcon",
  motto: "Transforming dreams into Reality",
  since: 2002,
  founders: [
    { name: "Mr. Umakant Samant", role: "Director", photo: "/media/company/umakant-samant.webp" },
    { name: "Mr. Pranav Samant", role: "Director", photo: "/media/company/pranav-samant.webp" },
  ],
  about:
    "In 2002, Mr. Umakant Samant and Mr. Pranav Samant brought together a team of dedicated professionals to establish Adinarayan Buildcon — with a vision to transform spaces and lives across Kalyan Dombivli.",
  journey:
    "Since its inception, Adinarayan Buildcon has undertaken challenging projects, building deep know-how in design and build solutions, project management services and engineering works.",
  builtUpArea: "264K",
  landbank: "36,700 sq ft",
  groupCompanies: [
    "Samant Buildcon",
    "Shree Samarth Satam Maharaj Enterprises",
    "Adinarayan Buildcon LLP",
    "Shree Samarth Satam Maharaj Developers",
    "Sadguru Enterprises",
    "Sadguru Construction Company",
    "Meera Construction",
    "Samant Industries",
    "Meera Industries",
  ],
  office: {
    lines: ["Shop No. 67–68, 2nd Floor, P P Chamber", "Near KDMC Office, Dombivli East – 421201"],
  },
  phone: { display: "+91 86899 27656", tel: "+918689927656", whatsapp: "918689927656" },
  email: "salesadinarayanbuildconllp@gmail.com",
  gstin: "27ACEFA2398B1ZL",
} as const;

// Brochure page 2 — wording and minutes preserved exactly as printed.
export const connectivity = [
  { name: "Holy Angle School", minutes: 1, kind: "Education" },
  { name: "Dombivli Station", minutes: 5, kind: "Rail" },
  { name: "D Mart", minutes: 5, kind: "Shopping" },
  { name: "Upcoming Metro Station", minutes: 5, kind: "Metro" },
  { name: "Xperia Mall", minutes: 10, kind: "Leisure" },
] as const;

// Amenities named in the brochure and/or labelled in the client's own films.
export const amenities = [
  {
    id: "pool",
    title: "Rooftop Swimming Pool",
    copy: "A pool deck set above the neighbourhood — open sky, sun loungers and the city laid out below.",
    image: "pool-deck",
    source: "Render + film label",
  },
  {
    id: "gym",
    title: "Your personal fitness zone",
    copy: "With a fully-equipped gym within the premises, your wellness routine becomes an effortless part of everyday living.",
    image: "gym",
    source: "Brochure p3",
  },
  {
    id: "games",
    title: "Your fun & entertainment zone",
    copy: "With modern indoor games within the premises, everyday moments turn into fun-filled experiences for all age groups.",
    image: "indoor-games",
    source: "Brochure p3",
  },
  {
    id: "library",
    title: "Your peaceful reading space",
    copy: "Curated for residents who value knowledge, focus, and a tranquil lifestyle experience.",
    image: "library",
    source: "Brochure p4",
  },
  {
    id: "party",
    title: "Your celebration space",
    copy: "With a well-designed party hall within the premises, every celebration becomes more special, convenient, and memorable.",
    image: "party-hall",
    source: "Brochure p4",
  },
  {
    id: "kids",
    title: "Your kids' play area",
    // Wording follows the brochure's "Your … inside the community" pattern; it
    // states only what the client's own render shows. Client to confirm.
    copy: "A bright, dedicated play space for children — with a climbing wall, colourful flooring and room to draw and play — inside the community.",
    image: "kids-play",
    source: "Film label + render still",
  },
] as const;

// Additional spaces labelled in the client's walkthrough films.
export const alsoFeatured = ["Entrance Gate", "Entrance Lobby", "Waiting Area for Visitors", "Stack Parking", "Recreational Floor"];

// Tour categories recovered from the 3DVista project.
export const tourFeatures = [
  { label: "Floor-wise Window Views", detail: "1st to 23rd floor" },
  { label: "Day · Evening · Night", detail: "Three lighting moods" },
  { label: "Aerial View", detail: "360° over Dombivli East" },
  { label: "Neighbourhood", detail: "Education, healthcare, shopping, garden, temple" },
];

// Technical Team & Key Project Consultants
export const technicalTeam = [
  {
    id: "architect",
    role: "Architect",
    title: "Architectural Planning & Design",
    discipline: "Master Planning & Elevation",
    badge: "Design & Approvals",
    description:
      "Comprehensive master planning, spatial layouts, high-aesthetic exterior facades, and statutory MahaRERA compliance for natural light, ventilation, and contemporary lifestyle flow.",
    highlights: ["Master Planning", "Facade & Elevation", "Spatial Efficiency", "Statutory Liaisoning"],
  },
  {
    id: "pmc",
    role: "PMC",
    title: "Project Management Consultant",
    discipline: "Construction Supervision & Quality Control",
    badge: "Quality & Governance",
    description:
      "End-to-end execution governance, comprehensive on-site inspections, stage-wise quality control, timeline tracking, and zero-compromise safety standards.",
    highlights: ["Quality Assurance", "Milestone Tracking", "Site Safety Protocols", "Material Testing"],
  },
  {
    id: "mep",
    role: "MEP Consultant",
    title: "Mechanical, Electrical & Plumbing",
    discipline: "Integrated Building Services",
    badge: "Services Engineering",
    description:
      "High-efficiency building services engineering including advanced electrical networks, sound-insulated plumbing lines, ventilation systems, and modern fire-fighting infrastructure.",
    highlights: ["Power Distribution", "Advanced Plumbing", "Fire Fighting Networks", "Energy Optimization"],
  },
  {
    id: "structural",
    role: "Structural Engineer",
    title: "RCC Structural Dynamics & Stability",
    discipline: "Seismic & Foundation Dynamics",
    badge: "Strength & Durability",
    description:
      "Earthquake-resistant RCC framed structural design strictly adhering to IS-code standards, geological soil mechanics, load distribution, and multi-generational endurance.",
    highlights: ["Earthquake-Resistant RCC", "IS Code Compliance", "Soil & Foundation Dynamics", "Long-Term Integrity"],
  },
  {
    id: "parking",
    role: "Parking & Mobility",
    title: "Stack Parking & Traffic Circulation",
    discipline: "Mechanical & Space Engineering",
    badge: "Smart Mobility",
    description:
      "Precision-engineered stack car parking systems optimizing vehicular capacity, seamless driveway ingress/egress, automated safety sensors, and EV-ready power conduits.",
    highlights: ["Stack Car Systems", "Smooth Circulation", "Safety Interlocks", "EV Charging Provisions"],
  },
] as const;

export type TechnicalMember = (typeof technicalTeam)[number];

export const documents = {
  brochure: { title: "RADIANCE Brochure", file: "/documents/Radiance-Brochure.pdf", size: "5.7 MB", cover: "/media/company/brochure-cover.webp" },
  profile: { title: "Company Profile", file: "/documents/Adinarayan-Buildcon-Profile.pdf", size: "35.4 MB", cover: "/media/company/founders-page.webp" },
} as const;

export type DocumentKey = keyof typeof documents;
