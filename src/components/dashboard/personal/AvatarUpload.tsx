
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  email: string | null;
  phone?: string | null;
  email_notifications?: boolean;
  sms_notifications?: boolean;
}

interface AvatarUploadProps {
  profile: Profile | null;
  firstName: string;
  lastName: string;
  onAvatarUpdate: (avatarUrl: string) => void;
}

export const AvatarUpload = ({ profile, firstName, lastName, onAvatarUpdate }: AvatarUploadProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const getInitials = () => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U';
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

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

    setUploadingAvatar(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id)
        .throwOnError();

      if (updateError) throw updateError;

      onAvatarUpdate(publicUrl);

      toast({
        title: "Avatar Updated",
        description: "Your profile picture has been successfully updated.",
      });

    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload avatar",
        variant: "destructive",
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-20 w-20">
        <AvatarImage src={profile?.avatar_url || ''} alt="Profile picture" />
        <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
      </Avatar>
      <div>
        <Label htmlFor="avatar-upload" className="cursor-pointer">
          <Button variant="outline" disabled={uploadingAvatar} asChild>
            <span>
              {uploadingAvatar ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              Change Avatar
            </span>
          </Button>
        </Label>
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarUpload}
          disabled={uploadingAvatar}
        />
        <p className="text-sm text-muted-foreground mt-1">JPG, PNG or GIF (max 2MB)</p>
      </div>
    </div>
  );
};
