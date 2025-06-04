
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const TemplateCTA = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-blue-600 dark:bg-blue-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {t('readyToChoose')}
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          {t('readyToChooseDesc')}
        </p>
        <Button size="lg" variant="secondary" className="text-lg px-8 py-3 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-blue-700">
          {t('startFreeTrial')}
        </Button>
      </div>
    </section>
  );
};

export default TemplateCTA;
