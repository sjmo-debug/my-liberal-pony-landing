import { useState, useEffect, useMemo, useRef, useId } from 'react';
import { useMLP, type MLPSiteData, type MLPNavItem, type MLPGalleryItem, type MLPPressItem, type MLPAboutParagraph } from '@/contexts/MLPContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import SEO from '@/components/SEO';
import PhotoField from '@/components/admin/PhotoField';
import { useAboutContent } from '@/hooks/useAboutContent';
import { CONTENT_FIELDS, type ContentField, type ContentGroup, type ContentKey } from '@/lib/siteContent';

type Tab =
  | 'home' | 'about' | 'pages' | 'oumuamua' | 'seo'
  | 'spotlight' | 'gallery' | 'press' | 'videos' | 'social' | 'branding' | 'navigation' | 'gigs';

const tabs: { key: Tab; label: string }[] = [
  { key: 'spotlight', label: 'Featured Release' },
  { key: 'home', label: 'Home Page Text' },
  { key: 'about', label: 'About Page Text' },
  { key: 'pages', label: 'Listen & Gallery Text' },
  { key: 'oumuamua', label: 'Oumuamua Page' },
  { key: 'gallery', label: 'Gallery Photos' },
  { key: 'press', label: 'Press' },
  { key: 'videos', label: 'Videos' },
  { key: 'social', label: 'Social & Contact' },
  { key: 'branding', label: 'Branding' },
  { key: 'navigation', label: 'Menu Links' },
  { key: 'seo', label: 'Browser Tab & Google' },
  { key: 'gigs', label: 'Gigs' },
];

const GIG_SHEET_EDIT_URL = 'https://docs.google.com/spreadsheets/d/1zcS_vYBVjS2BYinxHFwEiygsGe5krgnRlC8z-2o8lLc/edit';

// text-base (16px) stops iPhones zooming in on focus; min-h-[44px] is the minimum comfortable tap size.
const inputClass =
  'w-full min-h-[44px] bg-background text-foreground border-2 border-foreground px-3 py-2 font-body text-base focus:outline-none focus:bg-foreground/5 placeholder:text-muted-foreground';

const btnClass =
  'font-heading uppercase tracking-widest text-sm px-4 py-2 min-h-[44px] border-2 border-foreground hover:bg-foreground hover:text-background transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-foreground inline-flex items-center justify-center text-center';

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

export default function MLPAdmin() {
  const { siteData, canSave, updateSiteData } = useMLP();
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const loginMode = searchParams.get('login') === '1';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('spotlight');
  const [draft, setDraft] = useState<MLPSiteData>(() => clone(siteData));
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ kind: 'idle' | 'saved' | 'error'; message: string }>({ kind: 'idle', message: '' });

  // What the database last gave us, as text. Used to tell whether there are unsaved edits.
  const [syncedJson, setSyncedJson] = useState(() => JSON.stringify(siteData));
  const syncedRef = useRef(syncedJson);
  const forceSync = useRef(false);
  const draftJson = useMemo(() => JSON.stringify(draft), [draft]);
  const dirty = draftJson !== syncedJson;

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthLoading(false);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Pull in new saved data (first load, or right after our own save) but never
  // throw away edits the owner is in the middle of making.
  useEffect(() => {
    const incoming = JSON.stringify(siteData);
    const previous = syncedRef.current;
    const force = forceSync.current;
    forceSync.current = false;
    setDraft((current) => (force || JSON.stringify(current) === previous ? JSON.parse(incoming) : current));
    syncedRef.current = incoming;
    setSyncedJson(incoming);
  }, [siteData]);

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

  const confirmLeave = (e: React.MouseEvent) => {
    if (dirty && !window.confirm('You have unsaved changes. Leave without saving?')) e.preventDefault();
  };

  const handleLogin = async () => {
    setAuthError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError(error.message);
  };

  const handleLogout = async () => {
    if (dirty && !window.confirm('You have unsaved changes. Sign out without saving?')) return;
    await supabase.auth.signOut();
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus({ kind: 'idle', message: '' });
    forceSync.current = true;
    try {
      await updateSiteData(draft);
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setStatus({ kind: 'saved', message: `Saved at ${time}. The live site now shows your changes.` });
      toast.success('Saved. The live site is updated.');
    } catch (err: unknown) {
      forceSync.current = false;
      const message = (err as { message?: string })?.message || 'Save failed. Nothing was changed. Try again.';
      setStatus({ kind: 'error', message });
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="font-heading uppercase tracking-widest text-sm">Loading…</p>
      </div>
    );
  }

  if (!session) {
    if (!loginMode) {
      return <Navigate to="/" replace />;
    }
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md border-2 border-foreground p-5 sm:p-8">
          <h1 className="font-heading text-2xl uppercase tracking-widest text-center mb-8">MLP Admin</h1>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" autoComplete="username" className={`${inputClass} mb-3`} />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} placeholder="Password" autoComplete="current-password" className={inputClass} />
          {authError && <p className="text-destructive-foreground mt-2 text-sm uppercase tracking-wider">{authError}</p>}
          <button onClick={handleLogin} className={`${btnClass} mt-4 w-full`}>Sign In</button>
        </div>
      </div>
    );
  }

  // ---- Draft helpers. They use the latest draft, so a photo upload finishing
  // late can never wipe out something typed in the meantime. ----
  const update = (fn: (d: MLPSiteData) => MLPSiteData) => setDraft((d) => fn(d));
  const setSpotlight = (patch: Partial<MLPSiteData['spotlight']>) => update((d) => ({ ...d, spotlight: { ...d.spotlight, ...patch } }));
  const setBranding = (patch: Partial<MLPSiteData['branding']>) => update((d) => ({ ...d, branding: { ...d.branding, ...patch } }));
  const setSocial = (patch: Partial<MLPSiteData['socialLinks']>) => update((d) => ({ ...d, socialLinks: { ...d.socialLinks, ...patch } }));
  const setVideo = (i: 0 | 1, patch: Partial<MLPSiteData['videos'][0]>) =>
    update((d) => {
      const videos = [...d.videos] as MLPSiteData['videos'];
      videos[i] = { ...videos[i], ...patch };
      return { ...d, videos };
    });
  const setContent = (key: ContentKey, value: string) => update((d) => ({ ...d, content: { ...d.content, [key]: value } }));

  const addNavItem = () => update((d) => ({ ...d, navigation: [...d.navigation, { label: '', url: '', isExternal: false }] }));
  const removeNavItem = (index: number) => update((d) => ({ ...d, navigation: d.navigation.filter((_, i) => i !== index) }));
  const updateNavItem = (index: number, field: keyof MLPNavItem, value: string | boolean) =>
    update((d) => {
      const navigation = [...d.navigation];
      navigation[index] = { ...navigation[index], [field]: value };
      return { ...d, navigation };
    });

  const updateGallery = (index: number, patch: Partial<MLPGalleryItem>) =>
    update((d) => {
      const gallery = [...d.gallery];
      gallery[index] = { ...gallery[index], ...patch };
      return { ...d, gallery };
    });
  const moveGallery = (index: number, dir: -1 | 1) =>
    update((d) => {
      const j = index + dir;
      if (j < 0 || j >= d.gallery.length) return d;
      const gallery = [...d.gallery];
      [gallery[index], gallery[j]] = [gallery[j], gallery[index]];
      return { ...d, gallery };
    });
  const updatePress = (index: number, patch: Partial<MLPPressItem>) =>
    update((d) => {
      const press = [...d.press];
      press[index] = { ...press[index], ...patch };
      return { ...d, press };
    });

  const contentTab = (group: ContentGroup) => (
    <ContentEditor group={group} draft={draft} onChange={setContent} />
  );

  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-4 sm:p-6 md:p-12 pb-40 overflow-x-hidden">
      <SEO title="MLP Admin" description="Admin panel" path="/admin" noindex />
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-8">
          <h1 className="font-heading text-2xl md:text-3xl uppercase tracking-widest">MLP Admin</h1>
          <div className="grid grid-cols-2 sm:flex gap-3">
            <Link to="/" onClick={confirmLeave} className={btnClass}>View Site</Link>
            <button onClick={handleLogout} className={btnClass}>Sign Out</button>
          </div>
        </div>

        {!canSave && (
          <div role="alert" className="border-2 border-foreground p-4 mb-4 font-body text-base">
            Could not load the saved site content, so saving is switched off to protect what is already there.
            Check your connection, then reload this page.
          </div>
        )}

        {/* Phone: one dropdown. Larger screens: row of buttons. */}
        <div className="sm:hidden mb-4">
          <label htmlFor="admin-section" className="block font-heading text-xs uppercase tracking-widest text-muted-foreground mb-1">Section</label>
          <select
            id="admin-section"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as Tab)}
            className={`${inputClass} font-heading uppercase tracking-widest`}
          >
            {tabs.map((tab) => (
              <option key={tab.key} value={tab.key}>{tab.label}</option>
            ))}
          </select>
        </div>
        <div className="hidden sm:flex gap-0 mb-8 border-2 border-foreground flex-wrap">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex-1 font-heading uppercase tracking-widest text-sm px-4 py-3 min-h-[44px] transition-colors ${activeTab === tab.key ? 'bg-foreground text-background' : 'hover:bg-foreground/10'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {activeTab === 'spotlight' && (
            <Section title="Featured Release">
              <Field label="Section Header" value={draft.spotlight.header} onChange={(v) => setSpotlight({ header: v })} placeholder="e.g. New Single" />
              <Field label="Release Title" value={draft.spotlight.title} onChange={(v) => setSpotlight({ title: v })} placeholder="e.g. OUMUAMUA" />
              <Field label="Spotify Track URL" value={draft.spotlight.spotifyUrl} onChange={(v) => setSpotlight({ spotifyUrl: v })} placeholder="https://open.spotify.com/track/..." url />
              <Field label="Spotify Embed URL" value={draft.spotlight.spotifyEmbedUrl} onChange={(v) => setSpotlight({ spotifyEmbedUrl: v })} placeholder="https://open.spotify.com/embed/track/..." url />
              <Field label="Description" value={draft.spotlight.description} onChange={(v) => setSpotlight({ description: v })} placeholder="e.g. Debut single out now" multiline />
              <Field label="CTA Button Text" value={draft.spotlight.ctaText} onChange={(v) => setSpotlight({ ctaText: v })} placeholder="e.g. Listen on Spotify" />
              <Field label="Press Badge Label" value={draft.spotlight.pressBadgeLabel} onChange={(v) => setSpotlight({ pressBadgeLabel: v })} placeholder="e.g. As heard on" />
              <PhotoField label="Cover Image" value={draft.spotlight.coverImage || ''} onChange={(v) => setSpotlight({ coverImage: v })} folder="mlp/spotlight" />
            </Section>
          )}

          {activeTab === 'home' && contentTab('home')}
          {activeTab === 'pages' && contentTab('pages')}
          {activeTab === 'oumuamua' && contentTab('oumuamua')}
          {activeTab === 'seo' && (
            <>
              {contentTab('seo')}
              <Note>
                These change the browser tab title and the text Google shows, once the page has loaded.
                Link previews on WhatsApp, Instagram, Facebook and similar apps, and Google&apos;s very first look at a page,
                still use the original wording built into the site. Changing those needs a developer.
              </Note>
            </>
          )}

          {activeTab === 'about' && (
            <>
              {contentTab('about')}
              <AboutEditor
                paragraphs={draft.aboutParagraphs}
                onChange={(aboutParagraphs) => update((d) => ({ ...d, aboutParagraphs }))}
              />
            </>
          )}

          {activeTab === 'gallery' && (
            <Section title="Gallery Photos">
              {draft.gallery.map((item, i) => (
                <div key={i} className="border-2 border-foreground/30 p-3 sm:p-4 space-y-3">
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <span className="font-heading text-sm uppercase tracking-widest">Photo {i + 1}</span>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => moveGallery(i, -1)} disabled={i === 0} className={btnClass}>Up</button>
                      <button onClick={() => moveGallery(i, 1)} disabled={i === draft.gallery.length - 1} className={btnClass}>Down</button>
                      <button onClick={() => update((d) => ({ ...d, gallery: d.gallery.filter((_, k) => k !== i) }))} className={btnClass}>Remove</button>
                    </div>
                  </div>
                  <PhotoField label="Image" value={item.image} onChange={(v) => updateGallery(i, { image: v })} folder="mlp/gallery" />
                  <Field label="Description (alt text)" value={item.alt} onChange={(v) => updateGallery(i, { alt: v })} placeholder="Describe the photo for screen readers" />
                </div>
              ))}
              <button onClick={() => update((d) => ({ ...d, gallery: [...d.gallery, { image: '', alt: '' }] }))} className={`${btnClass} w-full`}>
                + Add Photo
              </button>
            </Section>
          )}

          {activeTab === 'press' && (
            <Section title="Press and Radio">
              {draft.press.map((item, i) => (
                <div key={i} className="border-2 border-foreground/30 p-3 sm:p-4 space-y-3">
                  <div className="flex justify-between items-center gap-2">
                    <span className="font-heading text-sm uppercase tracking-widest">Item {i + 1}</span>
                    <button onClick={() => update((d) => ({ ...d, press: d.press.filter((_, k) => k !== i) }))} className={btnClass}>Remove</button>
                  </div>
                  <Field label="Title" value={item.title} onChange={(v) => updatePress(i, { title: v })} />
                  <Field label="Source" value={item.source} onChange={(v) => updatePress(i, { source: v })} placeholder="e.g. BBC Introducing" />
                  <Field label="Link" value={item.url} onChange={(v) => updatePress(i, { url: v })} placeholder="https://..." url />
                  <Field label="Date (YYYY-MM-DD)" value={item.date} onChange={(v) => updatePress(i, { date: v })} placeholder="2026-07-04" />
                  <PhotoField label="Image (optional)" value={item.image || ''} onChange={(v) => updatePress(i, { image: v })} folder="mlp/press" />
                </div>
              ))}
              <button onClick={() => update((d) => ({ ...d, press: [...d.press, { title: '', source: '', url: '', date: '' }] }))} className={`${btnClass} w-full`}>
                + Add Press Item
              </button>
            </Section>
          )}

          {activeTab === 'videos' && (
            <>
              <Section title="Video 1 (Featured)">
                <Field label="YouTube ID" value={draft.videos[0].youtubeId} onChange={(v) => setVideo(0, { youtubeId: v })} placeholder="e.g. FRDczkLqBes" />
                <Field label="Title" value={draft.videos[0].title} onChange={(v) => setVideo(0, { title: v })} />
              </Section>
              <Section title="Video 2">
                <Field label="YouTube ID" value={draft.videos[1].youtubeId} onChange={(v) => setVideo(1, { youtubeId: v })} />
                <Field label="Title" value={draft.videos[1].title} onChange={(v) => setVideo(1, { title: v })} />
              </Section>
              <Section title="SoundCloud">
                <Field label="Embed URL" value={draft.soundcloudEmbedUrl} onChange={(v) => update((d) => ({ ...d, soundcloudEmbedUrl: v }))} placeholder="Full SoundCloud player embed URL" url />
              </Section>
            </>
          )}

          {activeTab === 'social' && (
            <>
              <Section title="Contact">
                <Field label="Email" value={draft.contactEmail} onChange={(v) => update((d) => ({ ...d, contactEmail: v }))} email />
              </Section>
              <Section title="Social Links">
                <Field label="Instagram" value={draft.socialLinks.instagram} onChange={(v) => setSocial({ instagram: v })} url />
                <Field label="SoundCloud" value={draft.socialLinks.soundcloud} onChange={(v) => setSocial({ soundcloud: v })} url />
                <Field label="Bandcamp" value={draft.socialLinks.bandcamp} onChange={(v) => setSocial({ bandcamp: v })} url />
                <Field label="YouTube" value={draft.socialLinks.youtube} onChange={(v) => setSocial({ youtube: v })} url />
                <Field label="Buy Me a Coffee" value={draft.socialLinks.buyMeACoffee} onChange={(v) => setSocial({ buyMeACoffee: v })} placeholder="https://buymeacoffee.com/..." url />
              </Section>
            </>
          )}

          {activeTab === 'branding' && (
            <Section title="Branding">
              <Field label="Site Title" value={draft.branding.siteTitle} onChange={(v) => setBranding({ siteTitle: v })} />
              <Field label="Tagline (under the main headline)" value={draft.branding.tagline} onChange={(v) => setBranding({ tagline: v })} placeholder="e.g. EXPERIMENTAL FREAK POP. LOUDER IN PERSON." />
              <Field label="Page Subtitle" value={draft.branding.pageSubtitle} onChange={(v) => setBranding({ pageSubtitle: v })} />
              <PhotoField label="Logo (empty = built-in logo)" value={draft.branding.cloudinaryLogoId} onChange={(v) => setBranding({ cloudinaryLogoId: v })} folder="mlp/branding" />
              <PhotoField label="Home Hero Photo" value={draft.branding.heroImage || ''} onChange={(v) => setBranding({ heroImage: v })} folder="mlp/hero" hint="Wide landscape photos work best" />
              <Field label="Photo Credit (footer)" value={draft.branding.photoCredit} onChange={(v) => setBranding({ photoCredit: v })} placeholder="e.g. Jane Doe" />
            </Section>
          )}

          {activeTab === 'navigation' && (
            <Section title="Menu Links (top of home page)">
              {draft.navigation.map((item, i) => (
                <div key={i} className="border-2 border-foreground/30 p-3 sm:p-4 space-y-3">
                  <div className="flex justify-between items-center gap-2">
                    <span className="font-heading text-sm uppercase tracking-widest">Link {i + 1}</span>
                    <button onClick={() => removeNavItem(i)} className={btnClass}>Remove</button>
                  </div>
                  <Field label="Label" value={item.label} onChange={(v) => updateNavItem(i, 'label', v)} placeholder="e.g. About" />
                  <Field label="URL" value={item.url} onChange={(v) => updateNavItem(i, 'url', v)} placeholder="e.g. /about or https://..." url />
                  <label className="flex items-center gap-3 min-h-[44px] cursor-pointer">
                    <input type="checkbox" checked={item.isExternal} onChange={(e) => updateNavItem(i, 'isExternal', e.target.checked)} className="w-6 h-6 accent-foreground shrink-0" />
                    <span className="font-body text-sm uppercase tracking-widest text-muted-foreground">External link (opens in new tab)</span>
                  </label>
                </div>
              ))}
              <button onClick={addNavItem} className={`${btnClass} w-full`}>
                + Add Menu Link
              </button>
            </Section>
          )}

          {activeTab === 'gigs' && (
            <Section title="Gigs">
              <p className="font-body text-base leading-relaxed">
                The gig list on the website is read from a Google Sheet, not from this admin. Edit it in the
                Google Sheets app on your phone and the site updates within about a minute.
              </p>
              <ul className="font-body text-sm leading-relaxed list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Open the first tab of the sheet.</li>
                <li>Columns: A date (day/month/year, for example 24/10/26), B venue, C city, D button text, E ticket link, F photo ID (past gigs only).</li>
                <li>Past dates move to &quot;Previously&quot; automatically.</li>
              </ul>
              <a href={GIG_SHEET_EDIT_URL} target="_blank" rel="noopener noreferrer" className={`${btnClass} w-full`}>
                Open the gig sheet
              </a>
            </Section>
          )}
        </div>
      </div>

      {/* Always-visible save bar */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-background border-t-2 border-foreground px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center gap-3">
          <p
            role="status"
            aria-live="polite"
            className={`flex-1 font-body text-sm leading-snug break-words ${
              status.kind === 'error' ? 'text-red-400' : status.kind === 'saved' && !dirty ? 'text-green-400' : dirty ? 'text-yellow-300' : 'text-muted-foreground'
            }`}
          >
            {status.kind === 'error'
              ? `Not saved: ${status.message}`
              : dirty
                ? 'You have unsaved changes.'
                : status.kind === 'saved'
                  ? status.message
                  : 'No changes yet.'}
          </p>
          <button
            onClick={handleSave}
            disabled={saving || !dirty || !canSave}
            className="font-heading uppercase tracking-widest text-base px-6 py-3 min-h-[48px] w-full sm:w-auto sm:min-w-[160px] bg-foreground text-background border-2 border-foreground hover:bg-background hover:text-foreground transition-colors disabled:opacity-40 disabled:hover:bg-foreground disabled:hover:text-background"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ContentEditor({ group, draft, onChange }: { group: ContentGroup; draft: MLPSiteData; onChange: (key: ContentKey, value: string) => void }) {
  const fields = CONTENT_FIELDS.filter((field) => field.group === group) as readonly ContentField[];
  const sections: string[] = [];
  fields.forEach((field) => {
    if (!sections.includes(field.section)) sections.push(field.section);
  });
  return (
    <>
      <Note>Leave a box empty and the standard wording is used. Changes go live when you tap Save.</Note>
      {sections.map((section) => (
        <Section key={section} title={section}>
          {fields
            .filter((field) => field.section === section)
            .map((field) => {
              const value = draft.content[field.key as ContentKey] ?? '';
              const key = field.key as ContentKey;
              if (field.kind === 'image') {
                return <PhotoField key={field.key} label={field.label} value={value} onChange={(v) => onChange(key, v)} folder="mlp/oumuamua" hint={field.hint} />;
              }
              return (
                <Field
                  key={field.key}
                  label={field.label}
                  value={value}
                  onChange={(v) => onChange(key, v)}
                  placeholder={field.default}
                  hint={field.hint}
                  multiline={field.kind === 'textarea'}
                  url={field.kind === 'url'}
                />
              );
            })}
        </Section>
      ))}
    </>
  );
}

function AboutEditor({ paragraphs, onChange }: { paragraphs: MLPAboutParagraph[]; onChange: (p: MLPAboutParagraph[]) => void }) {
  const { data: current } = useAboutContent();

  const set = (i: number, patch: Partial<MLPAboutParagraph>) => {
    const next = [...paragraphs];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  };
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= paragraphs.length) return;
    const next = [...paragraphs];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const copyCurrent = () => {
    if (!current?.length) {
      toast.error('The current text has not loaded yet. Wait a moment and try again.');
      return;
    }
    if (paragraphs.length > 0 && !window.confirm('Replace what is in the boxes with the text currently on the About page?')) return;
    onChange(current.map((e) => ({ text: e.text, italic: e.italic })));
  };

  return (
    <Section title="About page text">
      <p className="font-body text-sm leading-relaxed text-muted-foreground">
        {paragraphs.length === 0
          ? 'Right now the About page text comes from the Google Sheet. To edit it here instead, tap "Copy current text here" and then change it. When you save, the text in this admin is used instead of the sheet.'
          : 'The About page is showing the text below, not the Google Sheet. Remove every paragraph and save to go back to the sheet.'}
      </p>
      {paragraphs.map((p, i) => (
        <div key={i} className="border-2 border-foreground/30 p-3 sm:p-4 space-y-3">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <span className="font-heading text-sm uppercase tracking-widest">Paragraph {i + 1}</span>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => move(i, -1)} disabled={i === 0} className={btnClass}>Up</button>
              <button onClick={() => move(i, 1)} disabled={i === paragraphs.length - 1} className={btnClass}>Down</button>
              <button onClick={() => onChange(paragraphs.filter((_, k) => k !== i))} className={btnClass}>Remove</button>
            </div>
          </div>
          <Field label="Text" value={p.text} onChange={(v) => set(i, { text: v })} multiline />
          <label className="flex items-center gap-3 min-h-[44px] cursor-pointer">
            <input type="checkbox" checked={p.italic} onChange={(e) => set(i, { italic: e.target.checked })} className="w-6 h-6 accent-foreground shrink-0" />
            <span className="font-body text-sm uppercase tracking-widest text-muted-foreground">Show in italics</span>
          </label>
        </div>
      ))}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button onClick={copyCurrent} className={btnClass}>Copy current text here</button>
        <button onClick={() => onChange([...paragraphs, { text: '', italic: false }])} className={btnClass}>+ Add paragraph</button>
      </div>
    </Section>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return <p className="font-body text-sm leading-relaxed text-muted-foreground border-l-4 border-foreground/40 pl-3">{children}</p>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-2 border-foreground p-4 sm:p-6 space-y-4">
      <h2 className="font-heading text-lg uppercase tracking-widest">{title}</h2>
      {children}
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  multiline?: boolean;
  url?: boolean;
  email?: boolean;
}

function Field({ label, value, onChange, placeholder, hint, multiline, url, email }: FieldProps) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block font-body text-xs uppercase tracking-widest text-muted-foreground mb-1">{label}</label>
      {multiline ? (
        <textarea id={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={4} className={`${inputClass} resize-y`} />
      ) : (
        <input
          id={id}
          type={email ? 'email' : url ? 'url' : 'text'}
          inputMode={email ? 'email' : url ? 'url' : undefined}
          autoCapitalize={url || email ? 'none' : undefined}
          autoCorrect={url || email ? 'off' : undefined}
          spellCheck={url || email ? false : undefined}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputClass}
        />
      )}
      {hint && <p className="font-body text-xs text-muted-foreground mt-1 leading-snug">{hint}</p>}
    </div>
  );
}
