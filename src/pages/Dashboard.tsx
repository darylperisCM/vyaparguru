import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  BookOpen, 
  TrendingUp, 
  Clock,
  Target,
  Award
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
      icon: MessageSquare,
      route: '/translation',
      color: 'bg-primary'
    },
    {
      title: 'Write an Email',
      description: 'Professional email assistant',
      icon: Mail,
      route: '/email',
      color: 'bg-success'
    },
    {
      title: 'WhatsApp Pro',
      description: 'Business communication',
      icon: Phone,
      route: '/whatsapp',
      color: 'bg-accent'
    },
    {
      title: 'Industry Modules',
      description: 'Sector-specific learning',
      icon: BookOpen,
      route: '/industry',
      color: 'bg-secondary'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/5 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Welcome back, {user?.name}! 🙏
          </h1>
          <p className="text-muted-foreground">
            Continue your English business journey today
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Today's Translations</p>
                  <p className="text-2xl font-bold text-primary">{stats.translationsToday}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Emails Generated</p>
                  <p className="text-2xl font-bold text-success">{stats.emailsGenerated}</p>
                </div>
                <Mail className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">WhatsApp Messages</p>
                  <p className="text-2xl font-bold text-accent">{stats.whatsappMessages}</p>
                </div>
                <Phone className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Learning Streak</p>
                  <p className="text-2xl font-bold text-primary">{stats.streak} days</p>
                </div>
                <Award className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Progress Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Weekly Progress
              </CardTitle>
              <CardDescription>
                Your learning progress this week
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Progress</span>
                  <span>{stats.weeklyProgress}%</span>
                </div>
                <Progress value={stats.weeklyProgress} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="text-center p-4 bg-accent/10 rounded-lg">
                  <Target className="h-6 w-6 mx-auto mb-2 text-accent" />
                  <p className="text-sm font-medium">Daily Goal</p>
                  <p className="text-xs text-muted-foreground">15/20 tasks</p>
                </div>
                <div className="text-center p-4 bg-success/10 rounded-lg">
                  <Clock className="h-6 w-6 mx-auto mb-2 text-success" />
                  <p className="text-sm font-medium">Learning Time</p>
                  <p className="text-xs text-muted-foreground">{stats.totalLearningHours} hours</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest learning sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{activity.text}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Card 
                key={action.route}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                onClick={() => navigate(action.route)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mx-auto mb-3`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-1">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}