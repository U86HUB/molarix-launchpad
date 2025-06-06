
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import { templates, Template } from "./templateData";

interface Clinic {
  id: string;
  name: string;
}

interface FormData {
  name: string;
  clinicId: string;
  template: string;
}

interface WebsiteTemplateStepProps {
  formData: FormData;
  clinics: Clinic[];
  isBusy: boolean;
  isCreating: boolean;
  onTemplateSelect: (templateId: string) => void;
  onBack: () => void;
  onCreate: () => void;
  onCancel: () => void;
}

export const WebsiteTemplateStep = ({
  formData,
  clinics,
  isBusy,
  isCreating,
  onTemplateSelect,
  onBack,
  onCreate,
  onCancel
}: WebsiteTemplateStepProps) => {
  const selectedClinic = clinics.find(c => c.id === formData.clinicId);

  return (
    <div className="space-y-4">
      <div className="bg-muted p-3 rounded-lg text-sm">
        <strong>Website:</strong> {formData.name} <br />
        <strong>Clinic:</strong> {selectedClinic?.name}
      </div>

      <div className="space-y-3">
        <Label>Choose a Template *</Label>
        <div className="grid gap-4" role="radiogroup" aria-label="Website template selection">
          {templates.map((template: Template) => (
            <Card 
              key={template.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                formData.template === template.id 
                  ? 'ring-2 ring-primary bg-primary/5' 
                  : ''
              } ${isBusy ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => !isBusy && onTemplateSelect(template.id)}
              role="radio"
              aria-checked={formData.template === template.id}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (!isBusy) onTemplateSelect(template.id);
                }
              }}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <img 
                    src={template.image} 
                    alt={`${template.name} template preview`}
                    className="w-20 h-16 rounded object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{template.name}</h3>
                      {formData.template === template.id && (
                        <Check className="h-4 w-4 text-primary" aria-label="Selected" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {template.description}
                    </p>
                    <div className="flex gap-2">
                      {template.features.map((feature, idx) => (
                        <span 
                          key={idx}
                          className="text-xs bg-secondary px-2 py-1 rounded"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex justify-between gap-2 pt-4">
        <Button variant="outline" onClick={onBack} disabled={isBusy}>
          Back
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel} disabled={isBusy}>
            Cancel
          </Button>
          <Button 
            onClick={onCreate} 
            disabled={!formData.template || isBusy}
          >
            {isCreating && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {isCreating ? 'Creating...' : 'Create Website'}
          </Button>
        </div>
      </div>
    </div>
  );
};
