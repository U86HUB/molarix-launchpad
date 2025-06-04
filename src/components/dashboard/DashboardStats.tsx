
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { DashboardSession } from '@/hooks/useDashboardSessions';
import { useSessionStatus, SessionStatus } from '@/hooks/useSessionStatus';
import { Globe, CheckCircle, Clock, TrendingUp, Info } from 'lucide-react';

interface DashboardStatsProps {
  sessions: DashboardSession[];
}

const DashboardStats = ({ sessions }: DashboardStatsProps) => {
  // Calculate statistics
  const totalSessions = sessions.length;
  
  // Calculate status distribution
  const statusCounts = sessions.reduce((counts, session) => {
    // We'll simulate the status calculation here for stats since we can't use hooks in reduce
    // This is a simplified version - in a real app you might want to fetch this data differently
    const hasTemplate = session.selected_template !== null;
    const hasCompletion = session.completion_score !== null && session.completion_score > 0;
    
    let status: SessionStatus = 'Draft';
    if (hasCompletion && session.completion_score && session.completion_score >= 80) {
      status = 'Ready to Publish';
    } else if (hasCompletion) {
      status = 'In Progress';
    }
    
    counts[status] = (counts[status] || 0) + 1;
    return counts;
  }, {} as Record<SessionStatus, number>);

  const readyToPublishCount = statusCounts['Ready to Publish'] || 0;
  
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
      icon: Globe,
      description: `${totalSessions} website${totalSessions !== 1 ? 's' : ''} created`,
      tooltip: "Total number of clinic website projects you've created",
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      title: "Ready to Publish",
      value: readyToPublishCount,
      icon: CheckCircle,
      description: "Completed websites",
      tooltip: "Websites with complete content ready to go live",
      color: "text-green-600 dark:text-green-400"
    },
    {
      title: "Last Activity",
      value: formatLastEdit(),
      icon: Clock,
      description: lastEditTimestamp ? "Most recent edit" : "No activity",
      tooltip: "Shows your most recent update across all projects",
      color: "text-orange-600 dark:text-orange-400"
    },
    {
      title: "Recent Activity",
      value: recentActivityCount,
      icon: TrendingUp,
      description: "Active in last 7 days",
      tooltip: "Number of projects with updates in the past week",
      color: "text-purple-600 dark:text-purple-400"
    }
  ];

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="relative overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-white/30 dark:border-gray-700/30 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {stat.title}
                  </CardTitle>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                        aria-label={`More information about ${stat.title}`}
                      >
                        <Info className="h-3 w-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{stat.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </TooltipProvider>
  );
};

export default DashboardStats;
