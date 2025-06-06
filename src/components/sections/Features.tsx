
import { SectionMotion } from './SectionMotion';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { Check, Star, Heart, Shield, Clock, Award } from 'lucide-react';

export interface Feature {
  title: string;
  description: string;
  iconName: 'check' | 'star' | 'heart' | 'shield' | 'clock' | 'award' | string;
}

export interface FeaturesProps {
  heading?: string;
  subheading?: string;
  features?: Feature[];
  columns?: 2 | 3 | 4;
  backgroundColor?: string;
}

export function Features({
  heading = 'Our Features',
  subheading = '',
  features = [],
  columns = 3,
  backgroundColor = 'bg-white dark:bg-gray-900'
}: FeaturesProps) {
  const hasFeatures = features && features.length > 0;
  
  const colClass = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
  }[columns];
  
  // Map of icon names to components
  const iconMap: Record<string, React.ReactNode> = {
    check: <Check className="h-6 w-6" />,
    star: <Star className="h-6 w-6" />,
    heart: <Heart className="h-6 w-6" />,
    shield: <Shield className="h-6 w-6" />,
    clock: <Clock className="h-6 w-6" />,
    award: <Award className="h-6 w-6" />,
  };

  // Function to get icon by name
  const getIcon = (iconName: string) => {
    return iconMap[iconName.toLowerCase()] || <Star className="h-6 w-6" />;
  };

  return (
    <section className={`py-16 md:py-24 ${backgroundColor}`}>
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

        {hasFeatures ? (
          <div className={`grid grid-cols-1 gap-8 ${colClass}`}>
            {features.map((feature, index) => (
              <Card key={index} className="p-6 border shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="flex flex-col h-full">
                  <div className="w-12 h-12 mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary"
                    style={{ color: 'var(--primary-color)' }}>
                    {getIcon(feature.iconName)}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 flex-grow">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center p-10 bg-white dark:bg-gray-900 rounded-lg shadow">
            <p className="text-gray-500 dark:text-gray-400">No features configured yet</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6">
                  <Skeleton className="h-12 w-12 rounded-full mb-4" />
                  <Skeleton className="h-6 w-1/2 mb-2" />
                  <Skeleton className="h-20 w-full" />
                </Card>
              ))}
            </div>
          </div>
        )}
      </SectionMotion>
    </section>
  );
}
