
import { useTemplates } from '@/hooks/useTemplates';
import TemplateCard from './TemplateCard';
import { FullPageLoader } from '@/components/ui/loading-states';
import { useEffect, useState } from 'react';

const TemplateGrid = ({ categoryFilter = 'allTemplates' }: { categoryFilter?: string }) => {
  const { templates, isLoading, error } = useTemplates();
  const [filteredTemplates, setFilteredTemplates] = useState(templates);

  useEffect(() => {
    if (categoryFilter === 'allTemplates') {
      setFilteredTemplates(templates);
    } else {
      setFilteredTemplates(
        templates.filter(template => 
          template.category === categoryFilter || 
          template.tags?.includes(categoryFilter)
        )
      );
    }
  }, [categoryFilter, templates]);

  if (isLoading) {
    return <FullPageLoader text="Loading templates..." />;
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-500">Failed to load templates</p>
      </div>
    );
  }

  if (filteredTemplates.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500 dark:text-gray-400">No templates found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {filteredTemplates.map((template) => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </div>
  );
};

export default TemplateGrid;
