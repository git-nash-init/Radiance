// Completed projects, from the Adinarayan Buildcon company profile (pp. 5–17).
// Fields are only present where the profile states them.

export type CompletedProject = {
  name: string;
  location: string;
  year?: number;
  area?: string;
  type?: string;
  units?: string;
  image?: string;
};

const img = (slug: string) => `/media/company/${slug}.webp`;

export const completedProjects: CompletedProject[] = [
  { name: "Riddhi Siddhi Row House", location: "Ambernath", year: 2021, area: "6,200 sq.ft", type: "Residential", units: "2 Bungalows", image: img("riddhi-siddhi") },
  { name: "Guru Dev", location: "Ambernath", year: 2018, area: "19,800 sq.ft", type: "Residential", units: "30 Flats", image: img("guru-dev") },
  { name: "Guru Krupa", location: "Sawantwadi", year: 2017, area: "13,320 sq.ft", type: "Residential", units: "24 Flats", image: img("guru-krupa") },
  { name: "Guru Vishnu", location: "Ambernath", year: 2016, area: "51,590 sq.ft", type: "Residential", units: "77 Flats", image: img("guru-vishnu") },
  // The profile reuses Guru Ganesh's photo on this page, so no image is shown.
  { name: "Guru Saptashri", location: "Khopoli", year: 2016, area: "25,200 sq.ft", type: "Residential", units: "36 Flats" },
  { name: "Guru Pushpa", location: "Badlapur", year: 2012, area: "9,800 sq.ft", type: "Residential", units: "14 Flats", image: img("guru-pushpa") },
  { name: "Guru Ganesh", location: "Khopoli", year: 2012, area: "23,310 sq.ft", type: "Residential & Commercial", units: "33 Flats · 4 Shops", image: img("guru-ganesh") },
  { name: "Guru Prasad", location: "Badlapur", year: 2011, area: "21,400 sq.ft", type: "Residential", units: "32 Flats", image: img("guru-prasad") },
  { name: "Guru Chintan", location: "Badlapur", year: 2009, area: "19,600 sq.ft", type: "Residential", units: "28 Flats", image: img("guru-chintan") },
  { name: "Lakshmikant", location: "Ambernath", year: 2007, area: "22,400 sq.ft", type: "Residential", units: "28 Flats", image: img("lakshmikant") },
  { name: "Matoshree", location: "Ulhasnagar", year: 2005, area: "6,600 sq.ft", type: "Residential & Commercial", units: "7 Flats · 6 Shops", image: img("matoshree") },
  { name: "Satam Maharaj Mandir", location: "Ambernath", image: img("satam-maharaj-mandir") },
  { name: "Shree Shriya CHS", location: "Badlapur East", image: img("shree-shriya") },
];

// Ongoing project and landbank — company profile pp. 18–19.
export const ongoingProject = {
  name: "RADIANCE",
  location: "Dombivli East",
  positioning: "Premium Lifestyle Residence",
  image: "aerial-day",
} as const;

export const landbank = {
  area: "36,700 sq ft",
  location: "Dombivli East",
  // Profile p19, lightly condensed.
  copy: "We own a chunk of land at the prime location of Dombivli East. The proposed project of 36,700 sq ft will be developed in the near future.",
  image: "/media/company/landbank.webp",
} as const;

// Shown on the home page teaser (newest, and the largest by built-up area).
export const featuredCompleted = ["Riddhi Siddhi Row House", "Guru Dev", "Guru Vishnu"];
