
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, X } from 'lucide-react';

interface AddNewClinicInlineProps {
  onClinicCreated: (clinicId: string) => void;
  onCancel: () => void;
}

export const AddNewClinicInline = ({ onClinicCreated, onCancel }: AddNewClinicInlineProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [clinicName, setClinicName] = useState('');
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
          created_by: user.id,
        })
        .select()
        .single();

      if (clinicError) throw clinicError;

      toast({
        title: "Clinic Created",
        description: "New clinic has been created successfully.",
      });

      onClinicCreated(clinicData.id);
      setClinicName('');

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
    <div className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-950/20">
      <div className="flex items-center justify-between mb-3">
        <Label className="text-sm font-medium">Add New Clinic</Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="h-6 w-6 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          value={clinicName}
          onChange={(e) => setClinicName(e.target.value)}
          placeholder="Enter clinic name"
          required
        />
        
        <div className="flex gap-2">
          <Button
            type="submit"
            size="sm"
            disabled={!clinicName.trim() || isCreating}
          >
            {isCreating ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                Creating...
              </>
            ) : (
              'Create Clinic'
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
