
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserClinics } from '@/hooks/useUserClinics';
import { Building2 } from 'lucide-react';

interface ClinicFilterProps {
  selectedClinicId?: string;
  onClinicChange: (clinicId?: string) => void;
}

const ClinicFilter = ({ selectedClinicId, onClinicChange }: ClinicFilterProps) => {
  const { clinics, loading } = useUserClinics();

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Clinic:</span>
        <div className="w-[160px] h-9 bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Building2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Clinic:</span>
      <Select 
        value={selectedClinicId || 'all'} 
        onValueChange={(value) => onClinicChange(value === 'all' ? undefined : value)}
      >
        <SelectTrigger className="w-[160px] h-9 border-gray-300 dark:border-gray-600">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Clinics</SelectItem>
          {clinics.map((clinic) => (
            <SelectItem key={clinic.id} value={clinic.id}>
              {clinic.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ClinicFilter;
