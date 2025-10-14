import { cn } from "@/lib/utils";
import React, { type FC, type HTMLAttributes } from "react";

interface AnimatedGradientTextProps extends HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

const AnimatedGradientText: FC<AnimatedGradientTextProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <span
      className={cn(
        "bg-gradient-to-r from-[#8A2BE2] via-[#FF69B4] to-[#FF0000] bg-clip-text text-transparent",
        "animate-gradient-animation bg-[length:200%_200%]",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default AnimatedGradientText;
