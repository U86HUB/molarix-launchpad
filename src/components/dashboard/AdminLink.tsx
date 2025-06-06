
import { LucideSettings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const AdminLink = () => {
  const { user } = useAuth();
  
  // Only show admin link if user is logged in
  if (!user) return null;
  
  return (
    <Link to="/admin" className="block">
      <Button variant="outline" className="w-full flex items-center justify-center gap-2">
        <LucideSettings className="h-4 w-4" />
        Admin Dashboard
      </Button>
    </Link>
  );
};

export default AdminLink;
