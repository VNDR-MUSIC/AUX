import { type SVGProps } from "react";
import Image from "next/image";

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
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
