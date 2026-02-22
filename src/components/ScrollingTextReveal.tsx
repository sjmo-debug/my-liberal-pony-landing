import { useState, useEffect } from 'react';

const statements = [
  'EXPERIMENTAL MULTIMEDIA',
  'LIVE PERFORMANCE ART',
  'SONIC DISRUPTION',
  'VISUAL CHAOS',
  'UNFILTERED EXPRESSION',
];

const ScrollingTextReveal = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const cycle = () => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % statements.length);
        setIsVisible(true);
      }, 600);
    };

    const interval = setInterval(cycle, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 2 }}>
      <p
        className={`font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold uppercase tracking-wider text-white text-center px-6 transition-all duration-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
        style={{ textShadow: '0 2px 20px rgba(0,0,0,0.6)' }}
      >
        {statements[currentIndex]}
      </p>
    </div>
  );
};

export default ScrollingTextReveal;
