
import { useEffect } from "react";
import TemplateA from "./templates/TemplateA";
import TemplateB from "./templates/TemplateB";
import TemplateC from "./templates/TemplateC";

interface OnboardingSession {
  id: string;
  clinic_name: string;
  address: string;
  phone: string;
  email: string;
  logo_url: string | null;
  primary_color: string;
  font_style: string;
  selected_template: string;
}

interface TemplateRendererProps {
  sessionData: OnboardingSession;
  selectedTemplate: string;
}

const TemplateRenderer = ({ sessionData, selectedTemplate }: TemplateRendererProps) => {
  useEffect(() => {
    // Apply dynamic CSS variables for the selected colors and fonts
    const root = document.documentElement;
    
    // Apply primary color
    if (sessionData.primary_color) {
      root.style.setProperty('--preview-primary', sessionData.primary_color);
    }

    // Apply font family
    if (sessionData.font_style && sessionData.font_style !== 'default') {
      root.style.setProperty('--preview-font', sessionData.font_style);
    } else {
      root.style.setProperty('--preview-font', 'Inter, system-ui, sans-serif');
    }

    return () => {
      // Cleanup: remove the custom CSS properties
      root.style.removeProperty('--preview-primary');
      root.style.removeProperty('--preview-font');
    };
  }, [sessionData.primary_color, sessionData.font_style]);

  const renderTemplate = () => {
    const commonProps = {
      clinicName: sessionData.clinic_name || "Your Clinic Name",
      logoUrl: sessionData.logo_url,
      address: sessionData.address || "123 Main St, City, State",
      phone: sessionData.phone || "(555) 123-4567",
      email: sessionData.email || "info@clinic.com",
    };

    switch (selectedTemplate) {
      case "template-b":
        return <TemplateB {...commonProps} />;
      case "template-c":
        return <TemplateC {...commonProps} />;
      default:
        return <TemplateA {...commonProps} />;
    }
  };

  return (
    <div 
      className="preview-container" 
      style={{
        fontFamily: 'var(--preview-font)',
        color: 'inherit'
      }}
    >
      {renderTemplate()}
    </div>
  );
};

export default TemplateRenderer;
