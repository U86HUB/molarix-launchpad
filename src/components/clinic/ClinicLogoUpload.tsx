
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Clinic {
  id: string;
  name: string;
  logo_url: string | null;
}

interface ClinicLogoUploadProps {
  clinic: Clinic;
  onLogoUpdate: (logoUrl: string) => void;
}

export const ClinicLogoUpload = ({ clinic, onLogoUpdate }: ClinicLogoUploadProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !clinic || !user) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 2MB",
        variant: "destructive",
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    setUploadingLogo(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${clinic.id}/logo.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('clinic-logos')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('clinic-logos')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('clinics' as any)
        .update({ 
          logo_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', clinic.id);

      if (updateError) throw updateError;

      onLogoUpdate(publicUrl);

      toast({
        title: "Logo Updated",
        description: "Clinic logo has been successfully updated.",
      });

    } catch (error: any) {
      console.error('Error uploading logo:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload logo",
        variant: "destructive",
      });
    } finally {
      setUploadingLogo(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-20 w-20">
        <AvatarImage src={clinic.logo_url || ''} alt="Clinic logo" />
        <AvatarFallback className="text-lg">
          {clinic.name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div>
        <label htmlFor="logo-upload" className="cursor-pointer">
          <Button variant="outline" disabled={uploadingLogo} asChild>
            <span>
              {uploadingLogo ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              Change Logo
            </span>
          </Button>
        </label>
        <input
          id="logo-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleLogoUpload}
          disabled={uploadingLogo}
        />
        <p className="text-sm text-gray-500 mt-1">JPG, PNG or GIF (max 2MB)</p>
      </div>
    </div>
  );
};
