
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';

const createClinicSchema = z.object({
  name: z.string().min(1, 'Clinic name is required'),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
});

type CreateClinicFormData = z.infer<typeof createClinicSchema>;

interface Clinic {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  logo_url: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface CreateClinicModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClinicCreate: (clinic: Clinic) => void;
}

export const CreateClinicModal = ({ open, onOpenChange, onClinicCreate }: CreateClinicModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [creating, setCreating] = useState(false);

  const form = useForm<CreateClinicFormData>({
    resolver: zodResolver(createClinicSchema),
    defaultValues: {
      name: '',
      address: '',
      phone: '',
      email: '',
    },
  });

  const handleSubmit = async (data: CreateClinicFormData) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create a clinic",
        variant: "destructive",
      });
      return;
    }

    setCreating(true);

    try {
      const { data: newClinic, error } = await supabase
        .from('clinics')
        .insert({
          name: data.name,
          address: data.address || null,
          phone: data.phone || null,
          email: data.email || null,
          created_by: user.id,
        })
        .select()
        .single()
        .throwOnError();

      if (error) throw error;

      onClinicCreate(newClinic);
      form.reset();

      toast({
        title: "Success",
        description: "Clinic created successfully",
      });
    } catch (error: any) {
      console.error('Error creating clinic:', error);
      toast({
        title: "Error",
        description: "Failed to create clinic",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Clinic</DialogTitle>
          <DialogDescription>
            Add a new clinic to your account. You can edit these details later.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Clinic Name *</FormLabel>
                  <FormControl>
                    <Input
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
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter clinic address"
                      autoComplete="street-address"
                      rows={3}
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
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="Enter phone number"
                        autoComplete="tel"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter email address"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={creating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={creating}>
                {creating && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Create Clinic
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
