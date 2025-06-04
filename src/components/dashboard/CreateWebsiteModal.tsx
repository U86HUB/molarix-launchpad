
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
import { Loader2, Plus, Building2 } from 'lucide-react';
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
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create a website.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedClinicId) {
      toast({
        title: "Clinic Required",
        description: "Please select a clinic for your website.",
        variant: "destructive",
      });
      return;
    }

    if (!websiteName.trim()) {
      toast({
        title: "Website Name Required",
        description: "Please enter a name for your website.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    try {
      // Create the onboarding session linked to the selected clinic
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
        title: "Website Created Successfully",
        description: `"${websiteName}" has been created and linked to your clinic.`,
      });

      // Reset form state
      setSelectedClinicId('');
      setWebsiteName('');
      setShowAddNewClinic(false);
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
    toast({
      title: "Clinic Added",
      description: "New clinic has been added and selected.",
    });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset form when closing
      setSelectedClinicId('');
      setWebsiteName('');
      setShowAddNewClinic(false);
      onClose();
    }
  };

  const selectedClinic = clinics.find(clinic => clinic.id === selectedClinicId);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Create New Website
          </DialogTitle>
          <DialogDescription>
            Create a new website for one of your clinics. You can start with a template and customize it later.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Website Name Input */}
          <div className="space-y-2">
            <Label htmlFor="website-name" className="text-sm font-medium">
              Website Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="website-name"
              value={websiteName}
              onChange={(e) => setWebsiteName(e.target.value)}
              placeholder="e.g., Downtown Dental Practice"
              required
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              This will be used as the display name for your website project.
            </p>
          </div>

          {/* Clinic Selection */}
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
                    setSelectedClinicId(value);
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
          </div>

          {/* Add New Clinic Inline Form */}
          {showAddNewClinic && (
            <AddNewClinicInline
              onClinicCreated={handleClinicCreated}
              onCancel={() => setShowAddNewClinic(false)}
            />
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => handleOpenChange(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!selectedClinicId || !websiteName.trim() || isCreating}
              className="w-full sm:w-auto"
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating Website...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Website
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
