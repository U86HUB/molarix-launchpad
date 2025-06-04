
import { Section, Website } from '@/types/website';

type SectionType = "hero" | "about" | "services" | "testimonials" | "contact" | "features" | "gallery" | "team";
type WebsiteStatus = "draft" | "published" | "archived";

export function isValidSectionType(type: string): type is SectionType {
  return ["hero", "about", "services", "testimonials", "contact", "features", "gallery", "team"].includes(type);
}

export function isValidWebsiteStatus(status: string): status is WebsiteStatus {
  return ["draft", "published", "archived"].includes(status);
}

// Helper function to safely convert Json to Record<string, any>
export function safeJsonToRecord(json: any): Record<string, any> {
  if (typeof json === 'object' && json !== null && !Array.isArray(json)) {
    return json as Record<string, any>;
  }
  return {};
}

export function transformWebsiteData(websiteData: any): Website {
  return {
    ...websiteData,
    status: isValidWebsiteStatus(websiteData.status) ? websiteData.status : 'draft'
  };
}

export function transformSectionData(sectionData: any): Section {
  return {
    ...sectionData,
    type: isValidSectionType(sectionData.type) ? sectionData.type : 'hero',
    settings: safeJsonToRecord(sectionData.settings)
  };
}
