
export interface Template {
  id: string;
  name: string;
  description: string;
  image: string;
  features: string[];
}

export const templates: Template[] = [
  {
    id: 'template-a',
    name: 'Modern Dental',
    description: 'Clean and professional design perfect for dental practices',
    image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop&crop=center',
    features: ['Mobile Responsive', 'SEO Optimized', 'Contact Forms']
  },
  {
    id: 'template-b',
    name: 'Medical Center Pro',
    description: 'Comprehensive layout for medical centers and hospitals',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop&crop=center',
    features: ['Patient Portal', 'Appointment Booking', 'Service Showcase']
  },
  {
    id: 'template-c',
    name: 'Specialty Clinic',
    description: 'Elegant design tailored for specialty medical practices',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop&crop=center',
    features: ['Gallery Section', 'Team Profiles', 'Testimonials']
  }
];
