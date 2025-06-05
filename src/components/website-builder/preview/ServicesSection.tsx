
import { Section } from '@/types/website';
import { Card, CardContent } from '@/components/ui/card';

interface ServicesSectionProps {
  section: Section;
  copy?: any;
}

const ServicesSection = ({ section, copy }: ServicesSectionProps) => {
  const settings = section.settings;
  
  const title = copy?.title || settings.title || 'Our Services';
  const intro = copy?.intro || settings.intro || 'We offer comprehensive dental care services.';
  const services = copy?.services || settings.services || [
    { name: 'General Dentistry', description: 'Comprehensive oral health care' },
    { name: 'Cosmetic Dentistry', description: 'Enhance your smile' },
    { name: 'Orthodontics', description: 'Straighten your teeth' }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            {title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {intro}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service: any, index: number) => (
            <Card key={index}>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  {service.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
