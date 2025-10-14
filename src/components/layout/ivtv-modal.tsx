
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

interface IVtvModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function IVtvModal({ isOpen, onClose }: IVtvModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px] bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Welcome to IVtv (Indie Videos TV)</DialogTitle>
          <DialogDescription>
            Our subsidiary network where creativity meets the screen. Anyone can upload and share their music videos with a global audience.
          </DialogDescription>
        </DialogHeader>
        <div className="aspect-video w-full">
          <iframe
            src="https://player.viloud.tv/embed/channel/2968a991e17f1c819af7785fa4ee6654?autoplay=1&volume=0.5&controls=1&title=1&share=1&open_playlist=0&random=0"
            className="w-full h-full"
            frameBorder="0"
            allow="autoplay"
            allowFullScreen
          ></iframe>
        </div>
        <DialogFooter className="sm:justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Visit the full network at{' '}
            <Link href="https://indievideos.tv" target="_blank" rel="noopener noreferrer" className="text-primary underline">
              indievideos.tv
            </Link>
          </p>
          <Button asChild>
            <Link href="https://indievideos.tv/upload" target="_blank" rel="noopener noreferrer">
              Upload Your Video
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
