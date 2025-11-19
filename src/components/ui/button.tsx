/* eslint-disable react-refresh/only-export-components */
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-base font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-[#007ACC] text-white hover:bg-[#005299] active:bg-[#003D73] shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all",
        destructive: "bg-[#DC2626] text-white hover:bg-[#B91C1C] active:bg-[#991B1B] shadow-md hover:shadow-lg",
        success: "bg-[#10B981] text-white hover:bg-[#059669] active:bg-[#047857] shadow-md hover:shadow-lg",
        outline: "border-2 border-[#007ACC] bg-white text-[#007ACC] hover:bg-[#F0F9FF] hover:border-[#005299] active:bg-[#E0F2FE] shadow-sm hover:shadow-md",
        secondary: "bg-[#0B3B69] text-white hover:bg-[#082D52] active:bg-[#05203B] shadow-md hover:shadow-lg transform hover:scale-[1.02]",
        ghost: "bg-transparent hover:bg-[#F0F9FF] hover:text-[#007ACC] active:bg-[#E0F2FE]",
        link: "text-[#007ACC] underline-offset-4 hover:underline hover:text-[#005299] active:text-[#003D73]",
        premium: "bg-[#007ACC] text-white border-2 border-[#E8E8E8]/30 hover:bg-[#005299] hover:border-[#E8E8E8]/50 shadow-lg hover:shadow-xl font-semibold",
        emergency: "bg-[#EF4444] text-white hover:bg-[#DC2626] active:bg-[#B91C1C] shadow-lg hover:shadow-xl font-semibold animate-pulse",
        phone: "bg-[#10B981] text-white hover:bg-[#059669] active:bg-[#047857] shadow-lg hover:shadow-xl font-semibold tracking-wide",
      },
      size: {
        default: "h-11 min-h-[44px] px-5 py-3 text-base",
        sm: "h-10 min-h-[40px] px-4 py-2 text-sm",
        lg: "h-12 min-h-[48px] px-6 py-3 text-base md:text-lg",
        xl: "h-14 min-h-[56px] px-8 py-4 text-lg md:text-xl",
        icon: "h-11 w-11 min-h-[44px] min-w-[44px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
