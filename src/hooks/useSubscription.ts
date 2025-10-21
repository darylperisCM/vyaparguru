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

  // 🚨 FIX: Fire Google Ads conversion with proper error handling
  const fireGoogleAdsConversion = (transactionId: string, additionalData?: any) => {
    try {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        console.log('🎯 Google Ads gtag detected - firing conversion events');
        
        // Standard conversion event
        console.log('📊 Firing conversion event: AW-342370220/KmozCNKM3q8bEKzPoKMB');
        (window as any).gtag('event', 'conversion', {
          'send_to': 'AW-342370220/KmozCNKM3q8bEKzPoKMB',
          'value': 99.0,
          'currency': 'INR',
          'transaction_id': transactionId,
          'custom_parameters': {
            'subscription_type': 'monthly',
            'plan_name': 'VyaparGuru',
            'payment_method': 'razorpay'
          }
        });
        
        // Enhanced conversions with user data
        console.log('👤 Setting enhanced conversion user data');
        (window as any).gtag('set', 'user_data', {
          'email': profile?.email || user?.email || '',
          'phone_number': profile?.mobile_number || '',
          'address': {
            'first_name': profile?.name?.split(' ')[0] || '',
            'last_name': profile?.name?.split(' ').slice(1).join(' ') || '',
          }
        });
        
        // Purchase event for remarketing
        console.log('🛒 Firing purchase event for remarketing');
        (window as any).gtag('event', 'purchase', {
          'send_to': 'AW-342370220',
          'value': 99.0,
          'currency': 'INR',
          'transaction_id': transactionId,
          'items': [{
            'id': 'vyaparguru-subscription',
            'name': 'VyaparGuru Monthly Subscription',
            'category': 'Subscription',
            'price': 99.0,
            'quantity': 1
          }]
        });
        
        console.log('✅ All Google Ads tracking events fired successfully');
        return true;
      } else {
        console.error('❌ Google Ads gtag not found - conversion tracking not fired');
        return false;
      }
    } catch (error) {
      console.error('❌ Error firing Google Ads conversion:', error);
      return false;
    }
  };

  const handlePayment = async (retryCount = 0) => {
    const MAX_RETRIES = 3;
    setProcessingPayment(true);

    try {
      let subscriptionId = subscription?.rzp_subscription_id;

      // If no Razorpay subscription ID, create it first
      if (!subscriptionId) {
        console.log('Creating Razorpay subscription with immediate billing');
        
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

        if (subError || !subData?.subscriptionId) { // 🚨 FIX: Use correct field name
          console.error('Failed to create Razorpay subscription:', subError);
          toast({
            title: "Subscription Creation Failed",
            description: "Please try again or contact support.",
            variant: "destructive"
          });
          setProcessingPayment(false);
          setShowPaymentModal(false);
          return;
        }

        subscriptionId = subData.subscriptionId; // 🚨 FIX: Correct field name
        console.log('Razorpay subscription created with immediate billing:', subscriptionId);

        // 🚨 NEW: Check if immediate charge was successful
        if (subData.immediateCharge) {
          console.log('✅ Immediate charge confirmed - subscription should be active');
          
          // Fire conversion immediately since payment already happened
          fireGoogleAdsConversion(subscriptionId, { immediate_charge: true });
          
          // Still proceed with Razorpay modal for UX consistency
        }
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
            console.log('✅ Payment successful - Razorpay Response:', response);
            
            // Fire Google Ads Conversion Tracking
            const conversionFired = fireGoogleAdsConversion(
              response.razorpay_payment_id || subscriptionId,
              { payment_response: response }
            );
            
            if (!conversionFired) {
              // Log for debugging but don't block user flow
              console.warn('⚠️ Google Ads conversion may not have fired properly');
            }
            
            // Show processing message
            toast({
              title: "Processing Payment...",
              description: "Please wait while we confirm your subscription.",
            });

            // 🚨 FIX: Updated polling with correct response structure
            const pollStatus = async (attempts = 0): Promise<boolean> => {
              const MAX_ATTEMPTS = 10; // 30 seconds total (3s * 10)
              
              if (attempts >= MAX_ATTEMPTS) {
                console.error('❌ Polling timeout - subscription status not confirmed');
                return false;
              }

              try {
                const { data, error } = await supabase.functions.invoke('razorpay-check-status', {
                  body: { subscriptionId }
                });

                if (error) {
                  console.error('Error checking status:', error);
                  await new Promise(resolve => setTimeout(resolve, 3000));
                  return pollStatus(attempts + 1);
                }

                console.log(`Poll attempt ${attempts + 1}:`, data);

                // 🚨 FIX: Use correct response structure
                const status = data?.subscription?.status || data?.status;
                console.log(`Status = ${status}`);

                if (status === 'active' || status === 'authenticated') {
                  console.log('✅ Subscription confirmed as active!');
                  return true;
                }

                // Wait and retry
                await new Promise(resolve => setTimeout(resolve, 3000));
                return pollStatus(attempts + 1);

              } catch (err) {
                console.error('Polling error:', err);
                await new Promise(resolve => setTimeout(resolve, 3000));
                return pollStatus(attempts + 1);
              }
            };

            // Start polling
            const isActive = await pollStatus();

            if (isActive) {
              toast({
                title: "Payment Successful!",
                description: "Your subscription is now active. Welcome to VyaparGuru!",
              });
              setShowPaymentModal(false);
              setProcessingPayment(false);
              
              // Refresh the subscription data and reload
              await refetch();
              window.location.reload();
            } else {
              toast({
                title: "Payment Received",
                description: "Your payment is being processed. Please refresh in a few moments.",
              });
              setShowPaymentModal(false);
              setProcessingPayment(false);
            }
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
        setProcessingPayment(false); // Reset processing state when modal opens
      };

      script.onerror = () => {
        console.error('Failed to load Razorpay script');
        toast({
          title: "Payment System Error",
          description: "Please check your connection and try again.",
          variant: "destructive"
        });
        setProcessingPayment(false);
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

  // Rest of your component remains the same...
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
                  console.log('Refreshing subscription');
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
              {/* 🚨 NEW: Show immediate billing notice */}
              <div className="mt-2 text-xs text-center text-muted-foreground border-t pt-2">
                ⚡ Immediate access after payment • तुरंत सक्रिय
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
