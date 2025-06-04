import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Templates = () => {
  const { t } = useLanguage();
  
  const templateCategories = [
    { name: t('allTemplates'), count: 8, key: 'allTemplates' },
    { name: t('dentalClinics'), count: 3, key: 'dentalClinics' },
    { name: t('medicalPractices'), count: 3, key: 'medicalPractices' },
    { name: t('specialtyClinics'), count: 2, key: 'specialtyClinics' }
  ];

  const templates = [
    {
      id: 1,
      name: t('modernDental'),
      category: t('dentalClinics'),
      description: t('modernDentalDesc'),
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop&crop=center",
      badge: t('popular'),
      badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    },
    {
      id: 2,
      name: t('medicalCenterPro'),
      category: t('medicalPractices'), 
      description: t('medicalCenterProDesc'),
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop&crop=center",
      badge: t('new'),
      badgeColor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    },
    {
      id: 3,
      name: t('pediatricCare'),
      category: t('dentalClinics'),
      description: t('pediatricCareDesc'),
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop&crop=center",
      badge: null,
      badgeColor: ""
    },
    {
      id: 4,
      name: t('orthodonticSpecialist'),
      category: t('specialtyClinics'),
      description: t('orthodonticSpecialistDesc'),
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop&crop=center",
      badge: t('featured'),
      badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
    },
    {
      id: 5,
      name: t('familyPractice'),
      category: t('medicalPractices'),
      description: t('familyPracticeDesc'),
      image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=300&fit=crop&crop=center",
      badge: null,
      badgeColor: ""
    },
    {
      id: 6,
      name: t('cosmeticDentistry'),
      category: t('dentalClinics'),
      description: t('cosmeticDentistryDesc'),
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=300&fit=crop&crop=center",
      badge: t('premium'),
      badgeColor: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    },
    {
      id: 7,
      name: t('urgentCare'),
      category: t('medicalPractices'),
      description: t('urgentCareDesc'),
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop&crop=center",
      badge: null,
      badgeColor: ""
    },
    {
      id: 8,
      name: t('dermatologyClinic'),
      category: t('specialtyClinics'),
      description: t('dermatologyClinicDesc'),
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop&crop=center",
      badge: null,
      badgeColor: ""
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {t('templatesTitle')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('templatesSubtitle')}
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {templateCategories.map((category) => (
              <Button
                key={category.name}
                variant={category.key === "allTemplates" ? "default" : "outline"}
                className={`focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
                  category.key === "allTemplates" 
                    ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600" 
                    : ""
                }`}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group dark:bg-gray-800">
                <div className="relative">
                  <img 
                    src={template.image} 
                    alt={template.name}
                    className="w-full h-48 object-cover"
                  />
                  {template.badge && (
                    <Badge className={`absolute top-4 ${template.badgeColor} ${
                      document.documentElement.dir === 'rtl' ? 'left-4' : 'right-4'
                    }`}>
                      {template.badge}
                    </Badge>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <Button size="sm" variant="secondary" className="focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        <Eye className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                        {t('preview')}
                      </Button>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{template.name}</h3>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 dark:text-gray-400 ml-1 rtl:mr-1 rtl:ml-0">4.8</span>
                    </div>
                  </div>
                  <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">{template.category}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{template.description}</p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
                    {t('spinUpTemplate')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('everyTemplateIncludes')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('everyTemplateSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: t('mobileResponsive'),
                description: t('mobileResponsiveDesc')
              },
              {
                title: t('hipaaCompliant'),
                description: t('hipaaCompliantDesc')
              },
              {
                title: t('seoOptimized'),
                description: t('seoOptimizedDesc')
              },
              {
                title: t('easyCustomization'),
                description: t('easyCustomizationDesc')
              }
            ].map((feature) => (
              <Card key={feature.title} className="border-none shadow-md text-center dark:bg-gray-700">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 dark:bg-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('readyToChoose')}
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {t('readyToChooseDesc')}
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-3 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-blue-700">
            {t('startFreeTrial')}
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Templates;
