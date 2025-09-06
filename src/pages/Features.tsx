import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Helmet } from "react-helmet-async";
import { 
  Languages, 
  Mail, 
  MessageCircle, 
  Building2,
  Zap,
  Users,
  Shield,
  Clock
} from "lucide-react";
import { NavLink } from "react-router-dom";

const features = [
  {
    icon: Languages,
    title: "Real-Time Translation Coach",
    titleHindi: "रीयल-टाइम अनुवाद कोच",
    description: "Instantly translate between Hindi and English with context-aware suggestions for business communication.",
    descriptionHindi: "व्यापारिक संवाद के लिए संदर्भ-सचेत सुझावों के साथ हिंदी और अंग्रेजी के बीच तुरंत अनुवाद करें।"
  },
  {
    icon: Mail,
    title: "Email Writing Assistant",
    titleHindi: "ईमेल लेखन सहायक",
    description: "Professional email templates and AI-powered writing assistance for perfect business emails.",
    descriptionHindi: "पूर्ण व्यापारिक ईमेल के लिए पेशेवर ईमेल टेम्प्लेट और AI-संचालित लेखन सहायता।"
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Business Pro",
    titleHindi: "व्हाट्सऐप बिजनेस प्रो",
    description: "Enhance your WhatsApp business communication with professional message templates and suggestions.",
    descriptionHindi: "पेशेवर संदेश टेम्प्लेट और सुझावों के साथ अपने व्हाट्सऐप व्यापारिक संवाद को बेहतर बनाएं।"
  },
  {
    icon: Building2,
    title: "Industry-Specific Modules",
    titleHindi: "उद्योग-विशिष्ट मॉड्यूल",
    description: "Specialized vocabulary and phrases tailored for your specific industry and business needs.",
    descriptionHindi: "आपकी विशिष्ट उद्योग और व्यापारिक आवश्यकताओं के लिए विशेष शब्दावली और वाक्यांश।"
  },
  {
    icon: Zap,
    title: "AI-Powered Learning",
    titleHindi: "AI-संचालित शिक्षा",
    description: "Advanced artificial intelligence adapts to your learning style and provides personalized feedback.",
    descriptionHindi: "उन्नत कृत्रिम बुद्धिमत्ता आपकी सीखने की शैली के अनुकूल होती है और व्यक्तिगत प्रतिक्रिया प्रदान करती है।"
  },
  {
    icon: Users,
    title: "Multi-User Support",
    titleHindi: "मल्टी-यूजर समर्थन",
    description: "Perfect for teams and organizations looking to improve their collective English communication skills.",
    descriptionHindi: "टीमों और संगठनों के लिए आदर्श जो अपने सामूहिक अंग्रेजी संवाद कौशल में सुधार करना चाहते हैं।"
  },
  {
    icon: Shield,
    title: "Privacy & Security",
    titleHindi: "गोपनीयता और सुरक्षा",
    description: "Your business communications are secure with enterprise-grade encryption and privacy protection.",
    descriptionHindi: "आपके व्यापारिक संवाद एंटरप्राइज़-ग्रेड एन्क्रिप्शन और गोपनीयता सुरक्षा के साथ सुरक्षित हैं।"
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    titleHindi: "24/7 उपलब्धता",
    description: "Access your English learning tools anytime, anywhere. Perfect for busy professionals and entrepreneurs.",
    descriptionHindi: "कभी भी, कहीं भी अपने अंग्रेजी सीखने के उपकरणों तक पहुंचें। व्यस्त पेशेवरों और उद्यमियों के लिए आदर्श।"
  }
];

export default function Features() {
  return (
    <>
      <Helmet>
        <title>Features - AI English Training Tools | VyaparGuru</title>
        <meta name="description" content="Discover our AI-powered features: Real-time translation, email assistant, WhatsApp integration, and industry-specific modules for Hindi business owners." />
        <meta name="keywords" content="AI english training, real-time translation, email assistant, WhatsApp business, industry modules, व्यापार अंग्रेजी, AI सुविधाएं" />
        <meta property="og:title" content="Features - AI English Training Tools | VyaparGuru" />
        <meta property="og:description" content="Discover our AI-powered features for Hindi business owners." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://vyaparguru.com/features" />
      </Helmet>
      <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Powerful Features
            <span className="block text-2xl md:text-3xl hindi-text text-primary mt-2">
              शक्तिशाली सुविधाएं
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-4">
            Everything you need to master business English communication
          </p>
          <p className="text-lg hindi-text text-muted-foreground mb-8">
            व्यापारिक अंग्रेजी संवाद में महारत हासिल करने के लिए आवश्यक सब कुछ
          </p>
          <Button variant="hero" size="xl" asChild>
            <NavLink to="/auth/sign-in">
              Start Learning Today • आज सीखना शुरू करें
            </NavLink>
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="card-elegant">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <h4 className="text-base font-medium hindi-text text-primary">
                    {feature.titleHindi}
                  </h4>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground mb-3">
                    {feature.description}
                  </CardDescription>
                  <CardDescription className="text-sm hindi-text text-muted-foreground/80">
                    {feature.descriptionHindi}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-2xl mx-auto gradient-coral-blue rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Business English?
          </h2>
          <p className="text-lg hindi-text mb-6 opacity-90">
            अपनी व्यापारिक अंग्रेजी को बदलने के लिए तैयार हैं?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="xl" asChild>
              <NavLink to="/auth/sign-in">
                Start Free Trial • मुफ्त परीक्षण शुरू करें
              </NavLink>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <NavLink to="/pricing">
                View Pricing • मूल्य देखें
              </NavLink>
            </Button>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}