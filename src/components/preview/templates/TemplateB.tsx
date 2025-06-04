
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Shield, Heart, Award } from "lucide-react";
import { GeneratedCopy } from "@/types/copy";

interface TemplateProps {
  clinicName: string;
  logoUrl: string | null;
  address: string;
  phone: string;
  email: string;
  aiCopy?: GeneratedCopy | null;
}

const TemplateB = ({ clinicName, logoUrl, address, phone, email, aiCopy }: TemplateProps) => {
  // Use AI copy if available, otherwise use default content
  const heroContent = aiCopy?.homepage || {
    headline: "Your Smile is Our Priority",
    subheadline: "Experience personalized dental care in a comfortable, state-of-the-art environment designed for your well-being.",
    ctaText: "Schedule Consultation"
  };

  const servicesContent = aiCopy?.services || {
    title: `Why Choose ${clinicName}?`,
    services: [
      { name: "Advanced Technology", description: "State-of-the-art equipment for precise treatment" },
      { name: "Gentle Care", description: "Comfortable experience with pain-free procedures" },
      { name: "Expert Team", description: "Highly qualified professionals with years of experience" }
    ]
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl overflow-hidden">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              {logoUrl ? (
                <img src={logoUrl} alt={clinicName} className="h-14 w-auto mr-4" />
              ) : (
                <div 
                  className="h-14 w-14 rounded-full mr-4 flex items-center justify-center text-white font-bold text-xl shadow-lg"
                  style={{ backgroundColor: 'var(--preview-primary, #4f46e5)' }}
                >
                  {clinicName.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {clinicName}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Excellence in Dental Care</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <span 
                className="px-4 py-2 rounded-full text-sm font-medium text-white"
                style={{ backgroundColor: 'var(--preview-primary, #4f46e5)' }}
              >
                Call: {phone}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white leading-tight">
                {heroContent.headline.includes('Priority') ? (
                  <>
                    Your Smile is Our <span style={{ color: 'var(--preview-primary, #4f46e5)' }}>Priority</span>
                  </>
                ) : (
                  heroContent.headline
                )}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                {heroContent.subheadline}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="text-white px-8 py-3"
                  style={{ backgroundColor: 'var(--preview-primary, #4f46e5)' }}
                >
                  {heroContent.ctaText}
                </Button>
                <Button variant="outline" size="lg" className="px-8 py-3">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-2xl flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400 text-lg">Dental Office Image</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              {servicesContent.title}
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {aiCopy?.services?.intro || "We're committed to providing exceptional care with modern technology"}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, ...servicesContent.services[0] },
              { icon: Heart, ...servicesContent.services[1] },
              { icon: Award, ...servicesContent.services[2] }
            ].map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8 text-center">
                  <div 
                    className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                    style={{ backgroundColor: 'var(--preview-primary, #4f46e5)' }}
                  >
                    <feature.icon className="h-10 w-10 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{feature.name}</h4>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="py-20 px-4 sm:px-6 lg:px-8 text-white"
        style={{ backgroundColor: 'var(--preview-primary, #4f46e5)' }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-bold mb-6">Ready to Transform Your Smile?</h3>
          <p className="text-xl mb-8 opacity-90">
            Schedule your consultation today and discover the difference quality dental care makes.
          </p>
          <Button 
            size="lg" 
            className="bg-white hover:bg-gray-100 px-8 py-3 text-lg"
            style={{ color: 'var(--preview-primary, #4f46e5)' }}
          >
            Book Your Appointment
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h4 className="text-2xl font-bold mb-4">{clinicName}</h4>
              <p className="text-gray-400 mb-6 max-w-md">
                {aiCopy?.about?.mission || 
                  "Dedicated to providing exceptional dental care with a personal touch. Your oral health is our commitment."
                }
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>{address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 flex-shrink-0" />
                  <span>{phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 flex-shrink-0" />
                  <span>{email}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Office Hours</h4>
              <div className="space-y-2 text-gray-400">
                <div className="flex justify-between">
                  <span>Mon-Thu:</span>
                  <span>8AM-6PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Friday:</span>
                  <span>8AM-4PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Weekend:</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TemplateB;
