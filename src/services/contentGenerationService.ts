
import { Section } from '@/types/website';
import { WebsiteInitializationData } from './websiteInitializationService';

export class ContentGenerationService {
  static generateSectionContent(sectionType: Section['type'], clinicData?: WebsiteInitializationData['clinicData']): any {
    const clinicName = clinicData?.name || 'Your Practice';
    
    switch (sectionType) {
      case 'hero':
        return {
          headline: `Welcome to ${clinicName}`,
          subheadline: 'Providing exceptional dental care with a personal touch',
          ctaText: 'Schedule Appointment',
          ctaLink: '#contact'
        };

      case 'about':
        return {
          title: 'About Our Practice',
          content: `At ${clinicName}, we are committed to providing the highest quality dental care in a comfortable and welcoming environment. Our experienced team uses the latest technology and techniques to ensure you receive the best possible treatment.`,
          highlights: [
            'Experienced professional team',
            'State-of-the-art equipment',
            'Comfortable, modern facility',
            'Personalized treatment plans'
          ]
        };

      case 'services':
        return {
          title: 'Our Services',
          services: [
            {
              name: 'General Dentistry',
              description: 'Comprehensive dental care including cleanings, fillings, and preventive treatments.',
              icon: 'tooth'
            },
            {
              name: 'Cosmetic Dentistry',
              description: 'Enhance your smile with teeth whitening, veneers, and aesthetic treatments.',
              icon: 'smile'
            },
            {
              name: 'Restorative Dentistry',
              description: 'Restore damaged teeth with crowns, bridges, and dental implants.',
              icon: 'repair'
            }
          ]
        };

      case 'testimonials':
        return {
          title: 'What Our Patients Say',
          testimonials: [
            {
              name: 'Sarah Johnson',
              text: 'The entire team at this practice is fantastic. They made me feel comfortable throughout my treatment.',
              rating: 5
            },
            {
              name: 'Michael Chen',
              text: 'Professional, friendly, and thorough. I highly recommend this dental practice.',
              rating: 5
            },
            {
              name: 'Lisa Rodriguez',
              text: 'Outstanding service and care. The best dental experience I\'ve ever had.',
              rating: 5
            }
          ]
        };

      case 'contact':
        return {
          title: 'Contact Us',
          address: clinicData?.address || '123 Main Street, City, State 12345',
          phone: clinicData?.phone || '(555) 123-4567',
          email: clinicData?.email || 'info@yourpractice.com',
          hours: {
            'Monday - Friday': '8:00 AM - 6:00 PM',
            'Saturday': '9:00 AM - 3:00 PM',
            'Sunday': 'Closed'
          }
        };

      case 'features':
        return {
          title: 'Why Choose Us',
          features: [
            {
              name: 'Expert Care',
              description: 'Board-certified professionals with years of experience',
              icon: 'star'
            },
            {
              name: 'Modern Technology',
              description: 'State-of-the-art equipment and techniques',
              icon: 'settings'
            }
          ]
        };

      case 'gallery':
        return {
          title: 'Our Facility',
          images: [],
          description: 'Take a look at our modern, comfortable facility'
        };

      case 'team':
        return {
          title: 'Meet Our Team',
          members: [
            {
              name: 'Dr. Jane Smith',
              role: 'Lead Practitioner',
              bio: 'Specialized in comprehensive care with 15 years of experience',
              image: ''
            }
          ]
        };

      default:
        return {
          title: `${String(sectionType).charAt(0).toUpperCase() + String(sectionType).slice(1)} Section`,
          content: 'Content will be customized for your practice.'
        };
    }
  }
}
