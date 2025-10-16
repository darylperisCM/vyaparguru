import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Badge } from '@/components/ui/badge';
import { HomeButton } from '@/components/ui/home-button';
import { 
  Mail, 
  Copy, 
  Save, 
  FileText, 
  MessageCircle, 
  HandHeart,
  AlertCircle,
  TrendingUp,
  Clock,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { APIService } from '@/services/apiService';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface EmailTemplate {
  id: string;
  title: string;
  titleHindi: string;
  icon: any;
  description: string;
  category: string;
}

export default function EmailAssistant() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [tone, setTone] = useState<string>('formal');
  const [subject, setSubject] = useState('');
  const [keyPoints, setKeyPoints] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [recentDrafts, setRecentDrafts] = useState<Array<{id: string, subject: string, preview: string}>>([]);

  const templates: EmailTemplate[] = [
    {
      id: 'inquiry',
      title: 'Business Inquiry',
      titleHindi: 'व्यापारिक पूछताछ',
      icon: MessageCircle,
      description: 'Ask about products or services',
      category: 'sales'
    },
    {
      id: 'followup',
      title: 'Follow-up',
      titleHindi: 'फॉलो-अप',
      icon: Clock,
      description: 'Follow up on previous communication',
      category: 'general'
    },
    {
      id: 'proposal',
      title: 'Business Proposal',
      titleHindi: 'व्यापारिक प्रस्ताव',
      icon: TrendingUp,
      description: 'Submit a business proposal',
      category: 'sales'
    },
    {
      id: 'complaint',
      title: 'Complaint/Issue',
      titleHindi: 'शिकायत/समस्या',
      icon: AlertCircle,
      description: 'Report problems or concerns',
      category: 'support'
    },
    {
      id: 'thanks',
      title: 'Thank You',
      titleHindi: 'धन्यवाद',
      icon: HandHeart,
      description: 'Express gratitude',
      category: 'general'
    },
    {
      id: 'meeting',
      title: 'Meeting Request',
      titleHindi: 'मीटिंग अनुरोध',
      icon: FileText,
      description: 'Schedule meetings',
      category: 'general'
    }
  ];

  const tones = [
    { value: 'formal', label: 'Formal', labelHindi: 'औपचारिक' },
    { value: 'polite', label: 'Polite', labelHindi: 'विनम्र' },
    { value: 'friendly', label: 'Friendly', labelHindi: 'मित्रवत' },
    { value: 'concise', label: 'Concise', labelHindi: 'संक्षिप्त' }
  ];

  // Load recent drafts on component mount
  useEffect(() => {
    if (user) {
      loadRecentDrafts();
    }
  }, [user]);

  const loadRecentDrafts = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('email_drafts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      
      setRecentDrafts(data?.map(item => ({
        id: item.id,
        subject: item.subject,
        preview: item.content.substring(0, 100) + '...'
      })) || []);
    } catch (error) {
      console.error('Error loading drafts:', error);
    }
  };

  const variables = [
    '{CustomerName}', '{CompanyName}', '{OrderId}', '{Date}', '{Amount}', '{ProductName}'
  ];

  const handleGenerateEmail = async () => {
    if (!selectedTemplate || !subject || !keyPoints) {
      toast({
        title: "Missing Information",
        description: "Please select a template, subject, and key points",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const template = templates.find(t => t.id === selectedTemplate);
      const context = `Email Assistant - Generate a ${tone} ${template?.title} email`;
      const message = `Subject: ${subject}\nKey Points: ${keyPoints}\nTone: ${tone}\nPlease generate a professional business email.`;

      const result = await APIService.generateWithOpenAI(message, context, template?.category, navigate, toast);
      setGeneratedEmail(result.generatedText);
      
      // Save AI message to database
      if (user) {
        await supabase.from('ai_messages').insert({
          user_id: user.id,
          message: message,
          context: context,
          purpose: template?.category,
          generated_text: result.generatedText,
          model_used: 'gpt-4o-mini'
        });
      }
      
      toast({
        title: "Email Generated",
        description: "Professional email created successfully"
      });
    } catch (error: any) {
      console.error('Email generation error:', error);
      if (error.message !== 'SUBSCRIPTION_REQUIRED') {
        toast({
          title: "Generation Failed",
          description: "Please try again",
          variant: "destructive"
        });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(generatedEmail);
    toast({
      title: "Copied!",
      description: "Email copied to clipboard"
    });
  };

  const handleSaveEmail = async () => {
    if (!generatedEmail || !subject || !user) return;
    
    try {
      const { data, error } = await supabase
        .from('email_drafts')
        .insert({
          user_id: user.id,
          subject: subject,
          content: generatedEmail,
          tone: tone,
          template_id: selectedTemplate
        })
        .select()
        .single();
      
      if (error) throw error;
      
      const newDraft = {
        id: data.id,
        subject: data.subject,
        preview: data.content.substring(0, 100) + '...'
      };
      
      setRecentDrafts(prev => [newDraft, ...prev.slice(0, 4)]);
      
      toast({
        title: "Saved!",
        description: "Email saved to drafts"
      });
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        title: "Save Failed",
        description: "Could not save email draft",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/5 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2 flex items-center gap-2">
                <Mail className="h-8 w-8" />
                Email Writing Assistant
              </h1>
              <p className="text-muted-foreground">
                Create professional business emails in perfect English
              </p>
            </div>
            <HomeButton />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Email Builder */}
          <div className="lg:col-span-2 space-y-6">
            {/* Template Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Choose Email Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {templates.map((template) => (
                    <Button
                      key={template.id}
                      variant={selectedTemplate === template.id ? "default" : "outline"}
                      className="h-auto p-4 flex flex-col items-start"
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <template.icon className="h-4 w-4" />
                        <span className="font-medium">{template.title}</span>
                      </div>
                      <div className="text-xs text-left">
                        <p className="text-muted-foreground">{template.titleHindi}</p>
                        <p className="text-muted-foreground mt-1">{template.description}</p>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tone Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Tone</CardTitle>
              </CardHeader>
              <CardContent>
                <ToggleGroup type="single" value={tone} onValueChange={setTone}>
                  {tones.map((toneOption) => (
                    <ToggleGroupItem key={toneOption.value} value={toneOption.value} className="flex flex-col">
                      <span className="font-medium">{toneOption.label}</span>
                      <span className="text-xs text-muted-foreground">{toneOption.labelHindi}</span>
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </CardContent>
            </Card>

            {/* Email Details */}
            <Card>
              <CardHeader>
                <CardTitle>Email Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Subject Line</label>
                  <Input
                    placeholder="Enter email subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Key Points (in Hindi or English)</label>
                  <Textarea
                    placeholder="मुख्य बिंदु यहाँ लिखें... या in English"
                    value={keyPoints}
                    onChange={(e) => setKeyPoints(e.target.value)}
                    className="min-h-24"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Insert Variables</label>
                  <div className="flex flex-wrap gap-2">
                    {variables.map((variable) => (
                      <Badge
                        key={variable}
                        variant="secondary"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                        onClick={() => setKeyPoints(prev => prev + ' ' + variable)}
                      >
                        {variable}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button onClick={handleGenerateEmail} className="w-full" variant="hero" disabled={isGenerating}>
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  {isGenerating ? 'Generating Email...' : 'Generate Professional Email'}
                </Button>
              </CardContent>
            </Card>

            {/* Generated Email */}
            {generatedEmail && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Generated Email
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleCopyEmail}>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleSaveEmail}>
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-background p-4 rounded-lg border">
                    <pre className="whitespace-pre-wrap text-sm font-mono">
                      {generatedEmail}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Drafts */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Drafts</CardTitle>
              </CardHeader>
              <CardContent>
                {recentDrafts.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No saved drafts yet
                  </p>
                ) : (
                   <div className="space-y-3">
                     {recentDrafts.map((draft) => (
                       <div key={draft.id} className="p-3 border rounded-lg hover:bg-accent/50 cursor-pointer">
                         <p className="font-medium text-sm mb-1">{draft.subject}</p>
                         <p className="text-xs text-muted-foreground">{draft.preview}</p>
                       </div>
                     ))}
                   </div>
                )}
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Email Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p>Use clear and specific subject lines</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p>Keep emails concise and to the point</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p>Always proofread before sending</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p>Use professional greetings and closings</p>
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