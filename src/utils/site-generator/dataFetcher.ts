
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import type { Site, SiteSection, SectionTemplate, SiteContent } from '@/types/site-generator';

// Initialize Supabase client with service role key for admin access
const supabase = createClient<Database>(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

/**
 * Fetches site metadata by ID
 */
export const fetchSiteData = async (siteId: string): Promise<Site> => {
  const { data: site, error } = await supabase
    .from('sites')
    .select('id, name, slug, primary_color, font_style')
    .eq('id', siteId)
    .single();

  if (error || !site) {
    console.error('Error fetching site:', error);
    throw new Error(`Site not found: ${error?.message || 'Unknown error'}`);
  }

  return site as Site;
};

/**
 * Fetches the sections and their order for a site
 */
export const fetchSiteSectionOrder = async (siteId: string): Promise<SiteSection[]> => {
  const { data: siteSections, error } = await supabase
    .from('site_sections')
    .select('section_id, order_index, is_visible')
    .eq('site_id', siteId)
    .order('order_index');

  if (error) {
    console.error('Error fetching site sections:', error);
    throw new Error(`Failed to fetch site sections: ${error.message}`);
  }

  // If no sections are defined, try to get the default order from templates
  let sectionOrder = siteSections || [];
  
  if (sectionOrder.length === 0) {
    // For now, return an empty array if no sections are found
    // In the future, you could implement template-based defaults here
    console.warn(`No sections found for site ${siteId}`);
  }

  // Filter out invisible sections
  return sectionOrder.filter(section => section.is_visible);
};

/**
 * Fetches the content for all sections of a site
 */
export const fetchSiteContent = async (siteId: string): Promise<Map<string, Record<string, any>>> => {
  const { data: siteContent } = await supabase
    .from('site_content')
    .select('section_name, content')
    .eq('site_id', siteId);

  // Create a map of section content
  const contentMap = new Map<string, Record<string, any>>();
  siteContent?.forEach(content => {
    // Safely cast Json to Record<string, any>
    const contentData = content.content as Record<string, any> || {};
    contentMap.set(content.section_name, contentData);
  });

  return contentMap;
};

/**
 * Fetches section templates by their IDs
 */
export const fetchSectionTemplates = async (
  sectionIds: string[]
): Promise<Map<string, SectionTemplate>> => {
  const { data: sectionTemplates } = await supabase
    .from('template_sections')
    .select('id, slug, default_props')
    .in('id', sectionIds);
  
  // Create a map of section templates by id
  const sectionTemplateMap = new Map<string, SectionTemplate>();
  sectionTemplates?.forEach(template => {
    // Safely cast Json to Record<string, any>
    const defaultProps = template.default_props as Record<string, any> || {};
    sectionTemplateMap.set(template.id, {
      id: template.id,
      slug: template.slug,
      default_props: defaultProps
    });
  });

  return sectionTemplateMap;
};
