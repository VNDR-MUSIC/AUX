
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

interface AudioExchangeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AudioExchangeModal({ isOpen, onClose }: AudioExchangeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card text-card-foreground">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <Image src="https://i.ibb.co/fVjNMVpk/logo2.png" alt="Audio Exchange Logo" width={150} height={75} className="object-contain" />
          </div>
          <DialogTitle className="font-headline text-2xl text-center">Audio.Exchange</DialogTitle>
          <DialogDescription className="text-center">
            The premier marketplace for buying, selling, and trading music rights and royalties.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
            <p className="text-sm text-center text-muted-foreground">
                Powered by the VNDR ecosystem, Audio.Exchange provides a transparent and secure platform for artists and investors to trade in the value of music.
            </p>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button asChild>
            <Link href="https://audio.exchange" target="_blank" rel="noopener noreferrer">
              Visit Audio.Exchange
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
