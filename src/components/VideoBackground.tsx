interface VideoBackgroundProps {
  isVisible: boolean;
  videoUrl: string;
}

const VideoBackground = ({ isVisible, videoUrl }: VideoBackgroundProps) => {
  if (!isVisible || !videoUrl) return null;

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
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
    </div>
  );
};

export default VideoBackground;
