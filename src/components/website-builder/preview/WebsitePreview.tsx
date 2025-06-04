
import { useEffect, useState } from 'react';
import { Website, Section } from '@/types/website';
import { GeneratedCopy } from '@/types/copy';
import { supabase } from '@/integrations/supabase/client';
import { Eye, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import HeroSection from './HeroSection';
import AboutSection from './AboutSection';
import ServicesSection from './ServicesSection';
import ContactSection from './ContactSection';
import TestimonialsSection from './TestimonialsSection';
import FeaturesSection from './FeaturesSection';

interface WebsitePreviewProps {
  website: Website;
  sections: Section[];
}

const WebsitePreview = ({ website, sections }: WebsitePreviewProps) => {
  const [copy, setCopy] = useState<GeneratedCopy | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDraft, setShowDraft] = useState(false);

  useEffect(() => {
    // Apply dynamic CSS variables for the selected colors and fonts
    const root = document.documentElement;
    
    if (website.primary_color) {
      root.style.setProperty('--preview-primary', website.primary_color);
    }

    if (website.font_style && website.font_style !== 'default') {
      root.style.setProperty('--preview-font', website.font_style);
    } else {
      root.style.setProperty('--preview-font', 'Inter, system-ui, sans-serif');
    }

    return () => {
      root.style.removeProperty('--preview-primary');
      root.style.removeProperty('--preview-font');
    };
  }, [website.primary_color, website.font_style]);

  useEffect(() => {
    const fetchCopy = async () => {
      if (!website.id) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('ai_generated_copy')
          .select('*')
          .eq('session_id', website.id)
          .eq('type', showDraft ? 'draft' : 'published')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error('Error fetching copy:', error);
          setCopy(null);
          return;
        }

        if (data) {
          setCopy(data.data as unknown as GeneratedCopy);
        } else {
          setCopy(null);
        }
      } catch (error) {
        console.error('Error:', error);
        setCopy(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCopy();
  }, [website.id, showDraft]);

  const renderSection = (section: Section) => {
    const sectionCopy = copy ? getCopyForSection(copy, section.type) : null;

    switch (section.type) {
      case 'hero':
        return <HeroSection key={section.id} section={section} copy={sectionCopy} />;
      case 'about':
        return <AboutSection key={section.id} section={section} copy={sectionCopy} />;
      case 'services':
        return <ServicesSection key={section.id} section={section} copy={sectionCopy} />;
      case 'contact':
        return <ContactSection key={section.id} section={section} copy={sectionCopy} />;
      case 'testimonials':
        return <TestimonialsSection key={section.id} section={section} copy={sectionCopy} />;
      case 'features':
        return <FeaturesSection key={section.id} section={section} copy={sectionCopy} />;
      default:
        return (
          <section key={section.id} className="py-8 px-4 bg-gray-100 dark:bg-gray-800">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {section.type.charAt(0).toUpperCase() + section.type.slice(1)} Section
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                This section type is not yet implemented in the preview.
              </p>
            </div>
          </section>
        );
    }
  };

  const getCopyForSection = (copy: GeneratedCopy, sectionType: string) => {
    switch (sectionType) {
      case 'hero':
        return copy.homepage;
      case 'about':
        return copy.about;
      case 'services':
        return copy.services;
      default:
        return null;
    }
  };

  if (sections.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Sections Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Add sections from the left panel to see your website preview
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-full overflow-auto">
        <div className="space-y-8 p-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  const visibleSections = sections
    .filter(section => section.is_visible)
    .sort((a, b) => a.position - b.position);

  return (
    <div className="h-full flex flex-col">
      {/* Preview Controls */}
      <div className="border-b bg-white dark:bg-gray-900 p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900 dark:text-white">Live Preview</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {showDraft ? 'Draft' : 'Published'}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDraft(!showDraft)}
              className="p-1"
            >
              {showDraft ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div 
        className="flex-1 overflow-auto bg-white dark:bg-gray-900"
        style={{ fontFamily: 'var(--preview-font)' }}
      >
        <div className="min-h-full">
          {visibleSections.map(renderSection)}
        </div>
      </div>
    </div>
  );
};

export default WebsitePreview;
