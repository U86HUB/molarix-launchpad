
import { useState, useEffect } from "react";
import WebsiteFormFields from "./WebsiteFormFields";
import WebsiteLogoUpload from "./WebsiteLogoUpload";
import WebsiteTemplateSelection from "./WebsiteTemplateSelection";

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
  
  useEffect(() => {
    setFormData(websiteData);
  }, [websiteData]);

  const handleChange = (field: keyof WebsiteData, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    updateWebsiteData(newData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Website Setup</h3>
        <p className="text-sm text-muted-foreground">
          Configure your website name, template, and basic branding.
        </p>
      </div>

      <div className="space-y-4">
        <WebsiteFormFields
          name={formData.name}
          primaryColor={formData.primaryColor}
          fontStyle={formData.fontStyle}
          onNameChange={(value) => handleChange('name', value)}
          onPrimaryColorChange={(value) => handleChange('primaryColor', value)}
          onFontStyleChange={(value) => handleChange('fontStyle', value)}
        />

        <WebsiteTemplateSelection
          selectedTemplate={formData.selectedTemplate}
          onTemplateChange={(value) => handleChange('selectedTemplate', value)}
        />

        <WebsiteLogoUpload
          logo={formData.logo}
          onLogoChange={(value) => handleChange('logo', value)}
        />
      </div>
    </div>
  );
};

export default OnboardingWebsiteStep;
