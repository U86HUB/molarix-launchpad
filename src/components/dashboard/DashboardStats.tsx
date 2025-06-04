
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardSession } from '@/hooks/useDashboardSessions';
import { BarChart3, Calendar, FileText, TrendingUp } from 'lucide-react';

interface DashboardStatsProps {
  sessions: DashboardSession[];
}

const DashboardStats = ({ sessions }: DashboardStatsProps) => {
  // Calculate statistics
  const totalSessions = sessions.length;
  
  // Calculate average completion score
  const sessionsWithCompletion = sessions.filter(session => session.completion_score !== null);
  const averageCompletion = sessionsWithCompletion.length > 0 
    ? Math.round(sessionsWithCompletion.reduce((sum, session) => sum + (session.completion_score || 0), 0) / sessionsWithCompletion.length)
    : 0;
  
  // Get the most recent edit timestamp from last_updated
  const lastEditTimestamp = sessions.length > 0 
    ? Math.max(...sessions.map(session => new Date(session.last_updated || session.created_at).getTime()))
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

  // Calculate sessions with recent activity (within last 7 days)
  const recentActivityCount = sessions.filter(session => {
    const lastUpdate = new Date(session.last_updated || session.created_at);
    const daysSinceUpdate = Math.floor((Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceUpdate <= 7;
  }).length;

  const statsData = [
    {
      title: "Total Websites",
      value: totalSessions,
      icon: FileText,
      description: `${totalSessions} website${totalSessions !== 1 ? 's' : ''} created`
    },
    {
      title: "Avg. Completion",
      value: `${averageCompletion}%`,
      icon: BarChart3,
      description: sessionsWithCompletion.length > 0 ? "Content completeness" : "No completion data"
    },
    {
      title: "Last Activity",
      value: formatLastEdit(),
      icon: Calendar,
      description: lastEditTimestamp ? "Most recent edit" : "No activity"
    },
    {
      title: "Recent Activity",
      value: recentActivityCount,
      icon: TrendingUp,
      description: "Active in last 7 days"
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
