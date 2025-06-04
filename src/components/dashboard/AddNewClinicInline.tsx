
import { useState } from 'react';
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
  const { toast } = useToast();
  const [clinicName, setClinicName] = useState('');
  const [clinicAddress, setClinicAddress] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('=== CLINIC CREATION WITH RLS DEBUG START ===');
    console.log('Form submitted with:', { 
      clinicName: clinicName.trim(), 
      clinicAddress: clinicAddress.trim(),
      timestamp: new Date().toISOString()
    });

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
      // Get the current user from Supabase auth
      console.log('🔄 Getting current user from Supabase auth...');
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      console.log('👤 User data response:', { 
        userData: userData?.user ? { 
          id: userData.user.id, 
          email: userData.user.email 
        } : null, 
        userError 
      });

      if (userError) {
        console.log('❌ Error getting user:', userError);
        throw new Error('Authentication error: ' + userError.message);
      }

      if (!userData?.user?.id) {
        console.log('❌ No user ID found');
        throw new Error('User not authenticated');
      }

      const userId = userData.user.id;
      console.log('✅ Valid user ID found:', userId);

      const insertPayload = {
        name: clinicName.trim(),
        address: clinicAddress.trim() || null,
        created_by: userId,
      };
      
      console.log('📝 Insert payload:', insertPayload);

      // Insert with RLS - the policy will automatically ensure created_by = auth.uid()
      const { data: clinicData, error: clinicError } = await supabase
        .from('clinics')
        .insert(insertPayload)
        .select()
        .single();

      console.log('📤 Supabase insert response with RLS:', { 
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
        throw new Error(clinicError.message);
      }

      if (!clinicData) {
        console.log('❌ No data returned from insert');
        throw new Error('No data returned from clinic creation');
      }

      console.log('✅ Clinic created successfully with RLS:', {
        id: clinicData.id,
        name: clinicData.name,
        created_by: clinicData.created_by,
        created_at: clinicData.created_at
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

      console.log('✅ Clinic creation flow completed successfully with RLS');

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
      console.log('=== CLINIC CREATION WITH RLS DEBUG END ===');
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
