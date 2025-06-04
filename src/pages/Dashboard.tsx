
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardSessions } from '@/hooks/useDashboardSessions';
import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader';
import DashboardContent from '@/components/dashboard/DashboardContent';
import BreadcrumbNav from '@/components/ui/breadcrumb-nav';
import { DashboardSkeleton } from '@/components/ui/loading-states';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { sessions, loading, refreshSessions, deleteSession, duplicateSession } = useDashboardSessions();

  const handleContinueEditing = (sessionId: string) => {
    navigate(`/ai-copy-preview?sessionId=${sessionId}&mode=edit`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 py-8 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 py-8 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <BreadcrumbNav items={[{ label: 'Dashboard' }]} showHome={false} />
        
        {/* Enhanced Header with improved hierarchy */}
        <DashboardPageHeader userEmail={user?.email || ''} />
        
        {/* Dashboard Content */}
        <DashboardContent
          sessions={sessions}
          refreshSessions={refreshSessions}
          deleteSession={deleteSession}
          duplicateSession={duplicateSession}
          onContinueEditing={handleContinueEditing}
        />
      </div>
    </div>
  );
};

export default Dashboard;
