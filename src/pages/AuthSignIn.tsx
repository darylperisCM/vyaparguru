import { useState } from 'react';
import { Navigate, NavLink } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { HomeButton } from '@/components/ui/home-button';
import { Loader2, Smartphone, KeyRound } from 'lucide-react';

export default function AuthSignIn() {
  const { requestOtp, verifyOtp, isAuthenticated, loading } = useAuth();
  const { toast } = useToast();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

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
    // Remove any non-digits
    const digits = phoneNumber.replace(/\D/g, '');
    return digits.length === 10 && /^[6-9]\d{9}$/.test(digits);
  };

  const formatPhone = (phoneNumber: string) => {
    // Remove any non-digits and limit to 10 digits
    const digits = phoneNumber.replace(/\D/g, '').slice(0, 10);
    return digits;
  };

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
    try {
      const { error } = await requestOtp(`+91${phone}`);
      if (error) {
        toast({
          title: "Failed to Send OTP",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "OTP Sent!",
          description: "Please enter the OTP to continue"
        });
        setStep('otp');
      }
    } catch (error) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/5 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">
            व्यापार इंग्लिश गुरु
          </h1>
          <p className="text-muted-foreground">
            Sign in with your mobile number
          </p>
        </div>

        <Card className="gradient-card">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              {step === 'phone' ? (
                <Smartphone className="h-12 w-12 text-primary" />
              ) : (
                <KeyRound className="h-12 w-12 text-primary" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {step === 'phone' ? 'Enter Mobile Number' : 'Enter OTP'}
            </CardTitle>
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
                  <Label htmlFor="phone">Mobile Number</Label>
                  <div className="flex">
                    <div className="flex items-center px-3 border border-r-0 border-input rounded-l-md bg-muted text-muted-foreground">
                      +91
                    </div>
                    <Input
                      id="phone"
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
                    Enter your 10-digit Indian mobile number
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
                  <Label htmlFor="otp" className="text-center block">Enter 6-digit OTP</Label>
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
                    <p className="text-xs text-muted-foreground">
                      Preview mode: Use <span className="font-mono bg-muted px-1 rounded">123456</span>
                    </p>
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

            <div className="mt-6 text-center">
              <NavLink to="/">
                <Button variant="ghost" className="text-muted-foreground">
                  <HomeButton />
                  Back to Home
                </Button>
              </NavLink>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}