
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
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={settings.title || ''}
          onChange={(e) => onSettingsChange('title', e.target.value)}
          placeholder="Enter section title"
        />
      </div>
      <div>
        <Label htmlFor="subtitle">Subtitle</Label>
        <Input
          id="subtitle"
          value={settings.subtitle || ''}
          onChange={(e) => onSettingsChange('subtitle', e.target.value)}
          placeholder="Enter subtitle"
        />
      </div>
    </div>
  );
};

export default ServicesSectionForm;
