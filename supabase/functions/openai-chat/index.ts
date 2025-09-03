import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatRequest {
  message: string;
  context: string;
  purpose?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    const { message, context, purpose }: ChatRequest = await req.json();

    // Input validation
    if (!message || typeof message !== 'string' || message.length > 2000) {
      throw new Error('Invalid message: must be a string under 2000 characters');
    }
    if (!context || typeof context !== 'string' || context.length > 500) {
      throw new Error('Invalid context: must be a string under 500 characters');
    }
    if (purpose && (typeof purpose !== 'string' || purpose.length > 100)) {
      throw new Error('Invalid purpose: must be a string under 100 characters');
    }

    console.log('OpenAI Chat request:', { 
      messageLength: message.length, 
      contextLength: context.length,
      purpose 
    });

    const systemPrompt = `You are VyaparGuru, a business communication assistant specializing in Hindi-English business communications.

Context: ${context}
${purpose ? `Purpose: ${purpose}` : ''}

Guidelines:
- Help with professional business communication
- Convert Hindi business messages to professional English
- Provide culturally appropriate business language
- Keep responses concise and professional
- Focus on clarity and business etiquette`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI request failed: ${response.statusText}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    return new Response(JSON.stringify({ 
      generatedText,
      usage: data.usage 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in openai-chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});