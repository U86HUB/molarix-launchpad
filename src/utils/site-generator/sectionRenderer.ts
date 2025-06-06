
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import type { SectionTemplate, SiteContent } from '@/types/site-generator';

/**
 * Renders an array of sections to HTML
 */
export const renderSections = async (
  sectionOrder: { section_id: string; order_index: number; is_visible: boolean }[],
  sectionTemplateMap: Map<string, SectionTemplate>,
  contentMap: Map<string, Record<string, any>>,
  primaryColor?: string
): Promise<string> => {
  let sectionsHtml = '';

  for (const section of sectionOrder) {
    const sectionTemplate = sectionTemplateMap.get(section.section_id);
    
    if (!sectionTemplate) {
      console.warn(`Section template not found for section_id: ${section.section_id}`);
      continue;
    }

    try {
      // Dynamically import the section component
      const sectionSlug = sectionTemplate.slug;
      const sectionModule = await import(`../../../components/sections/${sectionSlug}`);
      const SectionComponent = sectionModule[sectionSlug.charAt(0).toUpperCase() + sectionSlug.slice(1)];

      if (!SectionComponent) {
        console.warn(`Component not found for section: ${sectionSlug}`);
        continue;
      }

      // Get content from site_content or fallback to default_props
      const sectionContent = contentMap.get(sectionSlug) || sectionTemplate.default_props || {};
      
      // Render the section component to HTML
      const sectionHtml = renderToStaticMarkup(
        React.createElement(SectionComponent, { ...sectionContent, primaryColor })
      );

      sectionsHtml += sectionHtml;
    } catch (error) {
      console.error(`Error rendering section ${sectionTemplate.slug}:`, error);
      // Continue with other sections even if one fails
    }
  }

  return sectionsHtml;
};
