
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, X, Building2 } from 'lucide-react';

interface AddNewClinicInlineProps {
  onClinicCreated: (clinicId: string) => void;
  onCancel: () => void;
}

export const AddNewClinicInline = ({ onClinicCreated, onCancel }: AddNewClinicInlineProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [clinicName, setClinicName] = useState('');
  const [clinicAddress, setClinicAddress] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !clinicName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a clinic name.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    try {
      const { data: clinicData, error: clinicError } = await supabase
        .from('clinics')
        .insert({
          name: clinicName.trim(),
          address: clinicAddress.trim() || null,
          created_by: user.id,
        })
        .select()
        .single();

      if (clinicError) throw clinicError;

      onClinicCreated(clinicData.id);
      setClinicName('');
      setClinicAddress('');

    } catch (error: any) {
      console.error('Error creating clinic:', error);
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create clinic. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
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
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3">
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
            className="mt-1"
          />
        </div>
        
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
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};
