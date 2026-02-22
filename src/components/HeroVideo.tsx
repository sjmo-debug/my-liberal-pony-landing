import CanvasParticles from './CanvasParticles';

interface HeroVideoProps {
  videoSrc?: string;
}

const HeroVideo = ({ videoSrc = '/videos/video1.mp4' }: HeroVideoProps) => {
  return (
    <section className="relative w-full overflow-hidden bg-black aspect-video">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      <CanvasParticles />
    </section>
  );
};

export default HeroVideo;
