
export interface Website {
  id: string;
  clinic_id: string;
  name: string;
  domain?: string;
  status: 'draft' | 'published' | 'archived';
  template_type: string;
  primary_color?: string;
  font_style?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  clinic?: {
    name: string;
  };
}

export interface Section {
  id: string;
  website_id: string;
  type: 'hero' | 'about' | 'services' | 'testimonials' | 'contact' | 'features' | 'gallery' | 'team';
  position: number;
  settings: Record<string, any>;
  copy_id?: string;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface SectionTemplate {
  type: Section['type'];
  name: string;
  description: string;
  icon: string;
  defaultSettings: Record<string, any>;
}
