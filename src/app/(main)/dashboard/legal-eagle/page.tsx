
'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Send, Gavel } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { legalEagleChat } from '@/ai/flows/legal-eagle-flow';
import { Icons } from '@/components/icons';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useOnboarding } from '@/hooks/use-onboarding';
import { useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

interface Message {
  text: string;
  isUser: boolean;
}

const initialMessage = `***DISCLAIMER: I am an AI simulation and not a real attorney. This information is for educational and entertainment purposes only and does not constitute legal advice. You should consult with a qualified attorney for advice regarding your individual situation.***

I am Symbi, your AI Legal Assistant. Ask me general questions about contracts, copyright, licensing, and more. Each query costs 1 VSD-lite.`;

export default function LegalEaglePage() {
  const [messages, setMessages] = useState<Message[]>([
    { text: initialMessage, isUser: false }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const { toast } = useToast();

  useOnboarding('legalEagle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !user) return;

    const userMessage: Message = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await legalEagleChat({ userId: user.uid, question: input });
      const aiMessage: Message = { text: response, isUser: false };
      setMessages(prev => [...prev, aiMessage]);
      toast({
        title: 'VSD-lite Deducted',
        description: '1 VSD-lite credit has been deducted for your query.',
      });
    } catch (error) {
      console.error("Legal Eagle chat error:", error);
      const errorMessageText = error instanceof Error ? error.message : "Sorry, I'm having trouble connecting right now. Please try again later.";
      const errorMessage: Message = { text: errorMessageText, isUser: false };
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

  return (
    <div className="container mx-auto py-8 flex h-[calc(100vh-10rem)] justify-center items-center">
      <Card className="w-full max-w-3xl h-full flex flex-col">
        <CardHeader className="text-center">
          <Gavel className="mx-auto h-12 w-12 text-primary" />
          <CardTitle className="font-headline text-3xl">Legal Eagle AI</CardTitle>
          <CardDescription>
            Your AI Legal Assistant for the Music Industry
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4">
            <ScrollArea className="h-[400px] w-full p-4 border rounded-lg" ref={scrollAreaRef}>
                <div className="space-y-4">
                   {messages.map((message, index) => (
                     <div key={index} className={`flex items-start gap-3 ${message.isUser ? 'justify-end' : ''}`}>
                        {!message.isUser && (
                            <Avatar>
                                <AvatarFallback>
                                    <div className="relative h-5 w-5"><Icons.logo /></div>
                                </AvatarFallback>
                            </Avatar>
                        )}
                        <div className={`p-3 rounded-lg max-w-lg ${message.isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                            {message.text.split('***').map((part, i) =>
                              i === 1 ? (
                                <Alert key={i} variant="destructive" className="bg-destructive/20 my-2">
                                  <AlertTitle className="font-bold">Disclaimer</AlertTitle>
                                  <AlertDescription className="text-destructive-foreground">{part}</AlertDescription>
                                </Alert>
                              ) : (
                                <p key={i} className="text-sm whitespace-pre-wrap">{part}</p>
                              )
                            )}
                        </div>
                        {message.isUser && (
                             <Avatar>
                                <AvatarFallback>You</AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                   ))}
                   {isLoading && (
                       <div className="flex items-start gap-3">
                           <Avatar>
                                <AvatarFallback>
                                    <div className="relative h-5 w-5"><Icons.logo /></div>
                                </AvatarFallback>
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
                <div className="relative flex-1">
                    <Input placeholder="Ask about copyright, splits, licensing..." value={input} onChange={(e) => setInput(e.target.value)} disabled={isLoading || !user} />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground flex items-center gap-1">
                        1 <Link href="/dashboard/wallet" rel="noopener noreferrer"><Icons.vsd className="h-3 w-3"/></Link>
                    </div>
                </div>
                <Button type="submit" disabled={isLoading || !input.trim() || !user}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
            </form>
        </CardFooter>
      </Card>
    </div>
  );
}
