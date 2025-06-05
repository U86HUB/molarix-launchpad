
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
        <Label htmlFor="services-title">Title</Label>
        <Input
          id="services-title"
          name="services-title"
          value={settings.title || ''}
          onChange={(e) => onSettingsChange('title', e.target.value)}
          placeholder="Enter section title"
          autoComplete="off"
          aria-describedby="services-title-description"
        />
        <p id="services-title-description" className="text-xs text-muted-foreground mt-1">
          Main heading for your services section
        </p>
      </div>
      <div>
        <Label htmlFor="services-subtitle">Subtitle</Label>
        <Input
          id="services-subtitle"
          name="services-subtitle"
          value={settings.subtitle || ''}
          onChange={(e) => onSettingsChange('subtitle', e.target.value)}
          placeholder="Enter subtitle"
          autoComplete="off"
          aria-describedby="services-subtitle-description"
        />
        <p id="services-subtitle-description" className="text-xs text-muted-foreground mt-1">
          Supporting text that describes your services
        </p>
      </div>
    </div>
  );
};

export default ServicesSectionForm;
