
import { Website, Section } from '@/types/website';

/**
 * Validates a website ID format
 */
export const validateWebsiteId = (websiteId: string): boolean => {
  // UUID v4 format validation
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(websiteId);
};

/**
 * Transforms raw website data from Supabase to typed Website object
 */
export const transformWebsiteData = (rawData: any): Website => {
  return {
    id: rawData.id,
    name: rawData.name,
    domain: rawData.domain,
    status: rawData.status as 'draft' | 'published' | 'archived',
    template_type: rawData.template_type,
    primary_color: rawData.primary_color,
    font_style: rawData.font_style,
    clinic_id: rawData.clinic_id,
    created_by: rawData.created_by,
    created_at: rawData.created_at,
    updated_at: rawData.updated_at,
    clinic: rawData.clinic || rawData.clinics
  };
};

/**
 * Transforms raw section data from Supabase to typed Section object
 */
export const transformSectionData = (rawData: any): Section => {
  return {
    id: rawData.id,
    website_id: rawData.website_id,
    type: rawData.type as Section['type'],
    position: rawData.position,
    settings: rawData.settings || {},
    is_visible: rawData.is_visible,
    copy_id: rawData.copy_id,
    created_at: rawData.created_at,
    updated_at: rawData.updated_at
  };
};

/**
 * Generates a default section configuration based on type
 */
export const getDefaultSectionConfig = (type: Section['type']): Partial<Section> => {
  const configs: Record<Section['type'], Partial<Section>> = {
    hero: {
      settings: {
        backgroundStyle: 'gradient',
        showCTA: true,
        alignment: 'center'
      }
    },
    about: {
      settings: {
        layout: 'text-image',
        showHighlights: true
      }
    },
    services: {
      settings: {
        columns: 3,
        showIcons: true,
        layout: 'grid'
      }
    },
    testimonials: {
      settings: {
        layout: 'carousel',
        showRatings: true,
        autoplay: true
      }
    },
    contact: {
      settings: {
        showMap: true,
        showForm: true,
        layout: 'split'
      }
    },
    features: {
      settings: {
        columns: 2,
        showIcons: true,
        layout: 'grid'
      }
    },
    gallery: {
      settings: {
        columns: 3,
        showCaptions: true,
        layout: 'masonry'
      }
    },
    team: {
      settings: {
        columns: 3,
        showBios: true,
        layout: 'grid'
      }
    }
  };

  return configs[type] || { settings: {} };
};

/**
 * Validates section settings based on type
 */
export const validateSectionSettings = (type: Section['type'], settings: any): boolean => {
  // Basic validation - can be expanded based on requirements
  if (!settings || typeof settings !== 'object') {
    return false;
  }

  // Type-specific validation
  switch (type) {
    case 'services':
    case 'features':
      return typeof settings.columns === 'undefined' || 
             (typeof settings.columns === 'number' && settings.columns > 0 && settings.columns <= 4);
    
    case 'gallery':
    case 'team':
      return typeof settings.columns === 'undefined' || 
             (typeof settings.columns === 'number' && settings.columns > 0 && settings.columns <= 6);
    
    default:
      return true;
  }
};

/**
 * Calculates completion percentage for a website
 */
export const calculateWebsiteCompletion = (website: Website, sections: Section[]): number => {
  let score = 0;
  const maxScore = 100;

  // Basic website info (30 points)
  if (website.name) score += 10;
  if (website.primary_color) score += 10;
  if (website.template_type) score += 10;

  // Sections (50 points)
  const requiredSections: Section['type'][] = ['hero', 'about', 'services', 'contact'];
  const presentSections = sections.filter(s => s.is_visible).map(s => s.type);
  
  requiredSections.forEach(sectionType => {
    if (presentSections.includes(sectionType)) {
      score += 12.5; // 50 / 4 required sections
    }
  });

  // Content quality (20 points)
  const sectionsWithContent = sections.filter(s => 
    s.is_visible && s.copy_id && Object.keys(s.settings).length > 0
  );
  score += Math.min(20, (sectionsWithContent.length / sections.length) * 20);

  return Math.round(Math.min(score, maxScore));
};

/**
 * Generates SEO-friendly slug from website name
 */
export const generateWebsiteSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Formats website status for display
 */
export const formatWebsiteStatus = (status: Website['status']): { label: string; color: string } => {
  const statusMap = {
    draft: { label: 'Draft', color: 'text-yellow-600 bg-yellow-100' },
    published: { label: 'Published', color: 'text-green-600 bg-green-100' },
    archived: { label: 'Archived', color: 'text-gray-600 bg-gray-100' }
  };

  return statusMap[status] || statusMap.draft;
};
