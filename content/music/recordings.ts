import type { Recording } from "@/lib/types";

/**
 * Order: featured first, then roughly newest performances first.
 * Embed URLs use YouTube’s `/embed/` form for the on-site player.
 */
export const recordings: Recording[] = [
  {
    title: "Your Name (Kimi no Na wa), medley",
    instrument: "Piano",
    year: 2025,
    featured: true,
    context:
      "Princeton Pianists Ensemble · Richardson Auditorium · original arrangement (5 pianos)",
    description:
      "Makoto Shinkai’s Your Name was among the first anime films that left a lasting impression on me; the story and Radwimps’ score remain touchstones for how I think about music and narrative. I wrote this medley for Princeton Pianists Ensemble and premiered it in Richardson Auditorium. The core draws on Dream Lantern, Zenzenzense, Nandemonaiya, and Sparkle. A brief interlude from A Silent Voice sits at the center: I move to center stage and play violin while the ensemble continues on piano. Original arrangement by David H. Kwon ’27. Performed by David H. Kwon ’27 (piano and violin), Evan Lin ’28, Chloe Zhu ’27, Charlie Ku ’26, and Kellen Cao ’26 (piano).",
    embedType: "video",
    embedUrl: "https://www.youtube.com/embed/wbtmiuzAzt4",
    watchUrl: "https://youtu.be/wbtmiuzAzt4"
  },
  {
    title: "Ryuichi Sakamoto: Reflections",
    instrument: "Ensemble",
    year: 2024,
    context:
      "Princeton Pianists Ensemble · ‘Fantasia’ (Fall 2024 concert) · Richardson Auditorium · 5 Nov 2024",
    description:
      "A tribute to Ryuichi Sakamoto (1952–2023), weaving together themes that span his film and concert work, including The Last Emperor, Merry Christmas Mr. Lawrence, Wuthering Heights, Andata, The Sheltering Sky, Blu, Energy Flow, and others. The recording is titled Reflections on YouTube; Fantasia was the name of Princeton Pianists Ensemble’s Fall 2024 concert program. Arranged by Meryl Liu ’25 and Jeffrey Xu ’27. Performed by Meryl Liu, Amanda Wang ’25, Jeffrey Xu ’27, Sean Lee ’26, and David H. Kwon ’27.",
    embedType: "video",
    embedUrl: "https://www.youtube.com/embed/Zf1AkjE_Ycc",
    watchUrl: "https://youtu.be/Zf1AkjE_Ycc"
  },
  {
    title: "Liszt: Hungarian Rhapsody No. 2 in C-sharp minor (5 pianos)",
    instrument: "Ensemble",
    year: 2024,
    context: "Princeton Pianists Ensemble · ‘Equinox’ · Lee Rehearsal Hall · 6 May 2024",
    description:
      "Liszt’s Hungarian Rhapsody No. 2 in full scope, from the brooding Lassan to the whirlwind Friska, reimagined for five pianos. Arranged by Kellen Cao ’26 and Bethany Mariel Suliguin ’27. Performed by Kellen Cao ’26, Bethany Mariel Suliguin ’27, Anthony Coniglio (GS), Bedros Maldjian ’26, and David H. Kwon ’27.",
    embedType: "video",
    embedUrl: "https://www.youtube.com/embed/raPKfUndCx0",
    watchUrl: "https://www.youtube.com/watch?v=raPKfUndCx0"
  },
  {
    title: "Debussy: La fille aux cheveux de lin & Minstrels (5 pianos)",
    instrument: "Ensemble",
    year: 2023,
    context: "Princeton Pianists Ensemble · ‘Aurora’ · Richardson Auditorium · 17 Nov 2023",
    description:
      "Debussy’s La fille aux cheveux de lin and Minstrels interleaved into a single narrative. The opening is restrained and collective; later, Kellen Cao and I don jester hats and lean into broad, comic staging without losing the thread of the music. Arranged by Kellen Cao ’26 and Anthony Coniglio (GS). Performed by Kellen Cao ’26, Matthew Pickering ’24, Eddie Zhang ’24, Milo Salvucci ’27, and David H. Kwon ’27.",
    embedType: "video",
    embedUrl: "https://www.youtube.com/embed/8uz6xK5luG4",
    watchUrl: "https://www.youtube.com/watch?v=8uz6xK5luG4"
  }
];
