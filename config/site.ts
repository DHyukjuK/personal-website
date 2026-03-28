export const siteConfig = {
  name: "David H. Kwon",
  title: "David H. Kwon | ORFE Student",
  description:
    "Princeton ORFE (2027), Los Angeles. Personal site with projects, music, and other updates.",
  /** Short line for the hero eyebrow */
  tagline:
    "Princeton University · Operations Research & Financial Engineering · 2027",
  location: "Los Angeles, California",
  bio:
    "I built this site for fun. I'm a student at Princeton studying Operations Research and Financial Engineering, graduating in 2027. I'm from Los Angeles. I miss the California sunshine, but I'm slowly starting to love the East Coast too, and I love exploring New York City. Outside of schoolwork I play piano, clarinet, and violin, and I work on random side projects. Recently I've been getting a lot more into running. I wish I could dance. I still love watching and imitating K-pop dances. This past year I got into golf as well. I enjoy TV shows, movies, anime, all of that. I've been enjoying reading and want to start writing more, which is part of why I made this site, including the blog.",
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
