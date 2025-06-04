
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Shield } from "lucide-react";

interface ComplianceData {
  hipaa: boolean;
  gdpr: boolean;
}

interface OnboardingComplianceProps {
  complianceData: ComplianceData;
  updateComplianceData: (data: ComplianceData) => void;
}

const OnboardingCompliance = ({ complianceData, updateComplianceData }: OnboardingComplianceProps) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<ComplianceData>(complianceData);
  
  useEffect(() => {
    setFormData(complianceData);
  }, [complianceData]);

  const handleChange = (key: keyof ComplianceData) => {
    const newData = { ...formData, [key]: !formData[key] };
    setFormData(newData);
    updateComplianceData(newData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">
          {t('complianceTitle') || 'Compliance Settings'}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t('complianceDescription') || 'Configure regional compliance settings for patient data handling.'}
        </p>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                  <Shield className="h-5 w-5 text-blue-700 dark:text-blue-300" />
                </div>
                <div>
                  <h4 className="font-medium">{t('hipaaCompliance') || 'HIPAA Compliance'}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t('hipaaComplianceDescription') || 'Enable for clinics in the United States'}
                  </p>
                </div>
              </div>
              <Switch 
                id="hipaa"
                checked={formData.hipaa}
                onCheckedChange={() => handleChange('hipaa')}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                  <Shield className="h-5 w-5 text-green-700 dark:text-green-300" />
                </div>
                <div>
                  <h4 className="font-medium">{t('gdprCompliance') || 'GDPR Compliance'}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t('gdprComplianceDescription') || 'Enable for clinics in the European Union'}
                  </p>
                </div>
              </div>
              <Switch 
                id="gdpr"
                checked={formData.gdpr}
                onCheckedChange={() => handleChange('gdpr')}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-900 rounded-md p-4">
        <h4 className="text-amber-800 dark:text-amber-300 font-medium text-sm">
          {t('complianceNote') || 'Important Note'}
        </h4>
        <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
          {t('complianceNoteText') || 'Enabling these options will configure your clinic portal with the appropriate privacy notices, consent forms, and data handling practices to help you meet regulatory requirements. Additional configuration may be required after setup.'}
        </p>
      </div>
    </div>
  );
};

export default OnboardingCompliance;
