
import { useLanguage } from "@/contexts/LanguageContext";
import { templates } from "@/data/templatesData";
import TemplateCard from "./TemplateCard";

const TemplateGrid = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TemplateGrid;
