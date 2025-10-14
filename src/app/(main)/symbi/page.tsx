'use client';

import { useState, useActionState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { symbiChat } from '@/ai/flows/symbi-chat-flow';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface Message {
  text: string;
  isUser: boolean;
}

export default function SymbiPage() {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! I'm Symbi, your AI assistant. Ask me anything about the VNDR platform, music licensing, or how our AI tools can help you grow.", isUser: false }
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
      const response = await symbiChat(input);
      const aiMessage: Message = { text: response, isUser: false };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Symbi chat error:", error);
      const errorMessage: Message = { text: "Sorry, I'm having trouble connecting right now. Please try again later.", isUser: false };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
        // A slight delay to allow the new message to render
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
    <div className="container mx-auto py-8 flex h-[calc(100vh-10rem)] justify-center items-center">
      <Card className="w-full max-w-2xl h-full flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Symbi Chat</CardTitle>
          <CardDescription>
            Your AI assistant for all things VNDR. Ask me about features, royalties, or get career advice.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4">
            <ScrollArea className="h-[400px] w-full p-4 border rounded-lg" ref={scrollAreaRef}>
                <div className="space-y-4">
                   {messages.map((message, index) => (
                     <div key={index} className={`flex items-start gap-3 ${message.isUser ? 'justify-end' : ''}`}>
                        {!message.isUser && (
                            <Avatar>
                                {symbiAvatar && <AvatarImage src={symbiAvatar.imageUrl} alt="Symbi" />}
                                <AvatarFallback>AI</AvatarFallback>
                            </Avatar>
                        )}
                        <div className={`p-3 rounded-lg max-w-sm ${message.isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                            <p className="text-sm">{message.text}</p>
                        </div>
                        {message.isUser && (
                             <Avatar>
                                <AvatarFallback>You</AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                   ))}
                   {isLoading && !messages[messages.length - 1].isUser && (
                       <div className="flex items-start gap-3">
                           <Avatar>
                                {symbiAvatar && <AvatarImage src={symbiAvatar.imageUrl} alt="Symbi" />}
                                <AvatarFallback>AI</AvatarFallback>
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
                <Input placeholder="Ask Symbi a question..." value={input} onChange={(e) => setInput(e.target.value)} disabled={isLoading} />
                <Button type="submit" disabled={isLoading || !input.trim()}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
            </form>
        </CardFooter>
      </Card>
    </div>
  );
}
