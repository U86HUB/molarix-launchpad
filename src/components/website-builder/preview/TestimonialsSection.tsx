
import { Section } from '@/types/website';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface TestimonialsSectionProps {
  section: Section;
  copy?: any;
}

const TestimonialsSection = ({ section, copy }: TestimonialsSectionProps) => {
  const settings = section.settings;
  
  const title = copy?.title || settings.title || 'What Our Patients Say';
  const testimonials = copy?.testimonials || settings.testimonials || [
    { name: 'Sarah Johnson', review: 'Excellent care and friendly staff!', rating: 5 },
    { name: 'Mike Chen', review: 'Pain-free experience, highly recommend!', rating: 5 }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.slice(0, 2).map((testimonial, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4 italic">
                  "{testimonial.review}"
                </p>
                <p className="font-semibold">- {testimonial.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
