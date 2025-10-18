
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
import SoundKlixModal from "./soundklix-modal";
import { subsidiaries } from "@/lib/subsidiaries";

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
  const [isSoundKlixModalOpen, setIsSoundKlixModalOpen] = useState(false);
  const isAdmin = (user as any)?.customClaims?.admin === true;

  let finalArtistLinks = [...artistLinks];
  if(user && isAdmin) {
    finalArtistLinks.push(adminLink);
  }

  const ivtv = subsidiaries.find(s => s.id === 'ivtv');
  const ndradio = subsidiaries.find(s => s.id === 'vsd_network'); // This seems wrong, should be ndradio, but none exists
  const audex = subsidiaries.find(s => s.id === 'audio_exchange');
  const miu = subsidiaries.find(s => s.id === 'miu');
  const soundklix = subsidiaries.find(s => s.id === 'soundklix');


  return (
    <>
    <footer className="bg-transparent border-t w-screen max-w-full">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2 md:col-span-1">
                <Link href="/" className="flex items-center gap-2">
                    <div className="relative h-20 w-40 sm:h-28 sm:w-56">
                        <Icons.logo />
                    </div>
                </Link>
                 <div className="mt-4 text-xs text-muted-foreground space-y-1">
                    <p className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        <span>3110 1ST AVENUE NORTH SUITE 2M PMB 1122 ST, SAINT PETERSBURG, FL 33713</span>
                    </p>
                </div>
            </div>
            
            <div className="col-span-2 grid grid-cols-2 sm:grid-cols-4 md:col-span-4 gap-8">
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

                <div>
                    <h3 className="font-semibold text-foreground">Our Partners</h3>
                    <div className="mt-4 flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                            {ivtv && <button onClick={() => setIsIvtvModalOpen(true)} className="cursor-pointer relative h-10 w-10">
                                <Image src={ivtv.logoUrl} alt="IVtv Logo" fill className="object-contain" />
                            </button>}
                            <button onClick={() => setIsNdRadioModalOpen(true)} className="cursor-pointer relative h-10 w-10">
                                <Image src="https://i.ibb.co/4wvZ1Mzq/ND-Radio-transparent.png" alt="ND Radio Logo" fill className="object-contain" />
                            </button>
                             {audex && <button onClick={() => setIsAudioExchangeModalOpen(true)} className="cursor-pointer relative h-10 w-10">
                                <Image src={audex.logoUrl} alt="Audio Exchange Logo" fill className="object-contain" />
                            </button>}
                        </div>
                         <div className="flex items-center gap-4">
                            {miu && <button onClick={() => setIsMiuModalOpen(true)} className="flex justify-center items-center h-10 w-10 relative">
                                <Image src={miu.logoUrl} alt="MIU Logo" fill className="object-contain" />
                            </button>}
                            {soundklix && <button onClick={() => setIsSoundKlixModalOpen(true)} className="flex justify-center items-center h-10 w-10 relative">
                                 <Image src={soundklix.logoUrl} alt="SoundKlix Logo" fill className="object-contain" />
                            </button>}
                        </div>
                    </div>
                </div>
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
    <SoundKlixModal isOpen={isSoundKlixModalOpen} onClose={() => setIsSoundKlixModalOpen(false)} />
    </>
  );
}
