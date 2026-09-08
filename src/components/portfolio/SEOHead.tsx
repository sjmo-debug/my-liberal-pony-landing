import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { photographerInfo } from '@/data/portfolio/photographer';
import { cloudinaryPresets } from '@/lib/cloudinary';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
}

const defaultShareImage = cloudinaryPresets.heroGrayscale('sjmo_portfolio/hero-live');

export function SEOHead({
  title,
  description,
  image = defaultShareImage,
  type = 'website',
}: SEOHeadProps) {

  const location = useLocation();

  const fullTitle = title
    ? `${title} | ${photographerInfo.name}`
    : `${photographerInfo.name} - ${photographerInfo.tagline}`;

  const fullDescription = description || photographerInfo.heroIntroduction;
  const baseUrl = window.location.origin;
  const fullUrl = `${baseUrl}${location.pathname}`;

  useEffect(() => {
    document.title = fullTitle;

    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    updateMetaTag('description', fullDescription);
    updateMetaTag('og:title', fullTitle, true);
    updateMetaTag('og:description', fullDescription, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:url', fullUrl, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:site_name', photographerInfo.name, true);
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', fullTitle);
    updateMetaTag('twitter:description', fullDescription);
    updateMetaTag('twitter:image', image);
    updateMetaTag('author', photographerInfo.name);
  }, [fullTitle, fullDescription, fullUrl, image, type]);

  return null;
}
