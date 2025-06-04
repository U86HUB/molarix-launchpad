
import { Section } from '@/types/website';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Award, Users } from 'lucide-react';

interface FeaturesSectionProps {
  section: Section;
  copy?: any;
}

const FeaturesSection = ({ section, copy }: FeaturesSectionProps) => {
  const settings = section.settings;
  
  const title = copy?.title || settings.title || 'Why Choose Us';
  const features = copy?.features || settings.features || [
    { name: 'Quality Care', description: 'Highest standards of dental care', icon: Award },
    { name: 'Experienced Team', description: 'Skilled professionals you can trust', icon: Users },
    { name: 'Modern Technology', description: 'State-of-the-art equipment', icon: CheckCircle }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.slice(0, 3).map((feature, index) => {
            const IconComponent = feature.icon || CheckCircle;
            return (
              <Card key={index} className="text-center border-0 shadow-lg">
                <CardContent className="p-6">
                  <div 
                    className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                    style={{ backgroundColor: 'var(--preview-primary, #4f46e5)' }}
                  >
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
