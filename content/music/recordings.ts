import type { Recording } from "@/lib/types";

/**
 * Performances for the music page, roughly newest first.
 * Embed URLs use YouTube’s `/embed/` form for the on-site player.
 */
export const recordings: Recording[] = [
  {
    id: "your-name-medley",
    title: "Your Name (Kimi no Na wa), medley",
    instrument: "Piano",
    year: 2025,
    context:
      "Princeton Pianists Ensemble · Richardson Auditorium · five pianos · original arrangement",
    description:
      "Your Name was one of the first films that really stayed with me, and I still go back to Radwimps’ score a lot. I wrote this medley for PPE and premiered it in Richardson. It’s mostly five pianos, but there’s a stretch where I move to center stage on violin while everyone else keeps playing. Midway I tucked in a bit of A Silent Voice, then wove in Dream Lantern, Zenzenzense, Nandemonaiya, and Sparkle around it.",
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
      "Princeton Pianists Ensemble · Fantasia (Fall 2024) · Richardson Auditorium",
    description:
      "A small tribute after Sakamoto died. I’ve never quite known how to label his work; it moves between film scores and concert music without sitting neatly in either box. This set pulls together themes from The Last Emperor, Merry Christmas Mr. Lawrence, Andata, Energy Flow, and more. Meryl Liu and Jeffrey Xu arranged it, and I played in the ensemble for our November 2024 concert.",
    embedType: "video",
    embedUrl: "https://www.youtube.com/embed/Zf1AkjE_Ycc",
    watchUrl: "https://youtu.be/Zf1AkjE_Ycc"
  },
  {
    id: "liszt-hungarian-rhapsody-2",
    title: "Liszt: Hungarian Rhapsody No. 2 in C-sharp minor (5 pianos)",
    instrument: "Ensemble",
    year: 2024,
    context: "Princeton Pianists Ensemble · Equinox · Lee Rehearsal Hall · May 2024",
    description:
      "The Second Rhapsody is already a lot on one piano; on five it starts to feel almost orchestral. Kellen Cao and Bethany Mariel Suliguin arranged the whole arc, from the slow Lassan through the wild Friska. We performed it for PPE’s spring Equinox program.",
    embedType: "video",
    embedUrl: "https://www.youtube.com/embed/raPKfUndCx0",
    watchUrl: "https://www.youtube.com/watch?v=raPKfUndCx0"
  },
  {
    id: "debussy-fille-minstrels",
    title: "Debussy: La fille aux cheveux de lin & Minstrels (5 pianos)",
    instrument: "Ensemble",
    year: 2023,
    context: "Princeton Pianists Ensemble · Aurora · Richardson Auditorium · Nov 2023",
    description:
      "La fille and Minstrels aren’t an obvious pair, but Kellen Cao and Anthony Coniglio folded them into one line. It starts quiet and collective, then loosens into something more theatrical. Kellen and I wore jester hats for part of it. The staging is intentionally silly, but the Debussy is still what matters.",
    embedType: "video",
    embedUrl: "https://www.youtube.com/embed/8uz6xK5luG4",
    watchUrl: "https://www.youtube.com/watch?v=8uz6xK5luG4"
  }
];
