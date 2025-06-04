
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Award, Target, Globe } from "lucide-react";

const About = () => {
  const stats = [
    { number: "5,000+", label: "Healthcare Professionals" },
    { number: "50+", label: "Professional Templates" },
    { number: "99.9%", label: "Uptime Guarantee" },
    { number: "24/7", label: "Expert Support" }
  ];

  const team = [
    {
      name: "Dr. Amanda Foster",
      role: "Co-Founder & CEO",
      background: "Former practicing dentist with 15 years of clinical experience",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&h=300"
    },
    {
      name: "Michael Rodriguez",
      role: "Co-Founder & CTO",
      background: "Healthcare technology expert with 20+ years in medical software",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&h=300"
    },
    {
      name: "Sarah Chen",
      role: "Head of Design",
      background: "UI/UX specialist focused on healthcare user experience",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b77c?auto=format&fit=crop&w=300&h=300"
    }
  ];

  const values = [
    {
      icon: Users,
      title: "Patient-Centered",
      description: "Every feature we build is designed to improve the patient experience and help healthcare providers connect with those they serve."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We maintain the highest standards in design, security, and compliance to ensure your practice always looks professional."
    },
    {
      icon: Target,
      title: "Results-Driven",
      description: "Our platform is built to help you grow your practice, attract new patients, and streamline your operations."
    },
    {
      icon: Globe,
      title: "Accessibility",
      description: "We believe every healthcare professional should have access to beautiful, functional websites regardless of technical expertise."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Empowering Healthcare Professionals
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're on a mission to make professional, compliant websites accessible 
              to every healthcare practice, regardless of size or technical expertise.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Molarix was born from frustration. As a practicing dentist, Dr. Amanda Foster 
                  struggled to find a website solution that was both professional and compliant 
                  with healthcare regulations. Most options were either too technical, too expensive, 
                  or didn't understand the unique needs of healthcare professionals.
                </p>
                <p>
                  Partnering with healthcare technology veteran Michael Rodriguez, they set out 
                  to create a platform that would eliminate the barriers between healthcare 
                  professionals and effective online presence.
                </p>
                <p>
                  Today, Molarix serves thousands of healthcare professionals worldwide, helping 
                  them focus on what they do best—caring for patients—while we handle their 
                  digital presence.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-xl p-8">
              <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                <span className="text-gray-500">Company Story Image Placeholder</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at Molarix
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <Card key={value.title} className="border-none shadow-lg text-center">
                <CardContent className="p-6">
                  <value.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Healthcare professionals and technology experts working together
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member) => (
              <Card key={member.name} className="border-none shadow-lg text-center">
                <CardContent className="p-6">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {member.background}
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

export default About;
