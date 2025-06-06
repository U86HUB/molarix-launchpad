
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
        <Label htmlFor="clinic-name" className="text-sm font-medium text-blue-900 dark:text-blue-100">
          Clinic Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="clinic-name"
          name="clinicName"
          type="text"
          placeholder="Enter clinic name"
          value={clinicName}
          onChange={(e) => setClinicName(e.target.value)}
          disabled={isCreating}
          autoComplete="organization"
          required
          aria-describedby="clinic-name-description"
          className="mt-1"
        />
        <p id="clinic-name-description" className="text-xs text-blue-700 dark:text-blue-300 mt-1">
          The official name of your dental practice
        </p>
      </div>

      <div>
        <Label htmlFor="clinic-address" className="text-sm font-medium text-blue-900 dark:text-blue-100">
          Address
        </Label>
        <Input
          id="clinic-address"
          name="clinicAddress"
          type="text"
          placeholder="Enter clinic address (optional)"
          value={clinicAddress}
          onChange={(e) => setClinicAddress(e.target.value)}
          disabled={isCreating}
          autoComplete="street-address"
          aria-describedby="clinic-address-description"
          className="mt-1"
        />
        <p id="clinic-address-description" className="text-xs text-blue-700 dark:text-blue-300 mt-1">
          Your clinic's physical location
        </p>
      </div>

      {setClinicPhone && (
        <div>
          <Label htmlFor="clinic-phone" className="text-sm font-medium text-blue-900 dark:text-blue-100">
            Phone
          </Label>
          <Input
            id="clinic-phone"
            name="clinicPhone"
            type="tel"
            placeholder="Enter phone number (optional)"
            value={clinicPhone || ''}
            onChange={(e) => setClinicPhone?.(e.target.value)}
            disabled={isCreating}
            autoComplete="tel"
            aria-describedby="clinic-phone-description"
            className="mt-1"
          />
          <p id="clinic-phone-description" className="text-xs text-blue-700 dark:text-blue-300 mt-1">
            Main contact number
          </p>
        </div>
      )}

      {setClinicEmail && (
        <div>
          <Label htmlFor="clinic-email" className="text-sm font-medium text-blue-900 dark:text-blue-100">
            Email
          </Label>
          <Input
            id="clinic-email"
            name="clinicEmail"
            type="email"
            placeholder="Enter email address (optional)"
            value={clinicEmail || ''}
            onChange={(e) => setClinicEmail?.(e.target.value)}
            disabled={isCreating}
            autoComplete="email"
            aria-describedby="clinic-email-description"
            className="mt-1"
          />
          <p id="clinic-email-description" className="text-xs text-blue-700 dark:text-blue-300 mt-1">
            Contact email for inquiries
          </p>
        </div>
      )}
    </div>
  );
};
