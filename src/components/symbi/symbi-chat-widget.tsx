'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader2 } from 'lucide-react';
import { symbiChat } from '@/ai/flows/symbi-chat-flow';
import { Icons } from '../icons';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { useUser } from '@/firebase';

interface Message {
  role: 'user' | 'model';
  content: string;
}

const initialMessage: Message = {
  role: 'model',
  content: "Hi! I'm Symbi, your AI assistant for VNDR Music. How can I help you grow your career today?",
};

const symbiVideoUrl = "https://adilo.bigcommand.com/a72bb922-ffa8-44d9-9d44-6ca122d078fc.mp4";

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

    const userMessage: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await symbiChat({ 
        userId: user.uid, 
        question: input,
        history: newMessages.slice(-5)
      });
      const aiMessage: Message = { role: 'model', content: response };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Symbi chat error:", error);
      const errorMessageText = "Sorry, I'm having trouble connecting right now. Please try again later.";
      const errorMessage: Message = { role: 'model', content: errorMessageText };
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
            className="rounded-full w-20 h-20 bg-transparent shadow-2xl hover:scale-110 transition-transform duration-300 p-0 overflow-hidden border-2 border-primary"
            aria-label="Open Symbi Chat"
          >
             <video
                src={symbiVideoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
             />
          </Button>
        </motion.div>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="end"
        className="w-80 sm:w-96 h-[60vh] p-0 rounded-xl shadow-2xl border-border/50 bg-transparent flex flex-col overflow-hidden"
        sideOffset={16}
      >
        <div className="absolute inset-0 z-0">
             <video
                src={symbiVideoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
             />
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
        </div>
        
        <div className="relative z-10 flex flex-col h-full">
            <header className="p-4 border-b border-border/50">
              <h3 className="font-headline text-lg font-semibold flex items-center gap-2 text-white">
                <div className="relative h-6 w-6">
                    <Icons.logo />
                </div>
                <span>Chat with Symbi</span>
              </h3>
            </header>

            <ScrollArea className="flex-1" ref={scrollAreaRef}>
              <div className="p-4 space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                    {message.role === 'model' && (
                      <Avatar className="h-8 w-8 bg-primary/20">
                         <AvatarFallback className="bg-transparent">
                            <div className="relative h-5 w-5"><Icons.logo /></div>
                         </AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`p-3 rounded-lg max-w-xs text-sm ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted/80'}`}>
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                    {message.role === 'user' && user && (
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
                    <div className="bg-muted/80 p-3 rounded-lg max-w-xs flex items-center">
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
                  className="bg-background/80 text-white"
                />
                <Button type="submit" size="icon" disabled={isLoading || !input.trim() || !user}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </form>
            </footer>
        </div>
      </PopoverContent>
    </Popover>
  );
}
