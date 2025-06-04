
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Section } from '@/types/website';
import { sectionTemplates } from '@/data/sectionTemplates';
import { Trash2, GripVertical, Settings, Eye, EyeOff } from 'lucide-react';
import * as Icons from 'lucide-react';

interface SectionEditorProps {
  section: Section;
  onUpdate: (sectionId: string, updates: Partial<Section>) => void;
  onDelete: (sectionId: string) => void;
  isUpdating: boolean;
}

const SectionEditor = ({ section, onUpdate, onDelete, isUpdating }: SectionEditorProps) => {
  const [settings, setSettings] = useState(section.settings);
  const [isEditing, setIsEditing] = useState(false);

  const template = sectionTemplates.find(t => t.type === section.type);
  const IconComponent = template ? Icons[template.icon as keyof typeof Icons] as React.ComponentType<any> : null;

  const handleSettingsChange = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onUpdate(section.id, { settings: newSettings });
  };

  const handleVisibilityToggle = () => {
    onUpdate(section.id, { is_visible: !section.is_visible });
  };

  const renderSettingsForm = () => {
    if (!template) return null;

    return (
      <div className="space-y-4">
        {section.type === 'hero' && (
          <>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={settings.title || ''}
                onChange={(e) => handleSettingsChange('title', e.target.value)}
                placeholder="Enter hero title"
              />
            </div>
            <div>
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={settings.subtitle || ''}
                onChange={(e) => handleSettingsChange('subtitle', e.target.value)}
                placeholder="Enter hero subtitle"
              />
            </div>
            <div>
              <Label htmlFor="buttonText">Button Text</Label>
              <Input
                id="buttonText"
                value={settings.buttonText || ''}
                onChange={(e) => handleSettingsChange('buttonText', e.target.value)}
                placeholder="Enter button text"
              />
            </div>
            <div>
              <Label htmlFor="buttonLink">Button Link</Label>
              <Input
                id="buttonLink"
                value={settings.buttonLink || ''}
                onChange={(e) => handleSettingsChange('buttonLink', e.target.value)}
                placeholder="Enter button link"
              />
            </div>
          </>
        )}

        {section.type === 'about' && (
          <>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={settings.title || ''}
                onChange={(e) => handleSettingsChange('title', e.target.value)}
                placeholder="Enter section title"
              />
            </div>
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={settings.content || ''}
                onChange={(e) => handleSettingsChange('content', e.target.value)}
                placeholder="Enter content"
                rows={4}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="showImage"
                checked={settings.showImage || false}
                onCheckedChange={(checked) => handleSettingsChange('showImage', checked)}
              />
              <Label htmlFor="showImage">Show Image</Label>
            </div>
          </>
        )}

        {(section.type === 'services' || section.type === 'features') && (
          <>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={settings.title || ''}
                onChange={(e) => handleSettingsChange('title', e.target.value)}
                placeholder="Enter section title"
              />
            </div>
            <div>
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={settings.subtitle || ''}
                onChange={(e) => handleSettingsChange('subtitle', e.target.value)}
                placeholder="Enter subtitle"
              />
            </div>
          </>
        )}

        {section.type === 'contact' && (
          <>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={settings.title || ''}
                onChange={(e) => handleSettingsChange('title', e.target.value)}
                placeholder="Enter contact section title"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="showForm"
                checked={settings.showForm || false}
                onCheckedChange={(checked) => handleSettingsChange('showForm', checked)}
              />
              <Label htmlFor="showForm">Show Contact Form</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="showMap"
                checked={settings.showMap || false}
                onCheckedChange={(checked) => handleSettingsChange('showMap', checked)}
              />
              <Label htmlFor="showMap">Show Map</Label>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <Card className={`${!section.is_visible ? 'opacity-60' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GripVertical className="h-4 w-4 text-gray-400 cursor-grab" />
            {IconComponent && <IconComponent className="h-5 w-5 text-blue-600" />}
            <div>
              <CardTitle className="text-base">
                {template?.name || section.type}
              </CardTitle>
              <p className="text-sm text-gray-500">Position: {section.position + 1}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleVisibilityToggle}
              disabled={isUpdating}
            >
              {section.is_visible ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Settings className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(section.id)}
              disabled={isUpdating}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {isEditing && (
        <CardContent>
          {renderSettingsForm()}
        </CardContent>
      )}
    </Card>
  );
};

export default SectionEditor;
