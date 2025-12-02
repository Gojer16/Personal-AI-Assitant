export const skills = {
  "AI & Intelligent Systems": [
    "LLMs & RAG",
    "LangChain / LlamaIndex",
    "Prompt Engineering",
    "Embeddings & Vector DBs",
    "AI Assistants",
    "Python",
    "Advanced NLP & Text Processing",
    "Multi-language Processing",
    "Structured Output Design",
    "AI API Integration"
  ],
  "Product Engineering": [
    "React.js",
    "Next.js",
    "TypeScript / JavaScript",
    "TailwindCSS",
    "Framer Motion",
    "Radix UI",
    "shadcn/ui",
    "Zustand"
  ],
  "System Architecture": [
    "Node.js / Express",
    "FastAPI / Flask",
    "SQL / NoSQL",
    "AWS / CI-CD / Docker",
    "Authentication & APIs",
    "Prisma / PostgreSQL",
    "Git / GitHub Actions"
  ]
};

type ResumeProject = {
  title: string;
  description: string;
  stack: string[];
  link: string;
  projectDuration?: string;
  metrics?: {
    performance?: string;
    users?: number;
  };
  learnings?: string[];
};

export const projects: ResumeProject[] = [
  {
    title: "AI Customer Interview Analyzer",
    description:
      "I developed an end-to-end AI pipeline that transforms raw transcripts into structured insights in <10 seconds, reducing manual analysis time by 95%+. Built with Next.js, TypeScript, and Google Gemini API.",
    stack: [
      "Next.js",
      "TypeScript",
      "Google Gemini API",
      "Tailwind CSS",
      "Radix UI",
      "shadcn/ui",
      "jsPDF"
    ],
    link: "/projects/ai-interview-analyzer",
    projectDuration: "1 week",
    metrics: {
      performance: "<10s analysis time",
      users: 1
    },
    learnings: [
      "LLM-powered extraction systems",
      "Multi-stage prompting strategies",
      "Inference latency optimization",
      "Structured output schema design",
      "Text preprocessing pipelines"
    ]
  },
  {
    title: "FluentMaker",
    description:
      "I built an AI-driven flashcard generator that transforms raw text into contextual learning data, supporting 14 languages with smart vocabulary extraction and LLM-powered sentence generation.",
    stack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Google Gemini API",
      "DeepSeek API",
      "Wiktionary API",
      "Zod",
      "LLMs",
      "NLP",
      "Jest",
      "React Testing Library"
    ],
    link: "/projects/fluentmaker",
    projectDuration: "3 weeks",
    metrics: {
      performance: "<10s generation time",
      users: 55
    },
    learnings: [
      "Multi-language NLP processing",
      "LLM prompt optimization",
      "Grammar-aware metadata extraction",
      "Quality-control metrics for AI output",
      "Multi-format export pipelines"
    ]
  },
  {
    title: "Elevare",
    description:
      "I created a full-stack productivity app that helps users build better habits, track progress, and achieve goals through focused task management, reflection, and gamification.",
    stack: [
      "Next.js",
      "TypeScript",
      "TailwindCSS",
      "Radix UI",
      "Framer Motion",
      "TanStack Query",
      "Zod",
      "Prisma",
      "PostgreSQL",
      "Supabase",
      "NextAuth.js",
      "Vitest",
      "Playwright",
      "Vercel Analytics",
      "PostHog",
      "Sentry"
    ],
    link: "/projects/elevare",
    projectDuration: "1 month",
    metrics: {
      performance: "95+ Lighthouse score",
      users: 14
    },
    learnings: [
      "Designed a full end-to-end product workflow from idea validation to UI/UX, architecture, and deployment.",
      "Implemented secure authentication and session management using NextAuth.js with a custom Prisma adapter.",
      "Applied TanStack Query for cache invalidation, optimistic updates, and real-time UI sync.",
      "Integrated analytics (Vercel Analytics + PostHog) to measure user behavior, feature adoption, and retention patterns.",
      "Added monitoring, logging, and error tracking with Sentry for production-grade reliability.",
      "Implemented CI/CD test pipelines using Vitest and Playwright for both unit and end-to-end testing.",
    ]
  },
  {
    title: "Room Planner Prototype",
    description:
      "I built an Ikea Kreativ-inspired 3D room design prototype using Next.js + React Three Fiber to validate rapid 3D development concepts.",
    stack: ["Next.js", "Three.js", "React Three Fiber", "TailwindCSS"],
    link: "/projects/ikea",
    projectDuration: "1 week",
    metrics: {
      performance: "60fps 3D rendering",
      users: 1
    },
    learnings: ["Three.js scene optimization", "WebGL performance tuning", "Rapid prototyping techniques"]
  }
];