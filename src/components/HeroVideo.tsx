import CanvasParticles from './CanvasParticles';
import ScrollingTextReveal from './ScrollingTextReveal';

interface HeroVideoProps {
  videoSrc?: string;
}

const HeroVideo = ({ videoSrc = '/videos/video1.mp4' }: HeroVideoProps) => {
  const handleWatchNow = () => {
    document.getElementById('watch-listen')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Layer 0: Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" style={{ zIndex: 0 }} />

      {/* Layer 1: Canvas particles */}
      <CanvasParticles />

      {/* Layer 2: Text + CTA */}
      <ScrollingTextReveal />

      <div className="absolute bottom-16 left-0 right-0 flex justify-center" style={{ zIndex: 2 }}>
        <button
          onClick={handleWatchNow}
          className="font-body text-lg md:text-xl lg:text-2xl uppercase tracking-widest text-white border-2 border-white px-8 py-4 md:px-10 md:py-5 min-h-[44px] transition-all duration-300 hover:bg-white hover:text-black hover:scale-105"
        >
          Watch Now
        </button>
      </div>
    </section>
  );
};

export default HeroVideo;
