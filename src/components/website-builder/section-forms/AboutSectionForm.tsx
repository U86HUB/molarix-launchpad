
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
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={settings.title || ''}
          onChange={(e) => onSettingsChange('title', e.target.value)}
          placeholder="Enter section title"
        />
      </div>
      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={settings.content || ''}
          onChange={(e) => onSettingsChange('content', e.target.value)}
          placeholder="Enter content"
          rows={4}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="showImage"
          checked={settings.showImage || false}
          onCheckedChange={(checked) => onSettingsChange('showImage', checked)}
        />
        <Label htmlFor="showImage">Show Image</Label>
      </div>
    </div>
  );
};

export default AboutSectionForm;
