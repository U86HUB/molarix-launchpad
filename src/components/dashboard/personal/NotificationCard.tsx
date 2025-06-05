
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell } from 'lucide-react';
import { NotificationSettings } from './NotificationSettings';

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

interface NotificationCardProps {
  profile: Profile | null;
  onNotificationChange: (field: 'emailNotifications' | 'smsNotifications', value: boolean) => void;
}

export const NotificationCard = ({ profile, onNotificationChange }: NotificationCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <CardTitle>Notification Preferences</CardTitle>
        </div>
        <CardDescription>
          Choose how you want to receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <NotificationSettings 
          profile={profile}
          onNotificationChange={onNotificationChange}
        />
      </CardContent>
    </Card>
  );
};
