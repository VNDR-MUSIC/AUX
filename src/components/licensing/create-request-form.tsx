
'use client';

import Image from "next/image";
import { useActionState } from "react";
import { useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { submitLicenseRequestAction } from "@/app/actions/music";
import { useToast } from "@/hooks/use-toast";
import SubmitButton from "@/components/submit-button";
import { useUser } from "@/firebase";

const initialState = {
  message: null,
  errors: {},
};

export default function CreateLicenseRequestForm() {
  const { user } = useUser();
  const [state, formAction] = useActionState(submitLicenseRequestAction, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  
  const headerImage = PlaceHolderImages.find(img => img.id === 'licensing-header');

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.errors ? "Error" : "Success!",
        description: state.message,
        variant: state.errors ? "destructive" : "default",
      });
      if (!state.errors) {
        formRef.current?.reset();
      }
    }
  }, [state, toast]);

  return (
    <Card>
      {headerImage && (
          <div className="relative h-48 w-full">
            <Image
              src={headerImage.imageUrl}
              alt={headerImage.description}
              fill
              className="object-cover rounded-t-lg"
              data-ai-hint={headerImage.imageHint}
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        )}
      <CardHeader className="relative pt-8">
        <CardTitle className="font-headline text-3xl">Create Licensing Request</CardTitle>
        <CardDescription>
          Request a license to use a track in your project. Fill out the form below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="grid gap-6">
           <input type="hidden" name="requestorId" value={user?.uid || ''} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" name="fullName" placeholder="John Doe" />
              {state.errors?.fullName && <p className="text-sm text-destructive">{state.errors.fullName[0]}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" placeholder="john.doe@example.com" />
              {state.errors?.email && <p className="text-sm text-destructive">{state.errors.email[0]}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid gap-2">
                  <Label htmlFor="trackTitle">Track Title</Label>
                  <Input id="trackTitle" name="trackTitle" placeholder="e.g., Midnight Bloom" />
                  {state.errors?.trackTitle && <p className="text-sm text-destructive">{state.errors.trackTitle[0]}</p>}
              </div>
              <div className="grid gap-2">
                  <Label htmlFor="artistName">Artist Name</Label>
                  <Input id="artistName" name="artistName" placeholder="e.g., Synthwave Samurai" />
                   {state.errors?.artistName && <p className="text-sm text-destructive">{state.errors.artistName[0]}</p>}
              </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="usageType">Intended Use</Label>
            <Select name="usageType">
              <SelectTrigger id="usageType">
                <SelectValue placeholder="Select usage type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="film">Film/Television</SelectItem>
                <SelectItem value="advertisement">Advertisement</SelectItem>
                <SelectItem value="game">Video Game</SelectItem>
                <SelectItem value="youtube">YouTube/Social Media</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
             {state.errors?.usageType && <p className="text-sm text-destructive">{state.errors.usageType[0]}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Project Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Briefly describe your project and how the track will be used."
              className="min-h-[120px]"
            />
            {state.errors?.description && <p className="text-sm text-destructive">{state.errors.description[0]}</p>}
          </div>
          {state.errors?._form && <p className="text-sm text-destructive">{state.errors._form[0]}</p>}
          <div className="flex justify-end">
              <SubmitButton buttonText="Submit Request" />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
