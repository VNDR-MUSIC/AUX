import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import LandingPageHeader from '@/components/layout/landing-page-header';
import Footer from '@/components/layout/footer';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <LandingPageHeader />
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-md">
          <h1 className="font-headline text-9xl font-bold text-primary drop-shadow-lg">404</h1>
          <h2 className="mt-4 font-headline text-3xl font-semibold tracking-tight">
            Page Not Found
          </h2>
          <p className="mt-4 text-muted-foreground">
            Oops! The page you are looking for does not exist. It might have been moved or deleted.
          </p>
          <Button asChild className="mt-8">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Back Home
            </Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
