import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AuthSignUp = () => {
  const navigate = useNavigate();
  const { isAuthenticated, verifyOtp, requestOtp, registerUser, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    location: '',
    email: '',
    mobileNumber: ''
  });
  const [otp, setOtp] = useState('');

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Name is required",
        variant: "destructive",
      });
      return false;
    }
    
    const age = parseInt(formData.age);
    if (!formData.age || isNaN(age) || age < 1 || age > 120) {
      toast({
        title: "Error", 
        description: "Please enter a valid age",
        variant: "destructive",
      });
      return false;
    }
    
    if (!validatePhone(formData.mobileNumber)) {
      toast({
        title: "Error",
        description: "Please enter a valid 10-digit mobile number",
        variant: "destructive",
      });
      return false;
    }
    
    if (formData.email && !validateEmail(formData.email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const validatePhone = (phoneNumber: string): boolean => {
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    return cleanPhone.length === 10 && /^[6-9]/.test(cleanPhone);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const formatPhone = (phoneNumber: string): string => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    return cleaned.slice(0, 10);
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'mobileNumber') {
      setFormData(prev => ({ ...prev, [field]: formatPhone(value) }));
    } else if (field === 'age') {
      const numericValue = value.replace(/\D/g, '');
      setFormData(prev => ({ ...prev, [field]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  // ✅ FIXED: Pass all form data to registerUser
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    const fullPhone = `+91${formData.mobileNumber}`;
    
    try {
      console.log('📝 Sign-Up: Step 1 - Registering user:', fullPhone, formData);
      
      // ✅ Step 1: Register user with ALL form data
      const { error: registerError } = await registerUser(
        fullPhone, 
        formData.name,
        formData.email || undefined,
        formData.age,        // ✅ FIXED: Pass age
        formData.location    // ✅ FIXED: Pass location
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

      // ✅ Step 2: Now request OTP
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
      setStep('otp');

    } catch (error: any) {
      console.error('📝 Sign-Up: Unexpected error:', error);
      toast({
        title: "Error",
        description: "Registration failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('📝 Sign-Up: Verifying OTP for:', `+91${formData.mobileNumber}`);
      
      const { error } = await verifyOtp(`+91${formData.mobileNumber}`, otp);
      
      if (error) {
        console.error('📝 Sign-Up: OTP verification failed:', error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      console.log('✅ OTP verified successfully - user profile created by backend');
      
      toast({
        title: "Welcome to VyaparGuru!",
        description: "Your account has been created successfully!",
      });
      
      navigate('/dashboard');
      
    } catch (error: any) {
      console.error('📝 Sign-Up: Verification error:', error);
      toast({
        title: "Error",
        description: "Verification failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackToForm = () => {
    setStep('form');
    setOtp('');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-coral-50 to-coral-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>
            {step === 'form' 
              ? 'Fill in your details to get started' 
              : 'Enter the OTP sent to your mobile number'
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {step === 'form' ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="text"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  placeholder="Enter your age"
                  maxLength={3}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Enter your location"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email (optional)"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number *</Label>
                <div className="flex">
                  <div className="flex items-center px-3 border border-r-0 border-input bg-muted rounded-l-md">
                    <span className="text-sm text-muted-foreground">+91</span>
                  </div>
                  <Input
                    id="mobile"
                    type="tel"
                    value={formData.mobileNumber}
                    onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                    placeholder="Enter 10-digit mobile number"
                    className="rounded-l-none"
                    maxLength={10}
                    required
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
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
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <div className="flex justify-center">
                  <InputOTP
                    value={otp}
                    onChange={setOtp}
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
                  OTP sent to +91{formData.mobileNumber}
                </p>
              </div>
              
              <div className="space-y-3">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
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
                  onClick={handleBackToForm}
                  disabled={loading}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Change Mobile Number
                </Button>
              </div>
            </form>
          )}
          
          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthSignUp;
