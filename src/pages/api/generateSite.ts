
import type { NextApiRequest, NextApiResponse } from 'next';
import { renderToStaticMarkup } from 'react-dom/server';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Initialize Supabase client with service role key for admin access
const supabase = createClient<Database>(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

// Create the output directory if it doesn't exist
const ensureDirectoryExists = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Set no-cache header
  res.setHeader('Cache-Control', 'no-cache');

  try {
    // Extract siteId from request body
    const { siteId } = req.body;

    if (!siteId) {
      return res.status(400).json({ error: 'Missing siteId parameter' });
    }

    console.log(`Starting site generation for siteId: ${siteId}`);
    
    // Fetch site metadata
    const { data: site, error: siteError } = await supabase
      .from('sites')
      .select('id, name, slug, primary_color, font_style')
      .eq('id', siteId)
      .single();

    if (siteError || !site) {
      console.error('Error fetching site:', siteError);
      return res.status(404).json({ error: 'Site not found', details: siteError });
    }

    // Create output directory for this site
    const siteOutputDir = path.join(process.cwd(), 'out', 'sites', site.slug as string);
    ensureDirectoryExists(siteOutputDir);

    // Fetch sections order
    const { data: siteSections, error: sectionsError } = await supabase
      .from('site_sections')
      .select('section_id, order_index, is_visible')
      .eq('site_id', siteId)
      .order('order_index');

    if (sectionsError) {
      console.error('Error fetching site sections:', sectionsError);
      return res.status(500).json({ error: 'Failed to fetch site sections', details: sectionsError });
    }

    // If no sections are defined, try to get the default order from templates
    let sectionOrder = siteSections || [];
    
    if (sectionOrder.length === 0) {
      // Fetch template and its default section order
      const { data: template } = await supabase
        .from('templates')
        .select('default_section_order')
        .eq('id', site.template_type)
        .single();
      
      if (template?.default_section_order) {
        // Convert the default order into the same format as site_sections
        sectionOrder = (template.default_section_order as any[]).map((sectionId, index) => ({
          section_id: sectionId,
          order_index: index,
          is_visible: true
        }));
      }
    }

    // Filter out invisible sections
    sectionOrder = sectionOrder.filter(section => section.is_visible);

    if (sectionOrder.length === 0) {
      return res.status(400).json({ error: 'No sections defined for this site' });
    }

    // Fetch content for all sections
    const { data: siteContent } = await supabase
      .from('site_content')
      .select('section_name, content')
      .eq('site_id', siteId);

    // Create a map of section content
    const contentMap = new Map();
    siteContent?.forEach(content => {
      contentMap.set(content.section_name, content.content);
    });

    // Fetch section data and component mapping
    const { data: sectionTemplates } = await supabase
      .from('template_sections')
      .select('id, slug, default_props')
      .in('id', sectionOrder.map(section => section.section_id));
    
    // Create a map of section templates by id
    const sectionTemplateMap = new Map();
    sectionTemplates?.forEach(template => {
      sectionTemplateMap.set(template.id, template);
    });

    // Build the HTML page
    let sectionsHtml = '';

    for (const section of sectionOrder) {
      const sectionTemplate = sectionTemplateMap.get(section.section_id);
      
      if (!sectionTemplate) {
        console.warn(`Section template not found for section_id: ${section.section_id}`);
        continue;
      }

      try {
        // Dynamically import the section component
        const sectionSlug = sectionTemplate.slug;
        const sectionModule = await import(`../../../components/sections/${sectionSlug}`);
        const SectionComponent = sectionModule[sectionSlug.charAt(0).toUpperCase() + sectionSlug.slice(1)];

        if (!SectionComponent) {
          console.warn(`Component not found for section: ${sectionSlug}`);
          continue;
        }

        // Get content from site_content or fallback to default_props
        const sectionContent = contentMap.get(sectionSlug) || sectionTemplate.default_props || {};
        
        // Render the section component to HTML
        const sectionHtml = renderToStaticMarkup(
          React.createElement(SectionComponent, { ...sectionContent, primaryColor: site.primary_color })
        );

        sectionsHtml += sectionHtml;
      } catch (error) {
        console.error(`Error rendering section ${sectionTemplate.slug}:`, error);
        // Continue with other sections even if one fails
      }
    }

    // Create the full HTML document
    const htmlString = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${site.name}</title>
        <style>
          :root {
            --primary-color: ${site.primary_color || '#0066cc'};
            --font-family: ${site.font_style || 'system-ui, sans-serif'};
          }
          body {
            font-family: var(--font-family);
            margin: 0;
            padding: 0;
          }
        </style>
      </head>
      <body>
        <div id="root">${sectionsHtml}</div>
      </body>
      </html>
    `;

    // Write the HTML to file
    fs.writeFileSync(path.join(siteOutputDir, 'index.html'), htmlString);

    // Create a minimal CSS and JS file for completeness
    fs.writeFileSync(path.join(siteOutputDir, 'styles.css'), '/* Site-specific styles */');
    
    console.log(`Site generated successfully at: ${siteOutputDir}`);

    // Trigger deploy hook if provided
    if (process.env.NETLIFY_HOOK_URL) {
      try {
        const deployResponse = await fetch(process.env.NETLIFY_HOOK_URL, { 
          method: 'POST',
          body: JSON.stringify({ site_id: siteId })
        });
        
        if (deployResponse.ok) {
          console.log('Deploy hook triggered successfully');
        } else {
          console.error('Error triggering deploy hook:', await deployResponse.text());
        }
      } catch (deployError) {
        console.error('Failed to trigger deploy hook:', deployError);
      }
    } else {
      console.warn('No deploy hook URL configured');
    }

    return res.status(200).json({ 
      success: true,
      message: 'Site generated successfully',
      path: `/sites/${site.slug}/`
    });
  } catch (error) {
    console.error('Error generating site:', error);
    
    // Here you would log the error to Sentry if configured
    // Sentry.captureException(error);
    
    return res.status(500).json({ 
      error: 'Failed to generate site',
      details: error instanceof Error ? error.message : String(error)
    });
  }
}
