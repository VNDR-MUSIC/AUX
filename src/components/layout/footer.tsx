
'use client';

import Link from "next/link";
import { Icons } from "../icons";
import { useUser } from "@/firebase";
import { useState } from "react";
import Image from "next/image";
import IVtvModal from "./ivtv-modal";
import NDRadioModal from "./nd-radio-modal";
import AudioExchangeModal from "./audio-exchange-modal";
import MiuModal from "./miu-modal";
import { MapPin } from "lucide-react";

const socialLinks = [
    { name: "Twitter", href: "#" },
    { name: "Instagram", href: "#" },
    { name: "Facebook", href: "#" },
];

const companyLinks = [
    { name: "About", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Roadmap", href: "/roadmap" },
];

const artistLinks = [
    { name: "For Artists", href: "/dashboard" },
    { name: "Upload Music", href: "/dashboard/upload" },
    { name: "Licensing", href: "/dashboard/licensing" },
];

const adminLink = { name: "Admin", href: "/admin" };


export default function Footer() {
  const { user, isUserLoading } = useUser();
  const [isIvtvModalOpen, setIsIvtvModalOpen] = useState(false);
  const [isNdRadioModalOpen, setIsNdRadioModalOpen] = useState(false);
  const [isAudioExchangeModalOpen, setIsAudioExchangeModalOpen] = useState(false);
  const [isMiuModalOpen, setIsMiuModalOpen] = useState(false);
  const [isSoundKlixModalOpen, setIsSoundKlixModalOpen] = useState(false); // New state for SoundKlix
  const isAdmin = (user as any)?.customClaims?.admin === true;

  let finalArtistLinks = [...artistLinks];
  if(user && isAdmin) {
    finalArtistLinks.push(adminLink);
  }

  return (
    <>
    <footer className="bg-transparent border-t w-screen max-w-full">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            <div className="col-span-full sm:col-span-2 lg:col-span-1">
                <Link href="/" className="flex items-center gap-2">
                    <div className="relative h-20 w-40 sm:h-28 sm:w-56">
                        <Icons.logo />
                    </div>
                </Link>
                <p className="mt-4 text-sm text-muted-foreground">The future of music licensing and streaming.</p>
                 <div className="mt-4 text-xs text-muted-foreground space-y-1">
                    <p className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        <span>3110 1ST AVENUE NORTH SUITE 2M PMB 1122 ST, SAINT PETERSBURG, FL 33713</span>
                    </p>
                </div>
            </div>
            
            {!isUserLoading && user && (
              <div>
                  <h3 className="font-semibold text-foreground">For Artists</h3>
                  <ul className="mt-4 space-y-2">
                      {finalArtistLinks.map((link) => (
                          <li key={link.name}>
                              <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary">
                                  {link.name}
                              </Link>
                          </li>
                      ))}
                  </ul>
              </div>
            )}

            <div>
                <h3 className="font-semibold text-foreground">Company</h3>
                <ul className="mt-4 space-y-2">
                    {companyLinks.map((link) => (
                        <li key={link.name}>
                            <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary">
                                {link.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            
            <div>
                <h3 className="font-semibold text-foreground">Our Subsidiaries & Partners</h3>
                <div className="mt-4 grid grid-cols-3 gap-4 items-center">
                    <button onClick={() => setIsIvtvModalOpen(true)} className="cursor-pointer">
                        <Image src="https://i.ibb.co/FqwXfkL9/Screenshot-20250914-224236-Facebook.jpg" alt="IVtv Logo" width={100} height={50} className="object-contain" />
                    </button>
                    <button onClick={() => setIsNdRadioModalOpen(true)} className="cursor-pointer">
                        <Image src="https://i.ibb.co/4wvZ1Mzq/ND-Radio-transparent.png" alt="ND Radio Logo" width={100} height={50} className="object-contain" />
                    </button>
                     <button onClick={() => setIsAudioExchangeModalOpen(true)} className="cursor-pointer">
                        <Image src="https://i.ibb.co/fVjNMVpk/logo2.png" alt="Audio Exchange Logo" width={100} height={50} className="object-contain" />
                    </button>
                </div>
                 <div className="mt-4 grid grid-cols-2 gap-4 items-center">
                    <button onClick={() => setIsMiuModalOpen(true)} className="col-span-1 cursor-pointer">
                        <Image src="https://i.ibb.co/4gJqBfM8/MIU-logo-wt.png" alt="MIU Logo" width={100} height={50} className="object-contain" />
                    </button>
                    <button onClick={() => setIsSoundKlixModalOpen(true)} className="col-span-1 cursor-pointer">
                         <Image src="https://i.ibb.co/3yRj2Z4/Screenshot-20250909-234041-Chrome.jpg" alt="SoundKlix Logo" width={100} height={50} className="object-contain" />
                    </button>
                </div>
            </div>

            <div>
                <h3 className="font-semibold text-foreground">Connect</h3>
                <ul className="mt-4 space-y-2">
                    {socialLinks.map((link) => (
                        <li key={link.name}>
                            <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary">
                                {link.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} VNDR Music, Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
    <IVtvModal isOpen={isIvtvModalOpen} onClose={() => setIsIvtvModalOpen(false)} />
    <NDRadioModal isOpen={isNdRadioModalOpen} onClose={() => setIsNdRadioModalOpen(false)} />
    <AudioExchangeModal isOpen={isAudioExchangeModalOpen} onClose={() => setIsAudioExchangeModalOpen(false)} />
    <MiuModal isOpen={isMiuModalOpen} onClose={() => setIsMiuModalOpen(false)} />
    {/* SoundKlixModal would go here if it existed */}
    </>
  );
}
