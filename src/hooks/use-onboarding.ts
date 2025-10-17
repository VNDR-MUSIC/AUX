
'use client';

import { useEffect, useContext } from 'react';
import Shepherd from 'shepherd.js';
import { useUser, useDoc, useMemoFirebase } from '@/firebase';
import { doc, DocumentData } from 'firebase/firestore';
import { useFirebase } from '@/firebase/provider';
import { completeOnboardingStepAction } from '@/app/actions/user';

type OnboardingStep =
  | 'dashboard'
  | 'upload'
  | 'catalog'
  | 'licensing'
  | 'auctions'
  | 'legalEagle'
  | 'settings';

const tourSteps: Record<OnboardingStep, Shepherd.Step.StepOptions[]> = {
  dashboard: [
    {
      id: 'dashboard-welcome',
      title: 'Welcome to Your Dashboard!',
      text: 'This is your mission control. Here you can see an overview of your tracks, claim daily VSD tokens, and access our AI growth tools.',
      attachTo: { element: '[href="/dashboard"]', on: 'right' },
      buttons: [{ text: 'Next', action: () => Shepherd.activeTour?.next() }],
    },
    {
      id: 'dashboard-upload-cta',
      title: 'Upload Your Music',
      text: "Ready to get started? Use this button to upload your first track. We'll guide you through that process too.",
      attachTo: { element: 'a[href="/dashboard/upload"]', on: 'bottom' },
      buttons: [
        { text: 'Back', action: () => Shepherd.activeTour?.back(), secondary: true },
        { text: 'Next', action: () => Shepherd.activeTour?.next() },
      ],
    },
    {
      id: 'dashboard-vsd-wallet',
      title: 'Your VSD Wallet',
      text: 'This is your VSD token balance. You get free tokens daily just for being a member! Use them for AI tools or other platform features.',
      attachTo: { element: '.font-headline:contains("VSD Token Wallet")', on: 'top' },
      buttons: [
        { text: 'Back', action: () => Shepherd.activeTour?.back(), secondary: true },
        { text: 'Finish', action: () => Shepherd.activeTour?.complete() },
      ],
    },
  ],
  upload: [
    {
      id: 'upload-details',
      title: 'Track Details',
      text: 'Start by filling in your track title, artist name, and genre. This information is crucial for discovery and for our AI tools.',
      attachTo: { element: '#trackTitle', on: 'bottom' },
      buttons: [{ text: 'Next', action: () => Shepherd.activeTour?.next() }],
    },
    {
      id: 'upload-ai-art',
      title: 'AI Cover Art',
      text: 'No cover art? No problem. Once you fill in the title and genre, click here to generate unique, AI-powered cover art for your track.',
      attachTo: { element: 'form#cover-art-form + button', on: 'left' },
      buttons: [
        { text: 'Back', action: () => Shepherd.activeTour?.back(), secondary: true },
        { text: 'Next', action: () => Shepherd.activeTour?.next() },
      ],
    },
    {
      id: 'upload-pricing',
      title: 'Set Your Price',
      text: "Decide if you want to set your own licensing price or get a recommendation from our AI. You can always change this later.",
      attachTo: { element: '[role="radiogroup"]', on: 'top' },
      buttons: [
        { text: 'Back', action: () => Shepherd.activeTour?.back(), secondary: true },
        { text: 'Finish', action: () => Shepherd.activeTour?.complete() },
      ],
    },
  ],
  catalog: [
    {
      id: 'catalog-search',
      title: 'Discover Music',
      text: 'This is the main catalog where you can find music from all artists on the platform. Use the search and filter tools to find exactly what you need.',
      attachTo: { element: 'input[type="search"]', on: 'bottom' },
      buttons: [{ text: 'Got it!', action: () => Shepherd.activeTour?.complete() }],
    }
  ],
  licensing: [
     {
      id: 'licensing-tabs',
      title: 'Licensing Center',
      text: 'Here you can create a new request to license a track, or manage incoming requests for your own music.',
      attachTo: { element: '[role="tablist"]', on: 'bottom' },
      buttons: [{ text: 'Got it!', action: () => Shepherd.activeTour?.complete() }],
    }
  ],
   auctions: [
     // This tour is intentionally empty.
  ],
  legalEagle: [
     // This tour is intentionally empty.
  ],
  settings: [
     // This tour is intentionally empty.
  ],
};

export function useOnboarding(step: OnboardingStep) {
  const { user } = useUser();
  const { firestore } = useFirebase();
  const userRef = useMemoFirebase(() => (firestore && user ? doc(firestore, 'users', user.uid) : null), [firestore, user]);
  const { data: userData } = useDoc<{onboardingCompleted?: Record<OnboardingStep, boolean>}>(userRef);

  useEffect(() => {
    if (userData && user && userData.onboardingCompleted && userData.onboardingCompleted[step] === false) {
      
      const stepsForTour = tourSteps[step];
      if (stepsForTour.length === 0) {
        // If there are no steps, just mark as complete and do nothing.
        completeOnboardingStepAction(user.uid, step);
        return;
      }

      const tour = new Shepherd.Tour({
        useModalOverlay: true,
        defaultStepOptions: {
          classes: 'shadow-md bg-background',
          scrollTo: true,
        },
      });

      tour.addSteps(stepsForTour);
      
      tour.on('complete', () => {
        completeOnboardingStepAction(user.uid, step);
      });
      
      tour.on('cancel', () => {
         completeOnboardingStepAction(user.uid, step);
      });

      // A delay to ensure the page elements are rendered
      setTimeout(() => tour.start(), 500);

    }
  }, [userData, user, step]);
}
