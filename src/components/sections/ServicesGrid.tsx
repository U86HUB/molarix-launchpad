
import { SectionMotion } from './SectionMotion';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface Service {
  name: string;
  description: string;
  iconUrl?: string;
}

export interface ServicesGridProps {
  heading?: string;
  subheading?: string;
  services?: Service[];
  columns?: 2 | 3 | 4;
}

export function ServicesGrid({
  heading = 'Our Services',
  subheading = '',
  services = [],
  columns = 3
}: ServicesGridProps) {
  const hasServices = services && services.length > 0;
  const colClass = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
  }[columns];

  return (
    <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
      <SectionMotion className="container mx-auto px-4">
        <div className="text-center mb-12">
          {heading && (
            <h2 className="text-3xl font-bold mb-4"
              style={{ color: 'var(--primary-color)' }}>
              {heading}
            </h2>
          )}
          {subheading && (
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {subheading}
            </p>
          )}
        </div>

        {hasServices ? (
          <div className={`grid grid-cols-1 gap-6 ${colClass}`}>
            {services.map((service, index) => (
              <Card key={index} className="border bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  {service.iconUrl && (
                    <div className="mb-4 flex justify-center md:justify-start">
                      <img 
                        src={service.iconUrl} 
                        alt={service.name} 
                        className="h-12 w-12 object-contain"
                      />
                    </div>
                  )}
                  <CardTitle className="text-xl font-semibold">{service.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center p-10 bg-white dark:bg-gray-900 rounded-lg shadow">
            <p className="text-gray-500 dark:text-gray-400">No services configured yet</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-10 w-10 rounded-full mb-2" />
                    <Skeleton className="h-6 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </SectionMotion>
    </section>
  );
}
