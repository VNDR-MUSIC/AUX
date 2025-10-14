
import Link from 'next/link';
import { Icons } from '@/components/icons';
import AnimatedGradientText from '@/components/animated-gradient-text';
import { Button } from '@/components/ui/button';

export default function LandingPageHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Icons.logo className="h-6 w-6 text-primary" />
          <span className="hidden font-bold sm:inline-block font-headline text-lg">
             <AnimatedGradientText>VNDR</AnimatedGradientText>
          </span>
        </Link>
        <nav className="flex-1 items-center space-x-6 text-sm font-medium hidden md:flex">
          <Link href="#features" className="text-muted-foreground hover:text-foreground">Features</Link>
          <Link href="#pricing" className="text-muted-foreground hover:text-foreground">Pricing</Link>
          <Link href="/dashboard/licensing" className="text-muted-foreground hover:text-foreground">Licensing</Link>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/login">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

    