
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDiagnostics } from '@/hooks/useDiagnostics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle, XCircle, RefreshCw, Play, Database, Users, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import BreadcrumbNav from '@/components/ui/breadcrumb-nav';

const AdminDiagnostics = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isRunningRepair, setIsRunningRepair] = useState(false);
  
  const {
    orphanedWebsites,
    crossOwnerWebsites,
    rlsTests,
    recentErrors,
    loading,
    refreshData,
    runOrphanedWebsitesRepair
  } = useDiagnostics();

  const handleRunRepair = async () => {
    setIsRunningRepair(true);
    try {
      const success = await runOrphanedWebsitesRepair();
      if (success) {
        toast({
          title: "Repair Completed",
          description: "Orphaned websites repair script executed successfully",
        });
        refreshData();
      } else {
        toast({
          title: "Repair Failed",
          description: "Failed to execute repair script. Check logs for details.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error running repair:', error);
      toast({
        title: "Error",
        description: "An error occurred while running the repair script",
        variant: "destructive",
      });
    } finally {
      setIsRunningRepair(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 py-8 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                <h2 className="text-lg font-semibold mb-2">Access Denied</h2>
                <p className="text-gray-600">You must be logged in to access the diagnostics panel.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 py-8 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <BreadcrumbNav 
          items={[
            { label: 'Admin', href: '/admin' },
            { label: 'Diagnostics' }
          ]} 
        />
        
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                System Diagnostics
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Monitor and troubleshoot system data integrity
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={refreshData}
                disabled={loading}
                variant="outline"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              
              <Button
                onClick={handleRunRepair}
                disabled={isRunningRepair || loading}
                variant="destructive"
              >
                <Play className={`h-4 w-4 mr-2 ${isRunningRepair ? 'animate-spin' : ''}`} />
                {isRunningRepair ? 'Running...' : 'Fix Orphaned Data'}
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="orphaned" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="orphaned" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Orphaned Websites
            </TabsTrigger>
            <TabsTrigger value="ownership" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Cross-Owner Data
            </TabsTrigger>
            <TabsTrigger value="rls" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              RLS Tests
            </TabsTrigger>
            <TabsTrigger value="errors" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Recent Errors
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orphaned">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Orphaned Websites
                </CardTitle>
                <CardDescription>
                  Websites that have no associated clinic (clinic_id is NULL)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">Loading orphaned websites...</p>
                  </div>
                ) : orphanedWebsites.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p className="text-gray-600">No orphaned websites found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="destructive">{orphanedWebsites.length}</Badge>
                      <span className="text-sm text-gray-600">orphaned websites found</span>
                    </div>
                    
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Template</TableHead>
                          <TableHead>Created By</TableHead>
                          <TableHead>Created At</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orphanedWebsites.map((website) => (
                          <TableRow key={website.id}>
                            <TableCell className="font-medium">{website.name}</TableCell>
                            <TableCell>
                              <Badge variant={website.status === 'published' ? 'default' : 'secondary'}>
                                {website.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{website.template_type}</TableCell>
                            <TableCell className="font-mono text-xs">{website.created_by}</TableCell>
                            <TableCell>{formatDate(website.created_at)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ownership">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Cross-Owner Websites
                </CardTitle>
                <CardDescription>
                  Websites created by users different from the current user
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">Loading cross-owner data...</p>
                  </div>
                ) : crossOwnerWebsites.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p className="text-gray-600">No cross-owner websites found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="outline">{crossOwnerWebsites.length}</Badge>
                      <span className="text-sm text-gray-600">cross-owner websites found</span>
                    </div>
                    
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Clinic ID</TableHead>
                          <TableHead>Created By</TableHead>
                          <TableHead>Current User</TableHead>
                          <TableHead>Created At</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {crossOwnerWebsites.map((website) => (
                          <TableRow key={website.id}>
                            <TableCell className="font-medium">{website.name}</TableCell>
                            <TableCell>
                              <Badge variant={website.status === 'published' ? 'default' : 'secondary'}>
                                {website.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-mono text-xs">{website.clinic_id}</TableCell>
                            <TableCell className="font-mono text-xs">{website.created_by}</TableCell>
                            <TableCell className="font-mono text-xs">{website.current_user_id}</TableCell>
                            <TableCell>{formatDate(website.created_at)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rls">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Row Level Security Tests
                </CardTitle>
                <CardDescription>
                  Test access permissions on major database tables
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">Running RLS tests...</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Table</TableHead>
                        <TableHead>Select Access</TableHead>
                        <TableHead>Record Count</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rlsTests.map((test) => (
                        <TableRow key={test.table_name}>
                          <TableCell className="font-medium">{test.table_name}</TableCell>
                          <TableCell>
                            {test.can_select ? (
                              <div className="flex items-center gap-2 text-green-600">
                                <CheckCircle className="h-4 w-4" />
                                <span>Allowed</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-red-600">
                                <XCircle className="h-4 w-4" />
                                <span>Denied</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>{test.record_count}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="errors">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Recent Diagnostic Errors
                </CardTitle>
                <CardDescription>
                  Last 10 diagnostic errors logged in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">Loading recent errors...</p>
                  </div>
                ) : recentErrors.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p className="text-gray-600">No recent errors logged</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Error Type</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Table</TableHead>
                        <TableHead>User ID</TableHead>
                        <TableHead>Created At</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentErrors.map((error) => (
                        <TableRow key={error.id}>
                          <TableCell>
                            <Badge variant="destructive">{error.error_type}</Badge>
                          </TableCell>
                          <TableCell className="max-w-md truncate">{error.error_message}</TableCell>
                          <TableCell>{error.table_name || 'N/A'}</TableCell>
                          <TableCell className="font-mono text-xs">{error.user_id || 'N/A'}</TableCell>
                          <TableCell>{formatDate(error.created_at)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDiagnostics;
