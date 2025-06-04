
import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

type Language = 'en' | 'ar';
type Direction = 'ltr' | 'rtl';

interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Basic translations
const translations = {
  en: {
    // Navigation
    features: 'Features',
    howItWorks: 'How It Works',
    templates: 'Templates',
    about: 'About',
    contact: 'Contact',
    signIn: 'Sign In',
    getStarted: 'Get Started',
    
    // Templates page
    templatesTitle: 'Professional Healthcare Templates',
    templatesSubtitle: 'Choose from our collection of beautiful, responsive templates designed specifically for dental and medical practices.',
    allTemplates: 'All Templates',
    dentalClinics: 'Dental Clinics',
    medicalPractices: 'Medical Practices',
    specialtyClinics: 'Specialty Clinics',
    preview: 'Preview',
    spinUpTemplate: 'Spin up this template',
    everyTemplateIncludes: 'Every Template Includes',
    everyTemplateSubtitle: 'All our templates come with essential features for healthcare websites',
    mobileResponsive: 'Mobile Responsive',
    mobileResponsiveDesc: 'Looks great on all devices',
    hipaaCompliant: 'HIPAA Compliant',
    hipaaCompliantDesc: 'Built with privacy in mind',
    seoOptimized: 'SEO Optimized',
    seoOptimizedDesc: 'Helps patients find you online',
    easyCustomization: 'Easy Customization',
    easyCustomizationDesc: 'No coding skills required',
    readyToChoose: 'Ready to Choose Your Template?',
    readyToChooseDesc: 'Start building your professional healthcare website today with any of our templates.',
    startFreeTrial: 'Start Free Trial',
    
    // Template names and descriptions
    modernDental: 'Modern Dental',
    modernDentalDesc: 'Clean, professional design perfect for general dental practices',
    medicalCenterPro: 'Medical Center Pro',
    medicalCenterProDesc: 'Comprehensive layout for multi-specialty medical centers',
    pediatricCare: 'Pediatric Care',
    pediatricCareDesc: 'Colorful, friendly design perfect for children\'s healthcare',
    orthodonticSpecialist: 'Orthodontic Specialist',
    orthodonticSpecialistDesc: 'Sleek design showcasing before/after galleries',
    familyPractice: 'Family Practice',
    familyPracticeDesc: 'Warm, welcoming design for family medicine practices',
    cosmeticDentistry: 'Cosmetic Dentistry',
    cosmeticDentistryDesc: 'Elegant, high-end design for cosmetic dental practices',
    urgentCare: 'Urgent Care',
    urgentCareDesc: 'Clear, informative layout for urgent care facilities',
    dermatologyClinic: 'Dermatology Clinic',
    dermatologyClinicDesc: 'Professional design focused on skincare services',
    
    // Badges
    popular: 'Popular',
    new: 'New',
    featured: 'Featured',
    premium: 'Premium'
  },
  ar: {
    // Navigation
    features: 'المميزات',
    howItWorks: 'كيف يعمل',
    templates: 'القوالب',
    about: 'حولنا',
    contact: 'اتصل بنا',
    signIn: 'تسجيل الدخول',
    getStarted: 'ابدأ الآن',
    
    // Templates page
    templatesTitle: 'قوالب الرعاية الصحية المهنية',
    templatesSubtitle: 'اختر من مجموعتنا من القوالب الجميلة والمتجاوبة المصممة خصيصاً لعيادات الأسنان والممارسات الطبية.',
    allTemplates: 'جميع القوالب',
    dentalClinics: 'عيادات الأسنان',
    medicalPractices: 'الممارسات الطبية',
    specialtyClinics: 'العيادات المتخصصة',
    preview: 'معاينة',
    spinUpTemplate: 'إنشاء هذا القالب',
    everyTemplateIncludes: 'كل قالب يتضمن',
    everyTemplateSubtitle: 'جميع قوالبنا تأتي بالميزات الأساسية لمواقع الرعاية الصحية',
    mobileResponsive: 'متجاوب مع الهاتف',
    mobileResponsiveDesc: 'يبدو رائعاً على جميع الأجهزة',
    hipaaCompliant: 'متوافق مع HIPAA',
    hipaaCompliantDesc: 'مبني مع مراعاة الخصوصية',
    seoOptimized: 'محسن لمحركات البحث',
    seoOptimizedDesc: 'يساعد المرضى في العثور عليك عبر الإنترنت',
    easyCustomization: 'تخصيص سهل',
    easyCustomizationDesc: 'لا حاجة لمهارات البرمجة',
    readyToChoose: 'جاهز لاختيار قالبك؟',
    readyToChooseDesc: 'ابدأ في بناء موقع الرعاية الصحية المهني اليوم مع أي من قوالبنا.',
    startFreeTrial: 'ابدأ التجربة المجانية',
    
    // Template names and descriptions
    modernDental: 'الأسنان العصرية',
    modernDentalDesc: 'تصميم نظيف ومهني مثالي لممارسات طب الأسنان العامة',
    medicalCenterPro: 'المركز الطبي المحترف',
    medicalCenterProDesc: 'تخطيط شامل للمراكز الطبية متعددة التخصصات',
    pediatricCare: 'رعاية الأطفال',
    pediatricCareDesc: 'تصميم ملون وودود مثالي لرعاية الأطفال الصحية',
    orthodonticSpecialist: 'أخصائي تقويم الأسنان',
    orthodonticSpecialistDesc: 'تصميم أنيق يعرض معارض قبل وبعد',
    familyPractice: 'الممارسة العائلية',
    familyPracticeDesc: 'تصميم دافئ ومرحب لممارسات طب الأسرة',
    cosmeticDentistry: 'طب الأسنان التجميلي',
    cosmeticDentistryDesc: 'تصميم أنيق وراقي لممارسات طب الأسنان التجميلي',
    urgentCare: 'الرعاية الطارئة',
    urgentCareDesc: 'تخطيط واضح ومفيد لمرافق الرعاية الطارئة',
    dermatologyClinic: 'عيادة الأمراض الجلدية',
    dermatologyClinicDesc: 'تصميم مهني يركز على خدمات العناية بالبشرة',
    
    // Badges
    popular: 'شائع',
    new: 'جديد',
    featured: 'مميز',
    premium: 'مميز'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [direction, setDirection] = useState<Direction>('ltr');

  const detectBrowserLanguage = (): Language => {
    if (typeof window === 'undefined') return 'en';
    
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('ar')) {
      return 'ar';
    }
    return 'en';
  };

  useEffect(() => {
    // Check for saved language preference first
    const savedLanguage = Cookies.get('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
      setLanguageState(savedLanguage);
      setDirection(savedLanguage === 'ar' ? 'rtl' : 'ltr');
    } else {
      // Auto-detect browser language
      const detectedLang = detectBrowserLanguage();
      setLanguageState(detectedLang);
      setDirection(detectedLang === 'ar' ? 'rtl' : 'ltr');
      Cookies.set('language', detectedLang, { expires: 365 });
    }
  }, []);

  useEffect(() => {
    // Update document direction and lang attribute
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
  }, [language, direction]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setDirection(lang === 'ar' ? 'rtl' : 'ltr');
    Cookies.set('language', lang, { expires: 365 });
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, direction, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
