
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Plus } from 'lucide-react';

interface DashboardEmptyClinicStateProps {
  onCreateClinic: () => void;
}

const DashboardEmptyClinicState = ({ onCreateClinic }: DashboardEmptyClinicStateProps) => {
  return (
    <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600">
      <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <div className="rounded-full bg-blue-50 dark:bg-blue-950/20 p-3 mb-4">
          <Building2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No clinics found
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
          Get started by creating your first clinic. You can then add websites and manage them all in one place.
        </p>
        <Button onClick={onCreateClinic} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Your First Clinic
        </Button>
      </CardContent>
    </Card>
  );
};

export default DashboardEmptyClinicState;
