
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function SymbiKnowledgeBasePage() {
  return (
    <div className="container mx-auto py-8 prose prose-invert max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">
            VNDR Music Platform: Comprehensive Knowledge Base
          </CardTitle>
          <CardDescription>
            This document provides a complete overview of the features,
            services, and philosophy of the VNDR music platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h2 className="font-headline text-2xl">
              1. Core Mission & Philosophy
            </h2>
            <p>
              VNDR is a next-generation music platform designed to empower
              independent artists. Our mission is to dismantle the opaque and
              predatory practices of the traditional music industry by providing
              transparent, AI-powered tools for distribution, monetization, and
              career growth. We believe artists should have clear choices,
              control over their work, and direct access to their earnings.
            </p>
          </section>

          <section>
            <h2 className="font-headline text-2xl">
              2. Services for Artists & Creators
            </h2>

            <h3 className="font-headline text-xl mt-4">
              2.1 Music Distribution & Career Paths
            </h3>
            <p>
              VNDR offers two distinct career paths to fit the needs of any
              artist:
            </p>
            <ul>
              <li>
                <strong>Distribution Plan (90/10 Split):</strong> This plan is for
                artists who want maximum control. Artists get unlimited free
                distribution to over 150 platforms (including Spotify, Apple
                Music, etc.) and keep 90% of all royalties. This is one of the
                most generous splits in the industry.
              </li>
              <li>
                <strong>Publishing Partnership (50/50 Split):</strong> For
                artists seeking a dedicated partner, this plan turns VNDR into
                their publisher. In exchange for a 50/50 publishing split, our
                team and AI actively pitch the artist's music for high-value
                sync licensing deals in film, TV, games, and advertisements.
                The artist always retains 100% of their master rights.
              </li>
            </ul>

            <h3 className="font-headline text-xl mt-4">
              2.2 Monetization & Licensing
            </h3>
            <ul>
              <li>
                <strong>Direct Licensing Catalog:</strong> Artists can set a
                licensing price (in VSD tokens) for any track in their catalog,
                making it available for purchase by content creators,
                filmmakers, and other users directly through the platform.
              </li>
              <li>
                <strong>License Request Management:</strong> Artists have a
                dashboard to review, approve, or reject all incoming licensing
                requests for their music, giving them full control over how their
                work is used.
              </li>
              <li>
                <strong>Music Auctions (Coming Soon):</strong> A future feature
                will allow artists to auction the rights to their music,
                creating new revenue streams.
              </li>
            </ul>

            <h3 className="font-headline text-xl mt-4">
              2.3 VSD Token Economy
            </h3>
            <p>
              The VSD token is the native currency of the VNDR ecosystem,
              designed for transparency and utility.
            </p>
            <ul>
              <li>
                <strong>VSD Wallet:</strong> Every user has a built-in wallet
                to store and manage their VSD token balance.
              </li>
              <li>
                <strong>Daily Token Rewards:</strong> To encourage engagement
                and reward community members, artists can claim 5 free VSD
                tokens every day.
              </li>
              <li>
                <strong>Utility & Governance:</strong> VSD tokens are used to
                pay for premium AI services (like Legal Eagle) and will be used
                in the future for bidding in auctions and other platform
                governance features.
              </li>
              <li>
                <strong>Transparent Royalties:</strong> The system is built to
                provide a clear, verifiable ledger of all streams, sales, and
                licensing deals, with instant royalty payouts to the artist's
                VSD wallet.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-headline text-2xl">
              3. AI-Powered "VNDR Pro" Toolkit
            </h2>
            <p>
              Our suite of generative AI and analytical tools gives artists the
              power of a major label team, available 24/7.
            </p>
            <ul>
              <li>
                <strong>AI Cover Art Generation:</strong> Automatically
                generate unique, high-quality cover art based on a track's
                genre, title, and description.
              </li>
              <li>
                <strong>AI Licensing Price Recommendation:</strong> An AI tool
                that analyzes market data and track characteristics to suggest
                a competitive licensing price in VSD tokens.
              </li>
              <li>
                <strong>AI-Powered Music Recommendations:</strong> An intelligent
                engine that helps listeners discover new music, getting artists'
                tracks to the right ears.
              </li>
              <li>
                <strong>Symbi AI Assistant:</strong> A general-purpose AI
                chatbot (powered by this knowledge base) to help users navigate
                the platform and understand its features.
              </li>
              <li>
                <strong>Legal Eagle (Simulated Legal Adviser):</strong> A
                specialized AI chatbot that answers general, educational
                questions about entertainment law topics like copyright,
                contracts, and publishing for a small VSD token fee.
              </li>
               <li>
                <strong>Advanced Analytics Reports:</strong> For a small VSD token fee,
                artists can generate in-depth analytical reports about their
                track performance, listener demographics, and royalty trends.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-headline text-2xl">
              4. Platform Features & User Experience
            </h2>
            <ul>
              <li>
                <strong>Full User Authentication:</strong> Secure sign-up and
                login system with email/password and Google social login.
              </li>
              <li>
                <strong>Artist & User Profiles:</strong> Public profiles for
                artists to showcase their work and for users to manage their
                settings.
              </li>
               <li>
                <strong>Spotify-Inspired Music Catalog:</strong> A redesigned main music page that emulates Spotify's award-winning, user-friendly interface. It features a clean, dark, grid-based layout that prioritizes high-quality cover art and provides a seamless browsing experience.
              </li>
              <li>
                <strong>Global Music Player:</strong> A persistent, site-wide
                audio player allows for continuous music discovery while browsing
                the platform.
              </li>
              <li>
                <strong>Interactive Onboarding Tour:</strong> A step-by-step
                guided tour (powered by Shepherd.js) that introduces new users
                to key features as they navigate the site for the first time.
              </li>
              <li>
                <strong>Notification Management:</strong> Granular control over
                in-app, email, and push notifications for various platform
                events.
              </li>
            </ul>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
