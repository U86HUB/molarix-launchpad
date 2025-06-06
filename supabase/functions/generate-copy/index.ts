
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Prompt generation functions
function aboutPrompt(clinicName: string, specialties: string[]): string {
  const specialtiesText = specialties.length > 0 ? specialties.join(', ') : 'general dental care';
  
  return `Context: You are writing an "About Us" section for ${clinicName}, a dental/medical clinic specializing in ${specialtiesText}.

Task: Create a professional, warm, and trustworthy About Us section that establishes credibility and builds patient confidence.

Requirements:
- Write 2-3 short paragraphs (150-200 words total)
- Use a professional but friendly tone
- Emphasize experience, qualifications, and patient care philosophy
- Include mention of specialties: ${specialtiesText}
- Focus on building trust and rapport with potential patients
- Avoid overly technical language
- Include phrases about commitment to patient comfort and quality care

Tone: Professional, warm, trustworthy, patient-focused
Output: Return only the About Us text content, no additional formatting or labels.`;
}

function servicePrompt(clinicName: string, serviceName: string, location: string): string {
  return `Context: You are writing a service description for "${serviceName}" offered by ${clinicName} located in ${location}.

Task: Create a concise, informative service description that explains the benefits and builds patient confidence.

Requirements:
- Write 1-2 sentences (30-50 words total)
- Use professional medical/dental terminology appropriately
- Highlight key benefits and patient outcomes
- Emphasize quality and safety
- Include mention of ${clinicName}'s expertise in this service
- Focus on patient value and results

Tone: Professional, confident, benefit-focused
Output: Return only the service description text, no additional formatting or labels.`;
}

function testimonialPrompt(clinicName: string): string {
  return `Context: You are creating a realistic patient testimonial for ${clinicName}, a dental/medical clinic.

Task: Write an authentic-sounding patient review that highlights positive experiences and outcomes.

Requirements:
- Write 2-3 sentences (40-80 words total)
- Use natural, conversational language as if written by a real patient
- Mention specific aspects: staff friendliness, professionalism, comfort, results
- Include emotional elements (relief, satisfaction, confidence)
- Avoid overly promotional language
- Make it feel genuine and relatable
- Include mention of recommending ${clinicName} to others

Tone: Genuine, grateful, conversational, positive
Output: Return only the testimonial text content, no additional formatting or labels.`;
}

function heroPrompt(clinicName: string, location: string, specialties: string[]): string {
  const specialtiesText = specialties.length > 0 ? specialties.join(', ') : 'quality dental care';
  
  return `Context: You are writing a hero section headline and subheadline for ${clinicName} located in ${location}, specializing in ${specialtiesText}.

Task: Create compelling hero text that immediately communicates value and encourages action.

Requirements:
- Write a headline (5-8 words) and subheadline (15-25 words)
- Headline should be catchy and memorable
- Subheadline should mention location: ${location}
- Include reference to specialties: ${specialtiesText}
- Focus on patient benefits and outcomes
- Create urgency or emotional connection
- Use action-oriented language

Format:
Headline: [Your headline here]
Subheadline: [Your subheadline here]

Tone: Confident, welcoming, action-oriented
Output: Return only the formatted headline and subheadline as specified above.`;
}

function contactPrompt(clinicName: string, location: string): string {
  return `Context: You are writing a contact section introduction for ${clinicName} located in ${location}.

Task: Create welcoming contact section text that encourages patients to reach out.

Requirements:
- Write 1-2 sentences (25-40 words total)
- Emphasize easy scheduling and responsive communication
- Mention ${location} location
- Use inviting, approachable language
- Include call-to-action elements
- Focus on accessibility and patient convenience

Tone: Welcoming, helpful, accessible
Output: Return only the contact section text, no additional formatting or labels.`;
}

function featuresPrompt(clinicName: string, specialties: string[]): string {
  const specialtiesText = specialties.length > 0 ? specialties.join(', ') : 'comprehensive care';
  
  return `Context: You are writing feature descriptions for ${clinicName}, highlighting what makes them stand out in ${specialtiesText}.

Task: Create 3-4 key feature points that differentiate the clinic from competitors.

Requirements:
- Write 3-4 bullet points (10-15 words each)
- Focus on unique value propositions
- Mention specialties: ${specialtiesText}
- Highlight technology, experience, or service quality
- Use benefit-focused language
- Emphasize patient outcomes and satisfaction

Format:
• [Feature 1]
• [Feature 2]
• [Feature 3]
• [Feature 4]

Tone: Professional, distinctive, value-focused
Output: Return only the formatted feature list as specified above.`;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { siteId, fieldType, contextData = {} } = await req.json();

    if (!siteId || !fieldType) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: siteId, fieldType' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
        return new Response(
          JSON.stringify({ text: existingContent.content, cached: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
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
      return new Response(
        JSON.stringify({ error: 'Site not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
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
        return new Response(
          JSON.stringify({ error: `Unsupported field type: ${fieldType}` }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
    }

    console.log(`Generating content for ${fieldType} using OpenAI...`);

    // Call OpenAI to generate content
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const completion = await response.json();
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

    return new Response(
      JSON.stringify({ text: generatedText, cached: false }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in generate-copy function:', error);
    
    if (error.message?.includes('OpenAI')) {
      return new Response(
        JSON.stringify({ error: 'AI service temporarily unavailable' }),
        { 
          status: 503, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
