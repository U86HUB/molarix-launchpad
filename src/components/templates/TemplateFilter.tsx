
import { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TemplateService } from '@/services/templateService';

interface TemplateFilterProps {
  onFilterChange: (filter: string) => void;
  defaultValue?: string;
}

const TemplateFilter = ({ onFilterChange, defaultValue = 'allTemplates' }: TemplateFilterProps) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      const fetchedCategories = await TemplateService.fetchTemplateCategories();
      setCategories(fetchedCategories);
      setIsLoading(false);
    };

    fetchCategories();
  }, []);

  return (
    <div className="mb-8">
      <Tabs defaultValue={defaultValue} onValueChange={onFilterChange}>
        <TabsList className="h-auto flex-wrap">
          <TabsTrigger value="allTemplates" disabled={isLoading}>
            All Templates
          </TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} disabled={isLoading}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default TemplateFilter;
