export const siteConfig = {
  name: "David H. Kwon",
  title: "David H. Kwon | ORFE Student",
  description:
    "Princeton ORFE (2027), Los Angeles. Personal site with projects, music, and other updates.",
  /** Short line for the hero eyebrow */
  tagline:
    "Princeton University · Operations Research & Financial Engineering · 2027",
  location: "Los Angeles, California",
  bio: "I made this site for fun. I'm at Princeton studying ORFE and graduating in 2027. I'm from Los Angeles. I still miss the California sunshine, and I'm slowly getting used to the East Coast. I play piano, clarinet, and violin, and I spend time on personal projects outside class. I've been running more lately, along with golf, dance, and reading.",
  /** Shown next to music / YouTube mentions */
  youtubeNote:
    "Most uploads are from high school; I'm not sure how often I'll add new recordings going forward.",
  links: {
    github: "https://github.com/DHyukjuK",
    linkedin: "https://www.linkedin.com/in/davidhyukjukwon/",
    youtube: "https://www.youtube.com/@dadvidkwon"
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
