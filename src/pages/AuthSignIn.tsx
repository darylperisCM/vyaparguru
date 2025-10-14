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
  const { requestOtp, verifyOtp, registerUser, isAuthenticated, loading } = useAuth(); // ← Add registerUser
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

  // ✅ FIXED: Handle requiresSignup in sign-in flow
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
        
        // ✅ NEW: Handle requiresSignup case
        if (error.requiresSignup) {
          toast({
            title: "Account Not Found",
            description: "This number is not registered. Please create an account first.",
            variant: "destructive"
          });
          // Optionally scroll to sign-up section or highlight it
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

  // ✅ FIXED: Use registerUser first, then requestOtp
  const handleSignUpRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSignUpForm()) return;
    
    setSignUpLoading(true);
    const fullPhone = `+91${signUpFormData.mobileNumber}`;
    console.log('📝 Sign-Up: Registering user:', fullPhone);
    
    try {
      // ✅ Step 1: Register user first
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

      // ✅ Step 2: Now request OTP
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

  // ✅ FIXED: Simplified OTP verification (no profile creation needed)
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

      // ✅ Profile is already created by edge function, just show success
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

  // Rest of your JSX remains the same...
  return (
    // Your existing JSX code here - no changes needed
  );
}
