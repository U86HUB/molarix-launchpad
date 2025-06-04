
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Plus } from 'lucide-react';
import { useUserClinics } from '@/hooks/useUserClinics';
import { AddNewClinicInline } from './AddNewClinicInline';

interface CreateWebsiteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateWebsiteModal = ({ isOpen, onClose }: CreateWebsiteModalProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { clinics, loading: clinicsLoading, refreshClinics } = useUserClinics();

  const [selectedClinicId, setSelectedClinicId] = useState<string>('');
  const [websiteName, setWebsiteName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [showAddNewClinic, setShowAddNewClinic] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !selectedClinicId || !websiteName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a clinic and enter a website name.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    try {
      // Create the onboarding session
      const { data: sessionData, error: sessionError } = await supabase
        .from('onboarding_sessions')
        .insert({
          clinic_id: selectedClinicId,
          clinic_name: websiteName.trim(),
          selected_template: 'template-a', // Default template
          completion_score: 0,
          created_by: user.id,
          last_updated: new Date().toISOString(),
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      toast({
        title: "Website Created",
        description: "Your new website has been created successfully.",
      });

      // Reset form
      setSelectedClinicId('');
      setWebsiteName('');
      onClose();

      // Navigate to onboarding with the new session ID
      navigate(`/onboarding?sessionId=${sessionData.id}`);

    } catch (error: any) {
      console.error('Error creating website:', error);
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create website. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleClinicCreated = (clinicId: string) => {
    setSelectedClinicId(clinicId);
    setShowAddNewClinic(false);
    refreshClinics();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedClinicId('');
      setWebsiteName('');
      setShowAddNewClinic(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Website</DialogTitle>
          <DialogDescription>
            Select a clinic and provide a name for your new website.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clinic-select">Clinic</Label>
            {clinicsLoading ? (
              <div className="flex items-center justify-center h-10 border rounded-md">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              <Select
                value={selectedClinicId}
                onValueChange={(value) => {
                  if (value === 'add-new') {
                    setShowAddNewClinic(true);
                  } else {
                    setSelectedClinicId(value);
                    setShowAddNewClinic(false);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a clinic" />
                </SelectTrigger>
                <SelectContent>
                  {clinics.map((clinic) => (
                    <SelectItem key={clinic.id} value={clinic.id}>
                      {clinic.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="add-new" className="text-blue-600 font-medium">
                    <div className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add New Clinic
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          {showAddNewClinic && (
            <AddNewClinicInline
              onClinicCreated={handleClinicCreated}
              onCancel={() => setShowAddNewClinic(false)}
            />
          )}

          <div className="space-y-2">
            <Label htmlFor="website-name">Website Name</Label>
            <Input
              id="website-name"
              value={websiteName}
              onChange={(e) => setWebsiteName(e.target.value)}
              placeholder="Enter website name"
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!selectedClinicId || !websiteName.trim() || isCreating}
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                'Create Website'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
