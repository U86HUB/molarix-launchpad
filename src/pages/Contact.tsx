
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    practice: "",
    specialty: "",
    message: ""
  });
  
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate form submission
    toast({
      title: "Message sent!",
      description: "We'll get back to you within 24 hours.",
    });
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      practice: "",
      specialty: "",
      message: ""
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      details: "info@molarix.com",
      description: "For general inquiries"
    },
    {
      icon: Phone,
      title: "Call Us",
      details: "(555) 123-4567",
      description: "Mon-Fri, 9am-5pm ET"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: "123 Healthcare Ave",
      description: "Boston, MA 02110"
    },
    {
      icon: Clock,
      title: "Support Hours",
      details: "24/7 Support",
      description: "Always here to help"
    }
  ];

  const specialties = [
    "General Dentistry",
    "Orthodontics",
    "Pediatric Dentistry",
    "Oral Surgery",
    "General Medical Practice",
    "Cardiology",
    "Dermatology",
    "Other"
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions about Molarix? Our team of healthcare website experts is 
            here to help you get started.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Contact Us
              </h2>
              <p className="text-gray-600 mb-8">
                We'd love to hear from you. Fill out the form and one of our healthcare 
                website specialists will get back to you within 24 hours.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {contactInfo.map((item) => (
                  <Card key={item.title} className="border-none shadow-md">
                    <CardContent className="p-6 flex items-start">
                      <div className="bg-blue-100 p-3 rounded-full mr-4">
                        <item.icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{item.title}</h3>
                        <p className="text-blue-600 font-medium">{item.details}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Send a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name</Label>
                      <Input 
                        id="name" 
                        value={formData.name} 
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Dr. Jane Smith" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="jane@yourpractice.com" 
                        required 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="practice">Practice Name</Label>
                      <Input 
                        id="practice" 
                        value={formData.practice} 
                        onChange={(e) => handleInputChange("practice", e.target.value)}
                        placeholder="Smith Dental Clinic" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialty">Specialty</Label>
                      <Select 
                        value={formData.specialty} 
                        onValueChange={(value) => handleInputChange("specialty", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a specialty" />
                        </SelectTrigger>
                        <SelectContent>
                          {specialties.map((specialty) => (
                            <SelectItem key={specialty} value={specialty}>
                              {specialty}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Your Message</Label>
                    <Textarea 
                      id="message" 
                      value={formData.message} 
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Tell us how we can help you..." 
                      rows={5} 
                      required 
                    />
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Quick answers to common questions about Molarix
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: "How long does it take to set up a website?",
                answer: "Most practices can launch their website in under 10 minutes. Our setup wizard guides you through the entire process, from selecting a template to customizing your content."
              },
              {
                question: "Is Molarix HIPAA compliant?",
                answer: "Yes, all Molarix websites are built with HIPAA compliance in mind. We provide secure hosting, SSL certificates, and privacy-focused features to help you maintain compliance."
              },
              {
                question: "Can I use my own domain name?",
                answer: "Absolutely! You can connect your existing domain or purchase a new one through our platform. We handle all the technical aspects of domain setup for you."
              },
              {
                question: "What kind of support do you offer?",
                answer: "We provide 24/7 customer support via phone, email, and live chat. Our support team includes healthcare website specialists who understand the unique needs of medical and dental practices."
              }
            ].map((faq) => (
              <Card key={faq.question} className="border-none shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
