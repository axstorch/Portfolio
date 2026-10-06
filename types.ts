export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  /** Bullet label, rendered bold at the start of the first bullet. */
  label?: string;
  description: string[];
  /** Optional logo shown beside the company name. */
  logo?: string;
  /** Older roles collapse behind a toggle. */
  collapsed?: boolean;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  image?: string;
  url?: string;
  linkLabel?: string;
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
  likes: number;
  comments: number;
  date: string;
  image?: string;
  url: string;
}

export interface BTSImage {
  id: string;
  caption: string;
  alt: string;
  aspectRatio: 'square' | 'portrait' | 'landscape';
  image?: string;
}

/** A single metric tile in the proof strip under the hero. */
export interface ProofStat {
  id: string;
  value: string;
  context: string;
  label: string;
}

/** A card in Selected Work. Links through to its own case study page. */
export interface WorkCard {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  /** Short italic outcome line shown under the description. */
  outcome: string;
  tags: string[];
  /** Path to the case study page, e.g. /work/newme */
  href: string;
  /** Diagram or chart from the work itself. */
  image?: string;
  imageAlt: string;
  /** Label used when no image has been supplied yet. */
  imageSlotLabel: string;
  /** Marks the piece as interview work rather than employment. */
  badge?: string;
}

export interface AlsoBuiltItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

export interface CaseStudySection {
  heading: string;
  body: string;
}

export interface Deliverable {
  src?: string;
  alt: string;
  caption: string;
  /** Label shown when the file has not been added yet. */
  slotLabel?: string;
  /** External document this deliverable came from, linked from the caption. */
  href?: string;
}

export interface CaseStudyPage {
  slug: string;
  title: string;
  summary: string;
  role: string;
  type: string;
  /** Empty when the source document does not state a date. */
  date: string;
  sections: CaseStudySection[];
  deliverables: Deliverable[];
  /** Link to the full PRD or deck. */
  deckUrl?: string;
  deckLabel?: string;
}

export interface CertificationItem {
  title: string;
  issuer: string;
  url: string;
}

export interface FunnelStage {
  label: string;
  percent: number;
  note: string;
}

export interface TrayaInsight {
  n: number;
  theme: string;
  title: string;
  problem: string;
  solution: string[];
  effort: 'Low' | 'Medium' | 'High';
  impact: 'Low' | 'Medium' | 'High' | 'Very High';
  priority: 'P1' | 'P2';
}

export interface RoadmapMonth {
  month: string;
  title: string;
  items: string[];
}
