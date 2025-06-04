
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { templates } from "@/data/templatesData";

interface OnboardingTemplateSelectionProps {
  selectedTemplateId: string | null;
  updateSelectedTemplate: (templateId: string) => void;
}

const OnboardingTemplateSelection = ({ 
  selectedTemplateId, 
  updateSelectedTemplate 
}: OnboardingTemplateSelectionProps) => {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<string | null>(selectedTemplateId);
  
  useEffect(() => {
    setSelected(selectedTemplateId);
  }, [selectedTemplateId]);

  const handleTemplateSelect = (templateId: string) => {
    setSelected(templateId);
    updateSelectedTemplate(templateId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">
          {t('templateSelectionTitle') || 'Choose a Template'}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t('templateSelectionDescription') || 'Select a design template for your clinic portal.'}
        </p>
      </div>

      <RadioGroup value={selected || ""} className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.slice(0, 6).map((template) => (
            <Card 
              key={template.id} 
              className={`cursor-pointer transition-all hover:border-primary ${selected === template.id ? 'ring-2 ring-primary' : ''}`}
              onClick={() => handleTemplateSelect(template.id)}
            >
              <CardContent className="p-4 flex flex-col items-center">
                <div className="relative mb-3 w-full h-32 overflow-hidden rounded-md">
                  <img 
                    src={template.image} 
                    alt={template.name} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute top-2 right-2">
                    <div className="flex items-center justify-center">
                      <RadioGroupItem 
                        value={template.id} 
                        id={`template-${template.id}`} 
                        className="data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full text-center">
                  <Label htmlFor={`template-${template.id}`} className="font-medium">
                    {template.name}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">{template.category}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};

export default OnboardingTemplateSelection;
