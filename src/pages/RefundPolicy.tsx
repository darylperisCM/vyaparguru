import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RefundPolicy() {
  return (
    <>
      <Helmet>
        <title>Refund and Cancellation Policy - VyaparGuru</title>
        <meta name="description" content="Refund and Cancellation Policy for VyaparGuru business English learning platform." />
        <link rel="canonical" href="/refund-policy" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container py-8 px-4 sm:px-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Refund and Cancellation Policy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p className="text-sm text-muted-foreground mb-6">
                Last Updated: September 11, 2025<br />
                Effective Date: October 1, 2025
              </p>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">1. SUBSCRIPTION CANCELLATION</h2>
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-foreground mb-2">1.1 How to Cancel</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Login to your VyaparGuru account</li>
                    <li>Go to Account Settings &gt; Subscription</li>
                    <li>Click "Cancel Subscription"</li>
                    <li>Confirm cancellation</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">1.2 When Cancellation Takes Effect</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Cancellation is effective at the end of current billing period</li>
                    <li>You retain access to services until period expires</li>
                    <li>No partial refunds for unused time in current period</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">2. REFUND POLICY</h2>
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-foreground mb-2">2.1 7-Day Money-Back Guarantee</h3>
                  <p className="text-muted-foreground mb-2">New subscribers only:</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Full refund if cancelled within 7 days of first payment</li>
                    <li>Must request refund via <a href="mailto:support@vyaparguru.info" className="text-primary hover:underline">support@vyaparguru.info</a></li>
                    <li>Refund processed within 5-7 business days</li>
                  </ul>
                </div>
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-foreground mb-2">2.2 Service Issues</h3>
                  <p className="text-muted-foreground mb-2">Refunds may be provided for:</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Extended service outages (&gt;48 hours)</li>
                    <li>Significant feature failures</li>
                    <li>Billing errors or duplicate charges</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">2.3 Non-Refundable Situations</h3>
                  <p className="text-muted-foreground mb-2">No refunds for:</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Voluntary cancellations after 7-day period</li>
                    <li>Account termination due to Terms violation</li>
                    <li>Change of mind or unused services</li>
                    <li>Third-party service failures beyond our control</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">3. BILLING DISPUTES</h2>
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-foreground mb-2">3.1 Dispute Process</h3>
                  <ol className="list-decimal list-inside text-muted-foreground space-y-1">
                    <li>Contact <a href="mailto:support@vyaparguru.info" className="text-primary hover:underline">support@vyaparguru.info</a> within 30 days</li>
                    <li>Provide transaction details and dispute reason</li>
                    <li>We'll investigate within 5 business days</li>
                    <li>Resolution communicated via email</li>
                  </ol>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">3.2 Payment Gateway Disputes</h3>
                  <p className="text-muted-foreground mb-2">For payment issues:</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Contact Razorpay customer support</li>
                    <li>Dispute through your bank/card issuer</li>
                    <li>We'll cooperate with legitimate dispute investigations</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">4. REFUND PROCESSING</h2>
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-foreground mb-2">4.1 Timeline</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Approved refunds processed within 5-7 business days</li>
                    <li>Refunds credited to original payment method</li>
                    <li>Bank processing may take additional 3-5 business days</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">4.2 Partial Refunds</h3>
                  <p className="text-muted-foreground mb-2">Calculated on pro-rata basis for:</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Service outages exceeding SLA commitments</li>
                    <li>Proven service quality issues</li>
                    <li>Billing system errors</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">5. PLAN CHANGES</h2>
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-foreground mb-2">5.1 Upgrades</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Immediate access to new plan features</li>
                    <li>Pro-rated billing adjustment for current period</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">5.2 Downgrades</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Change effective at next billing cycle</li>
                    <li>Current period features remain available</li>
                  </ul>
                </div>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">6. CONTACT FOR REFUNDS</h2>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-muted-foreground mb-2">Email: <a href="mailto:support@vyaparguru.info" className="text-primary hover:underline">support@vyaparguru.info</a></p>
                  <p className="text-muted-foreground mb-2">Subject Line: "Refund Request - [Your Account Email]"</p>
                  <p className="text-muted-foreground mb-2">Include:</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-2">
                    <li>Account email address</li>
                    <li>Transaction ID</li>
                    <li>Reason for refund request</li>
                    <li>Date of payment</li>
                  </ul>
                  <p className="text-muted-foreground font-medium">Response Time: Within 24 hours during business days</p>
                </div>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}