
import { useEffect } from 'react';
import { DashboardSession } from '@/hooks/useDashboardSessions';
import GettingStartedGuide from './GettingStartedGuide';

interface DashboardGettingStartedProps {
  sessions: DashboardSession[];
  showGettingStarted: boolean;
  setShowGettingStarted: (show: boolean) => void;
  onCreateWebsite: () => void;
}

const DashboardGettingStarted = ({
  sessions,
  showGettingStarted,
  setShowGettingStarted,
  onCreateWebsite
}: DashboardGettingStartedProps) => {
  // Show getting started guide for new users
  useEffect(() => {
    const hasSeenGuide = localStorage.getItem('hasSeenGettingStartedGuide');
    if (!hasSeenGuide && sessions.length === 0) {
      setShowGettingStarted(true);
    }
  }, [sessions.length, setShowGettingStarted]);

  const handleDismissGettingStarted = () => {
    setShowGettingStarted(false);
    localStorage.setItem('hasSeenGettingStartedGuide', 'true');
  };

  if (!showGettingStarted) {
    return null;
  }

  return (
    <GettingStartedGuide
      onDismiss={handleDismissGettingStarted}
      onCreateWebsite={onCreateWebsite}
    />
  );
};

export default DashboardGettingStarted;
