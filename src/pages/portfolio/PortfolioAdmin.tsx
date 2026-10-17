import { useState, useEffect, useMemo, useRef, useId } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { Session } from '@supabase/supabase-js';
import { usePortfolio } from '@/contexts/PortfolioContext';
import type { Project, ArtistInfo, ProjectCategory, SkillGroup, MethodologyItem, DiscographyEntry, ExperienceSection } from '@/types/portfolio';
import { SEOHead } from '@/components/portfolio/SEOHead';
import { toast } from 'sonner';
import PhotoField from '@/components/admin/PhotoField';
import { HeroTab, TextTab, ListsTab } from './PortfolioAdminContent';
import { ProjectImagesEditor, FeaturedSwitch } from './PortfolioAdminProjects';
import { selectFeaturedProjects, isFlaggedFeatured, MAX_FEATURED, DEFAULT_FEATURED_COUNT } from '@/lib/featuredProjects';
import { Plus, Trash2, X, ArrowUp, ArrowDown } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type Tab = 'enquiries' | 'projects' | 'hero' | 'texthome' | 'textmenu' | 'textproject' | 'bio' | 'textabout' | 'lists' | 'contact' | 'textcontact' | 'skills' | 'discography' | 'experience';

const tabs: { key: Tab; label: string }[] = [
  { key: 'enquiries', label: 'Enquiries' },
  { key: 'projects', label: 'Projects' },
  { key: 'hero', label: 'Hero & Photos' },
  { key: 'texthome', label: 'Home Page Text' },
  { key: 'textmenu', label: 'Menu & Projects Text' },
  { key: 'textproject', label: 'Project Page Text' },
  { key: 'bio', label: 'Bio' },
  { key: 'textabout', label: 'About Page Text' },
  { key: 'lists', label: 'About Lists' },
  { key: 'contact', label: 'Contact' },
  { key: 'textcontact', label: 'Contact & Form Text' },
  { key: 'skills', label: 'Skills & Method' },
  { key: 'discography', label: 'Discography' },
  { key: 'experience', label: 'Experience' },
];

interface Enquiry {
  id: string;
  name: string;
  email: string;
  project_type: string;
  message: string;
  handled: boolean;
  created_at: string;
}


const inputClass = "w-full min-h-[44px] bg-black text-white border-2 border-white px-3 py-2 font-mono text-base focus:outline-none focus:bg-white/5 placeholder:text-white/30";
const textareaClass = "w-full bg-black text-white border-2 border-white px-3 py-2 font-mono text-base focus:outline-none focus:bg-white/5 placeholder:text-white/30 min-h-[100px] resize-y";
const btnClass = "font-heading uppercase tracking-widest text-sm px-4 py-2 min-h-[44px] border-2 border-white hover:bg-white hover:text-black transition-colors inline-flex items-center justify-center gap-2";
const btnDangerClass = "font-heading uppercase tracking-widest text-sm px-4 py-2 min-h-[44px] min-w-[44px] border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-black transition-colors inline-flex items-center justify-center gap-2";
const btnSmallClass = "text-sm font-mono uppercase border-2 border-white px-3 py-2 min-h-[44px] min-w-[44px] hover:bg-white hover:text-black transition-colors inline-flex items-center justify-center";

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

/** Ask for confirmation, then run the delete. Passed down to every tab. */
type AskDelete = (what: string, onConfirm: () => void) => void;

export default function PortfolioAdmin() {
  const { projects, photographerInfo, canSave, saveAll } = usePortfolio();
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const loginMode = searchParams.get('login') === '1';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('enquiries');
  const [editProjects, setEditProjects] = useState<Project[]>(() => clone(projects));
  const [editInfo, setEditInfo] = useState<ArtistInfo>(() => clone(photographerInfo));
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ kind: 'idle' | 'saved' | 'error'; message: string }>({ kind: 'idle', message: '' });
  const [pendingDelete, setPendingDelete] = useState<{ what: string; onConfirm: () => void } | null>(null);

  // What the database last gave us (as text) for each half of the content.
  // A section is "dirty" when the edit copy differs from this.
  const [syncedProjects, setSyncedProjects] = useState(() => JSON.stringify(projects));
  const [syncedInfo, setSyncedInfo] = useState(() => JSON.stringify(photographerInfo));
  const syncedProjectsRef = useRef(syncedProjects);
  const syncedInfoRef = useRef(syncedInfo);
  // While our own save is in flight, the text we expect to come back from the database.
  const pendingSave = useRef<{ projects: string; info: string } | null>(null);
  // Set when the saved version changed elsewhere while the owner has unsaved edits in that section.
  const [changedElsewhere, setChangedElsewhere] = useState({ projects: false, info: false });

  const projectsJson = useMemo(() => JSON.stringify(editProjects), [editProjects]);
  const infoJson = useMemo(() => JSON.stringify(editInfo), [editInfo]);
  const projectsDirty = projectsJson !== syncedProjects;
  const infoDirty = infoJson !== syncedInfo;
  const dirty = projectsDirty || infoDirty;

  // Always-current copies of the edits, so the effects below can compare without stale values.
  const editProjectsRef = useRef(editProjects);
  const editInfoRef = useRef(editInfo);
  editProjectsRef.current = editProjects;
  editInfoRef.current = editInfo;

  // Bring in newly saved content (first load, our own save, or a change from another
  // device) but never overwrite a section that has unsaved edits.
  useEffect(() => {
    const incoming = JSON.stringify(projects);
    const previous = syncedProjectsRef.current;
    syncedProjectsRef.current = incoming;
    setSyncedProjects(incoming);
    if (incoming === previous) return;
    if (pendingSave.current && incoming === pendingSave.current.projects) return; // our own save
    const current = JSON.stringify(editProjectsRef.current);
    if (current === previous || current === incoming) {
      if (current !== incoming) setEditProjects(JSON.parse(incoming));
      setChangedElsewhere((c) => (c.projects ? { ...c, projects: false } : c));
    } else {
      setChangedElsewhere((c) => (c.projects ? c : { ...c, projects: true }));
    }
  }, [projects]);

  useEffect(() => {
    const incoming = JSON.stringify(photographerInfo);
    const previous = syncedInfoRef.current;
    syncedInfoRef.current = incoming;
    setSyncedInfo(incoming);
    if (incoming === previous) return;
    if (pendingSave.current && incoming === pendingSave.current.info) return; // our own save
    const current = JSON.stringify(editInfoRef.current);
    if (current === previous || current === incoming) {
      if (current !== incoming) setEditInfo(JSON.parse(incoming));
      setChangedElsewhere((c) => (c.info ? { ...c, info: false } : c));
    } else {
      setChangedElsewhere((c) => (c.info ? c : { ...c, info: true }));
    }
  }, [photographerInfo]);

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

  // Warn before closing the tab or reloading with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

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
      <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-8">
        <SEOHead title="Admin" description="Admin access" />
        <div className="w-full max-w-md border-4 border-white p-6 sm:p-8">
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

  // One save writes projects and artist info together in a single database update.
  const handleSave = async () => {
    setSaving(true);
    setStatus({ kind: 'idle', message: '' });
    const sentProjects = editProjects;
    const sentInfo = editInfo;
    pendingSave.current = { projects: JSON.stringify(sentProjects), info: JSON.stringify(sentInfo) };
    try {
      await saveAll(sentProjects, sentInfo);
      // Edits made while saving stay dirty because they differ from what was just saved.
      syncedProjectsRef.current = pendingSave.current.projects;
      syncedInfoRef.current = pendingSave.current.info;
      setSyncedProjects(pendingSave.current.projects);
      setSyncedInfo(pendingSave.current.info);
      setChangedElsewhere({ projects: false, info: false });
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setStatus({ kind: 'saved', message: `Saved at ${time}` });
      toast.success('Saved. The live site is updated.');
    } catch (err: unknown) {
      const message = (err as { message?: string })?.message || 'Save failed. Nothing was changed. Try again.';
      setStatus({ kind: 'error', message });
      toast.error(message);
    } finally {
      pendingSave.current = null;
      setSaving(false);
    }
  };

  const discardProjects = () => {
    setEditProjects(clone(projects));
    setChangedElsewhere((c) => ({ ...c, projects: false }));
  };
  const discardInfo = () => {
    setEditInfo(clone(photographerInfo));
    setChangedElsewhere((c) => ({ ...c, info: false }));
  };

  const askDelete: AskDelete = (what, onConfirm) => setPendingDelete({ what, onConfirm });

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

  // Functional updates, so a photo upload that finishes late cannot overwrite newer edits.
  const patchProject = (id: string, fn: (p: Project) => Partial<Project>) => {
    setEditProjects(prev => prev.map(p => {
      if (p.id !== id) return p;
      const next = { ...p, ...fn(p) };
      // Keep saved data tidy: an off switch is stored as "not set".
      if (next.featured !== true) delete next.featured;
      return next;
    }));
  };
  const updateProject = (id: string, updates: Partial<Project>) => patchProject(id, () => updates);

  const moveProject = (id: string, dir: -1 | 1) => {
    setEditProjects(prev => {
      const i = prev.findIndex(p => p.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const showSaveBar = activeTab !== 'enquiries';

  return (
    <>
      <SEOHead title="Admin" />
      <div className={`min-h-screen overflow-x-hidden ${showSaveBar ? 'pb-40' : ''}`}>
        {/* Header */}
        <section className="py-8 md:py-16 px-4 sm:px-6 lg:px-8 border-b-4 border-white">
          <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl uppercase tracking-widest">ADMIN</h1>
          <p className="text-muted-foreground font-mono uppercase tracking-wide mt-2 text-sm sm:text-base">
            CHANGES GO LIVE WHEN YOU PRESS SAVE
          </p>
        </section>

        {!canSave && activeTab !== 'enquiries' && (
          <div role="alert" className="mx-4 sm:mx-6 lg:mx-8 mt-6 border-2 border-white p-4 font-mono text-sm">
            Could not load the saved content, so saving is switched off to protect what is already there.
            Check your connection, then reload this page.
          </div>
        )}

        {/* Phone: one dropdown. Larger screens: row of tabs. */}
        <div className="sm:hidden px-4 py-4 border-b-4 border-white">
          <label htmlFor="portfolio-admin-section" className="block font-heading text-xs uppercase tracking-widest text-muted-foreground mb-1">Section</label>
          <select
            id="portfolio-admin-section"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as Tab)}
            className={`${inputClass} font-heading uppercase tracking-widest`}
          >
            {tabs.map(tab => (
              <option key={tab.key} value={tab.key}>{tab.label}</option>
            ))}
          </select>
        </div>
        <div className="hidden sm:flex flex-wrap border-b-4 border-white">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`font-heading text-sm uppercase tracking-widest px-4 py-3 min-h-[44px] border-r-2 border-white transition-colors ${
                activeTab === tab.key ? 'bg-white text-black' : 'hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-6 md:py-8 max-w-5xl">
          {activeTab === 'projects' && changedElsewhere.projects && (
            <ChangedNotice what="projects" onDiscard={discardProjects} onKeep={() => setChangedElsewhere(c => ({ ...c, projects: false }))} />
          )}
          {activeTab !== 'projects' && activeTab !== 'enquiries' && changedElsewhere.info && (
            <ChangedNotice what="page text" onDiscard={discardInfo} onKeep={() => setChangedElsewhere(c => ({ ...c, info: false }))} />
          )}
          {/* Pointer to the other section so a conflict is never missed */}
          {activeTab !== 'projects' && activeTab !== 'enquiries' && changedElsewhere.projects && (
            <p className="mb-6 border-2 border-yellow-300 p-3 font-mono text-sm">The saved projects were changed elsewhere. Open the Projects section to review.</p>
          )}
          {activeTab === 'projects' && changedElsewhere.info && (
            <p className="mb-6 border-2 border-yellow-300 p-3 font-mono text-sm">The saved page text was changed elsewhere. Open any section other than Projects to review.</p>
          )}

          {activeTab === 'enquiries' && <EnquiriesTab />}
          {activeTab === 'projects' && <ProjectsTab
            projects={editProjects}
            editingId={editingProjectId}
            setEditingId={setEditingProjectId}
            updateProject={updateProject}
            patchProject={patchProject}
            moveProject={moveProject}
            addProject={addProject}
            removeProject={removeProject}
            askDelete={askDelete}
          />}
          {activeTab === 'hero' && <HeroTab info={editInfo} setInfo={setEditInfo} />}
          {activeTab === 'texthome' && <TextTab group="home" info={editInfo} setInfo={setEditInfo} />}
          {activeTab === 'textmenu' && <TextTab group="menu" info={editInfo} setInfo={setEditInfo} />}
          {activeTab === 'textproject' && <TextTab group="project" info={editInfo} setInfo={setEditInfo} />}
          {activeTab === 'textabout' && <TextTab group="about" info={editInfo} setInfo={setEditInfo} />}
          {activeTab === 'lists' && <ListsTab info={editInfo} setInfo={setEditInfo} askDelete={askDelete} />}
          {activeTab === 'textcontact' && <TextTab group="contact" info={editInfo} setInfo={setEditInfo} />}
          {activeTab === 'bio' && <BioTab info={editInfo} setInfo={setEditInfo} />}
          {activeTab === 'contact' && <ContactTab info={editInfo} setInfo={setEditInfo} />}
          {activeTab === 'skills' && <SkillsTab info={editInfo} setInfo={setEditInfo} askDelete={askDelete} />}
          {activeTab === 'discography' && <DiscographyTab info={editInfo} setInfo={setEditInfo} askDelete={askDelete} />}
          {activeTab === 'experience' && <ExperienceTab info={editInfo} setInfo={setEditInfo} askDelete={askDelete} />}
        </div>
      </div>

      {/* Always-visible save bar (not shown on Enquiries) */}
      {showSaveBar && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-black border-t-4 border-white px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center gap-3">
            <p
              role="status"
              aria-live="polite"
              className={`flex-1 font-mono text-sm leading-snug break-words ${
                status.kind === 'error' ? 'text-red-400' : dirty ? 'text-yellow-300' : status.kind === 'saved' ? 'text-green-400' : 'text-muted-foreground'
              }`}
            >
              {status.kind === 'error'
                ? `Not saved: ${status.message}`
                : dirty
                  ? 'Unsaved changes'
                  : status.kind === 'saved'
                    ? status.message
                    : 'No changes yet'}
            </p>
            <button
              onClick={handleSave}
              disabled={saving || !dirty || !canSave}
              className="font-heading uppercase tracking-widest text-base px-6 py-3 min-h-[48px] w-full sm:w-auto sm:min-w-[160px] bg-white text-black border-2 border-white hover:bg-black hover:text-white transition-colors disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-black"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      )}

      <AlertDialog open={!!pendingDelete} onOpenChange={(open) => { if (!open) setPendingDelete(null); }}>
        <AlertDialogContent className="bg-black text-white border-2 border-white rounded-none">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading uppercase tracking-widest">Delete {pendingDelete?.what}?</AlertDialogTitle>
            <AlertDialogDescription className="font-mono text-sm text-white/70">
              It is removed from your edits straight away. The live site only changes when you press Save.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className={`${btnClass} bg-black text-white rounded-none mt-0`}>Keep it</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { pendingDelete?.onConfirm(); setPendingDelete(null); }}
              className="font-heading uppercase tracking-widest text-sm px-4 py-2 min-h-[44px] rounded-none border-2 border-red-500 bg-red-500 text-black hover:bg-black hover:text-red-500"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function ChangedNotice({ what, onDiscard, onKeep }: { what: string; onDiscard: () => void; onKeep: () => void }) {
  return (
    <div role="alert" className="mb-6 border-2 border-yellow-300 p-4 space-y-3">
      <p className="font-mono text-sm leading-relaxed">
        The saved {what} changed somewhere else (another device or tab) while you were editing. Your unsaved edits have been kept.
        If you press Save, your version replaces the other one.
      </p>
      <div className="grid grid-cols-1 sm:flex gap-3">
        <button onClick={onDiscard} className={btnClass}>Load saved version (lose my edits)</button>
        <button onClick={onKeep} className={btnClass}>Keep my edits</button>
      </div>
    </div>
  );
}

/* ── Enquiries Tab ── */
function EnquiriesTab() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHandled, setShowHandled] = useState(false);

  useEffect(() => {
    let active = true;
    supabase
      .from('portfolio_enquiries')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!active) return;
        if (error) toast.error('Could not load enquiries');
        else setEnquiries((data as Enquiry[]) ?? []);
        setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const toggleHandled = async (enquiry: Enquiry) => {
    const next = !enquiry.handled;
    setEnquiries(prev => prev.map(e => e.id === enquiry.id ? { ...e, handled: next } : e));
    const { error } = await supabase
      .from('portfolio_enquiries')
      .update({ handled: next })
      .eq('id', enquiry.id);
    if (error) {
      toast.error('Could not update enquiry');
      setEnquiries(prev => prev.map(e => e.id === enquiry.id ? { ...e, handled: !next } : e));
    }
  };

  const visible = showHandled ? enquiries : enquiries.filter(e => !e.handled);

  if (loading) {
    return <p className="font-mono text-sm uppercase tracking-widest">Loading enquiries…</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center">
        <button onClick={() => setShowHandled(!showHandled)} className={`${btnClass} w-full sm:w-auto`}>
          {showHandled ? 'Hide Handled' : 'Show Handled'}
        </button>
        <span className="font-mono text-sm uppercase tracking-wide text-muted-foreground">
          {enquiries.filter(e => !e.handled).length} open / {enquiries.length} total
        </span>
      </div>

      {visible.length === 0 && (
        <p className="font-mono text-sm uppercase tracking-wide text-muted-foreground">No enquiries here.</p>
      )}

      {visible.map(enquiry => (
        <div key={enquiry.id} className={`border-2 border-white p-4 space-y-3 ${enquiry.handled ? 'opacity-60' : ''}`}>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:items-start">
            <div>
              <p className="font-heading text-lg uppercase tracking-widest">{enquiry.name}</p>
              <a href={`mailto:${enquiry.email}`} className="font-mono text-sm text-muted-foreground hover:text-white break-all">{enquiry.email}</a>
            </div>
            <div className="sm:text-right space-y-1">
              <p className="font-mono text-xs uppercase tracking-widest">{enquiry.project_type}</p>
              <p className="font-mono text-xs text-muted-foreground">{new Date(enquiry.created_at).toLocaleString('en-GB')}</p>
            </div>
          </div>
          <p className="font-mono text-sm leading-relaxed whitespace-pre-wrap">{enquiry.message}</p>
          <button onClick={() => toggleHandled(enquiry)} className={`${btnClass} w-full sm:w-auto min-h-[48px]`}>
            {enquiry.handled ? 'Mark As Open' : 'Mark As Handled'}
          </button>
        </div>
      ))}
    </div>
  );
}


/* ── Projects Tab ── */
function ProjectsTab({ projects, editingId, setEditingId, updateProject, patchProject, moveProject, addProject, removeProject, askDelete }: {
  projects: Project[]; editingId: string | null; setEditingId: (id: string | null) => void;
  updateProject: (id: string, u: Partial<Project>) => void;
  patchProject: (id: string, fn: (p: Project) => Partial<Project>) => void;
  moveProject: (id: string, dir: -1 | 1) => void;
  addProject: () => void; removeProject: (id: string) => void; askDelete: AskDelete;
}) {
  const flaggedCount = projects.filter(isFlaggedFeatured).length;
  const shownOnHome = new Set(selectFeaturedProjects(projects).map(p => p.id));
  return (
    <div className="space-y-6">
      <div className="space-y-2 font-mono text-sm leading-relaxed text-white/70 max-w-3xl">
        <p>Use the arrows to set the order. That order is used on the Projects page and on Home.</p>
        <p>
          Home's Featured block: while no project has "Featured on Home" switched on, Home shows the first {DEFAULT_FEATURED_COUNT} projects in this order.
          As soon as you switch any project on, Home shows only the switched-on projects (up to {MAX_FEATURED}), in this order.
          Switch them all off to go back to the first {DEFAULT_FEATURED_COUNT}.
        </p>
        <p className={flaggedCount > MAX_FEATURED ? 'text-yellow-300' : undefined}>
          {flaggedCount === 0
            ? `Right now none are switched on, so Home shows the first ${DEFAULT_FEATURED_COUNT}.`
            : flaggedCount > MAX_FEATURED
              ? `${flaggedCount} are switched on, but Home shows at most ${MAX_FEATURED}: the first ${MAX_FEATURED} in this order.`
              : `${flaggedCount} switched on, so Home shows just those.`}
        </p>
      </div>

      <div className="flex gap-4">
        <button onClick={addProject} className={`${btnClass} w-full sm:w-auto`}><Plus className="size-4" /> Add Project</button>
      </div>

      {projects.map((project, index) => (
        <div key={project.id} className="border-2 border-white p-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <button onClick={() => setEditingId(editingId === project.id ? null : project.id)} className="font-heading text-lg uppercase tracking-widest hover:text-white/70 text-left min-h-[44px]">
              {project.title || 'Untitled'} <span className="text-muted-foreground text-sm ml-2">({project.year})</span>
            </button>
            <div className="flex gap-2">
              <button onClick={() => moveProject(project.id, -1)} disabled={index === 0} aria-label={`Move project ${project.title || 'Untitled'} up`} className={`${btnSmallClass} disabled:opacity-30 disabled:pointer-events-none`}><ArrowUp className="size-4" /></button>
              <button onClick={() => moveProject(project.id, 1)} disabled={index === projects.length - 1} aria-label={`Move project ${project.title || 'Untitled'} down`} className={`${btnSmallClass} disabled:opacity-30 disabled:pointer-events-none`}><ArrowDown className="size-4" /></button>
              <button onClick={() => setEditingId(editingId === project.id ? null : project.id)} className={`${btnSmallClass} flex-1 sm:flex-none`}>
                {editingId === project.id ? 'Collapse' : 'Edit'}
              </button>
              <button onClick={() => askDelete(`project "${project.title || 'Untitled'}"`, () => removeProject(project.id))} aria-label={`Delete project ${project.title || 'Untitled'}`} className={`${btnSmallClass} border-red-500 text-red-500 hover:bg-red-500 hover:text-black`}>
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
          <FeaturedSwitch
            project={project}
            shownOnHome={shownOnHome.has(project.id)}
            onChange={(on) => patchProject(project.id, () => ({ featured: on }))}
          />
          {editingId === project.id && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Title" value={project.title} onChange={v => updateProject(project.id, { title: v })} />
              <Field label="Slug" value={project.slug} onChange={v => updateProject(project.id, { slug: v })} />
              <div>
                <label htmlFor={`cat-${project.id}`} className="block font-heading text-xs uppercase tracking-widest mb-1">Category</label>
                <select id={`cat-${project.id}`} value={project.category} onChange={e => updateProject(project.id, { category: e.target.value as ProjectCategory })} className={inputClass}>
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
              <Field label="Client" value={project.client || ''} onChange={v => updateProject(project.id, { client: v })} />
              <PhotoField label="Cover Image" theme="dark" folder="sjmo/projects" value={project.coverImage} onChange={v => updateProject(project.id, { coverImage: v })} hint="Top photo of the project page and the project card" />
              <div className="md:col-span-2">
                <label className="block font-heading text-xs uppercase tracking-widest mb-1">Description</label>
                <textarea value={project.description} onChange={e => updateProject(project.id, { description: e.target.value })} className={textareaClass} />
              </div>
              <ProjectImagesEditor project={project} patch={(fn) => patchProject(project.id, fn)} askDelete={askDelete} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Bio Tab ── */
function BioTab({ info, setInfo }: { info: ArtistInfo; setInfo: (i: ArtistInfo) => void }) {
  const u = (k: keyof ArtistInfo, v: string) => setInfo({ ...info, [k]: v });
  return (
    <div className="space-y-6 max-w-3xl">
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
      <PhotoField label="Portrait Image" theme="dark" folder="sjmo/about" value={info.portraitImage} onChange={v => u('portraitImage', v)} />
      <Field label="Portrait Photo Credit" value={info.portraitCredit || ''} onChange={v => u('portraitCredit', v)} />
      <Field label="Education" value={info.education} onChange={v => u('education', v)} />

    </div>
  );
}

/* ── Contact Tab ── */
function ContactTab({ info, setInfo }: { info: ArtistInfo; setInfo: (i: ArtistInfo) => void }) {
  const u = (k: keyof ArtistInfo, v: string) => setInfo({ ...info, [k]: v });
  return (
    <div className="space-y-6 max-w-3xl">
      <Field label="Email" value={info.email} onChange={v => u('email', v)} />
      
      <Field label="Location" value={info.location} onChange={v => u('location', v)} />
      <Field label="Availability" value={info.availability} onChange={v => u('availability', v)} />
      <div className="border-t-4 border-white pt-6 space-y-4">
        <h3 className="font-heading text-xl uppercase tracking-widest">SOCIAL LINKS</h3>
        <Field label="Instagram" value={info.socialLinks.instagram || ''} onChange={v => setInfo({ ...info, socialLinks: { ...info.socialLinks, instagram: v } })} />
        <Field label="LinkedIn" value={info.socialLinks.linkedin || ''} onChange={v => setInfo({ ...info, socialLinks: { ...info.socialLinks, linkedin: v } })} />
        
        <Field label="Behance" value={info.socialLinks.behance || ''} onChange={v => setInfo({ ...info, socialLinks: { ...info.socialLinks, behance: v } })} />
      </div>
    </div>
  );
}

/* ── Skills & Methodology Tab ── */
function SkillsTab({ info, setInfo, askDelete }: { info: ArtistInfo; setInfo: (i: ArtistInfo) => void; askDelete: AskDelete }) {
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

      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-4">
          <h3 className="font-heading text-2xl uppercase tracking-widest">SKILLS</h3>
          <button onClick={addSkillGroup} className={btnClass}><Plus className="size-3" /> Group</button>
        </div>
        {info.skills.map((group, i) => (
          <div key={i} className="border-2 border-white p-4 space-y-3">
            <div className="flex justify-between items-center gap-3">
              <input value={group.label} onChange={e => updateSkillGroup(i, { label: e.target.value })} className={inputClass + ' max-w-xs'} aria-label="Group name" />
              <button onClick={() => askDelete(`skill group "${group.label || 'Untitled'}"`, () => removeSkillGroup(i))} aria-label="Delete skill group" className={btnDangerClass}><Trash2 className="size-4" /></button>
            </div>
            <div>
              <label className="block font-heading text-xs uppercase tracking-widest mb-1">Items (comma-separated)</label>
              <input value={group.items.join(', ')} onChange={e => updateSkillGroup(i, { items: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} className={inputClass} />
            </div>
          </div>
        ))}
      </div>

      <div className="border-t-4 border-white pt-8 space-y-6">
        <div className="flex flex-wrap items-center gap-4">
          <h3 className="font-heading text-2xl uppercase tracking-widest">METHODOLOGY</h3>
          <button onClick={addMethodology} className={btnClass}><Plus className="size-3" /> Card</button>
        </div>
        {info.methodology.map((item, i) => (
          <div key={i} className="border-2 border-white p-4 space-y-3">
            <div className="flex justify-between items-center gap-3">
              <input value={item.title} onChange={e => updateMethodology(i, { title: e.target.value })} className={inputClass + ' max-w-xs'} placeholder="Title" aria-label="Card title" />
              <button onClick={() => askDelete(`methodology card "${item.title || 'Untitled'}"`, () => removeMethodology(i))} aria-label="Delete methodology card" className={btnDangerClass}><Trash2 className="size-4" /></button>
            </div>
            <textarea value={item.description} onChange={e => updateMethodology(i, { description: e.target.value })} className={textareaClass} placeholder="Description" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Discography Tab ── */
function DiscographyTab({ info, setInfo, askDelete }: { info: ArtistInfo; setInfo: (i: ArtistInfo) => void; askDelete: AskDelete }) {
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
        <button onClick={add} className={`${btnClass} w-full sm:w-auto`}><Plus className="size-4" /> Add Entry</button>
      </div>
      {info.discography.map((entry, i) => (
        <div key={i} className="border-2 border-white p-4 grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
          <Field label="Project" value={entry.project} onChange={v => update(i, { project: v })} />
          <Field label="Release" value={entry.release} onChange={v => update(i, { release: v })} />
          <Field label="Role" value={entry.role} onChange={v => update(i, { role: v })} />
          <Field label="Studio / Label" value={entry.studioLabel} onChange={v => update(i, { studioLabel: v })} />
          <button onClick={() => askDelete(`discography entry "${entry.project || entry.release || 'Untitled'}"`, () => remove(i))} aria-label="Delete discography entry" className={btnDangerClass + ' self-end w-full md:w-auto'}><Trash2 className="size-4" /></button>
        </div>
      ))}
    </div>
  );
}

/* ── Experience Tab ── */
function ExperienceTab({ info, setInfo, askDelete }: { info: ArtistInfo; setInfo: (i: ArtistInfo) => void; askDelete: AskDelete }) {
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
        <button onClick={addSection} className={`${btnClass} w-full sm:w-auto`}><Plus className="size-4" /> Add Section</button>
      </div>
      {info.experience.map((section, si) => (
        <div key={si} className="border-2 border-white p-4 space-y-4">
          <div className="flex justify-between items-center gap-3">
            <input value={section.title} onChange={e => updateSection(si, { title: e.target.value })} className={inputClass + ' max-w-md'} aria-label="Section title" />
            <button onClick={() => askDelete(`experience section "${section.title || 'Untitled'}"`, () => removeSection(si))} aria-label="Delete experience section" className={btnDangerClass}><Trash2 className="size-4" /></button>
          </div>
          <div className="space-y-2">
            {section.items.map((item, ii) => (
              <div key={ii} className="flex gap-2">
                <input value={item} onChange={e => updateItem(si, ii, e.target.value)} className={inputClass} aria-label="Item" />
                <button onClick={() => askDelete(`item "${item || 'Empty'}"`, () => removeItem(si, ii))} aria-label="Delete item" className="text-red-500 border-2 border-red-500 min-h-[44px] min-w-[44px] inline-flex items-center justify-center shrink-0 hover:bg-red-500 hover:text-black transition-colors"><X className="size-4" /></button>
              </div>
            ))}
            <button onClick={() => addItem(si)} className={btnSmallClass}>+ Item</button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Reusable Field ── */
function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block font-heading text-xs uppercase tracking-widest mb-1">{label}</label>
      <input id={id} value={value} onChange={e => onChange(e.target.value)} className={inputClass} />
    </div>
  );
}
