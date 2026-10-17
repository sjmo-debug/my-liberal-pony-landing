import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import BackgroundManager from '@/components/BackgroundManager';
import SEO from '@/components/SEO';
import { resolvePhotoSrc } from '@/components/admin/PhotoField';
import { useMLP } from '@/contexts/MLPContext';
import { track } from '@/lib/analytics';

// The page layout is fixed. The words, links, cover art, lyrics and credits come
// from the admin (Oumuamua tab); the standard values live in src/lib/siteContent.ts.
// Only the address and the social-share image stay fixed here.
export const OUMUAMUA = {
  slug: 'oumuamua',
  ogImage: 'https://res.cloudinary.com/dpy87lbpt/image/upload/f_auto,q_auto,w_1200,h_630,c_fill/mlp/oumuamua-cover.jpg',
  spotifyEmbedUrl: '',
};

const Oumuamua = () => {
  const { siteData } = useMLP();
  const c = siteData.content;
  const [hover, setHover] = useState(false);
  const border = hover ? 'border-2 border-black' : 'border-2 border-foreground';

  const platforms: [string, string][] = [
    ['Spotify', c.oumSpotifyUrl],
    ['Bandcamp', c.oumBandcampUrl],
    ['Apple Music', c.oumAppleMusicUrl],
    ['YouTube', c.oumYoutubeUrl],
    ['SoundCloud', c.oumSoundcloudUrl],
  ].filter(([, u]) => !!u) as [string, string][];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MusicRecording',
    name: c.oumTitle,
    byArtist: { '@type': 'MusicGroup', name: 'MY LIBERAL PONY' },
    recordLabel: c.oumLabel,
    url: `https://myliberalpony.co.uk/${OUMUAMUA.slug}`,
    image: OUMUAMUA.ogImage,
  };

  return (
    <div className="min-h-screen relative">
      <SEO
        title={c.seoTitle}
        description={c.seoDescription}
        path={`/${OUMUAMUA.slug}`}
        jsonLd={jsonLd}
        ogImage={OUMUAMUA.ogImage}
      />
      <BackgroundManager isVisible={hover} />
      <div className={`min-h-screen flex flex-col items-center p-4 md:p-8 relative z-10 transition-colors duration-500 ${hover ? 'text-black' : 'bg-background text-foreground'}`}>
        <article className="w-full max-w-4xl mx-auto space-y-12 md:space-y-16">
          <nav className="flex justify-start">
            <Link
              to="/"
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              className={`inline-flex items-center gap-2 font-body text-base md:text-lg uppercase px-6 py-3 min-h-[44px] transition-all duration-300 ${border}`}
            >
              <ArrowLeft className="w-5 h-5" /> Back
            </Link>
          </nav>

          <header className="text-center space-y-6">
            <div className={`mx-auto max-w-md ${border}`}>
              <img
                src={resolvePhotoSrc(c.oumCover, 1000)}
                alt={`${c.oumTitle} cover art`}
                width={1000}
                height={1000}
                className="w-full h-auto block grayscale"
                loading="eager"
              />
            </div>
            <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-wider">
              {c.oumTitle}
            </h1>
            <p className="font-body text-base md:text-lg uppercase tracking-[0.3em]">
              Out now via {c.oumLabel}
            </p>
          </header>

          {OUMUAMUA.spotifyEmbedUrl && (
            <section className={`overflow-hidden ${border}`}>
              <iframe
                src={`${OUMUAMUA.spotifyEmbedUrl}?utm_source=generator&theme=0`}
                width="100%"
                height="352"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title={`${c.oumTitle} on Spotify`}
              />
            </section>
          )}

          <section className="space-y-4">
            <h2 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-wider">{c.oumListenTitle}</h2>
            <ul className="flex flex-wrap gap-3">
              {platforms.map(([label, url]) => (
                <li key={label}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    onClick={() => label === 'Spotify' && track.spotifyClick('oumuamua')}
                    className={`inline-block font-body text-base md:text-lg uppercase px-6 py-3 min-h-[44px] tracking-wider transition-all duration-300 ${border}`}
                  >
                    {label} →
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <details className={`${border} p-6`}>
              <summary className="font-heading text-xl md:text-2xl font-bold uppercase tracking-wider cursor-pointer">
                {c.oumLyricsTitle}
              </summary>
              <pre className="mt-6 whitespace-pre-wrap font-body text-base md:text-lg leading-relaxed">
                {c.oumLyrics}
              </pre>
            </details>
          </section>

          <section className={`${border} p-6 space-y-3`}>
            <h2 className="font-heading text-xl md:text-2xl font-bold uppercase tracking-wider">{c.oumCreditsTitle}</h2>
            <ul className="font-body text-base md:text-lg uppercase tracking-wider space-y-1">
              <li>{c.oumCreditsWriting}</li>
              <li>{c.oumCreditsProduction}</li>
              <li>{c.oumCreditsMastering}</li>
              <li>Released via {c.oumLabel}</li>
            </ul>
          </section>
        </article>
      </div>
    </div>
  );
};

export default Oumuamua;