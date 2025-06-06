
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ServicesSectionFormProps {
  settings: Record<string, any>;
  onSettingsChange: (key: string, value: any) => void;
}

const ServicesSectionForm = ({ settings, onSettingsChange }: ServicesSectionFormProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="services-section-title">Title</Label>
        <Input
          id="services-section-title"
          name="services-section-title"
          value={settings.title || ''}
          onChange={(e) => onSettingsChange('title', e.target.value)}
          placeholder="Enter section title"
          autoComplete="off"
          aria-describedby="services-section-title-description"
        />
        <p id="services-section-title-description" className="text-xs text-muted-foreground mt-1">
          Main heading for your services section
        </p>
      </div>
      <div>
        <Label htmlFor="services-section-subtitle">Subtitle</Label>
        <Input
          id="services-section-subtitle"
          name="services-section-subtitle"
          value={settings.subtitle || ''}
          onChange={(e) => onSettingsChange('subtitle', e.target.value)}
          placeholder="Enter subtitle"
          autoComplete="off"
          aria-describedby="services-section-subtitle-description"
        />
        <p id="services-section-subtitle-description" className="text-xs text-muted-foreground mt-1">
          Supporting text that describes your services
        </p>
      </div>
    </div>
  );
};

export default ServicesSectionForm;
