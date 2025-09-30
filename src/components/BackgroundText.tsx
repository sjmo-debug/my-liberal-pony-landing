import { useBackgroundText } from '@/hooks/useBackgroundText';

interface BackgroundTextProps {
  isVisible: boolean;
}

const BackgroundText = ({ isVisible }: BackgroundTextProps) => {
  const { data: text = 'ERROR' } = useBackgroundText();
  
  if (!isVisible) return null;

  // Create repeated text pattern
  const repeatedText = (text + ' ').repeat(200);

  return (
    <div 
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      style={{
        wordBreak: 'break-all',
        lineHeight: '1.2',
      }}
    >
      <div className="absolute inset-0 flex flex-wrap content-start font-body text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl uppercase text-white/80 select-none">
        {repeatedText}
      </div>
    </div>
  );
};

export default BackgroundText;
