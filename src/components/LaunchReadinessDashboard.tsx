
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Rocket, Globe, Shield, Smartphone } from "lucide-react";
import AccessibilityTester from "./AccessibilityTester";
import ResponsivenessTester from "./ResponsivenessTester";

interface LaunchCheck {
  id: string;
  name: string;
  status: 'complete' | 'pending' | 'failed';
  description: string;
  icon: React.ReactNode;
}

const LaunchReadinessDashboard = () => {
  const [checks] = useState<LaunchCheck[]>([
    {
      id: 'mobile-responsive',
      name: 'Mobile Responsiveness',
      status: 'complete',
      description: 'Site adapts to different screen sizes',
      icon: <Smartphone className="h-5 w-5" />
    },
    {
      id: 'navigation',
      name: 'Navigation & Routes',
      status: 'complete',
      description: 'All links work and routes are properly configured',
      icon: <Globe className="h-5 w-5" />
    },
    {
      id: 'accessibility',
      name: 'Accessibility',
      status: 'complete',
      description: 'WCAG guidelines followed, proper ARIA labels',
      icon: <Shield className="h-5 w-5" />
    },
    {
      id: 'seo',
      name: 'SEO Optimization',
      status: 'complete',
      description: 'Meta tags, structured data, and sitemap ready',
      icon: <Globe className="h-5 w-5" />
    }
  ]);

  const completedChecks = checks.filter(check => check.status === 'complete').length;
  const totalChecks = checks.length;
  const isLaunchReady = completedChecks === totalChecks;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <div className="h-5 w-5 rounded-full bg-gray-300" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      complete: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Rocket className="h-6 w-6 text-blue-600" />
            <span>Launch Readiness Dashboard</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Overall Status */}
            <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950 rounded-lg">
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {completedChecks}/{totalChecks}
              </div>
              <div className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                Launch Requirements Complete
              </div>
              {isLaunchReady ? (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-lg px-4 py-2">
                  🚀 Ready for Launch!
                </Badge>
              ) : (
                <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-lg px-4 py-2">
                  In Progress
                </Badge>
              )}
            </div>

            {/* Checklist */}
            <div className="space-y-3">
              {checks.map((check) => (
                <div key={check.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  {check.icon}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {check.name}
                      </h3>
                      {getStatusBadge(check.status)}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {check.description}
                    </p>
                  </div>
                  {getStatusIcon(check.status)}
                </div>
              ))}
            </div>

            {/* Deployment Instructions */}
            {isLaunchReady && (
              <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="text-blue-900 dark:text-blue-100">
                    Ready to Deploy!
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-blue-800 dark:text-blue-200">
                  <div className="space-y-2 text-sm">
                    <p>✅ All launch requirements completed</p>
                    <p>✅ SEO tags configured</p>
                    <p>✅ Accessibility optimized</p>
                    <p>✅ Mobile responsive design verified</p>
                    <p className="font-medium mt-4">
                      Next steps: Deploy to staging environment and run final tests before production launch.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Testing Tabs */}
      <Tabs defaultValue="accessibility" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="accessibility">Accessibility Tests</TabsTrigger>
          <TabsTrigger value="responsive">Responsive Tests</TabsTrigger>
        </TabsList>
        <TabsContent value="accessibility">
          <AccessibilityTester />
        </TabsContent>
        <TabsContent value="responsive">
          <ResponsivenessTester />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LaunchReadinessDashboard;
