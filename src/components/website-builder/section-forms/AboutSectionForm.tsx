
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface AboutSectionFormProps {
  settings: Record<string, any>;
  onSettingsChange: (key: string, value: any) => void;
}

const AboutSectionForm = ({ settings, onSettingsChange }: AboutSectionFormProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="about-title">Title</Label>
        <Input
          id="about-title"
          name="about-title"
          value={settings.title || ''}
          onChange={(e) => onSettingsChange('title', e.target.value)}
          placeholder="Enter section title"
          autoComplete="off"
          aria-describedby="about-title-description"
        />
        <p id="about-title-description" className="text-xs text-muted-foreground mt-1">
          Heading for your about section
        </p>
      </div>
      <div>
        <Label htmlFor="about-content">Content</Label>
        <Textarea
          id="about-content"
          name="about-content"
          value={settings.content || ''}
          onChange={(e) => onSettingsChange('content', e.target.value)}
          placeholder="Enter content"
          rows={4}
          aria-describedby="about-content-description"
        />
        <p id="about-content-description" className="text-xs text-muted-foreground mt-1">
          Detailed information about your practice
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="about-show-image"
          checked={settings.showImage || false}
          onCheckedChange={(checked) => onSettingsChange('showImage', checked)}
          aria-describedby="about-show-image-description"
        />
        <Label htmlFor="about-show-image">Show Image</Label>
        <p id="about-show-image-description" className="text-xs text-muted-foreground sr-only">
          Toggle to display an image in the about section
        </p>
      </div>
    </div>
  );
};

export default AboutSectionForm;
