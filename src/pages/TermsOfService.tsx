import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsOfService() {
  return (
    <>
      <Helmet>
        <title>Terms of Service - VyaparGuru</title>
        <meta name="description" content="Terms of Service for VyaparGuru business English learning platform." />
        <link rel="canonical" href="/terms-of-service" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container py-8 px-4 sm:px-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Terms of Service</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p className="text-sm text-muted-foreground mb-6">
                Last Updated: September 11, 2025<br />
                Effective Date: October 1, 2025
              </p>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">1. AGREEMENT TO TERMS</h2>
                <p className="text-muted-foreground mb-4">
                  These Terms of Service ("Terms") constitute a legally binding agreement between you ("User," "you," or "your") and VyaparGuru.info ("Company," "we," "us," or "our") concerning your access to and use of the VyaparGuru platform and services.
                </p>
                <p className="text-muted-foreground mb-4">
                  By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part of these terms, you may not access our services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">2. DESCRIPTION OF SERVICES</h2>
                <p className="text-muted-foreground mb-2">VyaparGuru provides:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4">
                  <li>AI-powered Hindi to English business communication translation</li>
                  <li>Professional email writing assistance</li>
                  <li>Voice pronunciation training</li>
                  <li>Business English learning modules</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">3. USER ACCOUNTS</h2>
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-foreground mb-2">3.1 Registration</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>You must provide accurate, complete information during registration</li>
                    <li>You must verify your mobile number through SMS OTP</li>
                    <li>You are responsible for maintaining account security</li>
                    <li>You must be at least 18 years old to create an account</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">3.2 Account Responsibilities</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Keep login credentials secure and confidential</li>
                    <li>Notify us immediately of unauthorized access</li>
                    <li>You are liable for all activities under your account</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">4. SUBSCRIPTION AND PAYMENT TERMS</h2>
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-foreground mb-2">4.1 Subscription Plans</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Basic Plan: ₹99/month with core features</li>
                  </ul>
                </div>
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-foreground mb-2">4.2 Payment Processing</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Payments processed through Razorpay</li>
                    <li>Subscription auto-renews monthly unless cancelled</li>
                    <li>All fees are non-refundable except as stated in our Refund Policy</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">4.3 Price Changes</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>We may modify subscription prices with 30 days written notice</li>
                    <li>Price changes apply to subsequent billing cycles</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">5. ACCEPTABLE USE</h2>
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-foreground mb-2">5.1 Permitted Uses</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Personal or business communication improvement</li>
                    <li>Learning English business communication</li>
                    <li>Translation of business-related content</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">5.2 Prohibited Uses</h3>
                  <p className="text-muted-foreground mb-2">You may NOT:</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Use services for illegal activities</li>
                    <li>Attempt to reverse engineer our technology</li>
                    <li>Share account credentials with others</li>
                    <li>Violate intellectual property rights</li>
                    <li>Send spam or malicious content</li>
                    <li>Abuse or overload our systems</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">6. INTELLECTUAL PROPERTY</h2>
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-foreground mb-2">6.1 Our Rights</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>VyaparGuru platform, technology, and content are our property</li>
                    <li>Our trademarks, logos, and brand elements are protected</li>
                    <li>AI models and translation algorithms are proprietary</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">6.2 Your Content</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>You retain rights to content you input</li>
                    <li>You grant us license to process your content to provide services</li>
                    <li>We don't claim ownership of your business communications</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">7. PRIVACY AND DATA PROTECTION</h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Your privacy is governed by our Privacy Policy</li>
                  <li>We comply with applicable Indian data protection laws</li>
                  <li>We use SMS OTP for secure authentication</li>
                  <li>Voice data is processed for pronunciation training only</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">8. SERVICE AVAILABILITY</h2>
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-foreground mb-2">8.1 Uptime</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>We strive for 99.5% service availability</li>
                    <li>Scheduled maintenance will be announced in advance</li>
                    <li>No compensation for brief service interruptions</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">8.2 Third-Party Dependencies</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Services may depend on third-party APIs (Google, Azure, Bhashini)</li>
                    <li>We're not liable for third-party service failures</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">9. LIMITATION OF LIABILITY</h2>
                <p className="text-muted-foreground mb-2 font-medium">TO THE MAXIMUM EXTENT PERMITTED BY LAW:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>We provide services "AS IS" without warranties</li>
                  <li>We're not liable for indirect, incidental, or consequential damages</li>
                  <li>Our total liability is limited to fees paid in the last 12 months</li>
                  <li>We don't guarantee translation accuracy or business outcomes</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">10. TERMINATION</h2>
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-foreground mb-2">10.1 By You</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Cancel subscription anytime through your account dashboard</li>
                    <li>Account remains active until end of billing period</li>
                    <li>No refunds for unused time</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">10.2 By Us</h3>
                  <p className="text-muted-foreground mb-2">We may terminate accounts for:</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Violation of these Terms</li>
                    <li>Non-payment of fees</li>
                    <li>Illegal or harmful activities</li>
                    <li>Abuse of services or other users</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">11. DISPUTE RESOLUTION</h2>
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-foreground mb-2">11.1 Governing Law</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>These Terms are governed by Indian law</li>
                    <li>Disputes subject to jurisdiction of Delhi courts</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">11.2 Resolution Process</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Good faith negotiation first</li>
                    <li>Binding arbitration if negotiation fails</li>
                    <li>Individual claims only (no class actions)</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">12. CHANGES TO TERMS</h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>We may update these Terms with reasonable notice</li>
                  <li>Material changes require 30 days advance notice</li>
                  <li>Continued use after changes constitutes acceptance</li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">13. CONTACT INFORMATION</h2>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-foreground font-medium mb-2">VyaparGuru.info</p>
                  <p className="text-muted-foreground">Email: <a href="mailto:support@vyaparguru.info" className="text-primary hover:underline">support@vyaparguru.info</a></p>
                  <p className="text-muted-foreground">Feedback: <a href="mailto:feedback@vyaparguru.info" className="text-primary hover:underline">feedback@vyaparguru.info</a></p>
                  <p className="text-muted-foreground">For legal notices: <a href="mailto:legal@vyaparguru.info" className="text-primary hover:underline">legal@vyaparguru.info</a></p>
                </div>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}