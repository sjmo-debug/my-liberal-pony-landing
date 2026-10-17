import { useId, useState } from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import PhotoField, { resolvePhotoSrc } from '@/components/admin/PhotoField';
import { Switch } from '@/components/ui/switch';
import type { AspectRatio, Project, ProjectImage } from '@/types/portfolio';

/** Editors for a project's photo gallery and its Featured switch. Used by PortfolioAdmin's Projects section. */

type AskDelete = (what: string, onConfirm: () => void) => void;

const inputClass = "w-full min-h-[44px] bg-black text-white border-2 border-white px-3 py-2 font-mono text-base focus:outline-none focus:bg-white/5 placeholder:text-white/30";
const btnClass = "font-heading uppercase tracking-widest text-sm px-4 py-2 min-h-[44px] border-2 border-white hover:bg-white hover:text-black transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-30 disabled:pointer-events-none";
const btnDangerClass = "font-heading uppercase tracking-widest text-sm px-4 py-2 min-h-[44px] min-w-[44px] border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-black transition-colors inline-flex items-center justify-center gap-2";
const labelClass = "block font-heading text-xs uppercase tracking-widest mb-1";

function TextInput({ label, value, onChange, hint, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; hint?: string; placeholder?: string;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className={labelClass}>{label}</label>
      <input id={id} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={inputClass} />
      {hint && <p className="mt-1 font-mono text-xs text-white/60">{hint}</p>}
    </div>
  );
}

/** "Featured on Home" switch with a 44px tap area. */
export function FeaturedSwitch({ project, onChange, shownOnHome }: {
  project: Project; onChange: (on: boolean) => void; shownOnHome: boolean;
}) {
  const id = useId();
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 min-h-[44px]">
      <label htmlFor={id} className="inline-flex items-center gap-3 min-h-[44px] cursor-pointer font-heading text-xs uppercase tracking-widest">
        <Switch
          id={id}
          checked={project.featured === true}
          onCheckedChange={onChange}
          className="border-white data-[state=checked]:bg-white data-[state=unchecked]:bg-white/20 [&>span]:bg-black data-[state=unchecked]:[&>span]:bg-white"
        />
        Featured on Home
      </label>
      {shownOnHome && <span className="font-mono text-xs uppercase tracking-widest text-green-400">Showing on Home</span>}
    </div>
  );
}

const ASPECTS: { value: AspectRatio; label: string }[] = [
  { value: 'landscape', label: 'Landscape (wide)' },
  { value: 'portrait', label: 'Portrait (tall)' },
  { value: 'square', label: 'Square' },
];

export function ProjectImagesEditor({ project, patch, askDelete }: {
  project: Project;
  /** Apply a change to this project based on its latest saved-in-edit state. */
  patch: (fn: (p: Project) => Partial<Project>) => void;
  askDelete: AskDelete;
}) {
  const images: ProjectImage[] = project.images ?? [];
  const [draft, setDraft] = useState('');

  const setImages = (fn: (imgs: ProjectImage[]) => ProjectImage[]) =>
    patch((p) => ({ images: fn(p.images ?? []) }));
  const updateImage = (index: number, u: Partial<ProjectImage>) =>
    setImages((imgs) => imgs.map((img, k) => (k === index ? { ...img, ...u } : img)));
  const move = (index: number, dir: -1 | 1) =>
    setImages((imgs) => {
      const j = index + dir;
      if (j < 0 || j >= imgs.length) return imgs;
      const next = [...imgs];
      [next[index], next[j]] = [next[j], next[index]];
      return next;
    });
  const remove = (index: number) => setImages((imgs) => imgs.filter((_, k) => k !== index));
  const add = () => {
    const src = draft.trim();
    if (!src) return;
    setImages((imgs) => [
      ...imgs,
      { id: `${project.id}-${Date.now()}`, src, alt: '', aspectRatio: 'landscape' },
    ]);
    setDraft('');
  };

  const cover = (project.coverImage ?? '').trim();

  return (
    <div className="md:col-span-2 border-t-4 border-white pt-5 space-y-5">
      <h3 className="font-heading text-xl uppercase tracking-widest">Photos</h3>
      <p className="font-mono text-sm leading-relaxed text-white/70">
        The cover is the big photo at the top of the project page and on the project card. It is separate from the
        gallery below, which is shown in this order under the description. "Use as cover" copies a gallery photo into the
        cover and removes nothing. Tap Save at the bottom to make changes live.
      </p>

      {images.length === 0 && <p className="font-mono text-sm text-white/60">No gallery photos yet.</p>}

      {images.map((image, i) => {
        const src = (image.src ?? '').trim();
        const isCover = !!src && src === cover;
        const name = `photo ${i + 1}`;
        return (
          <div key={image.id || i} className="border-2 border-white/40 p-3 space-y-4">
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-20 h-20 border-2 border-white/60 overflow-hidden bg-white/5">
                {src && <img src={resolvePhotoSrc(src, 200)} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }} />}
              </div>
              <div className="min-w-0 space-y-1">
                <p className="font-heading text-sm uppercase tracking-widest">Photo {i + 1} of {images.length}</p>
                {isCover && <p className="font-mono text-xs uppercase tracking-widest text-green-400">This is the cover</p>}
                {!src && <p className="font-mono text-xs text-yellow-300">No image set, so this is not shown on the site.</p>}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move ${name} up`} className={btnClass}><ArrowUp className="size-4" /></button>
              <button onClick={() => move(i, 1)} disabled={i === images.length - 1} aria-label={`Move ${name} down`} className={btnClass}><ArrowDown className="size-4" /></button>
              <button onClick={() => askDelete(`${name} from "${project.title || 'Untitled'}"`, () => remove(i))} aria-label={`Delete ${name}`} className={btnDangerClass}><Trash2 className="size-4" /></button>
            </div>

            <button
              onClick={() => patch(() => ({ coverImage: src }))}
              disabled={!src || isCover}
              className={`${btnClass} w-full`}
            >
              {isCover ? 'Current cover' : 'Use as cover'}
            </button>

            <PhotoField label="Photo (replace)" theme="dark" folder="sjmo/projects" value={image.src ?? ''} onChange={(v) => updateImage(i, { src: v })} />
            <TextInput
              label="Description for screen readers (alt text)"
              value={image.alt ?? ''}
              onChange={(v) => updateImage(i, { alt: v })}
              hint={image.alt?.trim() ? 'Say what is in the photo. Helps blind visitors and search engines.' : 'Empty: the site will use "Project title – photo N". Better to describe the photo.'}
            />
            <TextInput label="Caption" value={image.caption ?? ''} onChange={(v) => updateImage(i, { caption: v || undefined })} hint="Shown when a visitor opens the photo full screen. Empty shows nothing." />
            <TextInput label="Photo credit" value={image.credit ?? ''} onChange={(v) => updateImage(i, { credit: v || undefined })} hint="Shown small in the corner of the photo. Empty shows nothing." />
            <div>
              <label htmlFor={`${project.id}-aspect-${i}`} className={labelClass}>Shape</label>
              <select
                id={`${project.id}-aspect-${i}`}
                value={image.aspectRatio ?? 'landscape'}
                onChange={(e) => updateImage(i, { aspectRatio: e.target.value as AspectRatio })}
                className={inputClass}
              >
                {ASPECTS.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
              </select>
            </div>
          </div>
        );
      })}

      <div className="border-2 border-dashed border-white/60 p-3 space-y-3">
        <PhotoField
          label="Add a gallery photo"
          theme="dark"
          folder="sjmo/projects"
          value={draft}
          onChange={setDraft}
          hint="Upload or paste a link, check the preview, then tap Add."
        />
        <button onClick={add} disabled={!draft.trim()} className={`${btnClass} w-full sm:w-auto`}><Plus className="size-4" /> Add photo to gallery</button>
      </div>
    </div>
  );
}
