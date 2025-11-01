import { useBackgroundText } from '@/hooks/useBackgroundText';
import { useState, useEffect } from 'react';
import BackgroundText from './BackgroundText';
import VideoBackground from './VideoBackground';

interface BackgroundManagerProps {
  isVisible: boolean;
}

const BackgroundManager = ({ isVisible }: BackgroundManagerProps) => {
  const { data: entries = [{ text: 'ERROR', videoUrl: '' }] } = useBackgroundText();
  const [currentEntry, setCurrentEntry] = useState({ text: 'ERROR', videoUrl: '' });

  // Pick a new random entry each time isVisible becomes true
  useEffect(() => {
    if (isVisible && entries.length > 0) {
      const randomIndex = Math.floor(Math.random() * entries.length);
      setCurrentEntry(entries[randomIndex]);
    }
  }, [isVisible, entries]);

  return (
    <>
      <VideoBackground isVisible={isVisible} videoUrl={currentEntry.videoUrl} />
      <BackgroundText isVisible={isVisible} text={currentEntry.text} />
    </>
  );
};

export default BackgroundManager;
