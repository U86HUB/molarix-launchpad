
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Plus, Building2, AlertTriangle } from 'lucide-react';
import { useUserClinics } from '@/hooks/useUserClinics';
import { AddNewClinicInline } from './AddNewClinicInline';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useDebounce } from '@/hooks/useDebounce';

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
  
  // Debounce clinic changes to prevent excessive API calls
  const debouncedSelectedClinicId = useDebounce(selectedClinicId, 300);

  const handleClinicCreated = async (clinicId: string) => {
    console.log('=== CLINIC SELECTION DEBUG START ===');
    console.log('🎯 New clinic created with ID:', clinicId);
    console.log('📋 Current clinics before refresh:', clinics.map(c => ({ id: c.id, name: c.name })));
    
    // Hide the inline form
    setShowAddNewClinic(false);
    
    // Refresh the clinics list to get the latest data
    console.log('🔄 Refreshing clinics list...');
    await refreshClinics();
    
    // Give a small delay to ensure state updates
    setTimeout(() => {
      console.log('🔄 Selecting new clinic:', clinicId);
      onClinicChange(clinicId);
      
      // Call the parent callback
      console.log('🔄 Calling parent onClinicCreated callback');
      onClinicCreated(clinicId);
      
      console.log('✅ Clinic selection flow completed');
    }, 100);
    
    console.log('=== CLINIC SELECTION DEBUG END ===');
  };

  const selectedClinic = clinics.find(clinic => clinic.id === debouncedSelectedClinicId);

  console.log('🎯 ClinicSelectionSection render:', {
    selectedClinicId: debouncedSelectedClinicId,
    clinicsCount: clinics.length,
    clinicsLoading,
    selectedClinic: selectedClinic ? { id: selectedClinic.id, name: selectedClinic.name } : null,
    showAddNewClinic
  });

  return (
    <div className="space-y-2">
      <Label htmlFor="clinic-selection" className="text-sm font-medium">
        Assign to Clinic <span className="text-red-500">*</span>
      </Label>
      
      {/* Show warning about clinic assignment requirement */}
      <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
        <AlertTriangle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800 dark:text-blue-200 text-xs">
          All websites must be assigned to a clinic to stay organized in your dashboard.
        </AlertDescription>
      </Alert>

      {clinicsLoading ? (
        <div className="flex items-center justify-center h-10 border rounded-md bg-gray-50" aria-label="Loading clinics">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="ml-2 text-sm text-gray-500">Loading clinics...</span>
        </div>
      ) : (
        <div>
          <Select
            value={debouncedSelectedClinicId}
            onValueChange={(value) => {
              console.log('🔄 Select value changed to:', value);
              if (value === 'add-new') {
                console.log('🔄 Opening add new clinic form');
                setShowAddNewClinic(true);
              } else {
                console.log('🔄 Selecting existing clinic:', value);
                onClinicChange(value);
                setShowAddNewClinic(false);
              }
            }}
          >
            <SelectTrigger className="w-full" id="clinic-selection" aria-describedby="clinic-selection-description">
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
          <p id="clinic-selection-description" className="text-xs text-muted-foreground mt-1">
            Choose the clinic this website will be associated with
          </p>
        </div>
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
          onCancel={() => {
            console.log('🔄 Cancelling clinic creation');
            setShowAddNewClinic(false);
          }}
        />
      )}
    </div>
  );
};
