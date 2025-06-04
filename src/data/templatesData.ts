
export const templateCategories = [
  { name: 'allTemplates', count: 8, key: 'allTemplates' },
  { name: 'dentalClinics', count: 3, key: 'dentalClinics' },
  { name: 'medicalPractices', count: 3, key: 'medicalPractices' },
  { name: 'specialtyClinics', count: 2, key: 'specialtyClinics' }
];

export const templates = [
  {
    id: 1,
    name: 'modernDental',
    category: 'dentalClinics',
    description: 'modernDentalDesc',
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop&crop=center",
    badge: 'popular',
    badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
  },
  {
    id: 2,
    name: 'medicalCenterPro',
    category: 'medicalPractices', 
    description: 'medicalCenterProDesc',
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop&crop=center",
    badge: 'new',
    badgeColor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
  },
  {
    id: 3,
    name: 'pediatricCare',
    category: 'dentalClinics',
    description: 'pediatricCareDesc',
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop&crop=center",
    badge: null,
    badgeColor: ""
  },
  {
    id: 4,
    name: 'orthodonticSpecialist',
    category: 'specialtyClinics',
    description: 'orthodonticSpecialistDesc',
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop&crop=center",
    badge: 'featured',
    badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
  },
  {
    id: 5,
    name: 'familyPractice',
    category: 'medicalPractices',
    description: 'familyPracticeDesc',
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=300&fit=crop&crop=center",
    badge: null,
    badgeColor: ""
  },
  {
    id: 6,
    name: 'cosmeticDentistry',
    category: 'dentalClinics',
    description: 'cosmeticDentistryDesc',
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=300&fit=crop&crop=center",
    badge: 'premium',
    badgeColor: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
  },
  {
    id: 7,
    name: 'urgentCare',
    category: 'medicalPractices',
    description: 'urgentCareDesc',
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop&crop=center",
    badge: null,
    badgeColor: ""
  },
  {
    id: 8,
    name: 'dermatologyClinic',
    category: 'specialtyClinics',
    description: 'dermatologyClinicDesc',
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop&crop=center",
    badge: null,
    badgeColor: ""
  }
];

export const templateFeatures = [
  {
    title: 'mobileResponsive',
    description: 'mobileResponsiveDesc'
  },
  {
    title: 'hipaaCompliant',
    description: 'hipaaCompliantDesc'
  },
  {
    title: 'seoOptimized',
    description: 'seoOptimizedDesc'
  },
  {
    title: 'easyCustomization',
    description: 'easyCustomizationDesc'
  }
];
