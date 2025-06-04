
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Edit, X, Clock } from "lucide-react";

interface EditControlsProps {
  isEditing: boolean;
  loading: boolean;
  isSaving?: boolean;
  lastSaved?: Date | null;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
}

const EditControls = ({ 
  isEditing, 
  loading, 
  isSaving = false,
  lastSaved,
  onEdit, 
  onCancel, 
  onSave 
}: EditControlsProps) => {
  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffSeconds < 60) {
      return 'Just now';
    } else if (diffSeconds < 3600) {
      const minutes = Math.floor(diffSeconds / 60);
      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    } else {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Your AI-Generated Copy</CardTitle>
            <CardDescription>
              {isEditing ? "Make changes to your copy and save when ready" : "Click edit to modify your content"}
              {isEditing && (
                <div className="flex items-center gap-2 mt-1 text-sm">
                  {isSaving ? (
                    <div className="flex items-center gap-1 text-blue-600">
                      <Clock className="h-3 w-3 animate-spin" />
                      <span>Auto-saving...</span>
                    </div>
                  ) : lastSaved ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <Clock className="h-3 w-3" />
                      <span>Draft saved {formatLastSaved(lastSaved)}</span>
                    </div>
                  ) : null}
                </div>
              )}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <Button onClick={onEdit} variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Copy
              </Button>
            ) : (
              <>
                <Button onClick={onCancel} variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={onSave} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Publishing...' : 'Publish Changes'}
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default EditControls;
