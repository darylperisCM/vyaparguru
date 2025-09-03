-- Create enum for translation sources
CREATE TYPE public.translation_source AS ENUM ('google', 'bhashini', 'hybrid');

-- Create enum for speech operation types  
CREATE TYPE public.speech_operation AS ENUM ('synthesis', 'transcription');

-- Translation events table
CREATE TABLE public.translation_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  source_text TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  source_language TEXT NOT NULL,
  target_language TEXT NOT NULL,
  translation_source translation_source NOT NULL,
  confidence DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- AI messages table
CREATE TABLE public.ai_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  context TEXT,
  purpose TEXT,
  generated_text TEXT NOT NULL,
  model_used TEXT DEFAULT 'gpt-4o-mini',
  tokens_used INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Speech events table
CREATE TABLE public.speech_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  operation_type speech_operation NOT NULL,
  input_text TEXT,
  output_text TEXT,
  language TEXT NOT NULL DEFAULT 'hi-IN',
  voice_id TEXT,
  audio_duration INTEGER,
  success BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Favorite translations table
CREATE TABLE public.favorite_translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  hindi_text TEXT NOT NULL,
  english_text TEXT NOT NULL,
  confidence DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Email drafts table
CREATE TABLE public.email_drafts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  template_id TEXT,
  tone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Industry vocabulary progress table
CREATE TABLE public.industry_vocab_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  industry_id TEXT NOT NULL,
  vocab_item TEXT NOT NULL,
  is_learned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, industry_id, vocab_item)
);

-- Industry scenario progress table  
CREATE TABLE public.industry_scenario_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  industry_id TEXT NOT NULL,
  scenario_id TEXT NOT NULL,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, industry_id, scenario_id)
);

-- Enable Row Level Security on all tables
ALTER TABLE public.translation_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.speech_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorite_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industry_vocab_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industry_scenario_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for translation_events
CREATE POLICY "Users can view their own translation events" 
ON public.translation_events 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own translation events" 
ON public.translation_events 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for ai_messages
CREATE POLICY "Users can view their own AI messages" 
ON public.ai_messages 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own AI messages" 
ON public.ai_messages 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for speech_events
CREATE POLICY "Users can view their own speech events" 
ON public.speech_events 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own speech events" 
ON public.speech_events 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for favorite_translations
CREATE POLICY "Users can view their own favorite translations" 
ON public.favorite_translations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own favorite translations" 
ON public.favorite_translations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorite translations" 
ON public.favorite_translations 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for email_drafts
CREATE POLICY "Users can view their own email drafts" 
ON public.email_drafts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own email drafts" 
ON public.email_drafts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own email drafts" 
ON public.email_drafts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own email drafts" 
ON public.email_drafts 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for industry_vocab_progress
CREATE POLICY "Users can view their own vocab progress" 
ON public.industry_vocab_progress 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own vocab progress" 
ON public.industry_vocab_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vocab progress" 
ON public.industry_vocab_progress 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for industry_scenario_progress
CREATE POLICY "Users can view their own scenario progress" 
ON public.industry_scenario_progress 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own scenario progress" 
ON public.industry_scenario_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scenario progress" 
ON public.industry_scenario_progress 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_translation_events_updated_at
BEFORE UPDATE ON public.translation_events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_messages_updated_at
BEFORE UPDATE ON public.ai_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_speech_events_updated_at
BEFORE UPDATE ON public.speech_events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_favorite_translations_updated_at
BEFORE UPDATE ON public.favorite_translations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_email_drafts_updated_at
BEFORE UPDATE ON public.email_drafts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_industry_vocab_progress_updated_at
BEFORE UPDATE ON public.industry_vocab_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_industry_scenario_progress_updated_at
BEFORE UPDATE ON public.industry_scenario_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();