
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
        <Label htmlFor="contact-title">Title</Label>
        <Input
          id="contact-title"
          name="contact-title"
          value={settings.title || ''}
          onChange={(e) => onSettingsChange('title', e.target.value)}
          placeholder="Enter contact section title"
          autoComplete="off"
          aria-describedby="contact-title-description"
        />
        <p id="contact-title-description" className="text-xs text-muted-foreground mt-1">
          Heading for your contact section
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="contact-show-form"
          checked={settings.showForm || false}
          onCheckedChange={(checked) => onSettingsChange('showForm', checked)}
          aria-describedby="contact-show-form-description"
        />
        <Label htmlFor="contact-show-form">Show Contact Form</Label>
        <p id="contact-show-form-description" className="text-xs text-muted-foreground sr-only">
          Display a contact form for patient inquiries
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="contact-show-map"
          checked={settings.showMap || false}
          onCheckedChange={(checked) => onSettingsChange('showMap', checked)}
          aria-describedby="contact-show-map-description"
        />
        <Label htmlFor="contact-show-map">Show Map</Label>
        <p id="contact-show-map-description" className="text-xs text-muted-foreground sr-only">
          Display a map showing your clinic location
        </p>
      </div>
    </div>
  );
};

export default ContactSectionForm;
