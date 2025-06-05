
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, MessageCircle } from "lucide-react";

interface PreferencesData {
  toneOfVoice: string;
  hipaa: boolean;
  gdpr: boolean;
}

interface OnboardingPreferencesStepProps {
  preferencesData: PreferencesData;
  updatePreferencesData: (data: PreferencesData) => void;
}

const OnboardingPreferencesStep = ({ 
  preferencesData, 
  updatePreferencesData 
}: OnboardingPreferencesStepProps) => {
  const [formData, setFormData] = useState<PreferencesData>(preferencesData);
  
  useEffect(() => {
    setFormData(preferencesData);
  }, [preferencesData]);

  const handleChange = (field: keyof PreferencesData, value: string | boolean) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    updatePreferencesData(newData);
  };

  const toneOptions = [
    { value: 'professional', label: 'Professional' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'casual', label: 'Casual' },
    { value: 'authoritative', label: 'Authoritative' },
    { value: 'empathetic', label: 'Empathetic' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Preferences</h3>
        <p className="text-sm text-muted-foreground">
          Set your communication style and compliance requirements.
        </p>
      </div>

      <div className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <MessageCircle className="h-5 w-5 text-blue-600" />
              <div>
                <h4 className="font-medium">Tone of Voice</h4>
                <p className="text-sm text-muted-foreground">
                  How should your website communicate with patients?
                </p>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tone-of-voice">Communication Style</Label>
              <Select 
                value={formData.toneOfVoice} 
                onValueChange={(value) => handleChange('toneOfVoice', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tone of voice" />
                </SelectTrigger>
                <SelectContent>
                  {toneOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-5 w-5 text-green-600" />
              <div>
                <h4 className="font-medium">Compliance Settings</h4>
                <p className="text-sm text-muted-foreground">
                  Configure regional compliance requirements
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium">HIPAA Compliance</h5>
                  <p className="text-sm text-muted-foreground">
                    Enable for clinics in the United States
                  </p>
                </div>
                <Switch 
                  checked={formData.hipaa}
                  onCheckedChange={(checked) => handleChange('hipaa', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium">GDPR Compliance</h5>
                  <p className="text-sm text-muted-foreground">
                    Enable for clinics in the European Union
                  </p>
                </div>
                <Switch 
                  checked={formData.gdpr}
                  onCheckedChange={(checked) => handleChange('gdpr', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-900 rounded-md p-4">
        <h4 className="text-amber-800 dark:text-amber-300 font-medium text-sm mb-1">
          Setup Complete
        </h4>
        <p className="text-sm text-amber-700 dark:text-amber-400">
          After completing this step, your clinic website will be created and you'll be redirected to the website builder to customize your content.
        </p>
      </div>
    </div>
  );
};

export default OnboardingPreferencesStep;
