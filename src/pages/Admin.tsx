
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SeedDatabaseButton } from '@/scripts/seedTemplateData';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminPage = () => {
  const { user } = useAuth();
  
  // Simple admin check - in a real app, you would check for admin role
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return (
    <div className="container mx-auto py-10 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue="database">
        <TabsList className="mb-4">
          <TabsTrigger value="database">Database Management</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle>Database Operations</CardTitle>
              <CardDescription>
                Execute maintenance tasks on the database
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-900">
                <h3 className="text-lg font-medium mb-2">Seed Template Data</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Populate the database with default templates and sections. 
                  This should only be run once on a fresh database.
                </p>
                <SeedDatabaseButton />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Template Management</CardTitle>
              <CardDescription>
                View and manage website templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Template management features will be added here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
