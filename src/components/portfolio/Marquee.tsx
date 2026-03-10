import './Marquee.css';

interface MarqueeProps {
  items?: string[];
  speed?: number;
}

export function Marquee({ 
  items = ['MUSIC', 'VISUALS', 'PRODUCTION', 'EVENTS', 'COLLABORATION', 'SOUND'],
  speed = 30
}: MarqueeProps) {
  const text = items.join(' — ') + ' — ';

  return (
    <div className="marquee-container border-y-4 border-white py-4 overflow-hidden select-none">
      <div 
        className="marquee-track font-heading text-2xl md:text-4xl uppercase tracking-widest text-white whitespace-nowrap"
        style={{ '--marquee-speed': `${speed}s` } as React.CSSProperties}
      >
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
      </div>
    </div>
  );
}
