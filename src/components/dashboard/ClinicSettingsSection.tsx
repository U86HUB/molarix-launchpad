
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building2, MapPin, Phone, Mail, Clock } from 'lucide-react';

export const ClinicSettingsSection = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Clinic Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your clinic information and operational settings
        </p>
      </div>

      <div className="grid gap-6">
        {/* Clinic Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              <CardTitle>Clinic Information</CardTitle>
            </div>
            <CardDescription>
              Basic information about your dental practice
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clinicName">Clinic Name</Label>
              <Input id="clinicName" placeholder="Coming soon..." disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clinicDescription">Description</Label>
              <Textarea 
                id="clinicDescription" 
                placeholder="Brief description of your practice..." 
                disabled 
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="clinicPhone">Phone Number</Label>
                <Input id="clinicPhone" placeholder="Coming soon..." disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clinicEmail">Email Address</Label>
                <Input id="clinicEmail" type="email" placeholder="Coming soon..." disabled />
              </div>
            </div>
            <Button disabled>Save Clinic Info</Button>
          </CardContent>
        </Card>

        {/* Location & Address */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <CardTitle>Location & Address</CardTitle>
            </div>
            <CardDescription>
              Your clinic's physical location and address details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address1">Street Address</Label>
              <Input id="address1" placeholder="Coming soon..." disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address2">Address Line 2 (Optional)</Label>
              <Input id="address2" placeholder="Coming soon..." disabled />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="Coming soon..." disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State/Province</Label>
                <Input id="state" placeholder="Coming soon..." disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                <Input id="zipCode" placeholder="Coming soon..." disabled />
              </div>
            </div>
            <Button disabled>Update Address</Button>
          </CardContent>
        </Card>

        {/* Operating Hours */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <CardTitle>Operating Hours</CardTitle>
            </div>
            <CardDescription>
              Set your clinic's business hours for each day of the week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Operating hours management coming soon...</p>
                <p className="text-sm">Configure business hours for each day</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
