
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { templates } from "@/data/templatesData";

interface WebsiteTemplateSelectionProps {
  selectedTemplate: string;
  onTemplateChange: (templateId: string) => void;
}

const WebsiteTemplateSelection = ({ 
  selectedTemplate, 
  onTemplateChange 
}: WebsiteTemplateSelectionProps) => {
  return (
    <div className="grid gap-2">
      <Label className="text-sm font-medium">
        Template Selection <span className="text-red-500">*</span>
      </Label>
      <RadioGroup 
        value={selectedTemplate} 
        onValueChange={onTemplateChange}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {templates.slice(0, 6).map((template) => (
          <Card 
            key={template.id} 
            className={`cursor-pointer transition-all hover:border-primary ${
              selectedTemplate === String(template.id) ? 'ring-2 ring-primary' : ''
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
  );
};

export default WebsiteTemplateSelection;
