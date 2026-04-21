import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  ExternalLink, Github, Monitor, Smartphone, Eye, X,
  ChevronLeft, ChevronRight, Globe, Layers,
} from 'lucide-react';
import { PortfolioData } from '../../types';

interface ProjectsProps {
  data: PortfolioData;
}

type Filter = 'all' | 'web' | 'app';

const techColors: Record<string, string> = {
  'Next.js':             'bg-white/10 text-white border-white/20',
  'React.js':            'bg-[#61DAFB]/10 text-[#61DAFB] border-[#61DAFB]/30',
  'React Native':        'bg-[#61DAFB]/10 text-[#61DAFB] border-[#61DAFB]/30',
  'WordPress':           'bg-[#21759B]/20 text-[#5db9d9] border-[#21759B]/40',
  'Framer':              'bg-purple-500/10 text-purple-400 border-purple-500/30',
  'Expo':                'bg-gray-400/10 text-gray-300 border-gray-400/30',
  'TypeScript':          'bg-blue-500/10 text-blue-400 border-blue-500/30',
  'Node.js':             'bg-green-500/10 text-green-400 border-green-500/30',
  'MongoDB':             'bg-green-700/10 text-green-500 border-green-700/30',
  'Python':              'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  'HTML':                'bg-orange-500/10 text-orange-400 border-orange-500/30',
  'CSS':                 'bg-blue-400/10 text-blue-300 border-blue-400/30',
  'JavaScript':          'bg-yellow-400/10 text-yellow-300 border-yellow-400/30',
  'Custom Backend':      'bg-[#22c825]/10 text-[#22c825] border-[#22c825]/30',
  'Payment Integration': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
};
const getTechColor = (tech: string) =>
  techColors[tech] ?? 'bg-[#22c825]/10 text-[#22c825] border-[#22c825]/30';

/* ─── Preview Modal ─────────────────────────────────────────────────────── */
interface ModalProps {
  project: PortfolioData['projects'][0];
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

const PreviewModal: React.FC<ModalProps> = ({ project, onClose, onPrev, onNext, hasPrev, hasNext }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const isApp = project.category === 'app';

  // keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && hasNext) onNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [hasPrev, hasNext, onClose, onPrev, onNext]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(12px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-[#0d0d0d] rounded-2xl border border-[#22c825]/30 shadow-2xl overflow-hidden"
        style={{ boxShadow: '0 0 80px rgba(34,200,37,0.08)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <span className={`p-1.5 rounded-lg ${isApp ? 'bg-[#61DAFB]/10' : 'bg-[#22c825]/10'}`}>
              {isApp
                ? <Smartphone className="h-4 w-4 text-[#61DAFB]" />
                : <Globe className="h-4 w-4 text-[#22c825]" />}
            </span>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">{project.title}</h3>
              <p className="text-gray-500 text-xs truncate max-w-xs">{project.link}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:border-white/25 transition-all text-xs">
                <Github className="h-3.5 w-3.5" /> Code
              </a>
            )}
            <a href={project.link} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#22c825]/15 border border-[#22c825]/35 text-[#22c825] hover:bg-[#22c825]/25 transition-all text-xs">
              <ExternalLink className="h-3.5 w-3.5" /> Open
            </a>
            <button onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-500 hover:text-white hover:bg-white/10 transition-all">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="relative bg-[#060606] overflow-hidden" style={{ minHeight: 440 }}>
          {project.preview && !imgError ? (
            <>
              {!imgLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gray-600">
                  <div className="w-8 h-8 border-2 border-[#22c825] border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs">Loading preview…</span>
                </div>
              )}
              {/* fake browser bar */}
              <div className="absolute top-0 left-0 right-0 z-10 flex items-center gap-2 px-4 py-2
                              bg-[#111]/80 backdrop-blur-sm border-b border-white/5 pointer-events-none">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
                <div className="flex-1 mx-3 bg-white/5 rounded text-gray-600 text-[11px] px-2 py-0.5 truncate">
                  {project.link}
                </div>
              </div>
              <img
                src={project.preview}
                alt={`${project.title} preview`}
                className={`w-full object-cover object-top pt-9 transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                style={{ maxHeight: 520 }}
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgError(true)}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 py-24 text-gray-600">
              {isApp
                ? <Smartphone className="h-16 w-16 text-[#61DAFB]/25" />
                : <Monitor className="h-16 w-16 text-[#22c825]/25" />}
              <p className="text-sm text-gray-600">
                {isApp ? 'Mobile app — no browser preview' : 'Preview unavailable'}
              </p>
              <a href={project.link} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2 bg-[#22c825] text-[#040404] rounded-lg font-semibold text-sm hover:bg-[#1ea01f] transition-all">
                <ExternalLink className="h-4 w-4" />
                {isApp ? 'Download / View on GitHub' : 'Open Live Site'}
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.map((t) => (
              <span key={t} className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${getTechColor(t)}`}>{t}</span>
            ))}
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-4">
            <button onClick={onPrev} disabled={!hasPrev}
              className="p-1.5 rounded-lg border border-white/10 text-gray-500 hover:text-white hover:border-white/25 disabled:opacity-25 disabled:cursor-not-allowed transition-all">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={onNext} disabled={!hasNext}
              className="p-1.5 rounded-lg border border-white/10 text-gray-500 hover:text-white hover:border-white/25 disabled:opacity-25 disabled:cursor-not-allowed transition-all">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Project Card ──────────────────────────────────────────────────────── */
const ProjectCard: React.FC<{
  project: PortfolioData['projects'][0];
  onPreview: () => void;
  style?: React.CSSProperties;
}> = ({ project, onPreview, style }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError]   = useState(false);
  const isApp = project.category === 'app';

  return (
    <div
      className="group relative bg-gradient-to-b from-[#111] to-[#0a0a0a] rounded-2xl border border-white/5
                 hover:border-[#22c825]/40 transition-all duration-500 overflow-hidden cursor-pointer"
      style={{ ...style, transition: 'transform 0.4s cubic-bezier(.22,1,.36,1), box-shadow 0.4s ease, border-color 0.3s' }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-5px)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 48px rgba(34,200,37,0.1)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
      onClick={onPreview}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden" style={{ height: 180, background: '#080808' }}>
        {project.preview && !imgError ? (
          <>
            {!imgLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-[#22c825]/40 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <img
              src={project.preview}
              alt={`${project.title} screenshot`}
              loading="lazy"
              className={`w-full h-full object-cover object-top transition-all duration-700 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
            />
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            {isApp
              ? <Smartphone className="h-10 w-10 text-[#61DAFB]/25" />
              : <Monitor className="h-10 w-10 text-[#22c825]/25" />}
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-70 pointer-events-none" />

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
          <div className="flex items-center gap-2 px-4 py-2 bg-[#22c825] text-[#040404] rounded-full font-semibold text-sm shadow-lg">
            <Eye className="h-4 w-4" /> Preview
          </div>
        </div>

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border
            ${isApp
              ? 'bg-[#61DAFB]/10 text-[#61DAFB] border-[#61DAFB]/25'
              : 'bg-[#22c825]/10 text-[#22c825] border-[#22c825]/25'}`}>
            {isApp ? <Smartphone className="h-2.5 w-2.5" /> : <Globe className="h-2.5 w-2.5" />}
            {isApp ? 'App' : 'Web'}
          </span>
        </div>

        {/* icon buttons */}
        <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-lg bg-black/60 border border-white/10 text-gray-400 hover:text-white transition-all">
              <Github className="h-3.5 w-3.5" />
            </a>
          )}
          <a href={project.link} target="_blank" rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded-lg bg-black/60 border border-white/10 text-gray-400 hover:text-[#22c825] transition-all">
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-2.5">
        <h3 className="text-sm font-bold text-[#c9c1c0] group-hover:text-[#22c825] transition-colors duration-300 truncate">
          {project.title}
        </h3>
        <p className="text-gray-600 text-[11px] leading-relaxed line-clamp-2">{project.description}</p>
        <div className="flex flex-wrap gap-1">
          {project.techStack.map((t) => (
            <span key={t} className={`px-2 py-0.5 rounded-full text-[9px] font-medium border ${getTechColor(t)}`}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── Filter Pill ───────────────────────────────────────────────────────── */
const filterOptions: { value: Filter; label: string; icon: React.ReactNode }[] = [
  { value: 'all',  label: 'All Projects', icon: <Layers className="h-3.5 w-3.5" /> },
  { value: 'web',  label: 'Web',          icon: <Globe className="h-3.5 w-3.5" /> },
  { value: 'app',  label: 'Mobile Apps',  icon: <Smartphone className="h-3.5 w-3.5" /> },
];

/* ─── Main Section ──────────────────────────────────────────────────────── */
const Projects: React.FC<ProjectsProps> = ({ data }) => {
  const [filter, setFilter]       = useState<Filter>('all');
  const [prevFilter, setPrevFilter] = useState<Filter>('all');
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [animating, setAnimating]   = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () => filter === 'all' ? data.projects : data.projects.filter((p) => p.category === filter),
    [filter, data.projects],
  );

  // The modal navigates within the *filtered* list
  const closeModal = () => setModalIndex(null);
  const prevProject = () => setModalIndex((i) => (i !== null && i > 0 ? i - 1 : i));
  const nextProject = () => setModalIndex((i) => (i !== null && i < filtered.length - 1 ? i + 1 : i));

  const handleFilterChange = (next: Filter) => {
    if (next === filter || animating) return;
    setPrevFilter(filter);
    setAnimating(true);
    // fade out
    if (gridRef.current) {
      gridRef.current.style.opacity = '0';
      gridRef.current.style.transform = 'translateY(10px)';
    }
    setTimeout(() => {
      setFilter(next);
      if (gridRef.current) {
        gridRef.current.style.transition = 'none';
        gridRef.current.style.opacity = '0';
        gridRef.current.style.transform = 'translateY(10px)';
      }
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (gridRef.current) {
            gridRef.current.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
            gridRef.current.style.opacity = '1';
            gridRef.current.style.transform = 'translateY(0)';
          }
          setAnimating(false);
        });
      });
    }, 250);
  };

  const webCount = data.projects.filter((p) => p.category === 'web').length;
  const appCount = data.projects.filter((p) => p.category === 'app').length;

  return (
    <>
      <section id="projects" className="py-24 bg-gradient-to-br from-[#0a0a0a] to-[#040404] relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-[#22c825]/3 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-[#22c825]/2 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

          {/* Section header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#22c825]/10 border border-[#22c825]/20 text-[#22c825] text-xs font-semibold mb-5 uppercase tracking-wider">
              <Monitor className="h-3.5 w-3.5" /> Featured Work
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
              My <span className="text-[#22c825]">Projects</span>
            </h2>
            <div className="w-14 h-1 bg-gradient-to-r from-[#22c825] to-[#1ea01f] mx-auto rounded-full" />
            <p className="text-gray-500 mt-5 text-base max-w-xl mx-auto">
              Click any card to preview the live site — use the filter to explore by type
            </p>
          </div>

          {/* ── Filter pills ── */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {/* sliding pill background */}
            <div className="relative flex items-center p-1 rounded-xl bg-[#111] border border-white/8">
              {filterOptions.map(({ value, label, icon }) => {
                const count = value === 'all' ? data.projects.length : value === 'web' ? webCount : appCount;
                const active = filter === value;
                return (
                  <button
                    key={value}
                    id={`filter-${value}`}
                    onClick={() => handleFilterChange(value)}
                    className={`relative flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      active
                        ? 'bg-[#22c825] text-[#040404] shadow-lg shadow-[#22c825]/20'
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {icon}
                    {label}
                    <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full font-bold transition-colors ${
                      active ? 'bg-[#040404]/20 text-[#040404]' : 'bg-white/8 text-gray-600'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Grid ── */}
          <div
            ref={gridRef}
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            style={{ transition: 'opacity 0.25s ease, transform 0.25s ease' }}
          >
            {filtered.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                onPreview={() => setModalIndex(i)}
                style={{ animationDelay: `${i * 40}ms` }}
              />
            ))}
          </div>

          {/* Stats */}
          <div className="mt-16 flex flex-wrap justify-center gap-6">
            {[
              { label: 'Web Projects', value: `${webCount}+`, color: 'text-[#22c825]' },
              { label: 'Mobile Apps',  value: `${appCount}+`, color: 'text-[#61DAFB]' },
              { label: 'Happy Clients', value: '12+',        color: 'text-purple-400' },
              { label: 'Tech Stacks',   value: '8+',         color: 'text-yellow-400' },
            ].map((s) => (
              <div key={s.label} className="px-6 py-4 rounded-xl bg-[#0f0f0f] border border-white/5 text-center min-w-[120px]">
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-[11px] text-gray-600 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {modalIndex !== null && (
        <PreviewModal
          project={filtered[modalIndex]}
          onClose={closeModal}
          onPrev={prevProject}
          onNext={nextProject}
          hasPrev={modalIndex > 0}
          hasNext={modalIndex < filtered.length - 1}
        />
      )}
    </>
  );
};

export default Projects;