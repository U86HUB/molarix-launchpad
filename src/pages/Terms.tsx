
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Terms = () => {
  const sections = [
    {
      title: "Acceptance of Terms",
      content: [
        "By accessing and using Molarix, you accept and agree to be bound by these Terms of Service",
        "If you do not agree to these terms, you may not use our services",
        "We may update these terms at any time, and continued use constitutes acceptance of any changes",
        "These terms apply to all users, including healthcare professionals and their patients"
      ]
    },
    {
      title: "Service Description",
      content: [
        "Molarix provides website building and hosting services specifically for healthcare practices",
        "Our platform includes templates, customization tools, and compliance features",
        "We offer various subscription plans with different features and limitations",
        "Service availability may vary and we reserve the right to modify or discontinue features"
      ]
    },
    {
      title: "User Responsibilities",
      content: [
        "You are responsible for maintaining the confidentiality of your account credentials",
        "You must provide accurate and current information about your practice",
        "You agree to use our services only for lawful purposes and in compliance with healthcare regulations",
        "You are responsible for all content uploaded to your website through our platform"
      ]
    },
    {
      title: "Healthcare Compliance",
      content: [
        "While Molarix provides HIPAA-compliant infrastructure, you remain responsible for your own compliance",
        "You must ensure all patient data handling meets applicable healthcare regulations",
        "We provide tools and guidance, but compliance responsibility ultimately rests with you",
        "Business Associate Agreements are available for qualifying accounts"
      ]
    },
    {
      title: "Intellectual Property",
      content: [
        "You retain ownership of all content you create and upload using our platform",
        "Molarix retains ownership of our platform, templates, and proprietary technology",
        "You grant us a license to host and display your content as part of providing our services",
        "You may not copy, modify, or distribute our templates or platform technology"
      ]
    },
    {
      title: "Payment Terms",
      content: [
        "Subscription fees are billed in advance on a monthly or annual basis",
        "All fees are non-refundable except as required by law",
        "Price changes will be communicated at least 30 days in advance",
        "Failure to pay may result in service suspension or termination"
      ]
    },
    {
      title: "Service Limitations",
      content: [
        "We strive for 99.9% uptime but cannot guarantee uninterrupted service",
        "We may impose reasonable usage limits to maintain service quality",
        "Some features may be limited based on your subscription plan",
        "We reserve the right to suspend accounts that violate our terms or abuse our services"
      ]
    },
    {
      title: "Termination",
      content: [
        "You may cancel your account at any time through your account settings",
        "We may terminate accounts for violations of these terms or non-payment",
        "Upon termination, you have 30 days to export your data before deletion",
        "Some provisions of these terms survive termination, including privacy and intellectual property clauses"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600">
            Last updated: December 2024
          </p>
          <p className="text-lg text-gray-600 mt-4">
            These Terms of Service govern your use of Molarix, a website building platform 
            designed specifically for healthcare practices.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {sections.map((section) => (
              <Card key={section.title} className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {section.content.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="bg-blue-100 text-blue-600 rounded-full w-2 h-2 mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}

            {/* Disclaimer Section */}
            <Card className="border-none shadow-md bg-yellow-50">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Disclaimer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Molarix provides website building tools and hosting services. We are not responsible for:
                </p>
                <ul className="space-y-2">
                  {[
                    "Medical advice or patient care decisions made through websites built on our platform",
                    "Healthcare compliance violations resulting from improper use of our services",
                    "Third-party integrations or services connected to your website",
                    "Data loss due to user error or failure to maintain backups"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="bg-yellow-600 text-white rounded-full w-2 h-2 mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Contact Section */}
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Questions About These Terms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Email:</strong> legal@molarix.com</p>
                  <p><strong>Address:</strong> 123 Healthcare Ave, Boston, MA 02110</p>
                  <p><strong>Phone:</strong> (555) 123-4567</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Terms;
