
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";

interface BrandData {
  logo: File | null;
  primaryColor: string;
  fontStyle: string;
}

interface OnboardingBrandSettingsProps {
  brandData: BrandData;
  updateBrandData: (data: BrandData) => void;
}

const OnboardingBrandSettings = ({ brandData, updateBrandData }: OnboardingBrandSettingsProps) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<BrandData>(brandData);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  useEffect(() => {
    setFormData(brandData);
  }, [brandData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newData = { ...formData, logo: file };
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      setFormData(newData);
      updateBrandData(newData);
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newData = { ...formData, primaryColor: e.target.value };
    setFormData(newData);
    updateBrandData(newData);
  };

  const handleFontChange = (value: string) => {
    const newData = { ...formData, fontStyle: value };
    setFormData(newData);
    updateBrandData(newData);
  };

  const fontOptions = [
    { value: "default", label: t('fontDefault') || "Default (Sans-serif)" },
    { value: "serif", label: t('fontSerif') || "Serif" },
    { value: "modern", label: t('fontModern') || "Modern" },
    { value: "playful", label: t('fontPlayful') || "Playful" },
    { value: "elegant", label: t('fontElegant') || "Elegant" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">
          {t('brandSettingsTitle') || 'Brand Settings'}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t('brandSettingsDescription') || 'Customize how your clinic appears to patients.'}
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid gap-2">
          <Label htmlFor="logo" className="text-sm font-medium">
            {t('clinicLogo') || 'Clinic Logo'}
          </Label>
          <div className="flex items-center gap-4">
            <div className="border border-gray-200 dark:border-gray-700 rounded-md w-24 h-24 flex items-center justify-center overflow-hidden bg-white dark:bg-gray-800">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo preview" className="max-w-full max-h-full object-contain" />
              ) : (
                <div className="text-gray-400 text-xs text-center p-2">
                  {t('logoPreview') || 'Logo Preview'}
                </div>
              )}
            </div>
            <Input
              id="logo"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-auto flex-1"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {t('logoRequirements') || 'Recommended size: 512x512 pixels. Maximum size: 2MB.'}
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="primaryColor" className="text-sm font-medium">
            {t('primaryColor') || 'Primary Color'}
          </Label>
          <div className="flex items-center gap-4">
            <Input
              id="primaryColor"
              type="color"
              value={formData.primaryColor}
              onChange={handleColorChange}
              className="w-16 h-10 p-1"
            />
            <Input 
              type="text"
              value={formData.primaryColor}
              onChange={handleColorChange}
              className="flex-1"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {t('colorDescription') || 'This color will be used throughout your clinic portal.'}
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="fontStyle" className="text-sm font-medium">
            {t('fontStyle') || 'Font Style'}
          </Label>
          <Select 
            value={formData.fontStyle} 
            onValueChange={handleFontChange}
          >
            <SelectTrigger id="fontStyle" className="w-full">
              <SelectValue placeholder={t('selectFont') || 'Select a font style'} />
            </SelectTrigger>
            <SelectContent>
              {fontOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {t('fontDescription') || 'Choose a font that reflects your clinic\'s identity.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingBrandSettings;
