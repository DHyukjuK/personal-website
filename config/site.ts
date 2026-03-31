/**
 * Canonical site URL for Open Graph and metadata (no trailing slash).
 * Set `NEXT_PUBLIC_SITE_URL` in production, e.g. https://yoursite.com
 */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) return raw.replace(/\/$/, "");
  return "http://localhost:3000";
}

export const siteConfig = {
  name: "David H. Kwon",
  title: "David H. Kwon | ORFE Student",
  description:
    "Princeton ORFE (2027). Personal site with projects, music, and other updates.",
  /** Hero + Open Graph portrait (`public/images/…`). Use PNG or JPG for photos. */
  profileImage: "/images/profile.jpg",
  /** Short line for the hero eyebrow */
  tagline:
    "Princeton University · Operations Research & Financial Engineering · 2027",
  location: "Los Angeles, California",
  /** Hero bio, split for readability */
  bioParagraphs: [
    "Princeton ORFE, class of 2027. born in New York, raised in Los Angeles. interested in AI, game theory, psychology, and more recently, philosophy.",
    "music is a big part of my life. i love kpop, jpop, r&b, and classical, and i play piano, clarinet, and violin. i also love watching kpop dance performances and dancing with friends.",
    "i watch a lot of movies, shows, and anime, and i'd love to get more into photography and filmmaking. recently i've been running more, learning golf, reading, and trying to build more side projects. this site is sort of a portfolio, sort of a journal — still figuring it out.",
    "i made this site for fun."
  ] as const,
  /** Shown next to music / YouTube mentions */
  youtubeNote:
    "Most uploads are from high school; I'm not sure how often I'll add new recordings going forward.",
  links: {
    github: "https://github.com/DHyukjuK",
    linkedin: "https://www.linkedin.com/in/davidhyukjukwon/",
    youtube: "https://www.youtube.com/@dadvidkwon",
    /** Plain address; use mailto: in links */
    email: "davidhyukju@gmail.com"
  },
  nav: [
    { href: "/", label: "Home" },
    { href: "/academics", label: "Academics" },
    { href: "/projects", label: "Projects" },
    { href: "/music", label: "Music" },
    { href: "/running", label: "Running" },
    { href: "/blog", label: "Blog" }
  ]
} as const;
