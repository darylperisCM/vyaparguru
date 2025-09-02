import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Send, 
  Copy, 
  Lightbulb, 
  Clock,
  CheckCheck,
  Phone
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  type: 'hindi' | 'english';
  text: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
}

export default function WhatsAppPro() {
  const { toast } = useToast();
  const [currentMessage, setCurrentMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedPurpose, setSelectedPurpose] = useState<string>('');

  const quickReplies = [
    { id: 'acknowledge', text: 'Acknowledgment', hindi: 'पावती', purpose: 'confirm receipt' },
    { id: 'followup', text: 'Follow-up', hindi: 'फॉलो-अप', purpose: 'check status' },
    { id: 'payment', text: 'Payment Link', hindi: 'भुगतान लिंक', purpose: 'request payment' },
    { id: 'appointment', text: 'Appointment', hindi: 'अपॉइंटमेंट', purpose: 'schedule meeting' },
    { id: 'thanks', text: 'Thank You', hindi: 'धन्यवाद', purpose: 'express gratitude' },
    { id: 'info', text: 'Information', hindi: 'जानकारी', purpose: 'provide details' }
  ];

  const businessScenarios = [
    { 
      category: 'Customer Service',
      categoryHindi: 'ग्राहक सेवा',
      phrases: [
        { hindi: 'आपकी शिकायत मिल गई है', english: 'We have received your complaint' },
        { hindi: 'हम इसे जल्दी हल करेंगे', english: 'We will resolve this quickly' },
        { hindi: 'क्या और कोई सहायता चाहिए?', english: 'Do you need any other assistance?' }
      ]
    },
    {
      category: 'Sales',
      categoryHindi: 'बिक्री',
      phrases: [
        { hindi: 'नया ऑफर उपलब्ध है', english: 'New offer available' },
        { hindi: 'सीमित समय के लिए छूट', english: 'Limited time discount' },
        { hindi: 'आज ही ऑर्डर करें', english: 'Order today' }
      ]
    }
  ];

  const generateSuggestion = (hindiText: string, purpose?: string) => {
    // Mock suggestions - will be replaced with AI API
    const suggestions: Record<string, string> = {
      'धन्यवाद': 'Thank you very much!',
      'नमस्ते': 'Hello! How can I help you?',
      'कैसे हैं आप?': 'How are you doing?',
      'व्यवसाय कैसा चल रहा है?': 'How is business going?',
      'मीटिंग कल है': 'The meeting is tomorrow',
      'पैसे कब मिलेंगे?': 'When will the payment be received?',
      'ऑर्डर तैयार है': 'Your order is ready',
      'डिलीवरी कब होगी?': 'When will the delivery be?'
    };

    const baseSuggestion = suggestions[hindiText] || `Professional English: "${hindiText}"`;
    
    // Modify based on purpose
    if (purpose === 'payment') {
      return `${baseSuggestion}\n\nPayment link: [Your payment link here]`;
    } else if (purpose === 'appointment') {
      return `${baseSuggestion}\n\nShall we schedule a meeting to discuss this further?`;
    }
    
    return baseSuggestion;
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    const hindiMessage: Message = {
      id: Date.now().toString(),
      type: 'hindi',
      text: currentMessage,
      timestamp: new Date().toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      status: 'sent'
    };

    const englishSuggestion = generateSuggestion(currentMessage, selectedPurpose);
    
    const englishMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'english',
      text: englishSuggestion,
      timestamp: new Date().toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      status: 'delivered'
    };

    setMessages(prev => [...prev, hindiMessage, englishMessage]);
    setCurrentMessage('');
    setSelectedPurpose('');
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Message copied to clipboard"
    });
  };

  const handleQuickReply = (reply: typeof quickReplies[0]) => {
    setSelectedPurpose(reply.purpose);
    setCurrentMessage(reply.hindi);
  };

  const handlePhraseSelect = (phrase: { hindi: string; english: string }) => {
    setCurrentMessage(phrase.hindi);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/5 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2 flex items-center gap-2">
            <Phone className="h-8 w-8" />
            WhatsApp Business Pro
          </h1>
          <p className="text-muted-foreground">
            Professional business communication made easy
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="bg-success text-success-foreground">
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Business Chat Helper
                </CardTitle>
              </CardHeader>
              
              {/* Messages Area */}
              <CardContent className="flex-1 p-0">
                <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <div className="text-center">
                        <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Start typing your message in Hindi below</p>
                        <p className="text-sm">Get professional English suggestions instantly</p>
                      </div>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === 'hindi' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg relative group ${
                            message.type === 'hindi'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary text-secondary-foreground border'
                          }`}
                        >
                          {message.type === 'english' && (
                            <div className="flex items-center gap-1 mb-2 text-xs opacity-70">
                              <Lightbulb className="h-3 w-3" />
                              Suggested English
                            </div>
                          )}
                          
                          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                          
                          <div className={`flex items-center justify-between mt-2 text-xs ${
                            message.type === 'hindi' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                          }`}>
                            <span>{message.timestamp}</span>
                            <div className="flex items-center gap-1">
                              {message.type === 'english' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 opacity-70 hover:opacity-100"
                                  onClick={() => handleCopyToClipboard(message.text)}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              )}
                              {message.status === 'read' && <CheckCheck className="h-3 w-3 text-blue-500" />}
                              {message.status === 'delivered' && <CheckCheck className="h-3 w-3" />}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
              
              {/* Input Area */}
              <div className="border-t p-4">
                {selectedPurpose && (
                  <div className="mb-2">
                    <Badge variant="secondary" className="text-xs">
                      Purpose: {selectedPurpose}
                    </Badge>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Input
                    placeholder="अपना संदेश हिंदी में लिखें..."
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!currentMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Replies */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Replies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {quickReplies.map((reply) => (
                    <Button
                      key={reply.id}
                      variant="outline"
                      size="sm"
                      className="h-auto p-3 flex flex-col"
                      onClick={() => handleQuickReply(reply)}
                    >
                      <span className="font-medium text-xs">{reply.text}</span>
                      <span className="text-xs text-muted-foreground">{reply.hindi}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Business Scenarios */}
            <Card>
              <CardHeader>
                <CardTitle>Common Phrases</CardTitle>
              </CardHeader>
              <CardContent className="max-h-80 overflow-y-auto">
                {businessScenarios.map((scenario, index) => (
                  <div key={index} className="mb-4">
                    <h4 className="font-medium text-sm mb-2">
                      {scenario.category} ({scenario.categoryHindi})
                    </h4>
                    <div className="space-y-1">
                      {scenario.phrases.map((phrase, phraseIndex) => (
                        <Button
                          key={phraseIndex}
                          variant="ghost"
                          size="sm"
                          className="w-full text-left justify-start h-auto p-2"
                          onClick={() => handlePhraseSelect(phrase)}
                        >
                          <div className="text-xs">
                            <div className="font-medium">{phrase.hindi}</div>
                            <div className="text-muted-foreground">{phrase.english}</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Usage Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                    <p>Copy suggested text and paste directly into WhatsApp</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                    <p>Use quick replies for common business scenarios</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <MessageCircle className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                    <p>Add context by selecting a purpose before typing</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}