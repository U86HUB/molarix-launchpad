
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      step: "01",
      title: "Choose Your Template",
      description: "Browse our collection of professionally designed templates specifically created for dental and medical practices. Each template is fully customizable and mobile-responsive.",
      features: [
        "50+ healthcare-specific templates",
        "Preview before you choose",
        "Industry-specific layouts"
      ]
    },
    {
      step: "02", 
      title: "Customize Your Content",
      description: "Use our intuitive editor to add your practice information, services, team photos, and contact details. No coding skills required - just point, click, and type.",
      features: [
        "Drag-and-drop editor",
        "Upload your photos and content",
        "Real-time preview"
      ]
    },
    {
      step: "03",
      title: "Configure Features",
      description: "Set up appointment booking, patient forms, contact information, and other interactive features that help your practice run smoothly.",
      features: [
        "Online appointment scheduling",
        "Patient portal integration",
        "Contact forms and maps"
      ]
    },
    {
      step: "04",
      title: "Launch Your Site",
      description: "Review your website, connect your domain, and publish. Your professional healthcare website is now live and ready to attract new patients.",
      features: [
        "One-click publishing",
        "Custom domain connection",
        "SSL security included"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How Molarix Works
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get your professional healthcare website up and running in just 4 simple steps. 
            No technical expertise needed.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {steps.map((step, index) => (
              <div key={step.step} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <div className="flex items-center mb-4">
                    <span className="bg-blue-600 text-white text-lg font-bold w-12 h-12 rounded-full flex items-center justify-center mr-4">
                      {step.step}
                    </span>
                    <h2 className="text-3xl font-bold text-gray-900">{step.title}</h2>
                  </div>
                  <p className="text-lg text-gray-600 mb-6">
                    {step.description}
                  </p>
                  <div className="space-y-3">
                    {step.features.map((feature) => (
                      <div key={feature} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={`bg-gray-100 rounded-lg shadow-xl p-8 ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                  <div className="bg-white rounded-lg h-64 flex items-center justify-center">
                    <span className="text-gray-500">Step {step.step} Demo Preview</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              From Signup to Launch
            </h2>
            <p className="text-xl text-gray-600">
              Most practices launch their website in under 10 minutes
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-blue-200"></div>
            
            <div className="space-y-8">
              {[
                { time: "0 min", title: "Sign up and select template", description: "Browse templates and create your account" },
                { time: "3 min", title: "Add your practice details", description: "Upload logo, add contact info and services" },
                { time: "7 min", title: "Customize design and content", description: "Personalize colors, fonts, and layout" },
                { time: "10 min", title: "Review and publish", description: "Your website is live and ready for patients" }
              ].map((item, index) => (
                <div key={index} className="relative flex items-center">
                  <div className="flex-1 text-right pr-8">
                    <div className="text-sm font-medium text-blue-600">{item.time}</div>
                    <div className="text-lg font-semibold text-gray-900">{item.title}</div>
                    <div className="text-gray-600">{item.description}</div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white"></div>
                  <div className="flex-1 pl-8"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of healthcare professionals who've launched their websites with Molarix.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-blue-600">
              View Templates
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowItWorks;
