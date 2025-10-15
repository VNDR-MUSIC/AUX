
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { X, Home, Upload, Library, FileText, Gavel, Scale, DollarSign, Shield, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase';
import { useMemo } from 'react';

const authenticatedMenuItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/dashboard/upload', icon: Upload, label: 'Upload' },
  { href: '/dashboard/catalog', icon: Library, label: 'Catalog' },
  { href: '/dashboard/licensing', icon: FileText, label: 'Licensing' },
  { href: '/dashboard/auctions', icon: Gavel, label: 'Auctions' },
  { href: '/dashboard/reports', icon: BarChart, label: 'Reports' },
  { href: '/dashboard/legal-eagle', icon: Scale, label: 'Legal Eagle' },
];

const publicMenuItems = [
  { href: '/vsd-demo', icon: DollarSign, label: 'VSD Demo' },
];

const adminMenuItem = { href: '/admin', icon: Shield, label: 'Admin' };

const menuVariants = {
  hidden: {
    clipPath: 'circle(0% at 1.5rem 2rem)',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 40,
      duration: 0.5,
    },
  },
  visible: {
    clipPath: 'circle(150% at 1.5rem 2rem)',
    transition: {
      type: 'spring',
      stiffness: 20,
      restDelta: 2,
      duration: 0.7,
    },
  },
};

const navItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.3 + i * 0.1,
      type: 'spring',
      stiffness: 50,
    },
  }),
};

interface FullScreenNavProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function FullScreenNav({ isOpen, setIsOpen }: FullScreenNavProps) {
  const { user } = useUser();
  
  // Custom claims are on the user object, but we need to cast to any to access them
  // because the default User type doesn't include them.
  const isAdmin = (user as any)?.customClaims?.admin === true;

  const menuItems = useMemo(() => {
    let items = user ? [...authenticatedMenuItems] : [...publicMenuItems];
    if (user && isAdmin) {
      items.push(adminMenuItem);
    }
    return items;
  }, [user, isAdmin]);


  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={menuVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl h-screen w-screen"
        >
          <div className="container mx-auto h-full flex flex-col justify-center items-center">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
            <nav>
              <ul className="flex flex-col items-center gap-8">
                {menuItems.map((item, i) => (
                  <motion.li
                    key={item.href}
                    custom={i}
                    variants={navItemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <Link
                      href={item.href}
                      className="text-4xl font-headline font-bold text-muted-foreground transition-colors hover:text-foreground flex items-center gap-4"
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="h-8 w-8" />
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
