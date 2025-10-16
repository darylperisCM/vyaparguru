import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const pricingFeatures = [
  {
    english: "Real-time Hindi to English translation",
    hindi: "रीयल-टाइम हिंदी से अंग्रेजी अनुवाद"
  },
  {
    english: "Professional email templates & assistance",
    hindi: "पेशेवर ईमेल टेम्प्लेट और सहायता"
  },
  {
    english: "Industry-specific vocabulary modules",
    hindi: "उद्योग-विशिष्ट शब्दावली मॉड्यूल"
  },
  {
    english: "Grammar correction & suggestions",
    hindi: "व्याकरण सुधार और सुझाव"
  },
  {
    english: "Business conversation practice",
    hindi: "व्यापारिक बातचीत अभ्यास"
  },
  {
    english: "Voice pronunciation coaching",
    hindi: "आवाज उच्चारण कोचिंग"
  },
  {
    english: "Progress tracking & analytics",
    hindi: "प्रगति ट्रैकिंग और विश्लेषण"
  },
  {
    english: "24/7 AI-powered assistance",
    hindi: "24/7 AI-संचालित सहायता"
  },
  {
    english: "Mobile & desktop accessibility",
    hindi: "मोबाइल और डेस्कटॉप पहुंच"
  }
];

export default function Pricing() {
  return (
    <>
      <Helmet>
        <title>Pricing - Just ₹99/month | VyaparGuru</title>
        <meta name="description" content="Affordable English training for Hindi businesses. Complete access to all features for ₹99/month. Start your 3-day free trial today." />
        <meta name="keywords" content="english training pricing, ₹99 monthly, business english cost, hindi speakers training, व्यापार अंग्रेजी मूल्य, affordable english" />
        <meta property="og:title" content="Pricing - Just ₹99/month | VyaparGuru" />
        <meta property="og:description" content="Affordable English training for Hindi businesses at just ₹99/month." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://vyaparguru.com/pricing" />
      </Helmet>
      <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            Simple, Transparent Pricing
            <span className="block text-2xl md:text-3xl hindi-text text-primary mt-2">
              सरल, पारदर्शी मूल्य निर्धारण
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            Invest in your business English skills for less than the cost of a coffee per day
          </p>
          <p className="text-lg hindi-text text-muted-foreground">
            प्रतिदिन एक कॉफी की लागत से भी कम में अपने व्यापारिक अंग्रेजी कौशल में निवेश करें
          </p>
        </div>
      </section>

      {/* Pricing Card */}
      <section className="container mx-auto px-4 pt-8 pb-16">
        <div className="max-w-lg mx-auto">
          <Card className="card-elegant relative overflow-hidden">
            <div className="absolute top-0 right-0">
              <Badge className="gradient-coral-blue text-white border-0 rounded-tl-none rounded-br-none rounded-bl-lg">
                <Star className="w-4 h-4 mr-1" />
                Most Popular
              </Badge>
            </div>
            
            <CardHeader className="text-center pb-6">
              <h2 className="text-3xl font-bold">
                Business English Pro
              </h2>
              <h3 className="text-xl hindi-text text-primary font-semibold">
                बिजनेस इंग्लिश प्रो
              </h3>
              
              <div className="mt-6">
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold text-primary">₹99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm hindi-text text-muted-foreground mt-1">
                  प्रति माह
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  That's just ₹3.30 per day!
                </p>
                <p className="text-xs hindi-text text-muted-foreground">
                  यह केवल ₹3.30 प्रति दिन है!
                </p>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4 mb-8">
                {pricingFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{feature.english}</p>
                      <p className="text-xs hindi-text text-muted-foreground">{feature.hindi}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <Button variant="hero" size="xl" className="w-full" asChild>
                  <NavLink to="/auth/sign-up">
                    Start Free Trial • मुफ्त परीक्षण शुरू करें
                  </NavLink>
                </Button>
                
                <p className="text-center text-sm text-muted-foreground">
                  No credit card required • 3-day free trial
                </p>
                <p className="text-center text-xs hindi-text text-muted-foreground">
                  कोई क्रेडिट कार्ड आवश्यक नहीं • 3-दिन का मुफ्त परीक्षण
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-center hindi-text text-xl text-primary mb-12">
            अक्सर पूछे जाने वाले प्रश्न
          </p>
          
          <div className="grid gap-8">
            <Card className="card-elegant">
              <CardHeader>
                <h3 className="text-lg">How does the free trial work?</h3>
                <h4 className="text-base hindi-text text-primary">मुफ्त परीक्षण कैसे काम करता है?</h4>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  You get full access to all features for 3 days, completely free. No credit card required to start.
                </CardDescription>
                <CardDescription className="hindi-text text-sm mt-2 opacity-80">
                  आपको 3 दिनों के लिए सभी सुविधाओं तक पूर्ण पहुंच मिलती है, बिल्कुल मुफ्त। शुरू करने के लिए कोई क्रेडिट कार्ड आवश्यक नहीं।
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="card-elegant">
              <CardHeader>
                <h3 className="text-lg">Can I cancel anytime?</h3>
                <h4 className="text-base hindi-text text-primary">क्या मैं कभी भी रद्द कर सकता हूं?</h4>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Yes, you can cancel your subscription at any time. No long-term commitments or cancellation fees.
                </CardDescription>
                <CardDescription className="hindi-text text-sm mt-2 opacity-80">
                  हां, आप अपनी सदस्यता किसी भी समय रद्द कर सकते हैं। कोई दीर्घकालिक प्रतिबद्धता या रद्दीकरण शुल्क नहीं।
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="card-elegant">
              <CardHeader>
                <h3 className="text-lg">Is this suitable for beginners?</h3>
                <h4 className="text-base hindi-text text-primary">क्या यह नए लोगों के लिए उपयुक्त है?</h4>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Absolutely! Our AI adapts to your current level and helps you progress at your own pace, whether you're a beginner or advanced learner.
                </CardDescription>
                <CardDescription className="hindi-text text-sm mt-2 opacity-80">
                  बिल्कुल! हमारा AI आपके वर्तमान स्तर के अनुकूल होता है और आपकी अपनी गति से प्रगति करने में मदद करता है, चाहे आप शुरुआती हों या उन्नत शिक्षार्थी।
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-2xl mx-auto gradient-coral-blue rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Master Business English?
          </h2>
          <p className="text-lg hindi-text mb-6 opacity-90">
            व्यापारिक अंग्रेजी में महारत हासिल करने के लिए तैयार हैं?
          </p>
          <Button variant="secondary" size="xl" asChild>
            <NavLink to="/auth/sign-up">
              Start Your Free Trial Today • आज अपना मुफ्त परीक्षण शुरू करें
            </NavLink>
          </Button>
        </div>
      </section>
      </div>
    </>
  );
}