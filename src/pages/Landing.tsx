
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Globe, Shield, Zap, Users, Star } from "lucide-react";

const Landing = () => {
  const features = [
    {
      icon: Globe,
      title: "Professional Templates",
      description: "Choose from dozens of beautiful, clinic-specific templates designed by healthcare professionals."
    },
    {
      icon: Shield,
      title: "HIPAA Compliant",
      description: "Built-in compliance features ensure your website meets all healthcare regulatory requirements."
    },
    {
      icon: Zap,
      title: "Launch in Minutes",
      description: "Go from signup to live website in under 10 minutes with our intuitive setup process."
    },
    {
      icon: Users,
      title: "Patient Management",
      description: "Integrated appointment booking, patient portals, and communication tools."
    }
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      practice: "Smile Dental Care",
      content: "Molarix helped us launch our website in just one afternoon. Our patient bookings increased by 40% in the first month!",
      rating: 5
    },
    {
      name: "Dr. Michael Chen",
      practice: "Downtown Medical",
      content: "The compliance features gave us peace of mind, and the templates are absolutely beautiful. Highly recommended.",
      rating: 5
    },
    {
      name: "Dr. Emily Rodriguez",
      practice: "Pediatric Plus",
      content: "Easy to use, professional results. Our patients love the new online booking system.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Beautiful Websites for
              <span className="text-blue-600 block">Healthcare Professionals</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Launch a fully compliant, professional website for your dental or medical clinic in minutes. 
              No technical skills required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
                Start Free Trial
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                View Templates
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              14-day free trial • No credit card required • HIPAA compliant
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything Your Practice Needs
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From stunning designs to powerful functionality, we've built everything 
              healthcare professionals need to succeed online.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <feature.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Healthcare Professionals Choose Molarix
              </h2>
              <div className="space-y-4">
                {[
                  "Launch in under 10 minutes with zero technical knowledge",
                  "HIPAA compliant hosting and security built-in",
                  "Mobile-responsive designs that look great on any device",
                  "Integrated appointment booking and patient management",
                  "SEO optimized to help patients find your practice",
                  "24/7 support from healthcare website experts"
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-xl p-8">
              <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                <span className="text-gray-500">Demo Preview Placeholder</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Healthcare Professionals
            </h2>
            <p className="text-xl text-gray-600">
              See what doctors and clinic owners are saying about Molarix
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="border-none shadow-lg">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.practice}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Practice?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of healthcare professionals who've already launched their 
            professional websites with Molarix.
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
            Start Your Free Trial
          </Button>
          <p className="text-sm text-blue-200 mt-4">
            No credit card required • Full access for 14 days
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
