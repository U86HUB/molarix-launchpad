
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, Edit, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSaveCopy } from "@/hooks/useSaveCopy";
import { GeneratedCopy } from "@/types/copy";

interface EditableCopyProps {
  generatedCopy: GeneratedCopy;
  sessionId: string;
  onCopyUpdated: (updatedCopy: GeneratedCopy) => void;
}

const EditableCopy = ({ generatedCopy, sessionId, onCopyUpdated }: EditableCopyProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCopy, setEditedCopy] = useState<GeneratedCopy>(generatedCopy);
  const { toast } = useToast();
  const { saveCopy, loading } = useSaveCopy();

  const handleEdit = () => {
    setIsEditing(true);
    setEditedCopy(generatedCopy);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedCopy(generatedCopy);
  };

  const handleSave = async () => {
    const result = await saveCopy(sessionId, editedCopy);
    
    if (result.success) {
      setIsEditing(false);
      onCopyUpdated(editedCopy);
      toast({
        title: "Success",
        description: "Your copy has been saved successfully!",
      });
    }
  };

  const updateHomepage = (field: keyof GeneratedCopy['homepage'], value: string) => {
    setEditedCopy(prev => ({
      ...prev,
      homepage: {
        ...prev.homepage,
        [field]: value
      }
    }));
  };

  const updateServices = (field: keyof GeneratedCopy['services'], value: string | Array<{name: string; description: string}>) => {
    setEditedCopy(prev => ({
      ...prev,
      services: {
        ...prev.services,
        [field]: value
      }
    }));
  };

  const updateService = (index: number, field: 'name' | 'description', value: string) => {
    setEditedCopy(prev => ({
      ...prev,
      services: {
        ...prev.services,
        services: prev.services.services.map((service, i) => 
          i === index ? { ...service, [field]: value } : service
        )
      }
    }));
  };

  const updateAbout = (field: keyof GeneratedCopy['about'], value: string | Array<{name: string; description: string}>) => {
    setEditedCopy(prev => ({
      ...prev,
      about: {
        ...prev.about,
        [field]: value
      }
    }));
  };

  const updateValue = (index: number, field: 'name' | 'description', value: string) => {
    setEditedCopy(prev => ({
      ...prev,
      about: {
        ...prev.about,
        values: prev.about.values.map((val, i) => 
          i === index ? { ...val, [field]: value } : val
        )
      }
    }));
  };

  const displayCopy = isEditing ? editedCopy : generatedCopy;

  return (
    <div className="space-y-8">
      {/* Header with Edit Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your AI-Generated Copy</CardTitle>
              <CardDescription>
                {isEditing ? "Make changes to your copy and save when ready" : "Click edit to modify your content"}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {!isEditing ? (
                <Button onClick={handleEdit} variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Copy
                </Button>
              ) : (
                <>
                  <Button onClick={handleCancel} variant="outline">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Homepage Copy Section */}
      <Card>
        <CardHeader>
          <CardTitle>Homepage Copy</CardTitle>
          <CardDescription>Main homepage content and hero section</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Headline</label>
            {isEditing ? (
              <Input
                value={displayCopy.homepage.headline}
                onChange={(e) => updateHomepage('headline', e.target.value)}
                placeholder="Enter your main headline"
              />
            ) : (
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {displayCopy.homepage.headline}
                </h2>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Subheadline</label>
            {isEditing ? (
              <Textarea
                value={displayCopy.homepage.subheadline}
                onChange={(e) => updateHomepage('subheadline', e.target.value)}
                placeholder="Enter your subheadline"
                rows={2}
              />
            ) : (
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  {displayCopy.homepage.subheadline}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Welcome Message</label>
            {isEditing ? (
              <Textarea
                value={displayCopy.homepage.welcomeMessage}
                onChange={(e) => updateHomepage('welcomeMessage', e.target.value)}
                placeholder="Enter your welcome message"
                rows={3}
              />
            ) : (
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-gray-800 dark:text-gray-200">
                  {displayCopy.homepage.welcomeMessage}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Call-to-Action Text</label>
            {isEditing ? (
              <Input
                value={displayCopy.homepage.ctaText}
                onChange={(e) => updateHomepage('ctaText', e.target.value)}
                placeholder="Enter your CTA text"
              />
            ) : (
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Button size="lg" className="font-semibold">
                  {displayCopy.homepage.ctaText}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Services Copy Section */}
      <Card>
        <CardHeader>
          <CardTitle>Services Copy</CardTitle>
          <CardDescription>Services section content and offerings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Services Title</label>
            {isEditing ? (
              <Input
                value={displayCopy.services.title}
                onChange={(e) => updateServices('title', e.target.value)}
                placeholder="Enter services section title"
              />
            ) : (
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {displayCopy.services.title}
                </h2>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Services Introduction</label>
            {isEditing ? (
              <Textarea
                value={displayCopy.services.intro}
                onChange={(e) => updateServices('intro', e.target.value)}
                placeholder="Enter services introduction"
                rows={3}
              />
            ) : (
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-gray-800 dark:text-gray-200">
                  {displayCopy.services.intro}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium">Individual Services</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayCopy.services.services.map((service, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500">Service Name</label>
                    {isEditing ? (
                      <Input
                        value={service.name}
                        onChange={(e) => updateService(index, 'name', e.target.value)}
                        placeholder="Service name"
                      />
                    ) : (
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {service.name}
                      </h4>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500">Service Description</label>
                    {isEditing ? (
                      <Textarea
                        value={service.description}
                        onChange={(e) => updateService(index, 'description', e.target.value)}
                        placeholder="Service description"
                        rows={3}
                      />
                    ) : (
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {service.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About Copy Section */}
      <Card>
        <CardHeader>
          <CardTitle>About Copy</CardTitle>
          <CardDescription>About section content and practice values</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">About Title</label>
            {isEditing ? (
              <Input
                value={displayCopy.about.title}
                onChange={(e) => updateAbout('title', e.target.value)}
                placeholder="Enter about section title"
              />
            ) : (
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {displayCopy.about.title}
                </h2>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">About Introduction</label>
            {isEditing ? (
              <Textarea
                value={displayCopy.about.intro}
                onChange={(e) => updateAbout('intro', e.target.value)}
                placeholder="Enter about introduction"
                rows={3}
              />
            ) : (
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-gray-800 dark:text-gray-200">
                  {displayCopy.about.intro}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Mission Statement</label>
            {isEditing ? (
              <Textarea
                value={displayCopy.about.mission}
                onChange={(e) => updateAbout('mission', e.target.value)}
                placeholder="Enter mission statement"
                rows={3}
              />
            ) : (
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-gray-800 dark:text-gray-200 italic">
                  {displayCopy.about.mission}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium">Core Values</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {displayCopy.about.values.map((value, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500">Value Name</label>
                    {isEditing ? (
                      <Input
                        value={value.name}
                        onChange={(e) => updateValue(index, 'name', e.target.value)}
                        placeholder="Value name"
                      />
                    ) : (
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {value.name}
                      </h4>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500">Value Description</label>
                    {isEditing ? (
                      <Textarea
                        value={value.description}
                        onChange={(e) => updateValue(index, 'description', e.target.value)}
                        placeholder="Value description"
                        rows={3}
                      />
                    ) : (
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {value.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditableCopy;
