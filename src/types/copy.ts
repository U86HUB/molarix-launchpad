
export interface GeneratedCopy {
  homepage: {
    headline: string;
    subheadline: string;
    welcomeMessage: string;
    ctaText: string;
  };
  services: {
    title: string;
    intro: string;
    services: Array<{
      name: string;
      description: string;
    }>;
  };
  about: {
    title: string;
    intro: string;
    mission: string;
    values: Array<{
      name: string;
      description: string;
    }>;
  };
}

export interface OnboardingSession {
  id: string;
  clinic_name: string;
  address: string;
  phone: string;
  email: string;
  logo_url: string | null;
  primary_color: string;
  font_style: string;
  selected_template: string;
}
