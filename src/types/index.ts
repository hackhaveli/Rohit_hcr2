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
}

export interface Project {
  id: string;
  title: string;
  category: 'web' | 'app';
  techStack: string[];
  description: string;
  link: string;
  github?: string;
  preview?: string;
}

export interface ContactInfo {
  whatsapp: string;
  email: string;
  github: string;
  youtube: string;
  instagram: string;
}