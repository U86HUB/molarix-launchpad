
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
  const { copy, loading, error } = useCopyLinking(section, copyMode);

  if (loading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (error) {
    console.error('Copy linking error for section:', section.id, error);
  }

  // Get copy for this specific section type
  const sectionCopy = copy ? getCopyForSectionType(copy, section.type) : null;

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
        // Trigger a re-fetch of copy data
        window.location.reload(); // Simple approach for now
      }}
    >
      {renderSection()}
    </InlineEditableSection>
  );
};

const getCopyForSectionType = (copy: any, sectionType: string) => {
  switch (sectionType) {
    case 'hero':
      return copy.homepage;
    case 'about':
      return copy.about;
    case 'services':
      return copy.services;
    default:
      return null;
  }
};

export default SectionWithCopy;
