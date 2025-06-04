
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface ContactSectionFormProps {
  settings: Record<string, any>;
  onSettingsChange: (key: string, value: any) => void;
}

const ContactSectionForm = ({ settings, onSettingsChange }: ContactSectionFormProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={settings.title || ''}
          onChange={(e) => onSettingsChange('title', e.target.value)}
          placeholder="Enter contact section title"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="showForm"
          checked={settings.showForm || false}
          onCheckedChange={(checked) => onSettingsChange('showForm', checked)}
        />
        <Label htmlFor="showForm">Show Contact Form</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="showMap"
          checked={settings.showMap || false}
          onCheckedChange={(checked) => onSettingsChange('showMap', checked)}
        />
        <Label htmlFor="showMap">Show Map</Label>
      </div>
    </div>
  );
};

export default ContactSectionForm;
