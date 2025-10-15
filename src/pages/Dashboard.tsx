import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useCountUp } from '@/hooks/useCountUp';
import { useToast } from '@/hooks/use-toast';
import { useSubscription } from '@/hooks/useSubscription';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Languages, 
  Mail, 
  MessageSquare, 
  Building2, 
  TrendingUp, 
  Clock,
  Target,
  Award,
  Activity,
  Zap,
  UserX,
  CreditCard,
  Calendar,
  Loader2
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    subscription, 
    isInTrial, 
    isActive, 
    daysUntilTrialEnd, 
    trialEndsAt, 
    nextBillingDate,
    refetch 
  } = useSubscription();
  const { translationsToday, emailsToday, learningStreak, loading: metricsLoading } = useDashboardMetrics();
  const [processingPayment, setProcessingPayment] = useState(false);

  // Count-up animations with staggered delays
  const animatedTranslations = useCountUp(translationsToday, 1500, 400);
  const animatedEmails = useCountUp(emailsToday, 1500, 600);
  const animatedStreak = useCountUp(learningStreak, 1500, 800);

  // Note: Recent activity will show real data when user has activity
  const recentActivity: Array<{ type: string; text: string; time: string }> = [];

  const quickActions = [
    {
      title: 'Start Translating',
      titleHindi: 'अनुवाद शुरू करें',
      description: 'Hindi to English translation',
      descriptionHindi: 'हिंदी से अंग्रेजी अनुवाद',
      icon: Languages,
      route: '/translation',
      gradient: 'from-primary to-primary-hover',
      hoverGradient: 'hover:from-primary-hover hover:to-primary'
    },
    {
      title: 'Write an Email',
      titleHindi: 'ईमेल लिखें',
      description: 'Professional email assistant',
      descriptionHindi: 'व्यावसायिक ईमेल सहायक',
      icon: Mail,
      route: '/email',
      gradient: 'from-success to-success/80',
      hoverGradient: 'hover:from-success/80 hover:to-success'
    },
    {
      title: 'Industry Modules',
      titleHindi: 'उद्योग मॉड्यूल',
      description: 'Sector-specific learning',
      descriptionHindi: 'क्षेत्र-विशेष सीखना',
      icon: Building2,
      route: '/industry',
      gradient: 'from-muted-foreground to-muted-foreground/80',
      hoverGradient: 'hover:from-muted-foreground/80 hover:to-muted-foreground'
    }
  ];

  const handleUnsubscribe = () => {
    toast({
      title: "Subscription Will End",
      description: "Your subscription will end at the end of current billing cycle.",
      duration: 5000,
    });
  };

  const handleSubscribeNow = async () => {
    setProcessingPayment(true);

    try {
      let subscriptionId = subscription?.rzp_subscription_id;

      // If no Razorpay subscription ID, create it first
      if (!subscriptionId) {
        console.log('No Razorpay subscription ID found, creating one...');
        
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) {
          throw new Error('User not authenticated');
        }

        const { data: subData, error: subError } = await supabase.functions.invoke('razorpay-subscription', {
          body: { 
            action: 'create-subscription',
            userId: authUser.id 
          }
        });

        if (subError || !subData?.subscription_id) {
          console.error('Failed to create Razorpay subscription:', subError);
          toast({
            title: "Error",
            description: "Failed to initialize subscription. Please ensure Razorpay secrets are configured.",
            variant: "destructive",
          });
          setProcessingPayment(false);
          return;
        }

        subscriptionId = subData.subscription_id;
        console.log('Created Razorpay subscription:', subscriptionId);
        
        // Refetch subscription to get updated data
        await refetch();
      }

      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          subscription_id: subscriptionId,
          name: 'VyaparGuru',
          description: 'VyaparGuru - व्यापार गुरु',
          image: '/assets/fulllogo.png',
          handler: async function (response: any) {
            console.log('Payment successful:', response);
            toast({
              title: "Payment Successful!",
              description: "Your subscription is now active.",
            });
            window.location.reload();
          },
          prefill: {
            email: user?.email || '',
            contact: ''
          },
          theme: {
            color: '#FF6B6B'
          },
          modal: {
            ondismiss: function () {
              setProcessingPayment(false);
            }
          },
          config: {
            display: {
              blocks: {
                banks: {
                  name: 'Pay via UPI',
                  instruments: [
                    {
                      method: 'upi'
                    }
                  ]
                }
              },
              sequence: ['block.banks'],
              preferences: {
                show_default_blocks: false
              }
            }
          }
        };

        // @ts-ignore
        const rzp = new window.Razorpay(options);
        rzp.open();
      };
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "Failed to open payment gateway. Please try again.",
        variant: "destructive"
      });
      setProcessingPayment(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Dashboard - VyaparGuru | Your Business English Learning Hub</title>
        <meta name="description" content="Access your personalized dashboard for business English learning. Track progress, quick actions for translation, email writing and industry modules." />
        <meta name="keywords" content="dashboard, business english, learning progress, translation, email writing, industry modules" />
        <link rel="canonical" href="/dashboard" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container py-4 sm:py-6 lg:py-8 px-4 sm:px-6">
          {/* Welcome Header */}
          <div className="mb-6 sm:mb-8 text-center animate-fade-in">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2">
              Welcome back! 🙏
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              Continue your English business journey today
            </p>
          </div>

          {/* Subscription Status Card - Compact */}
          {subscription && (
            <section className="mb-4">
              <Card className="border border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-4 w-4 text-primary flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">
                          {subscription.plan_name || 'VyaparGuru'}
                          {isInTrial && (
                            <Badge variant="secondary" className="ml-2 bg-primary/20 text-primary border-primary/30 text-xs">
                              Trial
                            </Badge>
                          )}
                          {isActive && (
                            <Badge variant="default" className="ml-2 bg-success/20 text-success border-success/30 text-xs">
                              Active
                            </Badge>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {isInTrial && trialEndsAt && (
                            <>{daysUntilTrialEnd} {daysUntilTrialEnd === 1 ? 'day' : 'days'} remaining</>
                          )}
                          {isActive && nextBillingDate && (
                            <>Next billing: {nextBillingDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</>
                          )}
                        </p>
                      </div>
                    </div>
                    {isInTrial && (
                      <Button 
                        onClick={handleSubscribeNow}
                        disabled={processingPayment}
                        size="sm"
                        className="text-xs"
                      >
                        {processingPayment ? (
                          <>
                            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          'Subscribe ₹99/mo'
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          {/* Quick Actions Section - Enhanced */}
          <section className="mb-8 sm:mb-10 lg:mb-12">
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2 flex items-center justify-center gap-2">
                <Zap className="h-6 w-6 text-primary" />
                Quick Actions
              </h2>
              <p className="text-sm text-muted-foreground">Click any card below to get started</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {quickActions.map((action, index) => (
                <Card 
                  key={index}
                  className="group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-3 active:scale-95 min-h-[180px] sm:min-h-[200px] overflow-hidden border-2 border-transparent hover:border-primary/30 relative"
                  onClick={() => navigate(action.route)}
                >
                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  
                  <CardContent className="p-6 sm:p-8 text-center h-full flex flex-col justify-center relative z-10">
                    <div className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${action.gradient} text-white mb-4 sm:mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-xl mx-auto`}>
                      <action.icon className="h-8 w-8 sm:h-10 sm:w-10" />
                    </div>
                    <div className="mb-2">
                      <h3 className="font-bold text-lg sm:text-xl group-hover:text-primary transition-colors duration-300">
                        {action.title}
                      </h3>
                      <p className="text-base sm:text-lg font-semibold text-muted-foreground/90 mt-1 font-hindi">
                        {action.titleHindi}
                      </p>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                        {action.description}
                      </p>
                      <p className="text-sm text-muted-foreground/80 leading-relaxed mt-1 font-hindi">
                        {action.descriptionHindi}
                      </p>
                    </div>
                    
                    <div className="mt-auto pt-4">
                      <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all duration-300">
                        <span>Get Started</span>
                        <span className="font-hindi">शुरू करें</span>
                        <span className="text-lg group-hover:translate-x-1 transition-transform duration-300">→</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Progress Stats Section */}
          <section className="mb-8 sm:mb-10 lg:mb-12">
            <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-4 sm:mb-6 flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Today's Progress
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <Card className="group min-h-[100px] sm:min-h-[120px] hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-4 sm:p-6 h-full flex items-center">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Today's Translations</p>
                      <p className="text-xl sm:text-2xl font-bold tabular-nums">{animatedTranslations}</p>
                    </div>
                    <div className="flex-shrink-0 ml-2 p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                      <Languages className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group min-h-[100px] sm:min-h-[120px] hover:shadow-lg hover:shadow-success/5 transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-4 sm:p-6 h-full flex items-center">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Emails Generated</p>
                      <p className="text-xl sm:text-2xl font-bold tabular-nums">{animatedEmails}</p>
                    </div>
                    <div className="flex-shrink-0 ml-2 p-2 rounded-lg bg-success/10 group-hover:bg-success/20 transition-colors duration-300">
                      <Mail className="h-6 w-6 sm:h-8 sm:w-8 text-success" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group min-h-[100px] sm:min-h-[120px] hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-4 sm:p-6 h-full flex items-center">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Learning Streak</p>
                      <p className="text-xl sm:text-2xl font-bold tabular-nums">{animatedStreak} days</p>
                    </div>
                    <div className="flex-shrink-0 ml-2 p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                      <Award className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Weekly Progress Section */}
            <section className="lg:col-span-2">
              <Card className="hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                <CardHeader className="pb-4 sm:pb-6">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    📈 Weekly Progress
                  </CardTitle>
                  <CardDescription className="text-sm">Your learning progress this week</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Overall Progress</span>
                      <span className="text-sm text-muted-foreground">0%</span>
                    </div>
                    <Progress 
                      value={0} 
                      className="h-3 shadow-sm" 
                      animated={true}
                      animationDuration={2000}
                      animationDelay={1200}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="group flex items-center gap-3 p-3 sm:p-4 rounded-lg bg-accent/10 hover:bg-accent/20 transition-all duration-300 min-h-[80px] hover:shadow-md">
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                        <Target className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm font-medium text-muted-foreground">Daily Goal</p>
                        <p className="text-base sm:text-lg font-semibold">{translationsToday + emailsToday}/20 tasks</p>
                      </div>
                    </div>
                    
                    <div className="group flex items-center gap-3 p-3 sm:p-4 rounded-lg bg-accent/10 hover:bg-accent/20 transition-all duration-300 min-h-[80px] hover:shadow-md">
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                        <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm font-medium text-muted-foreground">Learning Time</p>
                        <p className="text-base sm:text-lg font-semibold">0 hours</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Recent Activity Section */}
            <section>
              <Card className="hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                <CardHeader className="pb-4 sm:pb-6">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription className="text-sm">Your latest learning sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="group flex items-start gap-3 pb-3 border-b border-border/50 last:border-0 last:pb-0 hover:bg-accent/5 rounded-lg p-2 -m-2 transition-colors duration-200">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0 group-hover:bg-primary/80 transition-colors duration-200 animate-pulse" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium leading-relaxed group-hover:text-primary transition-colors duration-200">{activity.text}</p>
                          <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>

          {/* Unsubscribe Section */}
          <section className="mt-8 sm:mt-10 lg:mt-12 text-center">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  size="sm"
                  className="gap-2"
                >
                  <UserX className="h-4 w-4" />
                  Unsubscribe
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to unsubscribe?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will cancel your subscription at the end of your current billing cycle. 
                    You will continue to have access until then.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleUnsubscribe}>
                    Yes, Unsubscribe
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </section>
        </div>
      </div>
    </>
  );
}