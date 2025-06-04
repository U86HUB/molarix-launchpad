
import { Section } from '@/types/website';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Heart, Shield } from 'lucide-react';

interface ServicesSectionProps {
  section: Section;
  copy?: any;
}

const ServicesSection = ({ section, copy }: ServicesSectionProps) => {
  const settings = section.settings;
  
  const title = copy?.title || settings.title || 'Our Services';
  const services = copy?.services || settings.services || [
    { name: 'General Dentistry', description: 'Comprehensive oral health care', icon: Heart },
    { name: 'Preventive Care', description: 'Regular checkups and cleanings', icon: Shield },
    { name: 'Emergency Services', description: '24/7 emergency dental care', icon: Clock }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.slice(0, 3).map((service, index) => {
            const IconComponent = service.icon || Clock;
            return (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div 
                    className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                    style={{ backgroundColor: 'var(--preview-primary, #4f46e5)' }}
                  >
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{service.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
