
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { GraduationCap, X, BookOpen, Cpu, Network } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const panelVariants = {
  hidden: { x: '-100%' },
  visible: { x: 0 },
};

export default function MiuSlideOut() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            onClick={() => setIsOpen(true)}
            className="fixed top-1/2 -translate-y-1/2 -left-16 z-40 h-32 w-32 cursor-pointer group"
            aria-label="Open Music Industry University panel"
            initial={{ rotate: 0 }}
            animate={{
              rotate: [0, -5, 5, -5, 0],
            }}
            transition={{
              rotate: {
                duration: 5,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'loop',
              },
            }}
          >
            <div className="relative w-full h-full flex items-center justify-end">
              <div className="relative w-32 h-32 transition-transform duration-300 group-hover:scale-105">
                <Image 
                    src="https://i.ibb.co/4gJqBfM8/MIU-logo-wt.png" 
                    alt="MIU Logo" 
                    fill 
                    className="object-contain" 
                  />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              className="fixed top-0 left-0 h-full w-full max-w-sm bg-card border-r border-border shadow-2xl flex flex-col"
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="flex items-center justify-between p-4 border-b">
                 <div className="relative h-20 w-full">
                  <Image 
                    src="https://i.ibb.co/4gJqBfM8/MIU-logo-wt.png" 
                    alt="MIU Logo" 
                    fill 
                    className="object-contain" 
                  />
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsOpen(false)} 
                  className="absolute top-2 right-2"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-6 text-sm">
                  <h3 className="font-headline text-lg font-semibold">Music Industry University</h3>
                  <p className="text-primary font-semibold text-sm">"An Unfair Advantage in the Music Industry."</p>
                  <p className="text-muted-foreground mt-2 mb-6">
                    An accredited, multi-disciplinary university for the modern artist, empowering you to build, own, and control your empire.
                  </p>

                  <Accordion type="single" collapsible defaultValue="item-1">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="font-semibold text-base">
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4"/> Foundational Mastery
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <p>The year-long syllabus, "Operation: Deconstructing the Machine," starts with mastering ownership, protection, and hidden revenue streams.</p>
                        <div>
                          <h4 className="font-bold">Operation: The Artist's Code</h4>
                          <p className="text-muted-foreground">Master financial literacy, build discipline, and develop a growth mindset.</p>
                        </div>
                        <div>
                          <h4 className="font-bold">Operation: Paper Trail</h4>
                          <p className="text-muted-foreground">Protect your IP with timestamps, chain of custody, and blockchain registration.</p>
                        </div>
                         <div>
                          <h4 className="font-bold">Operation: Monetize the Shadows</h4>
                          <p className="text-muted-foreground">Learn direct sync licensing and YouTube monetization without middlemen.</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                       <AccordionTrigger className="font-semibold text-base">
                         <div className="flex items-center gap-2">
                            <Cpu className="h-4 w-4"/> AI-Powered Tools
                        </div>
                       </AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li><span className="font-semibold text-foreground">Contract Analysis:</span> Deconstruct legal jargon and find predatory clauses.</li>
                            <li><span className="font-semibold text-foreground">Revenue Diversification:</span> Build multiple income streams beyond streaming.</li>
                            <li><span className="font-semibold text-foreground">Social Media Analysis:</span> Predict post impact and align with your brand.</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-3" className="border-b-0">
                       <AccordionTrigger className="font-semibold text-base">
                        <div className="flex items-center gap-2">
                            <Network className="h-4 w-4"/> Exclusive Network & D2C
                        </div>
                       </AccordionTrigger>
                      <AccordionContent>
                         <p className="text-muted-foreground">Gain access to a vetted community of artists and pros, and master Direct-to-Consumer (D2C) sales to bypass traditional gatekeepers.</p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </ScrollArea>
              
              <div className="p-6 mt-auto border-t">
                 <Button asChild size="lg" className="w-full">
                  <Link href="https://musicindustry.university" target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)}>
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Explore the Full Curriculum
                  </Link>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
