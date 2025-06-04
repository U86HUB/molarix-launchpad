
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardSessions } from '@/hooks/useDashboardSessions';
import { useSessionFilters, SortOption, FilterOption } from '@/hooks/useSessionFilters';
import { useMultipleSessionStatuses } from '@/hooks/useSessionStatus';
import { GroupingType } from '@/hooks/useSessionGrouping';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardStats from '@/components/dashboard/DashboardStats';
import DashboardFilters from '@/components/dashboard/DashboardFilters';
import DashboardEmpty from '@/components/dashboard/DashboardEmpty';
import GroupedSessionsGrid from '@/components/dashboard/GroupedSessionsGrid';
import { Loader2, Plus } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { sessions, loading, refreshSessions, deleteSession, duplicateSession } = useDashboardSessions();

  // Filtering, sorting, and grouping state
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [groupBy, setGroupBy] = useState<GroupingType>('date');

  // Get session statuses for filtering
  const sessionStatuses = useMultipleSessionStatuses(sessions);

  const { filteredSessions, totalCount, filteredCount } = useSessionFilters({
    sessions,
    sortBy,
    filterBy,
    sessionStatuses
  });

  const handleContinueEditing = (sessionId: string) => {
    navigate(`/ai-copy-preview?sessionId=${sessionId}&resume=true`);
  };

  const handlePreview = (sessionId: string) => {
    navigate(`/ai-copy-preview?sessionId=${sessionId}`);
  };

  const handleDelete = async (sessionId: string, clinicName: string) => {
    if (confirm(`Are you sure you want to delete "${clinicName}"? This action cannot be undone.`)) {
      const success = await deleteSession(sessionId);
      if (success) {
        refreshSessions();
      }
    }
  };

  const handleDuplicate = async (sessionId: string, clinicName: string) => {
    if (confirm(`Do you want to create a copy of "${clinicName}"?`)) {
      const success = await duplicateSession(sessionId);
      if (success) {
        refreshSessions();
      }
    }
  };

  const handleCreateNew = () => {
    navigate('/onboarding');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <DashboardHeader userEmail={user?.email || ''} />
        
        {/* Show empty state for first-time users */}
        {sessions.length === 0 ? (
          <div className="mt-12">
            <DashboardEmpty onCreateNew={handleCreateNew} />
          </div>
        ) : (
          <>
            {/* Analytics Stats Section */}
            <DashboardStats sessions={sessions} />
            
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Clinic Websites</h2>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Manage and preview your dental clinic websites
                </p>
              </div>
              <Button onClick={handleCreateNew} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create New Website
              </Button>
            </div>

            {/* Filters, Sorting, and Grouping */}
            <DashboardFilters
              sortBy={sortBy}
              filterBy={filterBy}
              groupBy={groupBy}
              onSortChange={setSortBy}
              onFilterChange={setFilterBy}
              onGroupChange={setGroupBy}
              totalCount={totalCount}
              filteredCount={filteredCount}
            />

            {filteredSessions.length === 0 ? (
              <Card className="text-center py-12">
                <CardHeader>
                  <CardTitle>No websites match your filters</CardTitle>
                  <CardDescription>
                    Try adjusting your sort and filter options to see more results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => {
                      setSortBy('newest');
                      setFilterBy('all');
                    }} 
                    variant="outline"
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <GroupedSessionsGrid
                sessions={filteredSessions}
                groupBy={groupBy}
                onContinueEditing={handleContinueEditing}
                onPreview={handlePreview}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
                onUpdate={refreshSessions}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
