
import { GeneratedCopy } from '@/types/copy';

export const getFallbackCopy = (clinicName: string = "Your Dental Clinic"): GeneratedCopy => {
  return {
    homepage: {
      headline: `Welcome to ${clinicName}`,
      subheadline: "Your trusted partner for comprehensive dental care and beautiful smiles",
      welcomeMessage: `At ${clinicName}, we're committed to providing exceptional dental care in a comfortable and welcoming environment. Our experienced team uses the latest technology to ensure you receive the best possible treatment for your oral health needs.`,
      ctaText: "Book Appointment"
    },
    services: {
      title: "Our Services",
      intro: "We offer a comprehensive range of dental services to meet all your oral health needs, from routine checkups to advanced procedures.",
      services: [
        {
          name: "General Dentistry",
          description: "Comprehensive oral health care including cleanings, exams, fillings, and preventive treatments to maintain your dental health."
        },
        {
          name: "Cosmetic Dentistry",
          description: "Transform your smile with teeth whitening, veneers, and other aesthetic treatments designed to enhance your appearance."
        },
        {
          name: "Orthodontics",
          description: "Straighten your teeth and correct bite issues with traditional braces or modern clear aligner treatments."
        },
        {
          name: "Oral Surgery",
          description: "Expert surgical procedures including tooth extractions, dental implants, and other oral surgery services."
        }
      ]
    },
    about: {
      title: "About Our Practice",
      intro: `${clinicName} has been serving our community with exceptional dental care for years. We believe in creating lasting relationships with our patients through personalized care and attention.`,
      mission: "Our mission is to provide the highest quality dental care while ensuring every patient feels comfortable and confident in their treatment.",
      values: [
        {
          name: "Excellence",
          description: "We strive for the highest standards in everything we do."
        },
        {
          name: "Compassion",
          description: "We treat every patient with kindness and understanding."
        },
        {
          name: "Innovation",
          description: "We embrace the latest technology and techniques in dental care."
        }
      ]
    }
  };
};
