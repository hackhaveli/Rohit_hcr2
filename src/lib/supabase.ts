import { createClient } from '@supabase/supabase-js';
import type { PortfolioData, Project, Service } from '../types';

const SUPABASE_URL = 'https://xnxtcllufxvtdtgormfg.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhueHRjbGx1Znh2dGR0Z29ybWZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3NjY2MDAsImV4cCI6MjA5MjM0MjYwMH0.tVogYCVy2pftuFbO_niZ5vP9SIMEpyyFpvMOP92SLXQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ── helpers ── */

function dbRowToProject(row: any): Project {
  return {
    id: row.id,
    category: row.category,
    title: row.title,
    description: row.description,
    techStack: row.tech_stack,
    link: row.link,
    github: row.github ?? undefined,
    preview: row.preview ?? undefined,
    featured: row.featured,
    sortOrder: row.sort_order,
  };
}

function dbRowToService(row: any): Service {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    icon: row.icon,
  };
}

export async function fetchPortfolioData(): Promise<PortfolioData> {
  const [configRes, servicesRes, projectsRes] = await Promise.all([
    supabase.from('portfolio_config').select('*').single(),
    supabase.from('services').select('*').order('sort_order'),
    // Fetch all projects ordered by sort_order; we sort web→app client-side
    supabase.from('projects').select('*').order('sort_order', { ascending: true }),
  ]);

  if (configRes.error) throw configRes.error;
  if (servicesRes.error) throw servicesRes.error;
  if (projectsRes.error) throw projectsRes.error;

  const cfg = configRes.data;
  const allProjects = (projectsRes.data ?? []).map(dbRowToProject);

  // Web projects first (sorted by sort_order), then app projects (sorted by sort_order)
  const webProjects = allProjects.filter((p) => p.category === 'web');
  const appProjects = allProjects.filter((p) => p.category === 'app');

  return {
    about: { text: cfg.about_text, skills: cfg.skills ?? [] },
    services: (servicesRes.data ?? []).map(dbRowToService),
    projects: [...webProjects, ...appProjects],
    contact: {
      whatsapp: cfg.contact_whatsapp,
      email: cfg.contact_email,
      github: cfg.contact_github,
      youtube: cfg.contact_youtube,
      instagram: cfg.contact_instagram,
    },
  };
}

/* ── Admin write helpers ── */

export async function saveConfig(data: PortfolioData) {
  const { error } = await supabase
    .from('portfolio_config')
    .update({
      about_text: data.about.text,
      skills: data.about.skills,
      contact_whatsapp: data.contact.whatsapp,
      contact_email: data.contact.email,
      contact_github: data.contact.github,
      contact_youtube: data.contact.youtube,
      contact_instagram: data.contact.instagram,
      updated_at: new Date().toISOString(),
    })
    .neq('id', '00000000-0000-0000-0000-000000000000'); // update all rows

  if (error) throw error;
}

export async function upsertProject(project: Project) {
  const { error } = await supabase.from('projects').upsert({
    id: project.id,
    category: project.category,
    title: project.title,
    description: project.description,
    tech_stack: project.techStack,
    link: project.link,
    github: project.github ?? null,
    preview: project.preview ?? null,
    featured: project.featured ?? false,
    sort_order: project.sortOrder ?? 0,
  });
  if (error) throw error;
}

export async function deleteProject(id: string) {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
}

export async function upsertService(service: Service & { sortOrder?: number }) {
  const { error } = await supabase.from('services').upsert({
    id: service.id,
    title: service.title,
    description: service.description,
    icon: service.icon,
    sort_order: service.sortOrder ?? 0,
  });
  if (error) throw error;
}

export async function deleteService(id: string) {
  const { error } = await supabase.from('services').delete().eq('id', id);
  if (error) throw error;
}
