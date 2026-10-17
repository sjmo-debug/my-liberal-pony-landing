import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import BackgroundManager from '@/components/BackgroundManager';
import { useAboutContent } from '@/hooks/useAboutContent';
import { useMLP } from '@/contexts/MLPContext';
import PressSection from '@/components/PressSection';
import SEO from '@/components/SEO';

const About = () => {
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const { data: entries, isLoading } = useAboutContent();
  const { siteData } = useMLP();
  const c = siteData.content;
  // Text saved in the admin wins; otherwise the Google Sheet is used exactly as before.
  const adminParagraphs = siteData.aboutParagraphs;
  const paragraphs = adminParagraphs.length > 0 ? adminParagraphs : entries;
  const showSkeleton = adminParagraphs.length === 0 && isLoading;

  return <div className="min-h-screen transition-all duration-500">
      <SEO
        title={`${c.seoTitle} - About`}
        description={c.seoDescription}
        path="/about"
      />
      <BackgroundManager isVisible={isButtonHovered} />
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 md:p-8 transition-colors duration-500 relative z-10 ${isButtonHovered ? 'text-black' : 'bg-background text-foreground'}`}>
        <article className="w-full max-w-5xl mx-auto text-center space-y-8 md:space-y-12 px-4 md:px-8">
          {/* Back Button */}
          <nav className="flex justify-start mb-8">
            <Link to="/" onMouseEnter={() => setIsButtonHovered(true)} onMouseLeave={() => setIsButtonHovered(false)} className={`inline-flex items-center gap-2 font-body text-lg md:text-xl lg:text-2xl uppercase px-6 py-3 md:px-8 md:py-4 min-h-[44px] transition-all duration-300 ${isButtonHovered ? 'border-2 border-black' : 'border-2 border-foreground'}`} aria-label="Return to home page">
              <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
              {c.aboutBackButton}
            </Link>
          </nav>

          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold uppercase tracking-wider">
            {c.aboutTitle}
          </h1>
          
          <div className="space-y-6 md:space-y-8">
            {showSkeleton ? (
              <div className="space-y-6 md:space-y-8 animate-pulse">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-6 bg-muted rounded w-full" />
                ))}
              </div>
            ) : (
              paragraphs?.map((entry, i) => (
                <p key={i} className={`font-body text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed uppercase ${entry.italic ? 'italic' : ''}`}>
                  {entry.text}
                </p>
              ))
            )}
          </div>

          <div className="flex justify-center mt-8">
            <Link to="/theSJMO" onMouseEnter={() => setIsButtonHovered(true)} onMouseLeave={() => setIsButtonHovered(false)} className={`inline-flex items-center gap-2 font-body text-lg md:text-xl lg:text-2xl uppercase px-6 py-3 md:px-8 md:py-4 min-h-[44px] transition-all duration-300 ${isButtonHovered ? 'border-2 border-black' : 'border-2 border-foreground'}`}>
              {c.aboutPortfolioButton}
              <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
            </Link>
          </div>

          {siteData.press && siteData.press.length > 0 && (
            <div className="pt-8 md:pt-12">
              <PressSection press={siteData.press} showRainbow={isButtonHovered} onHover={setIsButtonHovered} />
            </div>
          )}
        </article>
      </div>
    </div>;
};
export default About;
