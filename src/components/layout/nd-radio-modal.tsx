
'use client';

import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import Image from 'next/image';

interface NDRadioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NDRadioModal({ isOpen, onClose }: NDRadioModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px] bg-card text-card-foreground">
        <DialogHeader>
          <div className="flex justify-center">
            <Image src="https://i.ibb.co/4wvZ1Mzq/ND-Radio-transparent.png" alt="ND Radio Logo" width={150} height={100} className="object-contain" />
          </div>
          <DialogTitle className="font-headline text-2xl text-center">Listen to ND Radio Live</DialogTitle>
          <DialogDescription className="text-center">
            Our official radio station partner. Discover new independent artists or get your music featured.
          </DialogDescription>
        </DialogHeader>
        <div className="aspect-video w-full bg-black">
          <iframe
            src="https://indieradio.live"
            className="w-full h-full"
            frameBorder="0"
            allow="autoplay"
            allowFullScreen
          ></iframe>
        </div>
        <DialogFooter className="sm:justify-between items-center gap-4">
           <p className="text-sm text-muted-foreground">
            Want your music on rotation?
          </p>
          <Button asChild>
            <Link href="https://indieradio.live" target="_blank" rel="noopener noreferrer">
              Submit Your Music
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
