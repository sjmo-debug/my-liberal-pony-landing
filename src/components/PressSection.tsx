import type { MLPPressItem } from '@/contexts/MLPContext';

interface Props {
  press: MLPPressItem[];
  showRainbow: boolean;
  onHover: (v: boolean) => void;
}

export default function PressSection({ press, showRainbow, onHover }: Props) {
  return (
    <section className="w-full space-y-8">
      <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold uppercase tracking-wider">
        Press
      </h2>
      <div className="space-y-4">
        {press.map((item, i) => (
          <a
            key={i}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => onHover(true)}
            onMouseLeave={() => onHover(false)}
            className={`block font-body text-lg md:text-xl uppercase tracking-wider px-6 py-4 transition-all duration-300 ${showRainbow ? 'border-2 border-black hover:bg-black hover:text-white' : 'border-2 border-foreground hover:bg-foreground hover:text-background'}`}
          >
            <span className="font-bold">{item.source}</span>
            {item.title !== item.source && <span> — {item.title}</span>}
            {item.date && <span className="text-muted-foreground text-sm ml-4">{item.date}</span>}
          </a>
        ))}
      </div>
    </section>
  );
}
