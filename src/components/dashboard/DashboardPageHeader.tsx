
import UserProfile from './UserProfile';

interface DashboardPageHeaderProps {
  userEmail: string;
}

const DashboardPageHeader = ({ userEmail }: DashboardPageHeaderProps) => {
  // Get user's first name for personalized greeting
  const getFirstName = (email: string) => {
    const username = email.split('@')[0];
    const parts = username.split('.');
    return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
      <div className="flex-1">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 font-normal">
          Welcome back, {getFirstName(userEmail)}! Here's a snapshot of your clinic projects.
        </p>
      </div>
      <div className="mt-6 sm:mt-0 p-4 bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-sm backdrop-blur-sm">
        <UserProfile userEmail={userEmail} />
      </div>
    </div>
  );
};

export default DashboardPageHeader;
