
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.9';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId, stream = false } = await req.json();

    if (!sessionId) {
      throw new Error('Session ID is required');
    }

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // Fetch onboarding session data
    const { data: sessionData, error: fetchError } = await supabase
      .from('onboarding_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (fetchError) {
      console.error('Error fetching session data:', fetchError);
      throw new Error('Failed to fetch onboarding session data');
    }

    if (!sessionData) {
      throw new Error('Onboarding session not found');
    }

    console.log('Fetched session data:', sessionData);

    // Create comprehensive prompt for all copy sections
    const prompt = `Create comprehensive website copy for a dental clinic with the following details:
    - Clinic Name: ${sessionData.clinic_name}
    - Address: ${sessionData.address}
    - Phone: ${sessionData.phone}
    - Email: ${sessionData.email}
    - Selected Template: ${sessionData.selected_template}
    
    Generate a complete website copy package including:
    
    1. HOMEPAGE SECTION:
       - headline: A catchy main headline (max 10 words)
       - subheadline: A descriptive subheadline (max 20 words)
       - welcomeMessage: A warm welcome message (2-3 sentences)
       - ctaText: Call-to-action button text (max 4 words)
    
    2. SERVICES SECTION:
       - title: Services section title (max 6 words)
       - intro: Brief introduction paragraph (2-3 sentences)
       - services: Array of 4 dental services, each with:
         * name: Service name (max 4 words)
         * description: Service description (1-2 sentences)
    
    3. ABOUT SECTION:
       - title: About section title (max 6 words)
       - intro: About introduction (2-3 sentences)
       - mission: Mission statement (1-2 sentences)
       - values: Array of 3 core values, each with:
         * name: Value name (max 3 words)
         * description: Value description (1 sentence)
    
    Return ONLY valid JSON with this exact structure:
    {
      "homepage": {
        "headline": "string",
        "subheadline": "string", 
        "welcomeMessage": "string",
        "ctaText": "string"
      },
      "services": {
        "title": "string",
        "intro": "string",
        "services": [
          {"name": "string", "description": "string"},
          {"name": "string", "description": "string"},
          {"name": "string", "description": "string"},
          {"name": "string", "description": "string"}
        ]
      },
      "about": {
        "title": "string",
        "intro": "string", 
        "mission": "string",
        "values": [
          {"name": "string", "description": "string"},
          {"name": "string", "description": "string"},
          {"name": "string", "description": "string"}
        ]
      }
    }`;

    console.log('Sending request to OpenAI...');

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
            content: 'You are a professional copywriter specializing in dental practice marketing. Always return valid JSON formatted responses without markdown code blocks.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        stream: stream,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    if (stream) {
      // Return streaming response
      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          const reader = response.body?.getReader();
          if (!reader) {
            controller.close();
            return;
          }

          try {
            let buffer = '';
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              const chunk = new TextDecoder().decode(value);
              buffer += chunk;

              const lines = buffer.split('\n');
              buffer = lines.pop() || '';

              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  const data = line.slice(6);
                  if (data === '[DONE]') {
                    controller.close();
                    return;
                  }

                  try {
                    const parsed = JSON.parse(data);
                    if (parsed.choices && parsed.choices[0] && parsed.choices[0].delta && parsed.choices[0].delta.content) {
                      controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                        content: parsed.choices[0].delta.content,
                        sessionData: sessionData
                      })}\n\n`));
                    }
                  } catch (e) {
                    // Skip invalid JSON
                  }
                }
              }
            }
          } catch (error) {
            console.error('Streaming error:', error);
            controller.error(error);
          } finally {
            reader.releaseLock();
          }
        }
      });

      return new Response(readable, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } else {
      // Original non-streaming logic
      const data = await response.json();
      console.log('OpenAI response:', data);

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response from OpenAI');
      }

      const rawContent = data.choices[0].message.content;
      console.log('Raw OpenAI content:', rawContent);

      // Helper function to sanitize OpenAI response
      const sanitizeResponse = (content: string): string => {
        const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/;
        const match = content.match(codeBlockRegex);
        return match ? match[1].trim() : content.trim();
      };

      const sanitizedContent = sanitizeResponse(rawContent);
      console.log('Sanitized content:', sanitizedContent);

      let generatedCopy;
      try {
        generatedCopy = JSON.parse(sanitizedContent);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Content that failed to parse:', sanitizedContent);
        throw new Error('Failed to parse OpenAI response as JSON');
      }

      console.log('Successfully generated copy:', generatedCopy);

      return new Response(JSON.stringify({ 
        success: true, 
        copy: generatedCopy,
        sessionData: sessionData 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in generate-copy function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
