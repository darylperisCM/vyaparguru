import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Copy, 
  Save, 
  FileText, 
  MessageCircle, 
  HandHeart,
  AlertCircle,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmailTemplate {
  id: string;
  title: string;
  titleHindi: string;
  icon: any;
  description: string;
  category: string;
}

export default function EmailAssistant() {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [tone, setTone] = useState<string>('formal');
  const [subject, setSubject] = useState('');
  const [keyPoints, setKeyPoints] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [recentDrafts, setRecentDrafts] = useState<Array<{subject: string, preview: string}>>([]);

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

  const variables = [
    '{CustomerName}', '{CompanyName}', '{OrderId}', '{Date}', '{Amount}', '{ProductName}'
  ];

  const handleGenerateEmail = () => {
    if (!selectedTemplate || !subject || !keyPoints) {
      toast({
        title: "Missing Information",
        description: "Please select a template, subject, and key points",
        variant: "destructive"
      });
      return;
    }

    // Mock email generation - will be replaced with AI API
    const mockEmails: Record<string, string> = {
      inquiry: `Subject: ${subject}

Dear Sir/Madam,

I hope this email finds you well. I am writing to inquire about ${keyPoints}.

Could you please provide me with more information regarding:
- Product specifications and pricing
- Availability and delivery timeline
- Terms and conditions

I would appreciate if you could send me a detailed quotation at your earliest convenience.

Thank you for your time and consideration.

Best regards,
[Your Name]`,
      
      followup: `Subject: ${subject}

Dear [Recipient Name],

I hope you are doing well. I am writing to follow up on ${keyPoints}.

As discussed previously, I wanted to check on the status and see if you need any additional information from my side.

Please let me know if there are any updates or if I can assist in moving this forward.

Looking forward to your response.

Best regards,
[Your Name]`,
      
      proposal: `Subject: ${subject}

Dear [Recipient Name],

I trust this email finds you in good health and spirits.

I am pleased to submit our proposal for ${keyPoints}.

Our proposal includes:
- Comprehensive solution overview
- Competitive pricing structure
- Implementation timeline
- Support and maintenance details

We believe this partnership will be mutually beneficial and look forward to discussing this opportunity further.

Please feel free to contact me if you have any questions.

Warm regards,
[Your Name]`
    };

    const template = templates.find(t => t.id === selectedTemplate);
    let email = mockEmails[selectedTemplate] || mockEmails.inquiry;
    
    // Apply tone adjustments
    if (tone === 'friendly') {
      email = email.replace('Dear Sir/Madam', 'Hi there!');
      email = email.replace('Best regards', 'Warm regards');
    } else if (tone === 'concise') {
      email = email.split('\n').filter(line => line.trim() !== '').slice(0, -2).join('\n') + '\n\nRegards,\n[Your Name]';
    }

    setGeneratedEmail(email);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(generatedEmail);
    toast({
      title: "Copied!",
      description: "Email copied to clipboard"
    });
  };

  const handleSaveEmail = () => {
    if (generatedEmail && subject) {
      const draft = {
        subject: subject,
        preview: generatedEmail.substring(0, 100) + '...'
      };
      
      setRecentDrafts(prev => [draft, ...prev.slice(0, 4)]);
      
      // Save to localStorage
      const existingDrafts = JSON.parse(localStorage.getItem('beg_recent_emails') || '[]');
      localStorage.setItem('beg_recent_emails', JSON.stringify([draft, ...existingDrafts.slice(0, 4)]));
      
      toast({
        title: "Saved!",
        description: "Email saved to drafts"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/5 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2 flex items-center gap-2">
            <Mail className="h-8 w-8" />
            Email Writing Assistant
          </h1>
          <p className="text-muted-foreground">
            Create professional business emails in perfect English
          </p>
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

                <Button onClick={handleGenerateEmail} className="w-full" variant="hero">
                  Generate Professional Email
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
                    {recentDrafts.map((draft, index) => (
                      <div key={index} className="p-3 border rounded-lg hover:bg-accent/50 cursor-pointer">
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