import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CookiePolicy() {
  return (
    <>
      <Helmet>
        <title>Cookie Policy - VyaparGuru</title>
        <meta name="description" content="Cookie Policy for VyaparGuru business English learning platform." />
        <link rel="canonical" href="/cookie-policy" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container py-8 px-4 sm:px-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Cookie Policy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p className="text-sm text-muted-foreground mb-6">
                Last Updated: September 11, 2025
              </p>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">1. WHAT ARE COOKIES</h2>
                <p className="text-muted-foreground">
                  Cookies are small text files stored on your device when you visit our website. They help us provide better services and user experience.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">2. COOKIES WE USE</h2>
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-foreground mb-2">2.1 Essential Cookies</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Authentication: Keep you logged in</li>
                    <li>Security: Prevent fraud and abuse</li>
                    <li>Functionality: Remember your preferences</li>
                  </ul>
                </div>
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-foreground mb-2">2.2 Analytics Cookies</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Usage tracking: Understand how you use our services</li>
                    <li>Performance: Identify and fix issues</li>
                    <li>Improvement: Develop better features</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">2.3 Communication Cookies</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Support: Enable chat functionality</li>
                    <li>Notifications: Service updates and alerts</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">3. MANAGING COOKIES</h2>
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-foreground mb-2">3.1 Browser Controls</h3>
                  <p className="text-muted-foreground mb-2">You can control cookies through browser settings:</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Chrome: Settings &gt; Privacy &gt; Cookies</li>
                    <li>Firefox: Options &gt; Privacy &gt; Cookies</li>
                    <li>Safari: Preferences &gt; Privacy &gt; Cookies</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">3.2 Our Controls</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Opt-out of analytics cookies in Account Settings</li>
                    <li>Manage communication preferences</li>
                    <li>Essential cookies cannot be disabled</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">4. THIRD-PARTY COOKIES</h2>
                <p className="text-muted-foreground mb-2">We may use third-party services that set their own cookies:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Google Analytics (analytics)</li>
                  <li>Razorpay (payments)</li>
                  <li>Customer support tools</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">5. UPDATES</h2>
                <p className="text-muted-foreground">We may update this Cookie Policy. Check this page periodically for changes.</p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">6. CONTACT</h2>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-muted-foreground">Questions about cookies: <a href="mailto:support@vyaparguru.info" className="text-primary hover:underline">support@vyaparguru.info</a></p>
                </div>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}