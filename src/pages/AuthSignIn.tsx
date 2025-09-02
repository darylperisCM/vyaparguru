import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, ArrowLeft } from 'lucide-react';

export default function AuthSignIn() {
  const { isAuthenticated, sendEmailOtp, sendSmsOtp, verifyOtp, login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [step, setStep] = useState<'input' | 'verify'>('input');
  const [activeTab, setActiveTab] = useState('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const result = activeTab === 'email' 
        ? await sendEmailOtp(email)
        : await sendSmsOtp(phone);
      
      if (result.success) {
        setStep('verify');
        setResendTimer(30);
        const countdown = setInterval(() => {
          setResendTimer(prev => {
            if (prev <= 1) {
              clearInterval(countdown);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
        toast({
          title: "OTP Sent",
          description: result.message,
        });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return;
    
    setLoading(true);
    try {
      const identifier = activeTab === 'email' ? email : phone;
      const result = await verifyOtp(otp, identifier, activeTab as 'email' | 'sms');
      
      if (result.success && result.user && result.token) {
        login(result.user, result.token);
        toast({
          title: "Success",
          description: result.message,
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
        setOtp('');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep('input');
    setOtp('');
    setResendTimer(0);
  };

  const isInputValid = () => {
    if (activeTab === 'email') {
      return email.includes('@') && email.includes('.');
    }
    return phone.length >= 10;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">व्यापार इंग्लिश गुरु</h1>
          <p className="text-muted-foreground">Sign in to continue your English journey</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              {step === 'verify' && (
                <Button variant="ghost" size="icon" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <div>
                <CardTitle>
                  {step === 'input' ? 'Sign In' : 'Verify OTP'}
                </CardTitle>
                <CardDescription>
                  {step === 'input' 
                    ? 'Enter your email or mobile number' 
                    : `Enter the 6-digit code sent to your ${activeTab}`}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {step === 'input' ? (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </TabsTrigger>
                  <TabsTrigger value="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Mobile
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="email" className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && isInputValid() && handleSendOtp()}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="phone" className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Mobile Number</label>
                    <Input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && isInputValid() && handleSendOtp()}
                    />
                  </div>
                </TabsContent>
                
                <Button 
                  onClick={handleSendOtp} 
                  className="w-full" 
                  disabled={!isInputValid() || loading}
                  variant="hero"
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                </Button>
              </Tabs>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Enter OTP</label>
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
                  <p className="text-xs text-muted-foreground text-center">
                    Demo: Use 123456 as OTP
                  </p>
                </div>
                
                <Button 
                  onClick={handleVerifyOtp} 
                  className="w-full" 
                  disabled={otp.length !== 6 || loading}
                  variant="hero"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </Button>
                
                <div className="text-center">
                  <Button
                    variant="ghost"
                    onClick={handleSendOtp}
                    disabled={resendTimer > 0 || loading}
                    className="text-sm"
                  >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="text-center mt-6">
          <Button variant="ghost" onClick={() => navigate('/')}>
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}