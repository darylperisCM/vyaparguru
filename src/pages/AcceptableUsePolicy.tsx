import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AcceptableUsePolicy() {
  return (
    <>
      <Helmet>
        <title>Acceptable Use Policy - VyaparGuru</title>
        <meta name="description" content="Acceptable Use Policy for VyaparGuru business English learning platform." />
        <link rel="canonical" href="/acceptable-use-policy" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container py-8 px-4 sm:px-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Acceptable Use Policy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p className="text-sm text-muted-foreground mb-6">
                Last Updated: September 11, 2025
              </p>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">1. PURPOSE</h2>
                <p className="text-muted-foreground">
                  This policy outlines acceptable use of VyaparGuru services to ensure a safe, legal, and productive environment for all users.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">2. ACCEPTABLE USE</h2>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">2.1 Permitted Activities</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Business communication improvement</li>
                    <li>Professional email writing</li>
                    <li>Language learning and translation</li>
                    <li>Voice pronunciation practice</li>
                    <li>Educational use of our tools</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">3. PROHIBITED ACTIVITIES</h2>
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-foreground mb-2">3.1 Illegal Activities</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Violating Indian laws or regulations</li>
                    <li>Copyright or trademark infringement</li>
                    <li>Fraud, identity theft, or deception</li>
                    <li>Money laundering or financial crimes</li>
                  </ul>
                </div>
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-foreground mb-2">3.2 Harmful Content</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Harassment, abuse, or threats</li>
                    <li>Discriminatory or hate speech</li>
                    <li>Adult content or inappropriate material</li>
                    <li>Malware, viruses, or harmful code</li>
                  </ul>
                </div>
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-foreground mb-2">3.3 System Abuse</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Attempting to hack or breach security</li>
                    <li>Overloading servers or networks</li>
                    <li>Reverse engineering our technology</li>
                    <li>Creating fake accounts or identities</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">3.4 Commercial Misuse</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Reselling our services without permission</li>
                    <li>Using services for competing businesses</li>
                    <li>Bulk automated requests or spam</li>
                    <li>Violating rate limits or usage quotas</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">4. CONSEQUENCES</h2>
                <p className="text-muted-foreground mb-2">Violations may result in:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Warning notifications</li>
                  <li>Temporary service suspension</li>
                  <li>Account termination</li>
                  <li>Legal action if necessary</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">5. REPORTING VIOLATIONS</h2>
                <p className="text-muted-foreground mb-2">Report abuse to: <a href="mailto:support@vyaparguru.info" className="text-primary hover:underline">support@vyaparguru.info</a></p>
                <p className="text-muted-foreground mb-2">Include:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Description of violation</li>
                  <li>Evidence or screenshots</li>
                  <li>Your contact information</li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">6. APPEAL PROCESS</h2>
                <p className="text-muted-foreground mb-2">If your account is suspended:</p>
                <ol className="list-decimal list-inside text-muted-foreground space-y-1">
                  <li>Email <a href="mailto:support@vyaparguru.info" className="text-primary hover:underline">support@vyaparguru.info</a></li>
                  <li>Explain the situation</li>
                  <li>Provide relevant evidence</li>
                  <li>We'll review within 5 business days</li>
                </ol>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}