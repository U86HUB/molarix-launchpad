
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Plus, Building2 } from 'lucide-react';
import { useUserClinics } from '@/hooks/useUserClinics';
import { AddNewClinicInline } from './AddNewClinicInline';

interface ClinicSelectionSectionProps {
  selectedClinicId: string;
  onClinicChange: (clinicId: string) => void;
  onClinicCreated: (clinicId: string) => void;
}

export const ClinicSelectionSection = ({
  selectedClinicId,
  onClinicChange,
  onClinicCreated
}: ClinicSelectionSectionProps) => {
  const { clinics, loading: clinicsLoading, refreshClinics } = useUserClinics();
  const [showAddNewClinic, setShowAddNewClinic] = useState(false);

  const handleClinicCreated = (clinicId: string) => {
    onClinicCreated(clinicId);
    setShowAddNewClinic(false);
    refreshClinics();
  };

  const selectedClinic = clinics.find(clinic => clinic.id === selectedClinicId);

  return (
    <div className="space-y-2">
      <Label htmlFor="clinic-select" className="text-sm font-medium">
        Assign to Clinic <span className="text-red-500">*</span>
      </Label>
      {clinicsLoading ? (
        <div className="flex items-center justify-center h-10 border rounded-md bg-gray-50">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="ml-2 text-sm text-gray-500">Loading clinics...</span>
        </div>
      ) : (
        <Select
          value={selectedClinicId}
          onValueChange={(value) => {
            if (value === 'add-new') {
              setShowAddNewClinic(true);
            } else {
              onClinicChange(value);
              setShowAddNewClinic(false);
            }
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a clinic" />
          </SelectTrigger>
          <SelectContent>
            {clinics.length === 0 ? (
              <SelectItem value="add-new" className="text-blue-600 font-medium">
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create Your First Clinic
                </div>
              </SelectItem>
            ) : (
              <>
                {clinics.map((clinic) => (
                  <SelectItem key={clinic.id} value={clinic.id}>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      {clinic.name}
                    </div>
                  </SelectItem>
                ))}
                <SelectItem value="add-new" className="text-blue-600 font-medium">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add New Clinic
                  </div>
                </SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      )}
      {selectedClinic && (
        <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-md border">
          <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
            Selected Clinic: {selectedClinic.name}
          </p>
          {selectedClinic.address && (
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
              {selectedClinic.address}
            </p>
          )}
        </div>
      )}

      {/* Add New Clinic Inline Form */}
      {showAddNewClinic && (
        <AddNewClinicInline
          onClinicCreated={handleClinicCreated}
          onCancel={() => setShowAddNewClinic(false)}
        />
      )}
    </div>
  );
};
