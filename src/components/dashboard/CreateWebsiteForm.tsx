
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Plus } from 'lucide-react';
import { ClinicSelectionSection } from './ClinicSelectionSection';

interface CreateWebsiteFormProps {
  onClose: () => void;
}

export const CreateWebsiteForm = ({ onClose }: CreateWebsiteFormProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [selectedClinicId, setSelectedClinicId] = useState<string>('');
  const [websiteName, setWebsiteName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

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
      // Create the website record
      const { data: websiteData, error: websiteError } = await supabase
        .from('websites')
        .insert({
          clinic_id: selectedClinicId,
          name: websiteName.trim(),
          status: 'draft',
          template_type: 'template-a',
          created_by: user.id,
        })
        .select()
        .single();

      if (websiteError) throw websiteError;

      // Also create an onboarding session for backward compatibility
      const { data: sessionData, error: sessionError } = await supabase
        .from('onboarding_sessions')
        .insert({
          clinic_id: selectedClinicId,
          clinic_name: websiteName.trim(),
          selected_template: 'template-a',
          completion_score: 0,
          created_by: user.id,
          last_updated: new Date().toISOString(),
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      toast({
        title: "Website Created Successfully",
        description: `"${websiteName}" has been created and is ready for editing.`,
      });

      // Reset form state
      setSelectedClinicId('');
      setWebsiteName('');
      onClose();

      // Navigate to the website builder
      navigate(`/website-builder/${websiteData.id}`);

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
    toast({
      title: "Clinic Added",
      description: "New clinic has been added and selected.",
    });
  };

  return (
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
      <ClinicSelectionSection
        selectedClinicId={selectedClinicId}
        onClinicChange={setSelectedClinicId}
        onClinicCreated={handleClinicCreated}
      />

      <div className="flex flex-col sm:flex-row gap-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onClose}
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
      </div>
    </form>
  );
};
