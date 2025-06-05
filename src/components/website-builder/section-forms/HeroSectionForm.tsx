
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
        <Label htmlFor="hero-title">Title</Label>
        <Input
          id="hero-title"
          name="hero-title"
          value={settings.title || ''}
          onChange={(e) => onSettingsChange('title', e.target.value)}
          placeholder="Enter hero title"
          autoComplete="off"
          aria-describedby="hero-title-description"
        />
        <p id="hero-title-description" className="text-xs text-muted-foreground mt-1">
          Main headline for your hero section
        </p>
      </div>
      <div>
        <Label htmlFor="hero-subtitle">Subtitle</Label>
        <Input
          id="hero-subtitle"
          name="hero-subtitle"
          value={settings.subtitle || ''}
          onChange={(e) => onSettingsChange('subtitle', e.target.value)}
          placeholder="Enter hero subtitle"
          autoComplete="off"
          aria-describedby="hero-subtitle-description"
        />
        <p id="hero-subtitle-description" className="text-xs text-muted-foreground mt-1">
          Supporting text that appears below the main title
        </p>
      </div>
      <div>
        <Label htmlFor="hero-button-text">Button Text</Label>
        <Input
          id="hero-button-text"
          name="hero-button-text"
          value={settings.buttonText || ''}
          onChange={(e) => onSettingsChange('buttonText', e.target.value)}
          placeholder="Enter button text"
          autoComplete="off"
          aria-describedby="hero-button-text-description"
        />
        <p id="hero-button-text-description" className="text-xs text-muted-foreground mt-1">
          Text that appears on the call-to-action button
        </p>
      </div>
      <div>
        <Label htmlFor="hero-button-link">Button Link</Label>
        <Input
          id="hero-button-link"
          name="hero-button-link"
          type="url"
          value={settings.buttonLink || ''}
          onChange={(e) => onSettingsChange('buttonLink', e.target.value)}
          placeholder="Enter button link"
          autoComplete="url"
          aria-describedby="hero-button-link-description"
        />
        <p id="hero-button-link-description" className="text-xs text-muted-foreground mt-1">
          URL where the button should navigate (e.g., /contact)
        </p>
      </div>
    </div>
  );
};

export default HeroSectionForm;
