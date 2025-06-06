export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_generated_copy: {
        Row: {
          created_at: string
          created_by: string | null
          data: Json
          id: string
          session_id: string
          type: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          data: Json
          id?: string
          session_id: string
          type: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          data?: Json
          id?: string
          session_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_generated_copy_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "onboarding_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          created_at: string
          desired_datetime: string
          id: string
          patient_email: string
          patient_name: string
          site_id: string
          status: string
        }
        Insert: {
          created_at?: string
          desired_datetime: string
          id?: string
          patient_email: string
          patient_name: string
          site_id: string
          status?: string
        }
        Update: {
          created_at?: string
          desired_datetime?: string
          id?: string
          patient_email?: string
          patient_name?: string
          site_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      clinics: {
        Row: {
          address: string | null
          created_at: string
          created_by: string
          email: string | null
          id: string
          logo_url: string | null
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          created_by: string
          email?: string | null
          id?: string
          logo_url?: string | null
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          created_by?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      cookie_consent_logs: {
        Row: {
          consent_given: boolean
          given_at: string
          id: string
          site_id: string
        }
        Insert: {
          consent_given: boolean
          given_at?: string
          id?: string
          site_id: string
        }
        Update: {
          consent_given?: boolean
          given_at?: string
          id?: string
          site_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cookie_consent_logs_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnostic_logs: {
        Row: {
          created_at: string
          error_message: string
          error_type: string
          id: string
          table_name: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          error_message: string
          error_type: string
          id?: string
          table_name?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          error_message?: string
          error_type?: string
          id?: string
          table_name?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      domains: {
        Row: {
          created_at: string
          custom_domain: string
          id: string
          is_verified: boolean
          site_id: string
        }
        Insert: {
          created_at?: string
          custom_domain: string
          id?: string
          is_verified?: boolean
          site_id: string
        }
        Update: {
          created_at?: string
          custom_domain?: string
          id?: string
          is_verified?: boolean
          site_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "domains_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          site_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          site_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          site_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          bot_response: string | null
          created_at: string
          id: string
          site_id: string
          user_message: string
        }
        Insert: {
          bot_response?: string | null
          created_at?: string
          id?: string
          site_id: string
          user_message: string
        }
        Update: {
          bot_response?: string | null
          created_at?: string
          id?: string
          site_id?: string
          user_message?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_sessions: {
        Row: {
          address: string | null
          clinic_id: string | null
          clinic_name: string | null
          completion_score: number | null
          compliance_flags: Json | null
          created_at: string | null
          created_by: string | null
          email: string | null
          font_style: string | null
          id: string
          last_updated: string | null
          logo_url: string | null
          phone: string | null
          primary_color: string | null
          selected_template: string | null
        }
        Insert: {
          address?: string | null
          clinic_id?: string | null
          clinic_name?: string | null
          completion_score?: number | null
          compliance_flags?: Json | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          font_style?: string | null
          id?: string
          last_updated?: string | null
          logo_url?: string | null
          phone?: string | null
          primary_color?: string | null
          selected_template?: string | null
        }
        Update: {
          address?: string | null
          clinic_id?: string | null
          clinic_name?: string | null
          completion_score?: number | null
          compliance_flags?: Json | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          font_style?: string | null
          id?: string
          last_updated?: string | null
          logo_url?: string | null
          phone?: string | null
          primary_color?: string | null
          selected_template?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_sessions_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sections: {
        Row: {
          copy_id: string | null
          created_at: string
          id: string
          is_visible: boolean
          position: number
          settings: Json
          type: string
          updated_at: string
          website_id: string
        }
        Insert: {
          copy_id?: string | null
          created_at?: string
          id?: string
          is_visible?: boolean
          position?: number
          settings?: Json
          type: string
          updated_at?: string
          website_id: string
        }
        Update: {
          copy_id?: string | null
          created_at?: string
          id?: string
          is_visible?: boolean
          position?: number
          settings?: Json
          type?: string
          updated_at?: string
          website_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sections_copy_id_fkey"
            columns: ["copy_id"]
            isOneToOne: false
            referencedRelation: "ai_generated_copy"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sections_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "websites"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          site_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          site_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          site_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      site_content: {
        Row: {
          content: Json | null
          id: string
          section_name: string
          site_id: string
          updated_at: string
        }
        Insert: {
          content?: Json | null
          id?: string
          section_name: string
          site_id: string
          updated_at?: string
        }
        Update: {
          content?: Json | null
          id?: string
          section_name?: string
          site_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "site_content_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      site_sections: {
        Row: {
          created_at: string
          id: string
          is_visible: boolean
          order_index: number
          section_id: string
          site_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_visible?: boolean
          order_index: number
          section_id: string
          site_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_visible?: boolean
          order_index?: number
          section_id?: string
          site_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "site_sections_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "site_sections_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      site_status: {
        Row: {
          id: string
          is_live: boolean
          last_checked: string | null
          site_id: string
          uptime_percent: number | null
        }
        Insert: {
          id?: string
          is_live?: boolean
          last_checked?: string | null
          site_id: string
          uptime_percent?: number | null
        }
        Update: {
          id?: string
          is_live?: boolean
          last_checked?: string | null
          site_id?: string
          uptime_percent?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "site_status_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      sites: {
        Row: {
          calendly_url: string | null
          created_at: string
          created_by: string
          domain: string | null
          font_style: string | null
          ga_measurement_id: string | null
          id: string
          name: string
          patient_portal_url: string | null
          primary_color: string | null
          slug: string
          tidio_key: string | null
          updated_at: string
        }
        Insert: {
          calendly_url?: string | null
          created_at?: string
          created_by: string
          domain?: string | null
          font_style?: string | null
          ga_measurement_id?: string | null
          id?: string
          name: string
          patient_portal_url?: string | null
          primary_color?: string | null
          slug: string
          tidio_key?: string | null
          updated_at?: string
        }
        Update: {
          calendly_url?: string | null
          created_at?: string
          created_by?: string
          domain?: string | null
          font_style?: string | null
          ga_measurement_id?: string | null
          id?: string
          name?: string
          patient_portal_url?: string | null
          primary_color?: string | null
          slug?: string
          tidio_key?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      staff: {
        Row: {
          bio: string | null
          created_at: string
          full_name: string
          headshot_url: string | null
          id: string
          role: string | null
          site_id: string
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          full_name: string
          headshot_url?: string | null
          id?: string
          role?: string | null
          site_id: string
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          full_name?: string
          headshot_url?: string | null
          id?: string
          role?: string | null
          site_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      template_sections: {
        Row: {
          component_path: string
          created_at: string
          default_props: Json | null
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          component_path: string
          created_at?: string
          default_props?: Json | null
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          component_path?: string
          created_at?: string
          default_props?: Json | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      templates: {
        Row: {
          badge: string | null
          badge_color: string | null
          category: string | null
          created_at: string
          default_section_order: Json | null
          description: string | null
          id: string
          name: string
          preview_image_url: string | null
          slug: string
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          badge?: string | null
          badge_color?: string | null
          category?: string | null
          created_at?: string
          default_section_order?: Json | null
          description?: string | null
          id?: string
          name: string
          preview_image_url?: string | null
          slug: string
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          badge?: string | null
          badge_color?: string | null
          category?: string | null
          created_at?: string
          default_section_order?: Json | null
          description?: string | null
          id?: string
          name?: string
          preview_image_url?: string | null
          slug?: string
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      websites: {
        Row: {
          clinic_id: string
          created_at: string
          created_by: string
          domain: string | null
          font_style: string | null
          id: string
          name: string
          primary_color: string | null
          status: string | null
          template_type: string | null
          updated_at: string
        }
        Insert: {
          clinic_id: string
          created_at?: string
          created_by: string
          domain?: string | null
          font_style?: string | null
          id?: string
          name: string
          primary_color?: string | null
          status?: string | null
          template_type?: string | null
          updated_at?: string
        }
        Update: {
          clinic_id?: string
          created_at?: string
          created_by?: string
          domain?: string | null
          font_style?: string | null
          id?: string
          name?: string
          primary_color?: string | null
          status?: string | null
          template_type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "websites_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      duplicate_session: {
        Args: { original_session_id: string; new_user_id?: string }
        Returns: string
      }
      get_cross_owner_websites: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          name: string
          clinic_id: string
          status: string
          created_by: string
          current_user_id: string
          created_at: string
        }[]
      }
      get_orphaned_sessions: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          clinic_name: string
          created_at: string
          last_updated: string
          created_by: string
        }[]
      }
      get_orphaned_websites: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          name: string
          status: string
          template_type: string
          created_by: string
          created_at: string
          updated_at: string
        }[]
      }
      get_recent_diagnostic_errors: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          error_type: string
          error_message: string
          table_name: string
          user_id: string
          created_at: string
        }[]
      }
      reassign_session_to_clinic: {
        Args: { session_id: string; target_clinic_id: string }
        Returns: boolean
      }
      test_rls_access: {
        Args: Record<PropertyKey, never>
        Returns: {
          table_name: string
          can_select: boolean
          can_insert: boolean
          can_update: boolean
          can_delete: boolean
          record_count: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
