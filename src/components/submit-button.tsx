
'use client';

import { useFormStatus } from 'react-dom';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';

interface SubmitButtonProps {
    buttonText: string;
    loadingText?: string;
}

export default function SubmitButton({ buttonText, loadingText = "Submitting..." }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        buttonText
      )}
    </Button>
  );
}
