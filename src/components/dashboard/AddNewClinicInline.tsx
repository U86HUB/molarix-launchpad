
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
    
    console.log('=== CLINIC CREATION DEBUG START ===');
    console.log('Form submitted with:', { 
      clinicName: clinicName.trim(), 
      clinicAddress: clinicAddress.trim(),
      timestamp: new Date().toISOString()
    });
    console.log('Current user:', user);

    if (!user) {
      console.log('❌ No user found');
      toast({
        title: "Authentication Required",
        description: "Please log in to create a clinic.",
        variant: "destructive",
      });
      return;
    }

    if (!clinicName.trim()) {
      console.log('❌ Empty clinic name');
      toast({
        title: "Missing Information",
        description: "Please enter a clinic name.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    try {
      console.log('🔄 Starting Supabase insert...');
      
      const insertPayload = {
        name: clinicName.trim(),
        address: clinicAddress.trim() || null,
        created_by: user.id,
      };
      
      console.log('📝 Insert payload:', insertPayload);
      console.log('🔐 User context:', { 
        userId: user.id, 
        userEmail: user.email,
        aud: user.aud 
      });

      const { data: clinicData, error: clinicError } = await supabase
        .from('clinics')
        .insert(insertPayload)
        .select()
        .single();

      console.log('📤 Supabase insert response:', { 
        data: clinicData, 
        error: clinicError,
        timestamp: new Date().toISOString()
      });

      if (clinicError) {
        console.log('❌ Supabase error details:', {
          message: clinicError.message,
          details: clinicError.details,
          hint: clinicError.hint,
          code: clinicError.code
        });
        throw clinicError;
      }

      if (!clinicData) {
        console.log('❌ No data returned from insert');
        throw new Error('No data returned from clinic creation');
      }

      console.log('✅ Clinic created successfully:', {
        id: clinicData.id,
        name: clinicData.name,
        created_by: clinicData.created_by,
        created_at: clinicData.created_at
      });

      // Verify the clinic was actually created by trying to fetch it
      console.log('🔍 Verifying clinic creation by fetching...');
      const { data: verifyData, error: verifyError } = await supabase
        .from('clinics')
        .select('*')
        .eq('id', clinicData.id)
        .single();

      console.log('🔍 Verification query result:', { 
        data: verifyData, 
        error: verifyError 
      });

      // Show success toast
      toast({
        title: "Clinic Created Successfully",
        description: `"${clinicData.name}" has been created and selected.`,
      });

      // Call the callback with the new clinic ID
      console.log('🔄 Calling onClinicCreated with ID:', clinicData.id);
      onClinicCreated(clinicData.id);

      // Reset form
      setClinicName('');
      setClinicAddress('');

      console.log('✅ Clinic creation flow completed successfully');

    } catch (error: any) {
      console.log('❌ Error in clinic creation:', {
        error: error,
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code
      });
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create clinic. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
      console.log('=== CLINIC CREATION DEBUG END ===');
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
          disabled={isCreating}
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
      </form>
    </div>
  );
};
