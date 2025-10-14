
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
import { Award, Music, Sparkles, Waves } from 'lucide-react';
import LandingPageHeader from '@/components/layout/landing-page-header';
import Footer from '@/components/layout/footer';

const heroSlides = [
  {
    id: 'hero-1',
    title: 'Discover Your Next Favorite Artist',
    description: 'Explore a universe of emerging and established musicians.',
    imageHint: 'music concert'
  },
  {
    id: 'hero-2',
    title: 'AI-Powered Curation',
    description: 'Let our intelligent engine craft the perfect playlist for your mood.',
    imageHint: 'audio soundwave'
  },
  {
    id: 'hero-3',
    title: 'Seamless Music Licensing',
    description: 'Find and license the perfect track for your film, game, or project.',
    imageHint: 'audio production'
  },
];

const features = [
    {
        icon: <Sparkles className="h-10 w-10 text-primary" />,
        title: "AI-Powered Curation",
        description: "Our intelligent engine crafts personalized playlists that match your mood, taste, and listening habits.",
    },
    {
        icon: <Award className="h-10 w-10 text-primary" />,
        title: "Seamless Licensing",
        description: "Find and license the perfect track for your film, game, or project with our straightforward, artist-friendly platform.",
    },
    {
        icon: <Icons.vsd className="h-10 w-10 text-primary" />,
        title: "Blockchain Royalties",
        description: "We leverage the power of VSD tokens to ensure transparent, fair, and instant royalty payments for artists.",
    },
    {
        icon: <Waves className="h-10 w-10 text-primary" />,
        title: "High-Fidelity Streaming",
        description: "Experience music in lossless quality, the way it was meant to be heard, on all your devices.",
    }
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <LandingPageHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[60vh] md:h-[80vh] w-full flex flex-col items-center justify-center p-0 overflow-hidden">
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
                            <div className="flex gap-4">
                            <Button asChild size="lg" className="font-bold">
                                <Link href="/login">Get Started</Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="font-bold bg-transparent text-white border-white hover:bg-white hover:text-primary">
                                <Link href="/dashboard">Explore Now</Link>
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
        <section className="py-16 md:py-24 bg-secondary">
            <div className="container px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">The Future of Sound is Here</h2>
                    <p className="max-w-[700px] mx-auto mt-4 text-muted-foreground md:text-xl">
                        VNDR is more than a streaming service. It's a comprehensive ecosystem for artists and fans.
                    </p>
                </div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature, index) => (
                        <div key={index} className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-md">
                            {feature.icon}
                            <h3 className="font-headline text-2xl font-semibold mt-4 mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 md:py-24">
            <div className="container text-center">
                <h2 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">
                   <AnimatedGradientText>Join the Revolution</AnimatedGradientText>
                </h2>
                <p className="max-w-[600px] mx-auto mt-4 mb-8 text-muted-foreground md:text-xl">
                    Ready to experience the next wave of music? Sign up today and unlock a new world of sound.
                </p>
                <Button asChild size="lg" className="font-bold">
                    <Link href="/login">Sign Up for Free</Link>
                </Button>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
