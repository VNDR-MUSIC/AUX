
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, BarChart, Bot, DollarSign, FileText, Gavel, GitBranch, GraduationCap, Sparkles, Users, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';

const painPoints = [
    {
        icon: <XCircle className="h-10 w-10 text-destructive" />,
        title: "Opaque Royalties & Delayed Payments",
        description: "Confusing statements and waiting months (or years) to get paid for your streams and sales.",
    },
    {
        icon: <XCircle className="h-10 w-10 text-destructive" />,
        title: "Gatekept Opportunities",
        description: "Struggling to get your music in front of music supervisors for sync placements in film, TV, and games.",
    },
     {
        icon: <XCircle className="h-10 w-10 text-destructive" />,
        title: "Lack of Support & Tools",
        description: "Feeling like you're on your own, juggling everything from marketing to legal without expert guidance.",
    },
    {
        icon: <XCircle className="h-10 w-10 text-destructive" />,
        title: "Giving Up Your Rights",
        description: "Being forced into restrictive, long-term deals where you lose control of your master recordings and creative direction.",
    },
];

const featureCards = [
    {
        icon: <GitBranch className="h-8 w-8 mb-4 text-primary" />,
        title: "Effortless Distribution",
        description: "Unlimited uploads to 150+ streaming services like Spotify and Apple Music. You always keep 100% of your rights."
    },
    {
        icon: <Users className="h-8 w-8 mb-4 text-primary" />,
        title: "Proactive Sync Licensing",
        description: "Partner with us and we become your publisher. We actively pitch your music for high-value placements in film, TV, and games."
    },
    {
        icon: <div className="h-8 w-8 mb-4 flex items-center justify-center"><Icons.vsd className="h-8 w-8" /></div>,
        title: "Transparent Royalties",
        description: "Get paid instantly. Our VSD token system provides a transparent, verifiable ledger for all your earnings."
    },
    {
        icon: <Bot className="h-8 w-8 mb-4 text-primary" />,
        title: "A Full AI-Powered Team",
        description: "From generating cover art and performance reports to getting simulated legal advice, our AI toolkit is always on."
    }
];

const aiTools = [
  {
    icon: <BarChart />,
    title: "AI Performance Reports",
    description: "Generate in-depth reports on your catalog's performance, audience demographics, and revenue projections for a small VSD fee."
  },
  {
    icon: <Sparkles />,
    title: "AI Cover Art Generation",
    description: "No designer? No problem. Create unique, professional cover art for your tracks based on title and genre."
  },
  {
    icon: <Gavel />,
    title: "Legal Eagle AI",
    description: "Ask general questions about complex industry topics like copyright, splits, and contracts, and get simulated legal information."
  },
  {
    icon: <FileText />,
    title: "AI Marketing Assistant",
    description: "Let Symbi, our platform AI, help you draft social media posts and press releases to promote your music."
  },
  {
    icon: <DollarSign />,
    title: "AI Licensing Price Recommendations",
    description: "Not sure what to charge for a license? Our AI suggests a fair market price based on genre and market data."
  },
  {
    icon: <Users />,
    title: "AI-Powered A&R",
    description: "Our system analyzes your music's DNA to identify potential collaborators and suggest which tracks to pitch for sync deals."
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
                 <Button asChild size="lg" className="font-bold mt-4">
                    <Link href="/login">Get Started Free <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
            </div>
        </section>

        {/* Pain Points Section */}
        <section id="the-problem" className="py-16 md:py-24 bg-secondary w-full">
            <div className="container px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="font-headline text-3xl sm:text-4xl font-bold tracking-tighter">The Old Industry Wasn't Built For You</h2>
                    <p className="max-w-[700px] mx-auto mt-4 text-muted-foreground md:text-lg">
                        Independent artists face the same challenges over and over. Sound familiar?
                    </p>
                </div>
                <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                    {painPoints.map((point, index) => (
                        <div key={index} className="relative flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-md border border-destructive/20">
                            {point.icon}
                            <h3 className="font-headline text-xl font-semibold mt-4 mb-2">{point.title}</h3>
                            <p className="text-muted-foreground text-sm flex-1">{point.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
        
        {/* The VNDR Solution Section */}
        <section id="the-solution" className="py-16 md:py-24 w-full">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl sm:text-4xl font-bold tracking-tighter">The VNDR Ecosystem: Your Unfair Advantage</h2>
              <p className="max-w-[700px] mx-auto mt-4 text-muted-foreground md:text-lg">
                  VNDR is more than a distributor; it's a complete platform designed for the modern independent artist.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featureCards.map((feature, index) => (
                <Card key={index} className="text-center p-6 flex flex-col bg-card/80">
                  {feature.icon}
                  <h3 className="font-headline text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm mt-2 flex-1">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* AI Toolkit Section */}
        <section id="ai-toolkit" className="py-16 md:py-24 bg-secondary w-full">
            <div className="container px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="font-headline text-3xl sm:text-4xl font-bold tracking-tighter">Your AI-Powered Team</h2>
                    <p className="max-w-[700px] mx-auto mt-4 text-muted-foreground md:text-lg">
                       Stop juggling tasks. Our suite of AI tools acts as your dedicated designer, analyst, and legal assistant, available 24/7.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {aiTools.map((tool, index) => (
                    <Card key={index} className="flex flex-col">
                      <CardHeader className="flex flex-row items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-full text-primary">
                          {tool.icon}
                        </div>
                        <CardTitle className="font-headline text-lg">{tool.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{tool.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
            </div>
        </section>
        
        {/* MIU Section */}
        <section className="py-16 md:py-24 w-full">
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
