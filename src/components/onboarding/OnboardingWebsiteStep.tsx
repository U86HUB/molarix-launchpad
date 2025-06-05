
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { templates } from "@/data/templatesData";

interface WebsiteData {
  name: string;
  selectedTemplate: string;
  logo: File | null;
  primaryColor: string;
  fontStyle: string;
}

interface OnboardingWebsiteStepProps {
  websiteData: WebsiteData;
  updateWebsiteData: (data: WebsiteData) => void;
}

const OnboardingWebsiteStep = ({ 
  websiteData, 
  updateWebsiteData 
}: OnboardingWebsiteStepProps) => {
  const [formData, setFormData] = useState<WebsiteData>(websiteData);
  const [isDragOver, setIsDragOver] = useState(false);
  
  useEffect(() => {
    setFormData(websiteData);
  }, [websiteData]);

  const handleChange = (field: keyof WebsiteData, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    updateWebsiteData(newData);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleChange('logo', file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        handleChange('logo', file);
      }
    }
  };

  const removeLogo = () => {
    handleChange('logo', null);
  };

  const fontOptions = [
    { value: 'default', label: 'Default (Inter)' },
    { value: 'serif', label: 'Serif (Times New Roman)' },
    { value: 'mono', label: 'Monospace (Courier)' },
    { value: 'sans', label: 'Sans-serif (Arial)' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Website Setup</h3>
        <p className="text-sm text-muted-foreground">
          Configure your website name, template, and basic branding.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="website-name" className="text-sm font-medium">
            Website Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="website-name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter your website name"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label className="text-sm font-medium">
            Template Selection <span className="text-red-500">*</span>
          </Label>
          <RadioGroup 
            value={formData.selectedTemplate} 
            onValueChange={(value) => handleChange('selectedTemplate', value)}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {templates.slice(0, 6).map((template) => (
              <Card 
                key={template.id} 
                className={`cursor-pointer transition-all hover:border-primary ${
                  formData.selectedTemplate === String(template.id) ? 'ring-2 ring-primary' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="relative mb-3 w-full h-24 overflow-hidden rounded-md">
                    <img 
                      src={template.image} 
                      alt={template.name} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute top-2 right-2">
                      <RadioGroupItem 
                        value={String(template.id)} 
                        id={`template-${template.id}`} 
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <Label htmlFor={`template-${template.id}`} className="font-medium text-sm">
                      {template.name}
                    </Label>
                  </div>
                </CardContent>
              </Card>
            ))}
          </RadioGroup>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="primary-color" className="text-sm font-medium">
              Primary Color
            </Label>
            <div className="flex items-center gap-2">
              <input
                id="primary-color"
                type="color"
                value={formData.primaryColor}
                onChange={(e) => handleChange('primaryColor', e.target.value)}
                className="w-12 h-10 rounded border border-gray-300"
              />
              <Input
                value={formData.primaryColor}
                onChange={(e) => handleChange('primaryColor', e.target.value)}
                placeholder="#4f46e5"
                className="flex-1"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="font-style" className="text-sm font-medium">
              Font Style
            </Label>
            <select
              id="font-style"
              value={formData.fontStyle}
              onChange={(e) => handleChange('fontStyle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {fontOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-2">
          <Label className="text-sm font-medium">Logo Upload (Optional)</Label>
          {formData.logo ? (
            <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <p className="text-sm font-medium">{formData.logo.name}</p>
                <p className="text-xs text-gray-500">
                  {(formData.logo.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={removeLogo}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div 
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isDragOver 
                  ? 'border-blue-400 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <div className="space-y-2">
                <label 
                  htmlFor="logo-upload" 
                  className="inline-block cursor-pointer text-sm text-blue-600 hover:text-blue-700 font-medium underline"
                >
                  Click to upload
                </label>
                <p className="text-sm text-gray-600">or drag and drop</p>
                <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingWebsiteStep;
