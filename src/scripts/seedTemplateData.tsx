
import { supabase } from '@/integrations/supabase/client';
import { templates, templateFeatures } from '@/data/templatesData';
import { sectionTemplates } from '@/data/sectionTemplates';

/**
 * This script is meant to be run once to seed the database with template data.
 * It can be executed from a button in an admin interface or directly in the browser console.
 */
export const seedTemplateData = async () => {
  console.log('Starting database seeding for templates...');
  
  try {
    // First, seed the templates
    for (const template of templates) {
      const { data, error } = await supabase
        .from('templates')
        .upsert({
          id: template.id.toString(), // Ensure it's a string
          name: template.name,
          slug: template.name.toLowerCase().replace(/\s+/g, '-'),
          description: template.description,
          preview_image_url: template.image,
          default_section_order: [],
          category: template.category
        }, { onConflict: 'name' });
      
      if (error) {
        console.error(`Failed to seed template ${template.name}:`, error);
      } else {
        console.log(`Seeded template: ${template.name}`);
      }
    }
    
    // Then, seed the section templates
    for (const section of sectionTemplates) {
      const { data, error } = await supabase
        .from('template_sections')
        .upsert({
          name: section.name,
          slug: section.type,
          component_path: `components/sections/${section.type}`,
          default_props: section.defaultSettings
        }, { onConflict: 'slug' });
      
      if (error) {
        console.error(`Failed to seed section template ${section.name}:`, error);
      } else {
        console.log(`Seeded section template: ${section.name}`);
      }
    }
    
    console.log('Database seeding completed successfully!');
    return { success: true, message: 'Templates and sections seeded successfully!' };
  } catch (error) {
    console.error('Error during database seeding:', error);
    return { success: false, message: 'Failed to seed database', error };
  }
};

// Optional admin component to trigger seeding
export const SeedDatabaseButton = () => {
  const handleSeed = async () => {
    const result = await seedTemplateData();
    alert(result.message);
  };
  
  return (
    <button 
      onClick={handleSeed}
      style={{ 
        padding: '8px 16px', 
        backgroundColor: '#4CAF50', 
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      Seed Template Data
    </button>
  );
};
