interface HeroVideoProps {
  videoSrc?: string;
}

const HeroVideo = ({ videoSrc = '/videos/hero-video.mp4' }: HeroVideoProps) => {
  const handleWatchNow = () => {
    document.getElementById('watch-listen')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <button
          onClick={handleWatchNow}
          className="font-body text-xl md:text-2xl lg:text-3xl font-bold uppercase tracking-widest px-8 py-5 md:px-10 md:py-6 border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300"
        >
          Watch Now
        </button>
      </div>
    </section>
  );
};

export default HeroVideo;
