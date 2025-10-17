
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { GraduationCap, X } from 'lucide-react';

const panelVariants = {
  hidden: { x: '-100%' },
  visible: { x: 0 },
};

export default function MiuSlideOut() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Clickable Logo Tab - always visible when panel is closed */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ x: -48, rotate: 0 }}
            animate={{
              rotate: [0, -5, 5, -5, 0],
            }}
            exit={{ x: -80 }}
            transition={{
              rotate: {
                duration: 5,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'loop',
              },
            }}
            onClick={() => setIsOpen(true)}
            className="fixed top-1/2 -translate-y-1/2 left-0 z-40 h-32 w-24 cursor-pointer group"
            aria-label="Open Music Industry University panel"
          >
            <div className="relative w-full h-full flex items-center justify-end">
              <div className="relative w-20 h-20 transition-transform duration-300 group-hover:scale-105">
                <Image 
                    src="https://i.ibb.co/4gJqBfM8/MIU-logo-wt.png" 
                    alt="MIU Logo" 
                    layout="fill" 
                    className="object-contain" 
                  />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide-out Content Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Content */}
            <motion.div
              className="fixed top-0 left-0 h-full w-72 bg-card border-r border-border shadow-2xl flex flex-col p-6"
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)} 
                className="absolute top-4 right-4"
              >
                <X className="h-5 w-5" />
              </Button>
              
              <div className="flex flex-col items-center text-center mt-8">
                <div className="relative h-32 w-64 mb-4">
                  <Image 
                    src="https://i.ibb.co/4gJqBfM8/MIU-logo-wt.png" 
                    alt="MIU Logo" 
                    layout="fill" 
                    className="object-contain" 
                  />
                </div>
                <h3 className="font-headline text-lg font-semibold">Music Industry University</h3>
                <p className="text-sm text-muted-foreground mt-2 mb-6">
                  Master the business of music with courses and resources from industry experts.
                </p>
                <Button asChild size="sm" className="w-full">
                  <Link href="https://musicindustry.university" target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)}>
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Explore Courses
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
