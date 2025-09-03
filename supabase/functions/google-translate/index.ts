import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TranslateRequest {
  text: string;
  sourceLang: string;
  targetLang: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GOOGLE_API_KEY = Deno.env.get('GOOGLE_TRANSLATE_API_KEY');
    if (!GOOGLE_API_KEY) {
      throw new Error('GOOGLE_TRANSLATE_API_KEY is not set');
    }

    const { text, sourceLang, targetLang }: TranslateRequest = await req.json();

    if (!text || !sourceLang || !targetLang) {
      throw new Error('Missing required fields: text, sourceLang, targetLang');
    }

    console.log('Translating:', { text, sourceLang, targetLang });

    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: sourceLang,
          target: targetLang,
          format: 'text'
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Google Translate API error:', errorData);
      throw new Error(`Translation failed: ${response.statusText}`);
    }

    const data = await response.json();
    const translatedText = data.data.translations[0].translatedText;
    const detectedSourceLanguage = data.data.translations[0].detectedSourceLanguage;

    return new Response(JSON.stringify({ 
      translatedText, 
      detectedSourceLanguage,
      confidence: 0.95 // Google Translate doesn't provide confidence scores
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in google-translate function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});