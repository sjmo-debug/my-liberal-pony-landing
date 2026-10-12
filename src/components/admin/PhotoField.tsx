import { useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { cloudinaryImage } from '@/lib/cloudinary';
import { toast } from 'sonner';

const BUCKET = 'site-photos';
const TEN_YEARS_SECONDS = 60 * 60 * 24 * 365 * 10;
const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

/**
 * Turn a stored photo value into a renderable src.
 * Full URLs (uploads or external links) are used as-is; anything else is
 * treated as a Cloudinary public ID.
 */
export function resolvePhotoSrc(value: string, width = 1200): string {
  if (!value) return '';
  if (/^(https?:)?\/\//.test(value) || value.startsWith('/') || value.startsWith('data:')) {
    return value;
  }
  return cloudinaryImage(value, width);
}

function safeName(name: string) {
  const dot = name.lastIndexOf('.');
  const ext = dot > -1 ? name.slice(dot + 1).toLowerCase() : 'jpg';
  const base = (dot > -1 ? name.slice(0, dot) : name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40) || 'photo';
  return `${base}-${Date.now()}.${ext}`;
}

interface PhotoFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** Sub-folder inside the photo store, e.g. "mlp/gallery" */
  folder?: string;
  /** 'light' for the MLP admin (light/dark tokens), 'dark' for theSJMO */
  theme?: 'light' | 'dark';
  hint?: string;
}

export default function PhotoField({
  label,
  value,
  onChange,
  folder = 'general',
  theme = 'light',
  hint,
}: PhotoFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [failed, setFailed] = useState(false);

  const border = theme === 'dark' ? 'border-white' : 'border-foreground';
  const text = theme === 'dark' ? 'text-white' : 'text-foreground';
  const muted = theme === 'dark' ? 'text-white/50' : 'text-muted-foreground';
  const field =
    theme === 'dark'
      ? 'w-full bg-black text-white border-2 border-white px-3 py-2 font-mono text-sm focus:outline-none focus:bg-white/5 placeholder:text-white/30'
      : 'w-full bg-background text-foreground border-2 border-foreground px-3 py-2 font-body text-sm focus:outline-none focus:bg-foreground/5 placeholder:text-muted-foreground';
  const btn = `font-heading uppercase tracking-widest text-xs px-3 py-2 border-2 ${border} ${text} transition-colors ${
    theme === 'dark' ? 'hover:bg-white hover:text-black' : 'hover:bg-foreground hover:text-background'
  }`;

  const upload = async (file: File) => {
    if (!ACCEPTED.includes(file.type)) {
      toast.error('Please choose a JPG, PNG, WebP or GIF image');
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error('That image is larger than 10 MB');
      return;
    }
    setUploading(true);
    try {
      const path = `${folder}/${safeName(file.name)}`;
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { cacheControl: '31536000', upsert: false });
      if (uploadError) throw uploadError;

      const { data, error: signError } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(path, TEN_YEARS_SECONDS);
      if (signError || !data?.signedUrl) throw signError ?? new Error('Could not create image link');

      setFailed(false);
      onChange(data.signedUrl);
      toast.success('Photo uploaded');
    } catch (err: any) {
      toast.error(err?.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const preview = resolvePhotoSrc(value, 400);

  return (
    <div className="space-y-2">
      <label className={`block font-heading text-xs uppercase tracking-widest ${muted}`}>{label}</label>

      <div className="flex gap-3 items-start">
        <div
          className={`shrink-0 w-24 h-24 border-2 ${border} overflow-hidden flex items-center justify-center ${
            dragOver ? 'opacity-60' : ''
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files?.[0];
            if (file) upload(file);
          }}
        >
          {preview && !failed ? (
            <img
              src={preview}
              alt=""
              className="w-full h-full object-cover"
              onError={() => setFailed(true)}
            />
          ) : (
            <span className={`font-mono text-[10px] uppercase tracking-widest text-center px-1 ${muted}`}>
              {uploading ? 'Uploading' : failed ? 'Not found' : 'Drop here'}
            </span>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={value}
            onChange={(e) => {
              setFailed(false);
              onChange(e.target.value);
            }}
            placeholder="Paste an image link or Cloudinary ID"
            className={field}
          />
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => inputRef.current?.click()} className={btn} disabled={uploading}>
              {uploading ? 'Uploading…' : 'Upload Photo'}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => {
                  setFailed(false);
                  onChange('');
                }}
                className={btn}
              >
                Remove
              </button>
            )}
          </div>
          {hint && <p className={`font-mono text-[10px] uppercase tracking-widest ${muted}`}>{hint}</p>}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(',')}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
        }}
      />
    </div>
  );
}
