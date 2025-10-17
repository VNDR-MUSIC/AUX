'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { GraduationCap, ChevronRight } from 'lucide-react';

export default function MiuSlideOut() {
  const [isOpen, setIsOpen] = useState(false);

  const variants = {
    closed: { x: '-90%' },
    open: { x: 0 },
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-1/2 -translate-y-1/2 left-0 z-40"
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        variants={variants}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        onHoverStart={() => setIsOpen(true)}
        onHoverEnd={() => setIsOpen(false)}
      >
        <div className="relative flex items-center">
            <div className="bg-card p-6 rounded-r-lg shadow-lg w-72 border-y border-r border-border">
                <div className="flex flex-col items-center text-center">
                    <div className="relative h-20 w-40 mb-4">
                        <Image src="https://i.ibb.co/4gJqBfM8/MIU-logo-wt.png" alt="MIU Logo" layout="fill" className="object-contain" />
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
            </div>
            <div className="w-8 h-24 bg-card rounded-r-full border-y border-r border-border flex items-center justify-center">
                <ChevronRight className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
