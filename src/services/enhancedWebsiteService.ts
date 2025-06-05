
import { Website } from '@/types/website';
import { SupabaseService } from './supabaseService';
import { ErrorService } from './errorService';

export interface CreateWebsiteData {
  name: string;
  clinicId: string;
  templateType: string;
  primaryColor: string;
  fontStyle: string;
}

export class EnhancedWebsiteService {
  private static readonly TABLE = 'websites';
  private static readonly COMPONENT = 'WebsiteService';

  static async fetchWebsites(userId: string): Promise<Website[]> {
    console.log('🔄 Fetching websites for user:', userId);

    const data = await SupabaseService.fetchMany<any>(
      this.TABLE,
      { created_by: userId },
      {
        select: `
          *,
          clinics!inner(name)
        `,
        orderBy: { column: 'updated_at', ascending: false },
        component: this.COMPONENT
      }
    );

    const typedWebsites: Website[] = data.map(website => ({
      id: website.id,
      name: website.name,
      domain: website.domain,
      status: website.status as 'draft' | 'published' | 'archived',
      template_type: website.template_type,
      primary_color: website.primary_color,
      font_style: website.font_style,
      clinic_id: website.clinic_id,
      created_by: website.created_by,
      created_at: website.created_at,
      updated_at: website.updated_at,
      clinic: { name: website.clinics?.name || 'Unknown Clinic' }
    }));

    console.log('✅ Fetched websites:', typedWebsites.length);
    return typedWebsites;
  }

  static async createWebsite(websiteData: CreateWebsiteData, userId: string): Promise<Website | null> {
    console.log('🔄 Creating website:', websiteData);

    const data = await SupabaseService.insert<any>(
      this.TABLE,
      {
        name: websiteData.name,
        clinic_id: websiteData.clinicId,
        template_type: websiteData.templateType,
        primary_color: websiteData.primaryColor,
        font_style: websiteData.fontStyle,
        status: 'draft',
        created_by: userId,
      },
      {
        select: `
          *,
          clinics!inner(name)
        `,
        component: this.COMPONENT,
        successMessage: `Website "${websiteData.name}" has been created successfully.`
      }
    );

    if (!data) return null;

    const newWebsite: Website = {
      id: data.id,
      name: data.name,
      domain: data.domain,
      status: data.status as 'draft' | 'published' | 'archived',
      template_type: data.template_type,
      primary_color: data.primary_color,
      font_style: data.font_style,
      clinic_id: data.clinic_id,
      created_by: data.created_by,
      created_at: data.created_at,
      updated_at: data.updated_at,
      clinic: { name: data.clinics?.name || 'Unknown Clinic' }
    };

    return newWebsite;
  }

  static async deleteWebsite(websiteId: string, userId: string): Promise<boolean> {
    console.log('🔄 Deleting website:', websiteId);

    return await SupabaseService.delete(
      this.TABLE,
      { id: websiteId, created_by: userId },
      {
        component: this.COMPONENT,
        successMessage: 'Website has been deleted successfully.'
      }
    );
  }

  static async fetchWebsiteById(websiteId: string, userId?: string): Promise<Website | null> {
    console.log('🔄 Fetching website by ID:', websiteId);

    const filters: Record<string, any> = { id: websiteId };
    if (userId) {
      filters.created_by = userId;
    }

    const data = await SupabaseService.fetchOne<any>(
      this.TABLE,
      filters,
      {
        select: `
          *,
          clinics!inner(name, address, phone, email, logo_url)
        `,
        component: this.COMPONENT,
        required: false
      }
    );

    if (!data) return null;

    const website: Website = {
      id: data.id,
      name: data.name,
      domain: data.domain,
      status: data.status as 'draft' | 'published' | 'archived',
      template_type: data.template_type,
      primary_color: data.primary_color,
      font_style: data.font_style,
      clinic_id: data.clinic_id,
      created_by: data.created_by,
      created_at: data.created_at,
      updated_at: data.updated_at,
      clinic: { name: data.clinics?.name || 'Unknown Clinic' }
    };

    return website;
  }

  static async updateWebsiteSettings(
    websiteId: string, 
    userId: string, 
    updates: Partial<Website>
  ): Promise<Website | null> {
    console.log('🔄 Updating website settings:', websiteId, updates);

    const data = await SupabaseService.update<any>(
      this.TABLE,
      { id: websiteId, created_by: userId },
      { ...updates, updated_at: new Date().toISOString() },
      {
        select: `
          *,
          clinics!inner(name)
        `,
        component: this.COMPONENT,
        successMessage: 'Website settings updated successfully.'
      }
    );

    if (!data) return null;

    const website: Website = {
      id: data.id,
      name: data.name,
      domain: data.domain,
      status: data.status as 'draft' | 'published' | 'archived',
      template_type: data.template_type,
      primary_color: data.primary_color,
      font_style: data.font_style,
      clinic_id: data.clinic_id,
      created_by: data.created_by,
      created_at: data.created_at,
      updated_at: data.updated_at,
      clinic: { name: data.clinics?.name || 'Unknown Clinic' }
    };

    return website;
  }
}
