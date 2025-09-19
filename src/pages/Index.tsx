import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import HeroVideo from "@/components/HeroVideo";

import translationIcon from "@/assets/translation-icon.jpg";
import emailIcon from "@/assets/email-icon.jpg";
import industryIcon from "@/assets/industry-icon.jpg";

export default function Index() {
  const { isAuthenticated, signOut, user } = useAuth();


  return (
    <>
      <Helmet>
  <title>व्यापार गुरु (Vyapar Guru)</title>
  <meta 
    name="description" 
    content="व्यापार गुरु • Vyapar Guru — Learn Business English for Hindi speakers. Just ₹99/month." 
  />
  <meta 
    name="keywords" 
    content="Vyapar Guru, व्यापार गुरु, business english, hindi speakers, AI learning, communication" 
  />

  {/* Open Graph for WhatsApp/LinkedIn */}
  <meta property="og:title" content="व्यापार गुरु (Vyapar Guru)" />
  <meta property="og:description" content="AI-powered Business English for Hindi speakers. Start your free trial today at just ₹99/month." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://vyaparguru.info/" />
  <meta property="og:image" content="https://vyaparguru.info/og-image.jpg" />
  <meta property="og:site_name" content="व्यापार गुरु / Vyapar Guru" />

  {/* Twitter/X Card */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="व्यापार गुरु (Vyapar Guru)" />
  <meta name="twitter:description" content="AI-powered Business English for Hindi speakers. ₹99/month only." />
  <meta name="twitter:image" content="https://vyaparguru.info/og-image.jpg" />
</Helmet>

      <div className="min-h-screen bg-gradient-subtle">

     {/* Hero Section */}
<section className="py-20 px-4">
  <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
    <div className="space-y-6">
      <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
        <span className="hindi-text text-foreground">सिर्फ ₹99/महीना</span>
        <br />
        <span className="text-primary">व्यापारी अंग्रेजी में बात करना सीखें</span>
      </h1>
      <p className="text-xl text-muted-foreground max-w-lg">
        Just ₹99/month - Learn Business English for Hindi Speakers
      </p>
      <div className="flex gap-4">
        {isAuthenticated ? (
          <NavLink to="/dashboard">
            <Button size="xl" variant="hero">
              Go to Dashboard
            </Button>
          </NavLink>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4">
            <NavLink to="/auth/sign-up">
              <Button size="xl" variant="hero">
                Start Free Trial • मुफ्त शुरुआत करें
              </Button>
            </NavLink>
            <NavLink to="/auth/sign-in">
              <Button size="xl" variant="outline">
                Sign In • साइन इन करें
              </Button>
            </NavLink>
          </div>
        )}
      </div>
    </div>

    {/* Hero Video */}
    <div className="relative w-full mx-auto">
      <HeroVideo />
    </div>
  </div>
</section>


      {/* Problem Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6 text-primary">
              क्या आप भी इन समस्याओं से परेशान हैं?
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="p-6 text-center">
              <CardContent className="pt-6">
                <div className="text-6xl mb-4">😰</div>
                <h3 className="font-semibold text-lg mb-2">English customers से बात करने में झिझक</h3>
              </CardContent>
            </Card>
            <Card className="p-6 text-center">
              <CardContent className="pt-6">
                <div className="text-6xl mb-4">📧</div>
                <h3 className="font-semibold text-lg mb-2">Professional emails लिखने में दिक्कत</h3>
              </CardContent>
            </Card>
            <Card className="p-6 text-center">
              <CardContent className="pt-6">
                <div className="text-6xl mb-4">😔</div>
                <h3 className="font-semibold text-lg mb-2">Business meetings में confidence की कमी</h3>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Buttons Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <NavLink to="/features" className="flex-1">
              <Button variant="outline" size="lg" className="w-full">
                View Features
              </Button>
            </NavLink>
            <NavLink to="/pricing" className="flex-1">
              <Button variant="hero" size="lg" className="w-full">
                See Pricing
              </Button>
            </NavLink>
          </div>
        </div>
      </section>

      {/* Solution Summary Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-primary">
              हमारा AI-powered समाधान आपकी हर जरूरत पूरी करता है
            </h2>
            <p className="text-lg text-muted-foreground">
              Our comprehensive solution covers all your business English needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <NavLink to="/features" className="block">
              <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardContent className="pt-6">
                  <img src={translationIcon} alt="Translation Coach" className="w-12 h-12 rounded-lg mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2 text-primary">तुरंत अनुवाद</h3>
                  <p className="text-sm text-muted-foreground">Hindi to professional English translation with voice coaching</p>
                </CardContent>
              </Card>
            </NavLink>

            <NavLink to="/features" className="block">
              <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardContent className="pt-6">
                  <img src={emailIcon} alt="Email Assistant" className="w-12 h-12 rounded-lg mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2 text-primary">ईमेल सहायक</h3>
                  <p className="text-sm text-muted-foreground">Generate professional business emails from your Hindi ideas</p>
                </CardContent>
              </Card>
            </NavLink>

            <NavLink to="/features" className="block">
              <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardContent className="pt-6">
                  <img src={industryIcon} alt="Industry Modules" className="w-12 h-12 rounded-lg mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2 text-primary">उद्योग मॉड्यूल</h3>
                  <p className="text-sm text-muted-foreground">Specialized training for retail, food, manufacturing & services</p>
                </CardContent>
              </Card>
            </NavLink>
          </div>
        </div>
      </section>

      {/* Pricing Teaser Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-primary">
            Complete Access for Just ₹99/month
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            सभी features, unlimited usage, 24/7 support
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <NavLink to="/pricing" className="flex-1">
              <Button variant="hero" size="lg" className="w-full">
                View Pricing Details
              </Button>
            </NavLink>
            {!isAuthenticated && (
              <NavLink to="/auth/sign-in" className="flex-1">
                <Button variant="outline" size="lg" className="w-full">
                  Start Free Trial
                </Button>
              </NavLink>
            )}
          </div>
        </div>
      </section>

      </div>
    </>
  );
}
