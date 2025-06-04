
import { Section } from '@/types/website';
import { Card, CardContent } from '@/components/ui/card';

interface AboutSectionProps {
  section: Section;
  copy?: any;
}

const AboutSection = ({ section, copy }: AboutSectionProps) => {
  const settings = section.settings;
  
  const title = copy?.title || settings.title || 'About Our Practice';
  const content = copy?.mission || copy?.description || settings.content || 
    'We are dedicated to providing exceptional dental care in a comfortable, state-of-the-art environment. Our experienced team is committed to helping you achieve optimal oral health.';

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          {title}
        </h2>
        <Card>
          <CardContent className="p-8">
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              {content}
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AboutSection;
