import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ImageIcon } from 'lucide-react';
import BackgroundManager from '@/components/BackgroundManager';
import { cloudinaryImage } from '@/lib/cloudinary';

// Add your Cloudinary public IDs here to populate the gallery
const GALLERY_ITEMS: { publicId: string; alt: string }[] = [
  // Example: { publicId: "my-folder/image-name", alt: "Description" },
];

const Gallery = () => {
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  return (
    <div className="min-h-screen transition-all duration-500">
      <BackgroundManager isVisible={isButtonHovered} />
      <div className={`min-h-screen flex flex-col items-center p-4 md:p-8 transition-colors duration-500 relative z-10 ${isButtonHovered ? 'text-black' : 'bg-background text-foreground'}`}>
        <article className="w-full max-w-6xl mx-auto space-y-8 md:space-y-12 px-4 md:px-8">
          <nav className="flex justify-start pt-4">
            <Link
              to="/"
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
              className={`inline-flex items-center gap-2 font-body text-lg md:text-xl lg:text-2xl uppercase px-6 py-3 md:px-8 md:py-4 min-h-[44px] transition-all duration-300 ${isButtonHovered ? 'border-2 border-black' : 'border-2 border-foreground'}`}
              aria-label="Return to home page"
            >
              <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
              BACK TO HOME
            </Link>
          </nav>

          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold uppercase tracking-wider text-center">
            Gallery
          </h1>

          {GALLERY_ITEMS.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {GALLERY_ITEMS.map((item, index) => (
                <div
                  key={item.publicId}
                  className={`group relative overflow-hidden aspect-square transition-all duration-300 hover:scale-[1.02] ${isButtonHovered ? 'border-2 border-black' : 'border-2 border-foreground'}`}
                >
                  <img
                    src={cloudinaryImage(item.publicId, 800)}
                    alt={item.alt}
                    loading={index < 6 ? 'eager' : 'lazy'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className={`flex flex-col items-center justify-center py-24 space-y-6 ${isButtonHovered ? 'border-2 border-black' : 'border-2 border-foreground'}`}>
              <ImageIcon className="w-16 h-16 opacity-40" />
              <p className="font-body text-lg md:text-xl lg:text-2xl uppercase text-center opacity-60">
                Coming Soon
              </p>
              <p className="font-body text-sm md:text-base opacity-40 text-center max-w-md">
                Upload images to your Cloudinary account and add public IDs to display them here
              </p>
            </div>
          )}
        </article>
      </div>
    </div>
  );
};

export default Gallery;
