
import { SectionTemplate } from '@/types/website';

export const sectionTemplates: SectionTemplate[] = [
  {
    type: 'hero',
    name: 'Hero Section',
    description: 'Main banner with title and call-to-action',
    icon: 'Zap',
    defaultSettings: {
      title: 'Welcome to Our Clinic',
      subtitle: 'Professional healthcare services you can trust',
      buttonText: 'Book Appointment',
      buttonLink: '#contact',
      backgroundType: 'color',
      backgroundColor: '#0066cc',
    },
  },
  {
    type: 'about',
    name: 'About Us',
    description: 'Information about your clinic and team',
    icon: 'Users',
    defaultSettings: {
      title: 'About Our Clinic',
      content: 'We provide exceptional healthcare services with a focus on patient care and comfort.',
      showImage: true,
      imagePosition: 'right',
    },
  },
  {
    type: 'services',
    name: 'Services',
    description: 'List of medical services offered',
    icon: 'Heart',
    defaultSettings: {
      title: 'Our Services',
      subtitle: 'Comprehensive healthcare solutions',
      layout: 'grid',
      columns: 3,
      services: [
        {
          name: 'General Consultation',
          description: 'Comprehensive health assessments and consultations',
          icon: 'Stethoscope',
        },
        {
          name: 'Preventive Care',
          description: 'Regular check-ups and health screenings',
          icon: 'Shield',
        },
        {
          name: 'Emergency Care',
          description: '24/7 emergency medical services',
          icon: 'AlertCircle',
        },
      ],
    },
  },
  {
    type: 'testimonials',
    name: 'Testimonials',
    description: 'Patient reviews and testimonials',
    icon: 'MessageSquare',
    defaultSettings: {
      title: 'What Our Patients Say',
      layout: 'carousel',
      testimonials: [
        {
          name: 'Sarah Johnson',
          content: 'Excellent care and professional staff. Highly recommended!',
          rating: 5,
        },
        {
          name: 'Michael Smith',
          content: 'Very satisfied with the treatment I received.',
          rating: 5,
        },
      ],
    },
  },
  {
    type: 'contact',
    name: 'Contact Information',
    description: 'Contact details and appointment booking',
    icon: 'Phone',
    defaultSettings: {
      title: 'Contact Us',
      showForm: true,
      showMap: true,
      formFields: ['name', 'email', 'phone', 'message'],
    },
  },
  {
    type: 'features',
    name: 'Features',
    description: 'Highlight key features and benefits',
    icon: 'Star',
    defaultSettings: {
      title: 'Why Choose Us',
      layout: 'grid',
      columns: 2,
      features: [
        {
          name: 'Expert Doctors',
          description: 'Board-certified physicians with years of experience',
          icon: 'UserCheck',
        },
        {
          name: 'Modern Equipment',
          description: 'State-of-the-art medical technology',
          icon: 'Settings',
        },
      ],
    },
  },
  {
    type: 'gallery',
    name: 'Gallery',
    description: 'Photo gallery of your clinic',
    icon: 'Image',
    defaultSettings: {
      title: 'Our Facility',
      layout: 'masonry',
      columns: 3,
      images: [],
    },
  },
  {
    type: 'team',
    name: 'Our Team',
    description: 'Meet your medical team',
    icon: 'Users2',
    defaultSettings: {
      title: 'Meet Our Team',
      layout: 'grid',
      columns: 3,
      members: [
        {
          name: 'Dr. Jane Smith',
          role: 'Chief Medical Officer',
          bio: 'Specialized in internal medicine with 15 years of experience',
          image: '',
        },
      ],
    },
  },
];
