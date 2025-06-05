
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import { AvatarUpload } from './AvatarUpload';
import { ProfileForm } from './ProfileForm';

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

interface ProfileInfoCardProps {
  profile: Profile | null;
  onSubmit: (data: ProfileFormData) => Promise<void>;
  onAvatarUpdate: (avatarUrl: string) => void;
  isSubmitting: boolean;
  firstName: string;
  lastName: string;
}

export const ProfileInfoCard = ({ 
  profile, 
  onSubmit, 
  onAvatarUpdate, 
  isSubmitting, 
  firstName, 
  lastName 
}: ProfileInfoCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <User className="h-5 w-5" />
          <CardTitle>Profile Information</CardTitle>
        </div>
        <CardDescription>
          Update your personal information and profile details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <AvatarUpload 
          profile={profile}
          firstName={firstName}
          lastName={lastName}
          onAvatarUpdate={onAvatarUpdate}
        />
        
        <ProfileForm 
          profile={profile}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      </CardContent>
    </Card>
  );
};
