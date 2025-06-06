
import { Section } from '@/types/website';
import { GeneratedCopy } from '@/types/copy';
import { useCopyLinking } from '@/hooks/useCopyLinking';
import { Skeleton } from '@/components/ui/skeleton';
import HeroSection from './HeroSection';
import AboutSection from './AboutSection';
import ServicesSection from './ServicesSection';
import ContactSection from './ContactSection';
import TestimonialsSection from './TestimonialsSection';
import FeaturesSection from './FeaturesSection';

interface UnifiedSectionRendererProps {
  section: Section;
  copyMode?: 'draft' | 'published';
  fallbackCopy?: GeneratedCopy | null;
  isActive?: boolean;
  onSectionClick?: (sectionId: string) => void;
}

const UnifiedSectionRenderer = ({ 
  section, 
  copyMode = 'draft', 
  fallbackCopy,
  isActive = false,
  onSectionClick
}: UnifiedSectionRendererProps) => {
  const { copy, loading, error } = useCopyLinking(section, copyMode);

  console.log('UnifiedSectionRenderer:', { 
    sectionId: section.id, 
    sectionType: section.type,
    copyMode,
    hasCopy: !!copy,
    hasFallbackCopy: !!fallbackCopy,
    loading,
    error
  });

  if (loading) {
    return <Skeleton className="h-64 w-full" />;
  }

  // Use linked copy first, then fallback copy, then default content
  const sectionCopy = copy ? getCopyForSectionType(copy, section.type) : 
                     fallbackCopy ? getCopyForSectionType(fallbackCopy, section.type) : 
                     null;

  const handleClick = () => {
    if (onSectionClick) {
      onSectionClick(section.id);
    }
  };

  const renderSection = () => {
    switch (section.type) {
      case 'hero':
        return <HeroSection section={section} copy={sectionCopy} />;
      case 'about':
        return <AboutSection section={section} copy={sectionCopy} />;
      case 'services':
        return <ServicesSection section={section} copy={sectionCopy} />;
      case 'contact':
        return <ContactSection section={section} copy={sectionCopy} />;
      case 'testimonials':
        return <TestimonialsSection section={section} copy={sectionCopy} />;
      case 'features':
        return <FeaturesSection section={section} copy={sectionCopy} />;
      default:
        return (
          <section className="py-8 px-4 bg-gray-100 dark:bg-gray-800">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {section.type.charAt(0).toUpperCase() + section.type.slice(1)} Section
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                This section type is not yet implemented in the preview.
              </p>
            </div>
          </section>
        );
    }
  };

  return (
    <div 
      className={`relative ${isActive ? 'ring-2 ring-blue-500' : ''} ${onSectionClick ? 'cursor-pointer' : ''}`}
      onClick={handleClick}
    >
      {renderSection()}
      {error && (
        <div className="absolute top-2 right-2 bg-yellow-100 border border-yellow-300 text-yellow-800 text-xs px-2 py-1 rounded">
          Copy loading error
        </div>
      )}
    </div>
  );
};

// Helper function to get the appropriate copy data for a section type
const getCopyForSectionType = (copy: GeneratedCopy, sectionType: string) => {
  switch (sectionType) {
    case 'hero':
      return copy.homepage;
    case 'about':
      return copy.about;
    case 'services':
      return copy.services;
    case 'contact':
      return copy.contact || null;
    case 'testimonials':
      return copy.testimonials || null;
    case 'features':
      return copy.features || null;
    default:
      return null;
  }
};

export default UnifiedSectionRenderer;
