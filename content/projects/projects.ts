import type { Project } from "@/lib/types";

/**
 * Resume projects (Feb 2026). Newer work first; crypto (Apr 2025) last.
 * Report links match resume PDF.
 */
export const projects: Project[] = [
  {
    title:
      "Predicting trip duration & tip yield (NYC yellow & green taxi data)",
    description:
      "Compared random forest and neural network models on structured NYC trip data to predict duration and tipping, handling heavy skew and extremes. Trip distance dominated duration prediction; tip classification stayed strong.",
    tech: ["Python", "scikit-learn", "pandas"],
    reportUrl:
      "https://drive.google.com/file/d/1nhJM7D4QvhghyeqtHIBNNN4ftXW_PFmD/view?usp=sharing"
  },
  {
    title:
      "Dynamics of self-disclosure: timing, reciprocity, and trust in conversation",
    description:
      "Game-theoretic view of conversation as a repeated game, with 450 turn-level observations across 30 dialogues. Personal disclosure rose with reciprocity and adaptive trust over time.",
    tech: ["Python"],
    reportUrl:
      "https://drive.google.com/file/d/1Ca7pDNzxi74Q9hprwH0dQRVekz9eUxBa/view?usp=sharing"
  },
  {
    title: "From tweets to trades: sentiment-driven crypto allocation",
    description:
      "Reddit sentiment features to forecast next-day SHIB returns with an LSTM, then a Markowitz-style layer to choose SHIB–USDC weights from risk aversion, forecasts, and volatility.",
    tech: ["Python"],
    repoUrl: "https://github.com/DHyukjuK/5sigma-Memecoins"
  }
];
