'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { GraduationCap } from 'lucide-react';

interface MiuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MiuModal({ isOpen, onClose }: MiuModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card text-card-foreground">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <Image src="https://i.ibb.co/4gJqBfM8/MIU-logo-wt.png" alt="Music Industry University Logo" width={150} height={75} className="object-contain" />
          </div>
          <DialogTitle className="font-headline text-2xl text-center">Music Industry University</DialogTitle>
          <DialogDescription className="text-center">
            Your partner in education for the modern music business.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
            <p className="text-sm text-center text-muted-foreground">
                MIU provides online courses, webinars, and resources designed to empower independent artists with the knowledge to succeed.
            </p>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button asChild>
            <Link href="https://musicindustry.university" target="_blank" rel="noopener noreferrer">
              <GraduationCap className="mr-2 h-4 w-4" />
              Visit MIU
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
