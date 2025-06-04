
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";

interface ClinicData {
  name: string;
  address: string;
  phone: string;
  email: string;
}

interface OnboardingClinicInfoProps {
  clinicData: ClinicData;
  updateClinicData: (data: ClinicData) => void;
}

const OnboardingClinicInfo = ({ clinicData, updateClinicData }: OnboardingClinicInfoProps) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<ClinicData>(clinicData);
  
  useEffect(() => {
    setFormData(clinicData);
  }, [clinicData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    setFormData(newData);
    updateClinicData(newData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">
          {t('clinicInfoTitle') || 'Clinic Information'}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t('clinicInfoDescription') || 'Please provide your clinic details for patients to contact you.'}
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="name" className="text-sm font-medium">
            {t('clinicName') || 'Clinic Name'} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={t('clinicNamePlaceholder') || 'Enter clinic name'}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="address" className="text-sm font-medium">
            {t('clinicAddress') || 'Address'}
          </Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder={t('clinicAddressPlaceholder') || 'Enter clinic address'}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="phone" className="text-sm font-medium">
              {t('clinicPhone') || 'Phone Number'}
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder={t('clinicPhonePlaceholder') || 'Enter phone number'}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-sm font-medium">
              {t('clinicEmail') || 'Email Address'} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t('clinicEmailPlaceholder') || 'Enter email address'}
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingClinicInfo;
