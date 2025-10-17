
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Upload, Search, DollarSign, ArrowRight, Music, Film, Gamepad2, Tv } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const howItWorksSteps = [
    {
        icon: <Upload className="h-10 w-10 text-primary" />,
        title: "1. Upload Your Music",
        description: "You create the music. Use our simple uploader to add your tracks to your personal catalog. It's free and unlimited.",
    },
    {
        icon: <Search className="h-10 w-10 text-primary" />,
        title: "2. We Find Opportunities",
        description: "Our team and AI listen to your music and find opportunities for it in movies, TV shows, video games, and advertisements.",
    },
    {
        icon: <DollarSign className="h-10 w-10 text-primary" />,
        title: "3. You Get Paid",
        description: "When your music is used, you earn money (royalties). We collect it for you and put it directly into your VNDR wallet.",
    },
];

const royaltyFaqs = [
  {
    question: "What is a 'Royalty'?",
    answer: "A royalty is a payment you receive when someone uses your music. Think of it like getting paid rent for your song. There are different types, but they all mean you're earning money from your creativity."
  },
  {
      question: "What is 'Sync Licensing'?",
      answer: "This is a fancy term for getting your music placed in visual media. When you hear a song in a Netflix show, a movie trailer, or a video game, that's a sync license. These are often the highest-paying opportunities for independent artists."
  },
  {
    question: "Do I keep the rights to my music?",
    answer: "Yes, absolutely. You always own 100% of your music and your master recordings. We just act as your partner to help you earn money from it. You are always in control."
  },
];


export default function Home2Page() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-6');

  return (
    <div className="flex flex-col min-h-screen bg-background/0 max-w-full overflow-x-hidden">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[70vh] w-full flex flex-col items-center justify-center p-0 overflow-hidden rounded-lg">
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
                    Turn Your Music Into Your Career.
                </h1>
                <p className="max-w-[700px] text-base sm:text-lg text-neutral-200 md:text-xl drop-shadow-lg">
                    Not sure how music licensing works? We make it simple. You make the music, we find the opportunities, you get paid.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                    <Button asChild size="lg" className="font-bold w-full sm:w-auto">
                        <Link href="/login">Start for Free <ArrowRight className="ml-2 h-5 w-5" /></Link>
                    </Button>
                </div>
            </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 md:py-24 bg-secondary w-full">
            <div className="container px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="font-headline text-3xl sm:text-4xl font-bold tracking-tighter">How It Works: A Simple Guide</h2>
                    <p className="max-w-[700px] mx-auto mt-4 text-muted-foreground md:text-lg">
                        Making money from your music has never been easier. Here's the plan in three simple steps.
                    </p>
                </div>
                <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
                    {howItWorksSteps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-md border">
                            {step.icon}
                            <h3 className="font-headline text-xl font-semibold mt-4 mb-2">{step.title}</h3>
                            <p className="text-muted-foreground text-sm">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

         {/* Use Cases Section */}
        <section className="py-16 md:py-24 w-full">
            <div className="container px-4 md:px-6">
                 <div className="text-center mb-12">
                    <h2 className="font-headline text-3xl sm:text-4xl font-bold tracking-tighter">Where Your Music Could Be Heard</h2>
                    <p className="max-w-[700px] mx-auto mt-4 text-muted-foreground md:text-lg">
                        We pitch your songs to music supervisors looking for the perfect track for their project.
                    </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div className="flex flex-col items-center p-4">
                        <Film className="h-12 w-12 text-primary"/>
                        <p className="mt-2 font-semibold">Independent Films</p>
                    </div>
                     <div className="flex flex-col items-center p-4">
                        <Tv className="h-12 w-12 text-primary"/>
                        <p className="mt-2 font-semibold">TV Shows & Series</p>
                    </div>
                     <div className="flex flex-col items-center p-4">
                        <Gamepad2 className="h-12 w-12 text-primary"/>
                        <p className="mt-2 font-semibold">Video Games</p>
                    </div>
                     <div className="flex flex-col items-center p-4">
                        <Music className="h-12 w-12 text-primary"/>
                        <p className="mt-2 font-semibold">Commercials & Ads</p>
                    </div>
                </div>
            </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-24 bg-secondary w-full">
            <div className="container max-w-3xl px-4 md:px-6">
                <div className="text-center mb-12">
                <h2 className="font-headline text-3xl sm:text-4xl font-bold tracking-tighter">Your Questions, Answered.</h2>
                 <p className="max-w-[700px] mx-auto mt-4 text-muted-foreground md:text-lg">
                    The music industry can be confusing. We believe in transparency.
                </p>
              </div>
              <Accordion type="single" collapsible className="w-full">
                {royaltyFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-base sm:text-lg font-semibold text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        
        {/* Final CTA Section */}
        <section className="py-16 md:py-24 bg-primary text-primary-foreground w-full">
            <div className="container text-center px-4">
                <h2 className="font-headline text-3xl sm:text-4xl font-bold tracking-tighter">
                    Ready to Start Your Music Career?
                </h2>
                <p className="max-w-[600px] mx-auto mt-4 mb-8 text-primary-foreground/80 md:text-lg">
                    No complicated contracts. No hidden fees. Just a partner to help you succeed. Sign up in minutes and upload your first track today.
                </p>
                <Button asChild size="lg" className="font-bold bg-white text-black hover:bg-gray-200">
                    <Link href="/login">Get Started Free</Link>
                </Button>
            </div>
        </section>
      </main>
    </div>
  );
}
