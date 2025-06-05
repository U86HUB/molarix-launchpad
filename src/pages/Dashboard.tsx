
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardSessions } from '@/hooks/useDashboardSessions';
import { useQueryParamClinicInsert } from '@/hooks/useQueryParamClinicInsert';
import { useDashboardState } from '@/hooks/useDashboardState';
import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader';
import DashboardContent from '@/components/dashboard/DashboardContent';
import BreadcrumbNav from '@/components/ui/breadcrumb-nav';
import { DashboardSkeleton } from '@/components/ui/loading-states';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Bug, BugOff } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { sessions, loading, refreshSessions, deleteSession, duplicateSession } = useDashboardSessions();
  const [debugMode, setDebugMode] = useState(() => localStorage.getItem('debugMode') === 'true');
  const { selectedClinicId, setSelectedClinicId } = useDashboardState();
  
  // Handle automatic clinic creation from URL parameters
  const { isProcessing: isCreatingClinicFromParams, newClinicId, hasInsertedFromParams } = useQueryParamClinicInsert();

  // Debounce expensive operations
  const debouncedSelectedClinicId = useDebounce(selectedClinicId, 300);

  // Debug logging for re-renders
  useEffect(() => {
    if (debugMode) {
      console.log("🏗️ Dashboard rerendered, state:", {
        selectedClinicId,
        hasInsertedFromParams,
        newClinicId,
        sessionsCount: sessions.length,
        isCreatingFromParams: isCreatingClinicFromParams,
        userId: user?.id
      });
    }
  });

  useEffect(() => {
    localStorage.setItem('debugMode', debugMode.toString());
    if (debugMode) {
      console.log('🐛 Debug mode enabled');
      console.log('👤 Current user:', user?.id);
      console.log('📊 Current sessions:', sessions);
      console.log('🏥 Processing clinic from params:', isCreatingClinicFromParams);
      console.log('🏥 New clinic ID from params:', newClinicId);
      console.log('🏥 Has inserted from params:', hasInsertedFromParams);
    }
  }, [debugMode, user, sessions, isCreatingClinicFromParams, newClinicId, hasInsertedFromParams]);

  // Set selectedClinicId when a new clinic is created from parameters
  useEffect(() => {
    if (newClinicId && hasInsertedFromParams && !selectedClinicId) {
      console.log('🔄 Setting selected clinic ID from new clinic:', newClinicId);
      setSelectedClinicId(newClinicId);
    }
  }, [newClinicId, hasInsertedFromParams, selectedClinicId, setSelectedClinicId]);

  // Refresh sessions when a new clinic is created from parameters (debounced)
  useEffect(() => {
    if (newClinicId && hasInsertedFromParams) {
      console.log('🔄 New clinic created, refreshing sessions...');
      refreshSessions();
    }
  }, [newClinicId, hasInsertedFromParams, refreshSessions]);

  const handleContinueEditing = (sessionId: string) => {
    navigate(`/ai-copy-preview?sessionId=${sessionId}&mode=edit`);
  };

  const toggleDebugMode = () => {
    setDebugMode(!debugMode);
    if (!debugMode) {
      console.log('🐛 Debug mode enabled - refreshing data...');
      refreshSessions();
    } else {
      console.log('🐛 Debug mode disabled');
    }
  };

  if (loading || isCreatingClinicFromParams) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 py-8 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <DashboardSkeleton />
          {isCreatingClinicFromParams && (
            <div className="mt-4 text-center text-blue-600 dark:text-blue-400">
              Creating clinic from URL parameters...
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 py-8 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <BreadcrumbNav items={[{ label: 'Dashboard' }]} showHome={false} />
        
        {/* Debug Mode Toggle */}
        <div className="mb-4 flex justify-end">
          <Button
            variant={debugMode ? "default" : "outline"}
            size="sm"
            onClick={toggleDebugMode}
            className="flex items-center gap-2"
          >
            {debugMode ? <BugOff className="h-4 w-4" /> : <Bug className="h-4 w-4" />}
            {debugMode ? 'Disable' : 'Enable'} Debug Mode
          </Button>
        </div>

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
