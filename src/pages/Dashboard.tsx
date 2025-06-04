
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardSessions } from '@/hooks/useDashboardSessions';
import { useSessionFilters, SortOption, FilterOption } from '@/hooks/useSessionFilters';
import { useMultipleSessionStatuses } from '@/hooks/useSessionStatus';
import { GroupingType } from '@/hooks/useSessionGrouping';
import UserProfile from '@/components/dashboard/UserProfile';
import DashboardStats from '@/components/dashboard/DashboardStats';
import DashboardFilters from '@/components/dashboard/DashboardFilters';
import DashboardEmpty from '@/components/dashboard/DashboardEmpty';
import GroupedSessionsGrid from '@/components/dashboard/GroupedSessionsGrid';
import PreviewModal from '@/components/dashboard/PreviewModal';
import { CreateWebsiteModal } from '@/components/dashboard/CreateWebsiteModal';
import { Loader2, Plus, Search } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { sessions, loading, refreshSessions, deleteSession, duplicateSession } = useDashboardSessions();

  // Filtering, sorting, and grouping state
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [groupBy, setGroupBy] = useState<GroupingType>('date');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Preview modal state
  const [previewSessionId, setPreviewSessionId] = useState<string | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Create website modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Get session statuses for filtering
  const sessionStatuses = useMultipleSessionStatuses(sessions);

  const { filteredSessions, totalCount, filteredCount } = useSessionFilters({
    sessions,
    sortBy,
    filterBy,
    sessionStatuses
  });

  // Apply search filtering
  const searchFilteredSessions = filteredSessions.filter(session =>
    session.clinic_name?.toLowerCase().includes(searchQuery.toLowerCase()) || false
  );

  // Get user's first name for personalized greeting
  const getFirstName = (email: string) => {
    const username = email.split('@')[0];
    const parts = username.split('.');
    return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  };

  const handleContinueEditing = (sessionId: string) => {
    navigate(`/ai-copy-preview?sessionId=${sessionId}&mode=edit`);
  };

  const handlePreview = (sessionId: string) => {
    setPreviewSessionId(sessionId);
    setIsPreviewModalOpen(true);
  };

  const handleClosePreviewModal = () => {
    setIsPreviewModalOpen(false);
    setPreviewSessionId(null);
    // Refresh sessions to get updated data after any publishes
    refreshSessions();
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
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    // Refresh sessions to show the newly created website
    refreshSessions();
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
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 font-normal">
              Welcome back, {user?.email ? getFirstName(user.email) : 'there'}! Here's a snapshot of your clinic projects.
            </p>
          </div>
          <div className="mt-6 sm:mt-0 p-4 bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-sm backdrop-blur-sm">
            <UserProfile userEmail={user?.email || ''} />
          </div>
        </div>
        
        {/* Show empty state for first-time users */}
        {sessions.length === 0 ? (
          <div className="mt-12">
            <DashboardEmpty onCreateNew={handleCreateNew} />
          </div>
        ) : (
          <>
            {/* Enhanced Analytics Stats Section with background container */}
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/20 dark:border-gray-700/20 mb-8">
              <DashboardStats sessions={sessions} />
            </div>
            
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Your Clinic Websites</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Manage and preview your dental clinic websites
                </p>
              </div>
              <Button 
                onClick={handleCreateNew} 
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200 shadow-md"
                size="lg"
              >
                <Plus className="h-5 w-5" />
                Create New Website
              </Button>
            </div>

            {/* Enhanced Filters with search functionality */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm mb-6">
              <div className="p-4">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                  <DashboardFilters
                    sortBy={sortBy}
                    filterBy={filterBy}
                    groupBy={groupBy}
                    onSortChange={setSortBy}
                    onFilterChange={setFilterBy}
                    onGroupChange={setGroupBy}
                    totalCount={totalCount}
                    filteredCount={searchQuery ? searchFilteredSessions.length : filteredCount}
                  />
                  
                  {/* Search Input */}
                  <div className="relative w-full lg:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search websites..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-9 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {searchFilteredSessions.length === 0 ? (
              <Card className="text-center py-12 shadow-sm border-border bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-xl">
                    {searchQuery ? 'No websites match your search' : 'No websites match your filters'}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {searchQuery 
                      ? `Try a different search term or clear your search to see all results`
                      : `Try adjusting your sort and filter options to see more results`
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {searchQuery && (
                      <Button 
                        onClick={() => setSearchQuery('')} 
                        variant="outline"
                        className="border-blue-200 text-blue-700 hover:bg-blue-50"
                      >
                        Clear Search
                      </Button>
                    )}
                    <Button 
                      onClick={() => {
                        setSortBy('newest');
                        setFilterBy('all');
                        setSearchQuery('');
                      }} 
                      variant="outline"
                    >
                      Reset All Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <GroupedSessionsGrid
                sessions={searchFilteredSessions}
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

      {/* Preview Modal */}
      <PreviewModal
        sessionId={previewSessionId}
        isOpen={isPreviewModalOpen}
        onClose={handleClosePreviewModal}
      />

      {/* Create Website Modal */}
      <CreateWebsiteModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
      />
    </div>
  );
};

export default Dashboard;
