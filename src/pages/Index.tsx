import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { NavLink } from "react-router-dom";
import heroImage from "@/assets/hero-illustration.jpg";
import translationIcon from "@/assets/translation-icon.jpg";
import emailIcon from "@/assets/email-icon.jpg";
import whatsappIcon from "@/assets/whatsapp-icon.jpg";
import industryIcon from "@/assets/industry-icon.jpg";

export default function Index() {
  const { isAuthenticated, signOut, user } = useAuth();

  return (
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
                <NavLink to="/auth/sign-in">
                  <Button size="xl" variant="hero">
                    7-Day Free Trial
                  </Button>
                </NavLink>
              )}
            </div>
          </div>
          <div className="relative">
            <img 
              src={heroImage} 
              alt="Business English Communication" 
              className="rounded-2xl shadow-2xl"
            />
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

      {/* Solution Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-primary">
              हमारा AI-powered समाधान आपकी हर जरूरत पूरी करता है
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Feature 1: Real-Time Translation Coach */}
            <Card className="p-8">
              <div className="mb-6">
                <img src={translationIcon} alt="Translation Coach" className="w-16 h-16 rounded-lg mb-4" />
                <h3 className="text-xl font-bold text-primary mb-1">तुरंत अनुवाद कोच</h3>
                <h4 className="text-lg font-semibold text-foreground">Real-Time Translation Coach</h4>
              </div>
              <div className="mb-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-foreground font-medium mb-1">
                  "क्या आप भी English customers से बात करते समय झिझकते हैं?"
                </p>
                <p className="text-sm text-muted-foreground">
                  "Do you hesitate when speaking to English customers?"
                </p>
              </div>
              <div className="space-y-2">
                <h5 className="font-semibold text-sm">How It Works:</h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Type or speak your Hindi business phrase</li>
                  <li>• Get instant professional English translation</li>
                  <li>• Learn correct pronunciation with voice coaching</li>
                  <li>• Save frequently used translations for quick access</li>
                </ul>
              </div>
            </Card>

            {/* Feature 2: Email Writing Assistant */}
            <Card className="p-8">
              <div className="mb-6">
                <img src={emailIcon} alt="Email Assistant" className="w-16 h-16 rounded-lg mb-4" />
                <h3 className="text-xl font-bold text-primary mb-1">ईमेल लेखन सहायक</h3>
                <h4 className="text-lg font-semibold text-foreground">Email Writing Assistant</h4>
              </div>
              <div className="mb-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-foreground font-medium mb-1">
                  "Professional emails लिखना आपके लिए सिरदर्द बन जाता है?"
                </p>
                <p className="text-sm text-muted-foreground">
                  "Does writing professional emails give you headaches?"
                </p>
              </div>
              <div className="space-y-2">
                <h5 className="font-semibold text-sm">How It Works:</h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Choose email type (complaint, inquiry, quotation, follow-up)</li>
                  <li>• Describe your situation in Hindi</li>
                  <li>• Get perfectly formatted English business email</li>
                  <li>• Edit and customize before sending</li>
                </ul>
              </div>
            </Card>

            {/* Feature 3: WhatsApp Business Communication */}
            <Card className="p-8">
              <div className="mb-6">
                <img src={whatsappIcon} alt="WhatsApp Business" className="w-16 h-16 rounded-lg mb-4" />
                <h3 className="text-xl font-bold text-primary mb-1">व्हाट्सऐप बिजनेस कम्युनिकेशन</h3>
                <h4 className="text-lg font-semibold text-foreground">WhatsApp Business Communication</h4>
              </div>
              <div className="mb-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-foreground font-medium mb-1">
                  "WhatsApp पर customers से professional तरीके से बात कैसे करें?"
                </p>
                <p className="text-sm text-muted-foreground">
                  "How to communicate professionally with customers on WhatsApp?"
                </p>
              </div>
              <div className="space-y-2">
                <h5 className="font-semibold text-sm">How It Works:</h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Convert casual Hindi messages to professional English</li>
                  <li>• Get smart reply suggestions for customer queries</li>
                  <li>• Learn business etiquette for messaging</li>
                  <li>• Templates for common business situations</li>
                </ul>
              </div>
            </Card>

            {/* Feature 4: Industry-Specific Modules */}
            <Card className="p-8">
              <div className="mb-6">
                <img src={industryIcon} alt="Industry Modules" className="w-16 h-16 rounded-lg mb-4" />
                <h3 className="text-xl font-bold text-primary mb-1">उद्योग-विशेष मॉड्यूल</h3>
                <h4 className="text-lg font-semibold text-foreground">Industry-Specific Modules</h4>
              </div>
              <div className="mb-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-foreground font-medium mb-1">
                  "हर business की अपनी भाषा होती है - आपके धंधे की English कैसे सीखें?"
                </p>
                <p className="text-sm text-muted-foreground">
                  "Every business has its own language - how to learn English specific to your trade?"
                </p>
              </div>
              <div className="space-y-2">
                <h5 className="font-semibold text-sm">Available Industries:</h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>🏪 Retail/Shop (रिटेल/दुकानदारी)</li>
                  <li>🍽️ Food & Restaurant (खाना और रेस्टोरेंट)</li>
                  <li>🏭 Manufacturing (विनिर्माण)</li>
                  <li>🔧 Services (सेवाएं)</li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-primary">
              सिर्फ एक दिन की चाय की कीमत में - ₹99/महीना
            </h2>
            <p className="text-xl font-semibold text-foreground">COMPLETE ACCESS (पूरी सुविधा)</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold text-primary mb-4">🔄 Real-Time Translation Coach</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                    <li>• Unlimited Hindi to English translations</li>
                    <li>• Voice pronunciation training</li>
                    <li>• Business context for every translation</li>
                    <li>• Save favorite phrases library</li>
                  </ul>

                  <h3 className="text-lg font-bold text-primary mb-4">📧 Email Writing Assistant</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• 50+ professional email templates</li>
                    <li>• Custom email generation</li>
                    <li>• Grammar and tone correction</li>
                    <li>• Industry-specific formats</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-primary mb-4">📱 WhatsApp Business Pro</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                    <li>• Professional message templates</li>
                    <li>• Smart reply suggestions</li>
                    <li>• Customer service scripts</li>
                    <li>• Business etiquette training</li>
                  </ul>

                  <h3 className="text-lg font-bold text-primary mb-4">🏢 All Industry Modules</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Retail, Restaurant, Manufacturing, Services</li>
                    <li>• Specialized vocabulary lists</li>
                    <li>• Scenario-based practice</li>
                    <li>• Business conversation training</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 gradient-hero">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            <span className="hindi-text">आज ही शुरू करें</span>
            <br />
            Start Your English Journey Today
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of Indian businesses already improving their English communication
          </p>
          {isAuthenticated ? (
            <NavLink to="/dashboard">
              <Button variant="secondary" size="xl" className="bg-white text-primary hover:bg-white/90">
                Continue Learning
              </Button>
            </NavLink>
          ) : (
            <NavLink to="/auth/sign-in">
              <Button variant="secondary" size="xl" className="bg-white text-primary hover:bg-white/90">
                Start Free Trial - ₹99/month
              </Button>
            </NavLink>
          )}
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-8 text-primary">Trusted by Businesses Across India</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Card className="p-6">
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl mb-4">📞</div>
                  <h3 className="font-semibold mb-2">Customer Support</h3>
                  <p className="text-sm text-muted-foreground">24/7 Hindi & English support available</p>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl mb-4">🏢</div>
                  <h3 className="font-semibold mb-2">Registered Company</h3>
                  <p className="text-sm text-muted-foreground">Legal business entity in India</p>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl mb-4">⭐</div>
                  <h3 className="font-semibold mb-2">10,000+ Happy Users</h3>
                  <p className="text-sm text-muted-foreground">Growing community of business owners</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}