
export interface SiteSection {
  section_id: string;
  order_index: number;
  is_visible: boolean;
}

export interface SectionTemplate {
  id: string;
  slug: string;
  default_props: Record<string, any>;
}

export interface SiteContent {
  section_name: string;
  content: Record<string, any>;
}

export interface Site {
  id: string;
  name: string;
  slug: string;
  primary_color?: string;
  font_style?: string;
  template_type?: string;
}
