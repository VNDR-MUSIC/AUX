
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Gavel } from "lucide-react";

export default function AuctionsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">Music Auctions</h1>
        <p className="mt-2 text-muted-foreground">
          Auction the rights to your music or bid on tracks from other artists.
        </p>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Coming Soon!</CardTitle>
          <CardDescription>
            Our auction house is currently under construction. Soon you&apos;ll be able to
            participate in exciting auctions for music rights using your VSD tokens.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center py-16">
          <Gavel className="h-24 w-24 text-muted-foreground/50 mb-6" />
          <p className="text-lg font-semibold">The Auction Block is Being Polished</p>
          <p className="text-muted-foreground mt-2 max-w-md">
            Check back soon to discover a new way to invest in music and monetize your catalog.
          </p>
        </CardContent>
        <CardFooter className="justify-center">
            <Button disabled>Create New Auction</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
