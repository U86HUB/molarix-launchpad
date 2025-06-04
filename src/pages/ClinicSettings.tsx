
import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Building2, Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
  logo_url: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

const ClinicSettings = () => {
  const { clinicId } = useParams<{ clinicId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const form = useForm<ClinicFormData>({
    resolver: zodResolver(clinicFormSchema),
    defaultValues: {
      name: '',
      address: '',
      phone: '',
      email: '',
    },
  });

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Load clinic data
  useEffect(() => {
    const loadClinic = async () => {
      if (!clinicId || !user) return;

      try {
        // Using type assertion since TypeScript types haven't been updated yet
        const { data, error } = await supabase
          .from('clinics' as any)
          .select('*')
          .eq('id', clinicId)
          .single();

        if (error) {
          console.error('Error loading clinic:', error);
          toast({
            title: "Error",
            description: "Failed to load clinic data",
            variant: "destructive",
          });
          return;
        }

        if (data) {
          setClinic(data as Clinic);
          form.reset({
            name: data.name || '',
            address: data.address || '',
            phone: data.phone || '',
            email: data.email || '',
          });
        }
      } catch (error) {
        console.error('Error loading clinic:', error);
        toast({
          title: "Error",
          description: "Failed to load clinic data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadClinic();
  }, [clinicId, user, form, toast]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !clinic) return;

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

    setUploadingLogo(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${clinic.id}/logo.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('clinic-logos')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('clinic-logos')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('clinics' as any)
        .update({ 
          logo_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', clinic.id);

      if (updateError) throw updateError;

      setClinic({ ...clinic, logo_url: publicUrl });

      toast({
        title: "Logo Updated",
        description: "Clinic logo has been successfully updated.",
      });

    } catch (error: any) {
      console.error('Error uploading logo:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload logo",
        variant: "destructive",
      });
    } finally {
      setUploadingLogo(false);
    }
  };

  const onSubmit = async (data: ClinicFormData) => {
    if (!clinic) return;

    setSaving(true);

    try {
      const { error } = await supabase
        .from('clinics' as any)
        .update({
          name: data.name,
          address: data.address || null,
          phone: data.phone || null,
          email: data.email || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', clinic.id);

      if (error) throw error;

      setClinic({
        ...clinic,
        name: data.name,
        address: data.address || null,
        phone: data.phone || null,
        email: data.email || null,
      });

      toast({
        title: "Saved successfully",
        description: "Clinic information has been updated.",
      });

    } catch (error: any) {
      console.error('Error updating clinic:', error);
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save clinic information",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!clinic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Clinic Not Found</h2>
              <p className="text-gray-600">The clinic you're looking for doesn't exist or you don't have access to it.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 py-8 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Clinic Settings</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Manage your clinic information and branding
          </p>
        </div>

        <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Clinic Information
            </CardTitle>
            <CardDescription>
              Update your clinic details and logo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Logo Section */}
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={clinic.logo_url || ''} alt="Clinic logo" />
                <AvatarFallback className="text-lg">
                  {clinic.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <label htmlFor="logo-upload" className="cursor-pointer">
                  <Button variant="outline" disabled={uploadingLogo} asChild>
                    <span>
                      {uploadingLogo ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Upload className="h-4 w-4 mr-2" />
                      )}
                      Change Logo
                    </span>
                  </Button>
                </label>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                  disabled={uploadingLogo}
                />
                <p className="text-sm text-gray-500 mt-1">JPG, PNG or GIF (max 2MB)</p>
              </div>
            </div>

            {/* Clinic Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Clinic Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter clinic name" {...field} />
                      </FormControl>
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
                        <Input placeholder="Enter clinic address" {...field} />
                      </FormControl>
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
                          <Input placeholder="Enter phone number" {...field} />
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
                          <Input type="email" placeholder="Enter email address" {...field} />
                        </FormControl>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClinicSettings;
