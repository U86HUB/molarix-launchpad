
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Palette } from 'lucide-react';
import { Section } from '@/types/website';
import SectionLibrary from './SectionLibrary';
import SectionEditor from './SectionEditor';

interface BuilderToolsPanelProps {
  sections: Section[];
  saving: boolean;
  activeSection: string | null;
  onAddSection: (type: Section['type']) => void;
  onUpdateSection: (sectionId: string, updates: Partial<Section>) => void;
  onDeleteSection: (sectionId: string) => void;
}

const BuilderToolsPanel = ({ 
  sections, 
  saving, 
  activeSection,
  onAddSection, 
  onUpdateSection, 
  onDeleteSection 
}: BuilderToolsPanelProps) => {
  const [activeTab, setActiveTab] = useState('sections');

  return (
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
                        onUpdate={onUpdateSection}
                        onDelete={onDeleteSection}
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
              onAddSection={onAddSection}
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
  );
};

export default BuilderToolsPanel;
