import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  ShoppingCart, 
  Stethoscope, 
  Truck, 
  Utensils, 
  Wrench,
  Star,
  BookOpen,
  PlayCircle,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Industry {
  id: string;
  name: string;
  nameHindi: string;
  icon: any;
  description: string;
  vocabularyCount: number;
  scenarioCount: number;
  progress: number;
}

interface VocabularyItem {
  hindi: string;
  english: string;
  pronunciation?: string;
  example?: string;
}

interface Scenario {
  id: string;
  title: string;
  titleHindi: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  completed: boolean;
}

export default function IndustryModules() {
  const { toast } = useToast();
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [currentTab, setCurrentTab] = useState<'vocabulary' | 'scenarios'>('vocabulary');

  const industries: Industry[] = [
    {
      id: 'retail',
      name: 'Retail',
      nameHindi: 'खुदरा व्यापार',
      icon: ShoppingCart,
      description: 'Shopping, sales, customer service',
      vocabularyCount: 150,
      scenarioCount: 25,
      progress: 35
    },
    {
      id: 'manufacturing',
      name: 'Manufacturing',
      nameHindi: 'विनिर्माण',
      icon: Building2,
      description: 'Production, quality, supply chain',
      vocabularyCount: 200,
      scenarioCount: 30,
      progress: 20
    },
    {
      id: 'services',
      name: 'Services',
      nameHindi: 'सेवाएं',
      icon: Wrench,
      description: 'Consulting, maintenance, support',
      vocabularyCount: 120,
      scenarioCount: 20,
      progress: 50
    },
    {
      id: 'hospitality',
      name: 'Hospitality',
      nameHindi: 'आतिथ्य',
      icon: Utensils,
      description: 'Hotels, restaurants, events',
      vocabularyCount: 180,
      scenarioCount: 35,
      progress: 10
    },
    {
      id: 'healthcare',
      name: 'Healthcare',
      nameHindi: 'स्वास्थ्य सेवा',
      icon: Stethoscope,
      description: 'Medical, pharmacy, wellness',
      vocabularyCount: 250,
      scenarioCount: 40,
      progress: 5
    },
    {
      id: 'logistics',
      name: 'Logistics',
      nameHindi: 'रसद',
      icon: Truck,
      description: 'Shipping, delivery, warehouse',
      vocabularyCount: 140,
      scenarioCount: 22,
      progress: 65
    }
  ];

  const vocabularyData: Record<string, VocabularyItem[]> = {
    retail: [
      { 
        hindi: 'ग्राहक', 
        english: 'Customer', 
        pronunciation: '/ˈkʌstəmər/',
        example: 'The customer is always right.'
      },
      { 
        hindi: 'बिक्री', 
        english: 'Sales', 
        pronunciation: '/seɪlz/',
        example: 'Our sales increased this month.'
      },
      { 
        hindi: 'छूट', 
        english: 'Discount', 
        pronunciation: '/ˈdɪskaʊnt/',
        example: 'We offer a 20% discount.'
      },
      { 
        hindi: 'इन्वेंट्री', 
        english: 'Inventory', 
        pronunciation: '/ˈɪnvəntri/',
        example: 'Check our inventory levels.'
      },
      { 
        hindi: 'रसीद', 
        english: 'Receipt', 
        pronunciation: '/rɪˈsiːt/',
        example: 'Keep your receipt for returns.'
      }
    ],
    manufacturing: [
      { 
        hindi: 'उत्पादन', 
        english: 'Production', 
        pronunciation: '/prəˈdʌkʃən/',
        example: 'Production will start next week.'
      },
      { 
        hindi: 'गुणवत्ता', 
        english: 'Quality', 
        pronunciation: '/ˈkwɒləti/',
        example: 'We maintain high quality standards.'
      },
      { 
        hindi: 'मशीन', 
        english: 'Machine', 
        pronunciation: '/məˈʃiːn/',
        example: 'The machine needs maintenance.'
      },
      { 
        hindi: 'कच्चा माल', 
        english: 'Raw Materials', 
        pronunciation: '/rɔː məˈtɪəriəlz/',
        example: 'We need more raw materials.'
      }
    ]
  };

  const scenarioData: Record<string, Scenario[]> = {
    retail: [
      {
        id: 'customer-greeting',
        title: 'Customer Greeting',
        titleHindi: 'ग्राहक स्वागत',
        description: 'Learn how to greet customers professionally',
        difficulty: 'beginner',
        completed: true
      },
      {
        id: 'product-inquiry',
        title: 'Product Inquiry',
        titleHindi: 'उत्पाद पूछताछ',
        description: 'Handle customer product questions',
        difficulty: 'intermediate',
        completed: false
      },
      {
        id: 'complaint-handling',
        title: 'Complaint Handling',
        titleHindi: 'शिकायत निपटान',
        description: 'Resolve customer complaints effectively',
        difficulty: 'advanced',
        completed: false
      }
    ],
    manufacturing: [
      {
        id: 'safety-briefing',
        title: 'Safety Briefing',
        titleHindi: 'सुरक्षा ब्रीफिंग',
        description: 'Conduct safety meetings in English',
        difficulty: 'intermediate',
        completed: false
      },
      {
        id: 'quality-check',
        title: 'Quality Inspection',
        titleHindi: 'गुणवत्ता निरीक्षण',
        description: 'Report quality issues professionally',
        difficulty: 'advanced',
        completed: false
      }
    ]
  };

  const handleIndustrySelect = (industryId: string) => {
    setSelectedIndustry(industryId);
    setCurrentTab('vocabulary');
  };

  const handleCopyVocabulary = (item: VocabularyItem) => {
    const text = `${item.hindi} - ${item.english}${item.example ? '\nExample: ' + item.example : ''}`;
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Vocabulary item copied to clipboard"
    });
  };

  const handleMarkProgress = (itemType: 'vocabulary' | 'scenario', itemId?: string) => {
    // Mock progress tracking - will be replaced with Supabase
    const progressKey = `beg_industry_progress_${selectedIndustry}`;
    const existingProgress = JSON.parse(localStorage.getItem(progressKey) || '{}');
    
    if (itemType === 'vocabulary') {
      existingProgress.vocabularyViewed = (existingProgress.vocabularyViewed || 0) + 1;
    } else if (itemId) {
      existingProgress.scenariosCompleted = existingProgress.scenariosCompleted || [];
      if (!existingProgress.scenariosCompleted.includes(itemId)) {
        existingProgress.scenariosCompleted.push(itemId);
      }
    }
    
    localStorage.setItem(progressKey, JSON.stringify(existingProgress));
    
    toast({
      title: "Progress Updated",
      description: "Your learning progress has been saved"
    });
  };

  const selectedIndustryData = industries.find(ind => ind.id === selectedIndustry);
  const currentVocabulary = vocabularyData[selectedIndustry] || [];
  const currentScenarios = scenarioData[selectedIndustry] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/5 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2 flex items-center gap-2">
            <Building2 className="h-8 w-8" />
            Industry-Specific Learning
          </h1>
          <p className="text-muted-foreground">
            Master business English for your specific industry
          </p>
        </div>

        {!selectedIndustry ? (
          /* Industry Selection */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((industry) => (
              <Card 
                key={industry.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                onClick={() => handleIndustrySelect(industry.id)}
              >
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <industry.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="flex flex-col gap-1">
                    <span>{industry.name}</span>
                    <span className="text-sm font-normal text-muted-foreground">{industry.nameHindi}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 text-center">
                    {industry.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{industry.progress}%</span>
                    </div>
                    <Progress value={industry.progress} className="h-2" />
                    
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{industry.vocabularyCount} words</span>
                      <span>{industry.scenarioCount} scenarios</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Industry Content */
          <div>
            <div className="flex items-center gap-4 mb-6">
              <Button 
                variant="ghost" 
                onClick={() => setSelectedIndustry('')}
              >
                ← Back to Industries
              </Button>
              
              <div className="flex items-center gap-2">
                {selectedIndustryData && <selectedIndustryData.icon className="h-6 w-6 text-primary" />}
                <h2 className="text-xl font-semibold">{selectedIndustryData!.name}</h2>
                <span className="text-muted-foreground">({selectedIndustryData!.nameHindi})</span>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6">
              <Button
                variant={currentTab === 'vocabulary' ? 'default' : 'outline'}
                onClick={() => setCurrentTab('vocabulary')}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Vocabulary
              </Button>
              <Button
                variant={currentTab === 'scenarios' ? 'default' : 'outline'}
                onClick={() => setCurrentTab('scenarios')}
              >
                <PlayCircle className="h-4 w-4 mr-2" />
                Scenarios
              </Button>
            </div>

            {currentTab === 'vocabulary' ? (
              /* Vocabulary Section */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentVocabulary.map((item, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{item.hindi}</h3>
                          <p className="text-primary font-medium">{item.english}</p>
                          {item.pronunciation && (
                            <p className="text-xs text-muted-foreground italic">{item.pronunciation}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyVocabulary(item)}
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {item.example && (
                        <div className="mt-3 p-2 bg-accent/20 rounded text-sm">
                          <strong>Example:</strong> {item.example}
                        </div>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-3"
                        onClick={() => handleMarkProgress('vocabulary')}
                      >
                        Mark as Learned
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              /* Scenarios Section */
              <div className="space-y-4">
                {currentScenarios.map((scenario) => (
                  <Card key={scenario.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{scenario.title}</h3>
                            <span className="text-sm text-muted-foreground">({scenario.titleHindi})</span>
                            <Badge 
                              variant={scenario.difficulty === 'beginner' ? 'secondary' : 
                                     scenario.difficulty === 'intermediate' ? 'default' : 'destructive'}
                            >
                              {scenario.difficulty}
                            </Badge>
                            {scenario.completed && (
                              <CheckCircle className="h-5 w-5 text-success" />
                            )}
                          </div>
                          <p className="text-muted-foreground mb-4">{scenario.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline"
                          onClick={() => toast({ title: "Coming Soon", description: "Practice scenarios will be available in the next update" })}
                        >
                          <PlayCircle className="h-4 w-4 mr-2" />
                          Practice
                        </Button>
                        
                        <Button 
                          variant="ghost"
                          onClick={() => handleMarkProgress('scenario', scenario.id)}
                          disabled={scenario.completed}
                        >
                          {scenario.completed ? 'Completed' : 'Mark Complete'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}