import { useState, useRef, FormEvent } from 'react';

interface NewsletterSignupProps {
  showRainbow: boolean;
  onHover: (hovered: boolean) => void;
}

const NewsletterSignup = ({ showRainbow, onHover }: NewsletterSignupProps) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return;

    setStatus('loading');

    // Create a hidden iframe to submit to the Maileon endpoint
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.name = 'newsletter-submit';
    document.body.appendChild(iframe);

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://emt-dptiwtc9n.topmailer.net/hp/FdFKfo2-TjyTTQVZy11B6A/signup';
    form.target = 'newsletter-submit';

    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'email';
    input.value = trimmed;
    form.appendChild(input);

    document.body.appendChild(form);
    form.submit();

    // Clean up and show success after a short delay
    setTimeout(() => {
      form.remove();
      iframe.remove();
      setStatus('success');
      setEmail('');
    }, 2000);
  };

  const borderColor = showRainbow ? 'border-black' : 'border-foreground';
  const textColor = showRainbow ? 'text-black' : 'text-foreground';
  const placeholderColor = showRainbow ? 'placeholder:text-black/50' : 'placeholder:text-foreground/50';

  return (
    <section className="w-full space-y-8">
      <h2 className={`font-heading text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold uppercase tracking-wider ${textColor}`}>
        Subscribe to the Newsletter
      </h2>

      {status === 'success' ? (
        <p className={`font-body text-lg md:text-xl uppercase tracking-wider ${textColor}`}>
          Thank you for subscribing!
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="YOUR EMAIL ADDRESS"
            required
            className={`flex-1 bg-transparent border-2 ${borderColor} ${textColor} ${placeholderColor} font-body text-base md:text-lg uppercase tracking-wider px-6 py-4 outline-none focus:opacity-80 transition-opacity`}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            onMouseEnter={() => onHover(true)}
            onMouseLeave={() => onHover(false)}
            className={`border-2 ${borderColor} ${textColor} font-body text-base md:text-lg uppercase tracking-wider px-8 py-4 hover:opacity-70 transition-all duration-300 disabled:opacity-50`}
          >
            {status === 'loading' ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
      )}
    </section>
  );
};

export default NewsletterSignup;
