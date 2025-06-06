
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FullPageLoader } from '@/components/ui/loading-states';
import { AlertCircle } from 'lucide-react';
import { useWebsiteBuilderState } from '@/hooks/useWebsiteBuilderState';
import WebsiteBuilderHeader from './WebsiteBuilderHeader';
import WebsiteBuilderStatusBar from './WebsiteBuilderStatusBar';
import BuilderToolsPanel from './BuilderToolsPanel';
import WebsitePreview from './preview/WebsitePreview';

interface WebsiteBuilderProps {
  websiteId: string;
}

const WebsiteBuilder = ({ websiteId }: WebsiteBuilderProps) => {
  const {
    website,
    sections,
    loading,
    error,
    saving,
    copyMode,
    setCopyMode,
    activeSection,
    currentCopy,
    handleAddSection,
    handleSectionSelect,
    updateSection,
    deleteSection,
    reorderSections
  } = useWebsiteBuilderState(websiteId);

  if (loading) {
    return <FullPageLoader text="Loading website builder..." />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!website) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Website not found</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <WebsiteBuilderHeader 
        websiteName={website.name}
        copyMode={copyMode}
        setCopyMode={setCopyMode}
        saving={saving}
      />

      {/* Status Bar */}
      <WebsiteBuilderStatusBar 
        sections={sections}
        currentCopy={currentCopy}
        copyMode={copyMode}
      />

      {/* Main Content */}
      <div className="flex-1">
        <ResizablePanelGroup direction="horizontal">
          {/* Left Panel - Builder Tools */}
          <ResizablePanel defaultSize={30} minSize={25}>
            <BuilderToolsPanel 
              sections={sections}
              saving={saving}
              activeSection={activeSection}
              onAddSection={handleAddSection}
              onUpdateSection={updateSection}
              onDeleteSection={deleteSection}
            />
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right Panel - Live Preview */}
          <ResizablePanel defaultSize={70}>
            <div className="h-full bg-white dark:bg-gray-900">
              <WebsitePreview 
                sections={sections} 
                onSectionSelect={handleSectionSelect}
                onSectionReorder={reorderSections}
                onSectionUpdate={updateSection}
                selectedSectionId={activeSection || undefined}
                isEditMode={true}
                fallbackCopy={currentCopy}
                copyMode={copyMode}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default WebsiteBuilder;
