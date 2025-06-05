
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
  contact?: {
    title: string;
    intro: string;
    phone: string;
    email: string;
    address: string;
  };
  testimonials?: {
    title: string;
    intro: string;
    testimonials: Array<{
      name: string;
      text: string;
      role: string;
    }>;
  };
  features?: {
    title: string;
    intro: string;
    features: Array<{
      name: string;
      description: string;
      icon: string;
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
