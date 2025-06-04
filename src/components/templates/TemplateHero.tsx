
import { useLanguage } from "@/contexts/LanguageContext";

const TemplateHero = () => {
  const { t } = useLanguage();

  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          {t('templatesTitle')}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          {t('templatesSubtitle')}
        </p>
      </div>
    </section>
  );
};

export default TemplateHero;
