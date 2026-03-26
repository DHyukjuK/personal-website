import type { Recording } from "@/lib/types";

/**
 * Order: featured first, then roughly newest performances first.
 * Embed URLs use YouTube’s `/embed/` form for the on-site player.
 */
export const recordings: Recording[] = [
  {
    title: 'Your Name (Kimi no Na wa) — medley',
    instrument: "Piano",
    year: 2025,
    featured: true,
    context: "Original arrangement · link coming soon",
    description:
      "A medley of themes from Makoto Shinkai’s film Your Name (君の名は) — arranged for collaborative piano. I’m especially proud of this one; I’ll add a performance link here once it’s uploaded.",
    embedType: "video"
  },
  {
    title: "Ryuichi Sakamoto — Fantasia",
    instrument: "Ensemble",
    year: 2024,
    context: "Princeton Pianists Ensemble · Richardson Auditorium · 5 Nov 2024",
    description:
      "A tribute to Ryuichi Sakamoto (1952–2023): a collage of his themes bridging Japanese and Western sensibilities — from The Last Emperor, Merry Christmas Mr. Lawrence, Wuthering Heights, “Andata”, The Sheltering Sky, “Blu”, “Energy Flow”, and more. Arranged by Meryl Liu ’25 and Jeffrey Xu ’27; performed with Meryl Liu, Amanda Wang ’25, Jeffrey Xu, Sean Lee ’26, and myself.",
    embedType: "video",
    embedUrl: "https://www.youtube.com/embed/Zf1AkjE_Ycc",
    watchUrl: "https://youtu.be/Zf1AkjE_Ycc"
  },
  {
    title: "Liszt — Hungarian Rhapsody No. 2 in C-sharp minor (5 pianos)",
    instrument: "Ensemble",
    year: 2024,
    context: "Princeton Pianists Ensemble · ‘Equinox’ · Lee Rehearsal Hall · 6 May 2024",
    description:
      "An arrangement of Liszt’s best-known Hungarian Rhapsody — from the brooding Lassan to the whirlwind Friska. Arranged by Kellen Cao ’26 and Bethany Mariel Suliguin ’27; performed with Kellen, Bethany, Anthony Coniglio (GS), and Bedros Maldjian ’26.",
    embedType: "video",
    embedUrl: "https://www.youtube.com/embed/raPKfUndCx0",
    watchUrl: "https://www.youtube.com/watch?v=raPKfUndCx0"
  },
  {
    title: "Debussy — La fille aux cheveux de lin & Minstrels (5 pianos)",
    instrument: "Ensemble",
    year: 2023,
    context: "Princeton Pianists Ensemble · ‘Aurora’ · Richardson Auditorium · 17 Nov 2023",
    description:
      "Two Préludes woven into one narrative: the quiet La fille aux cheveux de lin alongside the sly Minstrels, in an arrangement by Kellen Cao ’26 and Anthony Coniglio (GS). Performed with Kellen, Matthew Pickering ’24, Eddie Zhang ’24, and Milo Salvucci ’27.",
    embedType: "video",
    embedUrl: "https://www.youtube.com/embed/8uz6xK5luG4",
    watchUrl: "https://www.youtube.com/watch?v=8uz6xK5luG4"
  }
];
