
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSaveCopy } from "@/hooks/useSaveCopy";
import { GeneratedCopy } from "@/types/copy";
import EditControls from "./EditControls";
import EditableHomepageSection from "./EditableHomepageSection";
import EditableServicesSection from "./EditableServicesSection";
import EditableAboutSection from "./EditableAboutSection";

interface EditableCopyContainerProps {
  generatedCopy: GeneratedCopy;
  sessionId: string;
  onCopyUpdated: (updatedCopy: GeneratedCopy) => void;
}

const EditableCopyContainer = ({ generatedCopy, sessionId, onCopyUpdated }: EditableCopyContainerProps) => {
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

  const updateServicesTitle = (value: string) => {
    setEditedCopy(prev => ({
      ...prev,
      services: {
        ...prev.services,
        title: value
      }
    }));
  };

  const updateServicesIntro = (value: string) => {
    setEditedCopy(prev => ({
      ...prev,
      services: {
        ...prev.services,
        intro: value
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

  const updateAboutTitle = (value: string) => {
    setEditedCopy(prev => ({
      ...prev,
      about: {
        ...prev.about,
        title: value
      }
    }));
  };

  const updateAboutIntro = (value: string) => {
    setEditedCopy(prev => ({
      ...prev,
      about: {
        ...prev.about,
        intro: value
      }
    }));
  };

  const updateAboutMission = (value: string) => {
    setEditedCopy(prev => ({
      ...prev,
      about: {
        ...prev.about,
        mission: value
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
      <EditControls
        isEditing={isEditing}
        loading={loading}
        onEdit={handleEdit}
        onCancel={handleCancel}
        onSave={handleSave}
      />

      <EditableHomepageSection
        homepage={displayCopy.homepage}
        onUpdate={updateHomepage}
        isEditing={isEditing}
      />

      <EditableServicesSection
        services={displayCopy.services}
        onUpdateTitle={updateServicesTitle}
        onUpdateIntro={updateServicesIntro}
        onUpdateService={updateService}
        isEditing={isEditing}
      />

      <EditableAboutSection
        about={displayCopy.about}
        onUpdateTitle={updateAboutTitle}
        onUpdateIntro={updateAboutIntro}
        onUpdateMission={updateAboutMission}
        onUpdateValue={updateValue}
        isEditing={isEditing}
      />
    </div>
  );
};

export default EditableCopyContainer;
