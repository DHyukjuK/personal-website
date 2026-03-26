/**
 * Courses grouped for display; edit as you register for new ones.
 * High school kept light on purpose.
 */

export const princetonOverview = {
  minors: ["computer science", "statistics and machine learning"],
  graduationYear: 2027,
  classYear: "junior"
} as const;

export type CourseEntry = {
  code: string;
  title: string;
};

export type CourseGroup = {
  label: string;
  courses: CourseEntry[];
};

export const courseGroups: CourseGroup[] = [
  {
    label: "orfe, stats & ml",
    courses: [
      { code: "ORF245", title: "Fundamentals of Statistics" },
      { code: "ORF307", title: "Optimization" },
      { code: "ORF309", title: "Probability and Stochastic Systems" },
      { code: "ORF335", title: "Financial Mathematics" },
      { code: "ORF387", title: "Networks" },
      { code: "ORF405", title: "Regression and Applied Time Series" },
      { code: "ORF418", title: "Optimal Learning" },
      { code: "SML301", title: "Modern Data Science Methods" }
    ]
  },
  {
    label: "cs & machine learning",
    courses: [
      { code: "COS226", title: "Algorithms and Data Structures" },
      { code: "COS324", title: "Introduction to Machine Learning" }
    ]
  },
  {
    label: "math, physics & engineering",
    courses: [
      { code: "MAT201", title: "Multivariable Calculus" },
      { code: "MAT202", title: "Linear Algebra" },
      { code: "EGR151", title: "Physics: Mechanics" },
      { code: "EGR153", title: "Physics: Electricity, Magnetism, and Photonics" }
    ]
  },
  {
    label: "econ & other",
    courses: [
      { code: "ECO101", title: "Macroeconomics" },
      { code: "ECO332", title: "Economics of Health and Health Care" },
      { code: "ECO362", title: "Financial Investments" },
      { code: "NEU200", title: "Functional Neuroanatomy" },
      { code: "PSY360", title: "Computational Models of Cognition" },
      { code: "ECE473", title: "Elements of Decentralized Finance" }
    ]
  }
];

