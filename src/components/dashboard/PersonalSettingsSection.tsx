
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ProfileInfoCard } from './personal/ProfileInfoCard';
import { NotificationCard } from './personal/NotificationCard';

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

interface ProfileFormData {
  firstName: string;
  lastName: string;
  phone?: string;
}

export const PersonalSettingsSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        // Get user data from auth
        const { data: authUser, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;

        // Get profile data from profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }

        let currentProfile: Profile;

        if (profileData) {
          currentProfile = {
            ...profileData,
            email: authUser.user?.email || null,
          };
        } else {
          // Create profile if it doesn't exist
          const newProfile = {
            id: user.id,
            first_name: '',
            last_name: '',
            avatar_url: null,
            email: authUser.user?.email || null,
            phone: null,
            email_notifications: true,
            sms_notifications: false,
          };

          const { error: createError } = await supabase
            .from('profiles')
            .insert([newProfile]);

          if (createError) throw createError;

          currentProfile = newProfile;
        }

        setProfile(currentProfile);

      } catch (error: any) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, toast]);

  const handleProfileSubmit = async (data: ProfileFormData) => {
    if (!user || !profile) return;

    try {
      setIsSubmitting(true);
      const updateData = {
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone || null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)
        .throwOnError();

      if (error) throw error;

      // Update local state
      setProfile(prev => prev ? { ...prev, ...updateData } : null);

      toast({
        title: "Profile Updated",
        description: "Your profile information has been successfully updated.",
      });

    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarUpdate = (avatarUrl: string) => {
    setProfile(prev => prev ? { ...prev, avatar_url: avatarUrl } : null);
  };

  const handleNotificationChange = async (field: 'emailNotifications' | 'smsNotifications', value: boolean) => {
    if (!user || !profile) return;

    try {
      const updateField = field === 'emailNotifications' ? 'email_notifications' : 'sms_notifications';
      const updateData = {
        [updateField]: value,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)
        .throwOnError();

      if (error) throw error;

      // Update local state
      setProfile(prev => prev ? { ...prev, [updateField]: value } : null);

      toast({
        title: "Settings Updated",
        description: "Your notification preferences have been updated.",
      });

    } catch (error: any) {
      console.error('Error updating notification settings:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update notification settings",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Personal Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account information and preferences
        </p>
      </div>

      <div className="grid gap-6">
        <ProfileInfoCard
          profile={profile}
          onSubmit={handleProfileSubmit}
          onAvatarUpdate={handleAvatarUpdate}
          isSubmitting={isSubmitting}
          firstName={profile?.first_name || ''}
          lastName={profile?.last_name || ''}
        />

        <NotificationCard
          profile={profile}
          onNotificationChange={handleNotificationChange}
        />
      </div>
    </div>
  );
};
