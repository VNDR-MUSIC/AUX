
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

const heroSlides = [
  {
    id: 'hero-1',
    title: 'Discover Your Next Favorite Artist',
    description: 'Explore a universe of emerging and established musicians.',
    imageHint: 'concert crowd'
  },
  {
    id: 'hero-2',
    title: 'AI-Powered Curation',
    description: 'Let our intelligent engine craft the perfect playlist for your mood.',
    imageHint: 'abstract soundwave'
  },
  {
    id: 'hero-3',
    title: 'Seamless Music Licensing',
    description: 'Find and license the perfect track for your film, game, or project.',
    imageHint: 'audio production'
  },
  {
    id: 'hero-4',
    title: 'For Artists, By Artists',
    description: 'Monetize your art with transparent, blockchain-powered royalties.',
    imageHint: 'musician performance'
  },
  {
    id: 'hero-5',
    title: 'High-Fidelity Streaming',
    description: 'Experience music in lossless quality, the way it was meant to be heard.',
    imageHint: 'vinyl record'
  },
  {
    id: 'hero-6',
    title: 'Your Music, Everywhere',
    description: 'Take your library with you, from your desktop to your mobile device.',
    imageHint: 'person headphones'
  },
  {
    id: 'hero-7',
    title: 'The Future of Sound',
    description: 'Join the revolution in music creation, distribution, and appreciation.',
    imageHint: 'futuristic city'
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-0 overflow-hidden">
      <Carousel
        className="w-full h-screen"
        opts={{
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
      >
        <CarouselContent className="h-screen">
          {heroSlides.map((slide) => {
            const slideImage = PlaceHolderImages.find((img) => img.id === slide.id);
            return (
              <CarouselItem key={slide.id} className="relative w-full h-screen">
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
    </div>
  );
}
