
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TemplateHero from "@/components/templates/TemplateHero";
import TemplateFilter from "@/components/templates/TemplateFilter";
import TemplateGrid from "@/components/templates/TemplateGrid";
import TemplateFeatures from "@/components/templates/TemplateFeatures";
import TemplateCTA from "@/components/templates/TemplateCTA";

const Templates = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <TemplateHero />
      <TemplateFilter />
      <TemplateGrid />
      <TemplateFeatures />
      <TemplateCTA />
      <Footer />
    </div>
  );
};

export default Templates;
