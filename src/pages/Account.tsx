
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { ProfileSection } from '@/components/account/ProfileSection';
import { PasswordSection } from '@/components/account/PasswordSection';
import { AccountInfoSection } from '@/components/account/AccountInfoSection';
import { SignOutSection } from '@/components/account/SignOutSection';
import { Loader2 } from 'lucide-react';

const Account = () => {
  const { user } = useAuth();
  const { profile, setProfile, loading } = useProfile();

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your account information and preferences</p>
        </div>

        <div className="space-y-6">
          <ProfileSection profile={profile} setProfile={setProfile} user={user} />
          <PasswordSection />
          <AccountInfoSection user={user} />
          <SignOutSection />
        </div>
      </div>
    </div>
  );
};

export default Account;
