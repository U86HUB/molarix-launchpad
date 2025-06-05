
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Building2 } from "lucide-react";

interface ClinicData {
  name: string;
  address: string;
  phone: string;
  email: string;
  skipClinic: boolean;
  selectedClinicId?: string;
}

interface OnboardingClinicStepProps {
  clinicData: ClinicData;
  existingClinics: Array<{ id: string; name: string }>;
  updateClinicData: (data: ClinicData) => void;
}

const OnboardingClinicStep = ({ 
  clinicData, 
  existingClinics, 
  updateClinicData 
}: OnboardingClinicStepProps) => {
  const [formData, setFormData] = useState<ClinicData>(clinicData);
  
  useEffect(() => {
    setFormData(clinicData);
  }, [clinicData]);

  const handleChange = (field: keyof ClinicData, value: string | boolean) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    updateClinicData(newData);
  };

  const handleSkipToggle = (skip: boolean) => {
    const newData = { 
      ...formData, 
      skipClinic: skip,
      selectedClinicId: skip && existingClinics.length > 0 ? existingClinics[0].id : undefined
    };
    setFormData(newData);
    updateClinicData(newData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Clinic Information</h3>
        <p className="text-sm text-muted-foreground">
          Set up your clinic details or select an existing one.
        </p>
      </div>

      {existingClinics.length > 0 && (
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-blue-600" />
                <div>
                  <h4 className="font-medium">Use Existing Clinic</h4>
                  <p className="text-sm text-muted-foreground">
                    You have {existingClinics.length} existing clinic{existingClinics.length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <Switch 
                checked={formData.skipClinic}
                onCheckedChange={handleSkipToggle}
              />
            </div>
            
            {formData.skipClinic && (
              <div className="grid gap-2">
                <Label htmlFor="existing-clinic">Select Clinic</Label>
                <Select 
                  value={formData.selectedClinicId || ""} 
                  onValueChange={(value) => handleChange('selectedClinicId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a clinic" />
                  </SelectTrigger>
                  <SelectContent>
                    {existingClinics.map((clinic) => (
                      <SelectItem key={clinic.id} value={clinic.id}>
                        {clinic.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!formData.skipClinic && (
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="clinic-name" className="text-sm font-medium">
              Clinic Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="clinic-name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter your clinic name"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="clinic-address" className="text-sm font-medium">
              Address
            </Label>
            <Input
              id="clinic-address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Enter your clinic address"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="clinic-phone" className="text-sm font-medium">
                Phone Number
              </Label>
              <Input
                id="clinic-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="clinic-email" className="text-sm font-medium">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="clinic-email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="Enter email address"
                required
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingClinicStep;
