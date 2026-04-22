import React, { useState, useEffect } from 'react';
import {
  Eye, EyeOff, Save, Plus, Trash2, ArrowLeft, ArrowUp, ArrowDown,
  Globe, Smartphone, Shield, LayoutDashboard, FolderOpen,
  Wrench, Phone, RefreshCw, CheckCircle, XCircle, Loader2,
  ExternalLink, Github,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PortfolioData, Service, Project } from '../types';
import {
  fetchPortfolioData, saveConfig, upsertProject, deleteProject,
  upsertService, deleteService,
} from '../lib/supabase';

const ADMIN_PASSWORD = 'Rohit@2927';

type Tab = 'overview' | 'about' | 'projects' | 'services' | 'contact';
type SaveState = 'idle' | 'saving' | 'saved' | 'error';

/* ── small helpers ── */
const iconMap: Record<string, React.ReactNode> = {
  Globe: <Globe className="h-4 w-4" />,
  Smartphone: <Smartphone className="h-4 w-4" />,
  Shield: <Shield className="h-4 w-4" />,
};

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
  <div>
    <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
    <input {...props}
      className="w-full bg-[#0a0a0a] border border-white/8 rounded-lg px-3 py-2 text-sm text-[#c9c1c0] placeholder-gray-600 focus:border-[#22c825]/50 focus:outline-none transition-colors" />
  </div>
);

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, ...props }) => (
  <div>
    <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
    <textarea {...props}
      className="w-full bg-[#0a0a0a] border border-white/8 rounded-lg px-3 py-2 text-sm text-[#c9c1c0] placeholder-gray-600 focus:border-[#22c825]/50 focus:outline-none transition-colors resize-none" />
  </div>
);

/* ── Login ── */
const LoginScreen: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState(false);

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) { onLogin(); } else { setErr(true); setTimeout(() => setErr(false), 2000); }
  };

  return (
    <div className="min-h-screen bg-[#040404] flex items-center justify-center">
      <div className="bg-[#0a0a0a] p-8 rounded-2xl border border-[#22c825]/20 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-[#22c825]/10 border border-[#22c825]/20 flex items-center justify-center mx-auto mb-4">
            <LayoutDashboard className="h-7 w-7 text-[#22c825]" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-gray-500 text-sm mt-1">Portfolio control center</p>
        </div>
        <form onSubmit={handle} className="space-y-5">
          <div className="relative">
            <input type={show ? 'text' : 'password'} value={pw} onChange={(e) => setPw(e.target.value)}
              placeholder="Admin password"
              className={`w-full bg-[#060606] border rounded-lg px-4 py-3 text-[#c9c1c0] placeholder-gray-600 focus:outline-none transition-colors pr-10 ${err ? 'border-red-500' : 'border-white/10 focus:border-[#22c825]/50'}`} />
            <button type="button" onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {err && <p className="text-red-400 text-xs">Incorrect password</p>}
          <button type="submit"
            className="w-full bg-[#22c825] hover:bg-[#1ea01f] text-[#040404] font-bold py-3 rounded-lg transition-colors">
            Login
          </button>
        </form>
        <div className="mt-5 text-center">
          <Link to="/" className="text-[#22c825]/60 hover:text-[#22c825] text-sm transition-colors">← Back to Portfolio</Link>
        </div>
      </div>
    </div>
  );
};

/* ── SaveBadge ── */
const SaveBadge: React.FC<{ state: SaveState }> = ({ state }) => {
  if (state === 'idle') return null;
  return (
    <div className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium ${
      state === 'saving' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
      state === 'saved'  ? 'bg-[#22c825]/10 text-[#22c825] border border-[#22c825]/20' :
                           'bg-red-500/10 text-red-400 border border-red-500/20'
    }`}>
      {state === 'saving' && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
      {state === 'saved'  && <CheckCircle className="h-3.5 w-3.5" />}
      {state === 'error'  && <XCircle className="h-3.5 w-3.5" />}
      {state === 'saving' ? 'Saving…' : state === 'saved' ? 'Saved to Supabase!' : 'Save failed'}
    </div>
  );
};

/* ── Main Admin ── */
const Admin: React.FC = () => {
  const [auth, setAuth]       = useState(false);
  const [data, setData]       = useState<PortfolioData | null>(null);
  const [tab, setTab]         = useState<Tab>('overview');
  const [saveState, setSave]  = useState<SaveState>('idle');
  const [loading, setLoading] = useState(false);

  const reload = () => {
    setLoading(true);
    fetchPortfolioData().then(setData).finally(() => setLoading(false));
  };

  useEffect(() => { if (auth) reload(); }, [auth]);

  const saveFeedback = async (fn: () => Promise<void>) => {
    setSave('saving');
    try { await fn(); setSave('saved'); } catch { setSave('error'); }
    setTimeout(() => setSave('idle'), 3000);
  };

  /* ── config save ── */
  const handleSaveConfig = () => {
    if (!data) return;
    saveFeedback(() => saveConfig(data));
  };

  /* ── project handlers ── */
  const handleAddProject = () => {
    if (!data) return;
    const np: Project = {
      id: `proj-${Date.now()}`,
      category: 'web',
      title: 'New Project',
      description: '',
      techStack: [],
      link: '',
      featured: false,
      sortOrder: data.projects.length,
    };
    setData({ ...data, projects: [...data.projects, np] });
  };

  const handleProjectChange = (id: string, field: keyof Project, val: any) =>
    setData((d) => d ? { ...d, projects: d.projects.map((p) => p.id === id ? { ...p, [field]: val } : p) } : d);

  const handleSaveProject = (project: Project) =>
    saveFeedback(() => upsertProject(project));

  const handleDeleteProject = (id: string) => {
    if (!confirm('Delete this project?')) return;
    saveFeedback(async () => {
      await deleteProject(id);
      setData((d) => d ? { ...d, projects: d.projects.filter((p) => p.id !== id) } : d);
    });
  };

  /* ── service handlers ── */
  const handleAddService = () => {
    if (!data) return;
    const ns: Service = { id: `svc-${Date.now()}`, title: 'New Service', description: '', icon: 'Globe', sortOrder: data.services.length };
    setData({ ...data, services: [...data.services, ns] });
  };

  const handleServiceChange = (id: string, field: keyof Service, val: any) =>
    setData((d) => d ? { ...d, services: d.services.map((s) => s.id === id ? { ...s, [field]: val } : s) } : d);

  const handleSaveService = (service: Service) =>
    saveFeedback(() => upsertService(service));

  const handleDeleteService = (id: string) => {
    if (!confirm('Delete this service?')) return;
    saveFeedback(async () => {
      await deleteService(id);
      setData((d) => d ? { ...d, services: d.services.filter((s) => s.id !== id) } : d);
    });
  };

  if (!auth) return <LoginScreen onLogin={() => setAuth(true)} />;
  if (!data || loading) return (
    <div className="min-h-screen bg-[#040404] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-[#22c825] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#22c825]/60 text-sm">Loading from Supabase…</p>
      </div>
    </div>
  );

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview',  label: 'Overview',  icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: 'about',     label: 'About',     icon: <Wrench className="h-4 w-4" /> },
    { id: 'projects',  label: 'Projects',  icon: <FolderOpen className="h-4 w-4" /> },
    { id: 'services',  label: 'Services',  icon: <Globe className="h-4 w-4" /> },
    { id: 'contact',   label: 'Contact',   icon: <Phone className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#040404] text-[#c9c1c0] flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-[#060606] border-r border-white/5 flex flex-col min-h-screen sticky top-0">
        <div className="px-5 py-6 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#22c825]/10 flex items-center justify-center">
              <LayoutDashboard className="h-4 w-4 text-[#22c825]" />
            </div>
            <span className="font-bold text-white text-sm">Admin Panel</span>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {tabs.map((t) => (
            <button key={t.id} id={`tab-${t.id}`} onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === t.id ? 'bg-[#22c825]/10 text-[#22c825] border border-[#22c825]/20' : 'text-gray-500 hover:text-gray-300 hover:bg-white/4'}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-white/5 space-y-2">
          <button onClick={reload}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-500 hover:text-[#22c825] hover:bg-[#22c825]/5 transition-all">
            <RefreshCw className="h-3.5 w-3.5" /> Sync from DB
          </button>
          <Link to="/"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-500 hover:text-white hover:bg-white/5 transition-all">
            <ArrowLeft className="h-3.5 w-3.5" /> View Portfolio
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {/* Topbar */}
        <div className="sticky top-0 z-30 bg-[#040404]/90 backdrop-blur-md border-b border-white/5 px-8 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-white capitalize">{tab}</h1>
          <div className="flex items-center gap-3">
            <SaveBadge state={saveState} />
          </div>
        </div>

        <div className="px-8 py-8 space-y-6">

          {/* ── OVERVIEW ── */}
          {tab === 'overview' && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Projects', value: data.projects.length, color: 'text-[#22c825]' },
                { label: 'Web Projects',   value: data.projects.filter((p) => p.category === 'web').length, color: 'text-blue-400' },
                { label: 'Mobile Apps',    value: data.projects.filter((p) => p.category === 'app').length, color: 'text-[#61DAFB]' },
                { label: 'Services',       value: data.services.length, color: 'text-purple-400' },
              ].map((s) => (
                <div key={s.label} className="bg-[#0a0a0a] border border-white/5 rounded-xl p-5">
                  <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                </div>
              ))}
              <div className="col-span-2 lg:col-span-4 bg-[#0a0a0a] border border-white/5 rounded-xl p-5">
                <p className="text-sm text-gray-400 leading-relaxed">
                  All changes are synced in real-time to <span className="text-[#22c825]">Supabase</span>. 
                  Use the sidebar to navigate sections. Press "Save" on each item to push changes.
                </p>
              </div>
            </div>
          )}

          {/* ── ABOUT ── */}
          {tab === 'about' && (
            <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6 space-y-5">
              <Textarea label="About Text" value={data.about.text} rows={5}
                onChange={(e) => setData({ ...data, about: { ...data.about, text: e.target.value } })} />
              <Input label="Skills (comma-separated)" value={data.about.skills.join(', ')}
                onChange={(e) => setData({ ...data, about: { ...data.about, skills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) } })} />
              <div className="flex flex-wrap gap-1.5">
                {data.about.skills.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded-full text-xs bg-[#22c825]/10 text-[#22c825] border border-[#22c825]/20">{s}</span>
                ))}
              </div>
              <button onClick={handleSaveConfig}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#22c825] text-[#040404] rounded-lg font-semibold text-sm hover:bg-[#1ea01f] transition-colors">
                <Save className="h-4 w-4" /> Save About
              </button>
            </div>
          )}

          {/* ── PROJECTS ── */}
          {tab === 'projects' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{data.projects.length} projects total</p>
                  <p className="text-[11px] text-gray-600 mt-0.5">Web projects show first, then apps. Change "Order #" to reorder within each group.</p>
                </div>
                <button onClick={handleAddProject}
                  className="flex items-center gap-2 px-4 py-2 bg-[#22c825] text-[#040404] rounded-lg font-semibold text-sm hover:bg-[#1ea01f] transition-colors">
                  <Plus className="h-4 w-4" /> Add Project
                </button>
              </div>

              {[...data.projects].sort((a, b) => {
                // web first, then app; within group sort by sortOrder
                if (a.category !== b.category) return a.category === 'web' ? -1 : 1;
                return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
              }).map((project) => (
                <div key={project.id} className="bg-[#0a0a0a] border border-white/5 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col gap-0.5">
                        <button
                          title="Move up (lower order number)"
                          onClick={() => {
                            const newOrder = Math.max(1, (project.sortOrder ?? 1) - 1);
                            handleProjectChange(project.id, 'sortOrder', newOrder);
                          }}
                          className="p-0.5 text-gray-600 hover:text-[#22c825] transition-colors">
                          <ArrowUp className="h-3 w-3" />
                        </button>
                        <button
                          title="Move down (higher order number)"
                          onClick={() => {
                            const newOrder = (project.sortOrder ?? 1) + 1;
                            handleProjectChange(project.id, 'sortOrder', newOrder);
                          }}
                          className="p-0.5 text-gray-600 hover:text-[#22c825] transition-colors">
                          <ArrowDown className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="text-[11px] font-bold text-gray-600 w-5 text-center">#{project.sortOrder ?? 0}</span>
                      <span className="font-semibold text-white text-sm">{project.title || 'Untitled'}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${project.category === 'web' ? 'bg-[#22c825]/10 text-[#22c825] border-[#22c825]/20' : 'bg-[#61DAFB]/10 text-[#61DAFB] border-[#61DAFB]/20'}`}>
                        {project.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {project.link && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-gray-500 hover:text-[#22c825] transition-colors">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      <button onClick={() => handleSaveProject(project)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#22c825]/10 text-[#22c825] border border-[#22c825]/20 rounded-lg text-xs font-medium hover:bg-[#22c825]/20 transition-colors">
                        <Save className="h-3.5 w-3.5" /> Save
                      </button>
                      <button onClick={() => handleDeleteProject(project.id)}
                        className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input label="Title" value={project.title}
                      onChange={(e) => handleProjectChange(project.id, 'title', e.target.value)} />
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Category</label>
                        <select value={project.category}
                          onChange={(e) => handleProjectChange(project.id, 'category', e.target.value as 'web' | 'app')}
                          className="w-full bg-[#0a0a0a] border border-white/8 rounded-lg px-3 py-2 text-sm text-[#c9c1c0] focus:border-[#22c825]/50 focus:outline-none">
                          <option value="web">Web</option>
                          <option value="app">App</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Order # <span className="text-gray-600">(within category)</span></label>
                        <input type="number" min={1} value={project.sortOrder ?? 1}
                          onChange={(e) => handleProjectChange(project.id, 'sortOrder', parseInt(e.target.value) || 1)}
                          className="w-full bg-[#0a0a0a] border border-white/8 rounded-lg px-3 py-2 text-sm text-[#c9c1c0] focus:border-[#22c825]/50 focus:outline-none" />
                      </div>
                    </div>
                    <Input label="Live Link" value={project.link}
                      onChange={(e) => handleProjectChange(project.id, 'link', e.target.value)} />
                    <Input label="GitHub (optional)" value={project.github ?? ''}
                      onChange={(e) => handleProjectChange(project.id, 'github', e.target.value || undefined)} />
                    <Input label="Preview Screenshot URL (optional)" value={project.preview ?? ''}
                      onChange={(e) => handleProjectChange(project.id, 'preview', e.target.value || undefined)} />
                    <Input label="Tech Stack (comma-separated)" value={project.techStack.join(', ')}
                      onChange={(e) => handleProjectChange(project.id, 'techStack', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))} />
                  </div>
                  <Textarea label="Description" value={project.description} rows={2}
                    onChange={(e) => handleProjectChange(project.id, 'description', e.target.value)} />
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id={`feat-${project.id}`} checked={project.featured ?? false}
                      onChange={(e) => handleProjectChange(project.id, 'featured', e.target.checked)}
                      className="accent-[#22c825]" />
                    <label htmlFor={`feat-${project.id}`} className="text-xs text-gray-400">Featured project</label>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── SERVICES ── */}
          {tab === 'services' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{data.services.length} services</p>
                <button onClick={handleAddService}
                  className="flex items-center gap-2 px-4 py-2 bg-[#22c825] text-[#040404] rounded-lg font-semibold text-sm hover:bg-[#1ea01f] transition-colors">
                  <Plus className="h-4 w-4" /> Add Service
                </button>
              </div>
              {data.services.map((service) => (
                <div key={service.id} className="bg-[#0a0a0a] border border-white/5 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[#22c825]">{iconMap[service.icon] ?? <Globe className="h-4 w-4" />}</span>
                      <span className="font-semibold text-white text-sm">{service.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleSaveService(service)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#22c825]/10 text-[#22c825] border border-[#22c825]/20 rounded-lg text-xs font-medium hover:bg-[#22c825]/20 transition-colors">
                        <Save className="h-3.5 w-3.5" /> Save
                      </button>
                      <button onClick={() => handleDeleteService(service.id)}
                        className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input label="Title" value={service.title}
                      onChange={(e) => handleServiceChange(service.id, 'title', e.target.value)} />
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Icon</label>
                      <select value={service.icon}
                        onChange={(e) => handleServiceChange(service.id, 'icon', e.target.value)}
                        className="w-full bg-[#0a0a0a] border border-white/8 rounded-lg px-3 py-2 text-sm text-[#c9c1c0] focus:border-[#22c825]/50 focus:outline-none">
                        <option value="Globe">Globe</option>
                        <option value="Smartphone">Smartphone</option>
                        <option value="Shield">Shield</option>
                      </select>
                    </div>
                  </div>
                  <Textarea label="Description" value={service.description} rows={2}
                    onChange={(e) => handleServiceChange(service.id, 'description', e.target.value)} />
                </div>
              ))}
            </div>
          )}

          {/* ── CONTACT ── */}
          {tab === 'contact' && (
            <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="WhatsApp URL" value={data.contact.whatsapp}
                  onChange={(e) => setData({ ...data, contact: { ...data.contact, whatsapp: e.target.value } })} />
                <Input label="Email" value={data.contact.email}
                  onChange={(e) => setData({ ...data, contact: { ...data.contact, email: e.target.value } })} />
                <Input label="GitHub URL" value={data.contact.github}
                  onChange={(e) => setData({ ...data, contact: { ...data.contact, github: e.target.value } })} />
                <Input label="YouTube URL" value={data.contact.youtube}
                  onChange={(e) => setData({ ...data, contact: { ...data.contact, youtube: e.target.value } })} />
                <Input label="Instagram URL" value={data.contact.instagram} className="sm:col-span-2"
                  onChange={(e) => setData({ ...data, contact: { ...data.contact, instagram: e.target.value } })} />
              </div>
              <button onClick={handleSaveConfig}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#22c825] text-[#040404] rounded-lg font-semibold text-sm hover:bg-[#1ea01f] transition-colors">
                <Save className="h-4 w-4" /> Save Contact Info
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Admin;