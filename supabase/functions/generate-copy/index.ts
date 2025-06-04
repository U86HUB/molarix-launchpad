
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { clinicData, section } = await req.json();

    let prompt = '';
    
    if (section === 'homepage') {
      prompt = `Create compelling homepage copy for a dental clinic with the following details:
      - Clinic Name: ${clinicData.clinic_name}
      - Address: ${clinicData.address}
      - Phone: ${clinicData.phone}
      - Email: ${clinicData.email}
      
      Generate:
      1. A catchy headline (max 10 words)
      2. A subheadline describing the clinic (max 20 words)
      3. A brief welcome message (2-3 sentences)
      4. A call-to-action button text (max 4 words)
      
      Return as JSON with keys: headline, subheadline, welcomeMessage, ctaText`;
    } else if (section === 'services') {
      prompt = `Create a services section for ${clinicData.clinic_name} dental clinic. Generate:
      1. A section title (max 6 words)
      2. A brief intro paragraph (2-3 sentences)
      3. 4 common dental services with:
         - Service name (max 4 words)
         - Brief description (1 sentence)
      
      Return as JSON with keys: title, intro, services (array of objects with name and description)`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a professional copywriter specializing in dental practice marketing. Always return valid JSON formatted responses.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const generatedCopy = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify({ success: true, copy: generatedCopy }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-copy function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
