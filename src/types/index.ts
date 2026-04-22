export interface PortfolioData {
  about: {
    text: string;
    skills: string[];
  };
  services: Service[];
  projects: Project[];
  contact: ContactInfo;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  sortOrder?: number;
}

export interface Project {
  id: string;
  category: 'web' | 'app';
  title: string;
  techStack: string[];
  description: string;
  link: string;
  github?: string;
  preview?: string;
  featured?: boolean;
  sortOrder?: number;
}

export interface ContactInfo {
  whatsapp: string;
  email: string;
  github: string;
  youtube: string;
  instagram: string;
}