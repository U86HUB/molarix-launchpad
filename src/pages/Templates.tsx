
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TemplateHero from "@/components/templates/TemplateHero";
import TemplateFilter from "@/components/templates/TemplateFilter";
import TemplateGrid from "@/components/templates/TemplateGrid";
import TemplateFeatures from "@/components/templates/TemplateFeatures";
import TemplateCTA from "@/components/templates/TemplateCTA";

const Templates = () => {
  const [selectedCategory, setSelectedCategory] = useState('allTemplates');

  const handleFilterChange = (filter: string) => {
    setSelectedCategory(filter);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <TemplateHero />
      <TemplateFilter onFilterChange={handleFilterChange} defaultValue={selectedCategory} />
      <TemplateGrid categoryFilter={selectedCategory} />
      <TemplateFeatures />
      <TemplateCTA />
      <Footer />
    </div>
  );
};

export default Templates;
