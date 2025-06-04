
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Mail, Calendar, Info } from 'lucide-react';
import dayjs from 'dayjs';

interface AccountInfoSectionProps {
  user: any;
}

export const AccountInfoSection = ({ user }: AccountInfoSectionProps) => {
  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Info className="h-5 w-5" />
          Account Information
        </CardTitle>
        <CardDescription className="text-base">
          View your account details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-500">Email Address</Label>
            <div className="flex items-center gap-2 mt-1">
              <Mail className="h-4 w-4 text-gray-400" />
              <span>{user.email}</span>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-500">Member Since</Label>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>{dayjs(user.created_at).format('MMMM D, YYYY')}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
