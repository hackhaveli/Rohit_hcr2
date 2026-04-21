import { PortfolioData } from '../types';

export const initialPortfolioData: PortfolioData = {
  about: {
    text: "Hey, I'm Rohit Sharma (Coderrohit). Based in Delhi, my web development journey started in 8th grade. Fascinated by hacker movies, I discovered web programming and turned that curiosity into a passion for creating digital experiences.",
    skills: [
      "React", "Next.js", "React Native", "Node.js", "TypeScript",
      "Python", "Flask", "MongoDB",
      "Git", "Figma", "WordPress",
      "Web Scraping", "Firebase", "SaaS Development",
      "SEO Optimization", "UI/UX Design", "Automation Scripting",
      "Linux",
    ],
  },
  services: [
    {
      id: "web-dev",
      title: "Web Development",
      description: "Creating responsive, modern websites and web applications using cutting-edge technologies.",
      icon: "Globe",
    },
    {
      id: "app-dev",
      title: "App Development",
      description: "Building cross-platform mobile applications with seamless user experiences.",
      icon: "Smartphone",
    },
    {
      id: "security",
      title: "Security & Networking",
      description: "Specialized in network security, penetration testing, and cybersecurity solutions.",
      icon: "Shield",
    },
  ],
  projects: [
    // ── WEB PROJECTS ─────────────────────────────────────────────────────────
    {
      id: "web-1",
      category: "web",
      title: "Wall of Gardens",
      techStack: ["WordPress"],
      description: "A company website focused on vertical gardening, landscaping, and terrace gardening.",
      link: "https://wallofgardens.com",
      preview: "https://api.microlink.io/?url=https://wallofgardens.com&screenshot=true&meta=false&embed=screenshot.url",
    },
    {
      id: "web-2",
      category: "web",
      title: "Lara Loves Phoenix",
      techStack: ["Next.js"],
      description: "A lifestyle & travel blog built with Next.js featuring stunning photography and editorial content.",
      link: "https://www.laralovesphoenix.com/",
      github: "https://github.com/hackhaveli/larachapowns",
      preview: "https://api.microlink.io/?url=https://www.laralovesphoenix.com/&screenshot=true&meta=false&embed=screenshot.url",
    },
    {
      id: "web-3",
      category: "web",
      title: "Orange Door Investment Group",
      techStack: ["Next.js"],
      description: "A professional real estate investment firm website with modern design and property showcase.",
      link: "https://orangedoorinvestmentgroup.com/",
      github: "https://github.com/hackhaveli/OrangeDoorUpdated",
      preview: "https://api.microlink.io/?url=https://orangedoorinvestmentgroup.com/&screenshot=true&meta=false&embed=screenshot.url",
    },
    {
      id: "web-4",
      category: "web",
      title: "Rebel Up",
      techStack: ["Framer"],
      description: "A SMMA (Social Media Marketing Agency) website built with Framer.",
      link: "https://rebel-up.vercel.app/",
      github: "https://github.com/hackhaveli/RebelUp",
      preview: "https://api.microlink.io/?url=https://rebel-up.vercel.app/&screenshot=true&meta=false&embed=screenshot.url",
    },
    {
      id: "web-5",
      category: "web",
      title: "WebKarigar",
      techStack: ["Next.js", "Custom Backend", "Payment Integration"],
      description: "A SaaS platform for local businesses with Next.js frontend, custom backend, and payment integration.",
      link: "https://webkarigar.vercel.app",
      github: "https://github.com/hackhaveli/WebKarigar",
      preview: "https://api.microlink.io/?url=https://webkarigar.vercel.app&screenshot=true&meta=false&embed=screenshot.url",
    },
    {
      id: "web-6",
      category: "web",
      title: "Page3 Shadisaga Wedding",
      techStack: ["WordPress"],
      description: "An event organization and wedding planning website built with WordPress.",
      link: "https://page3shadisagawedding.com",
      preview: "https://api.microlink.io/?url=https://page3shadisagawedding.com&screenshot=true&meta=false&embed=screenshot.url",
    },
    {
      id: "web-7",
      category: "web",
      title: "Tushar Pant PMT Classes",
      techStack: ["WordPress"],
      description: "A coaching institute website for PMT / medical entrance preparation, built with WordPress.",
      link: "https://tusharpantpmtclasses.in",
      preview: "https://api.microlink.io/?url=https://tusharpantpmtclasses.in&screenshot=true&meta=false&embed=screenshot.url",
    },
    {
      id: "web-8",
      category: "web",
      title: "BTrader",
      techStack: ["Next.js"],
      description: "A modern trading platform targeted at helping solo traders manage and grow their portfolios.",
      link: "https://btrader.vercel.app/",
      github: "https://github.com/hackhaveli/B-trader",
      preview: "https://api.microlink.io/?url=https://btrader.vercel.app/&screenshot=true&meta=false&embed=screenshot.url",
    },
    {
      id: "web-9",
      category: "web",
      title: "Total Tobacco & Vape",
      techStack: ["WordPress"],
      description: "An e-commerce store for tobacco and vape products with full product catalog and ordering system.",
      link: "https://totaltobaccoandvape.com/",
      preview: "https://api.microlink.io/?url=https://totaltobaccoandvape.com/&screenshot=true&meta=false&embed=screenshot.url",
    },
    {
      id: "web-10",
      category: "web",
      title: "Introcate",
      techStack: ["Next.js"],
      description: "A SMMA (Social Media Marketing Agency) website built with Next.js.",
      link: "https://introcate.co/",
      github: "https://github.com/hackhaveli/Introcate",
      preview: "https://api.microlink.io/?url=https://introcate.co/&screenshot=true&meta=false&embed=screenshot.url",
    },

    // ── APP PROJECTS ──────────────────────────────────────────────────────────
    {
      id: "app-1",
      category: "app",
      title: "YouHub — App Downloader",
      techStack: ["React Native", "Expo"],
      description: "Browse and download premium apps across categories with a modern UI and preview feature.",
      link: "https://www.mediafire.com/file/451i03ahpyzw20n/YouHub.apk/file",
      github: "https://github.com/hackhaveli/youhub",
    },
    {
      id: "app-2",
      category: "app",
      title: "Mountain Spring Wellness",
      techStack: ["React Native", "Expo"],
      description: "A mobile wellness app focused on hydration reminders, habit tracking, and a clean minimalist UI.",
      link: "https://github.com/hackhaveli/Well-app",
      github: "https://github.com/hackhaveli/Well-app",
    },
    {
      id: "app-3",
      category: "app",
      title: "SaveRide",
      techStack: ["React Native", "Expo"],
      description: "A ride-sharing safety app that allows users to save and share their trips with trusted contacts.",
      link: "https://github.com/hackhaveli/SaveRideApp",
      github: "https://github.com/hackhaveli/SaveRideApp",
    },
    {
      id: "app-4",
      category: "app",
      title: "Real Estate Mobile App",
      techStack: ["React Native", "Expo"],
      description: "A property listing and search app with filters, map integration, and detailed property views.",
      link: "https://github.com/hackhaveli/real-state-mobile-app",
      github: "https://github.com/hackhaveli/real-state-mobile-app",
    },
  ],
  contact: {
    whatsapp: "https://wa.me/+919311459543",
    email: "mailto:coderrohit2927@gmail.com",
    github: "https://github.com/hackhaveli",
    youtube: "https://www.youtube.com/@codewithrohit2927",
    instagram: "https://instagram.com/rohit.env",
  },
};

// Simple storage functions
export const getPortfolioData = (): PortfolioData => {
  const stored = localStorage.getItem('portfolioData');
  return stored ? JSON.parse(stored) : initialPortfolioData;
};

export const savePortfolioData = (data: PortfolioData): void => {
  localStorage.setItem('portfolioData', JSON.stringify(data));
};
