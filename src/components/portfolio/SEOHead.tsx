import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { resolvePhotoSrc } from '@/components/admin/PhotoField';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
}

export function SEOHead({
  title,
  description,
  image: imageProp,
  type = 'website',
}: SEOHeadProps) {

  const location = useLocation();
  const { photographerInfo } = usePortfolio();

  // Share image: the page's own image, else the hero photo, else the portrait, else none.
  const image =
    imageProp ||
    resolvePhotoSrc(photographerInfo.heroImage?.trim() || '', 1600) ||
    photographerInfo.portraitImage ||
    '';

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

    // With no image the tag is removed rather than left pointing at an old picture.
    const setOptionalMetaTag = (name: string, content: string, isProperty = false) => {
      if (content) {
        updateMetaTag(name, content, isProperty);
        return;
      }
      document.querySelector(`meta[${isProperty ? 'property' : 'name'}="${name}"]`)?.remove();
    };

    updateMetaTag('description', fullDescription);
    updateMetaTag('og:title', fullTitle, true);
    updateMetaTag('og:description', fullDescription, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:url', fullUrl, true);
    setOptionalMetaTag('og:image', image, true);
    updateMetaTag('og:site_name', photographerInfo.name, true);
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', fullTitle);
    updateMetaTag('twitter:description', fullDescription);
    setOptionalMetaTag('twitter:image', image);
    updateMetaTag('author', photographerInfo.name);
  }, [fullTitle, fullDescription, fullUrl, image, type, photographerInfo.name]);

  return null;
}
