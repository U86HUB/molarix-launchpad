
import { Section } from '@/types/website';
import HeroSectionForm from './section-forms/HeroSectionForm';
import AboutSectionForm from './section-forms/AboutSectionForm';
import ServicesSectionForm from './section-forms/ServicesSectionForm';
import ContactSectionForm from './section-forms/ContactSectionForm';

interface SectionSettingsFormProps {
  section: Section;
  settings: Record<string, any>;
  onSettingsChange: (key: string, value: any) => void;
}

const SectionSettingsForm = ({ section, settings, onSettingsChange }: SectionSettingsFormProps) => {
  switch (section.type) {
    case 'hero':
      return <HeroSectionForm settings={settings} onSettingsChange={onSettingsChange} />;
    
    case 'about':
      return <AboutSectionForm settings={settings} onSettingsChange={onSettingsChange} />;
    
    case 'services':
    case 'features':
      return <ServicesSectionForm settings={settings} onSettingsChange={onSettingsChange} />;
    
    case 'contact':
      return <ContactSectionForm settings={settings} onSettingsChange={onSettingsChange} />;
    
    default:
      return <div>No settings available for this section type.</div>;
  }
};

export default SectionSettingsForm;
