
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface HeroSectionFormProps {
  settings: Record<string, any>;
  onSettingsChange: (key: string, value: any) => void;
}

const HeroSectionForm = ({ settings, onSettingsChange }: HeroSectionFormProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={settings.title || ''}
          onChange={(e) => onSettingsChange('title', e.target.value)}
          placeholder="Enter hero title"
        />
      </div>
      <div>
        <Label htmlFor="subtitle">Subtitle</Label>
        <Input
          id="subtitle"
          value={settings.subtitle || ''}
          onChange={(e) => onSettingsChange('subtitle', e.target.value)}
          placeholder="Enter hero subtitle"
        />
      </div>
      <div>
        <Label htmlFor="buttonText">Button Text</Label>
        <Input
          id="buttonText"
          value={settings.buttonText || ''}
          onChange={(e) => onSettingsChange('buttonText', e.target.value)}
          placeholder="Enter button text"
        />
      </div>
      <div>
        <Label htmlFor="buttonLink">Button Link</Label>
        <Input
          id="buttonLink"
          value={settings.buttonLink || ''}
          onChange={(e) => onSettingsChange('buttonLink', e.target.value)}
          placeholder="Enter button link"
        />
      </div>
    </div>
  );
};

export default HeroSectionForm;
