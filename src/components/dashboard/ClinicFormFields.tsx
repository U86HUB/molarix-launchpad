
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
        <Label htmlFor="dashboard-clinic-name" className="text-xs font-medium text-gray-700 dark:text-gray-300">
          Clinic Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="dashboard-clinic-name"
          name="dashboard-clinic-name"
          value={clinicName}
          onChange={(e) => setClinicName(e.target.value)}
          placeholder="Enter clinic name"
          required
          disabled={isCreating}
          autoComplete="organization"
          className="mt-1"
          aria-describedby="dashboard-clinic-name-description"
        />
        <p id="dashboard-clinic-name-description" className="text-xs text-muted-foreground mt-1">
          The name of your dental practice or clinic
        </p>
      </div>

      <div>
        <Label htmlFor="dashboard-clinic-address" className="text-xs font-medium text-gray-700 dark:text-gray-300">
          Address (Optional)
        </Label>
        <Input
          id="dashboard-clinic-address"
          name="dashboard-clinic-address"
          value={clinicAddress}
          onChange={(e) => setClinicAddress(e.target.value)}
          placeholder="Enter clinic address"
          disabled={isCreating}
          autoComplete="street-address"
          className="mt-1"
          aria-describedby="dashboard-clinic-address-description"
        />
        <p id="dashboard-clinic-address-description" className="text-xs text-muted-foreground mt-1">
          Your clinic's physical location
        </p>
      </div>
    </div>
  );
};
