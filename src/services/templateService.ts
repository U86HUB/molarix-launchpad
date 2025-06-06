
import { supabase } from '@/integrations/supabase/client';
import { ErrorService } from './errorService';
import { Template, SectionTemplate } from '@/types/website';

export const TemplateService = {
  async fetchAllTemplates(): Promise<Template[]> {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      // Transform the data to match our Template interface
      return (data || []).map(template => ({
        ...template,
        default_section_order: Array.isArray(template.default_section_order) 
          ? template.default_section_order 
          : []
      }));
    } catch (error) {
      ErrorService.handle(error, {
        operation: 'fetch templates',
        component: 'templateService'
      });
      return [];
    }
  },
  
  async fetchTemplateCategories(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('category')
        .order('category');
      
      if (error) throw error;
      
      // Extract unique categories
      const categories = data
        .map(item => item.category)
        .filter((value, index, self) => 
          value && self.indexOf(value) === index
        );
      
      return categories || [];
    } catch (error) {
      ErrorService.handle(error, {
        operation: 'fetch template categories',
        component: 'templateService'
      });
      return [];
    }
  },
  
  async fetchTemplateSections(): Promise<SectionTemplate[]> {
    try {
      const { data, error } = await supabase
        .from('template_sections')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      return (data || []).map(section => ({
        type: section.slug,
        name: section.name,
        description: '',
        icon: 'Layout',
        defaultSettings: (section.default_props && typeof section.default_props === 'object') 
          ? section.default_props as Record<string, any>
          : {}
      }));
    } catch (error) {
      ErrorService.handle(error, {
        operation: 'fetch template sections',
        component: 'templateService'
      });
      return [];
    }
  },
  
  async getTemplateById(id: string): Promise<Template | null> {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        return {
          ...data,
          default_section_order: Array.isArray(data.default_section_order) 
            ? data.default_section_order 
            : []
        };
      }
      
      return null;
    } catch (error) {
      ErrorService.handle(error, {
        operation: 'get template',
        component: 'templateService'
      });
      return null;
    }
  }
};
