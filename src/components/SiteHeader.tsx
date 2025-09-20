import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";
import FeedbackWidget from "@/components/FeedbackWidget";

const navigation = [
  { name: "Home", nameHindi: "होम", href: "/" },
  { name: "Features", nameHindi: "सुविधाएं", href: "/features" },
  { name: "Pricing", nameHindi: "मूल्य", href: "/pricing" },
];



export default function App() {
  return (
    <>
      {/* your header/nav/router/outlet etc */}
      {/* <Router> … </Router> or your pages */}

      {/* Render globally, after the app content */}
      <FeedbackWidget />
    </>
  );
}


export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const AuthButtons = ({ isMobile = false }) => {
    if (user) {
      return (
        <div className={`flex items-center gap-2 ${isMobile ? 'flex-col w-full' : ''}`}>
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className={isMobile ? 'w-full justify-start' : ''}
          >
            Welcome{user.email ? `, ${user.email.split('@')[0]}` : ''}
          </Button>
          <Button
            variant="outline"
            onClick={handleSignOut}
            className={isMobile ? 'w-full justify-start' : ''}
          >
            Logout
          </Button>
        </div>
      );
    }

    return (
      <div className={`flex items-center gap-2 ${isMobile ? 'flex-col w-full' : ''}`}>
        <Button 
          variant="ghost" 
          asChild 
          className={isMobile ? 'w-full justify-start' : ''}
        >
          <NavLink to="/auth/sign-in">Sign In</NavLink>
        </Button>
        <Button 
          variant="hero" 
          asChild 
          className={isMobile ? 'w-full justify-start' : ''}
        >
          <NavLink to="/auth/sign-in">Start Free Trial</NavLink>
        </Button>
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <div className="mr-6 flex items-center space-x-2">
          <NavLink to="/" className="flex items-center space-x-2">
            <img 
              src="/assets/fulllogo_transparent_nobuffer.png" 
              alt="VyaparGuru - व्यापार गुरु" 
              className="h-8 w-auto md:h-10 object-contain"
            />
          </NavLink>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium flex-1">
          {navigation.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `transition-colors hover:text-primary ${
                  isActive ? "text-primary font-semibold" : "text-muted-foreground"
                }`
              }
            >
              <span className="mr-1">{item.name}</span>
              <span className="hindi-text text-xs">({item.nameHindi})</span>
            </NavLink>
          ))}
          {user && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `inline-flex items-center px-3 py-1.5 rounded-md font-semibold transition-all duration-300 ${
                  isActive 
                    ? "gradient-coral-blue text-white ring-2 ring-ring shadow-lg" 
                    : "gradient-coral-blue text-white shadow-md hover:shadow-lg"
                }`
              }
            >
              <LayoutDashboard className="h-4 w-4 mr-1.5" />
              <span className="mr-1">Dashboard</span>
              <span className="hindi-text text-xs opacity-90">(डैशबोर्ड)</span>
            </NavLink>
          )}
        </nav>

        {/* Desktop Auth */}
        <div className="hidden md:flex">
          <AuthButtons />
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden ml-auto">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10">
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px]">
              <nav className="flex flex-col space-y-4">
                <div className="flex flex-col space-y-3 py-4">
                  {navigation.map((item) => (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `flex flex-col p-3 rounded-md transition-colors min-h-[48px] justify-center ${
                          isActive
                            ? "bg-primary/10 text-primary font-semibold"
                            : "text-muted-foreground hover:text-primary hover:bg-accent"
                        }`
                      }
                    >
                      <span className="text-base">{item.name}</span>
                      <span className="hindi-text text-sm opacity-70">{item.nameHindi}</span>
                    </NavLink>
                  ))}
                  {user && (
                    <NavLink
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center px-3 py-3 rounded-md font-semibold transition-all duration-300 min-h-[48px] ${
                          isActive 
                            ? "gradient-coral-blue text-white ring-2 ring-ring shadow-lg" 
                            : "gradient-coral-blue text-white shadow-md active:scale-95"
                        }`
                      }
                    >
                      <LayoutDashboard className="h-5 w-5 mr-3 flex-shrink-0" />
                      <div className="flex flex-col flex-1">
                        <span className="text-base">Dashboard</span>
                        <span className="hindi-text text-sm opacity-90">डैशबोर्ड</span>
                      </div>
                    </NavLink>
                  )}
                </div>
                
                <div className="border-t pt-4">
                  <AuthButtons isMobile />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
