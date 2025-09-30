import { useBackgroundText } from '@/hooks/useBackgroundText';
import { useState, useEffect } from 'react';

interface BackgroundTextProps {
  isVisible: boolean;
}

const BackgroundText = ({ isVisible }: BackgroundTextProps) => {
  const { data: textList = ['ERROR'] } = useBackgroundText();
  const [currentText, setCurrentText] = useState('ERROR');

  // Pick a new random text each time isVisible becomes true
  useEffect(() => {
    if (isVisible && textList.length > 0) {
      const randomIndex = Math.floor(Math.random() * textList.length);
      setCurrentText(textList[randomIndex]);
    }
  }, [isVisible, textList]);
  
  if (!isVisible) return null;

  // Create seamless text without spaces
  const seamlessText = currentText.repeat(100);
  
  // Calculate number of rows needed to cover viewport + scroll area
  const rows = Array.from({ length: 100 }, (_, i) => i);

  return (
    <div 
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      style={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
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
