
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Edit, Trash2, Save, X } from 'lucide-react';
import { ClinicLogoUpload } from '@/components/clinic/ClinicLogoUpload';
import { ClinicInfoForm } from '@/components/clinic/ClinicInfoForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

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

interface ClinicCardProps {
  clinic: Clinic;
  onUpdate: (clinic: Clinic) => void;
  onDelete: (clinicId: string) => void;
}

export const ClinicCard = ({ clinic, onUpdate, onDelete }: ClinicCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleLogoUpdate = (logoUrl: string) => {
    const updatedClinic = { ...clinic, logo_url: logoUrl };
    onUpdate(updatedClinic);
  };

  const handleInfoUpdate = async (data: any) => {
    if (!user || clinic.created_by !== user.id) {
      toast({
        title: "Unauthorized",
        description: "You can only edit clinics you created",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('clinics')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', clinic.id)
        .eq('created_by', user.id)
        .throwOnError();

      if (error) throw error;

      const updatedClinic = { ...clinic, ...data };
      onUpdate(updatedClinic);
      setIsEditing(false);

      toast({
        title: "Success",
        description: "Clinic information updated successfully",
      });

      return true;
    } catch (error: any) {
      console.error('Error updating clinic:', error);
      toast({
        title: "Error",
        description: "Failed to update clinic information",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleDelete = async () => {
    if (!user || clinic.created_by !== user.id) {
      toast({
        title: "Unauthorized",
        description: "You can only delete clinics you created",
        variant: "destructive",
      });
      return;
    }

    setDeleting(true);

    try {
      const { error } = await supabase
        .from('clinics')
        .delete()
        .eq('id', clinic.id)
        .eq('created_by', user.id)
        .throwOnError();

      if (error) throw error;

      onDelete(clinic.id);

      toast({
        title: "Success",
        description: "Clinic deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting clinic:', error);
      toast({
        title: "Error",
        description: "Failed to delete clinic",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const canEdit = user && clinic.created_by === user.id;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="h-6 w-6 text-primary" />
            <div>
              <CardTitle className="text-xl">{clinic.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  Created {new Date(clinic.created_at).toLocaleDateString()}
                </Badge>
              </div>
            </div>
          </div>
          
          {canEdit && (
            <div className="flex items-center gap-2">
              {isEditing ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={deleting}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Clinic</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{clinic.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete Clinic
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {canEdit && (
          <ClinicLogoUpload
            clinic={clinic}
            onLogoUpdate={handleLogoUpdate}
          />
        )}

        {!canEdit && clinic.logo_url && (
          <div className="flex items-center gap-4">
            <img
              src={clinic.logo_url}
              alt="Clinic logo"
              className="h-20 w-20 rounded-lg object-cover"
            />
          </div>
        )}

        {isEditing && canEdit ? (
          <ClinicInfoForm
            clinic={clinic}
            onSubmit={handleInfoUpdate}
          />
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Address</label>
                <p className="text-sm">{clinic.address || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                <p className="text-sm">{clinic.phone || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-sm">{clinic.email || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                <p className="text-sm">{new Date(clinic.updated_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
