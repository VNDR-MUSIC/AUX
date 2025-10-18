
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
import { Music } from 'lucide-react';

interface SoundKlixModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SoundKlixModal({ isOpen, onClose }: SoundKlixModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card text-card-foreground">
        <DialogHeader>
          <div className="flex justify-center mb-4 relative h-20">
            <Image src="https://i.ibb.co/M53tfW4/6afe7afc-3816-4f85-a250-50819e0f1b00.png" alt="SoundKlix Logo" fill className="object-contain" />
          </div>
          <DialogTitle className="font-headline text-2xl text-center">SoundKlix</DialogTitle>
          <DialogDescription className="text-center">
            The streaming platform where indie artists share the main stage.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
            <p className="text-sm text-center text-muted-foreground">
                Upload your music, increase your visibility, and reach a wide audience. SoundKlix puts your music right next to mainstream artists, showcasing both without separation.
            </p>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button asChild>
            <Link href="https://soundklix.com" target="_blank" rel="noopener noreferrer">
              <Music className="mr-2 h-4 w-4" />
              Visit SoundKlix.com
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
