export interface Experience {
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  highlights: string[];
  tags: string[];
}

export interface Project {
  title: string;
  description: string;
  longDescription: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  featured?: boolean;
}

export interface Publication {
  title: string;
  venue: string;
  year: string;
  description?: string;
}

export interface Skill {
  label: string;
  category: "core" | "ai" | "backend" | "mobile" | "tools";
}
