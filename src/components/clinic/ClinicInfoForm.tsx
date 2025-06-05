
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const clinicFormSchema = z.object({
  name: z.string().min(1, 'Clinic name is required'),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
});

type ClinicFormData = z.infer<typeof clinicFormSchema>;

interface Clinic {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
}

interface ClinicInfoFormProps {
  clinic: Clinic;
  onSubmit: (data: ClinicFormData) => Promise<boolean>;
}

export const ClinicInfoForm = ({ clinic, onSubmit }: ClinicInfoFormProps) => {
  const [saving, setSaving] = useState(false);

  const form = useForm<ClinicFormData>({
    resolver: zodResolver(clinicFormSchema),
    defaultValues: {
      name: clinic.name || '',
      address: clinic.address || '',
      phone: clinic.phone || '',
      email: clinic.email || '',
    },
  });

  const handleSubmit = async (data: ClinicFormData) => {
    setSaving(true);
    const success = await onSubmit(data);
    setSaving(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="clinic-info-name">Clinic Name</FormLabel>
              <FormControl>
                <Input 
                  id="clinic-info-name"
                  placeholder="Enter clinic name" 
                  autoComplete="organization"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                The official name of your dental practice
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="clinic-info-address">Address</FormLabel>
              <FormControl>
                <Input 
                  id="clinic-info-address"
                  placeholder="Enter clinic address" 
                  autoComplete="street-address"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Your clinic's physical location
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="clinic-info-phone">Phone</FormLabel>
                <FormControl>
                  <Input 
                    id="clinic-info-phone"
                    type="tel"
                    placeholder="Enter phone number" 
                    autoComplete="tel"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Main contact number
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="clinic-info-email">Email</FormLabel>
                <FormControl>
                  <Input 
                    id="clinic-info-email"
                    type="email" 
                    placeholder="Enter email address" 
                    autoComplete="email"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Contact email for inquiries
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          Save Changes
        </Button>
      </form>
    </Form>
  );
};
