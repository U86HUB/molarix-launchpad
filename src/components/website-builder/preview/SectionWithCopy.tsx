
import { Section } from '@/types/website';
import { useCopyLinking } from '@/hooks/useCopyLinking';
import { Skeleton } from '@/components/ui/skeleton';
import InlineEditableSection from './InlineEditableSection';
import HeroSection from './HeroSection';
import AboutSection from './AboutSection';
import ServicesSection from './ServicesSection';
import ContactSection from './ContactSection';
import TestimonialsSection from './TestimonialsSection';
import FeaturesSection from './FeaturesSection';

interface SectionWithCopyProps {
  section: Section;
  copyMode: 'draft' | 'published';
  isActive: boolean;
}

const SectionWithCopy = ({ section, copyMode, isActive }: SectionWithCopyProps) => {
  console.log('SectionWithCopy rendering:', { 
    sectionId: section.id, 
    sectionType: section.type, 
    copyMode,
    copyId: section.copy_id 
  });

  const { copy, loading, error } = useCopyLinking(section, copyMode);

  console.log('Copy linking result:', { 
    copy, 
    loading, 
    error,
    sectionType: section.type 
  });

  if (loading) {
    console.log('Loading copy for section:', section.id);
    return <Skeleton className="h-64 w-full" />;
  }

  if (error) {
    console.error('Copy linking error for section:', section.id, error);
  }

  // Get copy for this specific section type
  const sectionCopy = copy ? getCopyForSectionType(copy, section.type) : null;
  
  console.log('Section copy extracted:', { 
    sectionType: section.type, 
    sectionCopy,
    hasCopy: !!sectionCopy 
  });

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
                {!sectionCopy && (
                  <span className="block mt-2 text-sm text-blue-600">
                    No copy generated yet. Add copy in the editor.
                  </span>
                )}
              </p>
            </div>
          </section>
        );
    }
  };

  return (
    <InlineEditableSection
      section={section}
      copy={sectionCopy}
      copyMode={copyMode}
      onCopyUpdated={(updatedCopy) => {
        console.log('Copy updated in section:', section.id, updatedCopy);
        // Trigger a re-fetch of copy data
        window.location.reload(); // Simple approach for now
      }}
    >
      {renderSection()}
    </InlineEditableSection>
  );
};

const getCopyForSectionType = (copy: any, sectionType: string) => {
  console.log('Getting copy for section type:', { sectionType, copy });
  
  switch (sectionType) {
    case 'hero':
      return copy.homepage;
    case 'about':
      return copy.about;
    case 'services':
      return copy.services;
    case 'contact':
      return copy.contact;
    case 'testimonials':
      return copy.testimonials;
    case 'features':
      return copy.features;
    default:
      console.warn('No copy mapping for section type:', sectionType);
      return null;
  }
};

export default SectionWithCopy;
