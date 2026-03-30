import { useState } from 'react';
import { useMLP, type MLPSiteData } from '@/contexts/MLPContext';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

type Tab = 'videos' | 'social' | 'branding';

const tabs: { key: Tab; label: string }[] = [
  { key: 'videos', label: 'Videos' },
  { key: 'social', label: 'Social & Contact' },
  { key: 'branding', label: 'Branding' },
];

const inputClass =
  'w-full bg-background text-foreground border-2 border-foreground px-3 py-2 font-body text-sm focus:outline-none focus:bg-foreground/5 placeholder:text-muted-foreground uppercase tracking-wider';

// Same hash as SJMO admin
const ADMIN_PASSWORD_HASH =
  'b56704bedfca7eb60e352fd4d17d9f37d93d4646e37ae45bafa9de2564f31d68';

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export default function MLPAdmin() {
  const { siteData, updateSiteData } = useMLP();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('videos');
  const [draft, setDraft] = useState<MLPSiteData>(JSON.parse(JSON.stringify(siteData)));

  const handleLogin = async () => {
    const inputHash = await hashPassword(password);
    if (inputHash === ADMIN_PASSWORD_HASH) {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleSave = () => {
    updateSiteData(draft);
    toast.success('Changes applied (local preview only)');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-8">
        <div className="w-full max-w-md border-2 border-foreground p-8">
          <h1 className="font-heading text-2xl uppercase tracking-widest text-center mb-8">
            MLP Admin
          </h1>
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
              Invalid password
            </p>
          )}
          <button
            onClick={handleLogin}
            className="mt-4 w-full font-heading uppercase tracking-widest text-sm px-4 py-3 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors"
          >
            Enter
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
              className="font-heading uppercase tracking-widest text-sm px-4 py-2 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors"
            >
              Save
            </button>
            <Link
              to="/"
              className="font-heading uppercase tracking-widest text-sm px-4 py-2 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors"
            >
              View Site
            </Link>
          </div>
        </div>

        <p className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-8">
          Changes are local preview only — they reset on refresh.
        </p>

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
