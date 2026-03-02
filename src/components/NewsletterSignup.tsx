import { useState, FormEvent } from 'react';

// TODO: Replace with your Mailchimp form action URL
// Go to Mailchimp > Audience > Signup forms > Embedded forms > copy the form action URL
const MAILCHIMP_ACTION_URL = 'https://XXXXX.us21.list-manage.com/subscribe/post?u=XXXXXXX&id=XXXXXXX';

interface NewsletterSignupProps {
  showRainbow: boolean;
  onHover: (hovered: boolean) => void;
}

const NewsletterSignup = ({ showRainbow, onHover }: NewsletterSignupProps) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const borderColor = showRainbow ? 'border-black' : 'border-foreground';
  const textColor = showRainbow ? 'text-black' : 'text-foreground';
  const placeholderColor = showRainbow ? 'placeholder:text-black/50' : 'placeholder:text-foreground/50';

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return;

    setStatus('loading');

    // Submit via hidden iframe so the page doesn't navigate
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 2000);
  };

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
        <>
          <form
            action={MAILCHIMP_ACTION_URL}
            method="POST"
            target="mc-hidden-iframe"
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4"
          >
            {/* Mailchimp requires the email field to be named "EMAIL" */}
            <input
              type="email"
              name="EMAIL"
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
          <iframe name="mc-hidden-iframe" style={{ display: 'none' }} title="Mailchimp submission" />
        </>
      )}
    </section>
  );
};

export default NewsletterSignup;
