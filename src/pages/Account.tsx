
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { ProfileSection } from '@/components/account/ProfileSection';
import { PasswordSection } from '@/components/account/PasswordSection';
import { AccountInfoSection } from '@/components/account/AccountInfoSection';
import { SignOutSection } from '@/components/account/SignOutSection';
import UserProfile from '@/components/dashboard/UserProfile';
import { Loader2 } from 'lucide-react';

const Account = () => {
  const { user } = useAuth();
  const { profile, setProfile, loading } = useProfile();

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Get user's first name for personalized greeting
  const getFirstName = (email: string) => {
    const username = email.split('@')[0];
    const parts = username.split('.');
    return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 py-8 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header with improved hierarchy */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Account Settings</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 font-normal">
              Welcome back, {user?.email ? getFirstName(user.email) : 'there'}! Manage your account information and preferences.
            </p>
          </div>
          <div className="mt-6 sm:mt-0 p-4 bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-sm backdrop-blur-sm">
            <UserProfile userEmail={user?.email || ''} />
          </div>
        </div>

        {/* Settings Sections with enhanced styling */}
        <div className="space-y-6">
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 dark:border-gray-700/20">
            <ProfileSection profile={profile} setProfile={setProfile} user={user} />
          </div>
          
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 dark:border-gray-700/20">
            <PasswordSection />
          </div>
          
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 dark:border-gray-700/20">
            <AccountInfoSection user={user} />
          </div>
          
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 dark:border-gray-700/20">
            <SignOutSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
