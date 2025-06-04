
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Calendar, Users, Zap } from "lucide-react";
import { GeneratedCopy } from "@/types/copy";

interface TemplateProps {
  clinicName: string;
  logoUrl: string | null;
  address: string;
  phone: string;
  email: string;
  aiCopy?: GeneratedCopy | null;
}

const TemplateC = ({ clinicName, logoUrl, address, phone, email, aiCopy }: TemplateProps) => {
  // Use AI copy if available, otherwise use default content
  const heroContent = aiCopy?.homepage || {
    headline: "Modern Dental Care",
    subheadline: "Experience the future of dentistry with our innovative approach to oral health care.",
    ctaText: "Get Started"
  };

  const servicesContent = aiCopy?.services || {
    title: "Our Expertise",
    services: [
      { name: "Preventive Care", description: "Regular checkups and cleanings" },
      { name: "Family Dentistry", description: "Comprehensive care for all ages" },
      { name: "Cosmetic Treatments", description: "Transform your smile" }
    ]
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl overflow-hidden">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              {logoUrl ? (
                <img src={logoUrl} alt={clinicName} className="h-10 w-auto mr-3" />
              ) : (
                <div 
                  className="h-10 w-10 rounded mr-3 flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: 'var(--preview-primary, #4f46e5)' }}
                >
                  {clinicName.charAt(0)}
                </div>
              )}
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {clinicName}
              </h1>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm font-medium">Services</a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm font-medium">About</a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm font-medium">Contact</a>
              <Button 
                size="sm" 
                className="text-white"
                style={{ backgroundColor: 'var(--preview-primary, #4f46e5)' }}
              >
                Book Now
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-6xl font-light mb-8 text-gray-900 dark:text-white">
            {heroContent.headline}
          </h2>
          <p className="text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto font-light">
            {heroContent.subheadline}
          </p>
          <Button 
            size="lg" 
            className="text-white px-12 py-4 text-lg font-light rounded-full"
            style={{ backgroundColor: 'var(--preview-primary, #4f46e5)' }}
          >
            {heroContent.ctaText}
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: "5000+", label: "Happy Patients" },
              { number: "15+", label: "Years Experience" },
              { number: "98%", label: "Satisfaction Rate" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div 
                  className="text-5xl font-light mb-2"
                  style={{ color: 'var(--preview-primary, #4f46e5)' }}
                >
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-lg font-light">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-4xl font-light text-center mb-16 text-gray-900 dark:text-white">
            {servicesContent.title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Calendar, ...servicesContent.services[0] },
              { icon: Users, ...servicesContent.services[1] },
              { icon: Zap, ...servicesContent.services[2] }
            ].map((service, index) => (
              <div key={index} className="text-center group">
                <div 
                  className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: 'var(--preview-primary, #4f46e5)' }}
                >
                  <service.icon className="h-12 w-12 text-white" />
                </div>
                <h4 className="text-2xl font-light mb-4 text-gray-900 dark:text-white">{service.name}</h4>
                <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <blockquote className="text-3xl font-light text-gray-900 dark:text-white mb-8 leading-relaxed">
            "The most professional and caring dental team I've ever encountered. 
            They made me feel comfortable throughout the entire process."
          </blockquote>
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full mr-4"></div>
            <div className="text-left">
              <div className="font-medium text-gray-900 dark:text-white">Emma Watson</div>
              <div className="text-gray-600 dark:text-gray-400 font-light">Patient</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h4 className="text-2xl font-light mb-6 text-gray-900 dark:text-white">{clinicName}</h4>
              <p className="text-gray-600 dark:text-gray-400 font-light mb-8 max-w-md">
                {aiCopy?.about?.mission || 
                  "Committed to excellence in dental care through innovation, compassion, and personalized treatment plans."
                }
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400 font-light">{address}</span>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400 font-light">{phone}</span>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400 font-light">{email}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-xl font-light mb-6 text-gray-900 dark:text-white">Schedule</h4>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                  <span className="text-gray-600 dark:text-gray-400 font-light">Monday - Thursday</span>
                  <span className="text-gray-900 dark:text-white font-light">8:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                  <span className="text-gray-600 dark:text-gray-400 font-light">Friday</span>
                  <span className="text-gray-900 dark:text-white font-light">8:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 font-light">Weekend</span>
                  <span className="text-gray-900 dark:text-white font-light">By Appointment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TemplateC;
