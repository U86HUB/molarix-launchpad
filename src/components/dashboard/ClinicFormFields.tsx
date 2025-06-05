
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ClinicFormFieldsProps {
  clinicName: string;
  setClinicName: (name: string) => void;
  clinicAddress: string;
  setClinicAddress: (address: string) => void;
  clinicPhone?: string;
  setClinicPhone?: (phone: string) => void;
  clinicEmail?: string;
  setClinicEmail?: (email: string) => void;
  isCreating: boolean;
}

export const ClinicFormFields = ({
  clinicName,
  setClinicName,
  clinicAddress,
  setClinicAddress,
  clinicPhone,
  setClinicPhone,
  clinicEmail,
  setClinicEmail,
  isCreating
}: ClinicFormFieldsProps) => {
  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="clinic-form-name" className="text-sm font-medium text-blue-900 dark:text-blue-100">
          Clinic Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="clinic-form-name"
          name="clinicName"
          type="text"
          placeholder="Enter clinic name"
          value={clinicName}
          onChange={(e) => setClinicName(e.target.value)}
          disabled={isCreating}
          autoComplete="organization"
          required
          aria-describedby="clinic-form-name-description"
          className="mt-1"
        />
        <p id="clinic-form-name-description" className="text-xs text-blue-700 dark:text-blue-300 mt-1">
          The official name of your dental practice
        </p>
      </div>

      <div>
        <Label htmlFor="clinic-form-address" className="text-sm font-medium text-blue-900 dark:text-blue-100">
          Address
        </Label>
        <Input
          id="clinic-form-address"
          name="clinicAddress"
          type="text"
          placeholder="Enter clinic address (optional)"
          value={clinicAddress}
          onChange={(e) => setClinicAddress(e.target.value)}
          disabled={isCreating}
          autoComplete="street-address"
          aria-describedby="clinic-form-address-description"
          className="mt-1"
        />
        <p id="clinic-form-address-description" className="text-xs text-blue-700 dark:text-blue-300 mt-1">
          Your clinic's physical location
        </p>
      </div>

      {setClinicPhone && (
        <div>
          <Label htmlFor="clinic-form-phone" className="text-sm font-medium text-blue-900 dark:text-blue-100">
            Phone
          </Label>
          <Input
            id="clinic-form-phone"
            name="clinicPhone"
            type="tel"
            placeholder="Enter phone number (optional)"
            value={clinicPhone || ''}
            onChange={(e) => setClinicPhone?.(e.target.value)}
            disabled={isCreating}
            autoComplete="tel"
            aria-describedby="clinic-form-phone-description"
            className="mt-1"
          />
          <p id="clinic-form-phone-description" className="text-xs text-blue-700 dark:text-blue-300 mt-1">
            Main contact number
          </p>
        </div>
      )}

      {setClinicEmail && (
        <div>
          <Label htmlFor="clinic-form-email" className="text-sm font-medium text-blue-900 dark:text-blue-100">
            Email
          </Label>
          <Input
            id="clinic-form-email"
            name="clinicEmail"
            type="email"
            placeholder="Enter email address (optional)"
            value={clinicEmail || ''}
            onChange={(e) => setClinicEmail?.(e.target.value)}
            disabled={isCreating}
            autoComplete="email"
            aria-describedby="clinic-form-email-description"
            className="mt-1"
          />
          <p id="clinic-form-email-description" className="text-xs text-blue-700 dark:text-blue-300 mt-1">
            Contact email for inquiries
          </p>
        </div>
      )}
    </div>
  );
};
