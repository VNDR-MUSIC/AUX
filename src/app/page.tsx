
'use client';

import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Icons } from '@/components/icons';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Award, CalendarCheck, Check, Gift, Sparkles, Star, Waves, AlertTriangle } from 'lucide-react';
import LandingPageHeader from '@/components/layout/landing-page-header';
import Footer from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const heroSlides = [
  {
    id: 'hero-1',
    title: 'Your Partner in Publishing.',
    description: "Focus on creating. We'll handle the business. VNDR acts as your dedicated publisher, securing global opportunities in exchange for a 50% publishing share. It's a true partnership.",
    imageHint: 'musician stage'
  },
  {
    id: 'hero-2',
    title: 'Your New A&R is an AI.',
    description: 'Reach global audiences with intelligent promotion tools that get your music to the right ears, playlisters, and sync licensing opportunities.',
    imageHint: 'audio soundwave'
  },
  {
    id: 'hero-3',
    title: 'License Your Music, We Seal The Deal.',
    description: "Get your tracks in films, games, and ads. As your publisher, we actively pitch your catalog and negotiate the best terms on your behalf. It's that simple.",
    imageHint: 'audio production'
  },
];

const features = [
    {
        icon: <Waves className="h-10 w-10 text-primary" />,
        title: "Unlimited Free Distribution",
        description: "Stop paying per release. Distribute unlimited tracks to Spotify, Apple Music, and 150+ other platforms, and keep 100% of your master rights.",
    },
    {
        icon: <Sparkles className="h-10 w-10 text-primary" />,
        title: "AI-Powered Curation & Promo",
        description: "Our intelligent engine analyzes your music and gets it to playlist curators, influencers, and fans most likely to love it.",
    },
    {
        icon: <Award className="h-10 w-10 text-primary" />,
        title: "Global Sync Licensing",
        description: "Tired of dead-end submissions? Our AI finds sync opportunities in films, games, and ads that match your sound, and our team closes the deal.",
    },
    {
        icon: <Icons.vsd className="h-10 w-10 text-primary" />,
        title: "Transparent Royalty Payments",
        description: "No more black boxes or confusing statements. Our VSD token system provides a transparent, instant, and fair royalty ledger.",
    },
];

const testimonials = [
  {
    name: 'Synthwave Samurai',
    avatar: 'user-avatar-1',
    title: 'Artist',
    quote: "VNDR changed the game for me. The AI recommendations got my track 'Midnight Bloom' on three major playlists, and the blockchain royalties are transparent and fast. It's the first platform that feels like it's truly for artists.",
    stars: 5
  },
  {
    name: 'Pixel Pulse',
    avatar: 'user-avatar-2',
    title: 'Producer',
    quote: "As a producer, licensing is a huge part of my income. VNDR's licensing portal is straightforward, and their team has already landed me a spot in an indie game. I couldn't have done it without them.",
    stars: 5
  }
];

const faqs = [
  {
    question: "What does a 50% publishing share mean?",
    answer: "By uploading your music to VNDR, you enter into a standard co-publishing agreement. You retain 100% ownership of your master recordings, but you grant VNDR a 50% share of the publishing rights. This partnership is what allows us to legally and actively represent your music, pitch it for sync licenses in film, TV, and games, and collect royalties on your behalf worldwide. It's a true partnership to maximize your music's earning potential."
  },
  {
      question: "How can you offer unlimited distribution for free?",
      answer: "Our model is built on partnership. The Starter plan includes free unlimited distribution because we share in your success through our co-publishing agreement. This aligns our goals with yours: we only succeed when you succeed. For artists wanting more powerful tools, our AI Pro plan offers advanced features for a small monthly fee."
  },
  {
    question: "How does the VSD token and royalty system work?",
    answer: "We use our VSD token to create a transparent, verifiable ledger of all streams, sales, and licensing deals. When a royalty payment is due, it's paid instantly into your VNDR wallet. You can then hold it, use it on the platform, or convert it to your local currency. This eliminates the delays and opaque accounting common in the traditional music industry."
  },
  {
    question: "What are the AI-powered tools?",
    answer: "Our AI Pro plan gives you access to the VNDR Music AI Ecosystem. This includes tools to generate unique cover art, write marketing copy and press releases, get pricing recommendations for licenses, forecast potential earnings, and even get strategic career advice. It's like having an entire professional team at your fingertips."
  },
   {
    question: "How do I get more VSD tokens?",
    answer: "You receive free VSD tokens daily just for being an active member! If you need more for transactions like bidding on auctions or tipping other artists, you can purchase them directly through our secure portal or from our official partner exchange."
  },
  {
    question: "What are the requirements for submitting music?",
    answer: "We accept high-quality audio files (WAV, FLAC) and require that you control the rights to the music you upload. By uploading, you confirm you have the authority to enter into our co-publishing agreement for the submitted work."
  }
];


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <LandingPageHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[70vh] md:h-[90vh] w-full flex flex-col items-center justify-center p-0 overflow-hidden">
            <Carousel
                className="w-full h-full"
                opts={{
                loop: true,
                }}
                plugins={[
                Autoplay({
                    delay: 5000,
                }),
                ]}
            >
                <CarouselContent className="h-full">
                {heroSlides.map((slide) => {
                    const slideImage = PlaceHolderImages.find((img) => img.id === slide.id);
                    return (
                    <CarouselItem key={slide.id} className="relative w-full h-full">
                        {slideImage && (
                        <Image
                            src={slideImage.imageUrl}
                            alt={slide.description}
                            fill
                            className="object-cover"
                            data-ai-hint={slide.imageHint}
                            priority={slide.id === 'hero-1'}
                        />
                        )}
                        <div className="absolute inset-0 bg-black/60 z-10" />
                        <div className="relative z-20 container h-full flex flex-col items-center justify-center gap-6 text-center text-white">
                            <Icons.logo className="h-20 w-20 text-primary drop-shadow-lg" />
                            <h1 className="font-headline text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl drop-shadow-xl text-primary">
                                {slide.title}
                            </h1>
                            <p className="max-w-[700px] text-lg text-neutral-200 md:text-xl drop-shadow-lg">
                                {slide.description}
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                            <Button asChild size="lg" className="font-bold">
                                <Link href="/login">Become a Partner Artist</Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="font-bold bg-transparent text-white border-white hover:bg-white hover:text-primary">
                                <Link href="#pricing">See The Plans</Link>
                            </Button>
                            </div>
                        </div>
                    </CarouselItem>
                    );
                })}
                </CarouselContent>
                <CarouselPrevious className="absolute left-4 z-30 hidden md:flex" />
                <CarouselNext className="absolute right-4 z-30 hidden md:flex" />
            </Carousel>
        </section>

        {/* Daily Rewards Section */}
        <section id="rewards" className="py-16 md:py-24 bg-primary text-primary-foreground">
            <div className="container px-4 md:px-6">
                <div className="text-center">
                    <Gift className="h-16 w-16 mx-auto mb-4" />
                    <h2 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">Get Paid to Participate.</h2>
                    <p className="max-w-[700px] mx-auto mt-4 text-primary-foreground/80 md:text-xl">
                        Sign up for free and receive complimentary <Icons.vsd className="inline h-5 w-5" /> tokens every day. Our token economy rewards artists just for being part of the community.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 mt-8">
                        <Button asChild size="lg" className="font-bold bg-white text-black hover:bg-gray-200">
                            <Link href="/login">Claim Your First Tokens</Link>
                        </Button>
                         <Button asChild size="lg" variant="outline" className="font-bold bg-transparent text-white border-white hover:bg-white hover:text-primary">
                            <Link href="#features">Learn More</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>


        {/* Features Section */}
        <section id="features" className="py-16 md:py-24 bg-secondary">
            <div className="container px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">The Old Music Industry is Broken. We're Building a Better One.</h2>
                    <p className="max-w-[700px] mx-auto mt-4 text-muted-foreground md:text-xl">
                        VNDR gives independent artists the power of a major label, without the predatory contracts.
                    </p>
                </div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature, index) => (
                        <div key={index} className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-md border">
                            {feature.icon}
                            <h3 className="font-headline text-2xl font-semibold mt-4 mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </div>
                    ))}
                </div>
                 <div className="text-center mt-12">
                    <Button asChild size="lg">
                        <Link href="/login">Get Started & Upload Your Music</Link>
                    </Button>
                </div>
            </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-16 md:py-24">
            <div className="container px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl text-primary">Simple, Artist-First Pricing</h2>
                    <p className="max-w-[700px] mx-auto mt-4 text-muted-foreground md:text-xl">
                        No hidden fees. No confusing contracts. Just powerful tools to grow your career.
                    </p>
                    <div className="flex items-center justify-center space-x-2 mt-6">
                      <Label htmlFor="billing-cycle">Monthly</Label>
                      <Switch id="billing-cycle" />
                      <Label htmlFor="billing-cycle">Yearly (Save 20%)</Label>
                    </div>
                </div>
                <div className="grid gap-8 md:grid-cols-3">
                    {/* Starter Plan */}
                    <Card className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl">Starter</CardTitle>
                            <CardDescription>For artists starting their journey.</CardDescription>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold font-headline">Free Forever</span>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-4">
                             <p className="font-semibold text-primary flex items-center gap-2"><CalendarCheck className="h-5 w-5" /> Free <Icons.vsd className="h-5 w-5" /> daily!</p>
                            <ul className="space-y-2 text-muted-foreground">
                                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-primary"/>Free unlimited distribution</li>
                                <li className="flex items-center font-bold text-foreground"><Check className="h-4 w-4 mr-2 text-primary"/>50/50 Publishing Partnership</li>
                                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-primary"/>Basic Analytics Dashboard</li>
                                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-primary"/>Monthly Royalty Payouts</li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" asChild>
                                <Link href="/login">Start for Free</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                    {/* AI Pro Plan */}
                    <Card className="flex flex-col border-2 border-primary shadow-lg">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className="font-headline text-2xl">AI Pro</CardTitle>
                                <div className="text-xs font-semibold bg-primary text-primary-foreground px-2 py-1 rounded-full">MOST POPULAR</div>
                            </div>
                            <CardDescription>For the serious artist building a career.</CardDescription>
                            <div className="flex items-baseline gap-2">
                                <Icons.vsd className="h-8 w-8 text-primary" />
                                <span className="text-4xl font-bold font-headline">250</span>
                                <span className="text-lg font-normal text-muted-foreground">/mo</span>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-4">
                            <ul className="space-y-2 text-muted-foreground">
                                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-primary"/>Everything in Starter, plus:</li>
                                <li className="flex items-center font-bold text-foreground"><Check className="h-4 w-4 mr-2 text-primary"/>Full VNDR AI Ecosystem Access</li>
                                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-primary"/>AI-Powered Promotion Tools</li>
                                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-primary"/>Automated Sync Licensing Submissions</li>
                                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-primary"/>Instant <Icons.vsd className="h-4 w-4 mx-1" /> Royalty Payouts</li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full">Start 14-Day Free Trial</Button>
                        </CardFooter>
                    </Card>
                    {/* Label Plan */}
                    <Card className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl">Label</CardTitle>
                            <CardDescription>For teams managing multiple artists.</CardDescription>
                            <p className="text-4xl font-bold font-headline">Contact Us</p>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-4">
                            <ul className="space-y-2 text-muted-foreground">
                                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-primary"/>Everything in AI Pro, plus:</li>
                                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-primary"/>Multi-Artist Management Seat</li>
                                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-primary"/>Dedicated Account Manager</li>
                                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-primary"/>Custom Royalty Splits & Contracts</li>
                                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-primary"/>Advanced API Access</li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" variant="outline">Contact Sales</Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 md:py-24 bg-secondary">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">Why Artists are Leaving Other Distributors for VNDR</h2>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              {testimonials.map((testimonial, index) => {
                const avatarImage = PlaceHolderImages.find(img => img.id === testimonial.avatar);
                return (
                  <Card key={index} className="p-6">
                    <CardContent className="p-0">
                      <div className="flex items-center mb-4">
                        {avatarImage && (
                          <Image
                            src={avatarImage.imageUrl}
                            alt={testimonial.name}
                            width={50}
                            height={50}
                            className="rounded-full"
                            data-ai-hint={avatarImage.imageHint}
                          />
                        )}
                        <div className="ml-4">
                          <p className="font-bold">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                        </div>
                      </div>
                      <div className="flex mb-4">
                          {Array.from({ length: testimonial.stars }).map((_, i) => (
                              <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                          ))}
                      </div>
                      <p className="text-muted-foreground italic">&quot;{testimonial.quote}&quot;</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-24">
          <div className="container max-w-3xl px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">Your Questions, Answered.</h2>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-lg font-semibold text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
        
        {/* Final CTA Section */}
        <section className="py-16 md:py-24 bg-primary text-primary-foreground">
            <div className="container text-center">
                <h2 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">
                   Ready to Own Your Music Career?
                </h2>
                <p className="max-w-[600px] mx-auto mt-4 mb-8 text-primary-foreground/80 md:text-xl">
                    Join thousands of independent artists who trust VNDR for distribution, licensing, and fair royalties. Sign up in minutes.
                </p>
                <Button asChild size="lg" className="font-bold bg-white text-black hover:bg-gray-200">
                    <Link href="/login">Sign Up Free & Claim Your Tokens</Link>
                </Button>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

    