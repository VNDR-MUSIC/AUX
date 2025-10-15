
'use client';

import Link from "next/link";
import { Icons } from "../icons";
import { useUser, useFirebase, useDoc, useMemoFirebase } from "@/firebase";
import { useState } from "react";
import Image from "next/image";
import IVtvModal from "./ivtv-modal";
import { doc } from "firebase/firestore";
import NDRadioModal from "./nd-radio-modal";

const socialLinks = [
    { name: "Twitter", href: "#" },
    { name: "Instagram", href: "#" },
    { name: "Facebook", href: "#" },
];

const legalLinks = [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
];

const companyLinks = [
    { name: "About", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Careers", href: "#" },
];

const artistLinks = [
    { name: "For Artists", href: "/dashboard" },
    { name: "Upload Music", href: "/dashboard/upload" },
    { name: "Licensing", href: "/dashboard/licensing" },
];

const adminLink = { name: "Admin", href: "/admin" };


export default function Footer() {
  const { user } = useUser();
  const { firestore } = useFirebase();
  const [isIvtvModalOpen, setIsIvtvModalOpen] = useState(false);
  const [isNdRadioModalOpen, setIsNdRadioModalOpen] = useState(false);

  const adminRef = useMemoFirebase(() => (firestore && user ? doc(firestore, `roles_admin/${user.uid}`) : null), [firestore, user]);
  const { data: adminDoc } = useDoc(adminRef);
  const isAdmin = !!adminDoc;

  let finalArtistLinks = [...artistLinks];
  if(user && isAdmin) {
    finalArtistLinks.push(adminLink);
  }

  return (
    <>
    <footer className="bg-transparent border-t">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            <div className="col-span-2 lg:col-span-1">
                <Link href="/" className="flex items-center gap-2">
                    <div className="relative h-28 w-56">
                        <Icons.logo />
                    </div>
                </Link>
                <p className="mt-4 text-sm text-muted-foreground">The future of music licensing and streaming.</p>
                 <div className="mt-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsIvtvModalOpen(true)} className="cursor-pointer">
                            <Image src="https://i.ibb.co/FqwXfkL9/Screenshot-20250914-224236-Facebook.jpg" alt="IVtv Logo" width={75} height={50} />
                        </button>
                         <button onClick={() => setIsNdRadioModalOpen(true)} className="cursor-pointer">
                            <Image src="https://i.ibb.co/4wvZ1Mzq/ND-Radio-transparent.png" alt="ND Radio Logo" width={90} height={50} />
                        </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        Video and audio streaming by our subsidiaries.
                    </p>
                </div>
            </div>
            
            {user && (
              <div>
                  <h3 className="font-semibold text-xl text-foreground">For Artists</h3>
                  <ul className="mt-4 space-y-2">
                      {finalArtistLinks.map((link) => (
                          <li key={link.name}>
                              <Link href={link.href} className="text-lg text-muted-foreground hover:text-primary">
                                  {link.name}
                              </Link>
                          </li>
                      ))}
                  </ul>
              </div>
            )}

            <div>
                <h3 className="font-semibold text-xl text-foreground">Company</h3>
                <ul className="mt-4 space-y-2">
                    {companyLinks.map((link) => (
                        <li key={link.name}>
                            <Link href={link.href} className="text-lg text-muted-foreground hover:text-primary">
                                {link.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            
            <div>
                <h3 className="font-semibold text-xl text-foreground">Legal</h3>
                <ul className="mt-4 space-y-2">
                    {legalLinks.map((link) => (
                        <li key={link.name}>
                            <Link href={link.href} className="text-lg text-muted-foreground hover:text-primary">
                                {link.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h3 className="font-semibold text-xl text-foreground">Connect</h3>
                <ul className="mt-4 space-y-2">
                    {socialLinks.map((link) => (
                        <li key={link.name}>
                            <Link href={link.href} className="text-lg text-muted-foreground hover:text-primary">
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
    </>
  );
}
