
import { Button } from '@/components/ui/button';
import { Loader2, Building2 } from 'lucide-react';

interface ClinicFormActionsProps {
  clinicName: string;
  isCreating: boolean;
  onCancel: () => void;
}

export const ClinicFormActions = ({
  clinicName,
  isCreating,
  onCancel
}: ClinicFormActionsProps) => {
  return (
    <div className="flex gap-2 pt-2">
      <Button
        type="submit"
        size="sm"
        disabled={!clinicName.trim() || isCreating}
        className="flex-1"
      >
        {isCreating ? (
          <>
            <Loader2 className="h-3 w-3 animate-spin mr-1" />
            Creating...
          </>
        ) : (
          <>
            <Building2 className="h-3 w-3 mr-1" />
            Create Clinic
          </>
        )}
      </Button>
      <Button 
        type="button" 
        variant="outline" 
        size="sm" 
        onClick={onCancel}
        disabled={isCreating}
      >
        Cancel
      </Button>
    </div>
  );
};
