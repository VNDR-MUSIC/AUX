
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
import { subsidiaries } from '@/lib/subsidiaries';

interface SoundKlixModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SoundKlixModal({ isOpen, onClose }: SoundKlixModalProps) {
  const soundklix = subsidiaries.find(s => s.id === 'soundklix');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card text-card-foreground">
        <DialogHeader>
          <div className="flex justify-center mb-4 relative h-20">
            {soundklix && <Image src={soundklix.logoUrl} alt="SoundKlix Logo" fill className="object-contain" />}
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
