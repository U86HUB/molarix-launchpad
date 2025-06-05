
import { useLocation } from 'react-router-dom';
import { UnifiedDashboardLayout } from '@/components/dashboard/UnifiedDashboardLayout';
import { PersonalSettingsSection } from '@/components/dashboard/PersonalSettingsSection';
import { ClinicSettingsSection } from '@/components/dashboard/ClinicSettingsSection';
import { WebsiteManagementSection } from '@/components/dashboard/WebsiteManagementSection';
import { DashboardOverviewSection } from '@/components/dashboard/DashboardOverviewSection';

const UnifiedDashboard = () => {
  const location = useLocation();
  
  const getCurrentSection = () => {
    const path = location.pathname;
    if (path === '/dashboard/personal') return 'Personal Settings';
    if (path === '/dashboard/clinic') return 'Clinic Settings';
    if (path === '/dashboard/websites') return 'Website Management';
    return 'Overview';
  };

  const renderContent = () => {
    const path = location.pathname;
    
    switch (path) {
      case '/dashboard/personal':
        return <PersonalSettingsSection />;
      case '/dashboard/clinic':
        return <ClinicSettingsSection />;
      case '/dashboard/websites':
        return <WebsiteManagementSection />;
      default:
        return <DashboardOverviewSection />;
    }
  };

  return (
    <UnifiedDashboardLayout currentSection={getCurrentSection()}>
      {renderContent()}
    </UnifiedDashboardLayout>
  );
};

export default UnifiedDashboard;
