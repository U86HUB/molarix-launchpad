
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { 
  aboutPrompt, 
  servicePrompt, 
  testimonialPrompt, 
  heroPrompt, 
  contactPrompt, 
  featuresPrompt 
} from '@/lib/prompts';

// Initialize Supabase client with service role key for admin access
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface GenerateCopyRequest {
  siteId: string;
  fieldType: string;
  contextData?: {
    specialties?: string[];
    serviceName?: string;
    location?: string;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check authentication
  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { siteId, fieldType, contextData = {} }: GenerateCopyRequest = req.body;

    if (!siteId || !fieldType) {
      return res.status(400).json({ error: 'Missing required fields: siteId, fieldType' });
    }

    // Check for cached content first
    const { data: existingContent } = await supabase
      .from('site_content')
      .select('content, updated_at')
      .eq('site_id', siteId)
      .eq('section_name', fieldType)
      .single();

    // If content exists and was updated within the last day, return cached version
    if (existingContent) {
      const lastUpdated = new Date(existingContent.updated_at);
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      if (lastUpdated > oneDayAgo) {
        console.log(`Returning cached content for ${fieldType}`);
        return res.status(200).json({ 
          text: existingContent.content,
          cached: true 
        });
      }
    }

    // Fetch site information
    const { data: site, error: siteError } = await supabase
      .from('sites')
      .select('name, slug, primary_color, font_style')
      .eq('id', siteId)
      .single();

    if (siteError || !site) {
      console.error('Error fetching site:', siteError);
      return res.status(404).json({ error: 'Site not found' });
    }

    // Extract context data with defaults
    const {
      specialties = ['general dental care'],
      serviceName = 'dental service',
      location = 'our location'
    } = contextData;

    // Generate the appropriate prompt based on field type
    let prompt: string;
    
    switch (fieldType.toLowerCase()) {
      case 'about':
        prompt = aboutPrompt(site.name, specialties);
        break;
      case 'service':
      case 'services':
        prompt = servicePrompt(site.name, serviceName, location);
        break;
      case 'testimonial':
      case 'testimonials':
        prompt = testimonialPrompt(site.name);
        break;
      case 'hero':
        prompt = heroPrompt(site.name, location, specialties);
        break;
      case 'contact':
        prompt = contactPrompt(site.name, location);
        break;
      case 'features':
        prompt = featuresPrompt(site.name, specialties);
        break;
      default:
        return res.status(400).json({ error: `Unsupported field type: ${fieldType}` });
    }

    console.log(`Generating content for ${fieldType} using OpenAI...`);

    // Call OpenAI to generate content
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const generatedText = completion.choices[0]?.message?.content?.trim();

    if (!generatedText) {
      throw new Error('Failed to generate content from OpenAI');
    }

    console.log(`Generated content for ${fieldType}:`, generatedText.substring(0, 100) + '...');

    // Save the generated content to Supabase
    const { error: upsertError } = await supabase
      .from('site_content')
      .upsert({
        site_id: siteId,
        section_name: fieldType,
        content: generatedText,
        updated_at: new Date().toISOString()
      });

    if (upsertError) {
      console.error('Error saving content to database:', upsertError);
      // Still return the generated text even if saving fails
    }

    return res.status(200).json({ 
      text: generatedText,
      cached: false 
    });

  } catch (error: any) {
    console.error('Error in generateCopy API:', error);
    
    if (error.message?.includes('OpenAI')) {
      return res.status(503).json({ error: 'AI service temporarily unavailable' });
    }
    
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
