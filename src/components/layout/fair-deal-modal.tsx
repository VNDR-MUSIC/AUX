
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import Link from 'next/link';

interface FairDealModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Using a reliable, neutral source to explain royalty splits.
const articleUrl = "https://support.tunecore.com/hc/en-us/articles/115006501107-What-s-the-difference-between-master-and-publishing-royalties";

export default function FairDealModal({ isOpen, onClose }: FairDealModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="font-headline text-2xl">Understanding Royalty Splits</DialogTitle>
          <DialogDescription>
            We believe in transparency. This is a third-party article from TuneCore that explains how music royalties generally work.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 px-6">
            <iframe
                src={articleUrl}
                title="Understanding Royalty Splits"
                className="w-full h-full border rounded-md"
            />
        </div>
        <DialogFooter className="p-6 pt-0 sm:justify-between items-center gap-2">
            <p className="text-xs text-muted-foreground">
                You are viewing a third-party website.
            </p>
          <Button type="button" variant="secondary" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
