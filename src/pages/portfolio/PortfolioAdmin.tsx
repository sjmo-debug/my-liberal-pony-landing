import { useState, useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { Session } from '@supabase/supabase-js';
import { usePortfolio } from '@/contexts/PortfolioContext';
import type { Project, ArtistInfo, ProjectCategory, SkillGroup, MethodologyItem, DiscographyEntry, ExperienceSection } from '@/types/portfolio';
import { SEOHead } from '@/components/portfolio/SEOHead';
import { toast } from 'sonner';
import { Plus, Trash2, Save, X } from 'lucide-react';

type Tab = 'projects' | 'bio' | 'contact' | 'skills' | 'discography' | 'experience';

const tabs: { key: Tab; label: string }[] = [
  { key: 'projects', label: 'Projects' },
  { key: 'bio', label: 'Bio' },
  { key: 'contact', label: 'Contact' },
  { key: 'skills', label: 'Skills & Method' },
  { key: 'discography', label: 'Discography' },
  { key: 'experience', label: 'Experience' },
];

const inputClass = "w-full bg-black text-white border-2 border-white px-3 py-2 font-mono text-sm focus:outline-none focus:bg-white/5 placeholder:text-white/30";
const textareaClass = "w-full bg-black text-white border-2 border-white px-3 py-2 font-mono text-sm focus:outline-none focus:bg-white/5 placeholder:text-white/30 min-h-[100px] resize-y";
const btnClass = "font-heading uppercase tracking-widest text-sm px-4 py-2 border-2 border-white hover:bg-white hover:text-black transition-colors inline-flex items-center gap-2";
const btnDangerClass = "font-heading uppercase tracking-widest text-sm px-4 py-2 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-black transition-colors inline-flex items-center gap-2";

export default function PortfolioAdmin() {
  const { projects, photographerInfo, updateProjects, updatePhotographerInfo } = usePortfolio();
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const loginMode = searchParams.get('login') === '1';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('projects');
  const [editProjects, setEditProjects] = useState<Project[]>(JSON.parse(JSON.stringify(projects)));
  const [editInfo, setEditInfo] = useState<ArtistInfo>(JSON.parse(JSON.stringify(photographerInfo)));
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setAuthLoading(false);
    });
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setAuthLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    setAuthError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError(error.message);
  };

  if (authLoading) {
    return <div className="min-h-[80vh] flex items-center justify-center font-mono uppercase tracking-widest text-sm">Loading…</div>;
  }

  if (!session) {
    if (!loginMode) {
      return <Navigate to="/" replace />;
    }
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-8">
        <SEOHead title="Admin" description="Admin access" />
        <div className="w-full max-w-md border-4 border-white p-8">
          <h1 className="font-heading text-3xl uppercase tracking-widest mb-8 text-center">Admin Access</h1>
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setAuthError(''); }}
              placeholder="Email"
              className={inputClass}
              autoFocus
            />
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setAuthError(''); }}
              placeholder="Password"
              className={inputClass}
            />
            {authError && (
              <p className="text-red-500 font-mono text-sm uppercase tracking-wider">{authError}</p>
            )}
            <button type="submit" className={`${btnClass} w-full justify-center`}>
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  const saveProjects = () => {
    updateProjects(editProjects);
    toast.success('Projects updated');
  };

  const saveInfo = () => {
    updatePhotographerInfo(editInfo);
    toast.success('Info updated');
  };

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: 'New Project',
      category: 'music',
      year: new Date().getFullYear().toString(),
      coverImage: '',
      images: [],
      description: '',
      slug: `new-project-${Date.now()}`,
    };
    setEditProjects([...editProjects, newProject]);
    setEditingProjectId(newProject.id);
  };

  const removeProject = (id: string) => {
    setEditProjects(editProjects.filter(p => p.id !== id));
    if (editingProjectId === id) setEditingProjectId(null);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setEditProjects(editProjects.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  return (
    <>
      <SEOHead title="Admin" />
      <div className="min-h-screen">
        {/* Header */}
        <section className="py-12 md:py-16 px-6 lg:px-8 border-b-4 border-white">
          <h1 className="font-heading text-5xl md:text-7xl uppercase tracking-widest">ADMIN</h1>
          <p className="text-muted-foreground font-mono uppercase tracking-wide mt-2">LOCAL EDITING — CHANGES RESET ON REFRESH</p>
        </section>

        {/* Tabs */}
        <div className="flex flex-wrap border-b-4 border-white">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`font-heading text-sm uppercase tracking-widest px-4 py-3 border-r-2 border-white transition-colors ${
                activeTab === tab.key ? 'bg-white text-black' : 'hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="px-6 lg:px-8 py-8 max-w-5xl">
          {activeTab === 'projects' && <ProjectsTab
            projects={editProjects}
            editingId={editingProjectId}
            setEditingId={setEditingProjectId}
            updateProject={updateProject}
            addProject={addProject}
            removeProject={removeProject}
            onSave={saveProjects}
          />}
          {activeTab === 'bio' && <BioTab info={editInfo} setInfo={setEditInfo} onSave={saveInfo} />}
          {activeTab === 'contact' && <ContactTab info={editInfo} setInfo={setEditInfo} onSave={saveInfo} />}
          {activeTab === 'skills' && <SkillsTab info={editInfo} setInfo={setEditInfo} onSave={saveInfo} />}
          {activeTab === 'discography' && <DiscographyTab info={editInfo} setInfo={setEditInfo} onSave={saveInfo} />}
          {activeTab === 'experience' && <ExperienceTab info={editInfo} setInfo={setEditInfo} onSave={saveInfo} />}
        </div>
      </div>
    </>
  );
}

/* ── Projects Tab ── */
function ProjectsTab({ projects, editingId, setEditingId, updateProject, addProject, removeProject, onSave }: {
  projects: Project[]; editingId: string | null; setEditingId: (id: string | null) => void;
  updateProject: (id: string, u: Partial<Project>) => void; addProject: () => void; removeProject: (id: string) => void; onSave: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <button onClick={addProject} className={btnClass}><Plus className="size-4" /> Add Project</button>
        <button onClick={onSave} className={btnClass}><Save className="size-4" /> Save All</button>
      </div>

      {projects.map(project => (
        <div key={project.id} className="border-2 border-white p-4 space-y-4">
          <div className="flex justify-between items-center">
            <button onClick={() => setEditingId(editingId === project.id ? null : project.id)} className="font-heading text-lg uppercase tracking-widest hover:text-white/70">
              {project.title || 'Untitled'} <span className="text-muted-foreground text-sm ml-2">({project.year})</span>
            </button>
            <div className="flex gap-2">
              <button onClick={() => setEditingId(editingId === project.id ? null : project.id)} className="text-sm font-mono uppercase border border-white px-2 py-1 hover:bg-white hover:text-black transition-colors">
                {editingId === project.id ? 'Collapse' : 'Edit'}
              </button>
              <button onClick={() => removeProject(project.id)} className="text-sm font-mono uppercase border border-red-500 text-red-500 px-2 py-1 hover:bg-red-500 hover:text-black transition-colors">
                <Trash2 className="size-3" />
              </button>
            </div>
          </div>
          {editingId === project.id && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Title" value={project.title} onChange={v => updateProject(project.id, { title: v })} />
              <Field label="Slug" value={project.slug} onChange={v => updateProject(project.id, { slug: v })} />
              <div>
                <label className="block font-heading text-xs uppercase tracking-widest mb-1">Category</label>
                <select value={project.category} onChange={e => updateProject(project.id, { category: e.target.value as ProjectCategory })} className={inputClass}>
                  <option value="music">Music</option>
                  <option value="production">Production</option>
                  <option value="visual-art">Visual Art</option>
                  <option value="collaborations">Collaborations</option>
                </select>
              </div>
              <Field label="Year" value={project.year} onChange={v => updateProject(project.id, { year: v })} />
              <Field label="Role" value={project.role || ''} onChange={v => updateProject(project.id, { role: v })} />
              <Field label="Location" value={project.location || ''} onChange={v => updateProject(project.id, { location: v })} />
              <Field label="Medium" value={project.medium || ''} onChange={v => updateProject(project.id, { medium: v })} />
              <Field label="Cover Image URL" value={project.coverImage} onChange={v => updateProject(project.id, { coverImage: v })} />
              <div className="md:col-span-2">
                <label className="block font-heading text-xs uppercase tracking-widest mb-1">Description</label>
                <textarea value={project.description} onChange={e => updateProject(project.id, { description: e.target.value })} className={textareaClass} />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Bio Tab ── */
function BioTab({ info, setInfo, onSave }: { info: ArtistInfo; setInfo: (i: ArtistInfo) => void; onSave: () => void }) {
  const u = (k: keyof ArtistInfo, v: string) => setInfo({ ...info, [k]: v });
  return (
    <div className="space-y-6 max-w-3xl">
      <button onClick={onSave} className={btnClass}><Save className="size-4" /> Save</button>
      <Field label="Name" value={info.name} onChange={v => u('name', v)} />
      <Field label="Tagline" value={info.tagline} onChange={v => u('tagline', v)} />
      <div>
        <label className="block font-heading text-xs uppercase tracking-widest mb-1">Hero Introduction</label>
        <textarea value={info.heroIntroduction} onChange={e => setInfo({ ...info, heroIntroduction: e.target.value })} className={textareaClass} />
      </div>
      <div>
        <label className="block font-heading text-xs uppercase tracking-widest mb-1">Biography</label>
        <textarea value={info.biography} onChange={e => setInfo({ ...info, biography: e.target.value })} className={textareaClass + ' min-h-[200px]'} />
      </div>
      <div>
        <label className="block font-heading text-xs uppercase tracking-widest mb-1">Approach</label>
        <textarea value={info.approach} onChange={e => setInfo({ ...info, approach: e.target.value })} className={textareaClass} />
      </div>
      <div>
        <label className="block font-heading text-xs uppercase tracking-widest mb-1">Journey</label>
        <textarea value={info.journey} onChange={e => setInfo({ ...info, journey: e.target.value })} className={textareaClass} />
      </div>
      <Field label="Portrait Image URL" value={info.portraitImage} onChange={v => u('portraitImage', v)} />
      <Field label="Education" value={info.education} onChange={v => u('education', v)} />
    </div>
  );
}

/* ── Contact Tab ── */
function ContactTab({ info, setInfo, onSave }: { info: ArtistInfo; setInfo: (i: ArtistInfo) => void; onSave: () => void }) {
  const u = (k: keyof ArtistInfo, v: string) => setInfo({ ...info, [k]: v });
  return (
    <div className="space-y-6 max-w-3xl">
      <button onClick={onSave} className={btnClass}><Save className="size-4" /> Save</button>
      <Field label="Email" value={info.email} onChange={v => u('email', v)} />
      <Field label="Phone" value={info.phone} onChange={v => u('phone', v)} />
      <Field label="Location" value={info.location} onChange={v => u('location', v)} />
      <Field label="Availability" value={info.availability} onChange={v => u('availability', v)} />
      <div className="border-t-4 border-white pt-6 space-y-4">
        <h3 className="font-heading text-xl uppercase tracking-widest">SOCIAL LINKS</h3>
        <Field label="Instagram" value={info.socialLinks.instagram || ''} onChange={v => setInfo({ ...info, socialLinks: { ...info.socialLinks, instagram: v } })} />
        <Field label="LinkedIn" value={info.socialLinks.linkedin || ''} onChange={v => setInfo({ ...info, socialLinks: { ...info.socialLinks, linkedin: v } })} />
        <Field label="Linktree" value={info.socialLinks.linktree || ''} onChange={v => setInfo({ ...info, socialLinks: { ...info.socialLinks, linktree: v } })} />
        <Field label="Behance" value={info.socialLinks.behance || ''} onChange={v => setInfo({ ...info, socialLinks: { ...info.socialLinks, behance: v } })} />
      </div>
    </div>
  );
}

/* ── Skills & Methodology Tab ── */
function SkillsTab({ info, setInfo, onSave }: { info: ArtistInfo; setInfo: (i: ArtistInfo) => void; onSave: () => void }) {
  const updateSkillGroup = (idx: number, updates: Partial<SkillGroup>) => {
    const skills = [...info.skills];
    skills[idx] = { ...skills[idx], ...updates };
    setInfo({ ...info, skills });
  };
  const addSkillGroup = () => setInfo({ ...info, skills: [...info.skills, { label: 'New Group', items: [] }] });
  const removeSkillGroup = (idx: number) => setInfo({ ...info, skills: info.skills.filter((_, i) => i !== idx) });

  const updateMethodology = (idx: number, updates: Partial<MethodologyItem>) => {
    const methodology = [...info.methodology];
    methodology[idx] = { ...methodology[idx], ...updates };
    setInfo({ ...info, methodology });
  };
  const addMethodology = () => setInfo({ ...info, methodology: [...info.methodology, { title: 'New', description: '' }] });
  const removeMethodology = (idx: number) => setInfo({ ...info, methodology: info.methodology.filter((_, i) => i !== idx) });

  return (
    <div className="space-y-8 max-w-3xl">
      <button onClick={onSave} className={btnClass}><Save className="size-4" /> Save</button>

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <h3 className="font-heading text-2xl uppercase tracking-widest">SKILLS</h3>
          <button onClick={addSkillGroup} className={btnClass}><Plus className="size-3" /> Group</button>
        </div>
        {info.skills.map((group, i) => (
          <div key={i} className="border-2 border-white p-4 space-y-3">
            <div className="flex justify-between items-center">
              <input value={group.label} onChange={e => updateSkillGroup(i, { label: e.target.value })} className={inputClass + ' max-w-xs'} />
              <button onClick={() => removeSkillGroup(i)} className={btnDangerClass}><Trash2 className="size-3" /></button>
            </div>
            <div>
              <label className="block font-heading text-xs uppercase tracking-widest mb-1">Items (comma-separated)</label>
              <input value={group.items.join(', ')} onChange={e => updateSkillGroup(i, { items: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} className={inputClass} />
            </div>
          </div>
        ))}
      </div>

      <div className="border-t-4 border-white pt-8 space-y-6">
        <div className="flex items-center gap-4">
          <h3 className="font-heading text-2xl uppercase tracking-widest">METHODOLOGY</h3>
          <button onClick={addMethodology} className={btnClass}><Plus className="size-3" /> Card</button>
        </div>
        {info.methodology.map((item, i) => (
          <div key={i} className="border-2 border-white p-4 space-y-3">
            <div className="flex justify-between items-center">
              <input value={item.title} onChange={e => updateMethodology(i, { title: e.target.value })} className={inputClass + ' max-w-xs'} placeholder="Title" />
              <button onClick={() => removeMethodology(i)} className={btnDangerClass}><Trash2 className="size-3" /></button>
            </div>
            <textarea value={item.description} onChange={e => updateMethodology(i, { description: e.target.value })} className={textareaClass} placeholder="Description" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Discography Tab ── */
function DiscographyTab({ info, setInfo, onSave }: { info: ArtistInfo; setInfo: (i: ArtistInfo) => void; onSave: () => void }) {
  const update = (idx: number, updates: Partial<DiscographyEntry>) => {
    const discography = [...info.discography];
    discography[idx] = { ...discography[idx], ...updates };
    setInfo({ ...info, discography });
  };
  const add = () => setInfo({ ...info, discography: [...info.discography, { project: '', release: '', role: '', studioLabel: '' }] });
  const remove = (idx: number) => setInfo({ ...info, discography: info.discography.filter((_, i) => i !== idx) });

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex gap-4">
        <button onClick={add} className={btnClass}><Plus className="size-4" /> Add Entry</button>
        <button onClick={onSave} className={btnClass}><Save className="size-4" /> Save</button>
      </div>
      {info.discography.map((entry, i) => (
        <div key={i} className="border-2 border-white p-4 grid grid-cols-2 md:grid-cols-5 gap-3 items-end">
          <Field label="Project" value={entry.project} onChange={v => update(i, { project: v })} />
          <Field label="Release" value={entry.release} onChange={v => update(i, { release: v })} />
          <Field label="Role" value={entry.role} onChange={v => update(i, { role: v })} />
          <Field label="Studio / Label" value={entry.studioLabel} onChange={v => update(i, { studioLabel: v })} />
          <button onClick={() => remove(i)} className={btnDangerClass + ' self-end'}><Trash2 className="size-3" /></button>
        </div>
      ))}
    </div>
  );
}

/* ── Experience Tab ── */
function ExperienceTab({ info, setInfo, onSave }: { info: ArtistInfo; setInfo: (i: ArtistInfo) => void; onSave: () => void }) {
  const updateSection = (idx: number, updates: Partial<ExperienceSection>) => {
    const experience = [...info.experience];
    experience[idx] = { ...experience[idx], ...updates };
    setInfo({ ...info, experience });
  };
  const addSection = () => setInfo({ ...info, experience: [...info.experience, { title: 'New Section', items: [''] }] });
  const removeSection = (idx: number) => setInfo({ ...info, experience: info.experience.filter((_, i) => i !== idx) });

  const updateItem = (sectionIdx: number, itemIdx: number, value: string) => {
    const experience = [...info.experience];
    const items = [...experience[sectionIdx].items];
    items[itemIdx] = value;
    experience[sectionIdx] = { ...experience[sectionIdx], items };
    setInfo({ ...info, experience });
  };
  const addItem = (sectionIdx: number) => {
    const experience = [...info.experience];
    experience[sectionIdx] = { ...experience[sectionIdx], items: [...experience[sectionIdx].items, ''] };
    setInfo({ ...info, experience });
  };
  const removeItem = (sectionIdx: number, itemIdx: number) => {
    const experience = [...info.experience];
    experience[sectionIdx] = { ...experience[sectionIdx], items: experience[sectionIdx].items.filter((_, i) => i !== itemIdx) };
    setInfo({ ...info, experience });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex gap-4">
        <button onClick={addSection} className={btnClass}><Plus className="size-4" /> Add Section</button>
        <button onClick={onSave} className={btnClass}><Save className="size-4" /> Save</button>
      </div>
      {info.experience.map((section, si) => (
        <div key={si} className="border-2 border-white p-4 space-y-4">
          <div className="flex justify-between items-center">
            <input value={section.title} onChange={e => updateSection(si, { title: e.target.value })} className={inputClass + ' max-w-md'} />
            <button onClick={() => removeSection(si)} className={btnDangerClass}><Trash2 className="size-3" /></button>
          </div>
          <div className="space-y-2">
            {section.items.map((item, ii) => (
              <div key={ii} className="flex gap-2">
                <input value={item} onChange={e => updateItem(si, ii, e.target.value)} className={inputClass} />
                <button onClick={() => removeItem(si, ii)} className="text-red-500 border border-red-500 px-2 hover:bg-red-500 hover:text-black transition-colors"><X className="size-3" /></button>
              </div>
            ))}
            <button onClick={() => addItem(si)} className="text-sm font-mono uppercase border border-white px-2 py-1 hover:bg-white hover:text-black transition-colors">+ Item</button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Reusable Field ── */
function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block font-heading text-xs uppercase tracking-widest mb-1">{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} className={inputClass} />
    </div>
  );
}
