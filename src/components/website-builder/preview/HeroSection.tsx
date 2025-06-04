
import { Section } from '@/types/website';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  section: Section;
  copy?: any;
}

const HeroSection = ({ section, copy }: HeroSectionProps) => {
  const settings = section.settings;
  
  // Use copy content if available, otherwise use settings or defaults
  const title = copy?.headline || settings.title || 'Welcome to Our Practice';
  const subtitle = copy?.subheadline || settings.subtitle || 'Providing exceptional care with a personal touch';
  const ctaText = copy?.ctaText || settings.ctaText || 'Book Appointment';

  return (
    <section 
      className="py-20 px-4 sm:px-6 lg:px-8 text-white"
      style={{ backgroundColor: 'var(--preview-primary, #4f46e5)' }}
    >
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6">
          {title}
        </h1>
        <p className="text-xl mb-8 opacity-90">
          {subtitle}
        </p>
        <Button 
          size="lg" 
          className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3"
          style={{ color: 'var(--preview-primary, #4f46e5)' }}
        >
          {ctaText}
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
