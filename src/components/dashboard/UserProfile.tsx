
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Building2 } from 'lucide-react';

interface UserProfileProps {
  userEmail: string;
}

const UserProfile = ({ userEmail }: UserProfileProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Get initials from email
  const getInitials = (email: string) => {
    const parts = email.split('@')[0].split('.');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return email[0].toUpperCase();
  };

  const getDisplayName = (email: string) => {
    const username = email.split('@')[0];
    return username.split('.').map(part => 
      part.charAt(0).toUpperCase() + part.slice(1)
    ).join(' ');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-3 p-2 h-auto hover:bg-gray-50 dark:hover:bg-gray-800">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-blue-500 text-white text-sm font-medium">
              {getInitials(userEmail)}
            </AvatarFallback>
          </Avatar>
          <div className="text-left hidden sm:block">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {getDisplayName(userEmail)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {userEmail}
            </p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          Edit Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Building2 className="mr-2 h-4 w-4" />
          Manage Clinics
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-red-600 dark:text-red-400">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
