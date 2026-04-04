import { cn } from "@/lib/utils";

export function Badge({ className, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-ocean/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-ocean",
        className
      )}
      {...props}
    />
  );
}
