
import { Website, Section } from '@/types/website';

export const transformWebsiteData = (data: any): Website => {
  return {
    id: data.id,
    clinic_id: data.clinic_id,
    name: data.name,
    domain: data.domain,
    status: data.status,
    template_type: data.template_type,
    primary_color: data.primary_color,
    font_style: data.font_style,
    created_by: data.created_by,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
};

export const transformSectionData = (data: any): Section => {
  return {
    id: data.id,
    website_id: data.website_id,
    type: data.type,
    position: data.position,
    settings: data.settings || {},
    copy_id: data.copy_id,
    is_visible: data.is_visible,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
};

export const validateWebsiteId = (websiteId: string | undefined): boolean => {
  if (!websiteId) {
    console.error('Website ID is missing');
    return false;
  }
  
  // Basic UUID validation
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(websiteId)) {
    console.error('Invalid website ID format:', websiteId);
    return false;
  }
  
  return true;
};

export const validateClinicId = (clinicId: string | undefined): boolean => {
  if (!clinicId) {
    console.error('Clinic ID is missing');
    return false;
  }
  
  // Basic UUID validation
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(clinicId)) {
    console.error('Invalid clinic ID format:', clinicId);
    return false;
  }
  
  return true;
};
