
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Plus, Loader2 } from 'lucide-react';
import { ClinicCard } from './clinic/ClinicCard';
import { CreateClinicModal } from './clinic/CreateClinicModal';

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

export const ClinicSettingsSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchClinics = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setClinics(data || []);
    } catch (error: any) {
      console.error('Error fetching clinics:', error);
      toast({
        title: "Error",
        description: "Failed to load clinics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClinics();
  }, [user]);

  const handleClinicUpdate = (updatedClinic: Clinic) => {
    setClinics(clinics.map(clinic => 
      clinic.id === updatedClinic.id ? updatedClinic : clinic
    ));
  };

  const handleClinicDelete = (deletedClinicId: string) => {
    setClinics(clinics.filter(clinic => clinic.id !== deletedClinicId));
  };

  const handleClinicCreate = (newClinic: Clinic) => {
    setClinics([newClinic, ...clinics]);
    setShowCreateModal(false);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clinic Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your clinic information and settings
          </p>
        </div>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Clinic Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your clinic information and settings
        </p>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Clinics</h2>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Clinic
        </Button>
      </div>

      {clinics.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No clinics found</h3>
            <p className="text-muted-foreground text-center mb-4">
              Get started by creating your first clinic
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Clinic
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {clinics.map((clinic) => (
            <ClinicCard
              key={clinic.id}
              clinic={clinic}
              onUpdate={handleClinicUpdate}
              onDelete={handleClinicDelete}
            />
          ))}
        </div>
      )}

      <CreateClinicModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onClinicCreate={handleClinicCreate}
      />
    </div>
  );
};
