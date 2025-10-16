import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { useProfile } from '@/hooks/useProfile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionGuardProps {
  children: ReactNode;
}

export const SubscriptionGuard = ({ children }: SubscriptionGuardProps) => {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const { hasAccess, loading, subscription, isPendingPayment, isExpired, isInTrial, isActive, refetch } = useSubscription();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  // Log subscription state for debugging
  console.log('[SubscriptionGuard] State:', {
    user: user?.id,
    hasAccess,
    subscription: subscription?.id,
    status: subscription?.status,
    isInTrial,
    isActive,
    isPendingPayment,
    isExpired
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/auth/sign-in');
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (!loading && !hasAccess && (isPendingPayment || isExpired)) {
      setShowPaymentModal(true);
    }
  }, [hasAccess, loading, isPendingPayment, isExpired]);

  const handlePayment = async (retryCount = 0) => {
    const MAX_RETRIES = 3;
    setProcessingPayment(true);

    try {
      let subscriptionId = subscription?.rzp_subscription_id;

      // If no Razorpay subscription ID, create it first
      if (!subscriptionId) {
        console.log('No Razorpay subscription ID found, creating one...');
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.error('User not authenticated');
          setProcessingPayment(false);
          return;
        }

        const { data: subData, error: subError } = await supabase.functions.invoke('razorpay-subscription', {
          body: { 
            action: 'create-subscription',
            userId: user.id 
          }
        });

        if (subError || !subData?.subscription_id) {
          console.error('Failed to create Razorpay subscription:', subError);
          setProcessingPayment(false);
          setShowPaymentModal(false);
          return;
        }

        subscriptionId = subData.subscription_id;
        console.log('Created Razorpay subscription:', subscriptionId);
      }

      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          subscription_id: subscriptionId,
          name: 'VyaparGuru - व्यापार गुरु',
          description: 'व्यापार में English, सफलता में Confidence!',
          image: '/assets/fulllogo.png',
          handler: async function (response: any) {
            console.log('Payment successful:', response);
            toast({
              title: "Payment Successful!",
              description: "Your subscription is now active.",
            });
            setShowPaymentModal(false);
            window.location.reload();
          },
          prefill: {
            name: profile?.name || '',
            email: profile?.email || user?.email || '',
            contact: profile?.mobile_number || ''
          },
          notes: {
            user_id: user?.id || '',
            user_name: profile?.name || '',
            mobile: profile?.mobile_number || ''
          },
          theme: {
            color: '#FF5722'
          },
          modal: {
            ondismiss: function () {
              setProcessingPayment(false);
              setShowPaymentModal(false);
              toast({
                title: "Payment Cancelled",
                description: "You can try again anytime.",
              });
            },
            onescape: function () {
              setProcessingPayment(false);
              setShowPaymentModal(false);
            }
          },
          config: {
            display: {
              preferences: {
                show_default_blocks: true
              }
            }
          }
        };

        // @ts-ignore
        const rzp = new window.Razorpay(options);
        rzp.open();
      };
    } catch (error) {
      console.error('Payment error:', error);
      
      if (retryCount < MAX_RETRIES) {
        toast({
          title: "Retrying...",
          description: `Attempt ${retryCount + 1} of ${MAX_RETRIES}`,
        });
        
        setTimeout(() => {
          handlePayment(retryCount + 1);
        }, 2000 * (retryCount + 1));
      } else {
        toast({
          title: "Payment Failed",
          description: "Please try again later or contact support.",
          variant: "destructive"
        });
        setProcessingPayment(false);
      }
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Debug card when subscription exists but hasAccess is false
  if (!hasAccess && subscription && !showPaymentModal) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader>
            <CardTitle className="text-center">🔍 Debug Information</CardTitle>
            <CardDescription className="text-center">
              Subscription found but access denied - investigating...
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm bg-muted p-4 rounded-lg font-mono">
              <div><strong>Auth Status:</strong> {isAuthenticated ? 'Authenticated ✓' : 'Not Authenticated ✗'}</div>
              <div><strong>User ID:</strong> {user?.id || 'N/A'}</div>
              <div className="border-t pt-2 mt-2">
                <div><strong>Subscription Found:</strong> Yes ✓</div>
                <div><strong>Subscription ID:</strong> {subscription.id}</div>
                <div><strong>Subscription Status:</strong> {subscription.status}</div>
                <div><strong>Trial Ends At:</strong> {subscription.trial_ends_at || 'N/A'}</div>
                <div><strong>Razorpay Sub ID:</strong> {subscription.rzp_subscription_id || 'NULL'}</div>
              </div>
              <div className="border-t pt-2 mt-2">
                <div><strong>Is In Trial:</strong> {isInTrial ? 'Yes ✓' : 'No ✗'}</div>
                <div><strong>Is Active:</strong> {isActive ? 'Yes ✓' : 'No ✗'}</div>
                <div><strong>Is Expired:</strong> {isExpired ? 'Yes' : 'No'}</div>
                <div><strong>Is Pending Payment:</strong> {isPendingPayment ? 'Yes' : 'No'}</div>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="text-red-500"><strong>Has Access:</strong> {hasAccess ? 'Yes ✓' : 'No ✗'}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  console.log('[SubscriptionGuard] Manually refreshing subscription...');
                  refetch();
                }}
                className="flex-1"
              >
                🔄 Retry Subscription Fetch
              </Button>
              <Button
                onClick={() => navigate('/pricing')}
                variant="outline"
                className="flex-1"
              >
                View Plans
              </Button>
            </div>
            <p className="text-xs text-center text-muted-foreground">
              Please check browser console for detailed logs
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!hasAccess && showPaymentModal) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <CreditCard className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Trial Period Ended</CardTitle>
            <CardDescription>
              Your 3-day free trial has ended. Subscribe now to continue accessing all features.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Plan</span>
                <span className="font-semibold">VyaparGuru - व्यापार गुरु</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Price</span>
                <span className="text-2xl font-bold text-primary">₹99<span className="text-sm font-normal">/month</span></span>
              </div>
            </div>

            <Button 
              onClick={() => handlePayment()}
              disabled={processingPayment}
              className="w-full"
              size="lg"
            >
              {processingPayment ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Subscribe for ₹99/month'
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              सुरक्षित भुगतान Razorpay द्वारा संचालित • Secure payment powered by Razorpay
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle>Subscription Required</CardTitle>
            <CardDescription>
              Please subscribe to access this feature
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/pricing')} className="w-full">
              View Plans
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
