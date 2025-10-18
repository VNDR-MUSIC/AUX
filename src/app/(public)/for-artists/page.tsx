
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Upload, Sparkles, Speaker, DollarSign, ArrowRight, GitBranch, BarChart, Users, GraduationCap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';

const journeySteps = [
    {
        icon: <Upload className="h-10 w-10 text-primary" />,
        title: "1. Upload & Enrich",
        description: "Submit your track. Our AI analyzes its DNA—BPM, key, mood—and can even generate unique cover art for you.",
    },
    {
        icon: <Sparkles className="h-10 w-10 text-primary" />,
        title: "2. Distribute & Publish",
        description: "We deliver your music to over 150 platforms. If you're a publishing partner, our team begins pitching your track for sync deals.",
    },
    {
        icon: <Speaker className="h-10 w-10 text-primary" />,
        title: "3. License & Promote",
        description: "Your music is discovered in our catalog by music supervisors. Our AI and human A&R teams work to place your music in film, TV, and games.",
    },
    {
        icon: <DollarSign className="h-10 w-10 text-primary" />,
        title: "4. Earn & Grow",
        description: "All royalties and licensing fees are paid directly to your VSD wallet. Use our analytics to track your growth and make informed decisions.",
    },
];

const featureCards = [
    {
        icon: <GitBranch className="h-8 w-8 mb-4 text-accent" />,
        title: "Effortless Distribution",
        description: "Unlimited uploads to 150+ streaming services. You keep 60% of your royalties and 100% of your rights. No hidden fees."
    },
    {
        icon: <Users className="h-8 w-8 mb-4 text-accent" />,
        title: "Proactive Sync Licensing",
        description: "Partner with us and we become your publisher. We actively pitch your music for high-value placements in media."
    },
    {
        icon: <BarChart className="h-8 w-8 mb-4 text-accent" />,
        title: "AI-Powered Analytics",
        description: "Generate in-depth reports on your catalog's performance, audience demographics, and revenue projections."
    },
    {
        icon: <div className="h-8 w-8 mb-4 flex items-center justify-center"><Icons.vsd className="h-8 w-8" /></div>,
        title: "Transparent Royalties",
        description: "Get paid instantly. Our VSD token system provides a transparent, verifiable ledger for all your earnings."
    }
];


export default function ForArtistsPage() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-4');

  return (
    <div className="flex flex-col min-h-screen bg-background/0 max-w-full overflow-x-hidden">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[60vh] w-full flex flex-col items-center justify-center p-0 overflow-hidden">
            {heroImage && (
                <Image
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    fill
                    className="object-cover"
                    data-ai-hint={heroImage.imageHint}
                    priority
                />
            )}
            <div className="absolute inset-0 bg-black/70 z-10" />
            <div className="relative z-20 container h-full flex flex-col items-center justify-center gap-6 text-center text-white px-4">
                <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter drop-shadow-xl">
                    The Autonomous Artist Platform
                </h1>
                <p className="max-w-[700px] text-base sm:text-lg text-neutral-200 md:text-xl drop-shadow-lg">
                    We provide the tools, technology, and team to turn your music into a thriving career, without the old-school gatekeepers.
                </p>
            </div>
        </section>

        {/* The Journey Section */}
        <section id="how-it-works" className="py-16 md:py-24 bg-secondary w-full">
            <div className="container px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="font-headline text-3xl sm:text-4xl font-bold tracking-tighter">Your Journey on VNDR</h2>
                    <p className="max-w-[700px] mx-auto mt-4 text-muted-foreground md:text-lg">
                        From studio session to royalty payment, we've streamlined the entire process.
                    </p>
                </div>
                <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                    {journeySteps.map((step, index) => (
                        <div key={index} className="relative flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-md border">
                            {step.icon}
                            <h3 className="font-headline text-xl font-semibold mt-4 mb-2">{step.title}</h3>
                            <p className="text-muted-foreground text-sm flex-1">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 md:py-24 w-full">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl sm:text-4xl font-bold tracking-tighter">Everything You Need to Succeed</h2>
              <p className="max-w-[700px] mx-auto mt-4 text-muted-foreground md:text-lg">
                  VNDR is more than a distributor; it's a complete ecosystem for the modern independent artist.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featureCards.map((feature, index) => (
                <Card key={index} className="text-center p-6 flex flex-col">
                  {feature.icon}
                  <h3 className="font-headline text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm mt-2 flex-1">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* MIU Section */}
        <section className="py-16 md:py-24 bg-secondary w-full">
            <div className="container px-4 md:px-6">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="relative h-40 w-full">
                        <Image src="https://i.ibb.co/4gJqBfM8/MIU-logo-wt.png" alt="MIU Logo" layout="fill" className="object-contain" />
                    </div>
                     <div className="text-center md:text-left">
                        <h2 className="font-headline text-3xl sm:text-4xl font-bold tracking-tighter">Level Up Your Knowledge</h2>
                        <p className="max-w-[700px] mt-4 text-muted-foreground md:text-lg">
                            In partnership with Music Industry University, we provide courses and resources to help you master the business of music.
                        </p>
                         <Button asChild size="lg" variant="outline" className="mt-6">
                            <Link href="https://musicindustry.university" target="_blank" rel="noopener noreferrer">
                                <GraduationCap className="mr-2 h-5 w-5" />
                                Explore Courses at MIU
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 md:py-24 bg-primary text-primary-foreground w-full">
            <div className="container text-center px-4">
                <h2 className="font-headline text-3xl sm:text-4xl font-bold tracking-tighter">
                    Ready to Take Control?
                </h2>
                <p className="max-w-[600px] mx-auto mt-4 mb-8 text-primary-foreground/80 md:text-lg">
                    Join the autonomous music revolution. Sign up for free, upload your music, and start building your career on your terms.
                </p>
                <Button asChild size="lg" className="font-bold bg-white text-black hover:bg-gray-200">
                    <Link href="/login">Get Started Free <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
            </div>
        </section>
      </main>
    </div>
  );
}
