
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEnhancedWebsiteData } from '@/hooks/useEnhancedWebsiteData';
import { useSectionOperations } from '@/hooks/useSectionOperations';
import { Section } from '@/types/website';
import SectionLibrary from './SectionLibrary';
import SectionEditor from './SectionEditor';
import WebsitePreview from './preview/WebsitePreview';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Eye, Settings, Palette, Save, AlertCircle } from 'lucide-react';
import { FullPageLoader } from '@/components/ui/loading-states';
import { usePreviewInteractions } from '@/hooks/usePreviewInteractions';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface WebsiteBuilderProps {
  websiteId: string;
}

const WebsiteBuilder = ({ websiteId }: WebsiteBuilderProps) => {
  const {
    website,
    sections: loadedSections,
    publishedCopy,
    draftCopy,
    loading,
    error
  } = useEnhancedWebsiteData(websiteId);

  const {
    sections,
    saving,
    addSection,
    updateSection,
    deleteSection,
    reorderSections,
    setSections
  } = useSectionOperations();

  const [activeTab, setActiveTab] = useState('sections');
  const [copyMode, setCopyMode] = useState<'draft' | 'published'>('draft');
  const { activeSection } = usePreviewInteractions(sections);

  // Sync loaded sections with section operations
  useEffect(() => {
    if (loadedSections && loadedSections.length > 0) {
      setSections(loadedSections);
    }
  }, [loadedSections, setSections]);

  // Auto-create hero section if none exist and website is loaded
  useEffect(() => {
    const createInitialSection = async () => {
      if (!loading && website && sections.length === 0 && !saving) {
        console.log('No sections found, creating default hero section');
        try {
          await addSection(websiteId, 'hero');
        } catch (error) {
          console.error('Failed to create initial section:', error);
        }
      }
    };

    createInitialSection();
  }, [loading, website, sections.length, addSection, websiteId, saving]);

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

  const handleSectionSelect = (sectionId: string) => {
    console.log('Section selected:', sectionId);
  };

  const handleAddSection = (type: Section['type']) => {
    addSection(websiteId, type);
  };

  // Choose the appropriate copy based on mode
  const currentCopy = copyMode === 'published' ? publishedCopy : draftCopy;

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b bg-white dark:bg-gray-900 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {website.name}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Website Builder
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={copyMode === 'published' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCopyMode(copyMode === 'published' ? 'draft' : 'published')}
            >
              {copyMode === 'published' ? 'Published Copy' : 'Draft Copy'}
            </Button>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button size="sm" disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Publish'}
            </Button>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      {(currentCopy || sections.length > 0) && (
        <div className="bg-blue-50 border-b px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="text-blue-700">
                Sections: {sections.length}
              </span>
              <span className="text-blue-700">
                Copy: {currentCopy ? `${copyMode} available` : 'No copy loaded'}
              </span>
            </div>
            {!currentCopy && (
              <span className="text-amber-600">
                Generate copy in the AI Preview to see content
              </span>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1">
        <ResizablePanelGroup direction="horizontal">
          {/* Left Panel - Builder Tools */}
          <ResizablePanel defaultSize={30} minSize={25}>
            <div className="h-full border-r bg-gray-50 dark:bg-gray-900/50">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-3 m-4">
                  <TabsTrigger value="sections" className="text-xs">
                    <Settings className="h-4 w-4 mr-1" />
                    Sections
                  </TabsTrigger>
                  <TabsTrigger value="design" className="text-xs">
                    <Palette className="h-4 w-4 mr-1" />
                    Design
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="text-xs">
                    <Settings className="h-4 w-4 mr-1" />
                    Settings
                  </TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-auto p-4">
                  <TabsContent value="sections" className="space-y-6 mt-0">
                    {/* Current Sections */}
                    {sections.length > 0 && (
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Current Sections
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Manage your website sections
                          </p>
                        </div>
                        
                        <div className="space-y-3">
                          {sections
                            .sort((a, b) => a.position - b.position)
                            .map((section) => (
                              <SectionEditor
                                key={section.id}
                                section={section}
                                onUpdate={updateSection}
                                onDelete={deleteSection}
                                isUpdating={saving}
                                isActive={activeSection === section.id}
                                onScrollTo={() => {}}
                              />
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Section Library */}
                    <SectionLibrary
                      onAddSection={handleAddSection}
                      isAdding={saving}
                    />
                  </TabsContent>

                  <TabsContent value="design" className="mt-0">
                    <Card>
                      <CardHeader>
                        <CardTitle>Design Settings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">
                          Design customization coming soon...
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="settings" className="mt-0">
                    <Card>
                      <CardHeader>
                        <CardTitle>Website Settings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">
                          Advanced settings coming soon...
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
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
