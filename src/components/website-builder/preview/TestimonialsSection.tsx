
import { Section } from '@/types/website';
import { Card, CardContent } from '@/components/ui/card';

interface TestimonialsSectionProps {
  section: Section;
  copy?: any;
}

const TestimonialsSection = ({ section, copy }: TestimonialsSectionProps) => {
  const settings = section.settings;
  
  const title = copy?.title || settings.title || 'What Our Patients Say';
  const testimonials = copy?.testimonials || settings.testimonials || [
    {
      name: 'Sarah Johnson',
      content: 'Excellent care and friendly staff. Highly recommended!',
      rating: 5
    },
    {
      name: 'Mike Chen',
      content: 'Professional service and state-of-the-art facilities.',
      rating: 5
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            {title}
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial: any, index: number) => (
            <Card key={index}>
              <CardContent className="p-6">
                <p className="text-gray-600 dark:text-gray-300 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </p>
                  <div className="flex text-yellow-400">
                    {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
