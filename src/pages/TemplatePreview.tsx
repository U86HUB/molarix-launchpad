
import { useNavigate } from "react-router-dom";
import TemplateRenderer from "@/components/preview/TemplateRenderer";
import BreadcrumbNav from "@/components/ui/breadcrumb-nav";
import { FullPageLoader } from "@/components/ui/loading-states";
import TemplatePreviewHeader from "@/components/preview/TemplatePreviewHeader";
import TemplatePreviewEmptyStates from "@/components/preview/TemplatePreviewEmptyStates";
import { useTemplatePreview } from "@/hooks/useTemplatePreview";

const TemplatePreview = () => {
  const navigate = useNavigate();
  const {
    sessionId,
    sessionData,
    selectedTemplate,
    setSelectedTemplate,
    loading,
    copy,
    copyLoading,
    noPublishedCopyFound
  } = useTemplatePreview();

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Template Preview' },
  ];

  if (loading || copyLoading) {
    return <FullPageLoader text="Loading preview..." />;
  }

  // Handle empty states
  if (!sessionData || noPublishedCopyFound) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <BreadcrumbNav items={breadcrumbItems} />
          <TemplatePreviewEmptyStates
            sessionData={sessionData}
            noPublishedCopyFound={noPublishedCopyFound}
            sessionId={sessionId}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <BreadcrumbNav items={breadcrumbItems} />
        
        <TemplatePreviewHeader
          onBack={() => navigate(-1)}
          selectedTemplate={selectedTemplate}
          onTemplateChange={setSelectedTemplate}
        />

        <TemplateRenderer 
          sessionData={sessionData}
          selectedTemplate={selectedTemplate}
          aiCopy={copy}
        />
      </div>
    </div>
  );
};

export default TemplatePreview;
