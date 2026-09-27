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
  phone: { display: "+91 99701 83779", tel: "+919970183779" },
  email: "adinarayanbuildconllp@gmail.com",
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
] as const;

// Additional spaces labelled in the client's walkthrough films.
export const alsoFeatured = ["Entrance Gate", "Entrance Lobby", "Waiting Area for Visitors", "Stack Parking", "Recreational Floor", "Kids' Play Area"];

// Tour categories recovered from the 3DVista project.
export const tourFeatures = [
  { label: "Floor-wise Window Views", detail: "1st to 23rd floor" },
  { label: "Day · Evening · Night", detail: "Three lighting moods" },
  { label: "Aerial View", detail: "360° over Dombivli East" },
  { label: "Neighbourhood", detail: "Education, healthcare, shopping, garden, temple" },
];

export const documents = {
  brochure: { title: "RADIANCE Brochure", file: "/documents/Radiance-Brochure.pdf", size: "5.7 MB", cover: "/media/company/brochure-cover.webp" },
  profile: { title: "Company Profile", file: "/documents/Adinarayan-Buildcon-Profile.pdf", size: "14.7 MB", cover: "/media/company/profile-cover.webp" },
} as const;

export type DocumentKey = keyof typeof documents;
