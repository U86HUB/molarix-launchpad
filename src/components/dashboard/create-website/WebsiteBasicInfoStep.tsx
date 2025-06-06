
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Clinic {
  id: string;
  name: string;
}

interface FormData {
  name: string;
  clinicId: string;
  template: string;
}

interface WebsiteBasicInfoStepProps {
  formData: FormData;
  clinics: Clinic[];
  isBusy: boolean;
  onFormDataUpdate: (updates: Partial<FormData>) => void;
  onNext: () => void;
  onCancel: () => void;
}

export const WebsiteBasicInfoStep = ({
  formData,
  clinics,
  isBusy,
  onFormDataUpdate,
  onNext,
  onCancel
}: WebsiteBasicInfoStepProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="create-website-name">Website Name *</Label>
        <Input
          id="create-website-name"
          placeholder="Enter website name"
          value={formData.name}
          onChange={(e) => onFormDataUpdate({ name: e.target.value })}
          disabled={isBusy}
          aria-describedby="create-website-name-description"
        />
        <p id="create-website-name-description" className="text-xs text-muted-foreground">
          Choose a descriptive name for your website
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="create-website-clinic">Select Clinic *</Label>
        <Select 
          value={formData.clinicId} 
          onValueChange={(value) => onFormDataUpdate({ clinicId: value })}
        >
          <SelectTrigger 
            disabled={isBusy} 
            id="create-website-clinic" 
            aria-describedby="create-website-clinic-description"
          >
            <SelectValue placeholder="Choose a clinic" />
          </SelectTrigger>
          <SelectContent>
            {clinics.map((clinic) => (
              <SelectItem key={clinic.id} value={clinic.id}>
                {clinic.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p id="create-website-clinic-description" className="text-xs text-muted-foreground">
          The clinic this website will represent
        </p>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel} disabled={isBusy}>
          Cancel
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!formData.name || !formData.clinicId || isBusy}
        >
          Next: Choose Template
        </Button>
      </div>
    </div>
  );
};
