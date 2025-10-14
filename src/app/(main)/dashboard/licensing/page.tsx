import Image from "next/image";
import { Button } from "@/components/ui/button";
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

export default function LicensingPage() {
  const headerImage = PlaceHolderImages.find(img => img.id === 'licensing-header');

  return (
    <div className="container mx-auto py-8">
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
          <form className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" placeholder="John Doe" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="john.doe@example.com" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="trackTitle">Track Title</Label>
                    <Input id="trackTitle" placeholder="e.g., Midnight Bloom" />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="artistName">Artist Name</Label>
                    <Input id="artistName" placeholder="e.g., Synthwave Samurai" />
                </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="usageType">Intended Use</Label>
              <Select>
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
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                placeholder="Briefly describe your project and how the track will be used."
                className="min-h-[120px]"
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit">Submit Request</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
