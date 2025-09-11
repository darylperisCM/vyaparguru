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
            <CardContent>
              <p className="text-muted-foreground">
                Privacy Policy document will be uploaded here.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}