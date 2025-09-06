import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Languages, 
  Mail, 
  Phone, 
  Grid3x3, 
  TrendingUp, 
  Clock,
  Target,
  Award,
  Activity
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data - will be replaced with real data from Supabase
  const stats = {
    translationsToday: 12,
    emailsGenerated: 5,
    whatsappMessages: 8,
    totalLearningHours: 24,
    weeklyProgress: 68,
    streak: 7
  };

  const recentActivity = [
    { type: 'translation', text: 'Translated business proposal', time: '2 hours ago' },
    { type: 'email', text: 'Generated follow-up email', time: '4 hours ago' },
    { type: 'whatsapp', text: 'Practiced customer responses', time: '6 hours ago' },
    { type: 'industry', text: 'Completed retail vocabulary', time: '1 day ago' },
  ];

  const quickActions = [
    {
      title: 'Start Translating',
      description: 'Hindi to English translation',
      icon: Languages,
      route: '/translation',
      color: 'bg-destructive',
      textColor: 'text-destructive-foreground'
    },
    {
      title: 'Write an Email',
      description: 'Professional email assistant',
      icon: Mail,
      route: '/email',
      color: 'bg-success',
      textColor: 'text-success-foreground'
    },
    {
      title: 'WhatsApp Pro',
      description: 'Business communication',
      icon: Phone,
      route: '/whatsapp',
      color: 'bg-accent',
      textColor: 'text-accent-foreground'
    },
    {
      title: 'Industry Modules',
      description: 'Sector-specific learning',
      icon: Grid3x3,
      route: '/industry',
      color: 'bg-blue-500',
      textColor: 'text-white'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard - VyaparGuru | Your Business English Learning Hub</title>
        <meta name="description" content="Access your personalized dashboard for business English learning. Track progress, quick actions for translation, email writing, WhatsApp communication and industry modules." />
        <meta name="keywords" content="dashboard, business english, learning progress, translation, email writing, whatsapp business, industry modules" />
        <link rel="canonical" href="/dashboard" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container py-4 sm:py-6 lg:py-8 px-4 sm:px-6">
          {/* Welcome Header */}
          <div className="mb-6 sm:mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2">
              Welcome back! 🙏
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              Continue your English business journey today
            </p>
          </div>

          {/* Quick Actions Section */}
          <section className="mb-8 sm:mb-10 lg:mb-12">
            <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-4 sm:mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {quickActions.map((action, index) => (
                <Card 
                  key={index}
                  className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:scale-95 min-h-[120px] sm:min-h-[140px]"
                  onClick={() => navigate(action.route)}
                >
                  <CardContent className="p-4 sm:p-6 text-center h-full flex flex-col justify-center">
                    <div className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${action.color} ${action.textColor} mb-3 sm:mb-4`}>
                      <action.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">{action.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-tight">{action.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Progress Stats Section */}
          <section className="mb-8 sm:mb-10 lg:mb-12">
            <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-4 sm:mb-6">Today's Progress</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <Card className="min-h-[100px] sm:min-h-[120px]">
                <CardContent className="p-4 sm:p-6 h-full flex items-center">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Today's Translations</p>
                      <p className="text-xl sm:text-2xl font-bold">{stats.translationsToday}</p>
                    </div>
                    <Languages className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0 ml-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="min-h-[100px] sm:min-h-[120px]">
                <CardContent className="p-4 sm:p-6 h-full flex items-center">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Emails Generated</p>
                      <p className="text-xl sm:text-2xl font-bold">{stats.emailsGenerated}</p>
                    </div>
                    <Mail className="h-6 w-6 sm:h-8 sm:w-8 text-success flex-shrink-0 ml-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="min-h-[100px] sm:min-h-[120px]">
                <CardContent className="p-4 sm:p-6 h-full flex items-center">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">WhatsApp Messages</p>
                      <p className="text-xl sm:text-2xl font-bold">{stats.whatsappMessages}</p>
                    </div>
                    <Phone className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0 ml-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="min-h-[100px] sm:min-h-[120px]">
                <CardContent className="p-4 sm:p-6 h-full flex items-center">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Learning Streak</p>
                      <p className="text-xl sm:text-2xl font-bold">{stats.streak} days</p>
                    </div>
                    <Award className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0 ml-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Weekly Progress Section */}
            <section className="lg:col-span-2">
              <Card>
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
                    <Progress value={stats.weeklyProgress} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 p-3 sm:p-4 rounded-lg bg-accent/10 min-h-[80px]">
                      <Target className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm font-medium">Daily Goal</p>
                        <p className="text-base sm:text-lg font-semibold">15/20 tasks</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 sm:p-4 rounded-lg bg-accent/10 min-h-[80px]">
                      <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm font-medium">Learning Time</p>
                        <p className="text-base sm:text-lg font-semibold">{stats.totalLearningHours} hours</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Recent Activity Section */}
            <section>
              <Card>
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
                      <div key={index} className="flex items-start gap-3 pb-3 border-b border-border/50 last:border-0 last:pb-0">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium leading-relaxed">{activity.text}</p>
                          <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}