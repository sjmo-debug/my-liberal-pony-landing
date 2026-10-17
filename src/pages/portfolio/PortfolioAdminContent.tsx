import { useId } from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import PhotoField from '@/components/admin/PhotoField';
import { portfolioProjectTypes, type ArtistInfo } from '@/types/portfolio';
import {
  PORTFOLIO_CONTENT_FIELDS,
  DEFAULT_PORTFOLIO_CONTENT,
  setPortfolioContentValue,
  type PortfolioContentGroup,
  type PortfolioContentKey,
} from '@/lib/portfolioContent';

/** Editors for the portfolio's page wording, hero photo and About lists. Used by PortfolioAdmin. */

type SetInfo = (i: ArtistInfo) => void;
type AskDelete = (what: string, onConfirm: () => void) => void;

const inputClass = "w-full min-h-[44px] bg-black text-white border-2 border-white px-3 py-2 font-mono text-base focus:outline-none focus:bg-white/5 placeholder:text-white/30";
const textareaClass = "w-full bg-black text-white border-2 border-white px-3 py-2 font-mono text-base focus:outline-none focus:bg-white/5 placeholder:text-white/30 min-h-[100px] resize-y";
const btnClass = "font-heading uppercase tracking-widest text-sm px-4 py-2 min-h-[44px] border-2 border-white hover:bg-white hover:text-black transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-30 disabled:pointer-events-none";
const btnDangerClass = "font-heading uppercase tracking-widest text-sm px-4 py-2 min-h-[44px] min-w-[44px] border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-black transition-colors inline-flex items-center justify-center gap-2";
const labelClass = "block font-heading text-xs uppercase tracking-widest mb-1";

function Note({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-sm leading-relaxed text-white/70">{children}</p>;
}

/* ── Hero & Photos ── */
export function HeroTab({ info, setInfo }: { info: ArtistInfo; setInfo: SetInfo }) {
  const setHero = (v: string) => {
    const next = { ...info };
    if (v.trim()) next.heroImage = v;
    else delete next.heroImage;
    setInfo(next);
  };
  const id = useId();
  return (
    <div className="space-y-6 max-w-3xl">
      <Note>
        This is the big photo behind the headline on the Home page. With no photo the Home page shows plain black.
        On a phone, tap Upload photo and pick one from your camera roll. Tap Save at the bottom to make it live.
      </Note>
      <PhotoField label="Hero photo" theme="dark" folder="sjmo/hero" value={info.heroImage ?? ''} onChange={setHero} hint="Landscape photos work best. Text sits over the left side." />
      <div>
        <label htmlFor={id} className={labelClass}>Hero photo credit</label>
        <input
          id={id}
          value={info.heroCredit ?? ''}
          onChange={(e) => setInfo({ ...info, heroCredit: e.target.value })}
          className={inputClass}
        />
      </div>
    </div>
  );
}

/* ── Wording tabs (Home, Menu & Projects, About headings, Contact & Form) ── */
export function TextTab({ group, info, setInfo }: { group: PortfolioContentGroup; info: ArtistInfo; setInfo: SetInfo }) {
  const fields = PORTFOLIO_CONTENT_FIELDS.filter((field) => field.group === group);
  const sections: string[] = [];
  fields.forEach((field) => { if (!sections.includes(field.section)) sections.push(field.section); });

  const set = (key: PortfolioContentKey, value: string) => {
    const content = setPortfolioContentValue(info.content, key, value);
    const next = { ...info };
    if (content) next.content = content;
    else delete next.content;
    setInfo(next);
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <Note>Leave a box empty and the standard wording is used (shown faintly in the box). Changes go live when you tap Save.</Note>
      {group === 'about' && (
        <Note>The lists on the About page (clients, shared stages, highlights) are in the About Lists section.</Note>
      )}
      {sections.map((section) => (
        <div key={section} className="border-t-4 border-white pt-5 space-y-5">
          <h3 className="font-heading text-xl uppercase tracking-widest">{section}</h3>
          {fields.filter((field) => field.section === section).map((field) => (
            <ContentInput
              key={field.key}
              label={field.label}
              hint={field.hint}
              kind={field.kind}
              placeholder={field.default}
              value={info.content?.[field.key] ?? ''}
              onChange={(v) => set(field.key as PortfolioContentKey, v)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function ContentInput({ label, hint, kind, placeholder, value, onChange }: {
  label: string; hint?: string; kind?: string; placeholder: string; value: string; onChange: (v: string) => void;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className={labelClass}>{label}</label>
      {kind === 'projectType' ? (
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={inputClass}>
          <option value="">Standard ({portfolioProjectTypes.find((t) => t.value === placeholder)?.label ?? placeholder})</option>
          {portfolioProjectTypes.map((t) => (
            <option key={t.value} value={t.value}>{DEFAULT_PORTFOLIO_CONTENT[`typeLabel_${t.value}`] ?? t.label}</option>
          ))}
        </select>
      ) : kind === 'textarea' ? (
        <textarea id={id} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={textareaClass} />
      ) : (
        <input id={id} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={inputClass} />
      )}
      {hint && <p className="mt-1 font-mono text-xs text-white/60">{hint}</p>}
    </div>
  );
}

/* ── About lists: highlights, clients, shared stages ── */
export function ListsTab({ info, setInfo, askDelete }: { info: ArtistInfo; setInfo: SetInfo; askDelete: AskDelete }) {
  return (
    <div className="space-y-10 max-w-3xl">
      <Note>These are the lists on the About page. Use the arrows to reorder. Empty entries are not shown on the site.</Note>
      <StringList
        title="Highlights"
        noun="highlight"
        items={info.awards}
        onChange={(awards) => setInfo({ ...info, awards })}
        askDelete={askDelete}
      />
      <StringList
        title="Selected clients"
        noun="client"
        items={info.clients}
        onChange={(clients) => setInfo({ ...info, clients })}
        askDelete={askDelete}
      />
      <StringList
        title="Shared stages with"
        noun="act"
        items={info.sharedStages ?? []}
        onChange={(sharedStages) => setInfo({ ...info, sharedStages })}
        askDelete={askDelete}
      />
    </div>
  );
}

function StringList({ title, noun, items, onChange, askDelete }: {
  title: string; noun: string; items: string[]; onChange: (items: string[]) => void; askDelete: AskDelete;
}) {
  const update = (i: number, v: string) => onChange(items.map((x, k) => (k === i ? v : x)));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const remove = (i: number) => onChange(items.filter((_, k) => k !== i));

  return (
    <div className="border-t-4 border-white pt-5 space-y-4">
      <h3 className="font-heading text-xl uppercase tracking-widest">{title}</h3>
      {items.map((item, i) => (
        <div key={i} className="border-2 border-white/40 p-3 space-y-3">
          <textarea
            value={item}
            onChange={(e) => update(i, e.target.value)}
            rows={2}
            aria-label={`${title}, entry ${i + 1}`}
            className={textareaClass + ' min-h-[44px]'}
          />
          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move ${noun} ${i + 1} up`} className={btnClass}><ArrowUp className="size-4" /></button>
            <button onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label={`Move ${noun} ${i + 1} down`} className={btnClass}><ArrowDown className="size-4" /></button>
            <button onClick={() => askDelete(`${noun} "${item.slice(0, 40) || 'Empty'}"`, () => remove(i))} aria-label={`Delete ${noun} ${i + 1}`} className={btnDangerClass}><Trash2 className="size-4" /></button>
          </div>
        </div>
      ))}
      {items.length === 0 && <p className="font-mono text-sm text-white/60">Nothing here yet.</p>}
      <button onClick={() => onChange([...items, ''])} className={`${btnClass} w-full sm:w-auto`}><Plus className="size-4" /> Add {noun}</button>
    </div>
  );
}
