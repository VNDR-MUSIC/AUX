
import Link from "next/link";
import { Icons } from "../icons";
import AnimatedGradientText from "../animated-gradient-text";

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

export default function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            <div className="col-span-2 lg:col-span-1">
                <Link href="/" className="flex items-center gap-2">
                    <Icons.logo className="h-8 w-8 text-primary" />
                    <span className="font-headline text-2xl font-bold">
                        <AnimatedGradientText>VNDR</AnimatedGradientText>
                    </span>
                </Link>
                <p className="mt-4 text-sm text-muted-foreground">The future of music licensing and streaming.</p>
            </div>
            
            <div>
                <h3 className="font-semibold text-foreground">For Artists</h3>
                <ul className="mt-4 space-y-2">
                    {artistLinks.map((link) => (
                        <li key={link.name}>
                            <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary">
                                {link.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

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
                <h3 className="font-semibold text-foreground">Legal</h3>
                <ul className="mt-4 space-y-2">
                    {legalLinks.map((link) => (
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
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} VNDR Music, Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
