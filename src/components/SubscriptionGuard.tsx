import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionGuardProps {
  children: ReactNode;
}

export const SubscriptionGuard = ({ children }: SubscriptionGuardProps) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { hasAccess, loading, subscription, isPendingPayment, isExpired } = useSubscription();
  const navigate = useNavigate();
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

  const handlePayment = async () => {
    if (!subscription?.rzp_subscription_id) {
      console.error('No Razorpay subscription ID found');
      return;
    }

    setProcessingPayment(true);

    try {
      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: 'rzp_live_RRXRskxzxb3oMh', // This should come from env
          subscription_id: subscription.rzp_subscription_id,
          name: 'VyaparGuru',
          description: 'Business English Pro - Monthly Subscription',
          image: '/assets/fulllogo.png',
          handler: async function (response: any) {
            console.log('Payment successful:', response);
            
            // Payment will be verified via webhook
            // Just close modal and refresh subscription
            setShowPaymentModal(false);
            window.location.reload();
          },
          prefill: {
            email: '',
            contact: ''
          },
          theme: {
            color: '#FF6B6B'
          },
          modal: {
            ondismiss: function () {
              setProcessingPayment(false);
              setShowPaymentModal(false);
            }
          },
          config: {
            display: {
              blocks: {
                banks: {
                  name: 'Pay via UPI',
                  instruments: [
                    {
                      method: 'upi'
                    }
                  ]
                }
              },
              sequence: ['block.banks'],
              preferences: {
                show_default_blocks: false
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
      setProcessingPayment(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
                <span className="font-semibold">Business English Pro</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Price</span>
                <span className="text-2xl font-bold text-primary">₹99<span className="text-sm font-normal">/month</span></span>
              </div>
            </div>

            <Button 
              onClick={handlePayment}
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
                'Pay ₹99 via UPI'
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Secure payment powered by Razorpay. UPI only.
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
