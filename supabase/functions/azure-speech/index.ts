import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SpeechRequest {
  text: string;
  language?: string;
  voice?: string;
}

interface TranscriptionRequest {
  audioData: string; // base64 encoded audio
  language?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const AZURE_API_KEY = Deno.env.get('AZURE_SPEECH_API_KEY');
    if (!AZURE_API_KEY) {
      throw new Error('AZURE_SPEECH_API_KEY is not set');
    }

    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'synthesize';

    if (action === 'synthesize') {
      // Text-to-Speech
      const { text, language = 'hi-IN', voice = 'hi-IN-MadhurNeural' }: SpeechRequest = await req.json();

      // Input validation
      if (!text || typeof text !== 'string' || text.length > 1000) {
        throw new Error('Invalid text: must be a string under 1000 characters');
      }
      if (language && (typeof language !== 'string' || language.length > 10)) {
        throw new Error('Invalid language: must be a valid language code');
      }
      if (voice && (typeof voice !== 'string' || voice.length > 50)) {
        throw new Error('Invalid voice: must be a valid voice name');
      }

      console.log('Azure Speech synthesis:', { 
        textLength: text.length, 
        language, 
        voice 
      });

      const ssml = `
        <speak version='1.0' xml:lang='${language}'>
          <voice xml:lang='${language}' name='${voice}'>
            ${text}
          </voice>
        </speak>
      `;

      const response = await fetch(
        'https://eastus.tts.speech.microsoft.com/cognitiveservices/v1',
        {
          method: 'POST',
          headers: {
            'Ocp-Apim-Subscription-Key': AZURE_API_KEY,
            'Content-Type': 'application/ssml+xml',
            'X-Microsoft-OutputFormat': 'audio-16khz-32kbitrate-mono-mp3',
          },
          body: ssml,
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Azure Speech API error:', errorData);
        throw new Error(`Speech synthesis failed: ${response.statusText}`);
      }

      const audioBuffer = await response.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));

      return new Response(JSON.stringify({ 
        audioData: `data:audio/mp3;base64,${base64Audio}`,
        success: true
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (action === 'transcribe') {
      // Speech-to-Text using Azure Speech API
      const { audioData, language = 'hi-IN' }: TranscriptionRequest = await req.json();

      // Input validation
      if (!audioData || typeof audioData !== 'string' || audioData.length > 10000000) { // ~7.5MB limit
        throw new Error('Invalid audioData: must be base64 string under 10MB');
      }
      if (language && (typeof language !== 'string' || language.length > 10)) {
        throw new Error('Invalid language: must be a valid language code');
      }

      console.log('Azure Speech transcription:', { 
        audioDataLength: audioData.length,
        language 
      });

      // Convert base64 audio data to binary
      const binaryAudio = Uint8Array.from(atob(audioData), c => c.charCodeAt(0));
      
      // Azure Speech-to-Text endpoint
      const region = 'eastus'; // Adjust region as needed
      const endpoint = `https://${region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1`;
      
      const params = new URLSearchParams({
        language: language,
        format: 'simple'
      });

      const response = await fetch(`${endpoint}?${params}`, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': AZURE_API_KEY,
          'Content-Type': 'audio/webm;codecs=opus',
          'Accept': 'application/json'
        },
        body: binaryAudio
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Azure Speech STT error:', errorData);
        throw new Error(`Speech transcription failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Azure STT result:', result);

      return new Response(JSON.stringify({ 
        transcription: result.DisplayText || result.NBest?.[0]?.Display || '',
        confidence: result.NBest?.[0]?.Confidence || 0.0,
        language: language
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Invalid action. Use "synthesize" or "transcribe".');

  } catch (error) {
    console.error('Error in azure-speech function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});