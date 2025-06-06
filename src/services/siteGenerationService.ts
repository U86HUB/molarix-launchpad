
import path from 'path';
import { 
  fetchSiteData, 
  fetchSiteSectionOrder, 
  fetchSiteContent, 
  fetchSectionTemplates 
} from '@/utils/site-generator/dataFetcher';
import { renderSections } from '@/utils/site-generator/sectionRenderer';
import { generateHtmlDocument } from '@/utils/site-generator/htmlGenerator';
import { ensureDirectoryExists, writeSiteFiles } from '@/utils/site-generator/fsUtils';
import { triggerDeployHook } from '@/utils/site-generator/deploymentUtils';

export interface SiteGenerationResult {
  success: boolean;
  message: string;
  path?: string;
  error?: string;
  details?: string;
}

export async function generateSite(siteId: string): Promise<SiteGenerationResult> {
  try {
    console.log(`Starting site generation for siteId: ${siteId}`);
    
    // 1. Fetch site metadata
    const site = await fetchSiteData(siteId);

    // 2. Create output directory for this site
    const siteOutputDir = path.join(process.cwd(), 'out', 'sites', site.slug as string);
    ensureDirectoryExists(siteOutputDir);

    // 3. Fetch sections order
    const sectionOrder = await fetchSiteSectionOrder(siteId);

    if (sectionOrder.length === 0) {
      return {
        success: false,
        message: 'No sections defined for this site',
        error: 'No sections defined for this site'
      };
    }

    // 4. Fetch content for all sections
    const contentMap = await fetchSiteContent(siteId);

    // 5. Fetch section templates
    const sectionTemplateMap = await fetchSectionTemplates(
      sectionOrder.map(section => section.section_id)
    );
    
    // 6. Render all sections to HTML
    const sectionsHtml = await renderSections(
      sectionOrder, 
      sectionTemplateMap, 
      contentMap,
      site.primary_color
    );

    // 7. Generate the full HTML document
    const htmlString = generateHtmlDocument(
      site.name,
      site.primary_color,
      site.font_style,
      sectionsHtml
    );

    // 8. Write the files to disk
    writeSiteFiles(siteOutputDir, htmlString);
    
    console.log(`Site generated successfully at: ${siteOutputDir}`);

    // 9. Trigger deploy hook if provided
    if (process.env.NETLIFY_HOOK_URL) {
      await triggerDeployHook(siteId);
    }

    return {
      success: true,
      message: 'Site generated successfully',
      path: `/sites/${site.slug}/`
    };
  } catch (error) {
    console.error('Error generating site:', error);
    
    return {
      success: false,
      message: 'Failed to generate site',
      error: 'Failed to generate site',
      details: error instanceof Error ? error.message : String(error)
    };
  }
}
