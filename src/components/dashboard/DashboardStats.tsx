
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardSession } from '@/hooks/useDashboardSessions';
import { BarChart3, Calendar, FileText, Eye } from 'lucide-react';

interface DashboardStatsProps {
  sessions: DashboardSession[];
}

const DashboardStats = ({ sessions }: DashboardStatsProps) => {
  // Calculate statistics
  const totalSessions = sessions.length;
  const draftSessions = sessions.length; // All sessions are currently drafts since we don't have a published status
  const publishedSessions = 0; // Placeholder for when publishing feature is added
  
  // Get the most recent edit timestamp
  const lastEditTimestamp = sessions.length > 0 
    ? Math.max(...sessions.map(session => new Date(session.created_at).getTime()))
    : null;

  const formatLastEdit = () => {
    if (!lastEditTimestamp) return 'No edits yet';
    
    const lastEdit = new Date(lastEditTimestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - lastEdit.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Less than an hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return lastEdit.toLocaleDateString();
  };

  // Placeholder visits data - this would come from actual analytics when implemented
  const totalVisits = sessions.reduce((total, session) => {
    // Simulate some visit data based on session age
    const sessionAge = Math.floor((Date.now() - new Date(session.created_at).getTime()) / (1000 * 60 * 60 * 24));
    return total + Math.max(0, Math.floor(Math.random() * sessionAge * 3));
  }, 0);

  const statsData = [
    {
      title: "Total Sessions",
      value: totalSessions,
      icon: FileText,
      description: `${totalSessions} website${totalSessions !== 1 ? 's' : ''} created`
    },
    {
      title: "Status Overview",
      value: `${draftSessions}/${publishedSessions}`,
      icon: BarChart3,
      description: `${draftSessions} drafts, ${publishedSessions} published`
    },
    {
      title: "Last Activity",
      value: formatLastEdit(),
      icon: Calendar,
      description: lastEditTimestamp ? "Most recent edit" : "No activity"
    },
    {
      title: "Total Visits",
      value: totalVisits,
      icon: Eye,
      description: "Across all websites"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardStats;
