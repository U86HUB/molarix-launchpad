
import { Section } from '@/types/website';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ContactSectionProps {
  section: Section;
  copy?: any;
}

const ContactSection = ({ section, copy }: ContactSectionProps) => {
  const settings = section.settings;
  
  const title = copy?.title || settings.title || 'Contact Us';
  const content = copy?.description || settings.content || 
    'Get in touch with us to schedule an appointment or ask any questions.';
  const phone = copy?.phone || settings.phone || '(555) 123-4567';
  const email = copy?.email || settings.email || 'info@clinic.com';

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            {title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {content}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Contact Information
              </h3>
              <div className="space-y-3">
                <p className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="font-medium mr-2">Phone:</span>
                  {phone}
                </p>
                <p className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="font-medium mr-2">Email:</span>
                  {email}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Get in Touch
              </h3>
              <Button className="w-full">
                Schedule Appointment
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
