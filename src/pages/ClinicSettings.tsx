import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Building2, Loader2 } from 'lucide-react';
import BreadcrumbNav from '@/components/ui/breadcrumb-nav';

interface Clinic {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  logo_url?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

const ClinicSettings = () => {
  const { clinicId } = useParams<{ clinicId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
  });

  console.log('ClinicSettings - clinicId from params:', clinicId);

  useEffect(() => {
    if (!clinicId) {
      console.error('ClinicSettings - No clinicId provided');
      navigate('/dashboard');
      return;
    }

    const fetchClinic = async () => {
      try {
        console.log('ClinicSettings - Fetching clinic with ID:', clinicId);
        
        const { data, error } = await supabase
          .from('clinics')
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
          navigate('/dashboard');
          return;
        }

        console.log('ClinicSettings - Clinic data loaded:', data);
        setClinic(data);
        setFormData({
          name: data.name || '',
          address: data.address || '',
          phone: data.phone || '',
          email: data.email || '',
        });
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "Failed to load clinic",
          variant: "destructive",
        });
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchClinic();
  }, [clinicId, navigate, toast]);

  const handleSave = async () => {
    if (!clinicId || !clinic) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('clinics')
        .update({
          name: formData.name,
          address: formData.address,
          phone: formData.phone,
          email: formData.email,
          updated_at: new Date().toISOString(),
        })
        .eq('id', clinicId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Clinic settings updated successfully",
      });

      // Update local state
      setClinic(prev => prev ? { ...prev, ...formData } : null);
    } catch (error: any) {
      console.error('Error updating clinic:', error);
      toast({
        title: "Error",
        description: "Failed to update clinic settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 py-8 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (!clinic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 py-8 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Clinic Not Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The clinic you're looking for doesn't exist or you don't have permission to access it.
            </p>
            <Button onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 py-8 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <BreadcrumbNav 
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: clinic.name }
          ]} 
        />

        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Clinic Settings
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage settings for {clinic.name}
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Clinic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="clinic-settings-name">Clinic Name *</Label>
                  <Input
                    id="clinic-settings-name"
                    name="clinic-settings-name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter clinic name"
                    autoComplete="organization"
                    required
                    aria-describedby="clinic-settings-name-description"
                  />
                  <p id="clinic-settings-name-description" className="text-xs text-muted-foreground mt-1">
                    Official name of your dental practice
                  </p>
                </div>

                <div>
                  <Label htmlFor="clinic-settings-email">Email Address</Label>
                  <Input
                    id="clinic-settings-email"
                    name="clinic-settings-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="clinic@example.com"
                    autoComplete="email"
                    aria-describedby="clinic-settings-email-description"
                  />
                  <p id="clinic-settings-email-description" className="text-xs text-muted-foreground mt-1">
                    Contact email for patient inquiries
                  </p>
                </div>

                <div>
                  <Label htmlFor="clinic-settings-phone">Phone Number</Label>
                  <Input
                    id="clinic-settings-phone"
                    name="clinic-settings-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1 (555) 123-4567"
                    autoComplete="tel"
                    aria-describedby="clinic-settings-phone-description"
                  />
                  <p id="clinic-settings-phone-description" className="text-xs text-muted-foreground mt-1">
                    Main contact number for appointments
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="clinic-settings-address">Address</Label>
                <Textarea
                  id="clinic-settings-address"
                  name="clinic-settings-address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter clinic address"
                  autoComplete="street-address"
                  rows={3}
                  aria-describedby="clinic-settings-address-description"
                />
                <p id="clinic-settings-address-description" className="text-xs text-muted-foreground mt-1">
                  Full address where patients can visit your clinic
                </p>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={saving || !formData.name.trim()}
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClinicSettings;
