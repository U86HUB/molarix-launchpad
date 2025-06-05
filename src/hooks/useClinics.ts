
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { clinicService, Clinic } from '@/services/clinicService';

export const useClinics = () => {
  const { user } = useAuth();
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClinics = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const fetchedClinics = await clinicService.fetchClinics(user.id);
      setClinics(fetchedClinics);
    } catch (error) {
      console.error('Error fetching clinics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchClinics();
    }
  }, [user]);

  return {
    clinics,
    loading,
    refreshClinics: fetchClinics,
  };
};
