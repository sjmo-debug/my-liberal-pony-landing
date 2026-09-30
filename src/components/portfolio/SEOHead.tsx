import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { usePortfolio } from '@/contexts/PortfolioContext';
import {
  buildPortfolioMeta,
  composeTitle,
  DEFAULT_SHARE_IMAGE,
  type PortfolioPage,
} from '@/lib/portfolioSeo';

interface SEOHeadProps {
  /** Known public page: title, description and image come from the shared builder. */
  page?: PortfolioPage;
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
}

export function SEOHead({
  page,
  title: titleProp,
  description: descriptionProp,
  image: imageProp,
  type: typeProp,
}: SEOHeadProps) {

  const location = useLocation();
  const { photographerInfo, projects } = usePortfolio();
  const built = page ? buildPortfolioMeta(photographerInfo, projects, page, window.location.origin) : null;

  const fullTitle = built ? built.title : composeTitle(photographerInfo, titleProp);
  const fullDescription = built ? built.description : descriptionProp || photographerInfo.heroIntroduction;
  const image = built ? built.image : imageProp || DEFAULT_SHARE_IMAGE;
  const type = built ? built.type : typeProp || 'website';
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
