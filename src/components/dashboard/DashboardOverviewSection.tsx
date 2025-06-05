
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Building2, Globe, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardOverviewSection = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Personal Settings',
      description: 'Manage your account, profile, and preferences',
      icon: User,
      href: '/dashboard/personal',
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Clinic Settings',
      description: 'Configure clinic information and settings',
      icon: Building2,
      href: '/dashboard/clinic',
      color: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Website Management',
      description: 'Create and manage your clinic websites',
      icon: Globe,
      href: '/dashboard/websites',
      color: 'text-purple-600 dark:text-purple-400'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome to Molarix</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Manage your dental practice with our comprehensive platform
        </p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quickActions.map((action) => (
          <Card key={action.title} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <action.icon className={`h-6 w-6 ${action.color}`} />
                <CardTitle className="text-lg">{action.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-sm">
                {action.description}
              </CardDescription>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate(action.href)}
                className="w-full flex items-center gap-2"
              >
                Go to {action.title}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Websites</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              No websites created yet
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clinics</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Add your first clinic
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Setup</div>
            <p className="text-xs text-muted-foreground">
              Complete your profile
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <div className="h-4 w-4 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
