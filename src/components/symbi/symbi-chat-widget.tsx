
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader2, Bot } from 'lucide-react';
import { symbiChat } from '@/ai/flows/symbi-chat-flow';
import { Icons } from '../icons';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { useUser } from '@/firebase';

interface Message {
  text: string;
  isUser: boolean;
}

const initialMessage: Message = {
  text: "Hi! I'm Symbi, your AI assistant for VNDR Music. How can I help you grow your career today?",
  isUser: false,
};

export default function SymbiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !user) return;

    const userMessage: Message = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Pass both userId and the question to the flow
      const response = await symbiChat({ userId: user.uid, question: input });
      const aiMessage: Message = { text: response, isUser: false };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Symbi chat error:", error);
      const errorMessageText = "Sorry, I'm having trouble connecting right now. Please try again later.";
      const errorMessage: Message = { text: errorMessageText, isUser: false };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
        setTimeout(() => {
             const innerDiv = scrollAreaRef.current.querySelector('div');
                if (innerDiv) {
                    innerDiv.scrollTop = innerDiv.scrollHeight;
                }
        }, 100);
    }
  }, [messages]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <motion.div
          initial={{ scale: 0, y: 100 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1 }}
          className="fixed bottom-24 right-6 z-50"
        >
          <Button
            size="icon"
            className="rounded-full w-16 h-16 bg-primary/80 backdrop-blur-lg shadow-2xl hover:bg-primary"
            aria-label="Open Symbi Chat"
          >
            <div className="relative h-10 w-10">
              <Icons.logo />
            </div>
          </Button>
        </motion.div>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="end"
        className="w-80 sm:w-96 h-[60vh] p-0 rounded-xl shadow-2xl border-border/50 bg-card/80 backdrop-blur-xl flex flex-col"
        sideOffset={16}
      >
        <header className="p-4 border-b border-border/50">
          <h3 className="font-headline text-lg font-semibold flex items-center gap-2">
            <div className="relative h-6 w-6">
                <Icons.logo />
            </div>
            <span>Chat with Symbi</span>
          </h3>
        </header>

        <ScrollArea className="flex-1" ref={scrollAreaRef}>
          <div className="p-4 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex items-start gap-3 ${message.isUser ? 'justify-end' : ''}`}>
                {!message.isUser && (
                  <Avatar className="h-8 w-8 bg-primary/20">
                     <AvatarFallback className="bg-transparent">
                        <div className="relative h-5 w-5"><Icons.logo /></div>
                     </AvatarFallback>
                  </Avatar>
                )}
                <div className={`p-3 rounded-lg max-w-xs text-sm ${message.isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  <p className="whitespace-pre-wrap">{message.text}</p>
                </div>
                {message.isUser && user && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8 bg-primary/20">
                    <AvatarFallback className="bg-transparent">
                        <div className="relative h-5 w-5"><Icons.logo /></div>
                    </AvatarFallback>
                </Avatar>
                <div className="bg-muted p-3 rounded-lg max-w-xs flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <footer className="p-4 border-t border-border/50">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
              placeholder="Ask about your tracks..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={isLoading || !user}
              autoComplete="off"
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim() || !user}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </footer>
      </PopoverContent>
    </Popover>
  );
}
