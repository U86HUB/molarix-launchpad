
import { SectionMotion } from './SectionMotion';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useRef } from 'react';

export interface BookingProps {
  heading?: string;
  subheading?: string;
  calendlyUrl?: string;
  height?: string;
}

export function Booking({
  heading = 'Book an Appointment',
  subheading = 'Schedule a time that works for you',
  calendlyUrl = '',
  height = '650px'
}: BookingProps) {
  const hasCalendlyUrl = !!calendlyUrl;
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Load Calendly script when component mounts
  useEffect(() => {
    if (!hasCalendlyUrl) return;

    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [hasCalendlyUrl]);

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
      <SectionMotion className="container mx-auto px-4">
        <div className="text-center mb-8">
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

        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border">
          {hasCalendlyUrl ? (
            <div 
              className="calendly-inline-widget" 
              data-url={calendlyUrl}
              style={{ minWidth: '320px', height }}
            >
              <iframe
                ref={iframeRef}
                src={calendlyUrl}
                width="100%"
                height="100%"
                frameBorder="0"
                title="Schedule Appointment"
              ></iframe>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-10 h-96">
              <p className="text-gray-500 dark:text-gray-400 mb-8">No booking calendar configured</p>
              <Skeleton className="h-64 w-full max-w-3xl" />
            </div>
          )}
        </div>
      </SectionMotion>
    </section>
  );
}
