import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import BackgroundManager from '@/components/BackgroundManager';
import SEO from '@/components/SEO';
import { cloudinaryImage } from '@/lib/cloudinary';
import { track } from '@/lib/analytics';

// Hardcoded per project decision — future singles live in the `releases` table
// and can reuse this template.
export const OUMUAMUA = {
  slug: 'oumuamua',
  title: 'OUMUAMUA',
  label: 'Hot Earth Records',
  coverPublicId: 'mlp/oumuamua-cover',
  ogImage: 'https://res.cloudinary.com/dpy87lbpt/image/upload/f_auto,q_auto,w_1200,h_630,c_fill/mlp/oumuamua-cover.jpg',
  spotifyUrl: 'https://open.spotify.com/artist/2BgfhrMJ3h63DMazpBwQwE',
  spotifyEmbedUrl: '',
  bandcampUrl: 'https://myliberalpony.bandcamp.com/',
  appleMusicUrl: 'https://music.apple.com/gb/artist/my-liberal-pony/1887096161',
  youtubeUrl: 'https://www.youtube.com/@MYLIBERALPONY',
  soundcloudUrl: 'https://soundcloud.com/myliberalpony',
  lyrics: `[Lyrics coming soon]`,
  creditsWriting: 'Written by MY LIBERAL PONY',
  creditsProduction: 'Produced by MY LIBERAL PONY',
  creditsMastering: 'Mastered by [ENGINEER]',
};

const Oumuamua = () => {
  const [hover, setHover] = useState(false);
  const border = hover ? 'border-2 border-black' : 'border-2 border-foreground';

  const platforms: [string, string][] = [
    ['Spotify', OUMUAMUA.spotifyUrl],
    ['Bandcamp', OUMUAMUA.bandcampUrl],
    ['Apple Music', OUMUAMUA.appleMusicUrl],
    ['YouTube', OUMUAMUA.youtubeUrl],
    ['SoundCloud', OUMUAMUA.soundcloudUrl],
  ].filter(([, u]) => !!u) as [string, string][];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MusicRecording',
    name: OUMUAMUA.title,
    byArtist: { '@type': 'MusicGroup', name: 'MY LIBERAL PONY' },
    recordLabel: OUMUAMUA.label,
    url: `https://myliberalpony.co.uk/${OUMUAMUA.slug}`,
    image: OUMUAMUA.ogImage,
  };

  return (
    <div className="min-h-screen relative">
      <SEO
        title={`OUMUAMUA — new single from MY LIBERAL PONY`}
        description={`OUMUAMUA — out now via ${OUMUAMUA.label}. Listen on Spotify, Bandcamp, Apple Music, YouTube and SoundCloud.`}
        path={`/${OUMUAMUA.slug}`}
        jsonLd={jsonLd}
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
                src={cloudinaryImage(OUMUAMUA.coverPublicId, 1000)}
                alt={`${OUMUAMUA.title} cover art`}
                width={1000}
                height={1000}
                className="w-full h-auto block grayscale"
                loading="eager"
              />
            </div>
            <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-wider">
              {OUMUAMUA.title}
            </h1>
            <p className="font-body text-base md:text-lg uppercase tracking-[0.3em]">
              Out now via {OUMUAMUA.label}
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
                title={`${OUMUAMUA.title} on Spotify`}
              />
            </section>
          )}

          <section className="space-y-4">
            <h2 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-wider">Listen everywhere</h2>
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
                Lyrics
              </summary>
              <pre className="mt-6 whitespace-pre-wrap font-body text-base md:text-lg leading-relaxed">
                {OUMUAMUA.lyrics}
              </pre>
            </details>
          </section>

          <section className={`${border} p-6 space-y-3`}>
            <h2 className="font-heading text-xl md:text-2xl font-bold uppercase tracking-wider">Credits</h2>
            <ul className="font-body text-base md:text-lg uppercase tracking-wider space-y-1">
              <li>{OUMUAMUA.creditsWriting}</li>
              <li>{OUMUAMUA.creditsProduction}</li>
              <li>{OUMUAMUA.creditsMastering}</li>
              <li>Released via {OUMUAMUA.label}</li>
            </ul>
          </section>
        </article>
      </div>
    </div>
  );
};

export default Oumuamua;