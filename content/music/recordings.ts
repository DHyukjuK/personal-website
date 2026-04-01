import type { Recording } from "@/lib/types";

/**
 * Performances for the music page, roughly newest first.
 * Embed URLs use YouTube's `/embed/` form for the on-site player.
 */
export const recordings: Recording[] = [
  {
    id: "your-name-medley",
    title: "Your Name (Kimi no Na wa), medley",
    instrument: "Piano",
    year: 2025,
    context:
      "Princeton Pianists Ensemble \u00b7 Richardson Auditorium \u00b7 five pianos \u00b7 original arrangement",
    description:
      "I wrote this medley for PPE and premiered it in Richardson. Mostly five pianos, but there's a stretch where I switch to violin while everyone else keeps playing. Mixed in a bit of A Silent Voice, plus Dream Lantern, Zenzenzense, Nandemonaiya, and Sparkle.",
    embedType: "video",
    embedUrl: "https://www.youtube.com/embed/wbtmiuzAzt4",
    watchUrl: "https://youtu.be/wbtmiuzAzt4"
  },
  {
    id: "sakamoto-reflections",
    title: "Ryuichi Sakamoto: Reflections",
    instrument: "Ensemble",
    year: 2024,
    context:
      "Princeton Pianists Ensemble \u00b7 Fantasia (Fall 2024) \u00b7 Richardson Auditorium",
    description:
      "A set of Sakamoto themes \u2014 The Last Emperor, Merry Christmas Mr. Lawrence, Andata, Energy Flow, and more. Meryl Liu and Jeffrey Xu arranged it, and I played in the ensemble for the November 2024 concert.",
    embedType: "video",
    embedUrl: "https://www.youtube.com/embed/Zf1AkjE_Ycc",
    watchUrl: "https://youtu.be/Zf1AkjE_Ycc"
  },
  {
    id: "liszt-hungarian-rhapsody-2",
    title: "Liszt: Hungarian Rhapsody No. 2 in C-sharp minor (5 pianos)",
    instrument: "Ensemble",
    year: 2024,
    context: "Princeton Pianists Ensemble \u00b7 Equinox \u00b7 Lee Rehearsal Hall \u00b7 May 2024",
    description:
      "Five pianos. Kellen Cao and Bethany Mariel Suliguin arranged the whole thing, from the Lassan through the Friska. We performed it for PPE's spring Equinox program.",
    embedType: "video",
    embedUrl: "https://www.youtube.com/embed/raPKfUndCx0",
    watchUrl: "https://www.youtube.com/watch?v=raPKfUndCx0"
  },
  {
    id: "debussy-fille-minstrels",
    title: "Debussy: La fille aux cheveux de lin & Minstrels (5 pianos)",
    instrument: "Ensemble",
    year: 2023,
    context: "Princeton Pianists Ensemble \u00b7 Aurora \u00b7 Richardson Auditorium \u00b7 Nov 2023",
    description:
      "Kellen Cao and Anthony Coniglio arranged La fille and Minstrels into one piece. Kellen and I wore jester hats for part of it. The staging was intentionally silly.",
    embedType: "video",
    embedUrl: "https://www.youtube.com/embed/8uz6xK5luG4",
    watchUrl: "https://www.youtube.com/watch?v=8uz6xK5luG4"
  }
];
