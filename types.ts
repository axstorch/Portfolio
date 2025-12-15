export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  description: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  image?: string;
  imagePlaceholder?: string; // Color code for placeholder
  url?: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface LinkedInPost {
  id: string;
  title: string;
  excerpt: string;
  likes: string;
  comments: string;
  date: string;
}

export interface BTSImage {
  id: string;
  caption: string;
  aspectRatio: 'square' | 'portrait' | 'landscape';
  image?: string;
}
