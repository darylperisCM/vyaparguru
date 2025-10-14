import { useState } from 'react';
import { Navigate, NavLink } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { HomeButton } from '@/components/ui/home-button';
import { Loader2, Smartphone, KeyRound, ArrowLeft, UserPlus, LogIn } from 'lucide-react';

export default function AuthSignIn() {
  const { requestOtp, verifyOtp, registerUser, isAuthenticated, loading } = useAuth();
  const { toast } = useToast();
  
  // Sign In States
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  
  // Sign Up States
  const [signUpStep, setSignUpStep] = useState<'form' | 'otp'>('form');
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [signUpFormData, setSignUpFormData] = useState({
    name: '',
    age: '',
    location: '',
    email: '',
    mobileNumber: ''
  });
  const [signUpOtp, setSignUpOtp] = useState('');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const validatePhone = (phoneNumber: string) => {
    const digits = phoneNumber.replace(/\D/g, '');
    return digits.length === 10 && /^[6-9]\d{9}$/.test(digits);
  };

  const formatPhone = (phoneNumber: string) => {
    const digits = phoneNumber.replace(/\D/g, '').slice(0, 10);
    return digits;
  };

  // Sign In Functions
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePhone(phone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit Indian mobile number",
        variant: "destructive"
      });
      return;
    }

    setIsRequestingOtp(true);
    const fullPhone = `+91${phone}`;
    console.log('🔐 Sign-In: Requesting OTP for:', fullPhone);
    
    try {
      const { error } = await requestOtp(fullPhone);
      console.log('🔐 Sign-In: OTP request result:', { error });
      
      if (error) {
        console.error('🔐 Sign-In: OTP request failed:', error);
        
        if (error.requiresSignup) {
          toast({
            title: "Account Not Found",
            description: "This number is not registered. Please create an account first.",
            variant: "destructive"
          });
          return;
        }
        
        toast({
          title: "Failed to Send OTP",
          description: error.message || "Please try again",
          variant: "destructive"
        });
      } else {
        console.log('🔐 Sign-In: OTP sent successfully');
        toast({
          title: "OTP Sent!",
          description: "Please enter the OTP to continue"
        });
        setStep('otp');
      }
    } catch (error: any) {
      console.error('🔐 Sign-In: Unexpected error:', error);
      toast({
        title: "Failed to Send OTP",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsRequestingOtp(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the complete 6-digit OTP",
        variant: "destructive"
      });
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const { error } = await verifyOtp(`+91${phone}`, otp);
      if (error) {
        toast({
          title: "Verification Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Welcome!",
          description: "Successfully signed in"
        });
      }
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
  };

  const handleBackToPhone = () => {
    setStep('phone');
    setOtp('');
  };

  // Sign Up Functions
  const validateSignUpForm = (): boolean => {
    if (!signUpFormData.name.trim()) {
      toast({
        title: "Error",
        description: "Name is required",
        variant: "destructive",
      });
      return false;
    }
    
    const age = parseInt(signUpFormData.age);
    if (!signUpFormData.age || isNaN(age) || age < 1 || age > 120) {
      toast({
        title: "Error", 
        description: "Please enter a valid age",
        variant: "destructive",
      });
      return false;
    }
    
    if (!validatePhone(signUpFormData.mobileNumber)) {
      toast({
        title: "Error",
        description: "Please enter a valid 10-digit mobile number",
        variant: "destructive",
      });
      return false;
    }
    
    if (signUpFormData.email && !validateEmail(signUpFormData.email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const formatSignUpPhone = (phoneNumber: string): string => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    return cleaned.slice(0, 10);
  };

  const handleSignUpInputChange = (field: string, value: string) => {
    if (field === 'mobileNumber') {
      setSignUpFormData(prev => ({ ...prev, [field]: formatSignUpPhone(value) }));
    } else if (field === 'age') {
      const numericValue = value.replace(/\D/g, '');
      setSignUpFormData(prev => ({ ...prev, [field]: numericValue }));
    } else {
      setSignUpFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSignUpRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSignUpForm()) return;
    
    setSignUpLoading(true);
    const fullPhone = `+91${signUpFormData.mobileNumber}`;
    
    try {
      console.log('📝 Sign-Up: Step 1 - Registering user:', fullPhone);
      
      // Step 1: Register user FIRST
      const { error: registerError } = await registerUser(
        fullPhone, 
        signUpFormData.name,
        signUpFormData.email || undefined
      );
      
      if (registerError) {
        console.error('📝 Sign-Up: Registration failed:', registerError);
        toast({
          title: "Registration Failed",
          description: registerError.message || "Please try again",
          variant: "destructive",
        });
        return;
      }

      console.log('✅ User registered successfully');

      // Step 2: THEN request OTP
      console.log('📝 Sign-Up: Step 2 - Requesting OTP for registered user');
      const { error: otpError } = await requestOtp(fullPhone);
      
      if (otpError) {
        console.error('📝 Sign-Up: OTP request failed:', otpError);
        toast({
          title: "Failed to Send OTP",
          description: otpError.message || "Please try again",
          variant: "destructive",
        });
        return;
      }
      
      console.log('✅ OTP sent successfully');
      toast({
        title: "Registration Successful!",
        description: "Please enter the OTP to complete setup",
      });
      setSignUpStep('otp');

    } catch (error: any) {
      console.error('📝 Sign-Up: Unexpected error:', error);
      toast({
        title: "Error",
        description: "Registration failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSignUpLoading(false);
    }
  };

  const handleSignUpVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signUpOtp.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      });
      return;
    }
    
    setSignUpLoading(true);
    
    try {
      const { error } = await verifyOtp(`+91${signUpFormData.mobileNumber}`, signUpOtp);
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Welcome to VyaparGuru!",
        description: "Your account has been created successfully!",
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Verification failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSignUpLoading(false);
    }
  };

  const handleSignUpBackToForm = () => {
    setSignUpStep('form');
    setSignUpOtp('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/5 p-6">
      <div className="container mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">
            व्यापार इंग्लिश गुरु
          </h1>
          <p className="text-muted-foreground">
            Create an account or sign in to continue
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Sign Up Section - Left */}
          <Card className="gradient-card">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <UserPlus className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-2xl">Create New Account</CardTitle>
              <CardDescription>
                {signUpStep === 'form' 
                  ? 'Fill in your details to get started' 
                  : 'Enter the OTP sent to your mobile number'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {signUpStep === 'form' ? (
                <form onSubmit={handleSignUpRequestOtp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Name *</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      value={signUpFormData.name}
                      onChange={(e) => handleSignUpInputChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-age">Age *</Label>
                    <Input
                      id="signup-age"
                      type="text"
                      value={signUpFormData.age}
                      onChange={(e) => handleSignUpInputChange('age', e.target.value)}
                      placeholder="Enter your age"
                      maxLength={3}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-location">Location</Label>
                    <Input
                      id="signup-location"
                      type="text"
                      value={signUpFormData.location}
                      onChange={(e) => handleSignUpInputChange('location', e.target.value)}
                      placeholder="Enter your location"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email Address</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={signUpFormData.email}
                      onChange={(e) => handleSignUpInputChange('email', e.target.value)}
                      placeholder="Enter your email (optional)"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-mobile">Mobile Number *</Label>
                    <div className="flex">
                      <div className="flex items-center px-3 border border-r-0 border-input bg-muted rounded-l-md">
                        <span className="text-sm text-muted-foreground">+91</span>
                      </div>
                      <Input
                        id="signup-mobile"
                        type="tel"
                        value={signUpFormData.mobileNumber}
                        onChange={(e) => handleSignUpInputChange('mobileNumber', e.target.value)}
                        placeholder="Enter 10-digit mobile number"
                        className="rounded-l-none"
                        maxLength={10}
                        required
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" variant="hero" disabled={signUpLoading}>
                    {signUpLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      'Create Account & Send OTP'
                    )}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleSignUpVerifyOtp} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="signup-otp">Enter OTP</Label>
                    <div className="flex justify-center">
                      <InputOTP
                        value={signUpOtp}
                        onChange={setSignUpOtp}
                        maxLength={6}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                      OTP sent to +91{signUpFormData.mobileNumber}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <Button type="submit" className="w-full" variant="hero" disabled={signUpLoading}>
                      {signUpLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        'Complete Registration'
                      )}
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={handleSignUpBackToForm}
                      disabled={signUpLoading}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Change Mobile Number
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Sign In Section - Right */}
          <Card className="gradient-card">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                {step === 'phone' ? (
                  <LogIn className="h-12 w-12 text-primary" />
                ) : (
                  <KeyRound className="h-12 w-12 text-primary" />
                )}
              </div>
              <CardTitle className="text-2xl">Sign In</CardTitle>
              <CardDescription>
                {step === 'phone' ? 'Enter your registered mobile number' : 'Enter the OTP sent to your mobile'}
              </CardDescription>
              {step === 'otp' && (
                <p className="text-sm text-muted-foreground mt-2">
                  OTP sent to +91 {phone}
                </p>
              )}
            </CardHeader>
            <CardContent>
              {step === 'phone' ? (
                <form onSubmit={handleRequestOtp} className="space-y-4">
                  <div>
                    <Label htmlFor="signin-phone">Registered Mobile Number</Label>
                    <div className="flex">
                      <div className="flex items-center px-3 border border-r-0 border-input rounded-l-md bg-muted text-muted-foreground">
                        +91
                      </div>
                      <Input
                        id="signin-phone"
                        type="tel"
                        placeholder="9876543210"
                        value={phone}
                        onChange={handlePhoneChange}
                        className="rounded-l-none"
                        maxLength={10}
                        required
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter the mobile number you used to create your account
                    </p>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    variant="hero"
                    disabled={isRequestingOtp || !validatePhone(phone)}
                  >
                    {isRequestingOtp ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Smartphone className="h-4 w-4 mr-2" />
                    )}
                    {isRequestingOtp ? 'Sending OTP...' : 'Send OTP'}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div className="space-y-4">
                    <Label htmlFor="signin-otp" className="text-center block">Enter 6-digit OTP</Label>
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        value={otp}
                        onChange={(value) => setOtp(value)}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                    <div className="text-center space-y-2">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={handleBackToPhone}
                        className="text-xs"
                      >
                        Change number
                      </Button>
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    variant="hero"
                    disabled={isVerifyingOtp || otp.length !== 6}
                  >
                    {isVerifyingOtp ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <KeyRound className="h-4 w-4 mr-2" />
                    )}
                    {isVerifyingOtp ? 'Verifying...' : 'Verify & Continue'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <NavLink to="/">
            <Button variant="ghost" className="text-muted-foreground">
              <HomeButton />
              Back to Home
            </Button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}
