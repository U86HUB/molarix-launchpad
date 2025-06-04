
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Clock, Star } from "lucide-react";

interface TemplateProps {
  clinicName: string;
  logoUrl: string | null;
  address: string;
  phone: string;
  email: string;
}

const TemplateA = ({ clinicName, logoUrl, address, phone, email }: TemplateProps) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl overflow-hidden">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              {logoUrl ? (
                <img src={logoUrl} alt={clinicName} className="h-12 w-auto mr-3" />
              ) : (
                <div 
                  className="h-12 w-12 rounded-lg mr-3 flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: 'var(--preview-primary, #4f46e5)' }}
                >
                  {clinicName.charAt(0)}
                </div>
              )}
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {clinicName}
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Home</a>
              <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Services</a>
              <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">About</a>
              <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        className="py-20 px-4 sm:px-6 lg:px-8 text-white"
        style={{ backgroundColor: 'var(--preview-primary, #4f46e5)' }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Welcome to {clinicName}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Providing exceptional dental care with a gentle touch
          </p>
          <Button 
            size="lg" 
            className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3"
            style={{ color: 'var(--preview-primary, #4f46e5)' }}
          >
            Book Appointment
          </Button>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Our Services
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "General Dentistry", desc: "Comprehensive oral health care" },
              { title: "Cosmetic Dentistry", desc: "Enhance your smile's appearance" },
              { title: "Emergency Care", desc: "24/7 emergency dental services" }
            ].map((service, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div 
                    className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                    style={{ backgroundColor: 'var(--preview-primary, #4f46e5)' }}
                  >
                    <Clock className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2">{service.title}</h4>
                  <p className="text-gray-600 dark:text-gray-400">{service.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            What Our Patients Say
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { name: "Sarah Johnson", review: "Excellent care and friendly staff!" },
              { name: "Mike Chen", review: "Pain-free experience, highly recommend!" }
            ].map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">"{testimonial.review}"</p>
                  <p className="font-semibold">- {testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer 
        className="py-12 px-4 sm:px-6 lg:px-8 text-white"
        style={{ backgroundColor: 'var(--preview-primary, #4f46e5)' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4">{clinicName}</h4>
              <p className="opacity-90">Caring for your smile since day one.</p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Contact Info</h4>
              <div className="space-y-2 opacity-90">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{email}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Hours</h4>
              <div className="space-y-1 opacity-90">
                <p>Mon-Fri: 8:00 AM - 6:00 PM</p>
                <p>Saturday: 9:00 AM - 4:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TemplateA;
