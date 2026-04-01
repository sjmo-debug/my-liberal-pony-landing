import { useState, useEffect } from 'react';
import { useMLP, type MLPSiteData } from '@/contexts/MLPContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';

type Tab = 'videos' | 'social' | 'branding';

const tabs: { key: Tab; label: string }[] = [
  { key: 'videos', label: 'Videos' },
  { key: 'social', label: 'Social & Contact' },
  { key: 'branding', label: 'Branding' },
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
  const [activeTab, setActiveTab] = useState<Tab>('videos');
  const [draft, setDraft] = useState<MLPSiteData>(JSON.parse(JSON.stringify(siteData)));
  const [saving, setSaving] = useState(false);

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

  // Sync draft when siteData changes (e.g. after initial DB load)
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
          <h1 className="font-heading text-2xl uppercase tracking-widest text-center mb-8">
            MLP Admin
          </h1>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className={`${inputClass} mb-3`}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Password"
            className={inputClass}
          />
          {authError && (
            <p className="text-destructive-foreground mt-2 text-sm uppercase tracking-wider">
              {authError}
            </p>
          )}
          <button
            onClick={handleLogin}
            className="mt-4 w-full font-heading uppercase tracking-widest text-sm px-4 py-3 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-heading text-2xl md:text-3xl uppercase tracking-widest">
            MLP Admin
          </h1>
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="font-heading uppercase tracking-widest text-sm px-4 py-2 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
            <Link
              to="/"
              className="font-heading uppercase tracking-widest text-sm px-4 py-2 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors"
            >
              View Site
            </Link>
            <button
              onClick={handleLogout}
              className="font-heading uppercase tracking-widest text-sm px-4 py-2 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 mb-8 border-2 border-foreground">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 font-heading uppercase tracking-widest text-sm px-4 py-3 transition-colors ${
                activeTab === tab.key
                  ? 'bg-foreground text-background'
                  : 'hover:bg-foreground/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'videos' && (
            <>
              <Section title="Video 1 (Featured)">
                <Field
                  label="YouTube ID"
                  value={draft.videos[0].youtubeId}
                  onChange={(v) => {
                    const videos = [...draft.videos] as MLPSiteData['videos'];
                    videos[0] = { ...videos[0], youtubeId: v };
                    setDraft({ ...draft, videos });
                  }}
                  placeholder="e.g. FRDczkLqBes"
                />
                <Field
                  label="Title"
                  value={draft.videos[0].title}
                  onChange={(v) => {
                    const videos = [...draft.videos] as MLPSiteData['videos'];
                    videos[0] = { ...videos[0], title: v };
                    setDraft({ ...draft, videos });
                  }}
                />
              </Section>
              <Section title="Video 2">
                <Field
                  label="YouTube ID"
                  value={draft.videos[1].youtubeId}
                  onChange={(v) => {
                    const videos = [...draft.videos] as MLPSiteData['videos'];
                    videos[1] = { ...videos[1], youtubeId: v };
                    setDraft({ ...draft, videos });
                  }}
                />
                <Field
                  label="Title"
                  value={draft.videos[1].title}
                  onChange={(v) => {
                    const videos = [...draft.videos] as MLPSiteData['videos'];
                    videos[1] = { ...videos[1], title: v };
                    setDraft({ ...draft, videos });
                  }}
                />
              </Section>
              <Section title="SoundCloud">
                <Field
                  label="Embed URL"
                  value={draft.soundcloudEmbedUrl}
                  onChange={(v) => setDraft({ ...draft, soundcloudEmbedUrl: v })}
                  placeholder="Full SoundCloud player embed URL"
                />
              </Section>
            </>
          )}

          {activeTab === 'social' && (
            <>
              <Section title="Contact">
                <Field
                  label="Email"
                  value={draft.contactEmail}
                  onChange={(v) => setDraft({ ...draft, contactEmail: v })}
                />
              </Section>
              <Section title="Social Links">
                <Field
                  label="Instagram"
                  value={draft.socialLinks.instagram}
                  onChange={(v) =>
                    setDraft({ ...draft, socialLinks: { ...draft.socialLinks, instagram: v } })
                  }
                />
                <Field
                  label="SoundCloud"
                  value={draft.socialLinks.soundcloud}
                  onChange={(v) =>
                    setDraft({ ...draft, socialLinks: { ...draft.socialLinks, soundcloud: v } })
                  }
                />
                <Field
                  label="Bandcamp"
                  value={draft.socialLinks.bandcamp}
                  onChange={(v) =>
                    setDraft({ ...draft, socialLinks: { ...draft.socialLinks, bandcamp: v } })
                  }
                />
                <Field
                  label="YouTube"
                  value={draft.socialLinks.youtube}
                  onChange={(v) =>
                    setDraft({ ...draft, socialLinks: { ...draft.socialLinks, youtube: v } })
                  }
                />
              </Section>
            </>
          )}

          {activeTab === 'branding' && (
            <Section title="Branding">
              <Field
                label="Site Title"
                value={draft.branding.siteTitle}
                onChange={(v) =>
                  setDraft({ ...draft, branding: { ...draft.branding, siteTitle: v } })
                }
              />
              <Field
                label="Page Subtitle"
                value={draft.branding.pageSubtitle}
                onChange={(v) =>
                  setDraft({ ...draft, branding: { ...draft.branding, pageSubtitle: v } })
                }
              />
              <Field
                label="Cloudinary Logo ID"
                value={draft.branding.cloudinaryLogoId}
                onChange={(v) =>
                  setDraft({ ...draft, branding: { ...draft.branding, cloudinaryLogoId: v } })
                }
                placeholder="Leave empty to use local logo"
              />
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

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block font-body text-xs uppercase tracking-widest text-muted-foreground mb-1">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}
