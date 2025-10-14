'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Send, Share2, TrendingUp, Handshake } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { musoPartnershipChat } from '@/ai/flows/muso-partnership-flow';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import AnimatedGradientText from '@/components/animated-gradient-text';
import { Icons } from '@/components/icons';

interface Message {
  text: string;
  isUser: boolean;
}

const partnershipPoints = [
    {
        icon: <TrendingUp className="h-10 w-10 text-primary" />,
        title: "Access Real-Time Market Intelligence",
        description: "VNDR is a living ecosystem of emerging artists. Our platform generates invaluable, real-time data on track performance, fan engagement, and genre trends before they hit the mainstream. This is the ground-truth data that complements and validates Muso.AI's global analytics.",
    },
    {
        icon: <Share2 className="h-10 w-10 text-primary" />,
        title: "Create an Unbreakable Data Flywheel",
        description: "By integrating Muso.AI's verification into our AI-powered distribution and licensing tools, we create a powerful feedback loop. VNDR provides the raw, creative asset and its initial performance data; Muso.AI provides the verification and global tracking. Together, we build a dataset of unparalleled depth and accuracy.",
    },
     {
        icon: <Handshake className="h-10 w-10 text-primary" />,
        title: "Co-Develop the Future of Music-Tech",
        description: "This isn't just about data sharing; it's about co-creation. Imagine a joint suite of tools: AI-powered A&R that leverages both platforms' insights, royalty forecasting models built on verified data, and automated compliance for the rapidly growing UGC and AI-generated music space. We believe the opportunities are limitless.",
    },
]

export default function MusoPartnershipPage() {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello. We're intrigued by VNDR's artist-centric model. We've prepared some thoughts on a potential synergy between our platforms. Feel free to ask any questions or share your feedback.", isUser: false }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await musoPartnershipChat(input);
      const aiMessage: Message = { text: response, isUser: false };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Partnership chat error:", error);
      const errorMessage: Message = { text: "Our apologies. The AI assistant is currently unavailable. Please try again later.", isUser: false };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
        setTimeout(() => {
             if (scrollAreaRef.current) {
                const innerDiv = scrollAreaRef.current.querySelector('div');
                if (innerDiv) {
                    innerDiv.scrollTop = innerDiv.scrollHeight;
                }
            }
        }, 100);
    }
  }, [messages]);

  const symbiAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar-2');

  return (
    <div className="py-16 md:py-24">
        <section className="container text-center mb-24">
            <AnimatedGradientText>
                <h1 className="font-headline text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl">
                    The Future of Music Data is Collaborative
                </h1>
            </AnimatedGradientText>
            <p className="max-w-3xl mx-auto mt-6 text-muted-foreground md:text-xl">
                Muso.AI has created the industry's leading dataset for music ownership and credits. VNDR is building the next-generation ecosystem for artists to create, distribute, and monetize that music. We believe that by combining our strengths, we can build the most transparent, efficient, and powerful platform in music history.
            </p>
        </section>

        <section className="container mb-24">
            <div className="grid gap-8 md:grid-cols-3">
                 {partnershipPoints.map((point) => (
                    <div key={point.title} className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-md border">
                        {point.icon}
                        <h3 className="font-headline text-2xl font-semibold mt-4 mb-2">{point.title}</h3>
                        <p className="text-muted-foreground">{point.description}</p>
                    </div>
                ))}
            </div>
        </section>

        <section className="container flex justify-center">
             <Card className="w-full max-w-2xl h-full flex flex-col">
                <CardHeader>
                <CardTitle className="font-headline text-3xl">Let's Talk</CardTitle>
                <CardDescription>
                    This is a secure channel to our strategic AI assistant, Symbi. Ask questions, provide feedback, or explore the possibilities with us.
                </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4">
                    <ScrollArea className="h-[400px] w-full p-4 border rounded-lg" ref={scrollAreaRef}>
                        <div className="space-y-4">
                        {messages.map((message, index) => (
                            <div key={index} className={`flex items-start gap-3 ${message.isUser ? 'justify-end' : ''}`}>
                                {!message.isUser && (
                                    <Avatar>
                                        <Icons.logo className="h-10 w-10 text-primary p-1.5" />
                                    </Avatar>
                                )}
                                <div className={`p-3 rounded-lg max-w-sm ${message.isUser ? 'bg-secondary' : 'bg-muted'}`}>
                                    <p className="text-sm">{message.text}</p>
                                </div>
                                 {message.isUser && (
                                    <Avatar>
                                        <AvatarImage src="https://upload.wikimedia.org/wikipedia/commons/4/4d/Muso.AI_logo.png" alt="Muso.AI" />
                                        <AvatarFallback>M</AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        ))}
                        {isLoading && !messages[messages.length - 1].isUser && (
                            <div className="flex items-start gap-3">
                                <Avatar>
                                     <Icons.logo className="h-10 w-10 text-primary p-1.5" />
                                </Avatar>
                                <div className="bg-muted p-3 rounded-lg max-w-xs flex items-center">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                </div>
                            </div>
                        )}
                        </div>
                    </ScrollArea>
                </CardContent>
                <CardFooter>
                    <form onSubmit={handleSubmit} className="w-full flex items-center gap-2">
                        <Input placeholder="Ask about the partnership..." value={input} onChange={(e) => setInput(e.target.value)} disabled={isLoading} />
                        <Button type="submit" disabled={isLoading || !input.trim()}>
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        </Button>
                    </form>
                </CardFooter>
            </Card>
        </section>
    </div>
  );
}
