import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-coral text-white shadow-[0_16px_35px_rgba(255,122,26,0.25)] hover:-translate-y-0.5 hover:bg-[#ff8a35]",
        secondary: "bg-white text-ink shadow-[0_14px_28px_rgba(21,48,74,0.08)] hover:-translate-y-0.5 hover:bg-sky",
        outline: "border border-white/60 bg-white/20 text-white backdrop-blur hover:bg-white/28",
        ghost: "text-ink hover:bg-sky",
        sea: "bg-ocean text-white shadow-[0_16px_35px_rgba(15,142,164,0.22)] hover:bg-teal"
      },
      size: {
        default: "h-11 px-5",
        lg: "h-12 px-6 text-base",
        sm: "h-9 px-4"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
