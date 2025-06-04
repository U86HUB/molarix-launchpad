
import { Clock } from 'lucide-react';
import { DashboardSession } from '@/hooks/useDashboardSessions';
import { SessionStatus } from '@/hooks/useSessionStatus';

interface SessionCardInfoProps {
  session: DashboardSession;
  status: SessionStatus;
}

const SessionCardInfo = ({ session, status }: SessionCardInfoProps) => {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Less than an hour ago';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };
    
    return formatDate(dateString);
  };

  return (
    <div className="space-y-2">
      <div className="text-sm text-gray-600 dark:text-gray-300">
        Template: <span className="font-medium">{session.selected_template || 'Not selected'}</span>
      </div>
      
      <div className="text-sm text-gray-600 dark:text-gray-300">
        Status: <span className="font-medium">{status}</span>
      </div>
      
      <div className="flex items-center gap-1 text-xs text-gray-500">
        <Clock className="h-3 w-3" />
        Last updated {formatTimeAgo(session.last_updated || session.created_at)}
      </div>
    </div>
  );
};

export default SessionCardInfo;
