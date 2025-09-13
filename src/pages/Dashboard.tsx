import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useCountUp } from '@/hooks/useCountUp';
import { useToast } from '@/hooks/use-toast';
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
  UserX
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock data - will be replaced with real data from Supabase
  const stats = {
    translationsToday: 12,
    emailsGenerated: 5,
    totalLearningHours: 24,
    weeklyProgress: 68,
    streak: 7
  };

  // Count-up animations with staggered delays
  const animatedTranslations = useCountUp(stats.translationsToday, 1500, 400);
  const animatedEmails = useCountUp(stats.emailsGenerated, 1500, 600);
  const animatedStreak = useCountUp(stats.streak, 1500, 800);

  const recentActivity = [
    { type: 'translation', text: 'Translated business proposal', time: '2 hours ago' },
    { type: 'email', text: 'Generated follow-up email', time: '4 hours ago' },
    { type: 'industry', text: 'Completed retail vocabulary', time: '1 day ago' },
  ];

  const quickActions = [
    {
      title: 'Start Translating',
      description: 'Hindi to English translation',
      icon: Languages,
      route: '/translation',
      gradient: 'from-primary to-primary-hover',
      hoverGradient: 'hover:from-primary-hover hover:to-primary'
    },
    {
      title: 'Write an Email',
      description: 'Professional email assistant',
      icon: Mail,
      route: '/email',
      gradient: 'from-success to-success/80',
      hoverGradient: 'hover:from-success/80 hover:to-success'
    },
    {
      title: 'Industry Modules',
      description: 'Sector-specific learning',
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

            {/* Quick Actions Section */}
          <section className="mb-8 sm:mb-10 lg:mb-12">
            <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-4 sm:mb-6 flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {quickActions.map((action, index) => (
                <Card 
                  key={index}
                  className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2 hover:scale-105 active:scale-95 min-h-[120px] sm:min-h-[140px] overflow-hidden"
                  onClick={() => navigate(action.route)}
                >
                  <CardContent className="p-4 sm:p-6 text-center h-full flex flex-col justify-center relative">
                    <div className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br ${action.gradient} ${action.hoverGradient} text-white mb-3 sm:mb-4 transition-all duration-300 group-hover:scale-110 shadow-lg`}>
                      <action.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2 group-hover:text-primary transition-colors duration-300">{action.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-tight group-hover:text-muted-foreground/80 transition-colors duration-300">{action.description}</p>
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
                      <span className="text-sm text-muted-foreground">{stats.weeklyProgress}%</span>
                    </div>
                    <Progress 
                      value={stats.weeklyProgress} 
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
                        <p className="text-base sm:text-lg font-semibold">15/20 tasks</p>
                      </div>
                    </div>
                    
                    <div className="group flex items-center gap-3 p-3 sm:p-4 rounded-lg bg-accent/10 hover:bg-accent/20 transition-all duration-300 min-h-[80px] hover:shadow-md">
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                        <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm font-medium text-muted-foreground">Learning Time</p>
                        <p className="text-base sm:text-lg font-semibold">{stats.totalLearningHours} hours</p>
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