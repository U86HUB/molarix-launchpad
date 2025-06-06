
import { Button } from '@/components/ui/button';
import { SectionMotion } from './SectionMotion';
import { Skeleton } from '@/components/ui/skeleton';

export interface HeroProps {
  siteName?: string;
  tagline?: string;
  backgroundImageUrl?: string;
  primaryColor?: string;
  ctaText?: string;
  ctaLink?: string;
}

export function Hero({
  siteName = '',
  tagline = '',
  backgroundImageUrl = '',
  primaryColor = 'var(--primary)',
  ctaText = 'Book Appointment',
  ctaLink = '#contact'
}: HeroProps) {
  const hasContent = siteName || tagline;

  return (
    <section className="relative w-full overflow-hidden">
      <SectionMotion className="relative w-full">
        {backgroundImageUrl ? (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
            style={{ 
              backgroundImage: `url(${backgroundImageUrl})`,
              backgroundColor: primaryColor,
              opacity: 0.2
            }}
          />
        ) : (
          <div 
            className="absolute inset-0" 
            style={{ backgroundColor: primaryColor, opacity: 0.1 }}
          />
        )}
        
        <div className="container relative z-10 mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl">
            {hasContent ? (
              <>
                {siteName && (
                  <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl" 
                    style={{ color: `var(--primary-color, ${primaryColor})` }}>
                    {siteName}
                  </h1>
                )}
                {tagline && (
                  <p className="mb-8 text-lg text-gray-700 dark:text-gray-300 md:text-xl">
                    {tagline}
                  </p>
                )}
                <Button asChild size="lg">
                  <a href={ctaLink}>{ctaText}</a>
                </Button>
              </>
            ) : (
              <div className="space-y-4">
                <Skeleton className="h-14 w-3/4" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-10 w-40" />
              </div>
            )}
          </div>
        </div>
      </SectionMotion>
    </section>
  );
}
