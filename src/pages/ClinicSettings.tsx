
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useClinic } from '@/hooks/useClinic';
import { Loader2, Building2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClinicLogoUpload } from '@/components/clinic/ClinicLogoUpload';
import { ClinicInfoForm } from '@/components/clinic/ClinicInfoForm';

const ClinicSettings = () => {
  const { clinicId } = useParams<{ clinicId: string }>();
  const { user } = useAuth();
  const { clinic, setClinic, loading, updateClinic } = useClinic(clinicId);

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleLogoUpdate = (logoUrl: string) => {
    if (clinic) {
      setClinic({ ...clinic, logo_url: logoUrl });
    }
  };

  const handleFormSubmit = async (data: any) => {
    return await updateClinic({
      name: data.name,
      address: data.address || null,
      phone: data.phone || null,
      email: data.email || null,
    });
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
            <ClinicLogoUpload 
              clinic={clinic} 
              onLogoUpdate={handleLogoUpdate} 
            />
            <ClinicInfoForm 
              clinic={clinic} 
              onSubmit={handleFormSubmit} 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClinicSettings;
