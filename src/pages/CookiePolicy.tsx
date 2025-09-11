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
            <CardContent>
              <p className="text-muted-foreground">
                Cookie Policy document will be uploaded here.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}