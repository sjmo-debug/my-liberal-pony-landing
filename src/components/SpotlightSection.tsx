import type { MLPSpotlight, MLPPressItem } from '@/contexts/MLPContext';

interface Props {
  spotlight: MLPSpotlight;
  showRainbow: boolean;
  onHover: (v: boolean) => void;
  latestPress?: MLPPressItem;
}

export default function SpotlightSection({ spotlight, showRainbow, onHover, latestPress }: Props) {
  const badgePrefix = (spotlight.pressBadgeLabel || 'As heard on').toUpperCase();
  const pressLine = latestPress
    ? `${badgePrefix} "${latestPress.title}" — ${latestPress.source}`
    : null;
  return (
    <section className="w-full space-y-8">
      <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold uppercase tracking-wider">
        {spotlight.header || 'New Single'} — {spotlight.title}
      </h2>

      {spotlight.description && (
        <p className="font-body text-lg md:text-xl lg:text-2xl uppercase tracking-wider">
          {spotlight.description}
        </p>
      )}

      {/* Spotify Embed */}
      <div className={`overflow-hidden transition-all duration-300 ${showRainbow ? 'border-2 border-black' : 'border-2 border-foreground'}`}>
        <iframe
          src={`${spotlight.spotifyEmbedUrl}?utm_source=generator&theme=0`}
          width="100%"
          height="352"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title={`${spotlight.title} on Spotify`}
        />
      </div>

      {/* CTA */}
      <a
        href={spotlight.spotifyUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
        className={`inline-block font-heading text-xl md:text-2xl lg:text-3xl font-bold uppercase px-8 py-5 md:px-10 md:py-6 tracking-wider transition-all duration-300 ${showRainbow ? 'border-2 border-black hover:bg-black hover:text-white' : 'border-2 border-foreground hover:bg-foreground hover:text-background'}`}
      >
        {spotlight.ctaText || 'Listen on Spotify'}
      </a>

      {pressLine && (
        <p className="font-body text-sm md:text-base uppercase tracking-widest opacity-90">
          {latestPress!.url ? (
            <a
              href={latestPress!.url}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => onHover(true)}
              onMouseLeave={() => onHover(false)}
              className="underline underline-offset-4 hover:opacity-70 transition-opacity"
            >
              {pressLine}
            </a>
          ) : (
            <span>{pressLine}</span>
          )}
        </p>
      )}
    </section>
  );
}
