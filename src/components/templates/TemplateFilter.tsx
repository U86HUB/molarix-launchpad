
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { templateCategories } from "@/data/templatesData";

const TemplateFilter = () => {
  const { t } = useLanguage();

  return (
    <section className="py-8 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-4 justify-center">
          {templateCategories.map((category) => (
            <Button
              key={category.name}
              variant={category.key === "allTemplates" ? "default" : "outline"}
              className={`focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
                category.key === "allTemplates" 
                  ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600" 
                  : ""
              }`}
            >
              {t(category.name)} ({category.count})
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TemplateFilter;
