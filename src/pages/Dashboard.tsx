
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardSessions } from '@/hooks/useDashboardSessions';
import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { sessions, loading, refreshSessions, deleteSession, duplicateSession } = useDashboardSessions();

  const handleContinueEditing = (sessionId: string) => {
    navigate(`/ai-copy-preview?sessionId=${sessionId}&mode=edit`);
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
