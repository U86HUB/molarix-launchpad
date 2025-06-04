
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X, Building2 } from 'lucide-react';

interface ClinicFormHeaderProps {
  onCancel: () => void;
  isCreating: boolean;
}

export const ClinicFormHeader = ({ onCancel, isCreating }: ClinicFormHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4 text-blue-600" />
        <Label className="text-sm font-medium text-blue-900 dark:text-blue-100">
          Add New Clinic
        </Label>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onCancel}
        className="h-6 w-6 p-0 text-blue-600 hover:text-blue-800"
        disabled={isCreating}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};
