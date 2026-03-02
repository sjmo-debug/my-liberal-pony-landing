interface VideoBackgroundProps {
  isVisible: boolean;
  videoUrl: string;
}

/**
 * Transform Cloudinary video URLs to ensure MP4 delivery and quality optimization.
 */
function ensureMp4(url: string): string {
  if (!url) return url;
  // Only transform Cloudinary URLs
  if (!url.includes('res.cloudinary.com')) return url;
  // Already has transformations with f_mp4
  if (url.includes('f_mp4')) return url;
  // Insert f_mp4,q_auto after /upload/
  return url.replace('/upload/', '/upload/f_mp4,q_auto/');
}

const VideoBackground = ({ isVisible, videoUrl }: VideoBackgroundProps) => {
  const src = ensureMp4(videoUrl);

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none z-0 transition-opacity duration-500"
      style={{ opacity: isVisible && src ? 1 : 0 }}
    >
      {src && (
        <video
          key={src}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={src} />
        </video>
      )}
    </div>
  );
};

export default VideoBackground;
