
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { GraduationCap, ChevronLeft, ChevronRight } from 'lucide-react';

export default function MiuSlideOut() {
  const [isOpen, setIsOpen] = useState(false);

  const variants = {
    closed: { x: '-240px' }, // Width of content (288px) minus visible area (48px)
    open: { x: 0 },
  };

  return (
    <motion.div
      className="fixed top-1/2 -translate-y-1/2 left-0 z-40"
      initial="closed"
      animate={isOpen ? 'open' : 'closed'}
      variants={variants}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
    >
      <div className="relative flex items-center">
        {/* Main Content Box */}
        <div className="bg-card p-6 rounded-r-lg shadow-lg w-72 border-y border-r border-border flex flex-col items-center text-center">
          <div className="relative h-20 w-40 mb-4">
            <Image 
              src="https://i.ibb.co/4gJqBfM8/MIU-logo-wt.png" 
              alt="MIU Logo" 
              layout="fill" 
              className="object-contain" 
            />
          </div>
          <h3 className="font-headline text-lg font-semibold">Music Industry University</h3>
          <p className="text-sm text-muted-foreground mt-2 mb-4">
            Master the business of music with courses and resources from industry experts.
          </p>
          <Button asChild size="sm" className="w-full">
            <Link href="https://musicindustry.university" target="_blank" rel="noopener noreferrer">
              <GraduationCap className="mr-2 h-4 w-4" />
              Explore Courses
            </Link>
          </Button>
        </div>

        {/* Clickable Tab Handle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-full h-24 w-12 bg-card rounded-r-lg border-y border-r border-border flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
          aria-label={isOpen ? 'Close MIU tab' : 'Open MIU tab'}
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
    </motion.div>
  );
}
