
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Clock, History, ArrowLeft } from "lucide-react";
import { useCopyHistory, CopyVersion } from "@/hooks/useCopyHistory";
import { GeneratedCopy } from "@/types/copy";

interface CopyHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  currentCopy: GeneratedCopy;
  onRestore: (copy: GeneratedCopy) => void;
}

const CopyHistoryModal = ({ 
  isOpen, 
  onClose, 
  sessionId, 
  currentCopy, 
  onRestore 
}: CopyHistoryModalProps) => {
  const { versions, loading, getVersionDiff, restoreVersion, formatDate } = useCopyHistory({ sessionId });
  const [selectedVersion, setSelectedVersion] = useState<CopyVersion | null>(null);
  const [showDiff, setShowDiff] = useState(false);

  const handleRestore = (version: CopyVersion) => {
    const restoredCopy = restoreVersion(version);
    onRestore(restoredCopy);
    onClose();
  };

  const handleViewDiff = (version: CopyVersion) => {
    setSelectedVersion(version);
    setShowDiff(true);
  };

  const handleBackToHistory = () => {
    setShowDiff(false);
    setSelectedVersion(null);
  };

  if (showDiff && selectedVersion) {
    const differences = getVersionDiff(selectedVersion.data, currentCopy);
    
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleBackToHistory}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <DialogTitle>Version Comparison</DialogTitle>
                <DialogDescription>
                  Comparing {selectedVersion.versionLabel} with current version
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold">{selectedVersion.versionLabel}</h3>
                <p className="text-sm text-gray-600">{formatDate(selectedVersion.created_at)}</p>
              </div>
              <Button onClick={() => handleRestore(selectedVersion)}>
                Restore This Version
              </Button>
            </div>

            {differences.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No differences found between these versions
              </div>
            ) : (
              <div className="space-y-4">
                <h4 className="font-medium">Changes ({differences.length})</h4>
                {differences.map((diff, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">
                        {diff.section} - {diff.field}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Badge variant="destructive" className="mb-2">Previous</Badge>
                        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm">
                          {diff.oldValue}
                        </div>
                      </div>
                      <div>
                        <Badge variant="default" className="mb-2">Current</Badge>
                        <div className="p-3 bg-green-50 border border-green-200 rounded text-sm">
                          {diff.newValue}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Copy Version History
          </DialogTitle>
          <DialogDescription>
            View and restore previous versions of your AI-generated copy
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 animate-spin" />
              <span>Loading version history...</span>
            </div>
          </div>
        ) : versions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No version history found
          </div>
        ) : (
          <div className="space-y-4">
            {versions.map((version, index) => (
              <Card key={version.id} className={index === 0 ? "border-blue-200 bg-blue-50" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{version.versionLabel}</h3>
                          {index === 0 && (
                            <Badge variant="default">Current</Badge>
                          )}
                          {version.type === 'draft' && index > 0 && (
                            <Badge variant="secondary">Draft</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(version.created_at)}
                        </p>
                      </div>
                    </div>
                    
                    {index > 0 && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDiff(version)}
                        >
                          View Changes
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleRestore(version)}
                        >
                          Restore
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CopyHistoryModal;
