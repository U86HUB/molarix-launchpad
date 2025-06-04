
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Globe, 
  Shield, 
  Smartphone, 
  Calendar, 
  Search, 
  MessageCircle,
  CreditCard,
  BarChart,
  Lock,
  Users,
  Clock,
  Heart
} from "lucide-react";

const Features = () => {
  const featureCategories = [
    {
      title: "Design & Templates",
      description: "Beautiful, professional designs built specifically for healthcare",
      features: [
        {
          icon: Globe,
          title: "50+ Professional Templates",
          description: "Carefully crafted templates for dental clinics, medical practices, and specialty clinics.",
          badge: "Popular"
        },
        {
          icon: Smartphone,
          title: "Mobile-First Design",
          description: "All templates are fully responsive and optimized for mobile devices.",
          badge: null
        },
        {
          icon: Heart,
          title: "Healthcare-Focused UI",
          description: "UI elements designed with healthcare user experience in mind.",
          badge: null
        }
      ]
    },
    {
      title: "Compliance & Security",
      description: "Built-in compliance features to meet healthcare regulations",
      features: [
        {
          icon: Shield,
          title: "HIPAA Compliance",
          description: "Automatic compliance with healthcare privacy regulations and secure patient data handling.",
          badge: "Essential"
        },
        {
          icon: Lock,
          title: "SSL Encryption",
          description: "Bank-level security with 256-bit SSL encryption for all websites.",
          badge: null
        },
        {
          icon: Users,
          title: "Access Controls",
          description: "Role-based access controls for staff and administrative users.",
          badge: null
        }
      ]
    },
    {
      title: "Patient Management",
      description: "Streamline patient interactions and appointment scheduling",
      features: [
        {
          icon: Calendar,
          title: "Online Booking",
          description: "Integrated appointment scheduling with automated confirmations and reminders.",
          badge: "Featured"
        },
        {
          icon: MessageCircle,
          title: "Patient Portal",
          description: "Secure patient communication portal for messages, forms, and updates.",
          badge: null
        },
        {
          icon: Clock,
          title: "Automated Reminders",
          description: "SMS and email appointment reminders to reduce no-shows.",
          badge: null
        }
      ]
    },
    {
      title: "Business Growth",
      description: "Tools to help grow your practice and attract new patients",
      features: [
        {
          icon: Search,
          title: "SEO Optimization",
          description: "Built-in SEO tools to help patients find your practice online.",
          badge: null
        },
        {
          icon: BarChart,
          title: "Analytics Dashboard",
          description: "Track website performance, patient inquiries, and appointment bookings.",
          badge: null
        },
        {
          icon: CreditCard,
          title: "Payment Integration",
          description: "Accept online payments and insurance information securely.",
          badge: "New"
        }
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
            Powerful Features for Healthcare Professionals
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to create a professional, compliant, and effective 
            website for your healthcare practice.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {featureCategories.map((category, categoryIndex) => (
            <div key={category.title} className={categoryIndex > 0 ? "mt-20" : ""}>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {category.title}
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {category.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {category.features.map((feature) => (
                  <Card key={feature.title} className="border-none shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <feature.icon className="h-8 w-8 text-blue-600" />
                        {feature.badge && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            {feature.badge}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Additional Benefits */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Molarix?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built specifically for healthcare professionals by industry experts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "No Technical Skills Required",
                description: "Launch your website without any coding or design experience."
              },
              {
                title: "24/7 Expert Support",
                description: "Get help from healthcare website specialists whenever you need it."
              },
              {
                title: "Regular Updates",
                description: "Always stay current with the latest features and security updates."
              },
              {
                title: "Scalable Solutions",
                description: "Grow from a single practice to multiple locations with ease."
              },
              {
                title: "Integration Ready",
                description: "Connect with popular practice management software and tools."
              },
              {
                title: "Performance Optimized",
                description: "Fast-loading websites that provide excellent user experience."
              }
            ].map((benefit) => (
              <div key={benefit.title} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Features;
