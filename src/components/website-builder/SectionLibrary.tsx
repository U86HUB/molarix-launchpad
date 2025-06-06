
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTemplates } from '@/hooks/useTemplates';
import { LucideIcon, Layout } from "lucide-react";
import * as Icons from "lucide-react";
import { Section } from '@/types/website';

// Function to dynamically get Lucide icon component
const getLucideIcon = (iconName: string): LucideIcon => {
  const IconComponent = Icons[iconName as keyof typeof Icons];
  return (IconComponent && typeof IconComponent === 'function') ? IconComponent as LucideIcon : Layout;
};

interface SectionLibraryProps {
  onAddSection: (type: Section['type']) => void;
  isAdding?: boolean;
}

const SectionLibrary = ({ onAddSection, isAdding = false }: SectionLibraryProps) => {
  const { sectionTemplates, isLoading } = useTemplates();
  
  return (
    <Card className="w-full border-dashed mb-4">
      <CardHeader>
        <CardTitle>Add Section</CardTitle>
        <CardDescription>
          Choose a section type to add to your website
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {isLoading ? (
              <div className="col-span-2 p-4 text-center">
                <div className="animate-pulse text-muted-foreground">Loading section templates...</div>
              </div>
            ) : (
              sectionTemplates.map((section) => {
                const IconComponent = getLucideIcon(section.icon);
                
                return (
                  <Card key={section.type} className="border border-muted">
                    <CardHeader className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                          <IconComponent size={16} />
                        </div>
                        <CardTitle className="text-sm font-medium">{section.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="py-2">
                      <p className="text-xs text-muted-foreground">{section.description}</p>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button 
                        size="sm" 
                        className="w-full" 
                        onClick={() => onAddSection(section.type as Section['type'])}
                        disabled={isAdding}
                      >
                        Add Section
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default SectionLibrary;
