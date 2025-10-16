import { supabase } from "@/integrations/supabase/client";

// Helper function to handle subscription errors
function handleSubscriptionError(error: any, navigate?: any, toast?: any): boolean {
  if (error?.requiresSubscription && navigate && toast) {
    toast({
      title: "Subscription Required",
      description: error.message,
      variant: "destructive",
      duration: 5000
    });
    
    // Redirect to pricing page after 2 seconds
    setTimeout(() => {
      navigate('/pricing');
    }, 2000);
    
    return true; // Error was handled
  }
  return false; // Error should be thrown
}

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
    targetLang: string,
    navigate?: any,
    toast?: any
  ): Promise<TranslationResponse> {
    const { data, error } = await supabase.functions.invoke('google-translate', {
      body: { text, sourceLang, targetLang }
    });

    if (error) {
      if (data?.requiresSubscription && handleSubscriptionError(data, navigate, toast)) {
        throw new Error('SUBSCRIPTION_REQUIRED');
      }
      throw new Error(error.message);
    }
    return data;
  }

  // Bhashini API  
  static async translateWithBhashini(
    text: string,
    sourceLang: string, 
    targetLang: string,
    navigate?: any,
    toast?: any
  ): Promise<TranslationResponse> {
    const { data, error } = await supabase.functions.invoke('bhashini-translate', {
      body: { text, sourceLang, targetLang }
    });

    if (error) {
      if (data?.requiresSubscription && handleSubscriptionError(data, navigate, toast)) {
        throw new Error('SUBSCRIPTION_REQUIRED');
      }
      throw new Error(error.message);
    }
    return data;
  }

  // OpenAI Chat API
  static async generateWithOpenAI(
    message: string,
    context: string,
    purpose?: string,
    navigate?: any,
    toast?: any
  ): Promise<ChatResponse> {
    const { data, error } = await supabase.functions.invoke('openai-chat', {
      body: { message, context, purpose }
    });

    if (error) {
      if (data?.requiresSubscription && handleSubscriptionError(data, navigate, toast)) {
        throw new Error('SUBSCRIPTION_REQUIRED');
      }
      throw new Error(error.message);
    }
    return data;
  }

  // Google Cloud Speech Services
  static async synthesizeSpeech(
    text: string,
    language = 'en-IN',
    voice = 'en-IN-Wavenet-A',
    navigate?: any,
    toast?: any
  ): Promise<SpeechResponse> {
    const { data, error } = await supabase.functions.invoke('google-speech', {
      body: { text, language, voice }
    });

    if (error) {
      if (data?.requiresSubscription && handleSubscriptionError(data, navigate, toast)) {
        throw new Error('SUBSCRIPTION_REQUIRED');
      }
      throw new Error(error.message);
    }
    return data;
  }

  static async transcribeSpeech(
    audioData: string,
    language = 'hi-IN',
    navigate?: any,
    toast?: any
  ): Promise<TranscriptionResponse> {
    const { data, error } = await supabase.functions.invoke('google-speech?action=transcribe', {
      body: { audioData, language }
    });

    if (error) {
      if (data?.requiresSubscription && handleSubscriptionError(data, navigate, toast)) {
        throw new Error('SUBSCRIPTION_REQUIRED');
      }
      throw new Error(error.message);
    }
    return data;
  }

  // Translation using Google Translate only (Bhashini temporarily disabled)
  static async translate(
    text: string,
    sourceLang: string,
    targetLang: string,
    navigate?: any,
    toast?: any
  ): Promise<TranslationResponse> {
    return await this.translateWithGoogle(text, sourceLang, targetLang, navigate, toast);
  }
}