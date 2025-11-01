interface BackgroundTextProps {
  isVisible: boolean;
  text: string;
}

const BackgroundText = ({ isVisible, text }: BackgroundTextProps) => {
  
  if (!isVisible) return null;

  // Create seamless text without spaces
  const seamlessText = text.repeat(100);
  
  // Calculate number of rows needed to cover viewport + scroll area
  const rows = Array.from({ length: 100 }, (_, i) => i);

  return (
    <div 
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
      }}
    >
      <div className="absolute top-0 left-0 w-full" style={{ minHeight: '200vh' }}>
        {rows.map((i) => (
          <div
            key={i}
            className="font-body text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl uppercase text-white/80 select-none"
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              lineHeight: '1.2',
            }}
          >
            {seamlessText}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BackgroundText;
