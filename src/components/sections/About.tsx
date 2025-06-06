
import { SectionMotion } from './SectionMotion';
import { Skeleton } from '@/components/ui/skeleton';

export interface AboutProps {
  heading?: string;
  bodyText?: string;
  imageUrl?: string;
  layoutVariant?: 'left-image' | 'right-image';
}

export function About({
  heading = '',
  bodyText = '',
  imageUrl = '',
  layoutVariant = 'right-image'
}: AboutProps) {
  const hasContent = heading || bodyText;
  const isRightImage = layoutVariant === 'right-image';

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
      <SectionMotion className="container mx-auto px-4">
        <div className={`flex flex-col gap-8 ${isRightImage ? 'md:flex-row' : 'md:flex-row-reverse'} items-center`}>
          <div className="w-full md:w-1/2">
            {hasContent ? (
              <div className="space-y-4">
                {heading && (
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl"
                    style={{ color: 'var(--primary-color)' }}>
                    {heading}
                  </h2>
                )}
                {bodyText && (
                  <div className="prose dark:prose-invert max-w-none">
                    {bodyText.split('\n').map((paragraph, i) => (
                      <p key={i} className="text-gray-700 dark:text-gray-300">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-24 w-full" />
              </div>
            )}
          </div>
          
          <div className="w-full md:w-1/2">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={heading || "About us"} 
                className="w-full h-auto rounded-lg shadow-lg object-cover"
                style={{ maxHeight: '500px' }}
              />
            ) : (
              <Skeleton className="w-full aspect-[4/3] rounded-lg" />
            )}
          </div>
        </div>
      </SectionMotion>
    </section>
  );
}
