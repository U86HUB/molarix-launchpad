
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ClinicFormFieldsProps {
  clinicName: string;
  setClinicName: (value: string) => void;
  clinicAddress: string;
  setClinicAddress: (value: string) => void;
  isCreating: boolean;
}

export const ClinicFormFields = ({
  clinicName,
  setClinicName,
  clinicAddress,
  setClinicAddress,
  isCreating
}: ClinicFormFieldsProps) => {
  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="clinic-name" className="text-xs font-medium text-gray-700 dark:text-gray-300">
          Clinic Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="clinic-name"
          value={clinicName}
          onChange={(e) => setClinicName(e.target.value)}
          placeholder="Enter clinic name"
          required
          disabled={isCreating}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="clinic-address" className="text-xs font-medium text-gray-700 dark:text-gray-300">
          Address (Optional)
        </Label>
        <Input
          id="clinic-address"
          value={clinicAddress}
          onChange={(e) => setClinicAddress(e.target.value)}
          placeholder="Enter clinic address"
          disabled={isCreating}
          className="mt-1"
        />
      </div>
    </div>
  );
};
