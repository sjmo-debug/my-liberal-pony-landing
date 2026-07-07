import { useState } from 'react';

interface Props {
  youtubeId: string;
  title: string;
  showRainbow: boolean;
}

export default function YouTubeFacade({ youtubeId, title, showRainbow }: Props) {
  const [play, setPlay] = useState(false);
  const border = showRainbow ? 'border-2 border-black' : 'border-2 border-foreground';
  const thumb = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;

  return (
    <div className={`group relative overflow-hidden transition-all duration-300 ${border}`}>
      <div className="aspect-video relative">
        {play ? (
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlay(true)}
            aria-label={`Play ${title}`}
            className="absolute inset-0 w-full h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current group"
          >
            <img
              src={thumb}
              alt=""
              loading="lazy"
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${showRainbow ? '' : 'grayscale group-hover:grayscale-0'}`}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
              }}
            />
            <span className="absolute inset-0 bg-black/30 transition-opacity duration-300 group-hover:bg-black/10" aria-hidden="true" />
            <span
              aria-hidden="true"
              className={`absolute inset-0 flex items-center justify-center ${showRainbow ? 'text-black' : 'text-white'}`}
            >
              <span className={`flex items-center justify-center w-20 h-20 md:w-24 md:h-24 ${showRainbow ? 'border-2 border-black' : 'border-2 border-white'}`}>
                <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}