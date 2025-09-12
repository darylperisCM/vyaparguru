import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - VyaparGuru</title>
        <meta name="description" content="Privacy Policy for VyaparGuru business English learning platform." />
        <link rel="canonical" href="/privacy-policy" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container py-8 px-4 sm:px-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p className="text-sm text-muted-foreground mb-6">
                Last Updated: September 11, 2025<br />
                Effective Date: October 1, 2025
              </p>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">1. INFORMATION WE COLLECT</h2>
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-foreground mb-2">1.1 Account Information</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Name, email address, mobile number</li>
                    <li>Payment information (processed by Razorpay)</li>
                    <li>Business type and communication preferences</li>
                  </ul>
                </div>
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-foreground mb-2">1.2 Usage Data</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Translation requests and content (temporarily processed)</li>
                    <li>Voice recordings for pronunciation training</li>
                    <li>App usage patterns and feature utilization</li>
                    <li>Device information and IP addresses</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">1.3 Communication Data</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>SMS OTP verification messages</li>
                    <li>Customer support interactions</li>
                    <li>Feedback and survey responses</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">2. HOW WE USE YOUR INFORMATION</h2>
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-foreground mb-2">2.1 Service Provision</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Process translation requests using AI systems</li>
                    <li>Provide voice pronunciation analysis</li>
                    <li>Deliver SMS OTP for account security</li>
                    <li>Personalize learning recommendations</li>
                  </ul>
                </div>
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-foreground mb-2">2.2 Business Operations</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Process payments and prevent fraud</li>
                    <li>Provide customer support</li>
                    <li>Send service notifications and updates</li>
                    <li>Improve our services and develop new features</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">2.3 Legal Compliance</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Comply with Indian laws and regulations</li>
                    <li>Respond to legal requests</li>
                    <li>Protect our rights and prevent abuse</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">3. INFORMATION SHARING</h2>
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-foreground mb-2">3.1 Service Providers</h3>
                  <p className="text-muted-foreground mb-2">We share data with trusted partners:</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Razorpay: Payment processing</li>
                    <li>MSG91: SMS OTP delivery</li>
                    <li>Google Cloud: Speech processing</li>
                    <li>Azure: Voice analysis</li>
                    <li>Bhashini: Government translation API</li>
                  </ul>
                </div>
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-foreground mb-2">3.2 Legal Requirements</h3>
                  <p className="text-muted-foreground mb-2">We may disclose information when:</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Required by Indian law</li>
                    <li>Protecting our legal rights</li>
                    <li>Preventing fraud or harm</li>
                    <li>Responding to government requests</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">3.3 Business Transfers</h3>
                  <p className="text-muted-foreground">Information may be transferred in merger, acquisition, or sale situations.</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">4. DATA SECURITY</h2>
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-foreground mb-2">4.1 Security Measures</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Encryption of data in transit and at rest</li>
                    <li>Regular security assessments</li>
                    <li>Access controls and authentication</li>
                    <li>Secure API integrations</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">4.2 Data Retention</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Account data: Retained while account is active</li>
                    <li>Translation content: Processed temporarily, not stored</li>
                    <li>Voice recordings: Deleted after processing</li>
                    <li>Usage logs: Retained for 12 months</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">5. YOUR RIGHTS</h2>
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-foreground mb-2">5.1 Access and Control</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>View and update account information</li>
                    <li>Download your data</li>
                    <li>Delete your account and data</li>
                    <li>Opt-out of marketing communications</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">5.2 Data Protection Rights</h3>
                  <p className="text-muted-foreground mb-2">Under Indian data protection laws, you have rights to:</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Know what personal data we collect</li>
                    <li>Access your personal data</li>
                    <li>Correct inaccurate information</li>
                    <li>Request data deletion</li>
                    <li>Withdraw consent</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">6. COOKIES AND TRACKING</h2>
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-foreground mb-2">6.1 Cookies We Use</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Essential: Required for service functionality</li>
                    <li>Analytics: Usage statistics and improvement</li>
                    <li>Preferences: Remember your settings</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">6.2 Your Choices</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Browser cookie controls</li>
                    <li>Opt-out of analytics tracking</li>
                    <li>Manage communication preferences</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">7. INTERNATIONAL TRANSFERS</h2>
                <p className="text-muted-foreground">Data may be processed in servers located outside India with appropriate safeguards in place.</p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">8. CHILDREN'S PRIVACY</h2>
                <p className="text-muted-foreground">Our services are not intended for users under 18. We don't knowingly collect children's personal information.</p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">9. UPDATES TO POLICY</h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>We may update this policy with reasonable notice</li>
                  <li>Material changes will be highlighted</li>
                  <li>Continued use constitutes acceptance</li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">10. CONTACT US</h2>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-foreground font-medium mb-2">Data Protection Officer</p>
                  <p className="text-muted-foreground">Email: <a href="mailto:privacy@vyaparguru.info" className="text-primary hover:underline">privacy@vyaparguru.info</a></p>
                  <p className="text-muted-foreground">Support: <a href="mailto:support@vyaparguru.info" className="text-primary hover:underline">support@vyaparguru.info</a></p>
                  <p className="text-muted-foreground mt-2">Complaints: File complaints with appropriate Indian data protection authorities.</p>
                </div>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}