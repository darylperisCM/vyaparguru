import { useState } from 'react';
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
import { APIService } from '@/services/apiService';

export default function Translation() {
  const { toast } = useToast();
  const [hindiText, setHindiText] = useState('');
  const [englishText, setEnglishText] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [favorites, setFavorites] = useState<Array<{hindi: string, english: string}>>([]);

  const handleTranslate = async () => {
    if (!hindiText.trim()) return;
    
    setIsTranslating(true);
    try {
      const result = await APIService.translate(hindiText, 'hi', 'en');
      setEnglishText(result.translatedText);
      setConfidence(Math.round(result.confidence * 100));
      
      toast({
        title: "Translation Complete",
        description: `Translated using ${result.source === 'bhashini-api' ? 'Bhashini' : 'Google Translate'}`
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

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    
    if (!isListening) {
      toast({
        title: "Voice Input",
        description: "Voice recording will be available in the next update",
      });
      
      // Mock voice input for demo
      setTimeout(() => {
        setIsListening(false);
        setHindiText("नमस्ते, आपका व्यवसाय कैसा चल रहा है?");
      }, 2000);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(englishText);
    toast({
      title: "Copied!",
      description: "Translation copied to clipboard",
    });
  };

  const handleFavorite = () => {
    if (hindiText && englishText) {
      const newFavorite = { hindi: hindiText, english: englishText };
      setFavorites(prev => [...prev, newFavorite]);
      
      // Save to localStorage
      const existingFavorites = JSON.parse(localStorage.getItem('beg_favorites') || '[]');
      localStorage.setItem('beg_favorites', JSON.stringify([...existingFavorites, newFavorite]));
      
      toast({
        title: "Added to Favorites",
        description: "Translation saved for future reference",
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
                    onClick={() => toast({ title: "Text-to-Speech", description: "Audio playback coming soon!" })}
                    disabled={!englishText}
                  >
                    <Volume2 className="h-4 w-4" />
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
                  {favorites.map((item, index) => (
                    <div key={index} className="p-3 border rounded-lg hover:bg-accent/50 cursor-pointer">
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