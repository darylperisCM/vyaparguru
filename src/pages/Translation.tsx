import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { HomeButton } from '@/components/ui/home-button';
import { 
  Mic, 
  Copy, 
  Star, 
  Volume2, 
  ArrowRight, 
  Heart,
  BookOpen,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAudioRecording } from '@/hooks/useAudioRecording';
import { APIService } from '@/services/apiService';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export default function Translation() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { isRecording, startRecording, stopRecording, error: recordingError } = useAudioRecording();
  const [hindiText, setHindiText] = useState('');
  const [englishText, setEnglishText] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [favorites, setFavorites] = useState<Array<{id: string, hindi: string, english: string}>>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Load favorites on component mount
  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  const loadFavorites = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('favorite_translations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setFavorites(data?.map(item => ({
        id: item.id,
        hindi: item.hindi_text,
        english: item.english_text
      })) || []);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const handleTranslate = async () => {
    if (!hindiText.trim()) return;
    
    setIsTranslating(true);
    try {
      const result = await APIService.translate(hindiText, 'hi', 'en');
      setEnglishText(result.translatedText);
      setConfidence(Math.round(result.confidence * 100));
      
      // Save translation event to database
      if (user) {
        await supabase.from('translation_events').insert({
          user_id: user.id,
          source_text: hindiText,
          translated_text: result.translatedText,
          source_language: 'hi',
          target_language: 'en',
          translation_source: 'google',
          confidence: result.confidence
        });
      }
      
      toast({
        title: "Translation Complete",
        description: "Translated using Google Translate"
      });
    } catch (error) {
      console.error('Translation error:', error);
      toast({
        title: "Translation Failed", 
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const handleVoiceInput = async () => {
    if (!isListening) {
      try {
        await startRecording();
        setIsListening(true);
        toast({
          title: "Recording Started",
          description: "Speak now in Hindi...",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to start recording. Please check microphone permissions.",
          variant: "destructive"
        });
      }
    } else {
      try {
        const audioData = await stopRecording();
        setIsListening(false);
        
        if (audioData) {
          toast({
            title: "Processing Audio",
            description: "Converting speech to text...",
          });
          
          const result = await APIService.transcribeSpeech(audioData, 'hi-IN');
          setHindiText(result.transcription);
          
          toast({
            title: "Speech Recognized",
            description: `Confidence: ${Math.round(result.confidence * 100)}%`,
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to process audio",
          variant: "destructive"
        });
        setIsListening(false);
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(englishText);
    toast({
      title: "Copied!",
      description: "Translation copied to clipboard",
    });
  };

  const handlePlayAudio = async () => {
    if (!englishText || !user) return;
    
    setIsSpeaking(true);
    try {
      const result = await APIService.synthesizeSpeech(englishText, 'en-IN', 'en-IN-Wavenet-A');
      
      if (result.success) {
        // Convert base64 to audio blob and play
        const audioData = result.audioData;
        const byteCharacters = atob(audioData.split(',')[1]); // Remove data:audio/mp3;base64, prefix
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {type: 'audio/mp3'});
        const audio = new Audio(URL.createObjectURL(blob));
        
        audio.onended = () => setIsSpeaking(false);
        await audio.play();
        
        // Log speech event
        await supabase.from('speech_events').insert({
          user_id: user.id,
          input_text: englishText,
          language: 'en-IN',
          voice_id: 'en-IN-Wavenet-A',
          operation_type: 'synthesis',
          success: true
        });
        
        toast({
          title: "Playing Audio",
          description: "Text-to-speech generated successfully"
        });
      }
    } catch (error) {
      console.error('Speech synthesis error:', error);
      toast({
        title: "Speech Failed",
        description: "Could not generate audio",
        variant: "destructive"
      });
    } finally {
      setIsSpeaking(false);
    }
  };

  const handleFavorite = async () => {
    if (!hindiText || !englishText || !user) return;
    
    try {
      const { data, error } = await supabase
        .from('favorite_translations')
        .insert({
          user_id: user.id,
          hindi_text: hindiText,
          english_text: englishText,
          confidence: confidence / 100
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setFavorites(prev => [{
        id: data.id,
        hindi: data.hindi_text,
        english: data.english_text
      }, ...prev]);
      
      toast({
        title: "Added to Favorites",
        description: "Translation saved for future reference",
      });
    } catch (error) {
      console.error('Error saving favorite:', error);
      toast({
        title: "Save Failed",
        description: "Could not save to favorites",
        variant: "destructive"
      });
    }
  };

  const commonPhrases = [
    'नमस्ते, आपका व्यवसाय कैसा चल रहा है?',
    'कृपया अपना प्रस्ताव भेजें',
    'हमें आपके उत्पाद में रुचि है',
    'बैठक कल 3 बजे रखी गई है',
    'धन्यवाद आपके समय के लिए'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/5 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2 flex items-center gap-2">
                <BookOpen className="h-8 w-8" />
                Real-Time Translation Coach
              </h1>
              <p className="text-muted-foreground">
                Translate Hindi to professional English instantly
              </p>
            </div>
            <HomeButton />
          </div>
        </div>

        {/* Main Translation Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Hindi Input */}
          <Card className="gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>हिंदी में लिखें</span>
                <Button
                  variant={isListening ? "destructive" : "outline"}
                  size="icon"
                  onClick={handleVoiceInput}
                  className={isListening ? "animate-pulse" : ""}
                >
                  <Mic className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="यहाँ अपना व्यापारिक संदेश हिंदी में लिखें..."
                value={hindiText}
                onChange={(e) => setHindiText(e.target.value)}
                className="min-h-32 text-lg"
              />
              <Button 
                onClick={handleTranslate}
                className="w-full mt-4"
                variant="hero"
                disabled={!hindiText.trim() || isTranslating}
              >
                {isTranslating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <ArrowRight className="h-4 w-4 mr-2" />
                )}
                {isTranslating ? 'Translating...' : 'Translate to English'}
              </Button>
            </CardContent>
          </Card>

          {/* English Output */}
          <Card className="gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Professional English</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePlayAudio}
                    disabled={!englishText || isSpeaking}
                  >
                    {isSpeaking ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopy}
                    disabled={!englishText}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleFavorite}
                    disabled={!englishText}
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="min-h-32 p-4 bg-background rounded-lg border text-lg">
                {englishText || (
                  <span className="text-muted-foreground italic">
                    English translation will appear here...
                  </span>
                )}
              </div>
              
              {confidence > 0 && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Confidence Score</span>
                    <span>{confidence}%</span>
                  </div>
                  <Progress value={confidence} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Common Phrases */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Common Business Phrases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {commonPhrases.map((phrase, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full text-left justify-start h-auto p-3"
                    onClick={() => setHindiText(phrase)}
                  >
                    <span className="text-sm">{phrase}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Favorites */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Saved Translations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {favorites.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No saved translations yet. Click the star icon to save your favorites!
                </p>
              ) : (
                 <div className="space-y-3 max-h-64 overflow-y-auto">
                   {favorites.map((item) => (
                     <div key={item.id} className="p-3 border rounded-lg hover:bg-accent/50 cursor-pointer">
                       <p className="text-sm font-medium mb-1">{item.hindi}</p>
                       <p className="text-xs text-muted-foreground">{item.english}</p>
                     </div>
                   ))}
                 </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}