
import { SectionMotion } from './SectionMotion';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

export interface Testimonial {
  quote: string;
  authorName: string;
  authorRole?: string;
  authorImage?: string;
  rating?: number;
}

export interface TestimonialsProps {
  heading?: string;
  subheading?: string;
  testimonials?: Testimonial[];
  backgroundColor?: string;
}

export function Testimonials({
  heading = 'What Our Patients Say',
  subheading = '',
  testimonials = [],
  backgroundColor = 'bg-white dark:bg-gray-900'
}: TestimonialsProps) {
  const hasTestimonials = testimonials && testimonials.length > 0;

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

        {hasTestimonials ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  {testimonial.rating && (
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          xmlns="http://www.w3.org/2000/svg" 
                          className={`h-5 w-5 ${i < testimonial.rating! ? 'text-yellow-400' : 'text-gray-300'}`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  )}
                  <p className="text-gray-700 dark:text-gray-300 italic mb-4">&quot;{testimonial.quote}&quot;</p>
                </CardContent>
                <CardFooter className="border-t pt-4 flex items-center">
                  {testimonial.authorImage && (
                    <div className="mr-4">
                      <img 
                        src={testimonial.authorImage} 
                        alt={testimonial.authorName}
                        className="h-10 w-10 rounded-full object-cover" 
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">{testimonial.authorName}</p>
                    {testimonial.authorRole && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.authorRole}</p>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center p-10 bg-white dark:bg-gray-900 rounded-lg shadow">
            <p className="text-gray-500 dark:text-gray-400">No testimonials available</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-24 w-full" />
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <Skeleton className="h-10 w-10 rounded-full mr-2" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
      </SectionMotion>
    </section>
  );
}
