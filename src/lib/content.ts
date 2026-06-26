/**
 * Marketing copy & content collections.
 * Icon names map to @phosphor-icons/react component names (resolved in the UI).
 */

export const servicesContent: { icon: string; title: string; description: string }[] = [
  {
    icon: "Drop",
    title: "Gutter Cleaning",
    description:
      "Full removal of leaves, moss and silt so rainwater flows freely away from your home.",
  },
  {
    icon: "ArrowsDownUp",
    title: "Downpipe Clearing",
    description:
      "Blocked downpipes flushed and cleared - included as standard with every clean.",
  },
  {
    icon: "Rows",
    title: "Fascia Cleaning",
    description:
      "Grime, algae and watermarks washed off your fascia boards for a fresh roofline.",
  },
  {
    icon: "SquaresFour",
    title: "Soffit Cleaning",
    description:
      "Soffits wiped down to remove cobwebs, dirt and staining under the eaves.",
  },
  {
    icon: "MagnifyingGlass",
    title: "Gutter Inspections",
    description:
      "Camera inspection with photos and an honest written summary of what we find.",
  },
  {
    icon: "Leaf",
    title: "Moss Removal",
    description:
      "Moss cleared from gutters and roofline to stop blockages coming straight back.",
  },
  {
    icon: "CalendarCheck",
    title: "Annual Maintenance",
    description:
      "On a yearly plan with a friendly reminder - your gutters never get neglected.",
  },
  {
    icon: "House",
    title: "Residential Properties",
    description:
      "Terraced, semi, detached and bungalows across Sheffield - homes are our specialism.",
  },
];

export const whyChoose: { icon: string; label: string }[] = [
  { icon: "Star", label: "121 Five-Star Reviews" },
  { icon: "ShieldCheck", label: "Fully Insured" },
  { icon: "Images", label: "Before & After Photos" },
  { icon: "Tag", label: "Competitive Pricing" },
  { icon: "Handshake", label: "Friendly Local Business" },
  { icon: "ChatCircleText", label: "Honest Advice" },
  { icon: "Clock", label: "Reliable & On Time" },
  { icon: "Lightning", label: "Fast Response" },
  { icon: "Receipt", label: "No Hidden Charges" },
  { icon: "BellRinging", label: "Annual Reminder Service" },
];

export const damageRisks: { icon: string; title: string; description: string }[] = [
  { icon: "Drop", title: "Damp", description: "Overflowing water tracks down walls and soaks into brickwork." },
  { icon: "House", title: "Roof damage", description: "Standing water and trapped debris work back under the tiles." },
  { icon: "Rows", title: "Rotting fascia boards", description: "Constant moisture rots timber fascias and soffits." },
  { icon: "Waves", title: "Water ingress", description: "Water finds its way inside, staining ceilings and plaster." },
  { icon: "CurrencyGbp", title: "Expensive repairs", description: "Small blockages turn into four-figure repair bills." },
];

export const reviews: { quote: string; name: string; location: string }[] = [
  // Real customer reviews supplied by Matt. Add new ones here as they come in.
  {
    quote: "Excellent price and excellent service.",
    name: "Rachel D.",
    location: "Hillsborough",
  },
  {
    quote: "Provides photos to demonstrate the high standard of work.",
    name: "Andrew P.",
    location: "Chapeltown",
  },
  {
    quote: "Prompt, fair price, great communication and very pleasant to deal with.",
    name: "Sarah M.",
    location: "Stannington",
  },
  {
    quote: "Matt was fantastic as always. Prompt, fair price, great communication and very pleasant to deal with.",
    name: "Gary L.",
    location: "Ecclesfield",
  },
  {
    quote: "Excellent work. Turned up bang on time, friendly, great value for money and very trustworthy.",
    name: "Heather W.",
    location: "Oughtibridge",
  },
  {
    quote: "Brilliant service. Would definitely recommend.",
    name: "Tom B.",
    location: "Grenoside",
  },
];

export const processSteps: { title: string; description: string; icon: string }[] = [
  { title: "Book a Visit", description: "Call, message or book online in under two minutes.", icon: "CalendarPlus" },
  { title: "Professional Clean", description: "Gutters, downpipes and roofline cleared thoroughly.", icon: "Broom" },
  { title: "Photos Provided", description: "Before-and-after photos sent so you can see the results.", icon: "Camera" },
  { title: "Worry-Free Gutters", description: "Relax knowing your home is protected, with a yearly reminder.", icon: "SmileyWink" },
];

export const faqs: { question: string; answer: string }[] = [
  {
    question: "How often should gutters be cleaned?",
    answer:
      "For most Sheffield homes, once a year keeps gutters flowing freely. If you have trees nearby, twice a year is worth it. We send an annual reminder so you never have to think about it.",
  },
  {
    question: "Do you clear downpipes?",
    answer:
      "Yes - downpipe clearing is included as standard with every gutter clean, at no extra charge.",
  },
  {
    question: "Do you provide photos?",
    answer:
      "Always. You receive before-and-after photos showing exactly what was cleared and the standard of the finished work.",
  },
  {
    question: "How long does it take?",
    answer:
      "A typical two-storey home takes between 45 minutes and 90 minutes depending on size, access and how blocked the gutters are.",
  },
  {
    question: "Do I need to be home?",
    answer:
      "No. As long as we have safe access to all sides of the property, you don't need to be in. We'll send your photos and an invoice once finished.",
  },
  {
    question: "Are you insured?",
    answer:
      "Yes, the business is fully insured for your peace of mind. Proof of insurance is available on request.",
  },
  {
    question: "What if you find damage?",
    answer:
      "We'll show you photos and give honest, no-pressure advice. There's never an obligation, and we'll only ever recommend work that genuinely needs doing.",
  },
];

/**
 * Before & After gallery.
 * Replace the `picsum.photos` placeholder URLs with Matt's real job photos.
 * Drop the images into /public/gallery and point `before`/`after` at them, e.g.
 *   before: "/gallery/oughtibridge-1-before.jpg"
 *   after:  "/gallery/oughtibridge-1-after.jpg"
 */
export const gallery: { id: string; caption: string; before: string; after: string }[] = [
  { id: "g1", caption: "Moss-clogged gutters, Oughtibridge", before: "https://picsum.photos/seed/gutter-before-1/800/600", after: "https://picsum.photos/seed/gutter-after-1/800/600" },
  { id: "g2", caption: "Semi-detached roofline, Hillsborough", before: "https://picsum.photos/seed/gutter-before-2/800/1000", after: "https://picsum.photos/seed/gutter-after-2/800/1000" },
  { id: "g3", caption: "Downpipe flush, Chapeltown", before: "https://picsum.photos/seed/gutter-before-3/800/600", after: "https://picsum.photos/seed/gutter-after-3/800/600" },
  { id: "g4", caption: "Fascia clean, Stannington", before: "https://picsum.photos/seed/gutter-before-4/800/700", after: "https://picsum.photos/seed/gutter-after-4/800/700" },
  { id: "g5", caption: "Detached property, Grenoside", before: "https://picsum.photos/seed/gutter-before-5/800/900", after: "https://picsum.photos/seed/gutter-after-5/800/900" },
  { id: "g6", caption: "End terrace, Ecclesfield", before: "https://picsum.photos/seed/gutter-before-6/800/600", after: "https://picsum.photos/seed/gutter-after-6/800/600" },
];
