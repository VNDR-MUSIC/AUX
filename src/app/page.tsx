import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Icons } from "@/components/icons";
import AnimatedGradientText from "@/components/animated-gradient-text";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 to-transparent to-70% dark:from-primary/5" />
      <div className="container relative z-10 flex flex-col items-center justify-center gap-6 text-center">
        <div className={cn(
          "h-24 w-24 rounded-2xl p-2",
          "bg-gradient-to-r from-[#8A2BE2] via-[#FF69B4] to-[#FF0000]",
          "animate-gradient-animation bg-[length:200%_200%]"
        )}>
          <div className="flex h-full w-full items-center justify-center rounded-lg bg-background">
            <Icons.logo className="h-12 w-12 text-primary" />
          </div>
        </div>

        <h1 className="font-headline text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl">
          <AnimatedGradientText>VNDR Music</AnimatedGradientText>
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground md:text-xl">
          The future of music is here. Stream, license, and monetize your art with the power of AI and blockchain technology.
        </p>
        <div className="flex gap-4">
          <Button asChild size="lg" className="font-bold">
            <Link href="/login">Get Started</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="font-bold">
            <Link href="/dashboard">Explore Now</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
