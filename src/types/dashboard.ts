
export interface DashboardSession {
  id: string;
  clinic_name: string;
  created_at: string;
  last_updated: string;
  completion_score: number | null;
  selected_template: string;
  logo_url?: string;
  primary_color?: string;
  clinic_id?: string;
  // Added clinic information
  clinic?: {
    id: string;
    name: string;
    address: string | null;
    phone: string | null;
    email: string | null;
    logo_url: string | null;
  };
}
