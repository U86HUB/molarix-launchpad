
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Privacy = () => {
  const sections = [
    {
      title: "Information We Collect",
      content: [
        "Personal information you provide when creating an account (name, email, practice details)",
        "Website content and data you upload to your Molarix site",
        "Usage information about how you interact with our platform",
        "Technical information including IP address, browser type, and device information"
      ]
    },
    {
      title: "How We Use Your Information",
      content: [
        "To provide and maintain our website building services",
        "To process payments and manage your subscription", 
        "To communicate with you about your account and our services",
        "To improve our platform and develop new features",
        "To ensure compliance with healthcare regulations"
      ]
    },
    {
      title: "Information Sharing",
      content: [
        "We do not sell, trade, or rent your personal information to third parties",
        "We may share information with trusted service providers who assist in our operations",
        "We may disclose information when required by law or to protect our rights",
        "Patient data on your website remains under your control and HIPAA compliance"
      ]
    },
    {
      title: "Data Security",
      content: [
        "We implement industry-standard security measures to protect your data",
        "All data transmission is encrypted using SSL technology",
        "We regularly monitor and update our security practices",
        "We maintain compliance with healthcare data protection requirements"
      ]
    },
    {
      title: "Your Rights",
      content: [
        "You can access, update, or delete your personal information at any time",
        "You can export your website data and content",
        "You can close your account and request data deletion",
        "You can opt-out of marketing communications while maintaining service communications"
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
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600">
            Last updated: December 2024
          </p>
          <p className="text-lg text-gray-600 mt-4">
            At Molarix, we take your privacy seriously. This Privacy Policy explains how we collect, 
            use, and protect your information when you use our website building platform for healthcare practices.
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

            {/* HIPAA Compliance Section */}
            <Card className="border-none shadow-md bg-blue-50">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  HIPAA Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Molarix is designed with HIPAA compliance in mind for healthcare practices. We provide:
                </p>
                <ul className="space-y-2">
                  {[
                    "Business Associate Agreements (BAA) for qualifying accounts",
                    "Encrypted data transmission and storage",
                    "Access controls and audit logs",
                    "Regular security assessments and updates"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="bg-blue-600 text-white rounded-full w-2 h-2 mt-2 mr-3 flex-shrink-0"></span>
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
                  Contact Us About Privacy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  If you have any questions about this Privacy Policy or how we handle your data, please contact us:
                </p>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Email:</strong> privacy@molarix.com</p>
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

export default Privacy;
