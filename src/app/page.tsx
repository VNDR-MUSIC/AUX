
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
import AnimatedGradientText from '@/components/animated-gradient-text';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Award, Check, DollarSign, Music, Sparkles, Star, Waves } from 'lucide-react';
import LandingPageHeader from '@/components/layout/landing-page-header';
import Footer from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const heroSlides = [
  {
    id: 'hero-1',
    title: 'Your Music, Your Royalties, Your Future',
    description: 'The ultimate platform for independent artists to distribute, license, and monetize their music transparently.',
    imageHint: 'musician stage'
  },
  {
    id: 'hero-2',
    title: 'AI-Powered Promotion',
    description: 'Reach new audiences with our intelligent promotion tools that get your music to the right ears.',
    imageHint: 'audio soundwave'
  },
  {
    id: 'hero-3',
    title: 'Seamless Music Licensing',
    description: 'Get your tracks in films, games, and ads. We handle the deals, you collect the royalties.',
    imageHint: 'audio production'
  },
];

const features = [
    {
        icon: <Sparkles className="h-10 w-10 text-primary" />,
        title: "AI-Powered Curation & Promo",
        description: "Our intelligent engine gets your music to playlist curators and fans most likely to love it, amplifying your reach.",
    },
    {
        icon: <Award className="h-10 w-10 text-primary" />,
        title: "Global Licensing Opportunities",
        description: "Submit your music for use in films, games, and advertisements worldwide. Our team secures the placements for you.",
    },
    {
        icon: <Icons.vsd className="h-10 w-10 text-primary" />,
        title: "Blockchain Royalty Payments",
        description: "Using VSD tokens, we provide transparent, instant, and fair royalty payments directly to you.",
    },
    {
        icon: <DollarSign className="h-10 w-10 text-primary" />,
        title: "Keep 100% of Your Rights",
        description: "You own your music. Always. We're your partner, not your owner. You retain full copyright and control.",
    }
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
    question: "Do I keep the rights to my music?",
    answer: "Yes, absolutely. You retain 100% of your copyright and ownership. We are a service provider and partner, not a publisher. Our agreement is a distribution and licensing representation agreement, not a rights transfer."
  },
  {
    question: "How does the blockchain royalty system work?",
    answer: "We use VSD tokens to create a transparent ledger of all streams, sales, and licensing deals. When a royalty payment is due, it's converted to your preferred currency and transferred instantly. This eliminates delays and opaque accounting common in the industry."
  },
  {
    question: "What are the requirements for submitting music?",
    answer: "We accept high-quality audio files (WAV, FLAC) and require that you are the sole copyright holder of both the composition and the master recording. Your music will go through a brief quality review before being distributed."
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your subscription at any time. If you cancel, your music will be removed from our distribution and licensing network at the end of your billing period. You will still receive any royalties earned during your active subscription."
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
                            <Icons.logo className="h-20 w-20 text-white drop-shadow-lg" />
                            <h1 className="font-headline text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl drop-shadow-xl">
                                <AnimatedGradientText>{slide.title}</AnimatedGradientText>
                            </h1>
                            <p className="max-w-[700px] text-lg text-neutral-200 md:text-xl drop-shadow-lg">
                                {slide.description}
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                            <Button asChild size="lg" className="font-bold">
                                <Link href="/login">Start Your 14-Day Free Trial</Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="font-bold bg-transparent text-white border-white hover:bg-white hover:text-primary">
                                <Link href="#pricing">View Pricing</Link>
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

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24 bg-secondary">
            <div className="container px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">Built for the Independent Artist</h2>
                    <p className="max-w-[700px] mx-auto mt-4 text-muted-foreground md:text-xl">
                        VNDR provides the tools you need to succeed, while you keep control.
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
            </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-16 md:py-24">
            <div className="container px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl"><AnimatedGradientText>Simple, Transparent Pricing</AnimatedGradientText></h2>
                    <p className="max-w-[700px] mx-auto mt-4 text-muted-foreground md:text-xl">
                        Choose the plan that's right for your journey. Cancel anytime.
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
                            <CardDescription>For artists getting their music out there.</CardDescription>
                            <div className="flex items-baseline gap-2">
                                <Icons.vsd className="h-8 w-8 text-primary" />
                                <span className="text-4xl font-bold font-headline">90</span>
                                <span className="text-lg font-normal text-muted-foreground">VSD/mo</span>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-4">
                            <ul className="space-y-2 text-muted-foreground">
                                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-primary"/>Unlimited Song Uploads</li>
                                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-primary"/>Distribution to 20+ Platforms</li>
                                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-primary"/>Basic Analytics</li>
                                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-primary"/>Monthly Royalty Payouts</li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" variant="outline">Get Started</Button>
                        </CardFooter>
                    </Card>
                    {/* Pro Plan */}
                    <Card className="flex flex-col border-2 border-primary shadow-lg">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className="font-headline text-2xl">Pro</CardTitle>
                                <div className="text-xs font-semibold bg-primary text-primary-foreground px-2 py-1 rounded-full">MOST POPULAR</div>
                            </div>
                            <CardDescription>For the serious artist building a career.</CardDescription>
                            <div className="flex items-baseline gap-2">
                                <Icons.vsd className="h-8 w-8 text-primary" />
                                <span className="text-4xl font-bold font-headline">190</span>
                                <span className="text-lg font-normal text-muted-foreground">VSD/mo</span>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-4">
                            <ul className="space-y-2 text-muted-foreground">
                                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-primary"/>Everything in Starter, plus:</li>
                                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-primary"/>AI-Powered Promotion Tools</li>
                                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-primary"/>Sync Licensing Submissions</li>
                                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-primary"/>Instant VSD Royalty Payouts</li>
                                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-primary"/>Advanced Analytics & Trends</li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full">Start Free Trial</Button>
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
                                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-primary"/>Everything in Pro, plus:</li>
                                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-primary"/>Multi-Artist Management</li>
                                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-primary"/>Dedicated Account Manager</li>
                                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-primary"/>Custom Royalty Splits</li>
                                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-primary"/>API Access</li>
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
              <h2 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">Loved by Artists Like You</h2>
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
              <h2 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">Frequently Asked Questions</h2>
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
                   Ready to Take Control of Your Music Career?
                </h2>
                <p className="max-w-[600px] mx-auto mt-4 mb-8 text-primary-foreground/80 md:text-xl">
                    Join hundreds of independent artists who trust VNDR for distribution, licensing, and royalties.
                </p>
                <Button asChild size="lg" className="font-bold bg-white text-primary hover:bg-gray-200">
                    <Link href="/login">Start Your 14-Day Free Trial</Link>
                </Button>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

    
