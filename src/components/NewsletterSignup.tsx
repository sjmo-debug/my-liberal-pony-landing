import { useState, FormEvent } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface NewsletterSignupProps {
  showRainbow: boolean;
  onHover: (hovered: boolean) => void;
  id?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const NewsletterSignup = ({ showRainbow, onHover, id }: NewsletterSignupProps) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const borderColor = showRainbow ? 'border-black' : 'border-foreground';
  const textColor = showRainbow ? 'text-black' : 'text-foreground';
  const placeholderColor = showRainbow ? 'placeholder:text-black/50' : 'placeholder:text-foreground/50';
  const ringColor = showRainbow ? 'focus-visible:ring-black' : 'focus-visible:ring-foreground';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !EMAIL_RE.test(trimmed) || trimmed.length > 255) {
      setStatus('error');
      return;
    }

    setStatus('loading');
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email: trimmed });

    // Treat duplicate (23505) as success — they're already in.
    if (error && error.code !== '23505') {
      setStatus('error');
      return;
    }

    setStatus('success');
    setEmail('');
  };

  return (
    <section id={id} className="w-full space-y-6 scroll-mt-24">
      <h2 className={`font-heading text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold uppercase tracking-wider ${textColor}`}>
        Get the next one first
      </h2>
      <p className={`font-body text-base md:text-lg uppercase tracking-wider ${textColor} opacity-80`}>
        New releases and gigs, before anywhere else. No spam.
      </p>

      {status === 'success' ? (
        <p className={`font-heading text-2xl md:text-3xl uppercase tracking-wider ${textColor}`} role="status" aria-live="polite">
          You're in.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4" noValidate>
          <label htmlFor={`newsletter-email-${id || 'main'}`} className="sr-only">
            Email address
          </label>
          <input
            id={`newsletter-email-${id || 'main'}`}
            type="email"
            name="EMAIL"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (status === 'error') setStatus('idle'); }}
            placeholder="YOUR EMAIL ADDRESS"
            required
            aria-invalid={status === 'error'}
            aria-describedby={status === 'error' ? `newsletter-err-${id || 'main'}` : undefined}
            className={`flex-1 bg-transparent border-2 ${borderColor} ${textColor} ${placeholderColor} font-body text-base md:text-lg uppercase tracking-wider px-6 py-4 outline-none focus-visible:ring-2 ${ringColor} focus-visible:ring-offset-0 transition-opacity min-h-[44px]`}
          />
          <button
            type="submit"
            onMouseEnter={() => onHover(true)}
            onMouseLeave={() => onHover(false)}
            disabled={status === 'loading'}
            className={`border-2 ${borderColor} ${textColor} font-body text-base md:text-lg uppercase tracking-wider px-8 py-4 hover:opacity-70 transition-all duration-500 disabled:opacity-50 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 ${ringColor}`}
          >
            {status === 'loading' ? 'Signing up…' : 'Sign Up'}
          </button>
        </form>
      )}
      {status === 'error' && (
        <p
          id={`newsletter-err-${id || 'main'}`}
          role="alert"
          className={`font-body text-base uppercase tracking-wider ${textColor}`}
        >
          That email didn't work — try again.
        </p>
      )}
    </section>
  );
};

export default NewsletterSignup;
