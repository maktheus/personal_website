import type { Experience, Project, Publication, Skill } from "@/types";

export const experiences: Experience[] = [
  {
    company: "Stone",
    role: "Software Engineer",
    period: "Oct 2024 – Present",
    location: "Remote · Brazil",
    description:
      "Building scalable B2B mobile solutions using Kotlin Multiplatform (KMP), focusing on performance, maintainability, and real-world product impact.",
    highlights: [
      "Developed cross-platform features with KMP, improving consistency across iOS and Android",
      "Delivered end-to-end features in production, collaborating with product, design, and backend teams",
      "Improved system performance through architectural and code-level optimizations",
      "Contributed to modular architecture improvements, reducing technical debt",
      "Applied AI/ML techniques integrating data-driven solutions into software systems",
    ],
    tags: ["Kotlin Multiplatform", "KMP", "iOS", "Android", "CI/CD"],
  },
  {
    company: "CESAR · Motorola",
    role: "Android Framework Engineer",
    period: "Jan 2022 – Oct 2024",
    location: "Manaus, AM",
    description:
      "Worked directly on the development, maintenance, and evolution of AOSP at the framework layer, contributing to large-scale commercial Android devices.",
    highlights: [
      "45% improvement in overall system performance, reducing user-perceived latency and jank",
      "25% reduction in crashes and ANRs through regression analysis and structural fixes",
      "20% faster response times in core framework services and components",
      "Investigated OS-level issues: animations, rendering, brightness, lifecycle, hardware integration",
      "Collaborated with global cross-functional teams (framework, hardware, System UI, QA)",
    ],
    tags: ["AOSP", "Android Framework", "Java", "C++", "HAL", "Linux Kernel"],
  },
  {
    company: "Instituto de Pesquisas Eldorado",
    role: "Embedded Android Developer",
    period: "Jan 2022 – Aug 2023",
    location: "Manaus, AM",
    description:
      "Developed and evolved AOSP with primary focus on the framework layer and camera component integration within Android systems.",
    highlights: [
      "20–30% improvement in performance for camera-related flows and system components",
      "25% reduction in crashes and ANRs in camera-intensive scenarios",
      "Integrated Android Framework with Camera HAL across different devices and sensors",
      "Resolved regressions from Android version upgrades in camera-intensive scenarios",
    ],
    tags: ["AOSP", "Camera HAL", "C", "C++", "Java", "Embedded"],
  },
  {
    company: "Universidade Federal do Amazonas",
    role: "AI Engineer · R&D Researcher",
    period: "Jan 2020 – Present",
    location: "Manaus, AM",
    description:
      "Participated in R&D projects in partnership with CESAR Institute, CETELI/UFAM, ICOMP/UFAM, Motorola, TPV, and OAB-AM, resulting in 12+ published scientific articles including IEEE events.",
    highlights: [
      "Action Recognition of Industrial Workers using Detectron2 and AutoML",
      "Anomaly Forecasting using TSMixer for industrial time-series data",
      "RAG Pipeline Optimization and Benchmarking for generative AI",
      "Assembly Time Measurement with real-time computer vision on Jetson Nano",
      "LoRaWAN Industrial Sensing Architecture with microservice data ingestion",
    ],
    tags: ["Python", "PyTorch", "Detectron2", "Jetson Nano", "RAG", "STM32", "LoRaWAN"],
  },
  {
    company: "Universidade Federal do Amazonas",
    role: "Full-stack Developer",
    period: "Jan 2021 – Dec 2021",
    location: "Manaus, AM",
    description:
      "Led end-to-end development of a new version of an internal system at SUPER/UFAM.",
    highlights: [
      "30% reduction in average page load time through component optimizations and caching",
      "20% reduction in bug rates through refactoring and automated tests",
      "25% increase in internal user satisfaction via new features and improved UX",
      "Designed scalable RESTful APIs enabling third-party integrations",
      "Established CI/CD workflow with Git for faster, reliable releases",
    ],
    tags: ["ReactJS", "TypeScript", "Material-UI", "Node.js", "REST API"],
  },
  {
    company: "COLTECH",
    role: "Full-stack Developer",
    period: "Jan 2019 – Nov 2019",
    location: "Manaus, AM",
    description:
      "Led development and maintenance of RESTful APIs building a scalable back-end architecture.",
    highlights: [
      "30% improvement in API performance by optimising server-side logic and queries",
      "Designed efficient database schemas with Prisma and Sequelize",
      "Implemented robust error handling, authentication, and security measures",
      "Contributed to CI/CD practices, improving code quality and deployment times",
    ],
    tags: ["Node.js", "TypeScript", "Express", "Prisma", "Sequelize"],
  },
];

export const projects: Project[] = [
  {
    title: "Game-concurso",
    description: "Gamified roguelike review application with E2E testing and live deployment.",
    longDescription:
      "A production-quality gamified review app built with TypeScript and Vite. Features mobile-first design, comprehensive testing strategy (unit, integration, E2E, accessibility), and is deployed live on GitHub Pages.",
    tags: ["TypeScript", "Vite", "Testing", "GitHub Pages", "Mobile-first"],
    githubUrl: "https://github.com/maktheus/Game-concurso",
    liveUrl: "https://maktheus.github.io/Game-concurso/",
    featured: true,
  },
  {
    title: "Back-End-Tcc",
    description: "Benchmark orchestration backend with 8 interconnected microservices.",
    longDescription:
      "Clean architecture with service separation: auth, registry, catalog, submission, runner, scoring, and telemetry. Includes Docker setup, API specs, and GitHub Actions CI/CD.",
    tags: ["Go", "Microservices", "Docker", "GitHub Actions", "REST API"],
    githubUrl: "https://github.com/maktheus/Back-End-Tcc",
    featured: true,
  },
  {
    title: "Water Quality App",
    description: "Cross-platform monitoring app targeting iOS, Android, Desktop, and Web.",
    longDescription:
      "Built with Kotlin and Compose Multiplatform, this app targets all major platforms from a single codebase. Includes comprehensive technical specs and design system documentation.",
    tags: ["Kotlin", "Compose Multiplatform", "iOS", "Android", "Desktop", "KMP"],
    githubUrl: "https://github.com/maktheus/Water-quality-app-composable",
    featured: true,
  },
  {
    title: "AI Studio Dashboard",
    description: "AI-powered dashboard with Google Gemini API integration.",
    longDescription:
      "A modern web dashboard built with React and TypeScript, integrating Google Gemini API for AI capabilities. Deployed on Vercel with a clean, type-safe architecture.",
    tags: ["React", "TypeScript", "Gemini API", "Vite", "Vercel"],
    githubUrl: "https://github.com/maktheus/ppge_dashboard_ufam_final",
    featured: false,
  },
];

export const publications: Publication[] = [
  {
    title: "Action and Assembly Time Measurement System of Industry Workers using Jetson Nano",
    venue: "IEEE",
    year: "2023",
    description: "Real-time computer vision system for measuring assembly time on production lines.",
  },
  {
    title: "Action Recognition of Industrial Workers using Detectron2 and AutoML Algorithms",
    venue: "IEEE",
    year: "2023",
    description: "Deep learning pipeline for classifying industrial worker actions using video datasets.",
  },
  {
    title: "Sound Pressure Level Measurement System in an Industrial Production Line using STM32 Platform",
    venue: "IEEE",
    year: "2022",
    description: "Embedded system for real-time industrial audio signal acquisition and processing.",
  },
  {
    title: "Automatic Video Labeling with Assembly Actions of Workers on a Production Line Using ResNet",
    venue: "IEEE",
    year: "2022",
    description: "Automated video annotation pipeline using deep learning for industrial workflows.",
  },
  {
    title: "RAG Pipeline Optimization and Benchmarking",
    venue: "UFAM / ICOMP",
    year: "2024",
    description: "Modular evaluation of Retrieval-Augmented Generation pipelines for generative AI quality and latency.",
  },
  {
    title: "Anomaly Forecasting using TSMixer",
    venue: "UFAM",
    year: "2024",
    description: "Predictive anomaly detection in industrial time-series sensor data.",
  },
  {
    title: "Real-Time TV Commercial Detection using ML",
    venue: "UFAM",
    year: "2023",
    description: "Audio processing pipeline for real-time commercial classification using transformers.",
  },
  {
    title: "Video Artifact Correction using UNet",
    venue: "UFAM",
    year: "2023",
    description: "Deep learning-based frame reconstruction for visual artifact correction in video.",
  },
  {
    title: "Signal Descriptor Optimization with C++",
    venue: "CETELI / UFAM",
    year: "2022",
    description: "Latency reduction in signal processing through computational efficiency improvements.",
  },
  {
    title: "Industrial Asset Modeling (AAS)",
    venue: "UFAM",
    year: "2022",
    description: "Digital asset modeling and integration for industrial IoT infrastructure.",
  },
  {
    title: "IIoT Data Server with Jetson Nano",
    venue: "UFAM",
    year: "2021",
    description: "Distributed data collection architecture for Industrial Internet of Things.",
  },
  {
    title: "LoRaWAN Industrial Sensing Architecture",
    venue: "UFAM",
    year: "2021",
    description: "Microservice-based data ingestion integrating LoRaWAN sensors with backend infrastructure.",
  },
];

export const skills: Skill[] = [
  { label: "Kotlin Multiplatform", category: "mobile" },
  { label: "Android AOSP", category: "mobile" },
  { label: "Android Framework", category: "mobile" },
  { label: "Camera HAL", category: "mobile" },
  { label: "iOS", category: "mobile" },
  { label: "AI / ML Pipelines", category: "ai" },
  { label: "RAG Systems", category: "ai" },
  { label: "Computer Vision", category: "ai" },
  { label: "PyTorch", category: "ai" },
  { label: "Detectron2", category: "ai" },
  { label: "Go", category: "backend" },
  { label: "Node.js", category: "backend" },
  { label: "TypeScript", category: "core" },
  { label: "React", category: "core" },
  { label: "Python", category: "core" },
  { label: "Java", category: "core" },
  { label: "C / C++", category: "core" },
  { label: "Kotlin", category: "core" },
  { label: "Docker", category: "tools" },
  { label: "GitHub Actions", category: "tools" },
  { label: "Microservices", category: "tools" },
  { label: "Embedded Systems", category: "tools" },
  { label: "STM32", category: "tools" },
  { label: "Jetson Nano", category: "tools" },
  { label: "LoRaWAN", category: "tools" },
  { label: "Linux Kernel", category: "tools" },
];

export const marqueeSkills = [
  "Kotlin Multiplatform",
  "Android AOSP",
  "AI / ML",
  "Go",
  "TypeScript",
  "React",
  "Python",
  "C / C++",
  "Java",
  "Computer Vision",
  "RAG Pipelines",
  "Embedded Systems",
  "Docker",
  "Microservices",
  "LoRaWAN",
  "Jetson Nano",
  "STM32",
  "Linux Kernel",
];

export const personal = {
  name: "Matheus Serrão Uchôa",
  title: "Software Engineer",
  subtitle: "KMP · Android AOSP · AI/ML Systems",
  location: "Manaus, AM — Open to remote / relocation",
  bio: "Software Engineer with 6+ years of experience in cross-platform systems, Android AOSP, and AI/ML solutions. Currently at Stone building scalable B2B products with Kotlin Multiplatform. I've contributed to 12+ published IEEE papers in partnership with CESAR Institute, CETELI/UFAM, Motorola, and TPV. I'm interested in building intelligent systems that connect real-world data with scalable architectures.",
  email: "maktheus@gmail.com",
  linkedin: "https://www.linkedin.com/in/maktheus",
  github: "https://github.com/maktheus",
};
