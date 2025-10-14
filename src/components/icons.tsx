import { type SVGProps } from "react";
import Image from "next/image";

export const Icons = {
  logo: (props: Omit<React.ComponentProps<typeof Image>, 'src' | 'alt'>) => (
     <Image
      src="https://i.ibb.co/YTD4s8wv/Generated-Image-October-14-2025-5-35-PM-1-2.jpg"
      alt="VNDR Logo"
      width={24}
      height={24}
      {...props}
    />
  ),
  vsd: (props: Omit<React.ComponentProps<typeof Image>, 'src' | 'alt'>) => (
     <Image
      src="https://i.ibb.co/Kpg55CcY/Adobe-Express-20250422-1254090-1.png"
      alt="VSD Token"
      width={24}
      height={24}
      {...props}
    />
  ),
};
