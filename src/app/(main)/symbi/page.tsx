
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Icons } from "@/components/icons";

export default function SymbiKnowlegebasePage() {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <header className="mb-12 text-center">
        <h1 className="font-headline text-5xl font-bold tracking-tighter">The VNDR Ecosystem</h1>
        <p className="mt-4 text-xl text-muted-foreground">A Complete Guide to the Autonomous Music Publishing Platform.</p>
      </header>
      
      <div className="space-y-12">
        
        {/* Section 1: Core Mission */}
        <section>
          <h2 className="font-headline text-3xl font-bold border-b pb-2 mb-4">Our Mission: Empowering the Independent Artist</h2>
          <p className="text-lg text-muted-foreground">
            The traditional music industry was built for major labels, not independent artists. It's often slow, confusing, and unfair. VNDR was created to change that. We are an autonomous music ecosystem designed to give independent artists the power, tools, and transparency of a major label, without the restrictive contracts. Our goal is to put artists in control of their careers and their earnings.
          </p>
        </section>

        {/* Section 2: Core Artist Plans */}
        <section>
          <h2 className="font-headline text-3xl font-bold border-b pb-2 mb-6">Artist Plans: Choose Your Path</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Distribution Plan</CardTitle>
                <CardDescription>Maximum Control & Royalties</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-bold text-2xl mb-2">Keep 90% of Royalties</p>
                <p className="text-sm text-muted-foreground">This plan is for artists who want to manage their own careers. You get unlimited music distribution to over 150 platforms like Spotify and Apple Music, and you keep the vast majority of your earnings. It's simple, powerful, and free to start.</p>
              </CardContent>
            </Card>
            <Card className="border-primary border-2">
              <CardHeader>
                <CardTitle>Publishing Partnership</CardTitle>
                <CardDescription>A True Partner for Growth</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-bold text-2xl mb-2">50/50 Publishing Split</p>
                <p className="text-sm text-muted-foreground">This plan is for artists who want a dedicated partner. We act as your publisher, actively pitching your music for high-value sync licensing deals in films, TV, games, and ads. We only succeed when you succeed.</p>
              </CardContent>
            </Card>
          </div>
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>AI Pro Add-on</CardTitle>
                <CardDescription>Supercharge any plan with a suite of creative and strategic tools.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">The AI Pro Toolkit gives you access to an entire creative team. You can generate unique cover art, get strategic recommendations, generate marketing copy, and receive simulated legal advice on industry topics. It’s an optional subscription for artists who want to accelerate their growth.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 3: The VSD Token Economy */}
        <section>
          <h2 className="font-headline text-3xl font-bold border-b pb-2 mb-4">The VSD Token Economy</h2>
          <div className="flex items-start gap-4">
            <Icons.vsd className="h-10 w-10 flex-shrink-0 mt-1"/>
            <div>
              <p className="text-lg text-muted-foreground">
                The VNDR ecosystem is powered by the VSD token, which comes in two forms:
              </p>
              <ul className="mt-4 space-y-4">
                <li>
                  <h4 className="font-semibold">VSD-lite Tokens</h4>
                  <p className="text-muted-foreground">Think of these as platform credits. You earn them for free just by being an active member (daily rewards) and when you sign up. You use VSD-lite to pay for platform services, like generating an AI Performance Report or consulting our Legal Eagle AI.</p>
                </li>
                <li>
                  <h4 className="font-semibold">VSD Tokens (ERC-20)</h4>
                  <p className="text-muted-foreground">This is the Web3 version of the token. It lives on a public blockchain, ensuring transparency. VSD tokens are used for high-value transactions, like buying and selling music rights on the Audio Exchange. Artists can convert their VSD-lite credits to VSD tokens when they connect a Web3 wallet.</p>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 4: Key Platform Features */}
        <section>
          <h2 className="font-headline text-3xl font-bold border-b pb-2 mb-4">Key Platform Features</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-xl">My Works & Upload</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                This is your personal catalog management hub. When you upload a new work, you provide the audio file and basic details. Our platform then begins an autonomous enrichment process. This includes analyzing the audio for features like key and BPM, identifying potential collaborators, and preparing it for publishing. You can track the status of each work, view its analytics, and manage its details from this page.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-xl">Music Catalog</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                The public Music Catalog is where anyone can discover music from all artists on the VNDR platform. It's a vast library that can be searched and filtered by genre, artist, and more. This is where music supervisors, filmmakers, and fans can find new tracks to license or enjoy.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-xl">Licensing Center</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                The Licensing Center is a two-way portal. Music supervisors and creators can come here to formally request a license to use a track in their project (e.g., a film, game, or advertisement). For artists, this is where you receive and manage those incoming requests. You can review the proposed use, and approve or reject the request.
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-4">
              <AccordionTrigger className="text-xl">Analytics & Reports</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                This feature allows artists to generate a comprehensive performance report for their entire catalog. For a small VSD-lite fee, our AI engine analyzes streaming data, listener engagement, and potential licensing value. The final report provides a summary, identifies top-performing works, offers audience insights, and gives strategic recommendations to help an artist grow.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-xl">Legal Eagle AI</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                Legal Eagle is an AI-powered simulated legal assistant. For a small VSD-lite fee, artists can ask general questions about complex music industry topics like copyright, publishing deals, royalties, and contracts. It provides educational information to help artists navigate the legal landscape, but always includes a disclaimer that it is not a substitute for advice from a qualified attorney.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
              <AccordionTrigger className="text-xl">Artist & Admin Dashboards</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                The Dashboard is the central hub for every user. For artists, it provides a snapshot of their VSD-lite balance, total works, and recent activity. It's where they can claim their daily token rewards and access key features. For administrators, the dashboard is a platform management tool, allowing them to view all works on the platform, manage subsidiary integrations, and oversee the health of the entire ecosystem.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Section 5: The Broader Ecosystem */}
        <section>
          <h2 className="font-headline text-3xl font-bold border-b pb-2 mb-4">The Broader Ecosystem</h2>
          <p className="text-lg text-muted-foreground mb-6">
            VNDR Music is the core of a larger network of interconnected platforms, all designed to support independent artists.
          </p>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Audio Exchange (AUDEX)</CardTitle>
                <CardDescription>The Marketplace for Music Rights</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">This is our dedicated marketplace for the financial side of music. Here, artists and investors can buy, sell, and trade tokenized music rights and royalties using VSD tokens. It's a transparent, secure platform for fractional ownership of music assets, including album NFTs.</p>
              </CardContent>
            </Card>
             <Card>
              <CardHeader>
                <CardTitle>Indie Videos TV (IVtv)</CardTitle>
                <CardDescription>A Streaming Network for Music Videos</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">IVtv is our subsidiary network where artists can upload and share their music videos with a global audience. It operates as a live-streaming channel, offering a platform for visual creativity to meet the screen.</p>
              </CardContent>
            </Card>
             <Card>
              <CardHeader>
                <CardTitle>ND Radio</CardTitle>
                <CardDescription>Live Radio for Independent Music</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">ND Radio is our partner radio station that streams music from independent artists. Tracks uploaded to the VNDR platform have the chance to be played on this live stream, providing another avenue for discovery. The VNDR platform monitors the radio's "now playing" feed to automatically track plays and attribute them to the correct artists in our system.</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
