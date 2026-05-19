import { useState, useEffect } from 'react';
import { useMLP, type MLPSiteData, type MLPPressItem, type MLPNavItem } from '@/contexts/MLPContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import SEO from '@/components/SEO';

type Tab = 'spotlight' | 'videos' | 'social' | 'press' | 'branding' | 'navigation';

const tabs: { key: Tab; label: string }[] = [
  { key: 'spotlight', label: 'Spotlight' },
  { key: 'videos', label: 'Videos' },
  { key: 'social', label: 'Social & Contact' },
  { key: 'press', label: 'Press' },
  { key: 'branding', label: 'Branding' },
  { key: 'navigation', label: 'Navigation' },
];

const inputClass =
  'w-full bg-background text-foreground border-2 border-foreground px-3 py-2 font-body text-sm focus:outline-none focus:bg-foreground/5 placeholder:text-muted-foreground uppercase tracking-wider';

export default function MLPAdmin() {
  const { siteData, updateSiteData } = useMLP();
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('spotlight');
  const [draft, setDraft] = useState<MLPSiteData>(JSON.parse(JSON.stringify(siteData)));
  const [saving, setSaving] = useState(false);

  // Render noindex on admin so it's never crawled

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

  useEffect(() => {
    setDraft(JSON.parse(JSON.stringify(siteData)));
  }, [siteData]);

  const handleLogin = async () => {
    setAuthError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError(error.message);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSiteData(draft);
      toast.success('Changes saved to database');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
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
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-8">
        <div className="w-full max-w-md border-2 border-foreground p-8">
          <h1 className="font-heading text-2xl uppercase tracking-widest text-center mb-8">MLP Admin</h1>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className={`${inputClass} mb-3`} />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} placeholder="Password" className={inputClass} />
          {authError && <p className="text-destructive-foreground mt-2 text-sm uppercase tracking-wider">{authError}</p>}
          <button onClick={handleLogin} className="mt-4 w-full font-heading uppercase tracking-widest text-sm px-4 py-3 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors">Sign In</button>
        </div>
      </div>
    );
  }

  const addPressItem = () => {
    setDraft({
      ...draft,
      press: [...draft.press, { title: '', url: '', source: '', date: '' }],
    });
  };

  const removePressItem = (index: number) => {
    setDraft({
      ...draft,
      press: draft.press.filter((_, i) => i !== index),
    });
  };

  const updatePressItem = (index: number, field: keyof MLPPressItem, value: string) => {
    const press = [...draft.press];
    press[index] = { ...press[index], [field]: value };
    setDraft({ ...draft, press });
  };

  const addNavItem = () => {
    setDraft({
      ...draft,
      navigation: [...draft.navigation, { label: '', url: '', isExternal: false }],
    });
  };

  const removeNavItem = (index: number) => {
    setDraft({
      ...draft,
      navigation: draft.navigation.filter((_, i) => i !== index),
    });
  };

  const updateNavItem = (index: number, field: keyof MLPNavItem, value: string | boolean) => {
    const navigation = [...draft.navigation];
    navigation[index] = { ...navigation[index], [field]: value };
    setDraft({ ...draft, navigation });
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-heading text-2xl md:text-3xl uppercase tracking-widest">MLP Admin</h1>
          <div className="flex gap-4">
            <button onClick={handleSave} disabled={saving} className="font-heading uppercase tracking-widest text-sm px-4 py-2 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors disabled:opacity-50">
              {saving ? 'Saving…' : 'Save'}
            </button>
            <Link to="/" className="font-heading uppercase tracking-widest text-sm px-4 py-2 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors">View Site</Link>
            <button onClick={handleLogout} className="font-heading uppercase tracking-widest text-sm px-4 py-2 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors">Sign Out</button>
          </div>
        </div>

        <div className="flex gap-0 mb-8 border-2 border-foreground flex-wrap">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex-1 font-heading uppercase tracking-widest text-sm px-4 py-3 transition-colors ${activeTab === tab.key ? 'bg-foreground text-background' : 'hover:bg-foreground/10'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {activeTab === 'spotlight' && (
            <Section title="Featured Release">
              <Field label="Section Header" value={draft.spotlight.header} onChange={(v) => setDraft({ ...draft, spotlight: { ...draft.spotlight, header: v } })} placeholder="e.g. New Single" />
              <Field label="Release Title" value={draft.spotlight.title} onChange={(v) => setDraft({ ...draft, spotlight: { ...draft.spotlight, title: v } })} placeholder="e.g. Fingerprints" />
              <Field label="Spotify Track URL" value={draft.spotlight.spotifyUrl} onChange={(v) => setDraft({ ...draft, spotlight: { ...draft.spotlight, spotifyUrl: v } })} placeholder="https://open.spotify.com/track/..." />
              <Field label="Spotify Embed URL" value={draft.spotlight.spotifyEmbedUrl} onChange={(v) => setDraft({ ...draft, spotlight: { ...draft.spotlight, spotifyEmbedUrl: v } })} placeholder="https://open.spotify.com/embed/track/..." />
              <Field label="Description" value={draft.spotlight.description} onChange={(v) => setDraft({ ...draft, spotlight: { ...draft.spotlight, description: v } })} placeholder="e.g. Debut single out now" />
              <Field label="CTA Button Text" value={draft.spotlight.ctaText} onChange={(v) => setDraft({ ...draft, spotlight: { ...draft.spotlight, ctaText: v } })} placeholder="e.g. Listen on Spotify" />
              <Field label="Press Badge Label" value={draft.spotlight.pressBadgeLabel} onChange={(v) => setDraft({ ...draft, spotlight: { ...draft.spotlight, pressBadgeLabel: v } })} placeholder="e.g. As heard on" />
            </Section>
          )}

          {activeTab === 'videos' && (
            <>
              <Section title="Video 1 (Featured)">
                <Field label="YouTube ID" value={draft.videos[0].youtubeId} onChange={(v) => { const videos = [...draft.videos] as MLPSiteData['videos']; videos[0] = { ...videos[0], youtubeId: v }; setDraft({ ...draft, videos }); }} placeholder="e.g. FRDczkLqBes" />
                <Field label="Title" value={draft.videos[0].title} onChange={(v) => { const videos = [...draft.videos] as MLPSiteData['videos']; videos[0] = { ...videos[0], title: v }; setDraft({ ...draft, videos }); }} />
              </Section>
              <Section title="Video 2">
                <Field label="YouTube ID" value={draft.videos[1].youtubeId} onChange={(v) => { const videos = [...draft.videos] as MLPSiteData['videos']; videos[1] = { ...videos[1], youtubeId: v }; setDraft({ ...draft, videos }); }} />
                <Field label="Title" value={draft.videos[1].title} onChange={(v) => { const videos = [...draft.videos] as MLPSiteData['videos']; videos[1] = { ...videos[1], title: v }; setDraft({ ...draft, videos }); }} />
              </Section>
              <Section title="SoundCloud">
                <Field label="Embed URL" value={draft.soundcloudEmbedUrl} onChange={(v) => setDraft({ ...draft, soundcloudEmbedUrl: v })} placeholder="Full SoundCloud player embed URL" />
              </Section>
            </>
          )}

          {activeTab === 'social' && (
            <>
              <Section title="Contact">
                <Field label="Email" value={draft.contactEmail} onChange={(v) => setDraft({ ...draft, contactEmail: v })} />
              </Section>
              <Section title="Social Links">
                <Field label="Instagram" value={draft.socialLinks.instagram} onChange={(v) => setDraft({ ...draft, socialLinks: { ...draft.socialLinks, instagram: v } })} />
                <Field label="SoundCloud" value={draft.socialLinks.soundcloud} onChange={(v) => setDraft({ ...draft, socialLinks: { ...draft.socialLinks, soundcloud: v } })} />
                <Field label="Bandcamp" value={draft.socialLinks.bandcamp} onChange={(v) => setDraft({ ...draft, socialLinks: { ...draft.socialLinks, bandcamp: v } })} />
                <Field label="YouTube" value={draft.socialLinks.youtube} onChange={(v) => setDraft({ ...draft, socialLinks: { ...draft.socialLinks, youtube: v } })} />
              </Section>
            </>
          )}

          {activeTab === 'press' && (
            <Section title="Press & Media">
              {draft.press.map((item, i) => (
                <div key={i} className="border-2 border-foreground/30 p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-heading text-sm uppercase tracking-widest">Item {i + 1}</span>
                    <button onClick={() => removePressItem(i)} className="font-heading uppercase tracking-widest text-xs px-3 py-1 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors">Remove</button>
                  </div>
                  <Field label="Source" value={item.source} onChange={(v) => updatePressItem(i, 'source', v)} placeholder="e.g. BBC Introducing" />
                  <Field label="Title" value={item.title} onChange={(v) => updatePressItem(i, 'title', v)} placeholder="e.g. Interview segment title" />
                  <Field label="URL" value={item.url} onChange={(v) => updatePressItem(i, 'url', v)} placeholder="https://..." />
                  <Field label="Date" value={item.date} onChange={(v) => updatePressItem(i, 'date', v)} placeholder="YYYY-MM-DD" />
                </div>
              ))}
              <button onClick={addPressItem} className="w-full font-heading uppercase tracking-widest text-sm px-4 py-3 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors">
                + Add Press Item
              </button>
            </Section>
          )}

          {activeTab === 'branding' && (
            <Section title="Branding">
              <Field label="Site Title" value={draft.branding.siteTitle} onChange={(v) => setDraft({ ...draft, branding: { ...draft.branding, siteTitle: v } })} />
              <Field label="Page Subtitle" value={draft.branding.pageSubtitle} onChange={(v) => setDraft({ ...draft, branding: { ...draft.branding, pageSubtitle: v } })} />
              <Field label="Cloudinary Logo ID" value={draft.branding.cloudinaryLogoId} onChange={(v) => setDraft({ ...draft, branding: { ...draft.branding, cloudinaryLogoId: v } })} placeholder="Leave empty to use local logo" />
            </Section>
          )}

          {activeTab === 'navigation' && (
            <Section title="Navigation Bar">
              {draft.navigation.map((item, i) => (
                <div key={i} className="border-2 border-foreground/30 p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-heading text-sm uppercase tracking-widest">Link {i + 1}</span>
                    <button onClick={() => removeNavItem(i)} className="font-heading uppercase tracking-widest text-xs px-3 py-1 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors">Remove</button>
                  </div>
                  <Field label="Label" value={item.label} onChange={(v) => updateNavItem(i, 'label', v)} placeholder="e.g. About" />
                  <Field label="URL" value={item.url} onChange={(v) => updateNavItem(i, 'url', v)} placeholder="e.g. /about or https://..." />
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={item.isExternal} onChange={(e) => updateNavItem(i, 'isExternal', e.target.checked)} className="w-4 h-4 accent-foreground" />
                    <label className="font-body text-xs uppercase tracking-widest text-muted-foreground">External link (opens in new tab)</label>
                  </div>
                </div>
              ))}
              <button onClick={addNavItem} className="w-full font-heading uppercase tracking-widest text-sm px-4 py-3 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors">
                + Add Nav Link
              </button>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-2 border-foreground p-6 space-y-4">
      <h2 className="font-heading text-lg uppercase tracking-widest">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block font-body text-xs uppercase tracking-widest text-muted-foreground mb-1">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={inputClass} />
    </div>
  );
}
