import CanvasParticles from './CanvasParticles';

interface HeroVideoProps {
  videoSrc?: string;
}

const HeroVideo = ({ videoSrc = '/videos/video1.mp4' }: HeroVideoProps) => {
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
    </section>
  );
};

export default HeroVideo;
