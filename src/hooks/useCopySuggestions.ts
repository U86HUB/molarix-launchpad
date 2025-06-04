
import { useState, useEffect } from 'react';
import { GeneratedCopy } from '@/types/copy';

interface CopySuggestion {
  id: string;
  type: 'missing' | 'improvement';
  section: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
}

interface UseCopySuggestionsProps {
  copy: GeneratedCopy | null;
  sessionId: string;
}

export const useCopySuggestions = ({ copy, sessionId }: UseCopySuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<CopySuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!copy || !sessionId) {
      setSuggestions([]);
      return;
    }

    const analyzeCopy = () => {
      setLoading(true);
      const newSuggestions: CopySuggestion[] = [];

      // Check homepage content
      if (!copy.homepage?.headline || copy.homepage.headline.trim() === '') {
        newSuggestions.push({
          id: 'missing-hero-headline',
          type: 'missing',
          section: 'Homepage',
          message: "You haven't added a hero headline yet.",
          priority: 'high'
        });
      }

      if (!copy.homepage?.subheadline || copy.homepage.subheadline.trim() === '') {
        newSuggestions.push({
          id: 'missing-hero-subheadline',
          type: 'missing',
          section: 'Homepage',
          message: "Consider adding a compelling subheadline to your hero section.",
          priority: 'medium'
        });
      }

      if (!copy.homepage?.ctaText || copy.homepage.ctaText.trim() === '') {
        newSuggestions.push({
          id: 'missing-cta-text',
          type: 'missing',
          section: 'Homepage',
          message: "Add a call-to-action button text to drive conversions.",
          priority: 'high'
        });
      }

      // Check services section
      if (!copy.services?.title || copy.services.title.trim() === '') {
        newSuggestions.push({
          id: 'missing-services-title',
          type: 'missing',
          section: 'Services',
          message: "You haven't added a services section title yet.",
          priority: 'medium'
        });
      }

      if (!copy.services?.services || copy.services.services.length === 0) {
        newSuggestions.push({
          id: 'missing-services',
          type: 'missing',
          section: 'Services',
          message: "You haven't added any services yet. Add at least 3 services.",
          priority: 'high'
        });
      } else if (copy.services.services.length < 3) {
        newSuggestions.push({
          id: 'few-services',
          type: 'improvement',
          section: 'Services',
          message: `You have ${copy.services.services.length} service(s). Consider adding more to showcase your expertise.`,
          priority: 'medium'
        });
      }

      // Check for incomplete service descriptions
      copy.services?.services?.forEach((service, index) => {
        if (!service.description || service.description.trim() === '') {
          newSuggestions.push({
            id: `missing-service-description-${index}`,
            type: 'missing',
            section: 'Services',
            message: `Service "${service.name}" is missing a description.`,
            priority: 'medium'
          });
        }
      });

      // Check about section
      if (!copy.about?.title || copy.about.title.trim() === '') {
        newSuggestions.push({
          id: 'missing-about-title',
          type: 'missing',
          section: 'About',
          message: "You haven't added an About section title yet.",
          priority: 'medium'
        });
      }

      if (!copy.about?.intro || copy.about.intro.trim() === '') {
        newSuggestions.push({
          id: 'missing-about-intro',
          type: 'missing',
          section: 'About',
          message: "You haven't added an About section yet.",
          priority: 'medium'
        });
      }

      if (!copy.about?.mission || copy.about.mission.trim() === '') {
        newSuggestions.push({
          id: 'missing-mission',
          type: 'missing',
          section: 'About',
          message: "Consider adding your clinic's mission statement.",
          priority: 'low'
        });
      }

      if (!copy.about?.values || copy.about.values.length === 0) {
        newSuggestions.push({
          id: 'missing-values',
          type: 'missing',
          section: 'About',
          message: "Consider adding your clinic's core values.",
          priority: 'low'
        });
      }

      // Content quality suggestions
      if (copy.homepage?.headline && copy.homepage.headline.length < 20) {
        newSuggestions.push({
          id: 'short-headline',
          type: 'improvement',
          section: 'Homepage',
          message: "Your headline could be more descriptive and compelling.",
          priority: 'low'
        });
      }

      setSuggestions(newSuggestions);
      setLoading(false);
    };

    analyzeCopy();
  }, [copy, sessionId]);

  const getSuggestionsByPriority = (priority: 'high' | 'medium' | 'low') => {
    return suggestions.filter(s => s.priority === priority);
  };

  const getTotalSuggestions = () => suggestions.length;

  const getHighPrioritySuggestions = () => getSuggestionsByPriority('high');

  return {
    suggestions,
    loading,
    getSuggestionsByPriority,
    getTotalSuggestions,
    getHighPrioritySuggestions
  };
};
