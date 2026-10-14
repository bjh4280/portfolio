export interface SkillGroup {
  category: string;
  items: string[];
}

export interface LinkItem {
  label: string;
  url: string;
}

export interface Profile {
  name: string;
  role: string;
  tagline: string;
  location: string;
  available: boolean;
  email: string;
  about: string[];
  skills: SkillGroup[];
  links: LinkItem[];
}

export interface Project {
  title: string;
  year: number;
  summary: string;
  description: string;
  stack: string[];
  url?: string;
  repo?: string;
  order: number;
}

export interface Portfolio {
  profile: Profile;
  projects: Project[];
  /** 데이터를 어디서 읽었는지 (개발 중 확인용) */
  source: "mongodb" | "sample";
}
