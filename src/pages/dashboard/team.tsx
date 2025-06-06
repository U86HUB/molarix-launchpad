
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Loader2, Plus, Edit, Trash2 } from 'lucide-react';
import { TiptapEditor } from '@/components/rich-text/TiptapEditor';
import { supabase } from '@/integrations/supabase/client';

interface StaffMember {
  id: string;
  full_name: string;
  role: string;
  bio: string;
  headshot_url?: string;
  site_id: string;
}

const TeamPage = () => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userSiteId, setUserSiteId] = useState<string | null>(null);
  const [editingMember, setEditingMember] = useState<StaffMember | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentBioJSON, setCurrentBioJSON] = useState<any>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    role: '',
    headshot_url: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // First get the user's site ID
      const { data: sites } = await supabase
        .from('sites')
        .select('id')
        .eq('created_by', (await supabase.auth.getUser()).data.user?.id)
        .limit(1);

      if (sites && sites.length > 0) {
        const siteId = sites[0].id;
        setUserSiteId(siteId);

        // Fetch staff members
        const { data: staff } = await supabase
          .from('staff')
          .select('*')
          .eq('site_id', siteId);

        setStaffMembers(staff || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load team data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (member: StaffMember) => {
    setEditingMember(member);
    setFormData({
      full_name: member.full_name,
      role: member.role,
      headshot_url: member.headshot_url || ''
    });
    
    // Parse bio as JSON if it exists, otherwise use empty content
    let bioJSON = null;
    try {
      bioJSON = member.bio ? JSON.parse(member.bio) : null;
    } catch {
      // If bio is not valid JSON, treat it as plain text
      bioJSON = { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: member.bio || '' }] }] };
    }
    setCurrentBioJSON(bioJSON);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingMember(null);
    setFormData({
      full_name: '',
      role: '',
      headshot_url: ''
    });
    setCurrentBioJSON(null);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!userSiteId) return;

    setIsSaving(true);
    try {
      const memberData = {
        site_id: userSiteId,
        full_name: formData.full_name,
        role: formData.role,
        headshot_url: formData.headshot_url || null,
        bio: currentBioJSON ? JSON.stringify(currentBioJSON) : ''
      };

      if (editingMember) {
        // Update existing member
        await supabase
          .from('staff')
          .update(memberData)
          .eq('id', editingMember.id);
      } else {
        // Create new member
        await supabase
          .from('staff')
          .insert(memberData);
      }

      toast({
        title: "Success",
        description: `Team member ${editingMember ? 'updated' : 'created'} successfully`,
      });

      setIsDialogOpen(false);
      fetchData(); // Refresh the list
    } catch (error) {
      console.error('Error saving team member:', error);
      toast({
        title: "Error",
        description: `Failed to ${editingMember ? 'update' : 'create'} team member`,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (memberId: string) => {
    try {
      await supabase
        .from('staff')
        .delete()
        .eq('id', memberId);

      toast({
        title: "Success",
        description: "Team member deleted successfully",
      });

      fetchData(); // Refresh the list
    } catch (error) {
      console.error('Error deleting team member:', error);
      toast({
        title: "Error",
        description: "Failed to delete team member",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Team Management</CardTitle>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Team Member
          </Button>
        </CardHeader>
        <CardContent>
          {staffMembers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No team members added yet. Click "Add Team Member" to get started.
            </div>
          ) : (
            <div className="grid gap-4">
              {staffMembers.map((member) => (
                <Card key={member.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {member.headshot_url && (
                        <img
                          src={member.headshot_url}
                          alt={member.full_name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <h3 className="font-semibold">{member.full_name}</h3>
                        <p className="text-sm text-gray-600">{member.role}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(member)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(member.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingMember ? 'Edit Team Member' : 'Add Team Member'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Enter full name"
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="Enter role (e.g., Dentist, Hygienist)"
              />
            </div>
            <div>
              <Label htmlFor="headshot_url">Headshot URL</Label>
              <Input
                id="headshot_url"
                value={formData.headshot_url}
                onChange={(e) => setFormData({ ...formData, headshot_url: e.target.value })}
                placeholder="Enter image URL (optional)"
              />
            </div>
            <div>
              <Label>Bio</Label>
              <div className="border rounded-md p-3 min-h-[200px]">
                <TiptapEditor
                  initialContent={currentBioJSON || ''}
                  onUpdate={setCurrentBioJSON}
                />
              </div>
            </div>
            <Button 
              onClick={handleSave} 
              disabled={isSaving || !formData.full_name || !formData.role}
              className="w-full"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                `${editingMember ? 'Update' : 'Create'} Team Member`
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamPage;
