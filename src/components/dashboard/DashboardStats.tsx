
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { DashboardSession } from '@/hooks/useDashboardSessions';
import { useSessionStatus, SessionStatus } from '@/hooks/useSessionStatus';
import { BarChart3, Calendar, FileText, TrendingUp, Info } from 'lucide-react';

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
      icon: FileText,
      description: `${totalSessions} website${totalSessions !== 1 ? 's' : ''} created`,
      tooltip: "Total number of clinic website projects you've created"
    },
    {
      title: "Ready to Publish",
      value: readyToPublishCount,
      icon: BarChart3,
      description: "Completed websites",
      tooltip: "Websites with complete content ready to go live"
    },
    {
      title: "Last Activity",
      value: formatLastEdit(),
      icon: Calendar,
      description: lastEditTimestamp ? "Most recent edit" : "No activity",
      tooltip: "Shows your most recent update across all projects"
    },
    {
      title: "Recent Activity",
      value: recentActivityCount,
      icon: TrendingUp,
      description: "Active in last 7 days",
      tooltip: "Number of projects with updates in the past week"
    }
  ];

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="shadow-sm border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{stat.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
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
