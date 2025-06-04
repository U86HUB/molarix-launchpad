
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Upload, User } from 'lucide-react';

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  updated_at: string;
  created_at: string;
  email: string | null;
}

interface ProfileSectionProps {
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
  user: any;
}

export const ProfileSection = ({ profile, setProfile, user }: ProfileSectionProps) => {
  const { toast } = useToast();
  const [updating, setUpdating] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: profile?.first_name || '',
    lastName: profile?.last_name || '',
    email: user?.email || '',
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      // Update email if changed
      if (formData.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: formData.email,
        });

        if (emailError) throw emailError;

        toast({
          title: "Profile Updated",
          description: "Your profile has been updated. Please check your email to confirm the new email address.",
        });
      } else {
        toast({
          title: "Profile Updated",
          description: "Your profile information has been successfully updated.",
        });
      }

      // Reload profile
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) setProfile(data);

    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Fix the TypeScript error by properly typing the profile update
      if (profile) {
        setProfile({ ...profile, avatar_url: publicUrl });
      }

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

  const getInitials = () => {
    const firstName = formData.firstName || '';
    const lastName = formData.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <User className="h-5 w-5" />
          Profile Information
        </CardTitle>
        <CardDescription className="text-base">
          Update your personal information and profile picture
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar Section */}
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
            <p className="text-sm text-gray-500 mt-1">JPG, PNG or GIF (max 2MB)</p>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                placeholder="Enter your first name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                placeholder="Enter your last name"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter your email"
            />
          </div>
          <Button type="submit" disabled={updating}>
            {updating && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Update Info
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
