
import { Section } from '@/types/website';
import UnifiedSectionRenderer from './UnifiedSectionRenderer';

interface SectionWithCopyProps {
  section: Section;
  copyMode: 'draft' | 'published';
  isActive: boolean;
}

const SectionWithCopy = ({ section, copyMode, isActive }: SectionWithCopyProps) => {
  console.log('SectionWithCopy (deprecated): Redirecting to UnifiedSectionRenderer');
  
  return (
    <UnifiedSectionRenderer
      section={section}
      copyMode={copyMode}
      isActive={isActive}
    />
  );
};

export default SectionWithCopy;
