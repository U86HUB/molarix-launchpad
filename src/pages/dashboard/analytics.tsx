
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Loader2, BarChart3, Users, MessageSquare, Calendar, TrendingUp, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsData {
  totalLeads: number;
  totalAppointments: number;
  totalMessages: number;
  siteStatus: {
    isLive: boolean;
    uptimePercent: number;
    lastChecked: string;
  } | null;
  recentLeads: Array<{
    id: string;
    name: string;
    email: string;
    created_at: string;
  }>;
  recentAppointments: Array<{
    id: string;
    patient_name: string;
    patient_email: string;
    desired_datetime: string;
    status: string;
  }>;
}

const DashboardAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userSiteId, setUserSiteId] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // First get the user's site ID
      const { data: sites } = await supabase
        .from('sites')
        .select('id')
        .limit(1);

      if (!sites || sites.length === 0) {
        setIsLoading(false);
        return;
      }

      const siteId = sites[0].id;
      setUserSiteId(siteId);

      // Fetch all analytics data in parallel
      const [
        { data: leads, count: leadsCount },
        { data: appointments, count: appointmentsCount },
        { data: messages, count: messagesCount },
        { data: siteStatus },
        { data: recentLeads },
        { data: recentAppointments }
      ] = await Promise.all([
        supabase
          .from('leads')
          .select('*', { count: 'exact' })
          .eq('site_id', siteId),
        supabase
          .from('appointments')
          .select('*', { count: 'exact' })
          .eq('site_id', siteId),
        supabase
          .from('messages')
          .select('*', { count: 'exact' })
          .eq('site_id', siteId),
        supabase
          .from('site_status')
          .select('*')
          .eq('site_id', siteId)
          .single(),
        supabase
          .from('leads')
          .select('id, name, email, created_at')
          .eq('site_id', siteId)
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('appointments')
          .select('id, patient_name, patient_email, desired_datetime, status')
          .eq('site_id', siteId)
          .order('created_at', { ascending: false })
          .limit(5)
      ]);

      setAnalytics({
        totalLeads: leadsCount || 0,
        totalAppointments: appointmentsCount || 0,
        totalMessages: messagesCount || 0,
        siteStatus: siteStatus ? {
          isLive: siteStatus.is_live,
          uptimePercent: Number(siteStatus.uptime_percent) || 0,
          lastChecked: siteStatus.last_checked || ''
        } : null,
        recentLeads: recentLeads || [],
        recentAppointments: recentAppointments || []
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-8 text-gray-500">
        No site found. Please create a site first.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Monitor your site's performance and visitor interactions
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              Contact form submissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalAppointments}</div>
            <p className="text-xs text-muted-foreground">
              Appointment requests
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chat Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalMessages}</div>
            <p className="text-xs text-muted-foreground">
              Chat interactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Site Status</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge variant={analytics.siteStatus?.isLive ? "default" : "secondary"}>
                {analytics.siteStatus?.isLive ? "Live" : "Offline"}
              </Badge>
            </div>
            {analytics.siteStatus && (
              <p className="text-xs text-muted-foreground mt-1">
                {analytics.siteStatus.uptimePercent}% uptime
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.recentLeads.length === 0 ? (
              <p className="text-sm text-muted-foreground">No leads yet</p>
            ) : (
              <div className="space-y-3">
                {analytics.recentLeads.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{lead.name}</p>
                      <p className="text-xs text-muted-foreground">{lead.email}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.recentAppointments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No appointments yet</p>
            ) : (
              <div className="space-y-3">
                {analytics.recentAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{appointment.patient_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(appointment.desired_datetime).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge 
                      variant={appointment.status === 'confirmed' ? "default" : "secondary"}
                    >
                      {appointment.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardAnalytics;
