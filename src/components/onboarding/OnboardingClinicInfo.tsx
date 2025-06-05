
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
          <Label htmlFor="onboarding-clinic-name" className="text-sm font-medium">
            {t('clinicName') || 'Clinic Name'} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="onboarding-clinic-name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={t('clinicNamePlaceholder') || 'Enter clinic name'}
            autoComplete="organization"
            required
            aria-describedby="onboarding-clinic-name-description"
          />
          <p id="onboarding-clinic-name-description" className="text-xs text-muted-foreground">
            This is the name that will appear on your website and marketing materials
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="onboarding-clinic-address" className="text-sm font-medium">
            {t('clinicAddress') || 'Address'}
          </Label>
          <Input
            id="onboarding-clinic-address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder={t('clinicAddressPlaceholder') || 'Enter clinic address'}
            autoComplete="street-address"
            aria-describedby="onboarding-clinic-address-description"
          />
          <p id="onboarding-clinic-address-description" className="text-xs text-muted-foreground">
            Your clinic's physical address for patients to visit
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="onboarding-clinic-phone" className="text-sm font-medium">
              {t('clinicPhone') || 'Phone Number'}
            </Label>
            <Input
              id="onboarding-clinic-phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder={t('clinicPhonePlaceholder') || 'Enter phone number'}
              autoComplete="tel"
              aria-describedby="onboarding-clinic-phone-description"
            />
            <p id="onboarding-clinic-phone-description" className="text-xs text-muted-foreground">
              Main contact number for appointments
            </p>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="onboarding-clinic-email" className="text-sm font-medium">
              {t('clinicEmail') || 'Email Address'} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="onboarding-clinic-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t('clinicEmailPlaceholder') || 'Enter email address'}
              autoComplete="email"
              required
              aria-describedby="onboarding-clinic-email-description"
            />
            <p id="onboarding-clinic-email-description" className="text-xs text-muted-foreground">
              Contact email for patient inquiries
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingClinicInfo;
