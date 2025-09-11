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
            <CardContent>
              <p className="text-muted-foreground">
                Terms of Service document will be uploaded here.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}