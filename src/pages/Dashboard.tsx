
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardSessions } from '@/hooks/useDashboardSessions';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardStats from '@/components/dashboard/DashboardStats';
import SessionCard from '@/components/dashboard/SessionCard';
import { Loader2, Plus } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { sessions, loading, refreshSessions, deleteSession, duplicateSession } = useDashboardSessions();

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

        {sessions.length === 0 ? (
          <Card className="text-center py-12">
            <CardHeader>
              <CardTitle>No websites yet</CardTitle>
              <CardDescription>
                Get started by creating your first dental clinic website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleCreateNew} className="flex items-center gap-2 mx-auto">
                <Plus className="h-4 w-4" />
                Create Your First Website
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onContinueEditing={handleContinueEditing}
                onPreview={handlePreview}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
