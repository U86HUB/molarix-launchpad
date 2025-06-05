
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';

const notificationSchema = z.object({
  emailNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(false),
});

type NotificationFormData = z.infer<typeof notificationSchema>;

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

interface NotificationSettingsProps {
  profile: Profile | null;
  onNotificationChange: (field: 'emailNotifications' | 'smsNotifications', value: boolean) => void;
}

export const NotificationSettings = ({ profile, onNotificationChange }: NotificationSettingsProps) => {
  const form = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emailNotifications: profile?.email_notifications ?? true,
      smsNotifications: profile?.sms_notifications ?? false,
    },
  });

  return (
    <Form {...form}>
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="emailNotifications"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Email Notifications
                </FormLabel>
                <FormDescription>
                  Receive notifications via email about your account activity
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={(value) => {
                    field.onChange(value);
                    onNotificationChange('emailNotifications', value);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="smsNotifications"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  SMS Notifications
                </FormLabel>
                <FormDescription>
                  Receive important notifications via SMS
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={(value) => {
                    field.onChange(value);
                    onNotificationChange('smsNotifications', value);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </Form>
  );
};
