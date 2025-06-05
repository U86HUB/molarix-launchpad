
import { Section } from '@/types/website';
import { Card, CardContent } from '@/components/ui/card';

interface FeaturesSectionProps {
  section: Section;
  copy?: any;
}

const FeaturesSection = ({ section, copy }: FeaturesSectionProps) => {
  const settings = section.settings;
  
  const title = copy?.title || settings.title || 'Why Choose Us';
  const features = copy?.features || settings.features || [
    {
      title: 'Expert Care',
      description: 'Years of experience in dental care',
      icon: '🦷'
    },
    {
      title: 'Modern Technology',
      description: 'State-of-the-art equipment and techniques',
      icon: '⚡'
    },
    {
      title: 'Comfortable Environment',
      description: 'Relaxing and welcoming atmosphere',
      icon: '😊'
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            {title}
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature: any, index: number) => (
            <Card key={index}>
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
