import { supabase } from "@/integrations/supabase/client";

export interface TranslationResponse {
  translatedText: string;
  confidence: number;
  detectedSourceLanguage?: string;
  source?: string;
}

export interface ChatResponse {
  generatedText: string;
  usage?: any;
}

export interface SpeechResponse {
  audioData: string;
  success: boolean;
}

export interface TranscriptionResponse {
  transcription: string;
  confidence: number;
  language: string;
}

export class APIService {
  // Google Translate API
  static async translateWithGoogle(
    text: string, 
    sourceLang: string, 
    targetLang: string
  ): Promise<TranslationResponse> {
    const { data, error } = await supabase.functions.invoke('google-translate', {
      body: { text, sourceLang, targetLang }
    });

    if (error) throw new Error(error.message);
    return data;
  }

  // Bhashini API  
  static async translateWithBhashini(
    text: string,
    sourceLang: string, 
    targetLang: string
  ): Promise<TranslationResponse> {
    const { data, error } = await supabase.functions.invoke('bhashini-translate', {
      body: { text, sourceLang, targetLang }
    });

    if (error) throw new Error(error.message);
    return data;
  }

  // OpenAI Chat API
  static async generateWithOpenAI(
    message: string,
    context: string,
    purpose?: string
  ): Promise<ChatResponse> {
    const { data, error } = await supabase.functions.invoke('openai-chat', {
      body: { message, context, purpose }
    });

    if (error) throw new Error(error.message);
    return data;
  }

  // Azure Speech Services
  static async synthesizeSpeech(
    text: string,
    language = 'hi-IN',
    voice = 'hi-IN-MadhurNeural'
  ): Promise<SpeechResponse> {
    const { data, error } = await supabase.functions.invoke('azure-speech', {
      body: { text, language, voice }
    });

    if (error) throw new Error(error.message);
    return data;
  }

  static async transcribeSpeech(
    audioData: string,
    language = 'hi-IN'
  ): Promise<TranscriptionResponse> {
    const { data, error } = await supabase.functions.invoke('azure-speech?action=transcribe', {
      body: { audioData, language }
    });

    if (error) throw new Error(error.message);
    return data;
  }

  // Hybrid translation - tries Google first, falls back to Bhashini
  static async translate(
    text: string,
    sourceLang: string,
    targetLang: string
  ): Promise<TranslationResponse> {
    try {
      return await this.translateWithGoogle(text, sourceLang, targetLang);
    } catch (error) {
      console.warn('Google Translate failed, trying Bhashini:', error);
      return await this.translateWithBhashini(text, sourceLang, targetLang);
    }
  }
}