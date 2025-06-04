
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Star } from "lucide-react";

const Templates = () => {
  const templateCategories = [
    { name: "All Templates", count: 52 },
    { name: "Dental Clinics", count: 18 },
    { name: "Medical Practices", count: 15 },
    { name: "Specialty Clinics", count: 12 },
    { name: "Pediatric", count: 7 }
  ];

  const templates = [
    {
      id: 1,
      name: "Modern Dental",
      category: "Dental Clinics",
      description: "Clean, professional design perfect for general dental practices",
      image: "template-1-preview",
      badge: "Popular",
      badgeColor: "bg-blue-100 text-blue-800"
    },
    {
      id: 2,
      name: "Medical Center Pro",
      category: "Medical Practices", 
      description: "Comprehensive layout for multi-specialty medical centers",
      image: "template-2-preview",
      badge: "New",
      badgeColor: "bg-green-100 text-green-800"
    },
    {
      id: 3,
      name: "Pediatric Care",
      category: "Pediatric",
      description: "Colorful, friendly design perfect for children's healthcare",
      image: "template-3-preview",
      badge: null,
      badgeColor: ""
    },
    {
      id: 4,
      name: "Orthodontic Specialist",
      category: "Specialty Clinics",
      description: "Sleek design showcasing before/after galleries",
      image: "template-4-preview",
      badge: "Featured",
      badgeColor: "bg-purple-100 text-purple-800"
    },
    {
      id: 5,
      name: "Family Practice",
      category: "Medical Practices",
      description: "Warm, welcoming design for family medicine practices",
      image: "template-5-preview",
      badge: null,
      badgeColor: ""
    },
    {
      id: 6,
      name: "Cosmetic Dentistry",
      category: "Dental Clinics",
      description: "Elegant, high-end design for cosmetic dental practices",
      image: "template-6-preview",
      badge: "Premium",
      badgeColor: "bg-yellow-100 text-yellow-800"
    },
    {
      id: 7,
      name: "Urgent Care",
      category: "Medical Practices",
      description: "Clear, informative layout for urgent care facilities",
      image: "template-7-preview",
      badge: null,
      badgeColor: ""
    },
    {
      id: 8,
      name: "Dermatology Clinic",
      category: "Specialty Clinics",
      description: "Professional design focused on skincare services",
      image: "template-8-preview",
      badge: null,
      badgeColor: ""
    },
    {
      id: 9,
      name: "Cardiology Practice",
      category: "Specialty Clinics",
      description: "Trustworthy design for cardiovascular specialists",
      image: "template-9-preview",
      badge: null,
      badgeColor: ""
    },
    {
      id: 10,
      name: "Mental Health Center",
      category: "Specialty Clinics",
      description: "Calming, supportive design for mental health services",
      image: "template-10-preview",
      badge: "New",
      badgeColor: "bg-green-100 text-green-800"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Professional Healthcare Templates
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our collection of beautiful, responsive templates designed 
            specifically for dental and medical practices.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {templateCategories.map((category) => (
              <Button
                key={category.name}
                variant={category.name === "All Templates" ? "default" : "outline"}
                className={category.name === "All Templates" ? "bg-blue-600 hover:bg-blue-700" : ""}
              >
                {category.name} ({category.count})
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((template) => (
              <Card key={template.id} className="border-none shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                <div className="relative">
                  <div className="bg-gray-200 h-48 flex items-center justify-center">
                    <span className="text-gray-500">{template.image}</span>
                  </div>
                  {template.badge && (
                    <Badge className={`absolute top-4 right-4 ${template.badgeColor}`}>
                      {template.badge}
                    </Badge>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="secondary">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Use Template
                      </Button>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">4.8</span>
                    </div>
                  </div>
                  <p className="text-sm text-blue-600 mb-2">{template.category}</p>
                  <p className="text-gray-600 text-sm">{template.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Every Template Includes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              All our templates come with essential features for healthcare websites
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Mobile Responsive",
                description: "Looks great on all devices"
              },
              {
                title: "HIPAA Compliant",
                description: "Built with privacy in mind"
              },
              {
                title: "SEO Optimized",
                description: "Helps patients find you online"
              },
              {
                title: "Easy Customization",
                description: "No coding skills required"
              }
            ].map((feature) => (
              <Card key={feature.title} className="border-none shadow-md text-center">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
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
            Ready to Choose Your Template?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Start building your professional healthcare website today with any of our templates.
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
            Start Free Trial
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Templates;
