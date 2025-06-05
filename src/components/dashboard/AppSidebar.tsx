
import { useLocation, useNavigate } from 'react-router-dom';
import { User, Building2, Globe, Home } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const navigationItems = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Personal Settings",
    url: "/dashboard/personal",
    icon: User,
  },
  {
    title: "Clinic Settings", 
    url: "/dashboard/clinic",
    icon: Building2,
  },
  {
    title: "Website Management",
    url: "/dashboard/websites",
    icon: Globe,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <div className="flex flex-col gap-2">
          <h1 className="font-semibold text-lg">Molarix Dashboard</h1>
          <p className="text-sm text-muted-foreground truncate">
            {user?.email}
          </p>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location.pathname === item.url}
                  >
                    <button
                      onClick={() => navigate(item.url)}
                      className="flex items-center gap-2 w-full"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={signOut}
          className="w-full"
        >
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
