
import { GeneratedCopy } from "@/types/copy";

interface EditableCopyActionsProps {
  setEditedCopy: React.Dispatch<React.SetStateAction<GeneratedCopy>>;
}

export const useEditableCopyActions = ({ setEditedCopy }: EditableCopyActionsProps) => {
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

  return {
    updateHomepage,
    updateServicesTitle,
    updateServicesIntro,
    updateService,
    updateAboutTitle,
    updateAboutIntro,
    updateAboutMission,
    updateValue
  };
};
