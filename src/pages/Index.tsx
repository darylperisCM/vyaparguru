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
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/5">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <NavLink to="/" className="text-xl font-bold text-primary">व्यापार इंग्लिश गुरु</NavLink>
            <nav className="hidden md:flex space-x-6">
              <NavLink 
                to="/translation" 
                className={({ isActive }) => 
                  `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'hover:text-primary'}`
                }
              >
                Translation
              </NavLink>
              <NavLink 
                to="/email" 
                className={({ isActive }) => 
                  `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'hover:text-primary'}`
                }
              >
                Email Assistant
              </NavLink>
              <NavLink 
                to="/whatsapp" 
                className={({ isActive }) => 
                  `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'hover:text-primary'}`
                }
              >
                WhatsApp Pro
              </NavLink>
              <NavLink 
                to="/industry" 
                className={({ isActive }) => 
                  `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'hover:text-primary'}`
                }
              >
                Industry Modules
              </NavLink>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard">
                  <Button variant="ghost">
                    Welcome, {user?.name}
                  </Button>
                </NavLink>
                <Button variant="outline" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <NavLink to="/auth/sign-in">
                  <Button variant="ghost">Sign In</Button>
                </NavLink>
                <NavLink to="/auth/sign-in">
                  <Button variant="hero">Start Free Trial</Button>
                </NavLink>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              <span className="hindi-text text-foreground">अंग्रेजी में बात करें,</span>
              <br />
              <span className="text-primary">व्यापार बढ़ाएं</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg">
              From Hindi conversations to professional English communication - 
              transform your business interactions in one unified platform
            </p>
            <div className="flex gap-4">
              {isAuthenticated ? (
                <NavLink to="/dashboard">
                  <Button size="xl" variant="hero">
                    Go to Dashboard
                  </Button>
                </NavLink>
              ) : (
                <>
                  <NavLink to="/auth/sign-in">
                    <Button size="xl" variant="hero">
                      Start Learning
                    </Button>
                  </NavLink>
                  <Button size="xl" variant="outline">
                    Watch Demo
                  </Button>
                </>
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

      {/* Statistics Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary">650M+</div>
              <div className="text-muted-foreground mt-2">Hindi Speakers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">85M+</div>
              <div className="text-muted-foreground mt-2">Small Businesses</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">4.8/5</div>
              <div className="text-muted-foreground mt-2">User Rating</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">92%</div>
              <div className="text-muted-foreground mt-2">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              <span className="hindi-text">हर व्यापारिक ज़रूरत,</span>
              <br />
              Every Business Need Covered
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Complete English communication suite for Indian businesses
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="card-elegant p-6 gradient-coral-blue text-white">
              <div className="mb-4">
                <img src={translationIcon} alt="Translation" className="w-16 h-16 rounded-lg" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Real-Time Translation</h3>
              <p className="text-white/90 text-sm">
                Instant Hindi to English translation with business context
              </p>
            </Card>

            <Card className="card-elegant p-6 gradient-coral-purple text-white">
              <div className="mb-4">
                <img src={emailIcon} alt="Email Assistant" className="w-16 h-16 rounded-lg" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Email Assistant</h3>
              <p className="text-white/90 text-sm">
                Professional email templates and writing assistance
              </p>
            </Card>

            <Card className="card-elegant p-6 gradient-coral-green text-white">
              <div className="mb-4">
                <img src={whatsappIcon} alt="WhatsApp Pro" className="w-16 h-16 rounded-lg" />
              </div>
              <h3 className="font-semibold text-lg mb-2">WhatsApp Pro</h3>
              <p className="text-white/90 text-sm">
                Business messaging with smart English suggestions
              </p>
            </Card>

            <Card className="card-elegant p-6 gradient-coral-teal text-white">
              <div className="mb-4">
                <img src={industryIcon} alt="Industry Modules" className="w-16 h-16 rounded-lg" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Industry Modules</h3>
              <p className="text-white/90 text-sm">
                Specialized vocabulary for different business sectors
              </p>
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
    </div>
  );
}